import { GameObject } from './game_object'
import { Player } from './player'
import { Vec2D } from './math'
import { Physics } from './physics'
import { game_config as conf } from './game_config'

class Level {

  constructor(parent_scene) {
    this._blocks = []
    this._block_grid = []
    this._projectiles = []
    Level._active_level = this
    this._parent_scene = parent_scene
    this._lower_death_cap = -5 // kill below
  }

  Update(dt) {
    Physics.Update(dt, this)

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
    const layers = data.layers
    let blocks = null
    for (let layer of layers) {
      if (layer.name == 'world') {
        blocks = layer.data
        break
      }
    }
    if (!blocks) {
      console.error('no world layer found in level file')
      return
    }

    this.width = data.canvas.width / 32
    this.height = blocks.length / this.width

    if (blocks.length != this.width * this.height)
      console.warn('number of blocks doesn\'t match up height & width')
    for (let i = 0; i < blocks.length; i++) {
      const material = blocks[i]
      if (material != 1) continue
      let block = new GameObject(new Vec2D(Math.floor(i % this.width), this.height - Math.floor(i / this.width) - 1))
      this._blocks.push(block)
      scene.addChild(block.graphic)
    }
    // gravity
    this._gravity = new Vec2D(0, conf.gravity * -1)
    this._GenLvlGrid()
    this._GenCollisionFaces()
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

  /*
   * Generate Collision Faces
   */
  _GenCollisionFaces() {
    const blocks = this._block_grid

    const collides_left = (x, y) => {
      if (x == 0) return false
      if (blocks[x-1][y]) return false
      return true
    }
    const collides_right = (x, y) => {
      if (x == blocks.length - 1) return true
      if (blocks[x+1][y]) return false
      return true
    }
    const collides_top = (x, y) => {
      if (y == blocks[x].length - 1) return true
      if (blocks[x][y+1]) return false
      return true
    }
    const collides_bottom = (x, y) => {
      if (y == 0) return true
      if (blocks[x][y-1]) return false
      return true
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

  /*
   * print collision grid to console
   */
  _LogCollisionGrid() {
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
    console.log('%c =Collision Grid=\n\n' + str, 'font-size: 7px; line-height: 12px')
  }

}

export {
  Level
}
