import { Graphics } from './graphics'

class Game {

  constructor() {
    this._graphics = new Graphics()
  }

  Start() {
    this._graphics.Init(document.getElementById('game-wrap'))
  }

}

export { Game }
