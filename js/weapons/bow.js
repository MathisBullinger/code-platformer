import { Weapon } from './weapon'
import { Vec2D } from './../math'
import { Mouse } from './../interaction'
import { Arrow } from './arrow'

/**
  * Weapon specialization.
  * Shoots slow arrows
  */
class Bow extends Weapon {

  /**
    * Initializes
    */
  constructor() {
    // Bow is held 1.1 units in front of player, "bow" shaped, 1000ms cooldown
    super(new Vec2D(0, 1.1), new Vec2D(0.9, 0.1), 1000)
  }

  /**
    * Update bow
    */
  Update(dt) {
    // If left mouse button down and !_HasCooldown => spawn arrow
    if (Mouse.IsDown(0) && !this._HasCooldown) {
      this._SpawnProjectile(new Arrow(this))
    }

    // Update base
    super.Update(dt)
  }
}

export { Bow }
