import '../style/master.scss'
import {Game} from './game'
import {Mainmenu, LvlSelect} from './menus'
import {GetUrlParam} from './util'

// disable Parcel.js HMR
if (module.hot) {
  module.hot.dispose(function() {
    window.location.reload()
  })
}

// directly start game if "state=game"
if (GetUrlParam('state') == 'game') {
  let game = new Game()
  game.Start()
} else {
  // shwo main menu
  const menu = new Mainmenu()
  menu.Show()
  menu.OnButton('start', () => {
    const lvl_select = new LvlSelect()
    lvl_select.Show()
    lvl_select.OnLvlSelect(lvl => {
      // start game
      let game = new Game()
      game.Start(lvl)
    })
  })
}
