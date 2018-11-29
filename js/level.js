import { GameObject } from './game_object'
import { Player } from './player'
import { Vec2D } from './math'
import { Physics } from './physics'

class Level {

  constructor(parent_scene) {
    this._blocks = []
    this._block_grid = []
    this._projectiles = []
    Level._active_level = this
    this._parent_scene = parent_scene
  }

  Update(dt) {
    Physics.Update(dt, this)

    // Only keep projectiles with an y pos >= -5
    const delete_list = []
    this._projectiles = this._projectiles.filter(prj => {
      if (prj.pos.y >= -5) {
        return true
      } else {
        delete_list.push(prj.graphic)
        return false
      }
    })
    // Remove "dead" projectiles from scene
    this._parent_scene.removeChild(...delete_list)
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
    this._gravity = new Vec2D(0, -25)
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
