import { Weapon } from './weapon'
import { Vec2D } from './../math'

/*
 * Firearm Class
 * any kind of shootable weapon
 */
class Firearm extends Weapon {
  constructor(pos, scale, cooldown) {
    super(pos, scale, cooldown)
  }

  /*
   * Shoot projectile given as parameter and return recoil
   */
  Shoot() {
    if (!this.ammunition) throw new Error('undefined ammunition')
    const projectile = new this.ammunition(this)
    if (this._hasCooldown) return new Vec2D(0, 0)
    this._SpawnProjectile(projectile)
    return Vec2D.Mult(Vec2D.Normalize(projectile.vel), -1)
  }


}

export { Firearm }
