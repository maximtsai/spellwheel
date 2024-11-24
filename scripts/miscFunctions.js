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

function showRewardAdOption() {
    let timerBack = PhaserScene.add.image(5, gameConsts.halfHeight - 52, 'pixels', 'black_blue_pixel.png').setScale(0, 2.5).setOrigin(0, 0.5).setDepth(999).setAlpha(0.65);
    let timer = PhaserScene.add.image(6, gameConsts.halfHeight - 52, 'pixels', 'green_pixel.png').setScale(0, 2).setOrigin(0, 0.5).setDepth(999);
    setTimeout(() => {
        timerBack.setScale(52, 2.5);
        timer.setScale(50, 2);
        PhaserScene.tweens.add({
            targets: timer,
            scaleX: 0,
            duration: 11000,
            onComplete: () => {
                timerBack.destroy();
                rewardBtn.tweenToPos(-85, gameConsts.halfHeight - 80, 500, 'Cubic.easeOut');
                setTimeout(() => {
                    rewardBtn.destroy();
                }, 500)
            }
        })
    }, 400)
    let rewardBtn = new Button({
        normal: {
            ref: "reward.png",
            atlas: 'misc',
            x: -60,
            y: gameConsts.halfHeight - 80,
            alpha: 1
        },
        hover: {
            ref: "reward_hover.png",
            atlas: 'misc',
            alpha: 1
        },
        press: {
            ref: "reward_press.png",
            atlas: 'misc',
            alpha: 1
        },
        disable: {
            alpha: 0
        },
        onHover: () => {
            if (canvas) {
                playSound('click').detune = -100;
                canvas.style.cursor = 'pointer';
            }
        },
        onHoverOut: () => {
            if (canvas) {
                canvas.style.cursor = 'default';
            }
        },
        onMouseUp: () => {
            rewardBtn.destroy();
            sdkShowRewardAd(() => {
                globalObjects.magicCircle.disableMovement();
                messageBus.publish('pauseGame', 0.002);
            },
                () => {
                    globalObjects.magicCircle.enableMovement();
                    messageBus.publish('unpauseGame');
                    messageBus.publish("showRandUlt");
                },
                () => {
                    globalObjects.magicCircle.enableMovement();
                    messageBus.publish('unpauseGame');
                    messageBus.publish("showRandUlt");
                });
        }
    });
    rewardBtn.setScale(0.7)
    rewardBtn.tweenToPos(45, gameConsts.halfHeight - 80, 500, 'Back.easeOut');
    rewardBtn.tweenToScale(0.85, 0.85, 500, 'Back.easeOut')
    rewardBtn.setDepth(998);
    rewardBtn.addToDestructibles(timerBack)
    rewardBtn.addToDestructibles(timer)

    return rewardBtn;
}
