import { Vec2D, Line } from './math'
import { Graphics } from './graphics'
import { game_config } from './game_config'

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

  RenderCollisionFaces(scene) {
    const off = 0.1
    const color = 0xFF0000
    if (this._collision_sides.top) {
      const line = Graphics.CreateLine(this.graphic.x, this.graphic.y + this.graphic.height - off,
        this.graphic.x + this.graphic.width, this.graphic.y + this.graphic.height - off, 0.05, color)
      scene.addChild(line)
    }
    if (this._collision_sides.bottom) {
      const line = Graphics.CreateLine(this.graphic.x, this.graphic.y + off,
        this.graphic.x + this.graphic.width, this.graphic.y + off, 0.05, color)
      scene.addChild(line)
    }
    if (this._collision_sides.left) {
      const line = Graphics.CreateLine(this.graphic.x + off, this.graphic.y + this.graphic.height,
        this.graphic.x + off, this.graphic.y, 0.05, color)
      scene.addChild(line)
    }
    if (this._collision_sides.right) {
      const line = Graphics.CreateLine(this.graphic.x + this.graphic.width - off, this.graphic.y + this.graphic.height,
        this.graphic.x + this.graphic.width - off, this.graphic.y, 0.05, color)
      scene.addChild(line)
    }
  }
}

class Movable extends GameObject {
  constructor(pos = new Vec2D(0, 0), scale = new Vec2D(1, 1)) {
    super(pos, scale)
    this.vel = new Vec2D(0, 0)
  }

  Update(dt = -1) {
    if (dt == -1) throw new Error('call Update() with delta time in ms!')
    this._last_vert = this.GetVertices()
    this.pos = Vec2D.Add(this.pos, Vec2D.Mult(this.vel, dt / 1000))
    this.graphic.position = this.pos.ToPixiPoint()
    if (game_config.display_mov_vector) this.RenderMoveVec()
  }

  RenderMoveVec() {
    if (!game_config.scene) return
    if (this._mov_vecs) {
      this._mov_vecs.forEach(vec => game_config.scene.removeChild(vec))
    } else {
      this._mov_vecs = []
    }
    const vertices = this.GetVertices()
    for (let i in vertices) {
      const line = Graphics.CreateLine(vertices[i].x, vertices[i].y,
        this._last_vert[i].x, this._last_vert[i].y, 0.1, 0x00FF00)
      this._mov_vecs.push(line)
      game_config.scene.addChild(line)
    }
  }

  RemoveMoveVec() {
    if (!this._mov_vecs || !game_config.scene) return
    this._mov_vecs.forEach(vec => game_config.scene.removeChild(vec))
  }
}

export { GameObject, Movable }
