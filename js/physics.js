import { Vec2D, Line } from './math'
import { Movable } from './game_object'

class Physics {

  //
  // Update
  //
  static Update(dt, lvl) {
    // apply gravity
    Physics._Accelerate(lvl._player.vel, lvl._gravity, dt)

    // update position
    lvl._player.Update(dt)

    // check for collisions
    const collisions = Physics._GetColliding(lvl._player, lvl._block_grid)
    if (collisions.length > 0) {
      // solve collisions
      for (let col of collisions) {
        Physics._SolveCollision(lvl._player, col)
      }
    }
  }

  //
  // Solve Collision
  //
  static _SolveCollision(rect1, rect2) {
    const rect1_bottom = rect1.y + rect1.height;
    const rect2_bottom = rect2.y + rect2.height;
    const rect1_right = rect1.x + rect1.width;
    const rect2_right = rect2.x + rect2.width;

    const b_collision = rect2_bottom - rect1.y;
    const t_collision = rect1_bottom - rect2.y;
    const l_collision = rect1_right - rect2.x;
    const r_collision = rect2_right - rect1.x;

    if (b_collision < t_collision && b_collision < l_collision && b_collision < r_collision) {
      // bottom collision
      rect1.hasGroundContact = true
      rect1.vel.y = 0
      rect1.pos.y = rect2.y + rect2.height
    }
    else if (t_collision < b_collision && t_collision < l_collision && t_collision < r_collision) {
      // top collision
      rect1.vel.y = 0
      rect1.pos.y = rect2.y - rect1.height
    }
    else if (r_collision < l_collision && r_collision < t_collision && r_collision < b_collision) {
      // right collision
      rect1.vel.x = 0
      rect1.pos.x = rect2.pos.x + rect2.width
    }
    else if (l_collision < r_collision && l_collision < t_collision && l_collision < b_collision) {
      // left collision
      rect1.vel.x = 0
      rect1.pos.x = rect2.pos.x - rect1.width
    }
  }

  //
  // Get Colliding
  // returns array of blocks that rect collides with
  //
  static _GetColliding(rect, grid_comp) {
    // rasterize player
    let collision_points = []
    for (let x = Math.floor(rect.x); x <= Math.floor(rect.x + rect.width); x++) {
      for (let y = Math.floor(rect.y); y <= Math.floor(rect.y + rect.height); y++) {
        collision_points.push(new Vec2D(x, y))
      }
    }
    // get collisions
    let collisions = []
    for (let p of collision_points) {
      if (p.x < 0 || p.y < 0)
        continue
      if (p.x >= grid_comp.length || p.y >= grid_comp[p.x].length)
        continue
      if (grid_comp[p.x][p.y])
        collisions.push(grid_comp[p.x][p.y])
    }
    return collisions
  }

  //
  // check collision of point & rect
  //
  static _CollidePointRect(point, rect) {
    return (point.x >= rect.x && point.x <= rect.x + rect.width && point.y >= rect.y && point.y <= rect.y + rect.height)
  }

  //
  // Apply Acceleration
  //
  static _Accelerate(tar, acc, dt) {
    const tar_new = Vec2D.add(tar, Vec2D.mult(acc, dt / 1000))
    tar.set(tar_new.x, tar_new.y)
  }

}

export { Physics }
