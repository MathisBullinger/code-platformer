import { Vec2D } from './math'
import { Movable } from './game_object'

class Physics {

  static Update(dt, lvl) {
    // apply gravity
    if (lvl._gravity) {
      if (lvl._player)
        lvl._player.vel = Vec2D.add(lvl._player.vel, Vec2D.mult(lvl._gravity, dt / 1000))
    }

    if (lvl._player) {
      //let i_coll = -1
      let collisions = []
      for (let block of lvl._blocks) {
        if (Physics._CollRect2(lvl._player, block)) {
          collisions.push(block)
        }
      }
      
      for (let block of collisions) {
        lvl._player.vel.y = 0
        lvl._player.pos.y = block.y + block.height
      }
    }

    // update position
    if (lvl._player)
      lvl._player.Update(dt)

  }

  //
  // Collision Detection
  //
  static _CollRect2(go1, go2) {
    return (
      Physics._CollPointRect(new Vec2D(go1.pos.x, go1.pos.y), go2) ||
      Physics._CollPointRect(new Vec2D(go1.pos.x, go1.pos.y + go1.height), go2) ||
      Physics._CollPointRect(new Vec2D(go1.pos.x + go1.width, go1.pos.y + go1.height), go2) ||
      Physics._CollPointRect(new Vec2D(go1.pos.x + go1.width, go1.pos.y), go2)
    )
  }

  static _CollPointRect(point, rect) {
    return (
      point.x >= rect.x &&
      point.x <= rect.x + rect.width &&
      point.y >= rect.y &&
      point.y <= rect.y + rect.height
    )
  }

}

export { Physics }
