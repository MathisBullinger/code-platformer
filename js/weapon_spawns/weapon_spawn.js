import * as PIXI from 'pixi.js'
import { Vec2D } from './../math'

class WeaponSpawn {
  constructor(pos, cooldown, active_color, inactive_color) {
    // This ES6 snippet prevents direct instatiation in order to ensure an "abstract" class
    if (new.target === WeaponSpawn) {
      throw new TypeError('Cannot construct abstract WeaponSpawn instances directly')
    }
    // Set attributes
    this.pos = pos
    this.scale = new Vec2D(1, 1)
    this._cooldown = cooldown
    this._active_color = active_color
    this._inactive_color = inactive_color
    this._on_cooldown = false
    this._last_use = 0
    // Create base graphic
    this._PaintSpawn(this._active_color)
  }

  Update() {
    if (this._on_cooldown && (Date.now() - this._last_use) >= this._cooldown) {
      this.ResetWeapon()
    }
  }

  /**
    * Does this weapon spawn have a weapon to take for player
    */
  get hasWeapon() {
    return !this._on_cooldown
  }

  /**
   * Initiates the weapon spawn cooldown and redraws it
   */
  TakeWeapon() {
    this._on_cooldown = true
    this._PaintSpawn(this._inactive_color)
    this._last_use = Date.now()
  }

  /**
   * Return to the state where the player can pick up a new weapon
   */
  ResetWeapon() {
    this._PaintSpawn(this._active_color)
    this._on_cooldown = false
  }

  _PaintSpawn(color) {
    if (!this.graphic) this.graphic = new PIXI.Graphics()
    this.graphic.clear()
    this.graphic.beginFill(color)
    this.graphic.drawRect(0, 0, 1, 1)
    this.graphic.endFill()
    this.graphic.position.set(this.pos.x, this.pos.y)
  }
}

export { WeaponSpawn }
