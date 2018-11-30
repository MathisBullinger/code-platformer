import { Vec2D, Line } from './math'
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

  GetVertices() {
    let vertices = []
    vertices.push(new Vec2D(this.x, this.y))
    vertices.push(new Vec2D(this.x + this.width, this.y))
    vertices.push(new Vec2D(this.x + this.width, this.y + this.height))
    vertices.push(new Vec2D(this.x, this.y + this.height))
    return vertices
  }

  GetSegments() {
    let segments = []
    let vert = this.GetVertices()
    segments.push(new Line(new Vec2D(vert[0].x, vert[0].y), new Vec2D(vert[1].x, vert[1].y)))
    segments.push(new Line(new Vec2D(vert[1].x, vert[1].y), new Vec2D(vert[2].x, vert[2].y)))
    segments.push(new Line(new Vec2D(vert[2].x, vert[2].y), new Vec2D(vert[3].x, vert[3].y)))
    segments.push(new Line(new Vec2D(vert[3].x, vert[3].y), new Vec2D(vert[0].x, vert[0].y)))
    return segments
  }
}

class Movable extends GameObject {
  constructor(pos = new Vec2D(0, 0), scale = new Vec2D(1, 1)) {
    super(pos, scale)
    this.vel = new Vec2D(0, 0)
  }

  Update(dt = -1) {
    if (dt == -1) throw new Error('call Update() with delta time in ms!')
    this.pos = Vec2D.Add(this.pos, Vec2D.Mult(this.vel, dt / 1000))
    this.graphic.position = this.pos.ToPixiPoint()
  }
}

export { GameObject, Movable }
