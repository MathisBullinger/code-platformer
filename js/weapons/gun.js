import { Weapon } from './weapon'
import { Vec2D } from './../math'

class Gun extends Weapon {
  constructor() {
    super(new Vec2D(0, 0.4), new Vec2D(0.2, 0.6))
  }
}

export { Gun }
