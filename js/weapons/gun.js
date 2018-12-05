import { Firearm } from './firearm'
import { Vec2D } from './../math'
import { Bullet } from './bullet'
import { Images } from './../images'

/**
  * Weapon specialization. Shoots fast (not yet)
  */
class Gun extends Firearm {
  /**
    * Initializes
    */
  constructor() {
    super(new Vec2D(0, 0.4), new Vec2D(0.2, 0.6), 400)
    this.ammunition = Bullet
  }

  _GetGraphic() {
    return Images.Gun
  }
}

export { Gun }
