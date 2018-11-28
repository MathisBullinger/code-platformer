import { Vec2D } from './math'
import { Graphics } from './graphics'
import { GameObject, Movable } from './game_object'
import { game_config } from './game_config'
import { Keyboard as key } from './interaction'

class Player extends Movable {
  constructor(pos = new Vec2D(0, 0), scale = new Vec2D(0.7, 1.3)) {
    super(pos, scale)
    this._move_acc = game_config.player_move_acc
    this._move_vel = game_config.player_move_vel
    this.graphic = Graphics.CreateRectangle(this.pos.x, this.pos.y, scale.x, scale.y, 0xFFEEEE)
    this._last_jump = new Date().getTime()
    this._jump_timeout = 500
    this._jump_vel = 10
    this.hasCollision = false
    this._jump_counter = 0
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
    if (this.hasCollision) {
      this._jump_counter = 0
    }
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

  Jump(dt) {
    const now = new Date().getTime()
    if (now - this._last_jump < this._jump_timeout) return
    if (this._jump_counter % 3 === 2) return
    this._last_jump = now
    this.vel.y = this._jump_vel
    this.hasCollision = false
    this._jump_counter += 1
  }
}

export { Player }
