import * as PIXI from 'pixi.js'
import { renderer } from './graphics'
import { Level } from './level'

class Camera {
  constructor(blocks_per_screen = 20) {
    this.pos = new PIXI.Point(0, 0)
    this.scale = new PIXI.Point(blocks_per_screen, window.innerHeight / window.innerWidth * blocks_per_screen)
  }
}

class World {
  constructor() {
    this.Create()
  }

  Create() {
    const lvl_data = require('../data/level/map_extern.json')
    this.camera = new Camera(lvl_data.canvas.width / 32)
    this._CreateScene()
    this.level = new Level()
    this.level.Load(lvl_data, this.scene)
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
    this.pix_per_unit = window.innerWidth / this.camera.scale.x
    this.scene.scale.x *= this.pix_per_unit / renderer.resolution
    this.scene.scale.y *= this.pix_per_unit / renderer.resolution
  }

}

export { World }
