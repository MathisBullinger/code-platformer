import { Firearm } from './firearm'
import { Vec2D } from './../math'
import { Bullet } from './bullet'

/**
  * Weapon specialization. Shoots fast (not yet)
  */
class Gun extends Firearm {
  /**
    * Initializes
    */
  constructor() {
    super(new Vec2D(0, 0.4), new Vec2D(0.75, 0.75), 400)
    this.ammunition = Bullet
  }
}
Gun.Name = 'Gun'

export { Gun }
