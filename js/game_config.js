const game_config = {
  resolution: 1,
  clear_color: 0x555555,
  player_move_acc: 30,
  player_move_vel: 8,

  set str_clear_color(cl) {
    this.clear_color = parseInt(cl, 16)
  }
}

export { game_config }
