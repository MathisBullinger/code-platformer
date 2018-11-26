import { game_config } from './game_config'

var renderer = undefined

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
    this.app = new PIXI.Application({width: wrap.offsetWidth, height: wrap.offsetHeight,
      antialias: true, autoResize: false, resolution: window.devicePixelRatio})

    renderer = this.app.renderer
    renderer.backgroundColor = game_config.clear_color

    // add pixi canvas to HTML
    container.append(this.app.view)

    // resize renderer when resizing game wrap
    window.addEventListener('resize', _ => this._HandleResize())
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
    this.app.stage.addChild(scene)
  }

  //
  // Create Polygon Methods
  //
  static CreateRectangle(x = 0, y = 0, w = 1, h = 1) {
    let rect = new PIXI.Graphics()
    rect.beginFill(0xFFFFFF)
    rect.drawRect(x, y, w, h)
    rect.endFill()
    return rect
  }

}

export { Graphics, renderer }
