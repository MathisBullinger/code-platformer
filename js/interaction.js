import { Vec2D } from './math'

/*
 * Keyboard Class
 */
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

/*
 * Gamepad Class
 */
class Gamepad {

  /*
   * enable / disable gamepad listening
   */
  static Listen(b = true) {
    if (b) {
      window.addEventListener('gamepadconnected', e => this._HandleGamepadConnected(e))
    } else {
      window.removeEventListener('gamepadconnected', this._HandleGamepadConnected)
    }
  }

  /*
   * Bind Input
   */
  static BindInput(input, callback, input_reset = false) {
    if (!this._inputbindings) this._inputbindings = []
    if (!this._inputbindings.map(bind => bind.input).includes(input))
      this._inputbindings.push({input: input.toLowerCase(), actions: [], input_reset: input_reset})
    // bind callback to input
    const binding = this._inputbindings.find(bind => bind.input == input.toLowerCase())
    if (!binding.actions.includes(callback)) binding.actions.push(callback)
  }

  /*
   * Get Direction of Stick
   */
  static GetStick(stick = 'left') {
    return stick == 'left' ?
      new Vec2D(navigator.getGamepads()[0].axes[0], navigator.getGamepads()[0].axes[1]) :
      new Vec2D(navigator.getGamepads()[0].axes[2], navigator.getGamepads()[0].axes[3])
  }

  /*
   * Update (call actions if bound input is active)
   */
  static Update(dt) {
    if (!this._controllers || this._controllers.length == 0) return
    const pad = new XboxController(navigator.getGamepads()[0])
    for (let binding of this._inputbindings) {
      if (pad.inputs[binding.input]) {
        if (!binding.blocked) {
          for (let callback of binding.actions) {
            callback(dt, pad.inputs[binding.input])
          }
        }
        if (binding.input_reset)
          binding.blocked = true
      } else {
        if (binding.input_reset)
          binding.blocked = false
      }
    }
  }

  /*
   * connect gamepad
   */
  static _HandleGamepadConnected(e) {
    if (!this._controllers) this._controllers = []
    console.log('Gamepad connected at index %d: %s. %d buttons, %d axes.',
      e.gamepad.index, e.gamepad.id, e.gamepad.buttons.length, e.gamepad.axes.length)
    this._controllers.push(e.gamepad.id)
  }
}

/*
 * Xbox 360 Interface for Gamepad
 */
class XboxController {
  constructor(pad) {
    this.inputs = {
      // face buttons
      a: pad.buttons[0].value,
      b: pad.buttons[1].value,
      x: pad.buttons[2].value,
      y: pad.buttons[3].value,
      // bumpers
      LB: pad.buttons[4].value,
      RB: pad.buttons[5].value,
      // triggers
      LT: pad.buttons[6].value,
      RT: pad.buttons[7].value,
      // control buttons
      back: pad.buttons[8].value,
      start: pad.buttons[9].value,
      l3: pad.buttons[10].value,
      r3: pad.buttons[11].value,
      // d-pad
      d_up: pad.buttons[12].value,
      d_down: pad.buttons[13].value,
      d_left: pad.buttons[14].value,
      d_right: pad.buttons[15].value,
      // xbox button
      guide: pad.buttons[16].value,
      // sticks
      stick_left_x: pad.axes[0],
      stick_left_y: pad.axes[1] * -1,
      stick_right_x: pad.axes[2],
      stick_right_y: pad.axes[3] * -1
    }
  }
}

export { Keyboard, Mouse, Gamepad }
