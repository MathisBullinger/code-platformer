import * as PIXI from 'pixi.js'
import { Vec2D } from './math'
import { Graphics } from './graphics'
import { Movable } from './game_object'
import { game_config } from './game_config'
import { Keyboard as key } from './interaction'
import { Bow } from './weapons/bow'

class Player extends Movable {
  constructor(pos = new Vec2D(0, 0), scale = new Vec2D(0.7, 1.3)) {
    super(pos, scale)
    this._move_acc = game_config.player_move_acc
    this._move_vel = game_config.player_move_vel
    this.graphic = Graphics.CreateRectangle(this.pos.x, this.pos.y, scale.x, scale.y, 0xFFEEEE)
    this._last_jump = new Date().getTime()
    this._jump_timeout = 500
    this._jump_vel = 10
    this.has_ground_contact = false
    this.jump_counter = 0

    // Create weapon holster
    // This will later be more useful for rotating the weapon around the player
    this._weapon_holster = new PIXI.Container()
    this._weapon_holster.position.set(scale.x / 2, scale.y * 0.66667)
    this.graphic.addChild(this._weapon_holster)

    // Create weapon
    this._weapon = new Bow()
    this._weapon_holster.addChild(this._weapon.graphic)
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

  //
  // Move
  //
  Move(dir, dt) {
    this.vel.x += this._move_acc * (dir == 'right' ? 1 : -1) * (dt / 1000)
    if (Math.abs(this.vel.x) > this._move_vel)
      this.vel.x = this._move_vel * (this.vel.x > 0 ? 1 : -1)
  }

  //
  // Jump
  //
  Jump() {
    const now = new Date().getTime()
    // If jump timeout not reached => don't jump
    if (now - this._last_jump < this._jump_timeout) return
    // jump_counter >= 2 => player has already jumped twice
    if (this.jump_counter >= 2) return
    this._last_jump = now
    this.vel.y = this._jump_vel
    // On jump has never ground contact. Also increase jump counter
    this.hasGroundContact = false
    this.jump_counter += 1
  }
}

export { Player }
