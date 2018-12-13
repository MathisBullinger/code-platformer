import * as PIXI from 'pixi.js'
import { game_config as conf } from './../game_config'
import { Bow } from './../Weapons'
import { Graphics } from '../graphics'

class PlayerUI {
  constructor(players) {
    this._players = []
    this.graphic = new PIXI.Container()
    this._setPlayers(players)
  }

  _setPlayers(players) {
    this.graphic.removeChild(...this.graphic.children)
    PlayerHealth.total_player_count = players.length
    for (let i = 0; i < players.length; ++i) {
      const pl_bar = new PlayerHealth(players[i], i)
      this._players.push(pl_bar)
      this.graphic.addChild(pl_bar.graphic)
    }
    this.graphic.position.set(0)
  }

  Update() {
    for (let player of this._players) {
      player.Update()
    }
  }
}

class PlayerHealth {
  constructor(player, index) {
    // Set attributes
    this._player = player
    this._player_index = index
    this._x_offset = index % 2 === 0 ? 64 : (window.innerWidth) - 230
    this._y_offset = index < 2 ? 64 : (window.innerHeight) - 64
    // Create container
    this.graphic = new PIXI.Graphics()
    this.graphic.position.set(0)
    this.graphic.scale.set(1 / window.devicePixelRatio)
    // Save mugs
    this._mugs = []
    // Static head sprite
    this._head_graphic = Graphics.textures.GetSprite(`player_head_${index}`)
    this._head_graphic.position.set(this._x_offset, this._y_offset)
    this._head_graphic.anchor.set(0.5)
    this._head_graphic.scale.set(0.08)
    this.graphic.addChild(this._head_graphic)
    // Static money sprite
    this._money_graphic = Graphics.textures.GetSprite('money')
    this._money_graphic.position.set(this._x_offset + 72, this._y_offset - 18)
    this._money_graphic.anchor.set(0.5)
    this._money_graphic.scale.set(0.07)
    this.graphic.addChild(this._money_graphic)
  }

  Update() {
    if (this._player.dead) {
      this._PaintMugs()
      return
    }
    // Out of reasons unknown to me, when first rendering the ui, the position.y is always set to 0.
    // To prevent this we need to repaint the whole thing when position.y === 0
    if (this._player.health !== this._player_last_health) {
      this._player_last_health = this._player.health
      this._PaintMugs()
    }
    if(this._player.score !== this._player_last_score) {
      this._player_last_score = this._player.score
      this._PaintHighscore()
    }
    if (this._player._weapon !== this._player_last_weapon) {
      this._player_last_weapon = this._player._weapon
      this._PaintWeapon()
    }
  }

  _PaintWeapon() {
    this.graphic.removeChild(this._weapon_graphic)
    this._weapon_graphic = this._player._weapon ?
      new PIXI.Sprite(this._player._weapon.graphic.texture) :
      new PIXI.Container()
    this._weapon_graphic.anchor.set(0.5)
    this._weapon_graphic.position.set(this._x_offset + 164, this._y_offset - 16)
    this._weapon_graphic.scale.set(-0.05, 0.05)
    this._weapon_graphic.rotation = this._player._weapon && this._player._weapon.constructor === Bow ?
      Math.PI :
      Math.PI / 2
    this.graphic.addChild(this._weapon_graphic)
  }

  _PaintHighscore() {
    this.graphic.removeChild(this._score_graphic)
    this._score_graphic = new PIXI.Text(`x${ Math.floor(this._player.score) }`, { fill: 0xFFFFFF, fontSize: 28, fontWeight: 'bold'  })
    this._score_graphic.position.set(this._x_offset + 94, this._y_offset - 36)
    this.graphic.addChild(this._score_graphic)
  }

  _PaintMugs() {
    this.graphic.removeChild(...this._mugs)
    this._mugs = []
    // Get the maximum amount of mugs and the current amount
    const cur_mugs = PlayerHealth._GetHalfHearts(this._player.health)
    // Draw mugs
    for (let i = 0; i < cur_mugs; i += 2) {
      const mug = Graphics.textures.GetSprite('coffee_cup')
      mug.anchor.set(0, 0.5)
      mug.scale.set(0.1)
      mug.position.set(this._x_offset + (15 * i) + 56, this._y_offset + 20)
      // If half money => crop width
      if (i + 1 >= cur_mugs) mug.texture = new PIXI.Texture(mug.texture, new PIXI.Rectangle(0, 0, 128, 256))
      this._mugs.push(mug)
    }
    if (this.graphic && this._mugs && this._mugs.length) {
      this.graphic.addChild(...this._mugs)
    }
  }

  static _GetHalfHearts(health) {
    return Math.ceil(10 / conf.player_hp * health)
  }
}

export { PlayerUI }
