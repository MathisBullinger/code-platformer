import * as PIXI from 'pixi.js'
import { Vec2D } from './math'
import { Graphics } from './graphics'
import { Movable } from './game_object'
import { game_config as conf } from './game_config'
import { Keyboard as key, Gamepad, Mouse } from './interaction'
import { Bow } from './weapons/bow'
import { Gun } from './weapons/gun'

class Player extends Movable {

  /*
   * Constructor
   */
  constructor(pos = new Vec2D(0, 0), scale = new Vec2D(0.7, 1.3)) {
    console.log('spawn player at ', pos)
    super(pos, scale)
    this._move_acc = conf.player_move_acc
    this._move_vel = conf.player_move_vel
    this.graphic = Graphics.CreateRectangle(this.pos.x, this.pos.y, scale.x, scale.y, 0xFFEEEE)
    this._last_jump = new Date().getTime()
    this._jump_vel = conf.gravity ? Math.sqrt(2) * Math.sqrt(conf.gravity) * Math.sqrt(conf.player_jump_height) : 0.5
    this.has_ground_contact = false
    this.jump_counter = 0
    this._mass = 30

    // Create weapon holster
    // This will later be more useful for rotating the weapon around the player
    this._weapon_holster = new PIXI.Container()
    this._weapon_holster.position.set(scale.x / 2, scale.y * 0.66667) // 0.6667 because I want the holster to be at 2/3 of the player height
    this.graphic.addChild(this._weapon_holster)

    // Create weapon
    this._weapon = Math.round(Math.random()) ? new Gun() : new Bow()
    this._weapon_holster.addChild(this._weapon.graphic)
    // If weapon is a bow, add the remaing arrows indicator
    if (this._weapon.constructor === Bow) this.graphic.addChild(this._weapon.arrow_indicator.graphic)

    // player health
    this._hp_total = conf.player_hp
    this._hp_current = this._health_total
    this._alive = true

    this._dashing = false
    this._dash_time = conf.player_dash_time
    this._dash_vel = conf.player_dash_vel
    this._move_dir = null

    // bind keys
    key.BindKey('a', dt => this.MoveLeft(dt))
    key.BindKey('ArrowLeft', dt => this.MoveLeft(dt))
    key.BindKey('d', dt => this.MoveRight(dt))
    key.BindKey('ArrowRight', dt => this.MoveRight(dt))
    key.BindKey('w', dt => this.Jump(dt), true)
    key.BindKey('ArrowUp', dt => this.Jump(dt), true)
    key.BindKey('Shift', () => this.Dash(), true)

    // bind gamepad actions
    Gamepad.BindInput('stick_left_x', (dt, value) => {
      if (value > 0) this.MoveRight(dt)
      else this.MoveLeft(dt)
    })
    Gamepad.BindInput('A', dt => this.Jump(dt), true)
    Gamepad.BindInput('LB', dt => this.Jump(dt), true)
    Gamepad.BindInput('RB', () => this.Attack())
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
        this.vel.x = this._move_vel * dir
      }
      this.vel.x = this._dash_vel * dir
    }
    // If ground contact => reset jump counter
    if (this.has_ground_contact) this.jump_counter = 0
    // Shoot when mouse down
    if (Mouse.IsDown()) this.Attack()
    // Update Weapon
    this._weapon.Update(dt, this)
    super.Update(dt)
    this._moved = false
  }

  /**
   * Set the players weapon
   */
  SetWeapon(weapon) {
    // Remove the weapon
    this._weapon_holster.removeChild(this._weapon.graphic)
    // If weapon was a bow, also remove the arrow indicator
    if (this._weapon.constructor === Bow) this.graphic.removeChild(this._weapon.arrow_indicator.graphic)
    // Assign new weapon to attribute and the weapon holster
    this._weapon = weapon
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
    if (!this._move_dir) return
    this._dash_start = new Date().getTime()
    this._dashing = true
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
    const recoil = Vec2D.Div(this._weapon.Shoot(), this._mass)
    this.vel = Vec2D.Add(this.vel, recoil)
  }

  /**
   * Damage Player Health
   */
  Damage(hp) {
    this._hp_current -= hp
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
    console.log('player died')
  }

  get dead() {
    return !this._alive
  }

  get mass() {
    return this._mass
  }

  /*
   * Respawn
   */
  Respawn(spawn_pos) {
    console.log('respawn player', spawn_pos)
    this._alive = true
    this._hp_current = this._hp_total
    this.pos.Set(spawn_pos.x, spawn_pos.y)
    this.vel.Set(0, 0)
  }
}

export { Player }
