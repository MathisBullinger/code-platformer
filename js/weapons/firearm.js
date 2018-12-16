import { Weapon } from './weapon'
import { Vec2D } from '../math'
import { Sounds } from '../sounds'
import { GetUrlParam } from '../util'

/*
 * Firearm Class
 * any kind of shootable weapon
 */
class Firearm extends Weapon {
  constructor(pos, cooldown) {
    super(pos, cooldown)
  }

  /*
   * Shoot projectile given as parameter and return recoil
   */
  Shoot() {
    if (!this.ammunition) throw new Error('undefined ammunition')
    if (this._hasCooldown) return new Vec2D(0, 0)
    const projectile = new this.ammunition(this)
    this._SpawnProjectile(projectile)
    if (!GetUrlParam('no_sound'))
      Sounds.Play(this.constructor.Name.toLowerCase())
    return Vec2D.Mult(Vec2D.Mult(Vec2D.Normalize(projectile.vel), -1), projectile.GetImpulse())
  }


}

export { Firearm }
