import * as PIXI from 'pixi.js'
import * as pixiSound from 'pixi-sound'

class Sounds {
  /**
   * Recursivly remove the path from a list of files until only the file remains
   */
  static _GetPaths(out_list, obj) {
    if (typeof obj === 'string') {
      out_list.push(obj)
    } else if (typeof obj === 'object') {
      for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
          out_list = Sounds._GetPaths(out_list, obj[i])
        }
      }
    }
    return out_list
  }

  /**
   * Load all sound in the sound_obj. Call on_done when finished loading
   */
  static LoadSounds(sound_obj, on_done) {
    // Load sound files
    const sounds = Sounds._GetPaths([], sound_obj)
    if (process.env.NODE_ENV === 'development') console.log(`Loaded sounds: ${ JSON.stringify(sounds) }`)
    // Load sound via pixi
    PIXI.loader.add(sounds).load(() => {
      // Add each sound to loaded sounds
      for (let snd of sounds) {
        Sounds.sounds[snd.split('/').pop().split('.')[0]] = PIXI.loader.resources[snd].sound
      }
      // Return if finished loading
      if (process.env.NODE_ENV === 'development') console.log(`Loaded sounds: ${ Sounds.sounds }`)
      on_done()
    })
  }

  static Play(sound, options) {
    if (Sounds.sounds[sound]) Sounds.sounds[sound].play(options)
  }
}
Sounds.sounds = []

export { Sounds }
