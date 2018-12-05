import { Graphics, renderer } from './../graphics'
import { Vec2D } from './../math'
import { Level } from './../level'
import { Gamepad } from './../interaction'
import { Weapons } from './../weapons'

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
    this.graphic = Weapon._CreateGraphic(this, pos)
    this._last_mouse_pos = this._GetMousePos()
  }

  /**
    * Update weapon and projectiles
    */
  Update() {
    // look at mouse if moved or gamepad
    const mouse_moved = !Vec2D.Equal(this._GetMousePos(), this._last_mouse_pos)
    if (mouse_moved) {
      this._last_mouse_pos = this._GetMousePos()
      // Look at mouse
      const dir = this._GetMouseDirection()
      this.graphic.scale.x = Math.abs(this.graphic.scale.x) * (dir.x >= 0 ? -1 : 1)
      this.graphic.parent.rotation = -Math.atan2(dir.x, dir.y)
    } else {
      // if gamepad right stick moved, adjust rotation
      const stick_dir = Gamepad.GetStick('right')
      if (stick_dir.x || stick_dir.y)
        this.graphic.parent.rotation = -Math.atan2(stick_dir.x, stick_dir.y * -1)
    }
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
  static _CreateGraphic(inst, pos) {
    let rect = Weapons.GetSprite(inst)
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
    const screen_mouse_pos = this._GetMousePos()
    // Get screen coordinates (bottom-left based) for the weapon holster
    const screen_holster_pos = new Vec2D(
      this.graphic.parent.worldTransform.tx,
      window.innerHeight - this.graphic.parent.worldTransform.ty)
    // Get the distance between the two => direction vector
    const distance = Vec2D.Sub(screen_mouse_pos, screen_holster_pos)
    return Vec2D.Div(distance, distance.Magnitude) // normalize
  }

  _GetMousePos() {
    return new Vec2D(
      renderer.plugins.interaction.mouse.global.x,
      window.innerHeight - renderer.plugins.interaction.mouse.global.y
    )
  }
}

export { Weapon }
