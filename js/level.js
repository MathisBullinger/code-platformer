import { GameObject } from './game_object'
import { Player } from './player'
import { Vec2D } from './math'
import { Physics } from './physics'
import { Spawns } from './spawns'

class Level {

  constructor(parent_scene) {
    // Declare attributes for later
    this._gravity = null
    this._player = null
    // List of per level entities
    this._blocks = []
    this._block_grid = []
    this._projectiles = []
    // Spawns system
    this._spawns = new Spawns()
    // Save parent scene and current level
    this._parent_scene = parent_scene
    Level._active_level = this
    this._lower_death_cap = -5 // kill below
  }

  Update(dt) {
    // Apply physics to this level
    Physics.Update(dt, this)
    // Update Spawns
    this._spawns.Update(dt, this._player)

    // kill player if below death cap
    if (!this._player.dead && this._player.y < this._lower_death_cap)
      this._player.Kill()

    // respawn player if dead
    if (this._player.dead)
      this._player.Respawn()

    // remove projectiles below death cap
    const delete_list = this._projectiles.filter(prj => prj.pos.y <= this._lower_death_cap)
    this.RemoveProjectiles(delete_list)

  }

  static get ActiveLevel() {
    return Level._active_level
  }

  AddProjectiles(...prj) {
    this._projectiles.push(...prj)
    this._parent_scene.addChild(...(prj.map(pr => pr.graphic)))
  }

  RemoveProjectiles(...prj) {
    this._parent_scene.removeChild(...(prj.map(pr => pr.graphic)))
    this._projectiles = this._projectiles.filter(pr => !([ ...prj ]).includes(pr))
  }

  /**
    * This loads the scene
    */
  Load(data, scene) {
    // Prepare variables
    const layers = data.layers
    let blocks = null
    let spawnpoints = null
    // Iterate all layers and assign helpers
    for (let layer of layers) {
      if (layer.name == 'world') {
        blocks = layer.data
      } else if (layer.name === 'spawnpoints') {
        spawnpoints = layer.data
      }
    }
    // We need level data
    if (!blocks) {
      console.error('no world layer found in level file')
      return
    }
    // Calculate width and height
    this.width = data.canvas.width / 32
    this.height = blocks.length / this.width
    // Check level intact
    if (blocks.length != this.width * this.height)
      console.warn('number of blocks doesn\'t match up height & width')
    // Iterate the data and add blocks to level
    for (let i = 0; i < blocks.length; i++) {
      const material = blocks[i]
      if (material != 1) continue
      let block = new GameObject(new Vec2D(Math.floor(i % this.width), this.height - Math.floor(i / this.width) - 1))
      this._blocks.push(block)
      scene.addChild(block.graphic)
    }
    if (spawnpoints !== null) {
      // Iterate the "spawnpoints" data and add _spawnpoints
      for (let i = 0; i < spawnpoints.length; i++) {
        if (spawnpoints[i] !== 1) continue
        this._spawns.AddWeaponSpawn(new Vec2D(Math.floor(i % this.width), this.height - Math.floor(i / this.width) - 1), scene)
      }
    }
    // gravity
    this._gravity = new Vec2D(0, -35)
    this._GenLvlGrid()
    // player
    this._player = new Player(new Vec2D(5.1, 3))
    scene.addChild(this._player.graphic)
  }

  /**
    * Generate level grid from list of blocks
    */
  _GenLvlGrid() {
    // get max x & y
    let blocks = this._blocks
    if (blocks.length == 0) return []
    if (blocks.length == 1) return [blocks[0]]
    let max_x = 0
    let max_y = 0
    for (let block of blocks) {
      if (block.x > max_x)
        max_x = block.x
      if (block.y > max_y)
        max_y = block.y
    }
    // lookup block at position
    let GetBlock = (x, y) => {
      for (let block of this._blocks) {
        if (block.x == x && block.y == y)
          return block
      }
      return null
    }
    // generate grid
    this._block_grid = []
    for (let x = 0; x <= max_x; x++) {
      let column = []
      for (let y = 0; y <= max_y; y++) {
        column.push(GetBlock(x, y))
      }
      this._block_grid.push(column)
    }

    this._LogGrid()
  }

  //
  // print block grid to console
  //
  _LogGrid() {
    let str = '\u250C' + '\u2500'.repeat(this._block_grid.length + 2) + '\u2510\n'
    if (this._block_grid.length > 0) {
      for (let y = this._block_grid[0].length - 1; y >= 0 ; y--) {
        str += '\u2502 '
        for (let x = 0; x < this._block_grid.length; x++) {
          str += this._block_grid[x][y] ? '\u2588' : ' '
        }
        str += ' \u2502\n'
      }
    }
    str += '\u2514' + '\u2500'.repeat(this._block_grid.length + 2) + '\u2518'
    console.log(' =Block Grid=\n\n' + str)
  }

}

export {
  Level
}
