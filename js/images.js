import * as PIXI from 'pixi.js'

const gun_texture = require('../data/images/gun.png')

class Images {
  static get Gun() {
    return PIXI.Sprite.fromImage(gun_texture)
  }
}


export { Images }
