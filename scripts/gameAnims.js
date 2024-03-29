function createAnimations(scene) {
    // scene.anims.create({
    //     key: 'snooze',
    //     frames: [
    //         { key: 'cat1' },
    //         { key: 'cat2' },
    //         { key: 'cat3' },
    //         { key: 'cat4', duration: 50 }
    //     ],
    //     frameRate: 8,
    //     repeat: -1
    // });
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
        key: 'scytheReap',
        frames: scene.anims.generateFrameNames('misc', {
            prefix: 'scythe',
            suffix: '.png',
            start: 2,
            end: 6,
            zeroPad: 0,
        }),
        frameRate: 20
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
}
