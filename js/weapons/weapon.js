import { renderer } from '../graphics'
import { Vec2D } from '../math'
import { Level } from '../level'
import { Weapons } from '../weapons'
import { game_config } from '../game_config'

/**
  * General weapon class
  */
class Weapon {
  /**
    * Initializes
    */
  constructor(pos, scale, cooldown) {
    // This ES6 snippet prevents direct instatiation in order to ensure an "abstract" class
    if (new.target === Weapon) {
      throw new TypeError('Cannot construct abstract Weapon instances directly')
    }
    // Set attributes
    this.pos = pos
    this.scale = scale
    this._cooldown = cooldown
    this._last_fired = Date.now()
    // Get graphics
    this.paintWeapon()
    this._last_dir = null
    // set damage
    this.damage = 1
    const damage = game_config.damage.weapon[this.constructor.name.toLowerCase()]
    if (damage)
      this.damage = damage
    // Projectile lifespan
    this.projectile_lifespan = -1
    const lifespan = game_config.lifespan.weapon[this.constructor.name.toLowerCase()]
    if (lifespan)
      this.projectile_lifespan = lifespan
  }

  /**
    * Update weapon and projectiles
    */
  Update(input) {
    if (!input) return
    if (!this._last_dir) this._last_dir = new Vec2D(0, 1)
    let dir = input.GetViewDir(this)
    if (!dir)
      dir = this._last_dir
    else
      this._last_dir = dir
    this.graphic.scale.x = Math.abs(this.graphic.scale.x) * (dir.x >= 0 ? -1 : 1)
    this.graphic.parent.rotation = -Math.atan2(dir.x, dir.y)
  }

  /**
    * Check if weapon is on cooldown
    */
  get _hasCooldown() {
    return (Date.now() - this._last_fired) < this._cooldown
  }

  /**
    * Add projectile
    */
  _SpawnProjectile(projectile) {
    this._last_fired = Date.now()
    Level.ActiveLevel.AddProjectiles(projectile)
  }

  /**
    * Create weapon graphic
    */
  paintWeapon(variant = 0) {
    this.graphic = Weapons.GetSprite(this, variant)
    this.graphic.position.set(this.pos.x, this.pos.y)
  }

  /**
    * Get normalized direction vector from weapon holster to mouse.
    * This is relativly long since the mouse position is in screen space (top, left)
    * and the holster position is in our world grid position.
    */
  _GetMouseDirection() {
    // Get screen coordinates (bottom-left based) for the mouse
    const screen_mouse_pos = this._GetMousePos()
    // Get screen coordinates (bottom-left based) for the weapon holster
    const screen_holster_pos = new Vec2D(
      this.graphic.parent.worldTransform.tx,
      window.innerHeight - this.graphic.parent.worldTransform.ty)
    // Get the distance between the two => direction vector
    const distance = Vec2D.Sub(screen_mouse_pos, screen_holster_pos)
    return Vec2D.Div(distance, distance.Magnitude) // normalize
  }

  _GetMousePos() {
    return new Vec2D(
      renderer.plugins.interaction.mouse.global.x,
      window.innerHeight - renderer.plugins.interaction.mouse.global.y
    )
  }
}

export { Weapon }
