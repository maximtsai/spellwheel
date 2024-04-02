let useFirstBG = true;
function fadeInBackground(name, duration = 15000, scale = 1) {
    let nextObj = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight * 0.7, name).setDepth(-10).setScale(1.1).setAlpha(0).setOrigin(0.5, 0.35);
    nextObj.setScale(scale);
    PhaserScene.tweens.add({
        targets: nextObj,
        alpha: 1,
        duration: duration
    });

    if (useFirstBG) {
        if (globalObjects.background1) {
            globalObjects.background1.destroy();
        }
        globalObjects.background1 = nextObj;
    } else {
        if (globalObjects.background2) {
            globalObjects.background2.destroy();
        }
        globalObjects.background2 = nextObj;
    }

    useFirstBG = !useFirstBG;
    return nextObj;
}

function fadeInBackgroundAtlas(atlas, name, duration = 15000, scale = 1.1, endScale, ease, delay, extra) {
    let nextObj = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight * 0.7, atlas, name).setDepth(-10).setScale(scale).setAlpha(0).setOrigin(0.5, 0.35);
    PhaserScene.tweens.add({
        delay: delay,
        targets: nextObj,
        alpha: 1,
        ease: ease,
        duration: duration
    });
    if (endScale !== undefined) {
        PhaserScene.tweens.add({
            delay: delay,
            targets: nextObj,
            scaleX: extra ? endScale + 0.1 : endScale,
            scaleY: extra ? endScale + 0.1 : endScale,
            ease: ease ? ease : 'Cubic.easeOut',
            duration: duration + 1000,
            onComplete: () => {
                PhaserScene.tweens.add({
                    targets: nextObj,
                    scaleX: endScale,
                    scaleY: endScale,
                    ease: 'Cubic.easeOut',
                    duration: 500
                });
            }
        });
    }


    if (useFirstBG) {
        if (globalObjects.background2) {
            globalObjects.background2.setDepth(-11);
        }
        if (globalObjects.background1) {
            globalObjects.background1.destroy();
        }
        globalObjects.background1 = nextObj;
    } else {
        if (globalObjects.background1) {
            globalObjects.background1.setDepth(-11);
        }
        if (globalObjects.background2) {
            globalObjects.background2.destroy();
        }
        globalObjects.background2 = nextObj;
    }


    useFirstBG = !useFirstBG;
    return nextObj;
}

function zoomInCurrBackground(duration, scale, ease) {
    let currBG;
    if (useFirstBG) {
        currBG = globalObjects.background2;
    } else {
        currBG = globalObjects.background1;
    }
    PhaserScene.tweens.add({
        targets: currBG,
        scaleX: scale,
        scaleY: scale,
        ease: ease,
        duration: duration
    });

}
