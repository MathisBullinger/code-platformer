import { Vec2D } from './math'

class Physics {

  /*
   * Update
   */
  static Update(dt, lvl) {
    // apply gravity to player
    Physics._Accelerate(lvl._player.vel, lvl._gravity, dt)
    // update player position
    lvl._player.Update(dt)

    // update projectiles
    for (let prj of lvl._projectiles) {
      // If any collision => remove projectiles
      if (Physics._GetColliding(prj.graphic, lvl._block_grid).length !== 0) {
        lvl.RemoveProjectiles(prj)
      }
      prj.Update(dt) // Update projectile
    }

    // check for collisions
    const collisions = Physics._GetColliding(lvl._player, lvl._block_grid)
    if (collisions.length > 0) {
      // solve collisions
      for (let col of collisions) {
        Physics._SolveCollision(lvl._player, col)
      }
    } else {
      // no collision => in air
      if (lvl._player.has_ground_contact) {
        lvl._player.jump_counter++
        lvl._player.has_ground_contact = false
      }
    }

  }

  /*
   * Solve Collision
   */
  static _SolveCollision(rect1, rect2) {

    const GetCollisionFace = () => {
      let faces = []
      //rect2.x + rect2.width - rect1.x
      if (rect2._collision_sides.right) faces.push({name: 'right', value: rect2.x + rect2.width - rect1.x})
      if (rect2._collision_sides.bottom) faces.push({name: 'bottom', value: rect1.y + rect1.height - rect2.y})
      if (rect2._collision_sides.left) faces.push({name: 'left', value: rect1.x + rect1.width - rect2.x})
      if (rect2._collision_sides.top) faces.push({name: 'top', value: rect2.y + rect2.height - rect1.y})
      for (let face of faces) {
        if (face.value > rect1.width / 2)
          faces.splice(faces.indexOf(face), 1)
      }
      return faces.length ? faces.find(face => face.value == Math.min(...faces.map(face => face.value))).name : null
    }

    const offset = 0
    switch(GetCollisionFace()) {
      case 'top':
        rect1.has_ground_contact = true
        if (rect1.vel.y < 0) rect1.vel.y = 0
        rect1.pos.y = rect2.y + rect2.height + offset
        break
      case 'bottom':
        if (rect1.vel.y > 0) rect1.vel.y = 0
        rect1.pos.y = rect2.y - rect1.height - offset
        break
      case 'right':
        if (rect1.vel.x < 0) rect1.vel.x = 0
        rect1.pos.x = rect2.pos.x + rect2.width + offset
        break
      case 'left':
        if (rect1.vel.x > 0) rect1.vel.x = 0
        rect1.pos.x = rect2.pos.x - rect1.width - offset
        break
    }

  }

  /**
   * bool DoBoxesIntersect(Box a, Box b) {
   * return (abs(a.x - b.x) * 2 < (a.width + b.width)) &&
   *      (abs(a.y - b.y) * 2 < (a.height + b.height));
   * }
   */
  static DoBoxesIntersect(a, b) {
    return (a.pos.x < b.pos.x + b.scale.x &&
            a.pos.x + a.scale.x > b.pos.x &&
            a.pos.y < b.pos.y + b.scale.y &&
            a.pos.y + a.scale.y > b.pos.y)
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
  // Apply Acceleration
  //
  static _Accelerate(tar, acc, dt) {
    const tar_new = Vec2D.Add(tar, Vec2D.Mult(acc, dt / 1000))
    tar.Set(tar_new.x, tar_new.y)
  }

}

export { Physics }
