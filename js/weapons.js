import { Bow } from './weapons/bow'
import { Gun } from './weapons/gun'
import { Minigun } from './weapons/minigun'
import { Shotgun } from './weapons/shotgun'

class Weapons {
  static GetRandomWeapon() {
    const wpn = Weapons._weapons[ Math.floor(Math.random() * Weapons._weapons.length) ]
    console.log(wpn)
    return new wpn()
  }
}
Weapons._weapons = [ Bow, Gun, Minigun, Shotgun ]

export { Weapons, Bow, Gun, Minigun, Shotgun }
