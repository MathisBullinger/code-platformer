import { WeaponSpawn } from './weapon_spawn'

class Spawns {
  constructor() {
    this._weapon_spawns = []
  }

  Update(dt, player) {
    for (let wp_spawn of this._weapon_spawns) {
      wp_spawn.Update(dt)
      if (wp_spawn.HasWeapon && Spawns._GetIntersects(wp_spawn.graphic, player.graphic)) {
        player.SetWeapon(wp_spawn.TakeWeapon())
      }
    }
  }

  AddWeaponSpawn(pos, scene) {
    const spawn = new WeaponSpawn(pos)
    this._weapon_spawns.push(spawn)
    scene.addChild(spawn.graphic)
  }

  static _GetIntersects(spawn, player) {
    return (spawn.x + 0.5 < player.x + player.width &&
            spawn.x + 0.5 + spawn.width / 2 > player.x &&
            spawn.y+ 0.5 < player.y + player.height &&
            spawn.height / 2 + spawn.y + 0.5 > player.y)
  }
}

export { Spawns }
