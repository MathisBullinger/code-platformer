import '../style/master.scss'
import {Game} from './game'
import {Mainmenu} from './mainmenu'
import {GetUrlParam} from './util'

// disable Parcel.js HMR
if (module.hot) {
  module.hot.dispose(function() {
    window.location.reload()
  })
}

console.log(`Started game in '${ process.env.NODE_ENV }' mode`)

// directly start game if "state=game"
if (GetUrlParam('state') == 'game') {
  let game = new Game()
  game.Start()
} else {
  // shwo main menu
  const menu = new Mainmenu()
  menu.Show()
  menu.OnStart(() => {
    // start game
    let game = new Game()
    game.Start()
  })
}
