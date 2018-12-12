import { WeaponSpawn } from './weapon_spawn'
import { Weapons } from './../weapons'

/**
 * Implementation for the normal weapon spawn
 * Holds a single weapon which a player can pick up.
 * The weapon is displayed beforehand and respawns every 5 seconds (random weapon)
 */
class NormalWeaponSpawn extends WeaponSpawn {
  /**
   * Initialize
   */
  constructor(pos) {
    // Position, cooldown, active color, inactive color
    super(pos, 5000)
    // Next weapon
    this._SetNextWeapon()
  }

  /**
   * Update the spawn
   */
  Update() {
    super.Update()
  }

  /**
   * Returns the new weapon and removes the old
   */
  TakeWeapon() {
    super.TakeWeapon()
    const wpn = this._next_weapon
    this._next_weapon = null
    this.graphic.removeChild(...this.graphic.children)
    return wpn
  }

  get _TextureName() {
    return 'mystery_box_blank'
  }

  /**
   * Resets the weapon spawn. Sets the new weapon
   */
  ResetWeapon() {
    super.ResetWeapon()
    this._SetNextWeapon()
  }

  /**
   * Render the next weapon at an 45° angle inside the weapon spawn block
   */
  _SetNextWeapon() {
    this._next_weapon = Weapons.GetRandomWeapon()
    const wp_graphic = Weapons.GetSprite(this._next_weapon, 0)
    wp_graphic.rotation = -Math.PI / 2
    wp_graphic.position.set(256)
    wp_graphic.scale.set(0.4)
    this.graphic.addChild(wp_graphic)
  }
}

export { NormalWeaponSpawn }
