import * as PIXI from 'pixi.js'
import { Bow } from './weapons/bow'
import { Gun } from './weapons/gun'

class WeaponSpawn {
  constructor(pos) {
    this.pos = pos
    this.graphic = WeaponSpawn._GetGraphic(this.pos, 0x000000)
    this._on_cooldown = false
    this._last_use = 0
    this._cooldown = 5000
  }

  Update() {
    if (this._on_cooldown && (Date.now() - this._last_use) >= this._cooldown) {
      WeaponSpawn._PaintToGraphic(this.graphic, 0x000000)
      this._on_cooldown = false
    }
  }

  get HasWeapon() {
    return !this._on_cooldown
  }

  TakeWeapon() {
    this._on_cooldown = true
    WeaponSpawn._PaintToGraphic(this.graphic, 0xFF0000)
    this._last_use = Date.now()
    return Math.random() >= 0.5 ? new Bow() : new Gun()
  }

  static _GetGraphic(pos, color) {
    const rect = new PIXI.Graphics()
    WeaponSpawn._PaintToGraphic(rect, color)
    rect.position.set(pos.x, pos.y)
    return rect
  }

  static _PaintToGraphic(rect, color) {
    rect.clear()
    rect.beginFill(color)
    rect.drawPolygon([0, 0.5, 0.5, 1, 1, 0.5, 0.5, 0])
    rect.endFill()
  }
}

export { WeaponSpawn }
