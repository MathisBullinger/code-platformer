import { game_config } from './game_config'

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
    this._app = new PIXI.Application({width: wrap.offsetWidth, height: wrap.offsetHeight,
      antialias: true, autoResize: false, resolution: window.devicePixelRatio})
    this._app.renderer.backgroundColor = game_config.clear_color

    // add pixi canvas to HTML
    container.append(this._app.view)

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
    console.log(`resized renderer to ${this._app.renderer.width}px, ${this._app.renderer.height}px`)
  }

}

export { Graphics }
