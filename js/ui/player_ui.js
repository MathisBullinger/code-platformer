import * as PIXI from 'pixi.js'
import { Level } from './../level'
import { game_config as conf } from './../game_config'

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
    this.graphic.clear()
    this.graphic.beginFill(0x000000)
    // Get screen center
    const center = window.innerWidth / 2
    // Draw coffee mugs
    const half_mugs = PlayerHealth._GetHalfHearts(this._player.health)
    for (let i = 0; i <= half_mugs; i += 2) {
      this.graphic.drawRect(10 * i, 0, ((i + 1 === half_mugs) ? 7.5 : 15), 15)
    }
    this.graphic.endFill()
    this.graphic.position.set(center, 32)
    this.graphic.pivot.set(this.graphic.width / 2, this.graphic.height / 2)
  }

  static _GetHalfHearts(health) {
    return Math.round(10 / conf.player_hp * health)
  }
}

export { PlayerUI }
