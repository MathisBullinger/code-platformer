import { GameObject } from './game_object'
import { Player } from './player'
import { Vec2D } from './math'
import { Physics } from './physics'
import { game_config as conf } from './game_config'
import { Spawns } from './spawns'
import { GetUrlParam } from './util'
import { Sprites } from './sprites'
import { InputKeyboard, InputGamepad } from './input_profile'

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
    // list of players
    this._players = []
  }

  Update(dt) {
    // Apply physics to this level
    Physics.Update(dt, this)

    this._players.forEach(player => {

      // Update Spawns
      this._spawns.Update(dt, player)

      // kill player if below death cap
      if (!player.dead && player.y < this._lower_death_cap)
        player.Kill()

      // respawn player if dead at a random position
      if (player.dead)
        player.Respawn(this._spawns.GetRandomPlayerSpawn())

    })

    // remove projectiles below death cap
    const delete_list = this._projectiles.filter(prj => prj.pos.y <= this._lower_death_cap)
    if (delete_list.length > 0) this.RemoveProjectiles(...delete_list)

  }

  static get ActiveLevel() {
    return Level._active_level
  }

  AddProjectiles(...prj) {
    this._projectiles.push(...prj)
    this._parent_scene.addChild(...(prj.map(pr => pr.graphic)))
  }

  RemoveProjectiles(...prj) {
    prj.forEach(p => {
      p.RemoveMoveVec()
    })
    this._parent_scene.removeChild(...([...prj].map(pr => pr.graphic)))
    this._projectiles = this._projectiles.filter(pr => !([...prj]).includes(pr))
  }

  /**
   * This loads the scene
   */
  Load(data, scene) {
    // Prepare variables
    const layers = data.layers
    let blocks = null
    let weapon_sp = null
    let player_sp = null
    // Iterate all layers and assign helpers
    for (let layer of layers) {
      if (layer.name == 'world') {
        blocks = layer.data
      } else if (layer.name === 'weapon_sp') {
        weapon_sp = layer.data
      } else if (layer.name === 'player_sp') {
        player_sp = layer.data
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
      const pos = new Vec2D(Math.floor(i % this.width), this.height - Math.floor(i / this.width) - 1)
      let block = new GameObject(pos)
      block.graphic = Sprites.Wall
      block.graphic.scale.set(1 / 256)
      block.graphic.position.set(pos.x, pos.y)
      this._blocks.push(block)
      scene.addChild(block.graphic)
    }
    // We need at least one spawn point
    if (!player_sp) {
      console.error('No player spawn points were found for this level.')
      return
    }
    // Iterate the "player_sp" data and add _spawnpoints
    for (let i = 0; i < player_sp.length; i++) {
      if (player_sp[i] !== 1) continue
      const pos = new Vec2D(Math.floor(i % this.width), this.height - Math.floor(i / this.width) - 1)
      this._spawns.AddPlayerSpawn(pos)
    }
    // Check if any weapon spawn data was found
    if (weapon_sp) {
      // Iterate the "weapon_sp" data and add _spawnpoints
      for (let i = 0; i < weapon_sp.length; ++i) {
        const pos = new Vec2D(Math.floor(i % this.width), this.height - Math.floor(i / this.width) - 1)
        this._spawns.AddWeaponSpawn(weapon_sp[i], pos, scene)
      }
    }
    // gravity
    this._gravity = new Vec2D(0, conf.gravity * -1)
    this._GenLvlGrid()
    this._GenCollisionFaces()
    // Create the player at a random position
    const player = new Player(0, new InputKeyboard(), this._spawns.GetRandomPlayerSpawn())
    // player.is_fast = true
    scene.addChild(player.graphic)
    this._players.push(player)

    const player2 = new Player(1, new InputGamepad(), this._spawns.GetRandomPlayerSpawn())
    scene.addChild(player2.graphic)
    this._players.push(player2)

    // render collision faces
    if (GetUrlParam('rcf') || GetUrlParam('render_collision_faces'))
      this._RenderCollisionFaces(scene)
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

  /*
   * Generate Collision Faces
   */
  _GenCollisionFaces() {
    const blocks = this._block_grid

    const diag_top_left = (x, y) => {
      if (x == 0 || y == blocks[x].length - 1) return false
      return blocks[x-1][y+1]
    }
    const diag_top_right = (x, y) => {
      if (x == blocks.length - 1 || y == blocks[x].length - 1) return false
      return blocks[x+1][y+1]
    }

    const collides_left = (x, y) => {
      if (x == 0) return true
      return !blocks[x-1][y]
    }
    const collides_right = (x, y) => {
      if (x == blocks.length - 1) return true
      return !blocks[x+1][y]
    }
    const collides_top = (x, y) => {
      const args = [x, y]
      // topmost block => false
      if (y == blocks[x].length - 1) {
        return true
      }
      // block on top...
      if (blocks[x][y+1]) {
        // ...no block left & right => false
        if (collides_left(...args) && collides_right(...args)) {
          return false
        // ...block at top...
        } else {
          // ...block left and no block top right or
          // block right and no block top left ? true : false
          return  (!diag_top_left(...args) && collides_right(...args) ||
                  (!diag_top_right(...args) && collides_left(...args)))
        }
      }
      return true
    }
    const collides_bottom = (x, y) => {
      if (y == 0) return true
      return !blocks[x][y-1]
    }

    for (let y = blocks[0].length - 1; y >= 0 ; y--) {
      for (let x = 0; x < blocks.length; x++) {
        if (blocks[x][y]) {
          blocks[x][y]['_collision_sides'] = {
            left: collides_left(x, y), top: collides_top(x, y),
            right: collides_right(x, y), bottom: collides_bottom(x, y)
          }
        }
      }
    }

    this._LogCollisionGrid()
  }

  /*
   * print block grid to console
   */
  _LogGrid() {
    console.groupCollapsed('= BLOCK GRID =')
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
    console.log('\n' + str)
    console.groupEnd()
  }

  /*
   * print collision grid to console
   */
  _LogCollisionGrid() {
    console.groupCollapsed('= COLLISION GRID =')
    const c_top = '\u2564', c_left = '\u255F', c_right = '\u2562', c_bottom = '\u2567'
    let str = '\u250C' + '\u2500'.repeat(this._block_grid.length * 5 + 2) + '\u2510\n'
    if (this._block_grid.length > 0) {
      for (let y = this._block_grid[0].length - 1; y >= 0 ; y--) {
        str += '\u2502 '
        // top
        for (let x = 0; x < this._block_grid.length; x++) {
          str += this._block_grid[x][y] && this._block_grid[x][y]._collision_sides.top ? '  ' + c_top + '  ' : '     '
        }
        str += ' \u2502\n'
        // left & right
        str += '\u2502 '
        for (let x = 0; x < this._block_grid.length; x++) {
          str += !this._block_grid[x][y] ? '     ' :
            (this._block_grid[x][y]._collision_sides.left ? ' ' + c_left : '  ') + '\u2593' + (this._block_grid[x][y]._collision_sides.right ? c_right + ' ' : '  ')
        }
        str += ' \u2502\n'
        // bottom
        str += '\u2502 '
        for (let x = 0; x < this._block_grid.length; x++) {
          str += this._block_grid[x][y] && this._block_grid[x][y]._collision_sides.bottom ? '  ' + c_bottom + '  ' : '     '
        }
        str += ' \u2502\n'
      }
    }
    str += '\u2514' + '\u2500'.repeat(this._block_grid.length * 5 + 2) + '\u2518'
    console.log('%c\n' + str, 'font-size: 7px; line-height: 12px')
    console.groupEnd()
  }

  /*
   * Render Collision Faces
   */
  _RenderCollisionFaces(scene) {
    for (let block of this._blocks) {
      block.RenderCollisionFaces(scene)
    }
  }

}

export {
  Level
}
