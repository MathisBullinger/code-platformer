class Vec2D {
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  set(x, y) {
    this.x = x
    this.y = y
  }

  add(vec) {
    this.x += vec.x
    this.y += vec.y
  }

  mult(num) {
    this.x *= num
    this.y *= num
  }

  toPixiPoint() {
    return new PIXI.Point(this.x, this.y)
  }
}

export { Vec2D }
