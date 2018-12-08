import { Keyboard as key, Gamepad, Mouse } from './interaction'
import { Vec2D } from './math'
import { renderer } from './graphics'

class InputKeyboard {
  Init(player) {
    this._player = player
    // arrow keys
    key.BindKey('ArrowLeft', dt => player.MoveLeft(dt))
    key.BindKey('ArrowRight', dt => player.MoveRight(dt))
    key.BindKey('ArrowUp', dt => player.Jump(dt), true)
    // wasd
    key.BindKey('A', dt => player.MoveLeft(dt))
    key.BindKey('D', dt => player.MoveRight(dt))
    key.BindKey('W', dt => player.Jump(dt), true)
    // dash
    key.BindKey('Shift', () => player.Dash(), true)
  }

  Update() {
    if (Mouse.IsDown()) this._player.Attack()
  }

  // get view direction relative to position
  GetViewDir(obj) {
    // Get screen coordinates (bottom-left based) for the mouse
    const screen_mouse_pos = this._GetMousePos()
    // Get screen coordinates (bottom-left based) for the weapon holster
    const screen_holster_pos = new Vec2D(
      obj.graphic.parent.worldTransform.tx,
      window.innerHeight - obj.graphic.parent.worldTransform.ty)
    // Get the distance between the two => direction vector
    const distance = Vec2D.Sub(screen_mouse_pos, screen_holster_pos)
    return Vec2D.Div(distance, distance.Magnitude) // normalize
  }

  _GetMousePos() {
    return new Vec2D(
      renderer.plugins.interaction.mouse.global.x,
      window.innerHeight - renderer.plugins.interaction.mouse.global.y
    )
  }
}

class InputGamepad {
  Init(player) {
    this._player = player

    // move
    Gamepad.BindInput('stick_left_x', (dt, value) => {
      if (value > 0) this._player.MoveRight(dt)
      else this._player.MoveLeft(dt)
    })
    // jump
    Gamepad.BindInput('A', dt => this._player.Jump(dt), true)
    Gamepad.BindInput('LB', dt => this._player.Jump(dt), true)
    // attack
    Gamepad.BindInput('RT', () => this._player.Attack())
  }

  Update() {

  }

  GetViewDir() {
    const stick_dir = Gamepad.GetStick('right')
    if (stick_dir.x || stick_dir.y)
      return new Vec2D(stick_dir.x, stick_dir.y * -1)
    else
      return null
  }
}

export { InputKeyboard, InputGamepad }
