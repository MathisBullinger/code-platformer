import { GameObject } from './game_object'
import { Player } from './player'
import { Vec2D } from './math'
import { Physics } from './physics'

class Level {

  constructor() {
    this._blocks = []
    this._block_grid = []
  }

  Update(dt) {
    Physics.Update(dt, this)
  }

  GenTest(scene) {
    this._player = new Player(new Vec2D(0, 5))
    scene.addChild(this._player.graphic)
    this._blocks = []
    for (let i = 0; i < 10; i++) {
      let block = new GameObject(new Vec2D(i, 0))
      this._blocks.push(block)
      scene.addChild(block.graphic)
    }
    let block = new GameObject(new Vec2D(7, 1))
    this._blocks.push(block)
    scene.addChild(block.graphic)
    this._gravity = new Vec2D(0, -9.81)
    this._GenLvlGrid()
  }

  //
  // generate level grid from list of blocks
  //
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
