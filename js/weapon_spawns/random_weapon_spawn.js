import * as PIXI from 'pixi.js'
import { WeaponSpawn } from './weapon_spawn'
import { Weapons } from './../weapons'

/**
 * Implementation for a randomizing weapon spawn.
 * This spawn has an equal possibility to give the player one of the games weapon.
 * This spawn does not show the weapon beforehand. It is possible to get
 * the same weapon you already carry.
 */
class RandomWeaponSpawn extends WeaponSpawn {
  /**
   * Initialize
   */
  constructor(pos) {
    // Position, cooldown, active color, inactive color
    super(pos, 5000)
  }

  /**
   * Update the spawn
   */
  Update() {
    super.Update()
  }

  /**
   * Returns the new weapon
   */
  TakeWeapon() {
    super.TakeWeapon()
    return Weapons.GetRandomWeapon()
  }

  ResetWeapon() {
    super.ResetWeapon()
  }

  get _TextureName() {
    return 'mystery_box'
  }

  _PaintSpawn() {
    super._PaintSpawn()
  }
}

export { RandomWeaponSpawn }
