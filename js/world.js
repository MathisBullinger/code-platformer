import * as PIXI from 'pixi.js'
import { renderer, Graphics } from './graphics'
import { Level } from './level'
import { game_config } from './game_config'
import { UI } from './ui/user_interface'

const level_data = [
  {
    id: 0,
    name: 'Basement',
    wall: 'wall_basement',
    background: 'background_basement',
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
    wall: 'wall_ballpit',
    background: 'background_ballpit',
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
    World.Current = this // Set static
  }

  /**
    * Create new world
    */
  Create() {
    this._CreateScene()
    this.LoadLevel(0)


    // rescale scene to fit into screen
    window.addEventListener('resize', () => this._ResizeScene())
  }

  /**
    * Update world
    */
  Update(dt) {
    this.level.Update(dt)
    this.ui.Update()
  }

  LoadLevel(id_or_name) {
    let lvl = undefined
    if (typeof id_or_name === 'number') {
      lvl = level_data[id_or_name]
    } else if (typeof id_or_name === 'string') {
      lvl = level_data.find(el => el.name === id_or_name)
    } else {
      throw TypeError(`${id_or_name} is of invalid type ${ typeof id_or_name }. Expected 'number' or 'string'.`)
    }
    if (lvl) {
      // Unload old level
      this.scene.removeChild(...this.scene.children)
      this.root.removeChild(this._background, this.ui !== undefined ? this.ui.graphic : undefined)
      // Load background if available
      if (lvl.background) {
        this._background = Graphics.textures.GetSprite(lvl.background)
        if (this._background.width / window.innerWidth >= Math.abs(this._background.height / window.innerHeight)) {
          this._background.scale.set(window.innerHeight / this._background.height)
        } else {
          this._background.scale.set(window.innerWidth / this._background.width)
        }
        this.root.addChildAt(this._background, 0)
      }
      // Load new level
      this.level = new Level(this.scene)
      this.level.Load(lvl, this.scene)
      // Create UI if not already existing
      this.ui = new UI()
      this.root.addChild(this.ui.graphic)
      // Resize screen to fit new level
      this._ResizeScene()
    }
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
    // Add root container above scene
    this.root = new PIXI.Container()
    this.root.addChild(this.scene)
  }

  /**
    * Resize scene to fit into screen and center scene
    */
  _ResizeScene() {
    // rescale scene to fit into screen
    const scene_ratio = Math.abs(this.scene.height / this.scene.width)
    if (this.scene.width / window.innerWidth >= Math.abs(this.scene.height / window.innerHeight)) {
      this.scene.width = window.innerWidth / window.devicePixelRatio // - (window.innerWidth / Level.ActiveLevel.width)
      this.scene.height = scene_ratio * this.scene.width * -1
      const pos_y = (window.innerHeight - (window.innerHeight - Math.abs(this.scene.height * renderer.resolution)) / 2) / renderer.resolution
      this.scene.y = pos_y
    } else {
      this.scene.height = window.innerHeight / window.devicePixelRatio * -1 // + (window.innerHeight / Level.ActiveLevel.height)
      this.scene.width = 1 / scene_ratio * this.scene.height * -1
      const pos_x = ((window.innerWidth - Math.abs(this.scene.width * renderer.resolution)) / 2) / renderer.resolution
      this.scene.x = pos_x
    }
  }

}

export { World }
