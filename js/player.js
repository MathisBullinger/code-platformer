import * as PIXI from 'pixi.js'
import { Vec2D } from './math'
import { Graphics } from './graphics'
import { Movable } from './game_object'
import { game_config } from './game_config'
import { Keyboard as key } from './interaction'
import { Bow } from './weapons/bow'
import { Gun } from './weapons/gun'

class Player extends Movable {
  constructor(pos = new Vec2D(0, 0), scale = new Vec2D(0.7, 1.3)) {
    super(pos, scale)
    this._move_acc = game_config.player_move_acc
    this._move_vel = game_config.player_move_vel
    this.graphic = Graphics.CreateRectangle(this.pos.x, this.pos.y, scale.x, scale.y, 0xFFEEEE)
    this._last_jump = new Date().getTime()
    this._jump_timeout = 500
    this._jump_vel = 12
    this.has_ground_contact = false
    this.jump_counter = 0

    // Create weapon holster
    // This will later be more useful for rotating the weapon around the player
    this._weapon_holster = new PIXI.Container()
    this._weapon_holster.position.set(scale.x / 2, scale.y * 0.66667) // 0.6667 because I want the holster to be at 2/3 of the player height
    this.graphic.addChild(this._weapon_holster)

    // Create weapon
    this._weapon = new Bow()
    this._weapon_holster.addChild(this._weapon.graphic)

    // player health
    this._hp_total = 100
    this._hp_current = this._health_total
    this._alive = true
  }

  //
  // Update
  //
  Update(dt) {
    if (key.IsDown('ArrowRight') || key.IsDown('ArrowLeft')) {
      const dir = key.IsDown('ArrowRight') ? 'right' : 'left'
      this.Move(dir, dt)
    } else {
      if (Math.abs(this.vel.x) > 0.0001)
        this.vel.x /= 1 + (this._move_acc - 1) * (dt / 1000)
      else
        this.vel.x = 0
    }
    if (key.IsDown('ArrowUp')) {
      this.Jump(dt)
    }
    // If ground contact => reset jump counter
    if (this.has_ground_contact) this.jump_counter = 0
    // Update Weapon
    this._weapon.Update(dt)
    super.Update(dt)
  }

  SetWeapon(weapon) {
    this._weapon_holster.removeChild(this._weapon.graphic)
    this._weapon = weapon
    this._weapon_holster.addChild(this._weapon.graphic)
  }

  //
  // Move
  //
  Move(dir, dt) {
    if (!this._alive) return
    this.vel.x += this._move_acc * (dir == 'right' ? 1 : -1) * (dt / 1000)
    if (Math.abs(this.vel.x) > this._move_vel)
      this.vel.x = this._move_vel * (this.vel.x > 0 ? 1 : -1)
  }

  //
  // Jump
  //
  Jump() {
    if (!this._alive) return
    const now = new Date().getTime()
    // If jump timeout not reached => don't jump
    if (now - this._last_jump < this._jump_timeout) return
    // jump_counter >= 2 => player has already jumped twice
    if (this.jump_counter >= 2) return
    this._last_jump = now
    this.vel.y = this._jump_vel
    // On jump has never ground contact. Also increase jump counter
    this.has_ground_contact = false
    this.jump_counter += 1
  }

  /*
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

  /*
   * Respawn
   */
  Respawn() {
    console.log('respawn player')
    this._alive = true
    this._hp_current = this._hp_total
    this.pos.Set(5.1, 3) // replace with proper spawn system
    this.vel.Set(0, 0)
  }
}

export { Player }
