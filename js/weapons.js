import { Bow } from './weapons/bow'
import { Gun } from './weapons/gun'
import { Minigun } from './weapons/minigun'
import { Shotgun } from './weapons/shotgun'
import { Sprites } from './sprites'

class Weapons {
  static GetRandomWeapon() {
    const wpn = Weapons._weapons[ Math.floor(Math.random() * Weapons._weapons.length) ]
    return new wpn()
  }

  static GetSprite(wpn, variant) {
    let weapon = undefined
    switch (wpn.constructor) {
      case Gun:
        weapon = Sprites.Gun(variant)
        weapon.scale.set(3 / 1724)
        break
      case Bow:
        weapon = Sprites.Bow(variant)
        weapon.scale.set(2 / 1724)
        break
      case Minigun:
        weapon = Sprites.Minigun(variant)
        weapon.scale.set(3 / 1724)
        break
      case Shotgun:
        weapon = Sprites.Shotgun(variant)
        weapon.scale.set(3 / 1724)
        break
      default:
        break
    }
    weapon.anchor.set(0.5, 0.5)
    return weapon
  }
}
Weapons._weapons = [ Gun, Bow, Minigun, Shotgun ]

export { Weapons, Bow, Gun, Minigun, Shotgun }
