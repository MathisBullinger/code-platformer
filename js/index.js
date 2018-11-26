import '../style/master.scss'
import * as PIXI from 'pixi.js'
import { Game } from './game'

// disable Parcel.js HMR
if (module.hot) {
  module.hot.dispose(function () {
    window.location.reload();
  });
}

// start game
let game = new Game()
game.Start()
