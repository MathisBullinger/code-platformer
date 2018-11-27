import { Vec2D } from './math'
import { Graphics } from './graphics'

class GameObject {
  constructor(pos = new Vec2D(0, 0), scale = new Vec2D(1, 1)) {
    this.pos = pos
    this.graphic = Graphics.CreateRectangle(this.pos.x, this.pos.y, scale.x, scale.y)
  }
}

class Movable extends GameObject {
  constructor(pos = new Vec2D(0, 0), scale = new Vec2D(1, 1)) {
    super(pos, scale)
    this.vel = new Vec2D(0, 0)
  }

  Update(dt) {
    this.pos.x += this.vel.x * (dt / 1000)
    this.graphic.position = this.pos.toPixiPoint()
  }
}

export { GameObject, Movable }
