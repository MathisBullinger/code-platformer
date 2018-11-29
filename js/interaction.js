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

/**
  * Mouse class for handling mouse interaction
  */
class Mouse {
  /**
    * Enable / disable mouse event listening
    */
  static Listen(b = true) {
    // If should listen => add event listener
    if (b) {
      Mouse._button_down = []
      window.addEventListener('mousedown', this._HandleButtonDown)
      window.addEventListener('mouseup', this._HandleButtonUp)
    } else { // Remove event listner
      window.removeEventListener('mousedown', this._HandleButtonDown)
      window.removeEventListener('mouseup', this._HandleButtonUp)
    }
  }

  /**
    * Check if mouse button is pressed
    */
  static IsDown(button) {
    return Mouse._button_down.includes(button)
  }

  /**
    * Adds the mouse button of an event to the list of currently
    * pressed buttons
    */
  static _HandleButtonDown(e) {
    if (!Mouse._button_down.includes(e.button))
      Mouse._button_down.push(e.button)
  }

  /**
    * Removes the mouse button of an event from the list of currently
    * pressend buttons
    */
  static _HandleButtonUp(e) {
    if (Mouse._button_down.includes(e.button))
      Mouse._button_down.splice(Mouse._button_down.indexOf(e.button), 1)
  }
}

export { Keyboard, Mouse }
