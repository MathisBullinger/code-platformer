class Keyboard {

  static Listen(b = true) {
    if (b) {
      Keyboard._keys_down = []
      window.addEventListener('keydown', this._HandleKeyDown)
      window.addEventListener('keyup', this._HandleKeyUp)
    } else {
      window.removeEventListener('keydown', this._HandleKeyDown)
      window.removeEventListener('keyup', this._HandleKeyUp)
    }
  }

  static IsDown(key) {
    return Keyboard._keys_down.includes(key)
  }

  static _HandleKeyDown(e) {
    if (!Keyboard._keys_down.includes(e.key))
      Keyboard._keys_down.push(e.key)
  }

  static _HandleKeyUp(e) {
    if (Keyboard._keys_down.includes(e.key))
      Keyboard._keys_down.splice(Keyboard._keys_down.indexOf(e.key), 1)
  }

}

export { Keyboard }
