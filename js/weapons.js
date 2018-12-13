import * as PIXI from 'pixi.js'
import { Bow } from './weapons/bow'
import { Gun } from './weapons/gun'
import { Minigun } from './weapons/minigun'
import { Shotgun } from './weapons/shotgun'
import { Graphics } from './graphics'
import { game_config as conf } from './game_config'

class Weapons {
  static GetRandomWeapon() {
    const wpn = Weapons._weapons[ Math.floor(Math.random() * Weapons._weapons.length) ]
    return new wpn()
  }

  static GetProjectileSprite(wpn, variant = 0) {
    let projectile = undefined
    const cl_proj = 0xFFFFFF
    const proj_width = 0.3
    const proj_height = 0.15
    switch (wpn.constructor) {
      case Bow:
        projectile = Graphics.textures.GetSprite('arrow_' + variant)
        projectile.scale.set(1 / 747, -1 / 747)
        projectile.anchor.set(0.5, 1)
        break
      default:
        projectile = Graphics.CreateRectangle(0, 0, proj_height, proj_width, cl_proj, cl_proj)
        break
    }
    return projectile
  }

  static GetSprite(wpn, variant) {
    let weapon = undefined
    if (process.env.NODE_ENV === 'development') console.log(`Requesting weapon sprite '${ wpn.constructor.Name.toLowerCase() }'`)
    weapon = Graphics.textures.GetSprite(`${ wpn.constructor.Name.toLowerCase() }_${variant}`)
    // const length = conf.size[weapon.constructor.Name.toLowerCase()] ? conf.size[weapon.Name.toLowerCase()] : 1
    const length = conf.size[wpn.constructor.Name.toLowerCase()] ?
      conf.size[wpn.constructor.Name.toLowerCase()] : 1
    let mod = weapon.width > weapon.height ? length / weapon.width : length / weapon.height
    weapon.width *= mod
    weapon.height *= mod
    weapon.anchor.set(0.5, 0.5)
    if (conf.anchor[wpn.constructor.Name.toLowerCase()]) {
      weapon.anchor.set(conf.anchor[wpn.constructor.Name.toLowerCase()][1],
        conf.anchor[wpn.constructor.Name.toLowerCase()][0])
    }
    return weapon
  }
}
Weapons._weapons = [ Gun, Bow, Minigun, Shotgun ]

export { Weapons, Bow, Gun, Minigun, Shotgun }
