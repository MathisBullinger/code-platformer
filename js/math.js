import * as PIXI from 'pixi.js'

/*
 * 2-dimensional Vector
 */
class Vec2D {
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  /*
   * Get & Set
   */
  get width() {
    return this.x
  }

  get height() {
    return this.y
  }

  Set(x, y) {
    this.x = x
    this.y = y
  }

  /*
   * Vector Compare
   */
  static Equal(a, b) {
    return a.x == b.x && a.y == b.y
  }

  /*
   * get Magnitude
   */
  get Magnitude() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
  }

  /*
   * Vector Arithmetic
   */
  static Add(a, b) {
    return new Vec2D(a.x + b.x, a.y + b.y)
  }

  static Sub(a, b) {
    return new Vec2D(a.x - b.x, a.y - b.y)
  }

  static Mult(vec, num) {
    return new Vec2D(vec.x * num, vec.y * num)
  }

  static Div(vec, num) {
    return new Vec2D(vec.x / num, vec.y / num)
  }

  ToPixiPoint() {
    return new PIXI.Point(this.x, this.y)
  }
}

/*
 * 2-dimensional Line
 */
class Line {
  constructor(p1, p2) {
    this.p1 = p1
    this.p2 = p2
  }

  /*
   * Line Intersection
   * https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection#Given_two_points_on_each_line
   */
  static Intersect(l1, l2) {
    return (
      ((l1.p1.x - l2.p1.x) * (l2.p1.y - l2.p2.y) - (l1.p1.y - l2.p1.y) * (l2.p1.x - l2.p2.x)) /
      ((l1.p1.x - l1.p2.x) * (l2.p1.y - l2.p2.y) - (l1.p1.y - l1.p2.y) * (l2.p1.x - l2.p2.x))
    )
  }

  static IntersectPoint(line, t) {
    return new Vec2D(line.p1.x + t * (line.p2.x - line.p1.x), line.p1.y + t * (line.p2.y - line.p1.y))
  }
}

export { Vec2D, Line }
