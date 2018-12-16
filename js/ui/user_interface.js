import * as PIXI from 'pixi.js'
import { Level } from '../level'
import { PlayerUI } from './player_ui'
import { GetUrlParam } from '../util'

class UI {

  constructor() {
    this.graphic = new PIXI.Container()
    if (GetUrlParam('state') == 'lvl_view')
      this.graphic.visible = false
    this._setLevel(Level.ActiveLevel)
  }

  Update() {
    if (this._current_level !== Level.ActiveLevel) this._setLevel(Level.ActiveLevel)
    this._player_ui.Update()
  }

  _setLevel(lvl) {
    this._current_level = lvl
    this._player_ui = new PlayerUI(this._current_level._players)
    this.graphic.addChild(this._player_ui.graphic)
  }
}

export { UI }
