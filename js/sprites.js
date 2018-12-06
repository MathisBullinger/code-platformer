import * as PIXI from 'pixi.js'

const gun_texture = PIXI.Texture.fromImage(require('../data/images/gun.png'))

const money_texture = PIXI.Texture.fromImage(require('../data/images/money.png'))

const mystery_box_texture = PIXI.Texture.fromImage(require('../data/images/mystery_box.png'))

const wall_texture = PIXI.Texture.fromImage(require('../data/images/wall.png'))

const shotgun_texture = PIXI.Texture.fromImage(require('../data/images/shotgun.png'))

const bow_texture = PIXI.Texture.fromImage(require('../data/images/bow.png'))

const minigun_texture = PIXI.Texture.fromImage(require('../data/images/minigun.png'))

const coffee_cup_texture = PIXI.Texture.fromImage(require('../data/images/coffee_cup.png'))

class Sprites {
  static get Gun() {
    return new PIXI.Sprite(gun_texture)
  }

  static get Money() {
    return new PIXI.Sprite(money_texture)
  }

  static get CoffeeCup() {
    return new PIXI.Sprite(coffee_cup_texture)
  }

  static get MysteryBox() {
    return new PIXI.Sprite(mystery_box_texture)
  }

  static get Wall() {
    return new PIXI.Sprite(wall_texture)
  }

  static get Bow() {
    return new PIXI.Sprite(bow_texture)
  }

  static get Minigun() {
    return new PIXI.Sprite(minigun_texture)
  }

  static get Shotgun() {
    return new PIXI.Sprite(shotgun_texture)
  }
}


export { Sprites }
