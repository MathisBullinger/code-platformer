import { Firearm } from './firearm'
import { Vec2D } from './../math'
import { Arrow } from './arrow'

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
    super(new Vec2D(0, 1.1), new Vec2D(0.9, 0.1), 1000)
    this.ammunition = Arrow
  }
}

export { Bow }
