import { Vec2D } from './../math'
import { Projectile } from './projectile'

/**
  * A special slow flying projectile
  */
class Arrow extends Projectile {
  /**
    * Initializes
    */
  constructor(bow) {
    super(bow, new Vec2D(0.1, 0.6), 15, 0)
    this.damage = 3
  }

  /**
    * Update
    */
  Update(dt) {
    super.Update(dt)
  }
}

export { Arrow }
