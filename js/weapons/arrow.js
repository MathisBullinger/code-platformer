import { Vec2D } from './../math'
import { Graphics, app, renderer } from './../graphics'

class Arrow {
  constructor(bow) {
    // Default bow velocity is 10
    this.vel = new Vec2D(100, 0)
    this.pos = Arrow._GetArrowGridLocation(bow)
    // Create arrow graphic in center of bow
    this.graphic = Graphics.CreateRectangle(this.pos.x, this.pos.y, 0.05, 0.5, 0x000000)
    const dir = bow._GetMouseDirection()

    this.graphic.rotation = -Math.atan2(dir.x, dir.y)
    app.stage.children[0].addChild(this.graphic)
  }

  Update(dt) {
    this.vel.y -= 9.81
    this.pos = Vec2D.add(this.pos, Vec2D.mult(this.vel, dt / 1000))
    this.graphic.position = this.pos.toPixiPoint()
  }

  static _GetArrowGridLocation(bow) {
    // Get bow position relative to bottom left corner
    const screen_bow = new Vec2D(
      bow.graphic.parent.getGlobalPosition().x,
      window.innerHeight - bow.graphic.parent.getGlobalPosition().y
    )
    // Get bow position in a 34 block grid
    const game_bow = new Vec2D(
      (34 / window.innerWidth) * screen_bow.x * renderer.resolution,
      (34 / window.innerWidth) * screen_bow.y * renderer.resolution
    )
    return game_bow
  }
}

export { Arrow }
