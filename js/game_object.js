import { Vec2D } from './math'
import { Graphics } from './graphics'

class GameObject {
  constructor(pos = new Vec2D(0, 0), scale = new Vec2D(1, 1)) {
    this.pos = pos
    this.scale = scale
    this.graphic = Graphics.CreateRectangle(this.pos.x, this.pos.y, scale.x, scale.y)
  }

  get x() {
    return this.pos.x
  }
  get y() {
    return this.pos.y
  }
  get width() {
    return this.scale.x
  }
  get height() {
    return this.scale.y
  }
}

class Movable extends GameObject {
  constructor(pos = new Vec2D(0, 0), scale = new Vec2D(1, 1)) {
    super(pos, scale)
    this.vel = new Vec2D(0, 0)
  }

  Update(dt) {
    this.pos = Vec2D.add(this.pos, Vec2D.mult(this.vel, dt / 1000))
    this.graphic.position = this.pos.toPixiPoint()
  }
}

export { GameObject, Movable }
