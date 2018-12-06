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

  static GetSprite(wpn) {
    let weapon = undefined
    switch (wpn.constructor) {
      case Gun:
        weapon = Sprites.Gun
        weapon.scale.set(0.0015)
        break
      case Bow:
          weapon = Sprites.Bow
          weapon.scale.set(2 / 512)
          break
      case Minigun:
        weapon = Sprites.Minigun
        weapon.scale.set(0.0015)
        break
      case Shotgun:
        weapon = Sprites.Shotgun
        weapon.scale.set(0.0015)
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
