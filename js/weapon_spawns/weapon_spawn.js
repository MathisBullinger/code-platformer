import { Vec2D } from '../math'
import { Graphics } from '../graphics'

class WeaponSpawn {
  constructor(pos, cooldown) {
    // This ES6 snippet prevents direct instatiation in order to ensure an "abstract" class
    if (new.target === WeaponSpawn) {
      throw new TypeError('Cannot construct abstract WeaponSpawn instances directly')
    }
    // Set attributes
    this.pos = pos
    this.scale = new Vec2D(1, 1)
    this._cooldown = cooldown
    this._on_cooldown = false
    this._last_use = 0
    // Create base graphic
    this._PaintSpawn()
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
    this._PaintSpawn()
    this._last_use = Date.now()
  }

  /**
   * Return to the state where the player can pick up a new weapon
   */
  ResetWeapon() {
    this._on_cooldown = false
    this._PaintSpawn()
  }

  _PaintSpawn() {
    if (!this.graphic) {
      this.graphic = Graphics.textures.GetSprite('mystery_box')
      this.graphic.scale.set(1/296)
      this.graphic.pivot.set(296)
      this.graphic.rotation = Math.PI
      this.graphic.position.set(this.pos.x, this.pos.y)
    }
    this.graphic.tint = this.hasWeapon ? 0xFFFFFF : 0x8C8C8C
  }
}

export { WeaponSpawn }
