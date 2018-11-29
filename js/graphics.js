import * as PIXI from 'pixi.js'
import { game_config } from './game_config'

var renderer, app

class Graphics {

  constructor() {
  }

  //
  // Init Graphics
  //
  Init(wrap) {
    if (!wrap) {
      console.error('game wrap is undefined!')
      return
    }

    this._game_wrap = wrap

    PIXI.utils.sayHello(
      PIXI.utils.isWebGLSupported()
        ? 'WebGL'
        : 'canvas')

    PIXI.settings.RESOLUTION = game_config.resolution

    // create & config pixi app
    let container = wrap
    app = new PIXI.Application({width: wrap.offsetWidth, height: wrap.offsetHeight,
      antialias: true, autoResize: false, resolution: window.devicePixelRatio})

    renderer = app.renderer
    renderer.backgroundColor = game_config.clear_color

    // add pixi canvas to HTML
    container.append(app.view)

    // resize renderer when resizing game wrap
    window.addEventListener('resize', () => this._HandleResize())
  }

  //
  // Handle window resize
  //
  _HandleResize() {
    const canvas = this._game_wrap.getElementsByTagName('canvas')[0]
    canvas.width = this._game_wrap.offsetWidth * PIXI.settings.RESOLUTION
    canvas.height = this._game_wrap.offsetHeight * PIXI.settings.RESOLUTION
    console.log(`resized renderer to ${renderer.width}px, ${renderer.height}px`)
  }

  //
  // Add Scene
  //
  AddScene(scene) {
    app.stage.addChild(scene)
  }

  //
  // Create Polygon Methods
  //
  static CreateRectangle(x = 0, y = 0, w = 1, h = 1, color = 0xFFFFFF) {
    const rect = new PIXI.Graphics()
    rect.lineStyle(0.005, 0x000000, 1)
    rect.beginFill(color)
    rect.drawRect(0, 0, w, h)
    rect.endFill()
    rect.position.set(x, y)
    return rect
  }
}

export { Graphics, renderer, app }
