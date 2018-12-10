import * as PIXI from 'pixi.js'
import { renderer } from './graphics'
import { Level } from './level'

class World {
  /**
    * Constructor
    */
  constructor() {
    this.Create()
  }

  /**
    * Create new world
    */
  Create() {
    const lvl_data = require('../data/level/bigboy.json')
    this._CreateScene()
    this.level = new Level(this.scene)
    this.level.Load(lvl_data, this.scene)

    // rescale scene to fit into screen
    this._ResizeScene()
    window.addEventListener('resize', () => this._ResizeScene())
  }

  /**
    * Update world
    */
  Update(dt) {
    this.level.Update(dt)
  }

  /**
    * Create new scene
    */
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

  /**
    * Resize scene to fit into screen and center scene
    */
  _ResizeScene() {
    // rescale scene to fit into screen
    const scene_ratio = Math.abs(this.scene.height / this.scene.width)
    if (this.scene.width / window.innerWidth >= Math.abs(this.scene.height / window.innerHeight)) {
      this.scene.width = window.innerWidth / window.devicePixelRatio
      this.scene.height = scene_ratio * this.scene.width * -1
      const pos_y = (window.innerHeight - (window.innerHeight - Math.abs(this.scene.height * renderer.resolution)) / 2) / renderer.resolution
      this.scene.y = pos_y
    } else {
      this.scene.height = window.innerHeight / 2 * -1
      this.scene.width = 1 / scene_ratio * this.scene.height * -1
      const pos_x = ((window.innerWidth - Math.abs(this.scene.width * renderer.resolution)) / 2) / renderer.resolution
      this.scene.x = pos_x
    }
  }

}

export { World }
