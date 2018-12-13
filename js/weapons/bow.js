import * as PIXI from 'pixi.js'
import { Firearm } from './firearm'
import { Vec2D } from './../math'
import { Arrow } from './arrow'
import { Weapons } from './../weapons'

/**
  * Weapon specialization.
  * Shoots slow arrows
  */
class Bow extends Firearm {

  /**
    * Initializes
    */
  constructor() {
    // Bow is held 1.1 units in front of player, "bow" shaped, 1000ms cooldown
    super(new Vec2D(0, 1.1), new Vec2D(1.5, 1.5 * 0.25), 1000)
    this.ammunition = Arrow
    this.arrow_indicator = new ArrowIndicator(this, 3)
  }

  /**
   * The bow has a special shooting mechanic. It is the only
   * weapon with limited ammunition. If the ammunition is empty, the
   * player can't shoot with the bow
   */
  Shoot() {
    // Only shoot if no cooldown and still arrows left
    if (!super._hasCooldown && this.arrow_indicator.arrows > 0) {
      this.arrow_indicator.decrement()
      return super.Shoot()
    }
    return new Vec2D(0, 0)
  }
}
Bow.Name = 'Bow'

/**
 * Arrow indicator for the bow weapon type
 */
class ArrowIndicator {
  /**
   * Initializes the arrow indicator.
   * Take the bow it belongs to and the number of arrows the bow holds as input
   */
  constructor(bow, arrows = 3) {
    if (bow.constructor !== Bow) throw new TypeError('The arrow indicator can only be applied to a bow')
    this._bow = bow
    this._total_arrows = arrows
    this._arrows_remaining = arrows
    this.graphic = new PIXI.Graphics()
    this._updateGraphic()
  }

  /**
   * Return number of arrows
   */
  get arrows() {
    return this._arrows_remaining
  }

  /**
   * Decrement the number of remaining arrows.
   * Default decrement step: 1
   */
  decrement(num = 1) {
    this._arrows_remaining -= num
    this._updateGraphic()
  }

  /**
   * Updates the graphics for the indicator
   */
  _updateGraphic() {
    // Clear old stuff and set line thickness
    this.graphic.removeChild(...this.graphic.children)
    this.graphic.lineStyle(0.1, 0x000000, 1, 0.5)
    // Draw arrow lines based on the remaining arrows
    for (let i = 0; i < this._arrows_remaining; ++i) {
      const y_pos = (0.5 / this._total_arrows) * i - (0.5 / this._total_arrows)
      const arr = Weapons.GetProjectileSprite(this._bow)
      arr.scale.set(0.7 / 512)
      arr.rotation = Math.PI / -2
      arr.position.set(0.35, y_pos + 0.1)
      this.graphic.addChild(arr)
    }
    // Center
    this.graphic.position.set(0.35, 1.5)
  }
}

export { Bow, ArrowIndicator }
