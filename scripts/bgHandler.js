let useFirstBG = true;
function fadeInBackground(name, duration = 15000) {
    let nextObj = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'background').setDepth(-1).setScale(1.08).setAlpha(0).setOrigin(0.5, 0.5);
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