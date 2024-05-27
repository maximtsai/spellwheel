function getBackgroundBlackout() {
    if (globalObjects) {
        if (!globalObjects.blackBackground) {
            globalObjects.blackBackground = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setScale(1000, 1000).setDepth(-1);
        }
        return globalObjects.blackBackground;
    }
}

function createGlobalClickBlocker(showPointer) {
    if (!globalObjects.clickBlocker) {
        globalObjects.clickBlocker = new Button({
             normal: {
                 ref: "blackPixel",
                 x: gameConsts.halfWidth,
                 y: gameConsts.halfHeight,
                 alpha: 0.001,
                 scaleX: 1000,
                 scaleY: 1000
             },
             onMouseUp: () => {

             }
         });
    } else {
        globalObjects.clickBlocker.setState(NORMAL);
        globalObjects.clickBlocker.setOnMouseUpFunc(() => {});
        buttonManager.bringButtonToTop(globalObjects.clickBlocker);
    }
    if (globalObjects.magicCircle) {
        globalObjects.magicCircle.disableMovement();
    }
    if (showPointer && canvas) {
        canvas.style.cursor = 'pointer';
    }
    return globalObjects.clickBlocker;
}

function hideGlobalClickBlocker() {
    globalObjects.clickBlocker.setState(DISABLE);
    if (canvas) {
        canvas.style.cursor = 'default';
    }
    if (globalObjects.magicCircle) {
        globalObjects.magicCircle.enableMovement();
    }
}