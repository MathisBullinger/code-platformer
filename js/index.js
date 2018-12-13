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

console.log(`Started game in '${ process.env.NODE_ENV }' mode`)

// directly start game if "state=game"
if (GetUrlParam('state') == 'game') {
  let game = new Game()
  const lvl_par = GetUrlParam('lvl')
  let lvl = 3
  if (lvl_par) {
    lvl = parseInt(lvl_par)
    if (isNaN(lvl))
      lvl = 3
  }
  game.Start(lvl)
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
