import * as PIXI from 'pixi.js'
import { renderer } from './graphics'
import { Level } from './level'

class World {
  constructor() {
    this.Create()
  }

  Create() {
    const lvl_data = require('../data/level/map_extern.json')
    this._CreateScene()
    this.level = new Level()
    this.level.Load(lvl_data, this.scene)

    // rescale scene to fit into screen
    const scene_ratio = Math.abs(this.scene.height / this.scene.width)
    if (this.scene.width / window.innerWidth >= this.scene.height / window.innerHeight) {
      this.scene.width = window.innerWidth / 2
      this.scene.height = scene_ratio * this.scene.width * -1
    } else {
      this.scene.height = window.innerHeight / 2 * -1
      this.scene.width = 1 / scene_ratio * this.scene.height * -1
    }

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
    this.pix_per_unit = window.innerWidth / 10
    this.scene.scale.x *= this.pix_per_unit / renderer.resolution
    this.scene.scale.y *= this.pix_per_unit / renderer.resolution
  }

}

export { World }
