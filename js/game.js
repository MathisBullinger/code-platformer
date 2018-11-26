import { Graphics } from './graphics'
import { game_config } from './game_config'

class Game {

  constructor() {
    this._graphics = new Graphics()
  }

  //
  // Start Game
  //
  Start() {
    // load config
    Clone(require('../data/config.json'), game_config)

    // init graphics
    this._graphics.Init(document.getElementById('game-wrap'))
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

export {
  Game
}
