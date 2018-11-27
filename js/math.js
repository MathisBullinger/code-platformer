class Vec2D {
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  set(x, y) {
    this.x = x
    this.y = y
  }

  static add(a, b) {
    return new Vec2D(a.x + b.x, a.y + b.y)
  }

  static mult(vec, num) {
    return new Vec2D(vec.x * num, vec.y * num)
  }

  toPixiPoint() {
    return new PIXI.Point(this.x, this.y)
  }
}

export { Vec2D }
