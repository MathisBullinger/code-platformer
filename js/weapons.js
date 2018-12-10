import * as PIXI from 'pixi.js'
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

  static GetProjectileSprite(wpn, variant) {
    let projectile = undefined
    switch (wpn.constructor) {
      case Bow:
        projectile = Sprites.Arrow(variant)
        projectile.scale.set(1 / 747, -1 / 747)
        projectile.anchor.set(0.5, 1)
        break
      default:
        projectile = new PIXI.Graphics()
        projectile.beginFill(0x000000)
        projectile.drawRect(0, 0, 0.1, 0.1)
        projectile.endFill()
        projectile.pivot.set(0)
        break
    }
    return projectile
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
