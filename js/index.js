import '../style/master.scss'
import { Game } from './game'
import { Mainmenu } from './mainmenu'

// disable Parcel.js HMR
if (module.hot) {
  module.hot.dispose(function () {
    window.location.reload()
  })
}

// shwo main menu
const menu = new Mainmenu()
menu.Show()
menu.OnStart(() => {
  // start game
  let game = new Game()
  game.Start()
})
