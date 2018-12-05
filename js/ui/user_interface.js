import * as PIXI from 'pixi.js'
import { Level } from './../level'
import { PlayerUI } from './player_ui'

class UI {

  constructor() {
    this.graphic = new PIXI.Container()
    this._setLevel(Level.ActiveLevel)
  }

  Update() {
    if (this._current_level !== Level.ActiveLevel) this._setLevel(Level.ActiveLevel)
    this._player_ui.Update()
  }

  _setLevel(lvl) {
    this._current_level = lvl
    this._player_ui = new PlayerUI([this._current_level._player])
    this.graphic.addChild(this._player_ui.graphic)
  }
}

export { UI }
