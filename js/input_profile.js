import { Keyboard as key, Gamepad, Mouse } from './interaction'

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
}

export { InputKeyboard }
