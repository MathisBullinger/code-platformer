import { Graphics, renderer } from './../graphics'
import { Vec2D } from './../math'
import { Level } from './../level'

/**
  * General weapon class
  */
class Weapon {
  /**
    * Initializes
    */
  constructor(pos, scale, cooldown) {
    // This ES6 snippet prevents direct instatiation in order to ensure an "abstract" class
    if (new.target === Weapon) {
      throw new TypeError('Cannot construct abstract Weapon instances directly')
    }
    // Set attributes
    this.pos = pos
    this.scale = scale
    this._cooldown = cooldown
    this._last_fired = Date.now()
    // Get graphics
    this.graphic = Weapon._GetGraphic(pos, scale)
  }

  /**
    * Update weapon and projectiles
    */
  Update() {
    // Look at mouse
    const dir = this._GetMouseDirection()
    this.graphic.parent.rotation = -Math.atan2(dir.x, dir.y)
  }

  /**
    * Check if weapon is on cooldown
    */
  get _hasCooldown() {
    return (Date.now() - this._last_fired) < this._cooldown
  }

  /**
    * Add projectile
    */
  _SpawnProjectile(projectile) {
    this._last_fired = Date.now()
    Level.ActiveLevel.AddProjectiles(projectile)
  }

  /**
    * Create weapon graphic
    */
  static _GetGraphic(pos, scale) {
    const rect = Graphics.CreateRectangle(0, 0, scale.x, scale.y, 0x000000)
    rect.pivot.set(scale.x / 2, scale.y / 2)
    rect.position.set(pos.x, pos.y)
    return rect
  }

  /**
    * Get normalized direction vector from weapon holster to mouse.
    * This is relativly long since the mouse position is in screen space (top, left)
    * and the holster position is in our world grid position.
    */
  _GetMouseDirection() {
    // Get screen coordinates (bottom-left based) for the mouse
    const screen_mouse_pos = new Vec2D(
      renderer.plugins.interaction.mouse.global.x,
      window.innerHeight - renderer.plugins.interaction.mouse.global.y)
    // Get screen coordinates (bottom-left based) for the weapon holster
    const screen_holster_pos = new Vec2D(
      this.graphic.parent.worldTransform.tx,
      window.innerHeight - this.graphic.parent.worldTransform.ty)
    // Get the distance between the two => direction vector
    const distance = Vec2D.Sub(screen_mouse_pos, screen_holster_pos)
    return Vec2D.Div(distance, distance.Magnitude) // normalize
  }
}

export { Weapon }
