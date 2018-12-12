import { Vec2D } from './../math'
import { Projectile } from './projectile'

class Bullet extends Projectile {
  /**
    * Initializes
    */
  constructor(weapon, radians_offset = 0) {
    super(weapon, new Vec2D(0.2, 0.2), 100, 1, radians_offset)
  }

  /**
    * Update
    */
  Update(dt) {
    super.Update(dt)
  }
}
Bullet.Name = 'Bullet'

export { Bullet }
