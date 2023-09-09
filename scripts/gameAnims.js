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
            end: 3,
            zeroPad: 0,
        }),
        frameRate: 10,
        repeat: -1
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
