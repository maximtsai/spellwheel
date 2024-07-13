function createAnimations(scene) {
    scene.anims.create({
        key: 'dummyblink',
        frames: scene.anims.generateFrameNames('enemies', {
            prefix: 'lesser_dummy_eyes',
            suffix: '.png',
            start: 1,
            end: 7,
            zeroPad: 0,
        }),
        frameRate: 20
    });
    scene.anims.create({
        key: 'dummylook',
        frames: scene.anims.generateFrameNames('enemies', {
            prefix: 'lesser_dummy_eyes',
            suffix: '.png',
            start: 4,
            end: 9,
            zeroPad: 0,
        }),
        frameRate: 15
    });
    scene.anims.create({
        key: 'dummysmile',
        frames: scene.anims.generateFrameNames('enemies', {
            prefix: 'lesser_dummy_mouth',
            suffix: '.png',
            start: 1,
            end: 9,
            zeroPad: 0,
        }),
        frameRate: 30
    });
    scene.anims.create({
        key: 'exclamation',
        frames: scene.anims.generateFrameNames('enemies', {
            prefix: 'exclamation',
            suffix: '.png',
            start: 1,
            end: 2,
            zeroPad: 0,
        }),
        frameRate: 3,
        repeat: -1
    });
    scene.anims.create({
        key: 'gobboshield',
        frames: scene.anims.generateFrameNames('enemies', {
            prefix: 'gobboshield',
            suffix: '.png',
            start: 1,
            end: 2,
            zeroPad: 0,
        }),
        frameRate: 2,
        repeat: -1
    });
    scene.anims.create({
        key: 'gobboshieldfire',
        frames: scene.anims.generateFrameNames('enemies', {
            prefix: 'gobbo_fire',
            suffix: '.png',
            start: 1,
            end: 2,
            zeroPad: 0,
        }),
        frameRate: 4,
        repeat: -1
    });
    scene.anims.create({
        key: 'robotheart',
        frames: scene.anims.generateFrameNames('enemies', {
            prefix: 'robot_blast_small',
            suffix: '.png',
            start: 1,
            end: 2,
            zeroPad: 0,
        }),
        frameRate: 20,
        repeat: -1
    });
    scene.anims.create({
        key: 'angry',
        frames: scene.anims.generateFrameNames('enemies', {
            prefix: 'angry',
            suffix: '.png',
            start: 1,
            end: 2,
            zeroPad: 0,
        }),
        frameRate: 3,
        repeat: -1
    });
    scene.anims.create({
        key: 'angrybone',
        frames: scene.anims.generateFrameNames('enemies', {
            prefix: 'bone',
            suffix: '.png',
            start: 1,
            end: 2,
            zeroPad: 0,
        }),
        frameRate: 2,
        repeat: -1
    });
    scene.anims.create({
        key: 'mindBurn',
        frames: scene.anims.generateFrameNames('spells', {
            prefix: 'mindBurn',
            suffix: '.png',
            start: 1,
            end: 4,
            zeroPad: 0,
        }),
        frameRate: 10,
        repeat: -1
    });
    scene.anims.create({
        key: 'mindBurnSlow',
        frames: scene.anims.generateFrameNames('spells', {
            prefix: 'mindBurn',
            suffix: '.png',
            start: 1,
            end: 4,
            zeroPad: 0,
            yoyo: true,
        }),
        frameRate: 5,
        repeat: -1
    });
    scene.anims.create({
        key: 'damageEffect',
        frames: scene.anims.generateFrameNames('spells', {
            prefix: 'damageEffect',
            suffix: '.png',
            start: 2,
            end: 5,
            zeroPad: 0,
        }),
        frameRate: 20
    });
    scene.anims.create({
        key: 'shockEffect',
        frames: scene.anims.generateFrameNames('spells', {
            prefix: 'shockEffect',
            suffix: '.png',
            start: 1,
            end: 10,
            zeroPad: 0,
        }),
        frameRate: 30
    });
    scene.anims.create({
        key: 'shieldHit',
        frames: scene.anims.generateFrameNames('shields', {
            prefix: 'shield',
            suffix: '.png',
            start: 2,
            end: 10,
            zeroPad: 0,
        }),
        frameRate: 30
    });
    scene.anims.create({
        key: 'shieldFlash',
        frames: scene.anims.generateFrameNames('shields', {
            prefix: 'shield',
            suffix: '.png',
            start: 1,
            end: 10,
            zeroPad: 0,
        }),
        frameRate: 20
    });
    scene.anims.create({
        key: 'forceFieldHit',
        frames: scene.anims.generateFrameNames('shields', {
            prefix: 'forceField',
            suffix: '.png',
            start: 2,
            end: 12,
            zeroPad: 0,
        }),
        frameRate: 30
    });
    scene.anims.create({
        key: 'forceFieldHitShort',
        frames: scene.anims.generateFrameNames('shields', {
            prefix: 'forceFieldShort',
            suffix: '.png',
            start: 1,
            end: 8,
            zeroPad: 0,
        }),
        frameRate: 30
    });
    scene.anims.create({
        key: 'forceFieldFlash',
        frames: scene.anims.generateFrameNames('shields', {
            prefix: 'forceField',
            suffix: '.png',
            start: 1,
            end: 12,
            zeroPad: 0,
        }),
        frameRate: 15
    });
    scene.anims.create({
        key: 'forceBreak',
        frames: scene.anims.generateFrameNames('shields', {
            prefix: 'forceBreak',
            suffix: '.png',
            start: 1,
            end: 3,
            zeroPad: 0,
        }),
        frameRate: 10
    });
    scene.anims.create({
        key: 'circleEffect',
        frames: scene.anims.generateFrameNames('circle', {
            prefix: 'circleEffect',
            suffix: '.png',
            start: 1,
            end: 10,
            zeroPad: 0,
        }),
        frameRate: 10
    });
    scene.anims.create({
        key: 'circleBlast',
        frames: scene.anims.generateFrameNames('lowq', {
            prefix: 'circle_blue',
            suffix: '.png',
            start: 0,
            end: 4,
            zeroPad: 0,
        }),
        frameRate: 5
    });
    scene.anims.create({
        key: 'circleEffectSmall',
        frames: scene.anims.generateFrameNames('circle', {
            prefix: 'circleEffect',
            suffix: '.png',
            start: 5,
            end: 10,
            zeroPad: 0,
        }),
        frameRate: 10
    });
    scene.anims.create({
        key: 'blastEffect',
        frames: scene.anims.generateFrameNames('circle', {
            prefix: 'blastEffect',
            suffix: '.png',
            start: 0,
            end: 6,
            zeroPad: 0,
        }),
        frameRate: 24
    });
    scene.anims.create({
        key: 'powerEffect',
        frames: scene.anims.generateFrameNames('spells', {
            prefix: 'shockEffect',
            suffix: '.png',
            start: 1,
            end: 10,
            zeroPad: 0,
        }),
        frameRate: 20
    });
    scene.anims.create({
        key: 'powerEffectRepeat',
        frames: scene.anims.generateFrameNames('spells', {
            prefix: 'shockEffect',
            suffix: '.png',
            start: 5,
            end: 10,
            zeroPad: 0,
        }),
        frameRate: 20,
        repeat: -1,
        repeatDelay: 1000
    });
    scene.anims.create({
        key: 'scytheFlash',
        frames: scene.anims.generateFrameNames('misc', {
            prefix: 'scytheflash',
            suffix: '.png',
            start: 1,
            end: 7,
            zeroPad: 0,
        }),
        frameRate: 10
    });
    scene.anims.create({
        key: 'scythePause',
        frames: scene.anims.generateFrameNames('misc', {
            prefix: 'scythe',
            suffix: '.png',
            start: 1,
            end: 5,
            zeroPad: 0,
        }),
        frameRate: 15
    });
    scene.anims.create({
        key: 'scytheResume',
        frames: scene.anims.generateFrameNames('misc', {
            prefix: 'scythe',
            suffix: '.png',
            start: 5,
            end: 8,
            zeroPad: 0,
        }),
        frameRate: 15
    });
    scene.anims.create({
        key: 'scytheReap',
        frames: scene.anims.generateFrameNames('misc', {
            prefix: 'scythe',
            suffix: '.png',
            start: 1,
            end: 8,
            zeroPad: 0,
        }),
        frameRate: 15
    });
    scene.anims.create({
        key: 'ladydeathcape',
        frames: scene.anims.generateFrameNames('deathfin', {
            prefix: 'frame00',
            suffix: '.png',
            start: 0,
            end: 74,
            zeroPad: 2,
        }),
        frameRate: 30
    });
    scene.anims.create({
        key: 'ladydeathhood',
        frames: scene.anims.generateFrameNames('deathfin', {
            prefix: 'hood00',
            suffix: '.png',
            start: 0,
            end: 74,
            zeroPad: 2,
        }),
        frameRate: 30
    });
    scene.anims.create({
        key: 'weaken',
        frames: scene.anims.generateFrameNames('spells', {
            prefix: 'weakenLines_',
            suffix: '.png',
            start: 0,
            end: 1,
            zeroPad: 2,
        }),
        frameRate: 3,
        repeat: -1
    });
    scene.anims.create({
        key: 'energyTarget',
        frames: scene.anims.generateFrameNames('spells', {
            prefix: 'energyTarget',
            suffix: '.png',
            start: 1,
            end: 2,
            zeroPad: 1,
        }),
        frameRate: 2,
        repeat: -1
    });
    scene.anims.create({
        key: 'newButtonAnim',
        frames: scene.anims.generateFrameNames('buttons', {
            prefix: 'new_btn_anim_',
            suffix: '.png',
            start: 1,
            end: 15,
            zeroPad: 1,
        }),
        frameRate: 15,
        repeat: -1
    });
}
