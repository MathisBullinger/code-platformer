import { RandomWeaponSpawn } from './weapon_spawns/random_weapon_spawn'
import { NormalWeaponSpawn } from './weapon_spawns/normal_weapon_spawn'
import { Physics } from './physics'

/**
 * Holds all the spawn in the world
 */
class Spawns {
  constructor() {
    this._weapon_spawns = []
    this._player_spawns = []
  }

  /**
   * Update the spawn point system.
   * Updates all spawns in the scene and checks if the player intersects with
   * one of them. If the player does intersect, the TakeWeapon() function is triggered.
   */
  Update(dt, player) {
    for (let wp_spawn of this._weapon_spawns) {
      wp_spawn.Update(dt)
      // Check if player can take weapon
      if (wp_spawn.hasWeapon && Physics.DoBoxesIntersect(wp_spawn, player)) {
        player.SetWeapon(wp_spawn.TakeWeapon())
      }
    }
  }

  /**
   * Adds a new weapon spawn to the scene.
   * type: Type of weapon spawn. [1: RandomWeaponSpawn]
   * pos: Position of weapon spawn
   * scene: PIXI scene which should contain the spawn
   */
  AddWeaponSpawn(type, pos, scene) {
    let spawn = null
    // Create spawn that correlates to type parameter
    switch (type) {
      case 1:
        spawn = new RandomWeaponSpawn(pos)
        break
      case 2:
        spawn = new NormalWeaponSpawn(pos)
        break
      default:
        return
    }
    // Add weapon spawn to list and scene
    this._weapon_spawns.push(spawn)
    scene.addChild(spawn.graphic)
  }

  AddPlayerSpawn(pos) {
    this._player_spawns.push(pos)
  }

  GetRandomPlayerSpawn() {
    return this._player_spawns[Math.floor(Math.random() * this._player_spawns.length)]
  }
}

export { Spawns }
