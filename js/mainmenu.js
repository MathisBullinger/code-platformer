class Mainmenu {
  Show() {
    this._wrap = document.getElementsByClassName('menu-wrap')[0]
    if (!this._wrap) return
    this._wrap.style.display = 'block'
  }

  OnStart(callback) {
    const bt_start = this._wrap.getElementsByClassName('start')[0]
    bt_start.addEventListener('click', () => {
      this._wrap.style.display = 'none'
      callback()
    })
  }
}

export { Mainmenu }
