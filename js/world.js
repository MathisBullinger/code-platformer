import * as PIXI from 'pixi'
import { renderer } from './graphics'
import { Level } from './level'

class Camera {
  constructor() {
    this.pos = new PIXI.Point(0, 0)
    const blocks_per_screen = 20
    this.scale = new PIXI.Point(blocks_per_screen, window.innerHeight / window.innerWidth * blocks_per_screen)
  }
}

class World {
  constructor() {
    this.camera = new Camera()
    this.Create()
  }

  Create() {
    this._CreateScene()
    this.level = new Level()
    this.level.Load(require('../data/level/test.json'), this.scene)
  }

  Update(dt) {
    this.level.Update(dt)
  }

  _CreateScene() {
    this.scene = new PIXI.Container()
    this.scene.transform.localTransform = new PIXI.Matrix(
      1,    // x scale
      0,    // x skew
      0,    // y skew
      1,    // y scale
      0,    // x translation
      0     // y translation
    )
    // invert y-axis
    this.scene.position.y += window.innerHeight / renderer.resolution
    this.scene.scale.y *= -1
    // scale
    const pix_per_unit = window.innerWidth / this.camera.scale.x
    this.scene.scale.x *= pix_per_unit / renderer.resolution
    this.scene.scale.y *= pix_per_unit / renderer.resolution
  }

}

export { World }
