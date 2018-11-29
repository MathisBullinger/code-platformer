import { Weapon } from './weapon'
import { Vec2D } from './../math'
import { Mouse } from './../interaction'
import { Arrow } from './arrow'
import { app } from './../graphics'

class Bow extends Weapon {

  constructor() {
    super(new Vec2D(0, 1.1), new Vec2D(0.9, 0.1))

    this._shot_arrows = []
  }

  Update(dt) {
    // Update parent
    super.Update(dt)

    // If left mouse button down => spawn arrow
    if (Mouse.IsDown(0)) {
      this._shot_arrows.push(new Arrow(this))
    }

    // Update all shot arrows
    for (let arr of this._shot_arrows) {
      arr.Update(dt)
    }

    // Filter arrows. If y pos below 0 => delete
    this._shot_arrows = this._shot_arrows.filter(arr => {
      if (arr.pos.y >= 0){
        return true
      } else {
        app.stage.children[0].removeChild(arr.graphic)
        return false
      }
    })
  }
}

export { Bow }
