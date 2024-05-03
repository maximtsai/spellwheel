let CURRENT_LEVEL = null;
let levelTimeoutID = null;

function beginLevel(lvl) {
    CURRENT_LEVEL = lvl;

    updateSpellState(lvl)
    globalObjects.player.resetStats();
    messageBus.publish('manualResetElements', undefined, true);
    messageBus.publish('manualResetEmbodiments', undefined, true); // with long delay

    globalObjects.magicCircle.buildRunes();


    createEnemyAfterDelay(lvl);
    switch(lvl) {
        case 0:
            // zoomInCurrBackground(1500, 2, 'Cubic.easeIn');
            fadeInBackgroundAtlas('backgrounds', 'background1.webp', 1500, 1, 1, 'Quart.easeIn', 0, false);
            break;
        case 1:
            fadeInBackgroundAtlas('backgrounds', 'background3.webp', 1500, 1, 1, 'Quart.easeIn', 0, false);
            break;
        case 2:
            fadeInBackgroundAtlas('backgrounds', 'background5.webp', 1500, 1, 1, 'Quart.easeIn', 0, false);
            break;
        case 3:
            fadeInBackgroundAtlas('backgrounds', 'background6.webp', 1500, 1, 1, 'Quart.easeIn', 0, false);
            break;
        case 4:
            fadeInBackgroundAtlas('backgrounds', 'background3.webp', 1500, 1, 1, 'Quart.easeIn', 0, false);
            break;
        case 5:
            fadeInBackgroundAtlas('backgrounds', 'background5.webp', 1500, 1, 1, 'Quart.easeIn', 0, false);
            break;
        case 6:
            fadeInBackgroundAtlas('backgrounds', 'background6.webp', 1500, 1, 1, 'Quart.easeIn', 0, false);
            break;

        case 7:
            fadeInBackgroundAtlas('backgrounds', 'firebg1.png', 1500, 5, 1, 'Quart.easeIn', 0, true);
            break;
        case 8:
            fadeInBackgroundAtlas('backgrounds', 'firebg1.png', 1500, 5, 1, 'Quart.easeIn', 0, true);
            break;
        case 9:
            fadeInBackgroundAtlas('backgrounds', 'tunnel.png', 1500, 1, 1, 'Quart.easeIn', 0, false);
            break;
    }
}

function createEnemyAfterDelay(lvl) {
    levelTimeoutID = setTimeout(() => {
        if (lvl === CURRENT_LEVEL) {
            createEnemy(lvl);
        }
    }, 1400);
}

function createTutorialBtn(lvl) {
    if (!globalObjects.runeHighlight) {
        globalObjects.runeHighlight = PhaserScene.add.sprite(0, 0, 'tutorial', 'rune_highlight.png').setDepth(10002).setVisible(false);
        globalObjects.runeHighlightTemp = PhaserScene.add.sprite(0, 0, 'tutorial', 'rune_highlight.png').setDepth(10002).setAlpha(0);
        globalObjects.runePicture = PhaserScene.add.sprite(gameConsts.halfWidth - 210, gameConsts.halfHeight - 40, 'tutorial', 'blank.png').setDepth(10002).setVisible(false).setRotation(-0.15);
    }
    switch(lvl) {
        case 0:
            break;
        case 1:
            break;
        case 2:
            return buildTutorialButton('rune_mind_large.png', buildTutorialMind);
            break;
        case 3:
            break;
        case 4:
            break;
        case 5:
            break;
        case 6:
            break;
        case 7:
            break;
    }
}

function buildTutorialButton(icon = "rune_matter_large.png", popup) {
    let btnPopBack = PhaserScene.add.sprite(42, 70, 'buttons', 'new_btn_back.png').setScale(0.1).setDepth(130);
    let btnIcon = PhaserScene.add.sprite(42, 70, 'tutorial', icon).setScale(0.05).setDepth(130);
    let btnPop = PhaserScene.add.sprite(42, 70, 'buttons', 'new_btn.png').setScale(0.1).setDepth(131);

    let returnButton;
    returnButton = new Button({
        normal: {
            atlas: "buttons",
            ref: "new_btn.png",
            alpha: 1,
            x: 42,
            y: 70,
        },
        hover: {
            atlas: "buttons",
            ref: "new_btn_hover.png",
            alpha: 1,
        },
        disable: {
            alpha: 0.0001
        },
        onHover: () => {
            if (canvas) {
                canvas.style.cursor = 'pointer';
            }
        },
        onHoverOut: () => {
            if (canvas) {
                canvas.style.cursor = 'default';
            }
        },
        onMouseUp: () => {
            showTutorialImage();
            returnButton.destroy();
            popup();
        }
    });
    returnButton.setDepth(130);
    returnButton.setState(DISABLE);

    PhaserScene.tweens.add({
        targets: [btnPopBack, btnPop],
        scaleX: 1,
        scaleY: 1,
        ease: "Back.easeOut",
        duration: 600,
        onComplete: () => {
            btnPop.destroy();
            returnButton.setState(NORMAL);
            let anim = PhaserScene.add.sprite(42, 70, 'buttons').setDepth(130).play('newButtonAnim');
            returnButton.addToDestructibles(anim);
        }
    });

    PhaserScene.tweens.add({
        targets: btnIcon,
        scaleX: 0.5,
        scaleY: 0.5,
        ease: "Back.easeOut",
        duration: 600,
    });
    returnButton.addToDestructibles(btnIcon);
    returnButton.addToDestructibles(btnPopBack);

    return returnButton;
}

function showTutorialImage() {
    console.log("hey");
}

function buildTutorialBasic(scalingDestructibles, nonscalingDestructibles) {
    messageBus.publish('pauseGame', 0.002);
    globalObjects.magicCircle.disableMovement();

    let tutBackground = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 100, 'tutorial', 'popupTutorial.png').setScale(0.985).setAlpha(0.5).setDepth(10000);
    let tutPlus = PhaserScene.add.sprite(gameConsts.halfWidth - 120, gameConsts.halfHeight - 200, 'tutorial', 'plus_symbol.png').setScale(0.96).setAlpha(0.5).setDepth(10000);
    let tutTitleBg = PhaserScene.add.sprite(gameConsts.halfWidth - 175, gameConsts.halfHeight - 270, 'tutorial', 'title.png').setDepth(10000);

    let closeButton;
    closeButton = new Button({
        normal: {
            atlas: "tutorial",
            ref: "popupClose.png",
            x: gameConsts.halfWidth + 200,
            y: gameConsts.halfHeight + 100,
            alpha: 1,
            scaleX: 1,
            scaleY: 1
        },
        hover: {
            atlas: "tutorial",
            ref: "popupClose_hover.png",
        },
        press: {
            atlas: "tutorial",
            ref: "popupClose_press.png",
        },
        onMouseUp: () => {
            messageBus.publish('unpauseGame');
            globalObjects.magicCircle.enableMovement();
            closeButton.destroy();
            cleanupTutorialElements([tutTitleBg, tutBackground, tutPlus]);
            cleanupTutorialElements(scalingDestructibles);
            cleanupTutorialElements(nonscalingDestructibles, true);
            globalObjects.runeHighlight.setVisible(false).setScale(0.96);
            globalObjects.runeHighlightTemp.setAlpha(0);
        }
    });
    closeButton.setDepth(10002);

    PhaserScene.tweens.add({
        targets: [tutBackground, tutPlus],
        scaleX: 1,
        scaleY: 1,
        alpha: 1,
        ease: "Back.easeOut",
        duration: 1,
    });
    PhaserScene.tweens.add({
        targets: scalingDestructibles,
        scaleX: 1,
        scaleY: 1,
        alpha: 1,
        ease: "Back.easeOut",
        duration: 1,
    });

}

function buildTutorialMind() {
    let clickBlocker = buildClickblocker();
    let initTutText = "The Energy Rune provides powerful\nsupportive abilities and even\nhas the ability to bypass\nenemy shields.";
    let tutText = PhaserScene.add.text(gameConsts.halfWidth - 125, gameConsts.halfHeight - 110, initTutText, {fontFamily: 'Verdana', fontSize: 24, color: '#2A1122', align: 'left'}).setDepth(10001).setOrigin(0, 0);
    globalObjects.runePicture.setVisible(true).setAlpha(0).setScale(0.96);
    PhaserScene.tweens.add({
        delay: 1,
        targets: [tutText, globalObjects.runePicture],
        alpha: 1,
        scaleX: 1,
        scaleY: 1,
        duration: 1,
    });

    let tutTitleText = PhaserScene.add.text(gameConsts.halfWidth - 180, gameConsts.halfHeight - 270, 'MIND RUNE', {fontFamily: 'Verdana', fontSize: 24, color: '#2A1122', align: 'left'}).setScale(1).setDepth(10001).setOrigin(0.5, 0.5);
    let tutRune = PhaserScene.add.sprite(gameConsts.halfWidth - 200, gameConsts.halfHeight - 190, 'tutorial', 'rune_mind_large.png').setScale(0.96).setAlpha(0.5).setDepth(10001);
    let runeClicker1 = buildRuneclicker(tutRune.x, tutRune.y, () => {
        tutText.setText(initTutText);
        globalObjects.runePicture.setFrame('blank.png');
    })

    globalObjects.runeHighlight.setVisible(true).setScale(1).setPosition(tutRune.x, tutRune.y);

    let tutRune2 = PhaserScene.add.sprite(gameConsts.halfWidth - 0, gameConsts.halfHeight - 190, 'tutorial', 'rune_strike_large.png').setScale(0.96).setAlpha(0.5).setDepth(10001);
    let runeClicker2 = buildRuneclicker(tutRune2.x, tutRune2.y, () => {
        tutText.setText("Fires a bolt of energy that\ndeals little damage on it's\nown, but it amplifies your next\nattack for double (x2) damage.");
        globalObjects.runePicture.setFrame('tut_mind_strike.png');

    })

    let tutRune3 = PhaserScene.add.sprite(gameConsts.halfWidth + 150, gameConsts.halfHeight - 190, 'tutorial', 'rune_enhance_large.png').setScale(0.96).setAlpha(0.5).setDepth(10001);
    let runeClicker3 = buildRuneclicker(tutRune3.x, tutRune3.y, () => {
        tutText.setText("Your next attack sets the\nenemy on fire, which deals\ndamage over time that\nbypasses shields.");
        globalObjects.runePicture.setFrame('tut_mind_enhance.png');
    })

    buildTutorialBasic([tutTitleText, tutRune, tutRune2, tutRune3, tutText], [runeClicker1, runeClicker2, runeClicker3, clickBlocker]);
}

function buildRuneclicker(x, y, onClick) {
    let runeClicker = new Button({
        normal: {
            ref: "blackPixel",
            x: x,
            y: y,
            alpha: 0.001,
            scaleX: 50,
            scaleY: 50
        },
        onHover: () => {
            if (canvas) {
                canvas.style.cursor = 'pointer';
            }
            globalObjects.runeHighlightTemp.setPosition(x, y).setAlpha(0.25);
        },
        onHoverOut: () => {
            if (canvas) {
                canvas.style.cursor = 'default';
            }
            globalObjects.runeHighlightTemp.setAlpha(0);
        },
        onMouseUp: () => {
            onClick();
            globalObjects.runeHighlight.setPosition(x, y);

        }
    });
    return runeClicker;
}

function buildClickblocker() {
    let clickBlocker = new Button({
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
    return clickBlocker;
}

function cleanupTutorialElements(itemsToDestroy, isInstant) {
    if (isInstant) {
        for (let i = 0; i < itemsToDestroy.length; i++) {
            itemsToDestroy[i].destroy();
        }
    } else {
        PhaserScene.tweens.add({
            targets: itemsToDestroy,
            x: gameConsts.width - 120,
            y: 70,
            scaleX: 0.25,
            scaleY: 0.25,
            duration: 600,
            ease: 'Cubic.easeOut',
            alpha: 0,
            onComplete: () => {
                for (let i = 0; i < itemsToDestroy.length; i++) {
                    itemsToDestroy[i].destroy();
                }
            }
        });
    }
}
