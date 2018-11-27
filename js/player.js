import { Vec2D } from './math'
import { Graphics } from './graphics'
import { GameObject, Movable } from './game_object'
import { game_config } from './game_config'
import { Keyboard as key } from './interaction'

class Player extends Movable {
  constructor(pos = new Vec2D(0, 0), scale = new Vec2D(1, 1)) {
    super(pos, scale)
    this._move_acc = game_config.player_move_acc
    this._move_vel = game_config.player_move_vel
  }

  //
  // Update
  //
  Update(dt) {
    if (key.IsDown('ArrowRight') || key.IsDown('ArrowLeft')) {
      const dir = key.IsDown('ArrowRight') ? 'right' : 'left'
      this.Move(dir, dt)
    } else {
      if (Math.abs(this.vel.x) > 0.01)
        this.vel.x /= 1 + (this._move_acc - 1) * (dt / 1000)
      else
        this.vel.x = 0
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
}

export { Player }
