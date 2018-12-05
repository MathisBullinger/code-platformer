import { Bow } from './weapons/bow'
import { Gun } from './weapons/gun'
import { Minigun } from './weapons/minigun'
import { Shotgun } from './weapons/shotgun'
import { Images } from './images'

class Weapons {
  static GetRandomWeapon() {
    const wpn = Weapons._weapons[ Math.floor(Math.random() * Weapons._weapons.length) ]
    return new wpn()
  }

  static GetSprite(wpn) {
    let weapon = undefined
    switch (wpn.constructor) {
      case Gun:
        weapon = Images.Gun
        weapon.anchor.set(0.5, 0.5)
        weapon.scale.set(0.0015)
        break
      default:
        break
    }
    return weapon
  }
}
Weapons._weapons = [ Gun /**, Bow, Minigun, Shotgun */ ]

export { Weapons, Bow, Gun, Minigun, Shotgun }
