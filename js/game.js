import { game_config } from './game_config'
import { Graphics, app } from './graphics'
import { Keyboard, Mouse, Gamepad } from './interaction'
import { World } from './world'
import { UI } from './ui/user_interface'

class Game {

  constructor() {
    this._graphics = new Graphics()
    this._world
  }

  //
  // Start Game
  //
  Start() {
    // load config
    Clone(require('../data/config.json'), game_config)

    // init graphics
    this._graphics.Init(document.getElementById('game-wrap'))

    // create game world
    this._world = new World()
    this._graphics.AddScene(this._world.scene)

    this._ui = new UI()
    this._graphics.AddScene(this._ui.graphic)

    // start event listening
    Keyboard.Listen()
    Mouse.Listen()
    Gamepad.Listen()

    app.ticker.add(this._GameLoop.bind(this, app.ticker.elapsedMS))
  }

  _GameLoop(dt) {
    const max_timestep = 60
    if (dt > max_timestep) dt = max_timestep
    Keyboard.Update(dt)
    Gamepad.Update(dt)
    if (this._world) {
      this._world.Update(dt)
      this._ui.Update()
    }
  }
}

//
// Clone Object
//
function Clone(src, tar) {
  for (let prop in src) {
    if (src.hasOwnProperty(prop)) {
      tar[prop] = src[prop]
    }
  }
}

export { Game }
