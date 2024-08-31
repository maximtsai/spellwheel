let CURRENT_LEVEL = null;
let levelTimeoutID = null;

function beginPreLevel(lvl) {
    globalObjects.encyclopedia.hideButton();
    globalObjects.options.hideButton();
    let introPaper;
    let text1;
    let text2;
    let text3;
    let text4;
    let text5;
    let text6;
    let text7;
    let text8;
    let text9;
    let introOverlay;
    if (lvl != 0) {
        switchLevelBackground(lvl);
    }
    switch(lvl) {
        case 0:
            gameVars.latestLevel = 0;
            // lesser dummy
            introPaper = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight + 35, 'ui', 'paper.png').setDepth(99999).setAlpha(0);
            introOverlay = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight + 10, 'ui', 'newgame_paper.png').setDepth(99999).setAlpha(0).setBlendMode(Phaser.BlendModes.MULTIPLY);
            text1 = PhaserScene.add.text(gameConsts.halfWidth - 253, gameConsts.halfHeight - 282, getLangText('pre_fight_0a'), {fontFamily: 'opensans', fontSize: 24, color: '#200000', align: 'left'});
            text1.setDepth(99999).setOrigin(0, 0).setAlpha(0);
            text2 = PhaserScene.add.text(gameConsts.halfWidth - 253, gameConsts.halfHeight - 195, getLangText('pre_fight_0b'), {fontFamily: 'opensans', fontSize: 16, color: '#200000', align: 'left'});
            text2.setDepth(99999).setOrigin(0, 0).setAlpha(0).setVisible(false);
            text3 = PhaserScene.add.text(gameConsts.halfWidth + 137, gameConsts.halfHeight - 170, getLangText('pre_fight_0c'), {fontFamily: 'opensans', fontSize: 24, color: '#200000', align: 'right'});
            text3.setDepth(99999).setAlpha(0).setOrigin(1, 1);
            text4 = PhaserScene.add.text(gameConsts.halfWidth + 140, gameConsts.halfHeight - 105, getLangText('pre_fight_0d'), {fontFamily: 'opensans', fontSize: 24, color: '#200000', align: 'right'});
            text4.setDepth(99999).setAlpha(0).setOrigin(1, 1);
            text5 = PhaserScene.add.text(text3.x + 10, text3.y + 1, getLangText('pre_fight_0e'), {fontFamily: 'opensans', fontSize: 18, color: '#200000', align: 'right'});
            text5.setDepth(99999).setAlpha(0).setOrigin(1, 1).setVisible(false);
            text6 = PhaserScene.add.text(text4.x + 7, text4.y + 2, getLangText('pre_fight_0f'), {fontFamily: 'opensans', fontSize: 16, color: '#200000', align: 'right'});
            text6.setDepth(99999).setAlpha(0).setOrigin(1, 0.85).setVisible(false);
            text7 = PhaserScene.add.text(gameConsts.halfWidth + 220, gameConsts.halfHeight - 48, getLangText('pre_fight_0g'), {fontFamily: 'opensans', fontSize: 24, color: '#200000', align: 'center'});
            text7.setDepth(99999).setAlpha(0).setOrigin(1, 1);
            text8 = PhaserScene.add.text(gameConsts.halfWidth, gameConsts.halfHeight + 236, getLangText('pre_fight_0h'), {fontFamily: 'opensans', fontSize: 18, color: '#200000', align: 'center'});
            text8.setDepth(99999).setAlpha(0).setOrigin(0.5, 1);
            text9 = PhaserScene.add.text(gameConsts.halfWidth, gameConsts.halfHeight + 248, getLangText('pre_fight_0i'), {fontFamily: 'opensans', fontSize: 24, color: '#200000', align: 'center'});
            text9.setDepth(99999).setAlpha(0).setOrigin(0.5, 0);

            createGlobalClickBlocker();

            let strikeHoverBtn = new Button({
                normal: {
                    ref: "tut_btn.png",
                    atlas: 'buttons',
                    x: gameConsts.halfWidth + 81,
                    y: text3.y - 91,
                    alpha: 0.3
                },
                hover: {
                    ref: "tut_btn_hover.png",
                    atlas: 'buttons',
                    alpha: 0.6
                },
                press: {
                    ref: "tut_btn_hover.png",
                    atlas: 'buttons',
                    alpha: 0.6
                },
                disable: {
                    alpha: 0
                },
                onHover: () => {
                    PhaserScene.tweens.add({
                        targets: text3,
                        alpha: 0,
                        duration: 0
                    })
                    text5.visible = true;
                    text5.alpha = 0;
                    PhaserScene.tweens.add({
                        targets: text5,
                        alpha: 0.65,
                        duration: 0
                    })
                },
                onHoverOut: () => {
                    if (!text3.locked) {
                        text3.visible = true;
                        PhaserScene.tweens.add({
                            targets: text3,
                            alpha: 0.65,
                            duration: 150
                        })
                        PhaserScene.tweens.add({
                            targets: text5,
                            alpha: 0,
                            duration: 150
                        })
                    }
                },
                onMouseUp: () => {
                    if (text3.locked && gameVars.wasTouch) {
                        text5.visible = !text5.visible;
                        text3.visible = !text5.visible;

                        PhaserScene.tweens.add({
                            targets: text3,
                            alpha: text3.visible ? 0.65 : 0,
                            duration: 100
                        })
                        PhaserScene.tweens.add({
                            targets: text5,
                            alpha: text5.visible ? 0.65 : 0,
                            duration: 100
                        })
                    }
                    text3.locked = true;
                }
            });
            strikeHoverBtn.setOrigin(0.5, 0.5);
            strikeHoverBtn.setDepth(99999);
            strikeHoverBtn.setState(DISABLE);

            let matterHoverBtn = new Button({
                normal: {
                    ref: "tut_btn.png",
                    atlas: 'buttons',
                    x: gameConsts.halfWidth + 81,
                    y: text4.y - 91,
                    alpha: 0.3
                },
                hover: {
                    ref: "tut_btn_hover.png",
                    atlas: 'buttons',
                    alpha: 0.6
                },
                press: {
                    ref: "tut_btn_hover.png",
                    atlas: 'buttons',
                    alpha: 0.6
                },
                disable: {
                    alpha: 0
                },
                onHover: () => {
                    PhaserScene.tweens.add({
                        targets: text4,
                        alpha: 0,
                        duration: 100
                    })
                    text6.visible = true;
                    text6.alpha = 0;
                    PhaserScene.tweens.add({
                        targets: text6,
                        alpha: 0.65,
                        duration: 100
                    })
                },
                onHoverOut: () => {
                    if (text4.locked) {
                        return;
                    }
                    text4.visible = true;
                    PhaserScene.tweens.add({
                        targets: text4,
                        alpha: 0.65,
                        duration: 0
                    })
                    PhaserScene.tweens.add({
                        targets: text6,
                        alpha: 0,
                        duration: 0
                    })
                },
                onMouseUp: () => {
                    if (text4.locked && gameVars.wasTouch) {
                        text6.visible = !text6.visible;
                        text4.visible = !text6.visible;
                        PhaserScene.tweens.add({
                            targets: text4,
                            alpha: text4.visible ? 0.65 : 0,
                            duration: 100
                        })
                        PhaserScene.tweens.add({
                            targets: text6,
                            alpha: text6.visible ? 0.65 : 0,
                            duration: 100
                        })
                    }
                    text4.locked = true;
                }
            });
            matterHoverBtn.setOrigin(0.5, 0.5);
            matterHoverBtn.setDepth(99999);
            matterHoverBtn.setState(DISABLE);

            texts = [text1, text2, text3, text4, text5, text6, text7, text8, text9, strikeHoverBtn, matterHoverBtn];
            playSound('flip2')
            PhaserScene.tweens.add({
                targets: texts,
                duration: 500,
                ease: 'Cubic.easeOut',
                y: "-=60",
            })
            PhaserScene.tweens.add({
                targets: texts,
                alpha: 0.65,
                duration: 650,
                onComplete: () => {
                    strikeHoverBtn.setState(NORMAL);
                    matterHoverBtn.setState(NORMAL);
                }
            })

            let introbgs = [introPaper, introOverlay];
            PhaserScene.tweens.add({
                targets: introPaper,
                alpha: 1,
                duration: 500,
                scaleX: 1,
                scaleY: 1.1,
                ease: 'Cubic.easeOut',
                y: "-=60",
                onComplete: () => {
                    let itemsToClear = texts.concat(introbgs);
                    createLvlCloseButton(lvl, itemsToClear, 5, 35, [strikeHoverBtn, matterHoverBtn]);
                }
            });
            PhaserScene.tweens.add({
                targets: introOverlay,
                alpha: 1,
                duration: 500,
                scaleX: 1,
                scaleY: 1,
                ease: 'Cubic.easeOut',
                y: "-=60",
            });
            break;
        case 2:
            // goblin
            introPaper = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight + 35, 'ui', 'paper.png').setDepth(99999).setAlpha(0);
            introOverlay = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight + 35, 'ui', 'gobbo_paper.png').setDepth(99999).setAlpha(0).setBlendMode(Phaser.BlendModes.MULTIPLY);
            text1 = PhaserScene.add.text(gameConsts.halfWidth - 40, gameConsts.halfHeight - 205, getLangText('pre_fight_1a'), {fontFamily: 'garamondbold', fontSize: 26, color: '#200000', align: 'left'});
            text1.setDepth(99999).setOrigin(0, 0).setAlpha(0);
            // text2 = PhaserScene.add.text(gameConsts.halfWidth - 68, gameConsts.halfHeight - 5, "Its spittle filled mouth\ntaunts me for a fight.", {fontFamily: 'garamondbold', fontSize: 23, color: '#200000', align: 'left'});
            // text2.setDepth(99999).setOrigin(0, 0).setAlpha(0);
            text3 = PhaserScene.add.text(gameConsts.halfWidth - 240 , gameConsts.halfHeight + 100, getLangText('pre_fight_1b'), {fontFamily: 'garamondbold', fontSize: 26, color: '#200000', align: 'left'});
            text3.setDepth(99999).setAlpha(0).setOrigin(0, 0);

            createGlobalClickBlocker();
            fadeInPreFightStuff(lvl, [text1, text3], [introPaper, introOverlay])
            break;
        case 3:
            // tree
            introPaper = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight + 35, 'ui', 'paper.png').setDepth(99999).setAlpha(0);
            introOverlay = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight + 35, 'ui', 'tree_paper.png').setDepth(99999).setAlpha(0).setBlendMode(Phaser.BlendModes.MULTIPLY);
            text1 = PhaserScene.add.text(gameConsts.halfWidth- 246, gameConsts.halfHeight +165, getLangText('pre_fight_2a'), {fontFamily: 'garamondbold', fontSize: 26, color: '#200000', align: 'left'});
            text1.setDepth(99999).setOrigin(0, 0).setAlpha(0);
            // text2 = PhaserScene.add.text(gameConsts.halfWidth- 246, gameConsts.halfHeight +200, getLangText('pre_fight_2b'), {fontFamily: 'garamondbold', fontSize: 26, color: '#200000', align: 'left'});
            // text2.setDepth(99999).setOrigin(0, 0).setAlpha(0);

            createGlobalClickBlocker();
            fadeInPreFightStuff(lvl, [text1], [introPaper, introOverlay])
            break;
        case 4:
            // magician
            introPaper = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight + 35, 'ui', 'paper.png').setDepth(99999).setAlpha(0);
            introOverlay = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight + 40, 'ui', 'magician_paper.png').setDepth(99999).setAlpha(0).setBlendMode(Phaser.BlendModes.MULTIPLY);
            text1 = PhaserScene.add.text(gameConsts.halfWidth- 248, gameConsts.halfHeight - 180, getLangText('pre_fight_3a'), {fontFamily: 'garamondbold', fontSize: 26, color: '#200000', align: 'left'});
            text1.setDepth(99999).setOrigin(0, 0).setAlpha(0);
            text2 = PhaserScene.add.text(gameConsts.halfWidth - 40, gameConsts.halfHeight +65, getLangText('pre_fight_3b'), {fontFamily: 'garamondbold', fontSize: 26, color: '#200000', align: 'left'});
            text2.setDepth(99999).setOrigin(0, 0).setAlpha(0);

            createGlobalClickBlocker();
            fadeInPreFightStuff(lvl, [text1, text2], [introPaper, introOverlay])
            break;
        case 5:
            // knight
            introPaper = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight + 35, 'ui', 'paper.png').setDepth(99999).setAlpha(0);
            introOverlay = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight + 35, 'ui', 'knight_paper.png').setDepth(99999).setAlpha(0).setBlendMode(Phaser.BlendModes.MULTIPLY);
            text1 = PhaserScene.add.text(gameConsts.halfWidth- 246, gameConsts.halfHeight + 130, getLangText('pre_fight_4a'), {fontFamily: 'garamondbold', fontSize: 26, color: '#200000', align: 'left'});
            text1.setDepth(99999).setOrigin(0, 0).setAlpha(0);
            text2 = PhaserScene.add.text(gameConsts.halfWidth- 246, gameConsts.halfHeight +200, getLangText('pre_fight_4b'), {fontFamily: 'garamondbold', fontSize: 26, color: '#200000', align: 'left'});
            text2.setDepth(99999).setOrigin(0, 0).setAlpha(0);

            createGlobalClickBlocker();
            fadeInPreFightStuff(lvl, [text1, text2], [introPaper, introOverlay])
            break;

        case 6:
            // wall
            introPaper = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight + 35, 'ui', 'paper.png').setDepth(99999).setAlpha(0);
            introOverlay = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight + 35, 'ui', 'wall_paper.png').setDepth(99999).setAlpha(0).setBlendMode(Phaser.BlendModes.MULTIPLY);
            text1 = PhaserScene.add.text(gameConsts.halfWidth- 246, gameConsts.halfHeight + 55, getLangText('pre_fight_5a'), {fontFamily: 'garamondbold', fontSize: 26, color: '#200000', align: 'left'});
            text1.setDepth(99999).setOrigin(0, 0).setAlpha(0);
            text2 = PhaserScene.add.text(gameConsts.halfWidth- 246, gameConsts.halfHeight +160, getLangText('pre_fight_5b'), {fontFamily: 'garamondbold', fontSize: 26, color: '#200000', align: 'left'});
            text2.setDepth(99999).setOrigin(0, 0).setAlpha(0);

            createGlobalClickBlocker();
            fadeInPreFightStuff(lvl, [text1, text2], [introPaper, introOverlay])
            break;

        case 7:
            // superdummy
            // introPaper = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight + 35, 'ui', 'paper.png').setDepth(99999).setAlpha(0);
            // introOverlay = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight + 35, 'ui', 'dummy_paper.png').setDepth(99999).setAlpha(0).setBlendMode(Phaser.BlendModes.MULTIPLY);
            // text1 = PhaserScene.add.text(gameConsts.halfWidth- 246, gameConsts.halfHeight + 75, 'This old dummy has come to stand\nin my way again.', {fontFamily: 'garamondbold', fontSize: 23, color: '#200000', align: 'left'});
            // text1.setDepth(99999).setOrigin(0, 0).setAlpha(0);
            // text2 = PhaserScene.add.text(gameConsts.halfWidth- 246, gameConsts.halfHeight +150, "Should be a quick and simple fight.", {fontFamily: 'garamondbold', fontSize: 23, color: '#200000', align: 'left'});
            // text2.setDepth(99999).setOrigin(0, 0).setAlpha(0);
            //
            // createGlobalClickBlocker();
            // fadeInPreFightStuff(lvl, [text1, text2], [introPaper, introOverlay])
            beginLevel(lvl);
            break;

        case 8:
            // mantis
            introPaper = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight + 35, 'ui', 'paper.png').setDepth(99999).setAlpha(0);
            introOverlay = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight + 35, 'ui', 'mantis_paper.png').setDepth(99999).setAlpha(0).setBlendMode(Phaser.BlendModes.MULTIPLY);
            text1 = PhaserScene.add.text(gameConsts.halfWidth- 246, gameConsts.halfHeight + 65, getLangText('pre_fight_7a'), {fontFamily: 'garamondbold', fontSize: 26, color: '#200000', align: 'left'});
            text1.setDepth(99999).setOrigin(0, 0).setAlpha(0);
            text2 = PhaserScene.add.text(gameConsts.halfWidth- 246, gameConsts.halfHeight +140, getLangText('pre_fight_7b'), {fontFamily: 'garamondbold', fontSize: 26, color: '#200000', align: 'left'});
            text2.setDepth(99999).setOrigin(0, 0).setAlpha(0);

            createGlobalClickBlocker();
            fadeInPreFightStuff(lvl, [text1, text2], [introPaper, introOverlay])
            break;
        case 9:
            // robot
            introPaper = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight + 35, 'ui', 'paper.png').setDepth(99999).setAlpha(0);
            introOverlay = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight + 35, 'ui', 'robot_paper.png').setDepth(99999).setAlpha(0).setBlendMode(Phaser.BlendModes.MULTIPLY);
            text1 = PhaserScene.add.text(gameConsts.halfWidth- 246, gameConsts.halfHeight + 140, getLangText('pre_fight_8a'), {fontFamily: 'garamondbold', fontSize: 26, color: '#200000', align: 'left'});
            text1.setDepth(99999).setOrigin(0, 0).setAlpha(0);
            text2 = PhaserScene.add.text(gameConsts.halfWidth- 246, gameConsts.halfHeight +220, getLangText('pre_fight_8b'), {fontFamily: 'garamondbold', fontSize: 26, color: '#200000', align: 'left'});
            text2.setDepth(99999).setOrigin(0, 0).setAlpha(0);

            createGlobalClickBlocker();
            fadeInPreFightStuff(lvl, [text1, text2], [introPaper, introOverlay])
            break;
    default:
        beginLevel(lvl);
        break;

    }
}

function fadeInPreFightStuff(lvl, texts, introbgs) {
    playSound('flip2')
    PhaserScene.tweens.add({
        targets: texts,
        duration: 500,
        ease: 'Cubic.easeOut',
        y: "-=60",
    })
    PhaserScene.tweens.add({
        targets: texts,
        alpha: 0.65,
        duration: 650,
    })

    PhaserScene.tweens.add({
        targets: introbgs,
        alpha: 1,
        duration: 500,
        scaleX: 1,
        scaleY: 1,
        ease: 'Cubic.easeOut',
        y: "-=60",
        onComplete: () => {
            let itemsToClear = texts.concat(introbgs);
            createLvlCloseButton(lvl, itemsToClear);
        }
    });
}

function createLvlCloseButton(lvl, items, offsetX = 0, offsetY = 0, instaClose = []) {
    let lvlCloseButton = new Button({
        normal: {
            ref: "menu_btn_normal.png",
            atlas: 'buttons',
            x: gameConsts.width - 180 + offsetX,
            y: gameConsts.height - 125 + offsetY,
        },
        hover: {
            ref: "menu_btn_hover.png",
            atlas: 'buttons',
        },
        press: {
            ref: "menu_btn_hover.png",
            atlas: 'buttons',
        },
        disable: {
            alpha: 0.001
        },
        onHover: () => {
            playSound('button_hover');
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
            playSound('button_click');
            if (canvas) {
                canvas.style.cursor = 'default';
            }
            for (let i = 0; i < instaClose.length; i++) {
                instaClose[i].destroy();
            }
            PhaserScene.tweens.add({
                targets: items,
                alpha: 0,
                duration: 400,
                ease: 'Quad.easeOut',
                y: "+=40",
                onComplete: () => {
                    for (let i = 0; i < items.length; i++) {
                        items[i].destroy();
                    }
                }
            });
            lvlCloseButton.destroy();
            hideGlobalClickBlocker();
            beginLevel(lvl);
        }
    });
    lvlCloseButton.setOrigin(0.5, 0.5);
    lvlCloseButton.addText(getLangText('cont_ui'), {fontFamily: 'garamondmax', fontSize: 28, color: '#000000', align: 'left'})
    lvlCloseButton.setScale(0.9);
    lvlCloseButton.setDepth(99999);

    return lvlCloseButton;
}

function switchLevelBackground(lvl) {
    switch(lvl) {
        case -7:
        case -6:
            fadeInBackgroundAtlas('backgrounds', 'menu_back.png', 1500, 5, 0.935, 0.935, 'Quart.easeIn', 0, true, -1);
        case -5:
        case -4:
        case -3:
        case -2:
        case -1:
        // mind dummy
            fadeInBackgroundAtlas('backgrounds', 'menu_back.png', 1500, 1.3, 1.2, 1.27,'Quart.easeIn', 0, false, -74);
        break;
        case 0:
            // zoomInCurrBackground(1500, 2, 'Cubic.easeIn');
            minorZoomMenu()
            fadeInBackgroundAtlas('backgrounds', 'menu_back.png', 1500, 1.25, 1.17, 1.22,'Quart.easeIn', 0, false, -55);
            break;
        case 1:
            clearOnlyMenuBack();
            fadeInBackgroundAtlas('backgrounds', 'menu_back.png', 1500, 1.3, 1.2, 1.27,'Quart.easeIn', 0, false, -74);
            break;
        case 2:
            fadeInBackgroundAtlas('backgrounds', 'background6.webp', 1500, 1.05, 1.05, 1.05,'Quart.easeIn', 0, false, -65);
            break;
        case 3:
            fadeInBackgroundAtlas('backgrounds', 'background5.webp', 1500, 0.95, 0.95, 0.95,'Quart.easeIn', 0, false, -10);
            break;
        case 4:
            fadeInBackgroundAtlas('backgrounds', 'background4.png', 1500, 1, 1, 1,'Quart.easeIn', 0, false);
            break;
        case 5:
            fadeInBackgroundAtlas('backgrounds', 'background8.webp', 1500, 0.9, 1, 1,'Quart.easeIn', 0, false, 1);
            break;
        case 6:
            fadeInBackgroundAtlas('backgrounds', 'menu_back.png', 1500, 1.1, 1.1, 1.1,'Quart.easeIn', 0, false);
            break;
        case 7:
            fadeInBackgroundAtlas('backgrounds', 'menu_back.png', 1500, 5, 0.935, 0.935,'Quart.easeIn', 0, true, -1);
            break;
        case 8:
            fadeInBackgroundAtlas('backgrounds', 'background8.webp', 1500, 1, 1, 1,'Quart.easeIn', 0, false);
            break;
        case 9:
            fadeInBackgroundAtlas('backgrounds', 'tunnel.png', 1500, 1, 1, 1,'Quart.easeIn', 0, false);
            break;
        case 10:
            fadeInBackgroundAtlas('backgrounds', 'background4.png', 2500, 1, 1, 1,'Quart.easeIn', 0, false);
            break;
    }
}

function beginLevel(lvl, instant = false) {
    CURRENT_LEVEL = lvl;
    globalObjects.encyclopedia.showButton();
    globalObjects.options.showButton();
    updateSpellState(lvl)
    globalObjects.player.resetStats();
    messageBus.publish('manualResetElements', undefined, true);
    messageBus.publish('manualResetEmbodiments', undefined, true); // with long delay

    globalObjects.magicCircle.buildRunes();
    if (lvl <= 1) {
        switchLevelBackground(lvl)
    }

    playSound('whoosh');
    if (instant) {
        createEnemy(lvl);
    } else {
        createEnemyAfterDelay(lvl);
    }
}

function createEnemyAfterDelay(lvl) {
    let delayAmt = 1200;
    if (lvl == 0) {
        delayAmt = 0;
    }
    levelTimeoutID = setTimeout(() => {
        if (lvl === CURRENT_LEVEL) {
            createEnemy(lvl);
        }
    }, delayAmt);
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
            return buildTutorialButton('rune_matter_large.png', buildTutorialMatter);
            break;
        case 2:
            return buildTutorialButton('rune_mind_large.png', buildTutorialMind);
            break;
        case 3:
            return buildTutorialButton('rune_protect_large.png', buildTutorialProtect);
            break;
        case 4:
            return buildTutorialButton('rune_reinforce_large.png', buildTutorialReinforce);
            break;
        case 5:
            return buildTutorialButton('rune_time_large.png', buildTutorialTime);
            break;
        case 6:
            return buildTutorialButton('rune_void_large.png', buildTutorialVoid);
            break;
        case 7:
            return buildTutorialButton('rune_unload_large.png', buildTutorialUnload);
            break;
    }
}

function buildTutorialButton(icon = "rune_matter_large.png", popup) {
    let buttonX = gameConsts.width - 45; let buttonY = 120;
    let btnPopBack = PhaserScene.add.sprite(buttonX, buttonY, 'buttons', 'new_btn_back.png').setScale(0.1).setDepth(130);
    let btnIcon = PhaserScene.add.sprite(buttonX, buttonY, 'tutorial', icon).setScale(0.05).setDepth(130);
    let btnPop = PhaserScene.add.sprite(buttonX, buttonY, 'buttons', 'new_btn.png').setScale(0.1).setDepth(131);

    let returnButton;
    returnButton = new Button({
        normal: {
            atlas: "buttons",
            ref: "new_btn.png",
            alpha: 1,
            x: buttonX,
            y: buttonY,
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
        easeParams: [5],
        ease: "Back.easeOut",
        duration: 900,
        onComplete: () => {
            btnPop.destroy();
            if (returnButton.isDestroyed) {
                return;
            }
            returnButton.setState(NORMAL);
            let anim = PhaserScene.add.sprite(buttonX, buttonY, 'buttons').setDepth(130).play('newButtonAnim');
            returnButton.addToDestructibles(anim);
        }
    });

    PhaserScene.tweens.add({
        targets: btnIcon,
        scaleX: 0.5,
        scaleY: 0.5,
        easeParams: [4],
        ease: "Back.easeOut",
        duration: 1100,
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

    let tutTitleBg = PhaserScene.add.sprite(gameConsts.halfWidth - 138, gameConsts.halfHeight - 285, 'tutorial', 'title.png').setDepth(10000);
    let tutBackground = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 100, 'tutorial', 'popupTutorial.png').setScale(0.985).setAlpha(0.5).setDepth(10000);
    let tutPlus = PhaserScene.add.sprite(gameConsts.halfWidth - 124, gameConsts.halfHeight - 193, 'tutorial', 'plus_symbol.png').setScale(0.96).setAlpha(0.5).setDepth(10000);

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
            globalObjects.runePicture.setAlpha(0);
            PhaserScene.tweens.add({
                targets: [globalObjects.runePicture, globalObjects.runeHighlightTemp],
                alpha: 0,
                duration: 1,
            });
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
            alpha: 0.3,
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
