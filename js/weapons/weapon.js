import { Graphics, renderer } from './../graphics'
import { Vec2D } from './../math'

class Weapon {
  constructor(pos, scale) {
    this.pos = pos
    this.scale = scale
    this.graphic = this._GetGraphic(pos, scale)
  }

  Update() {
    const dir = this._GetMouseDirection()
    this.graphic.parent.rotation = -Math.atan2(dir.x, dir.y)
  }

  _GetGraphic(pos, scale) {
    const rect = Graphics.CreateRectangle(pos.x, pos.y, scale.x, scale.y, 0x000000)
    rect.pivot.set(scale.x / 2, scale.y / 2)
    return rect
  }

  _GetMouseDirection() {
    // Get screen coordinates (bottom-left based) for the mouse
    const screen_mouse_pos = new Vec2D(
      renderer.plugins.interaction.mouse.global.x,
      window.innerHeight - renderer.plugins.interaction.mouse.global.y)
    // Get screen coordinates (bottom-left based) for the weapon holster
    const screen_holster_pos = new Vec2D(
      this.graphic.parent.getGlobalPosition().x,
      window.innerHeight - this.graphic.parent.getGlobalPosition().y)
    // Get the distance between the two => direction vector
    const distance = Vec2D.Sub(screen_mouse_pos, screen_holster_pos)
    return Vec2D.Div(distance, distance.magnitude) // normalize
  }
}

export { Weapon }
