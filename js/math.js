import * as PIXI from 'pixi.js'

class Vec2D {
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  set(x, y) {
    this.x = x
    this.y = y
  }

  get magnitude() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
  }

  static add(a, b) {
    return new Vec2D(a.x + b.x, a.y + b.y)
  }

  static mult(vec, num) {
    return new Vec2D(vec.x * num, vec.y * num)
  }

  static equal(a, b) {
    return a.x == b.x && a.y == b.y
  }

  toPixiPoint() {
    return new PIXI.Point(this.x, this.y)
  }
}

class Line {
  constructor(p1, p2) {
    this.p1 = p1
    this.p2 = p2
  }

  static intersect(l1, l2) {
    return (
      ((l1.p1.x - l2.p1.x) * (l2.p1.y - l2.p2.y) - (l1.p1.y - l2.p1.y) * (l2.p1.x - l2.p2.x)) /
      ((l1.p1.x - l1.p2.x) * (l2.p1.y - l2.p2.y) - (l1.p1.y - l1.p2.y) * (l2.p1.x - l2.p2.x))
    )
  }

  static intersectPoint(line, t) {
    return new Vec2D(line.p1.x + t * (line.p2.x - line.p1.x), line.p1.y + t * (line.p2.y - line.p1.y))
  }
}

export { Vec2D, Line }
