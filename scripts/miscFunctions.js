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

let cheatsDisplay;
function toggleCheat(code) {
    switch(code) {
        case 'dd':
            cheats.extraDmg = !cheats.extraDmg;
            break;
        case 'edd':
            cheats.extraExtraDmg = !cheats.extraExtraDmg;
            break;
        default:
            break;
    }
    updateCheatsDisplay();
}

function updateCheatsDisplay() {
    let cheatsText = "CHEATS:";
    if (!cheatsDisplay) {
        cheatsDisplay = PhaserScene.add.text(7, gameConsts.height , ' ', {fontFamily: 'verdanamax', fontSize: 15, color: '#FF0000', align: 'left'}).setOrigin(0, 1);
        cheatsDisplay.setDepth(500);
    }
    let hasCheats = false;
    for (let i in cheats) {
        if (cheats[i]) {
            hasCheats = true;
            cheatsText += "\n" + i;
        }
    }
    if (hasCheats) {
        cheatsDisplay.setText(cheatsText);

    } else {
        cheatsDisplay.setText(' ');
    }

}
