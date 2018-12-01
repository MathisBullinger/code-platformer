import { Vec2D } from './../math'
import { Projectile } from './projectile'

class Bullet extends Projectile {
  /**
    * Initializes
    */
  constructor(bow) {
    super(bow, new Vec2D(0.2, 0.2), 100, 1)
  }

  /**
    * Update
    */
  Update(dt) {
    super.Update(dt)
  }
}

export { Bullet }
