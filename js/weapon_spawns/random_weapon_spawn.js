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
    // Create question mark text
    this._text = RandomWeaponSpawn._CreateQuestionMark()
    this.graphic.addChild(this._text)
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
    this.graphic.removeChild(this._text)
    return Weapons.GetRandomWeapon()
  }

  ResetWeapon() {
    super.ResetWeapon()
    this.graphic.addChild(this._text)
  }

  _PaintSpawn() {
    super._PaintSpawn()
  }

  static _CreateQuestionMark() {
    const text = new PIXI.Text('?', { fill: '#FFFFFF', fontSize: 64, fontWeight: 'bold' })
    const ratio = text.width / text.height
    text.height = 0.6
    text.width = text.height * ratio
    text.position.set(0.5 - (text.width / 2), 0.5 + (text.height / 2))
    text.scale.y *= -1
    return text
  }
}

export { RandomWeaponSpawn }
