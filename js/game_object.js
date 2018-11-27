import { Vec2D } from './math'
import { Graphics } from './graphics'

class GameObject {
  constructor(pos = new Vec2D(0, 0), scale = new Vec2D(1, 1)) {
    this.position = pos
    this.graphic = Graphics.CreateRectangle(this.position.x, this.position.y, scale.x, scale.y)
  }
}

class Movable extends GameObject {
  constructor(pos = new Vec2D(0, 0), scale = new Vec2D(1, 1)) {
    super(pos, scale)
    this.velocity = new Vec2D(0, 0)
  }
}

export { GameObject, Movable }
