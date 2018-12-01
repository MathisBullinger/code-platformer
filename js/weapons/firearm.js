import { Weapon } from './weapon'

/*
 * Firearm Class
 * any kind of shootable weapon
 */
class Firearm extends Weapon {
  constructor(pos, scale, cooldown) {
    super(pos, scale, cooldown)
  }

  Shoot() {
    
  }
}

export { Firearm }
