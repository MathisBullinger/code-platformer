import { game_config } from './game_config'
import { Graphics, app } from './graphics'
import { Keyboard, Mouse } from './interaction'
import { World } from './world'

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

    // start event listening
    Keyboard.Listen()
    Mouse.Listen()

    app.ticker.add(() => this._GameLoop(app.ticker.elapsedMS))
  }

  _GameLoop(dt) {
    if (dt > 100) dt = 100 // prevent tunnelling
    if (this._world) this._world.Update(dt)
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
