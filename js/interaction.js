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

  /*
   * check key status
   */
  static _GetKeyObj(key) {
    return Keyboard._keys_down.find(i => i.key === key)
  }

  static IsActive(key) { // active = pressed & not blocked
    const obj_key = Keyboard._GetKeyObj(key)
    return !obj_key ? false : !obj_key.blocked
  }

  /*
   * handle JS key events
   */
  static _HandleKeyDown(e) {
    if (!Keyboard._keys_down.map(i => i.key).includes(e.key.toLowerCase()))
      Keyboard._keys_down.push({key: e.key.toLowerCase(), blocked: false})
  }

  static _HandleKeyUp(e) {
    const obj_key = Keyboard._GetKeyObj(e.key.toLowerCase())
    if (obj_key) {
      Keyboard._keys_down.splice(Keyboard._keys_down.indexOf(obj_key), 1)
    }
  }

  /*
   * bind function to keypress
   */
  static BindKey(key, callback, key_reset = false) {
    key = key.toLowerCase()
    if (!this._keybindings) this._keybindings = []
    // add key if not alrady bound
    if (!this._keybindings.map(bind => bind.key).includes(key))
      this._keybindings.push({key: key, actions: [], key_reset: key_reset})
    // bind callback to key
    const binding = this._keybindings.find(bind => bind.key == key)
    if (!binding.actions.includes(callback)) binding.actions.push(callback)
  }

  /*
   * Update (call functions bound to keys)
   */
  static Update(dt) {
    for (let binding of this._keybindings) {
      if (Keyboard.IsActive(binding.key)) {
        for (let callback of binding.actions)
          callback(dt)
        if (binding.key_reset)
          Keyboard._GetKeyObj(binding.key).blocked = true
      }
    }
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
