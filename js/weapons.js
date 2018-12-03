import { Bow } from './weapons/bow'
import { Gun } from './weapons/gun'
import { Minigun } from './weapons/minigun'

class Weapons {
  static GetRandomWeapon() {
    const wpn = Weapons._weapons[ Math.floor(Math.random() * Weapons._weapons.length) ]
    console.log(wpn)
    return new wpn()
  }
}
Weapons._weapons = [ Bow, Gun, Minigun ]

export { Weapons, Bow, Gun, Minigun }
