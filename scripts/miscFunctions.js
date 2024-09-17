function getBackgroundBlackout() {
    if (globalObjects) {
        if (!globalObjects.blackBackground) {
            globalObjects.blackBackground = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setScale(1000, 1000).setDepth(-3);
        }
        globalObjects.blackBackground.setDepth(-3);
        return globalObjects.blackBackground;
    }
}

function getBackgroundBlackout2() {
    if (globalObjects) {
        if (!globalObjects.blackBackground2) {
            globalObjects.blackBackground2 = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setScale(1000, 1000).setDepth(-8).setAlpha(0);
        }
        return globalObjects.blackBackground2;
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
        case 'hpx':
            cheats.extraHealth = !cheats.extraHealth;
            globalObjects.player.reInitStats();
            globalObjects.player.resetStats();
            break;
        case 'hpdx':
            cheats.extraExtraHealth = !cheats.extraExtraHealth;
            globalObjects.player.reInitStats();
            globalObjects.player.resetStats();
            break;
        case 'inam':
            cheats.infiniteAmmo = !cheats.infiniteAmmo;
            messageBus.publish('manualResetElements');
            messageBus.publish('manualResetEmbodiments');
            break;
        case 'flal':
            cheats.fullArsenal = !cheats.fullArsenal;
            updateSpellState(gameVars.latestLevel);
            globalObjects.player.resetStats();
            messageBus.publish('manualResetElements');
            messageBus.publish('manualResetEmbodiments');
            break;

        default:
            break;
    }
    updateCheatsDisplay();
}

function updateCheatsDisplay() {
    let cheatsText = "CHEATS:";
    if (!cheatsDisplay) {
        cheatsDisplay = PhaserScene.add.text(gameConsts.width - 7, gameConsts.height , ' ', {fontFamily: 'robotomedium', fontSize: 15, color: '#FF0000', align: 'right'}).setOrigin(1, 1);
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

function isUsingCheats() {
    for (let i in cheats) {
        if (cheats[i]) {
            return true;
        }
    }
    return false;
}
