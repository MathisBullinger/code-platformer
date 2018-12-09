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
      const pl_bar = new PlayerHealth(players[i], i)
      this._players.push(pl_bar)
      this.graphic.addChild(pl_bar.graphic)
    }
    this.graphic.position.set(0, Level.ActiveLevel.height - 1)
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
    this._head_graphic = Sprites.PlayerHead(player._player_number)
    this._head_graphic.anchor.set(0, 0.5)
    this._head_graphic.scale.set(2 / 1975)
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
    this.graphic.addChild(this._head_graphic)
    // Get the maximum amount of mugs and the current amount
    const cur_mugs = PlayerHealth._GetHalfHearts(this._player.health)
    // Draw mugs
    for (let i = 0; i < cur_mugs; i += 2) {
      const mug = Sprites.CoffeeCup
      mug.anchor.set(1, 0.5)
      mug.scale.set(1 / 256)
      mug.rotation = Math.PI
      mug.position.set(0.5 * i + 2, 0)
      // If half money => crop width
      if (i + 1 >= cur_mugs) mug.texture = new PIXI.Texture(mug.texture, new PIXI.Rectangle(128, 0, 128, 256))
      this.graphic.addChild(mug)
    }
    const step = Level.ActiveLevel.width / (PlayerHealth.total_player_count)
    const margin = (step - 7.5) / 2
    this.graphic.position.set(step * this._player_index + margin, 0)
    this.graphic.pivot.set(0, this.graphic.height / 2)
  }

  static _GetHalfHearts(health) {
    return Math.ceil(10 / conf.player_hp * health)
  }
}

export { PlayerUI }
