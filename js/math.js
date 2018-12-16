import * as PIXI from 'pixi.js'

const RadiansToDegrees = rad => rad * (180 / Math.PI)

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
    return (this.x == 0 && this.y == 0) ? 0 : Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
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

  static Normalize(vec) {
    return Vec2D.Div(vec, vec.Magnitude)
  }

  static DotProduct(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y
  }

  static Angle(v1, v2) {
    return Math.acos(Vec2D.DotProduct(v1, v2) / (v1.Magnitude * v2.Magnitude))
  }

  static AngleDegrees(v1, v2) {
    return RadiansToDegrees(Vec2D.Angle(v1, v2))
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

  get x1() {
    return this.p1.x
  }
  get y1() {
    return this.p1.y
  }
  get x2() {
    return this.p2.x
  }
  get y2() {
    return this.p2.y
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
