import { Graphics } from './graphics'
import { Vec2D } from './math'
import { game_config as conf } from './game_config'
import { Player } from './player'

class Trophy {

  constructor(lvl) {
    this.scale = new Vec2D(1)
    // Create graphic
    this.graphic = Graphics.textures.GetSprite('money')
    this.graphic.anchor.set(0, 0.5)
    // this.graphic.rotation = Math.PI
    this.moveToLevel(lvl)
  }

  moveToLevel(lvl, spawn_at_pos = undefined) {
    if (!lvl) return
    if (spawn_at_pos) {
      this.pos = new Vec2D(spawn_at_pos.x, spawn_at_pos.y + 1)
    } else {
      this.pos = new Vec2D(lvl.width / 2 - 0.5, lvl.height / 2 - 0.5)
    }
    this.graphic.scale.set(1 / 512, -1 / 512)
    this.graphic.position.set(this.pos.x, this.pos.y)
    if (this.graphic.parent) this.graphic.parent.removeChild(this.graphic)
    lvl._parent_scene.addChild(this.graphic)
    this._player = undefined
  }

  Update(dt) {
    if (this._player) {
      this._player.score += conf.trophy.passive_income / 1000 * dt
    }
  }

  moveToPlayer(player) {
    if (!player) return
    this._player = player
    this._player.score += conf.trophy.pickup_bounty
    if (this.graphic.parent) this.graphic.parent.removeChild(this.graphic)
    this._player.graphic.addChildAt(this.graphic, 0)
    this.graphic.position.set(0.1, 1.25)
    this.graphic.scale.set(0.5 / 512)
  }

  get player() {
    return this._player
  }

  get isPickedUp() {
    return this._player && this._player.constructor === Player
  }

}

export { Trophy }
