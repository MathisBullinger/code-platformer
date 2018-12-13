class Menu {
  Show() {

  }

  OnButton(bt_class, callback) {
    const bt = this._wrap.getElementsByClassName(bt_class)[0]
    if (!bt) {
      console.error('button "' + bt_class + '" doesn\'t exist')
      return
    }
    bt.addEventListener('click', () => {
      this._wrap.style.display = 'none'
      callback()
    })
  }
}

class Mainmenu extends Menu {
  Show() {
    this._wrap = document.getElementsByClassName('menu-wrap')[0]
    if (!this._wrap) return
    this._wrap.style.display = 'block'
  }
}

class LvlSelect extends Menu {
  Show() {
    this._wrap = document.getElementsByClassName('lvl-select-wrap')[0]
    if (!this._wrap) return
    this._wrap.style.display = 'block'
    const logo = this._wrap.getElementsByClassName('logo')[0]
    setTimeout(() => {
      logo.style.top = '34vh'
      logo.style.left = '52vw'
      logo.style.transform = 'translateX(-50%) translateY(-20%) scaleX(0.6) scaleY(0.6)'
    }, 100)
  }

  OnLvlSelect(callback) {
    const levels = this._wrap.getElementsByClassName('lvl-select-frame')
    for (let i = 0; i < levels.length; i++) {
      levels[i].addEventListener('click', () => {
        this._wrap.style.display = 'none'
        callback(i)
      })
    }

  }
}

export { Mainmenu, LvlSelect }
