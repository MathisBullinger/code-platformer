import { Weapon } from './weapon'
import { Vec2D } from './../math'
import { Bullet } from './bullet'

class Shotgun extends Weapon {
  constructor() {
    super(new Vec2D(0, 0.3), 750)
    this._number_bullets = 6
  }

  /*
   * Shoot projectile given as parameter and return recoil
   */
  Shoot() {
    if (this._hasCooldown) return new Vec2D(0, 0)
    let vel_dir = new Vec2D(0, 0) // Sum up velocity direction
    let impulse = 0.0 // Sum up impulse
    for (let i = 0; i < this._number_bullets; ++i) {
      // Create Bullet with direction offset
      const radians_offset = (2 * (i - (this._number_bullets / 2))) * (Math.PI / 180)
      const bullet = new Bullet(this, radians_offset)
      // Spawn, add to average velocity and to impulse
      this._SpawnProjectile(bullet)
      vel_dir = Vec2D.Add(vel_dir, bullet.vel)
      impulse += bullet.GetImpulse()
    }
    // Return summed up impulse and average velocity direction
    return Vec2D.Mult(Vec2D.Mult(Vec2D.Normalize(vel_dir), -1), impulse)
  }
}
Shotgun.Name = 'Shotgun'

export { Shotgun }
