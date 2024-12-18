class BgHandler {
    constructor() {
        // updateManager.addFunction(this.update.bind(this));
        this.goalX = gameConsts.halfWidth;
    }

    // update(delta) {
    //     this.goalX = gameConsts.halfWidth + (gameConsts.halfWidth - gameVars.mouseposx)*0.01;
    //     if (globalObjects.background1) {
    //         globalObjects.background1.x = globalObjects.background1.x * 0.95 + this.goalX * 0.05;
    //     }
    //     if (globalObjects.background2) {
    //         globalObjects.background2.x = globalObjects.background2.x * 0.95 + this.goalX * 0.05;
    //     }
    // }
}


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
        globalObjects.background1.velX = 0;
    } else {
        if (globalObjects.background2) {
            globalObjects.background2.destroy();
        }
        globalObjects.background2 = nextObj;
        globalObjects.background2.velX = 0;
    }

    useFirstBG = !useFirstBG;
    return nextObj;
}

function fadeInBackgroundAtlas(atlas, name, duration = 15000, scale = 1.1, endScaleX, endScaleY, ease, delay, extra, yOffset = 0, noAnim = false) {
    let nextObj = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight * 0.7 + yOffset, atlas, name).setDepth(-10).setScale(scale, Math.abs(scale)).setAlpha(0).setOrigin(0.5, 0.35);

    if (!noAnim) {
        PhaserScene.tweens.add({
            delay: delay,
            targets: nextObj,
            alpha: 1,
            ease: ease,
            duration: duration
        });
        if (endScaleX !== undefined) {
            PhaserScene.tweens.add({
                delay: delay,
                targets: nextObj,
                scaleX: extra ? endScaleX + 0.1 : endScaleX,
                scaleY: extra ? endScaleY + 0.1 : endScaleY,
                ease: ease ? ease : 'Cubic.easeOut',
                duration: duration + 1000,
                onComplete: () => {
                    PhaserScene.tweens.add({
                        targets: nextObj,
                        scaleX: endScaleX,
                        scaleY: endScaleY,
                        ease: 'Cubic.easeOut',
                        duration: 500
                    });
                }
            });
        }
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
