import * as PIXI from 'pixi.js'
import { Level } from './../level'
import { game_config as conf } from './../game_config'
import { Sprites } from './../sprites'
import { Weapons, Bow } from './../Weapons'

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
    this.graphic.position.set(0, Level.ActiveLevel.height - 2)
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
    // Create container
    const step = Level.ActiveLevel.width / PlayerHealth.total_player_count
    this.graphic = new PIXI.Graphics()
    this.graphic.position.set(step * this._player_index + ((step - 4.75) / 2), 0)
    this.graphic.pivot.set(0, this.graphic.height / 2)
    // Save mugs
    this._mugs = []
    // Static head sprite
    this._head_graphic = Sprites.PlayerHead(player._player_number)
    this._head_graphic.anchor.set(0, 0.5)
    this._head_graphic.scale.set(2 / 1975)
    this.graphic.addChild(this._head_graphic)
    // Static money sprite
    this._money_graphic = Sprites.Money
    this._money_graphic.anchor.set(0, 0.5)
    this._money_graphic.position.set(1.6, 0.25)
    this._money_graphic.scale.set(1 / 1531)
    this.graphic.addChild(this._money_graphic)
  }

  Update() {
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
                              Weapons.GetSprite(this._player._weapon, this._player.number) :
                              new PIXI.Container()
    this._weapon_graphic.position.set(3.75, 0.25)
    this._weapon_graphic.scale.set(1.5 / 1531)
    this._weapon_graphic.rotation = this._player._weapon && this._player._weapon.constructor === Bow ?
                                        0 :
                                        Math.PI / 2
    this.graphic.addChild(this._weapon_graphic)
  }

  _PaintHighscore() {
    this.graphic.removeChild(this._score_graphic)
    this._score_graphic = new PIXI.Text(`x${ this._player.score }`, { fill: 0xFFFFFF, fontSize: 64, fontWeight: 'bold'  })
    const ratio = this._score_graphic.width / this._score_graphic.height
    this._score_graphic.height = 0.45
    this._score_graphic.width = this._score_graphic.height * ratio
    this._score_graphic.scale.y *= -1
    this._score_graphic.position.set(2.5, 0.45)
    this.graphic.addChild(this._score_graphic)
  }

  _PaintMugs() {
    this.graphic.removeChild(...this._mugs)
    this._mugs = []
    // Get the maximum amount of mugs and the current amount
    const cur_mugs = PlayerHealth._GetHalfHearts(this._player.health)
    // Draw mugs
    for (let i = 0; i < cur_mugs; i += 2) {
      const mug = Sprites.CoffeeCup
      mug.anchor.set(1, 0)
      mug.scale.set(0.5 / 256)
      mug.rotation = Math.PI
      mug.position.set(0.25 * i + 1.75, -0.15)
      // If half money => crop width
      if (i + 1 >= cur_mugs) mug.texture = new PIXI.Texture(mug.texture, new PIXI.Rectangle(128, 0, 128, 256))
      this._mugs.push(mug)
    }
    this.graphic.addChild(...this._mugs)
  }

  static _GetHalfHearts(health) {
    return Math.ceil(10 / conf.player_hp * health)
  }
}

export { PlayerUI }
