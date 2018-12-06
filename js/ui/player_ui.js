import * as PIXI from 'pixi.js'
import { Level } from './../level'
import { game_config as conf } from './../game_config'
import { Sprites } from './../sprites'

class PlayerUI {
  constructor(players) {
    this._players = []
    this.graphic = new PIXI.Container()
    this._setPlayers(players)
  }

  _setPlayers(players) {
    this.graphic.children = []
    PlayerHealth.total_player_count = players.length
    for (let i = 0; i < players.length; ++i) {
      const pl_bar = new PlayerHealth(players[i], i + 1)
      this._players.push(pl_bar)
      this.graphic.addChild(pl_bar.graphic)
    }
  }

  Update() {
    for (let player of this._players) {
      player.Update()
    }
  }
}

class PlayerHealth {
  constructor(player, index) {
    this._player = player
    this._player_index = index
    this.graphic = new PIXI.Graphics()
  }

  Update() {
    if (this._player.health !== this._player_last_health) {
      this._player_last_health = this._player.health
      this._Paint()
    }
  }

  _Paint() {
    // Clear the screen
    this.graphic.children = []
    // Draw coffee mugs
    const half_mugs = PlayerHealth._GetHalfHearts(this._player.health)
    for (let i = 0; i < half_mugs; i += 2) {
      const money = Sprites.CoffeeCup
      money.anchor.set(0.5)
      money.scale.set(1 / 256)
      money.rotation = Math.PI
      money.position.set(0.75 * i, 0)
      // If half money => crop width
      if (i + 1 >= half_mugs) money.texture = new PIXI.Texture(money.texture, new PIXI.Rectangle(0, 0, 126, 161))
      this.graphic.addChild(money)
    }
    const step = Level.ActiveLevel.width / (PlayerHealth.total_player_count + 1)
    this.graphic.position.set(step * this._player_index, Level.ActiveLevel.height - 2)
    this.graphic.pivot.set(this.graphic.width / 2, this.graphic.height / 2)
  }

  static _GetHalfHearts(health) {
    return Math.round(10 / conf.player_hp * health)
  }
}

export { PlayerUI }
