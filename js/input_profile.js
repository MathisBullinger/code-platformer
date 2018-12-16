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

  IsDashUp() {
    console.log(key._GetKeyObj('w'))
    return key._GetKeyObj('w') || key._GetKeyObj('arrowup')
  }
}

class InputGamepad {
  Init(player) {
    this._pad = InputGamepad.counter
    InputGamepad.counter++
    this._player = player
    console.log(`bind to player ${player._player_number} to gamepad ${this._pad}`)
    // move
    Gamepad.BindInput(this._pad, 'stick_left_x', (dt, value) => {
      if (value > 0) this._player.MoveRight(dt)
      else this._player.MoveLeft(dt)
    })
    // jump
    Gamepad.BindInput(this._pad, 'A', dt => this._player.Jump(dt), true)
    Gamepad.BindInput(this._pad, 'LB', dt => this._player.Jump(dt), true)
    // dash
    Gamepad.BindInput(this._pad, 'RB', () => this._player.Dash(), true)
    // attack
    Gamepad.BindInput(this._pad, 'RT', () => this._player.Attack())
  }

  Update() {

  }

  GetViewDir() {
    const stick_dir = Gamepad.GetStick('right', this._pad)
    if (stick_dir.x || stick_dir.y)
      return new Vec2D(stick_dir.x, stick_dir.y * -1)
    else
      return null
  }

  IsDashUp() {
    const view_dir = this.GetViewDir()
    if (view_dir)
      return Vec2D.AngleDegrees(Vec2D(0, 1), view_dir) < 10
    return false
  }
}
InputGamepad.counter = 0

export { InputKeyboard, InputGamepad }
