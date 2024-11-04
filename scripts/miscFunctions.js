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
        case 'cene':
            cheats.calmEnemies = !cheats.calmEnemies;
            break;
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
            cheats.bonusHealth = !cheats.bonusHealth;
            globalObjects.player.reInitStats();
            globalObjects.player.resetStats();
            break;
        case 'sshd':
            cheats.superShield = !cheats.superShield;
            if (cheats.superShield) {
                messageBus.publish('castSpell', {runeName: "rune_matter"}, {runeName: "rune_superprotect"}, 'shield9', 0);
            } else {
                globalObjects.player.clearSpecificEffect('shield9')
            }
            break;
        case 'inam':
            cheats.infiniteAmmo = !cheats.infiniteAmmo;
            messageBus.publish('manualResetElements');
            messageBus.publish('manualResetEmbodiments');
            break;
        case 'flal':
            cheats.fullArsenal = !cheats.fullArsenal;
            updateSpellState(gameVars.currLevel);
            globalObjects.magicCircle.buildRunes()
            messageBus.publish('manualResetElements');
            messageBus.publish('manualResetEmbodiments');
            break;
        case 'ultr':
            cheats.extraUlt = !cheats.extraUlt;
            updateSpellState(gameVars.currLevel);
            globalObjects.magicCircle.buildRunes()
            messageBus.publish('manualResetElements');
            messageBus.publish('manualResetEmbodiments');
            break;
        default:
            break;
    }
    updateCheatsDisplay();
}

function updateCheatsDisplay() {
    let cheatsText = "C:";
    if (!cheatsDisplay) {
        cheatsDisplay = PhaserScene.add.text(gameConsts.width - 7, gameConsts.height , ' ', {fontFamily: 'robotomedium', fontSize: 15, color: '#FF0000', align: 'right'}).setOrigin(1, 1);
        cheatsDisplay.setDepth(500).setAlpha(0.5);
    }
    let hasCheats = false;
    for (let i in cheats) {
        if (cheats[i]) {
            hasCheats = true;
            cheatsText += "\n" + i;
        }
    }
    cheatsDisplay.visible = true;
    if (hasCheats) {
        cheatsDisplay.setText(cheatsText);
        gameVars.hasCheated = true;
    } else if (gameVars.hasCheated) {
        cheatsDisplay.setText('C');
    } else {
        cheatsDisplay.visible = false;
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
