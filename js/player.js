import * as PIXI from 'pixi.js'
import { Vec2D } from './math'
import { Graphics } from './graphics'
import { Movable } from './game_object'
import { game_config as conf } from './game_config'
import { Bow } from './weapons'

class Player extends Movable {

  /*
   * Constructor
   */
  constructor(number, input, pos = new Vec2D(0, 0), scale = new Vec2D(0.7, 1.3)) {
    super(pos, scale)
    if (process.env.NODE_ENV === 'development') console.log('spawn player at ', pos)
    this._player_number = number
    this._player_number = Player.counter
    Player.counter++
    this._move_acc = conf.player_move_acc
    this._move_vel = conf.player_move_vel
    this.graphic = Graphics.CreateRectangle(this.pos.x, this.pos.y, scale.x, scale.y, 0xFFEEEE)
    this._last_jump = new Date().getTime()
    this._jump_vel = conf.gravity ? Math.sqrt(2) * Math.sqrt(conf.gravity) * Math.sqrt(conf.player_jump_height) : 0.5
    this.has_ground_contact = false
    this.jump_counter = 0
    this._mass = 30
    this._score = 0

    // Create weapon holster
    // This will later be more useful for rotating the weapon around the player
    this._weapon_holster = new PIXI.Container()
    this._weapon_holster.position.set(scale.x / 2, scale.y * (2 / 3))
    this.graphic.addChild(this._weapon_holster)

    // player health
    this._hp_total = conf.player_hp
    this._hp_current = this._hp_total
    this._alive = true

    this._dashing = false
    this._dash_time = conf.player_dash_time
    this._dash_vel = conf.player_dash_vel
    this._move_dir = null

    if (input) {
      this._input = input
      this._input.Init(this)
    }
  }

  /**
   * Update
   */
  Update(dt) {
    // slow down if not moving or dashing
    if (!this._moved && !this._dashing) {
      this._move_dir = null
      if (Math.abs(this.vel.x) > 0.0001)
        this.vel.x /= 1 + (this._move_acc - 1) * (dt / 1000)
      else
        this.vel.x = 0
    }
    // dash
    if (this._dashing) {
      const dir = this._move_dir == 'right' ? 1 : -1
      if (new Date().getTime() - this._dash_start >= this._dash_time) {
        this._dashing = false
        this._last_dash = Date.now()
        this.vel.x = this._move_vel * dir
      }
      this.vel.x = this._dash_vel * dir
    }
    // Check if player can heal
    if (Date.now() - this._last_damage_taken > conf.healing.cooldown) {
      // Increase health until max health is reached
      this._hp_current = Math.min(this._hp_current + (conf.healing.amount_per_sec / 1000 * dt), this._hp_total)
      // If max => unset _last_damage_taken attribute
      if (this._hp_current >= this._hp_total) this._last_damage_taken = undefined
    }
    // If ground contact => reset jump counter
    if (this.has_ground_contact) this.jump_counter = 0
    // Shoot when mouse down
    if (this._input) this._input.Update()
    // Update Weapon
    if (this._weapon) this._weapon.Update(this._input)
    super.Update(dt)
    this._moved = false
  }

  /**
   * Set the players weapon
   */
  SetWeapon(weapon) {
    if (process.env.NODE_ENV === 'development') console.log('picked up ' + weapon.constructor.name)
    // Remove the weapon
    if (this._weapon) {
      this._weapon_holster.removeChild(this._weapon.graphic)
      // If weapon was a bow, also remove the arrow indicator
      if (this._weapon.constructor === Bow) this.graphic.removeChild(this._weapon.arrow_indicator.graphic)
    }
    // Assign new weapon to attribute and the weapon holster
    this._weapon = weapon
    this._weapon.player = this
    this._weapon.paintWeapon(this._player_number)
    this._weapon_holster.addChild(this._weapon.graphic)
    // If new weapon is a bow, also add the arrow indicator
    if (this._weapon.constructor === Bow) this.graphic.addChild(this._weapon.arrow_indicator.graphic)
  }

  /**
   * Move
   */
  Move(dir, dt = -1) {
    if (dt == -1) console.error('call move with delta time!')
    this._moved = true
    this._move_dir = dir
    if (!this._alive || this._dashing) return
    this.vel.x += this._move_acc * (dir == 'right' ? 1 : -1) * (dt / 1000)
    if (Math.abs(this.vel.x) > this._move_vel)
      this.vel.x = this._move_vel * (this.vel.x > 0 ? 1 : -1)
  }

  MoveRight(dt) {
    this.Move('right', dt)
  }
  MoveLeft(dt) {
    this.Move('left', dt)
  }

  Dash() {
    if (!this._move_dir || (Date.now() - this._last_dash) <= conf.player_dash_cooldown) return
    this._dash_start = new Date().getTime()
    this._dashing = true
  }

  get player_number() {
    return this._player_number
  }

  get score() {
    return this._score
  }

  set score(score) {
    this._score = score
  }

  /**
   * Jump
   */
  Jump() {
    if (!this._alive) return
    const now = new Date().getTime()
    // jump_counter >= 2 => player has already jumped twice
    if (this.jump_counter >= 2) return
    this._last_jump = now
    this.vel.y = this._jump_vel
    // On jump has never ground contact. Also increase jump counter
    this.has_ground_contact = false
    this.jump_counter += 1
  }

  /*
   * Attack
   */
  Attack() {
    if (!this._weapon) return
    const recoil = Vec2D.Div(this._weapon.Shoot(), this._mass)
    this.vel = Vec2D.Add(this.vel, recoil)
  }

  /**
   * Damage Player Health
   */
  Damage(hp) {
    this._hp_current -= hp
    this._last_damage_taken = Date.now()
    if (this._hp_current <= 0)
      this.Die()
  }

  DamagePercent(hp) {
    this.Damage(hp / 100 * this._hp_total)
  }

  /*
   * Kill (cause and trigger on death)
   */
  Kill() {
    this._hp_current = 0
    this._alive = false
    this._last_damage_taken = undefined
    console.log('player died')
  }

  Die() { this.Kill() }

  get dead() {
    return !this._alive
  }

  get mass() {
    return this._mass
  }

  get health() {
    return this._hp_current
  }

  /*
   * Respawn
   */
  Respawn(spawn_pos) {
    if (!spawn_pos) return
    setTimeout(() => {
      console.log('respawn player', spawn_pos)
      this._alive = true
      this._hp_current = this._hp_total
      this.pos.Set(spawn_pos.x, spawn_pos.y)
      this.vel.Set(0, 0)
    }, conf.respawn_time)
  }
}
Player.counter = 0

export { Player }
