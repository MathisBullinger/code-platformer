import * as PIXI from 'pixi.js'
import { renderer } from './graphics'
import { Level } from './level'
import { game_config } from './game_config'
import { UI } from './ui/user_interface'

const level_data = [
  {
    id: 0,
    name: 'Basement',
    data: require('../data/level/Basement.json'),
  },
  {
    id: 1,
    name: 'Level 1',
    data: require('../data/level/Level1.json'),
  },
  {
    id: 2,
    name: 'Level 2',
    data: require('../data/level/Level2.json'),
  },
  {
    id: 3,
    name: 'New Big Boy Lvl',
    data: require('../data/level/New Big Boy Lvl.json'),
  },
  {
    id: 4,
    name: 'The fall',
    data: require('../data/level/the_fall.json'),
  }
]

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
    this._CreateScene()
    this.level = new Level(this.scene)
    this.level.Load(level_data[0].data, this.scene)

    this.ui = new UI()
    this.scene.addChild(this.ui.graphic)

    // rescale scene to fit into screen
    this._ResizeScene()
    window.addEventListener('resize', () => this._ResizeScene())
  }

  /**
    * Update world
    */
  Update(dt) {
    this.level.Update(dt)
    this.ui.Update()
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
    game_config.scene = this.scene
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
      this.scene.height = window.innerHeight / window.devicePixelRatio * -1
      this.scene.width = 1 / scene_ratio * this.scene.height * -1
      const pos_x = ((window.innerWidth - Math.abs(this.scene.width * renderer.resolution)) / 2) / renderer.resolution
      this.scene.x = pos_x
    }
  }

}

export { World }
