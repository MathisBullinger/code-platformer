import { Vec2D } from './../math'
import { Graphics } from './../graphics'

/**
  * General projectile entity. This class is not meant to be instantiated
  * directly
  */
class Projectile {
  /**
    * Initializes a new projectile
    */
  constructor(weapon, scale, shooting_velocity) {
    // This ES6 snippet prevents direct instatiation in order to ensure an "abstract" class
    if (new.target === Projectile) {
      throw new TypeError('Cannot construct abstract Projectile instances directly')
    }
    // Set attributes
    this.weapon = weapon
    this.scale = scale
    // Get projectile orientation and scale direction vector by velocity
    this.vel = Vec2D.add(Vec2D.mult(Projectile._RadiansToVector(weapon), shooting_velocity), new Vec2D(0, - 0.25))
    // Find nozzle and set position to nozzle position
    this.pos = Projectile._GetNozzlePosition(weapon)
    this.graphic = Graphics.CreateRectangle(this.pos.x, this.pos.y, scale.x, scale.y, 0x000000)
    // Center pivot and apply holster rotation
    this.graphic.pivot.set(scale.x / 2, 0)
    this.graphic.rotation = weapon.graphic.parent.rotation
  }

  /**
    * Update projectile position based on velocity
    */
  Update(dt) {
    // Apply velocity
    this.pos = Vec2D.add(this.pos, Vec2D.mult(this.vel, dt / 1000))
    this.graphic.position = this.pos.toPixiPoint()
    this.vel.y -= 0.25
  }

  /**
    * Gets the position of the weapon nozzle on the game grid.
    * Can't use the weapon.graphic.worldTransform matrix since
    * it already include the inverse y and scene scaling.
    * (Most likely there is a way but I don't want to do the math for that)
    */
  static _GetNozzlePosition(weapon) {
    // Get graphics for all relevant entities. This is an ES6 notation, will fail on different es versions
    const [ holster_rot, holster_graphic, player_graphic ] = [ weapon.graphic.parent.rotation, weapon.graphic.parent, weapon.graphic.parent.parent ]
    // Holster is at = player_graphic pos + holster_graphic_pos
    const holster_pos = Vec2D.add(
      new Vec2D(player_graphic.position.x, player_graphic.position.y),
      new Vec2D(holster_graphic.position.x, holster_graphic.position.y)
    )
    // Get cos and sin
    const [ cs, sn ] = [ Math.cos(holster_rot), Math.sin(holster_rot) ]
    // x = x * cs - y * sn;
    // y = x * sn + y * cs;
    return Vec2D.add(holster_pos, new Vec2D(
      weapon.pos.x * cs - weapon.pos.y * sn,
      weapon.pos.x * sn + weapon.pos.y * cs
    ))
  }

  /**
    * Takes a weapon and converts the rotation of the weapon holster
    * from radians to a direction vector.
    */
  static _RadiansToVector(weapon) {
    const radians = weapon.graphic.parent.rotation
    const [ cs, sn ] = [ Math.cos(radians), Math.sin(radians) ]
    return new Vec2D(
      weapon.pos.x * cs - weapon.pos.y * sn,
      weapon.pos.x * sn + weapon.pos.y * cs
    )
  }
}

export { Projectile }
