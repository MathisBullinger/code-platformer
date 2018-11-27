import { GameObject } from './game_object'
import { Player } from './player'
import { Vec2D } from './math'

class Level {

  constructor() {
    this._blocks = []
  }

  Update(dt) {
    if (this.player)
      this.player.Update(dt)
  }

  GenTest(scene) {
    this.player = new Player(new Vec2D(0, 2))
    scene.addChild(this.player.graphic)
    this._blocks = []
    for (let i = 0; i < 10; i++) {
      let block = new GameObject(new Vec2D(i, 0))
      this._blocks.push(block)
      scene.addChild(block.graphic)
    }
  }

}

export {
  Level
}
