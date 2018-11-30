import { Weapon } from './weapon'
import { Vec2D } from './../math'
import { Bullet } from './bullet'
import { Mouse } from './../interaction'

/**
  * Weapon specialization. Shoots fast (not yet)
  */
class Gun extends Weapon {
  /**
    * Initializes
    */
  constructor() {
    super(new Vec2D(0, 0.4), new Vec2D(0.2, 0.6), 400)
  }

  Update(dt) {
    // Update base
    super.Update(dt)
    // Shoot Bullet
    if (Mouse.IsDown(0) && !this._hasCooldown) {
      this._SpawnProjectile(new Bullet(this))
    }
  }
}

export { Gun }
