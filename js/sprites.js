import * as PIXI from 'pixi.js'

const gun_texture = [
  PIXI.Texture.fromImage(require('../data/images/gun/gun_0.png')),
  PIXI.Texture.fromImage(require('../data/images/gun/gun_1.png')),
  PIXI.Texture.fromImage(require('../data/images/gun/gun_2.png')),
  PIXI.Texture.fromImage(require('../data/images/gun/gun_3.png'))
]

const shotgun_texture = [
  PIXI.Texture.fromImage(require('../data/images/shotgun/shotgun_0.png')),
  PIXI.Texture.fromImage(require('../data/images/shotgun/shotgun_1.png')),
  PIXI.Texture.fromImage(require('../data/images/shotgun/shotgun_2.png')),
  PIXI.Texture.fromImage(require('../data/images/shotgun/shotgun_3.png'))
]

const bow_texture = [
  PIXI.Texture.fromImage(require('../data/images/bow/bow_0.png')),
  PIXI.Texture.fromImage(require('../data/images/bow/bow_1.png')),
  PIXI.Texture.fromImage(require('../data/images/bow/bow_2.png')),
  PIXI.Texture.fromImage(require('../data/images/bow/bow_3.png'))
]

const minigun_texture = [
  PIXI.Texture.fromImage(require('../data/images/minigun/minigun_0.png')),
  PIXI.Texture.fromImage(require('../data/images/minigun/minigun_1.png')),
  PIXI.Texture.fromImage(require('../data/images/minigun/minigun_2.png')),
  PIXI.Texture.fromImage(require('../data/images/minigun/minigun_3.png'))
]

const player_head_texture = [
  PIXI.Texture.fromImage(require('../data/images/player_head/player_head_0.png')),
  PIXI.Texture.fromImage(require('../data/images/player_head/player_head_1.png')),
  PIXI.Texture.fromImage(require('../data/images/player_head/player_head_2.png')),
  PIXI.Texture.fromImage(require('../data/images/player_head/player_head_3.png'))
]

const money_texture = PIXI.Texture.fromImage(require('../data/images/money.png'))

const mystery_box_texture = PIXI.Texture.fromImage(require('../data/images/mystery_box.png'))

const wall_texture = PIXI.Texture.fromImage(require('../data/images/wall.png'))

const coffee_cup_texture = PIXI.Texture.fromImage(require('../data/images/coffee_cup.png'))

class Sprites {
  static Gun(variant = 0) {
    return new PIXI.Sprite(gun_texture[variant])
  }

  static PlayerHead(variant = 0) {
    return new PIXI.Sprite(player_head_texture[variant])
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

  static Bow(variant = 0) {
    return new PIXI.Sprite(bow_texture[variant])
  }

  static Minigun(variant = 0) {
    return new PIXI.Sprite(minigun_texture[variant])
  }

  static Shotgun(variant = 0) {
    return new PIXI.Sprite(shotgun_texture[variant])
  }
}


export { Sprites }
