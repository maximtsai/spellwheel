const audioFiles = [
    {name: 'glass_break', src: 'audio/glass_break.mp3'},
    {name: 'button', src: 'audio/button.mp3'},
    {name: 'emergency', src: 'audio/emergency.mp3'},
    {name: 'fizzle', src: 'audio/fizzle.mp3'},
    {name: 'zoomin', src: 'audio/zoomin.mp3'},
    {name: 'magic', src: 'audio/magic.mp3'},
    {name: 'power_surge', src: 'audio/power_surge.mp3'},
    {name: 'power_surge_plain', src: 'audio/power_surge_plain.mp3'},
    {name: 'tree_timber', src: 'audio/tree_timber.mp3'},
    {name: 'tree_sfx', src: 'audio/tree_sfx.mp3'},
    {name: 'tree_rustle', src: 'audio/tree_rustle.mp3'},
    {name: 'locket', src: 'audio/locket.mp3'},
    {name: 'razor_leaf', src: 'audio/razor_leaf.mp3'},
    {name: 'tree_hit', src: 'audio/tree_hit.mp3'},
    {name: 'clunk', src: 'audio/clunk.mp3'},
    {name: 'clunk2', src: 'audio/clunk2.mp3'},
    {name: 'cutesy_down', src: 'audio/cutesy_down.mp3'},
    {name: 'cutesy_up', src: 'audio/cutesy_up.mp3'},
    {name: 'goblin_aha', src: 'audio/goblin_aha.mp3'},
    {name: 'goblin_grunt', src: 'audio/goblin_grunt.mp3'},
    {name: 'enemy_attack', src: 'audio/enemy_attack.mp3'},
    {name: 'enemy_attack_2', src: 'audio/enemy_attack_2.mp3'},
    {name: 'enemy_attack_major', src: 'audio/enemy_attack_major.mp3'},
    {name: 'body_slam', src: 'audio/body_slam.mp3'},
    {name: 'punch', src: 'audio/punch.mp3'},
    {name: 'punch2', src: 'audio/punch2.mp3'},
    {name: 'sword_slice', src: 'audio/sword_slice.mp3'},
    {name: 'sword_hit', src: 'audio/sword_hit.mp3'},
    {name: 'wind', src: 'audio/wind.mp3'},
    {name: 'water_drop', src: 'audio/water_drop.mp3'},
    {name: 'locket_open', src: 'audio/locket_open.mp3'},
    {name: 'locket_close', src: 'audio/locket_close.mp3'},
    {name: 'sound_of_death', src: 'audio/sound_of_death.mp3'},
    {name: 'you_died', src: 'audio/you_died.mp3'},
    {name: 'missile_launch_1', src: 'audio/missile_launch_1.mp3'},
    {name: 'missile_launch_2', src: 'audio/missile_launch_2.mp3'},
    {name: 'guncock', src: 'audio/guncock.mp3'},
    {name: 'derp', src: 'audio/derp.mp3'},
    {name: 'inflate', src: 'audio/inflate.mp3'},
    {name: 'balloon', src: 'audio/balloon.mp3'},
    {name: 'death_attack', src: 'audio/death_attack.mp3'},
    {name: 'death_cast', src: 'audio/death_cast.mp3'},

    {name: 'bite_down', src: 'audio/bite_down.mp3'},
    {name: 'bite_down_simplified', src: 'audio/bite_down_simplified.mp3'},
    {name: 'bite_down_complex', src: 'audio/bite_down_complex.mp3'},
    {name: 'and_into_the_void', src: 'audio/and_into_the_void.mp3'},
    {name: 'into_the_void', src: 'audio/into_the_void.mp3'},
    {name: 'echos_of_time', src: 'audio/echos_of_time.mp3'},
    {name: 'echos_of_time_finale', src: 'audio/echos_of_time_finale.mp3'},
    {name: 'metaljpop', src: 'audio/metaljpop.mp3'},
    {name: 'metaljpop_short', src: 'audio/metaljpop_short.mp3'},
    {name: 'jpop', src: 'audio/jpop.mp3'},
    {name: 'jpop_intro', src: 'audio/jpop_intro.mp3'},
    {name: 'heartbeat', src: 'audio/heartbeat.mp3'},
    {name: 'but_never_forgotten_metal', src: 'audio/but_never_forgotten_metal.mp3'},
    {name: 'but_never_forgotten_metal_prelude', src: 'audio/but_never_forgotten_metal_prelude.mp3'},
    {name: 'but_never_forgotten_epicchoir', src: 'audio/but_never_forgotten_epicchoir.mp3'},
    {name: 'but_never_forgotten_gameover', src: 'audio/butneverforgotten_gameover.mp3'},
    {name: 'but_never_forgotten', src: 'audio/but_never_forgotten.mp3'},
    {name: 'but_never_forgotten_afterthought', src: 'audio/but_never_forgotten_afterthought.mp3'},
    {name: 'sleepless', src: 'audio/sleepless.mp3'},
    {name: 'sleepless_long', src: 'audio/sleepless_long.mp3'},

    {name: 'death3_harp', src: 'audio/death3_harp.mp3'},

    {name: 'matter_body', src: 'audio/matter_body.mp3'},
    {name: 'matter_enhance', src: 'audio/matter_enhance.mp3'},
    {name: 'matter_enhance_2', src: 'audio/matter_enhance_2.mp3'},
    {name: 'matter_shield', src: 'audio/matter_shield.mp3'},
    {name: 'matter_strike', src: 'audio/matter_strike.mp3'},
    {name: 'matter_strike_alt', src: 'audio/matter_strike_alt.mp3'},
    {name: 'matter_strike_heavy', src: 'audio/matter_strike_heavy.mp3'},
    {name: 'matter_strike_hit', src: 'audio/matter_strike_hit.mp3'},
    {name: 'matter_strike_hit_alt', src: 'audio/matter_strike_hit_alt.mp3'},
    {name: 'matter_strike_hit_alt_2', src: 'audio/matter_strike_hit_alt_2.mp3'},
    {name: 'matter_strike_hit2', src: 'audio/matter_strike_hit2.mp3'},
    {name: 'matter_ultimate', src: 'audio/matter_ultimate.mp3'},

    {name: 'mind_strike', src: 'audio/mind_strike.mp3'},
    {name: 'mind_strike_hit', src: 'audio/mind_strike_hit.mp3'},
    {name: 'mind_enhance', src: 'audio/mind_enhance.mp3'},
    {name: 'mind_shield', src: 'audio/mind_shield.mp3'},
    {name: 'mind_shield_retaliate', src: 'audio/mind_shield_retaliate.mp3'},
    {name: 'mind_body', src: 'audio/mind_body.mp3'},
    {name: 'mind_ultimate_1', src: 'audio/mind_ultimate_1.mp3'},
    {name: 'mind_ultimate_2', src: 'audio/mind_ultimate_2.mp3'},
    {name: 'mind_ultimate_cast', src: 'audio/mind_ultimate_cast.mp3'},
    {name: 'mind_ultimate_loop_1', src: 'audio/mind_ultimate_loop_1.mp3'},
    {name: 'mind_ultimate_loop_2', src: 'audio/mind_ultimate_loop_2.mp3'},
    {name: 'thunder', src: 'audio/thunder.mp3'},

    {name: 'clocktick1', src: 'audio/clocktick1.mp3'},
    {name: 'time_hard', src: 'audio/time_hard.mp3'},
    {name: 'time_body', src: 'audio/time_body.mp3'},
    {name: 'time_strike_buff', src: 'audio/time_strike_buff.mp3'},
    {name: 'time_strike', src: 'audio/time_strike.mp3'},
    {name: 'time_strike_alt', src: 'audio/time_strike.mp3'},
    {name: 'time_strike_hit', src: 'audio/time_strike_hit.mp3'},
    {name: 'time_strike_hit_2', src: 'audio/time_strike_hit_2.mp3'},
    {name: 'time_enhance', src: 'audio/time_enhance.mp3'},
    {name: 'time_shield', src: 'audio/time_shield.mp3'},

    {name: 'void_strike', src: 'audio/void_strike.mp3'},
    {name: 'void_strike_hit', src: 'audio/void_strike_hit.mp3'},
    {name: 'void_body', src: 'audio/void_body.mp3'},
    {name: 'void_shield', src: 'audio/void_shield.mp3'},
    {name: 'void_ultimate', src: 'audio/void_ultimate.mp3'},
    {name: 'void_enhance', src: 'audio/void_enhance.mp3'},
    {name: 'meat_click_left', src: 'audio/meat_click_left.mp3'},
    {name: 'meat_click_right', src: 'audio/meat_click_right.mp3'},

    {name: 'victory', src: 'audio/victory.mp3'},
    {name: 'victory_2', src: 'audio/victory_2.mp3'},
    {name: 'victory_false', src: 'audio/victory_false.mp3'},

    {name: 'voca_hello', src: 'audio/voca_hello.mp3'},
    {name: 'voca_shock', src: 'audio/voca_shock.mp3'},
    {name: 'voca_short_pain', src: 'audio/voca_short_pain.mp3'},
    {name: 'voca_hello_short', src: 'audio/voca_hello_short.mp3'},
    {name: 'voca_pain', src: 'audio/voca_pain.mp3'},
    {name: 'voca_missile', src: 'audio/voca_missile.mp3'},
    {name: 'voca_missile_broken', src: 'audio/voca_missile_broken.mp3'},
    {name: 'voca_kya_damaged', src: 'audio/voca_kya_damaged.mp3'},
    {name: 'voca_kya', src: 'audio/voca_kya.mp3'},
    {name: 'voca_gun', src: 'audio/voca_gun.mp3'},
    {name: 'voca_laser', src: 'audio/voca_laser.mp3'},
    {name: 'voca_laser_broken', src: 'audio/voca_laser_broken.mp3'},
    {name: 'voca_claw_1', src: 'audio/voca_claw_1.mp3'},
    {name: 'voca_claw_2', src: 'audio/voca_claw_2.mp3'},
    {name: 'big_gun_pow_1', src: 'audio/big_gun_pow_1.mp3'},
    {name: 'big_gun_pow_2', src: 'audio/big_gun_pow_2.mp3'},
    {name: 'robot_sfx_1', src: 'audio/robot_sfx_1.mp3'},
    {name: 'robot_sfx_2', src: 'audio/robot_sfx_2.mp3'},
    {name: 'robot_laser', src: 'audio/robot_laser.mp3'},
    {name: 'explosion', src: 'audio/explosion.mp3'},
    {name: 'music_blast', src: 'audio/music_blast.mp3'},
    {name: 'music_blast_weak', src: 'audio/music_blast_weak.mp3'},

    {name: 'magician_end', src: 'audio/magician_end.mp3'},
    {name: 'magician_theme_1', src: 'audio/magician_theme_1.mp3'},
    {name: 'magician_theme_3', src: 'audio/magician_theme_3.mp3'},
    {name: 'magician_theme_4', src: 'audio/magician_theme_4.mp3'},
    {name: 'gunsequence', src: 'audio/gunsequence.mp3'},

    {name: 'shield_block', src: 'audio/shield_block.mp3'},
    {name: 'shield_break', src: 'audio/shield_break.mp3'},
    {name: 'rock_crumble', src: 'audio/rock_crumble.mp3'},
    {name: 'tractor_start', src: 'audio/tractor_start.mp3'},
    {name: 'tractor_loop', src: 'audio/tractor_loop.mp3'},

    {name: 'timeSlow', src: 'audio/timeslow.mp3'},
    {name: 'squish', src: 'audio/squish.mp3'},
    {name: 'lesserfall', src: 'audio/lesser_fall.mp3'},

    {name: 'flip1', src: 'audio/flip1.mp3'},
    {name: 'flip2', src: 'audio/flip2.mp3'},
    {name: 'flip3', src: 'audio/flip3.mp3'},
    {name: 'button_hover', src: 'audio/button_hover.mp3'},
    {name: 'button_click', src: 'audio/button_click.mp3'},
    {name: 'whoosh', src: 'audio/whoosh.mp3'},
    {name: 'slice_in', src: 'audio/slice_in.mp3'},
    {name: 'swish', src: 'audio/swish.mp3'},
    {name: 'heartbeatfast', src: 'audio/heartbeatfast.mp3'},
    {name: 'stomp', src: 'audio/stomp.mp3'},
    {name: 'deep_swish', src: 'audio/deep_swish.mp3'},
    {name: 'ringknell', src: 'audio/ringknell.mp3'},
    {name: 'roar', src: 'audio/roar.mp3'},
    {name: 'click', src: 'audio/click.mp3'},
    {name: 'chirp1', src: 'audio/chirp1.mp3'},
    {name: 'chirpmany', src: 'audio/chirp_many.mp3'},
    {name: 'deepdemon', src: 'audio/deepdemon.mp3'},
    {name: 'lowbell', src: 'audio/lowbell.mp3'},
    {name: 'boing', src: 'audio/boing.mp3'},

    {name: 'water1', src: 'audio/water1.mp3'},
    {name: 'water2', src: 'audio/water2.mp3'},
    {name: 'watersplash', src: 'audio/water_splash.mp3'},
    {name: 'watersplashbig', src: 'audio/water_splash_big.mp3'},

]
