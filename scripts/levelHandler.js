let CURRENT_LEVEL = null;
let levelTimeoutID = null;

function beginPreLevel(lvl) {
    gameVars.isInMainMenu = false;
    gameVars.hasCheated = isUsingCheats();
    updateCheatsDisplay();
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
            let bgDim = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setDepth(-1).setAlpha(0).setScale(500);
            introPaper = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight - 110, 'ui', 'paper_half.png').setDepth(99999).setAlpha(0);
            introOverlay = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'ui', 'newgame_paper.png').setDepth(99999).setAlpha(0).setBlendMode(Phaser.BlendModes.MULTIPLY);
            text1 = PhaserScene.add.text(gameConsts.halfWidth - 253, gameConsts.halfHeight - 288, getLangText('pre_fight_0a'), {fontFamily: 'germania', fontSize: 26, color: '#200000', align: 'left'});
            text1.setDepth(99999).setOrigin(0, 0).setAlpha(0);
            text3 = PhaserScene.add.text(gameConsts.halfWidth + 137, gameConsts.halfHeight - 185, getLangText('pre_fight_0c'), {fontFamily: 'germania', fontSize: 26, color: '#200000', align: 'right'});
            text3.setDepth(99999).setAlpha(0).setOrigin(1, 1);
            text4 = PhaserScene.add.text(gameConsts.halfWidth + 140, gameConsts.halfHeight - 124, getLangText('pre_fight_0d'), {fontFamily: 'germania', fontSize: 26, color: '#200000', align: 'right'});
            text4.setDepth(99999).setAlpha(0).setOrigin(1, 1);
            text5 = PhaserScene.add.text(text3.x + 10, text3.y + 1, getLangText('pre_fight_0e'), {fontFamily: 'germania', fontSize: 20, color: '#200000', align: 'right'});
            text5.setDepth(99999).setAlpha(0).setOrigin(1, 1).setVisible(false);
            text6 = PhaserScene.add.text(text4.x + 7, text4.y, getLangText('pre_fight_0f'), {fontFamily: 'germania', fontSize: 18, color: '#200000', align: 'right'});
            text6.setDepth(99999).setAlpha(0).setOrigin(1, 0.85).setVisible(false);
            text7 = PhaserScene.add.text(gameConsts.halfWidth + 220, gameConsts.halfHeight - 98, getLangText('pre_fight_0g'), {fontFamily: 'germania', fontSize: 26, color: '#200000', align: 'right'});
            text7.setDepth(99999).setAlpha(0).setOrigin(1, 0);
            //text8 = PhaserScene.add.text(gameConsts.halfWidth, gameConsts.halfHeight + 238, getLangText('pre_fight_0h'), {fontFamily: 'germania', fontSize: 26, color: '#200000', align: 'center'});
            //text8.setDepth(99999).setAlpha(0).setOrigin(0.5, 0.5);
            text9 = PhaserScene.add.text(gameConsts.halfWidth, gameConsts.halfHeight + 238, getLangText('pre_fight_0i'), {fontFamily: 'germania', fontSize: 26, color: '#200000', align: 'center'});
            text9.setDepth(99999).setAlpha(0).setOrigin(0.5, 0);

            // createGlobalClickBlocker();

            let strikeHoverBtn = new Button({
                normal: {
                    ref: "tut_btn.png",
                    atlas: 'buttons',
                    x: gameConsts.halfWidth + 81,
                    y: text3.y - 84,
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
                    strikeHoverBtn.setVisible(false);
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
                    y: text4.y - 84,
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
                    text4.alpha = 0;
                    text6.visible = true;
                    text6.alpha = 0.65;
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
                    matterHoverBtn.setVisible(false);
                }
            });
            matterHoverBtn.setOrigin(0.5, 0.5);
            matterHoverBtn.setDepth(99999);
            matterHoverBtn.setState(DISABLE);

            texts = [bgDim, text1, text3, text4, text5, text6, text7, text9, strikeHoverBtn, matterHoverBtn];
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
                    createLvlCloseButton(lvl, itemsToClear, 20, -342, [strikeHoverBtn, matterHoverBtn]);
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
            // statue
            introPaper = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight + 35, 'ui', 'paper.png').setDepth(99999).setAlpha(0);
            introOverlay = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight + 35, 'ui', 'statue_paper.png').setDepth(99999).setAlpha(0).setBlendMode(Phaser.BlendModes.MULTIPLY);
            text1 = PhaserScene.add.text(gameConsts.halfWidth- 246, gameConsts.halfHeight + 120, getLangText('pre_fight_3_5a'), {fontFamily: 'garamondbold', fontSize: 26, color: '#200000', align: 'left'});
            text1.setDepth(99999).setOrigin(0, 0).setAlpha(0);
            createGlobalClickBlocker();
            fadeInPreFightStuff(lvl, [text1], [introPaper, introOverlay])
            break;
        case 6:
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

        case 7:
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

        case 8:
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

        case 9:
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
        case 10:
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
            createMenuCloseButton(itemsToClear)
        }
    });
}

function createLvlCloseButton(lvl, items, offsetX = 0, offsetY = 0, instaClose = []) {
    let lvlCloseButton = new Button({
        normal: {
            ref: "menu_btn_normal.png",
            atlas: 'buttons',
            x: gameConsts.halfWidth + 130 + offsetX,
            y: gameConsts.height - 110 + offsetY,
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
            alpha: 0
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
            if (globalObjects.menuCloseButton) {
                globalObjects.menuCloseButton.destroy();
            }
            hideGlobalClickBlocker();
            beginLevel(lvl);
        }
    });
    lvlCloseButton.setOrigin(0.5, 0.5);
    lvlCloseButton.addText(getLangText('cont_ui'), {fontFamily: 'germania', fontSize: 28, color: '#000000', align: 'left'})
    lvlCloseButton.setScale(0.78);
    lvlCloseButton.setDepth(99999);
    globalObjects.lvlCloseButton = lvlCloseButton;

    return lvlCloseButton;
}

function createMenuCloseButton(items) {
    let menuCloseButton = new Button({
        normal: {
            ref: "menu_btn_normal.png",
            atlas: 'buttons',
            x: gameConsts.halfWidth - 130,
            y: gameConsts.height - 110,
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
            alpha: 0
        },
        onHover: () => {
            playSound('button_hover').detune = 30 - Math.floor(Math.random() * 60);
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
            menuCloseButton.destroy();
            if (globalObjects.lvlCloseButton) {
                globalObjects.lvlCloseButton.destroy();
            }
            gotoMainMenu();
            hideGlobalClickBlocker();
        }
    });
    menuCloseButton.setOrigin(0.5, 0.5);
    menuCloseButton.addText(getLangText('menu'), {fontFamily: 'germania', fontSize: 28, color: '#000000', align: 'left'})
    menuCloseButton.setScale(0.78);
    menuCloseButton.setDepth(99999);
    globalObjects.menuCloseButton = menuCloseButton;

    return menuCloseButton;
}

function switchLevelBackground(lvl) {
    switch(lvl) {
        case -7:
            fadeInBackgroundAtlas('backgrounds', 'menu_back_battle.png', 1500, 1, 0.935, 0.935,'Quart.easeIn', 0, true, -1);
            break;
        case -6:
            fadeInBackgroundAtlas('backgrounds', 'background8.webp', 1500, 0.9, 1, 1,'Quart.easeIn', 0, false, 1);
            break;
        case -5:
        case -4:
            fadeInBackgroundAtlas('backgrounds', 'background4.png', 1500, 1, 1, 1,'Quart.easeIn', 0, false);
            break;
        case -3:
            fadeInBackgroundAtlas('backgrounds', 'background5.webp', 1500, 0.95, 0.95, 0.95,'Quart.easeIn', 0, false, -10);
            break;
        case -2:
            fadeInBackgroundAtlas('backgrounds', 'background6.webp', 1500, 1.05, 1.05, 1.05,'Quart.easeIn', 0, false, -65);
            break;
        case -1:
            // mind dummy
            fadeInBackgroundAtlas('backgrounds', 'path.png', 1500, 0.92, 0.91, 0.91,'Quart.easeOut', 0, false, 0);
            break;
        case 0:
            // zoomInCurrBackground(1500, 2, 'Cubic.easeIn');
            let bgObj = fadeInBackgroundAtlas('backgrounds', 'menu_back_battle.png', 100, globalObjects.menuBack.scaleX, globalObjects.menuBack.startScale * 1.19, globalObjects.menuBack.startScale * 1.2,'Quint.easeInOut', 0, false, 0, true);
            bgObj.setOrigin(0.5, 0.5).setPosition(globalObjects.menuBack.x, globalObjects.menuBack.y).setScale(globalObjects.menuBack.scaleX, globalObjects.menuBack.scaleY).setDepth(-8);
            minorZoomMenu();
            globalObjects.menuTop.setDepth(-7);

            PhaserScene.tweens.add({
                targets: bgObj,
                scaleX: globalObjects.menuBack.startScale * 1.19,
                scaleY: globalObjects.menuBack.startScale * 1.2,
                y: gameConsts.halfHeight - 110,
                ease: 'Quint.easeInOut',
                alpha: 1,
                duration: 1500,
                onComplete: () => {
                    globalObjects.menuTop.setDepth(-9);
                    globalObjects.menuBack.setFrame('menu_back_battle.png');
                    bgObj.visible = false;
                }
            });
            break;
        case 1:
            clearOnlyMenuBack();
            fadeInBackgroundAtlas('backgrounds', 'path.png', 1500, 0.92, 0.91, 0.91,'Quart.easeOut', 0, false, 0);
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
            fadeInBackgroundAtlas('backgrounds', 'menu_back_battle.png', 1500, 0.9, 1, 1,'Quart.easeIn', 0, false, 1);
            break;
        case 6:
            fadeInBackgroundAtlas('backgrounds', 'background8.webp', 1500, 0.9, 1, 1,'Quart.easeIn', 0, false, 1);
            break;
        case 7:
            fadeInBackgroundAtlas('backgrounds', 'menu_back_battle.png', 1500, 1, 0.94, 0.94,'Quart.easeIn', 0, false);
            break;
        case 8:
            fadeInBackgroundAtlas('backgrounds', 'menu_back_battle.png', 1500, 0.92, 0.935, 0.935,'Quart.easeIn', 0, true, -1);
            break;
        case 9:
            fadeInBackgroundAtlas('backgrounds', 'background8.webp', 1500, 1, 1, 1,'Quart.easeIn', 0, false);
            break;
        case 10:
            fadeInBackgroundAtlas('backgrounds', 'tunnel.png', 1500, 1, 1, 1,'Quart.easeIn', 0, false);
            break;
        case 11:
            fadeInBackgroundAtlas('backgrounds', 'background4.png', 2500, 1, 1, 1,'Quart.easeIn', 0, false);
            break;
    }
}

function beginLevel(lvl, instant = false) {
    CURRENT_LEVEL = lvl;
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
            globalObjects.encyclopedia.showButton();
            globalObjects.options.showButton();
            createEnemy(lvl);
        }
    }, delayAmt);
}

function createTutorialBtn(lvl) {
    playSound('flip3');

    if (!globalObjects.runeHighlight) {
        globalObjects.runeHighlight = PhaserScene.add.sprite(0, 0, 'tutorial', 'rune_highlight8.png').setDepth(10001).setVisible(false);
        globalObjects.runeHighlightRune = PhaserScene.add.sprite(gameConsts.halfWidth - 206, gameConsts.halfHeight - 200, 'tutorial', 'rune_highlight8.png').setDepth(10001).setVisible(false).setAlpha(0.76);
        globalObjects.runeHighlightTemp = PhaserScene.add.image(0, 0, 'tutorial', 'rune_highlight8.png').setDepth(10002).setAlpha(0);
        globalObjects.runePictureFrame = PhaserScene.add.image(gameConsts.halfWidth - 210, gameConsts.halfHeight - 40, 'tutorial', 'tut_border.png').setDepth(10002).setVisible(false).setRotation(-0.08);
        globalObjects.runePicture = PhaserScene.add.sprite(gameConsts.halfWidth - 210, gameConsts.halfHeight - 40, 'tutorial', 'blank.png').setDepth(10002).setVisible(false).setRotation(-0.08);
    }
    switch(lvl) {
        case 0:
            break;
        case 1:
            return buildTutorialButton('rune_matter_large.png', buildTutorialMatter);
            break;
        case 2:
            return buildTutorialButton('rune_energy_large.png', buildTutorialMind);
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
        case 7:
            return buildTutorialButton('rune_void_large.png', buildTutorialVoid);
            break;
        case 8:
            return buildTutorialButton('rune_unload_large.png', buildTutorialUnload);
            break;
    }
}

function buildTutorialButton(icon = "rune_matter_large.png", popup) {
    let buttonX = gameConsts.width - 45; let buttonY = 140;
    let btnPopBack = PhaserScene.add.sprite(buttonX + 90, buttonY, 'buttons', 'btn_small.png').setScale(0.5, 1).setDepth(130).setOrigin(0.5, 0.5);
    let iconGlow = PhaserScene.add.sprite(buttonX, buttonY, 'blurry', 'icon_glow.png').setScale(0.1).setDepth(130).setAlpha(0);
    let btnIcon = PhaserScene.add.sprite(buttonX, buttonY, 'tutorial', icon).setScale(0.05).setDepth(130);

    let glowSpin = PhaserScene.tweens.add({
        targets: [iconGlow],
        rotation: "+=6.283",
        duration: 4000,
        repeat: 40,
        onComplete: () => {
            PhaserScene.tweens.add({
                targets: [iconGlow],
                alpha: 0,
                duration: 4000,
            });
        }
    });

    let returnButton;
    returnButton = new Button({
        normal: {
            atlas: "buttons",
            ref: "btn_small.png",
            alpha: 1,
            x: buttonX + 55,
            y: buttonY,
        },
        hover: {
            atlas: "buttons",
            ref: "btn_small_hover.png",
            alpha: 1,
        },
        press: {
            atlas: "buttons",
            ref: "btn_small_press.png",
            alpha: 1,
        },
        disable: {
            alpha: 0
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
            iconGlow.destroy();
            glowSpin.stop();
            globalObjects.encyclopedia.hideButton();
            globalObjects.options.hideButton();
            popup();
        }
    });
    returnButton.setDepth(129);
    returnButton.setState(DISABLE);
    returnButton.setOrigin(0.5, 0.5);

    PhaserScene.tweens.add({
        targets: [btnPopBack, iconGlow],
        scaleX: 1,
        scaleY: 1,
        alpha: 1,
        easeParams: [5],
        ease: "Back.easeOut",
        duration: 900,
        onComplete: () => {
            if (returnButton.isDestroyed) {
                return;
            }
            returnButton.setState(NORMAL);
            btnPopBack.destroy();
        }
    });
    PhaserScene.tweens.add({
        targets: [btnPopBack],
        x: buttonX + 55,
        easeParams: [4],
        ease: "Back.easeOut",
        duration: 900,
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
    returnButton.addToDestructibles(iconGlow);

    return returnButton;
}

function showTutorialImage() {
    playSound('flip2');

}

function buildTutorialBasic(scalingDestructibles, nonscalingDestructibles) {
    messageBus.publish('pauseGame', 0.002);
    globalObjects.magicCircle.disableMovement();

    let tutTitleBg = PhaserScene.add.sprite(gameConsts.halfWidth - 138, gameConsts.halfHeight - 285, 'tutorial', 'title.png').setDepth(10000);
    let tutBackground = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 100, 'tutorial', 'popupTutorial.png').setScale(1).setAlpha(0.5).setDepth(10000);
    let tutPlus = PhaserScene.add.sprite(gameConsts.halfWidth - 124, gameConsts.halfHeight - 193, 'tutorial', 'plus_symbol.png').setScale(0.96).setAlpha(0.5).setDepth(10000);

    let closeButton;
    closeButton = new Button({
        normal: {
            atlas: "buttons",
            ref: "btn_small.png",
            x: gameConsts.halfWidth + 180,
            y: gameConsts.halfHeight + 70,
            alpha: 1,
            scaleX: 1,
            scaleY: 1
        },
        hover: {
            atlas: "buttons",
            ref: "btn_small_hover.png",
        },
        press: {
            atlas: "buttons",
            ref: "btn_small_press.png",
        },
        onMouseUp: () => {
            messageBus.publish('unpauseGame');
            globalObjects.magicCircle.enableMovement();
            closeButton.destroy();
            globalObjects.encyclopedia.showButton();
            globalObjects.options.showButton();
            cleanupTutorialElements([tutTitleBg, tutBackground, tutPlus]);
            cleanupTutorialElements(scalingDestructibles);
            cleanupTutorialElements(nonscalingDestructibles, true);
            globalObjects.runeHighlight.setVisible(false).setScale(0.96);
            globalObjects.runeHighlightTemp.setAlpha(0);
            globalObjects.runeHighlightRune.setAlpha(0);
            globalObjects.runePicture.setAlpha(0);
            globalObjects.runePictureFrame.setAlpha(0);

            PhaserScene.tweens.add({
                targets: [globalObjects.runePicture, globalObjects.runeHighlightTemp, globalObjects.runeHighlightRune],
                alpha: 0,
                duration: 1,
            });
        }
    });
    closeButton.addText(getLangText('got_it'), {fontFamily: 'germania', fontSize: 26, color: '#000000', align: 'center'})
    closeButton.setDepth(10002);

    PhaserScene.tweens.add({
        targets: [tutBackground, tutPlus],
        scaleX: 1.02,
        scaleY: 1.01,
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
            globalObjects.runeHighlight.play('runeHighlight');
            globalObjects.runeHighlight.alpha = 1;
            globalObjects.runeHighlightRune.alpha = 1;
            PhaserScene.tweens.add({
                delay: 1,
                targets: globalObjects.runeHighlight,
                alpha: 0.85,
                duration: 1,
            });
            PhaserScene.tweens.add({
                delay: 1,
                targets: globalObjects.runeHighlight,
                alpha: 0.76,
                duration: 1,
            });
            playSound(Math.random() > 0.5 ? 'flip1' : 'flip2');

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
