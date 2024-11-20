function setupMainMenuBG() {
    if (!globalObjects.menuBack) {
        globalObjects.menuBack = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'menu_back.png').setDepth(-9).setScale(0.95);
        globalObjects.menuBack.startScale = globalObjects.menuBack.scaleX;
        globalObjects.menuTop = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'menu_top.png').setDepth(-9).setScale(0.85);
        globalObjects.menuTop.startScale = globalObjects.menuTop.scaleX;
        let hasLvlSelect = gameVars.maxLevel >= 1;
        globalObjects.menuButtons = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', hasLvlSelect ? 'menu_buttons.png' : 'menu_buttons_start.png').setDepth(-5).setScale(1);

        if (hasLvlSelect) {
            if (!globalObjects.continueButtonSprite) {
                globalObjects.continueButtonSprite = PhaserScene.add.sprite(gameConsts.halfWidth - 175, gameConsts.halfHeight - 132, 'misc', 'continuegame.webp')
                globalObjects.levelButtonSprite = PhaserScene.add.sprite(gameConsts.halfWidth - 183, gameConsts.halfHeight - 43, 'misc', 'selectgame.webp').setScale(0.85);
            }

        }

        let isSolo = !hasLvlSelect;
        let yPos = isSolo ? gameConsts.halfHeight - 122 : gameConsts.halfHeight - 260;
        let xPos = isSolo ? gameConsts.halfWidth - 150 : gameConsts.halfWidth - 176;
        if (!globalObjects.startButtonSprite) {
            globalObjects.startButtonSprite = PhaserScene.add.sprite(xPos, yPos + 38, 'misc', 'newgame.webp');
        }
        globalObjects.startButtonSprite.setScale(isSolo ? 1.02 : 0.9);

        if (hasLvlSelect) {
            globalObjects.startButtonSprite.setRotation(0.17);
            globalObjects.startButtonSprite.rotationOffset = 0.17;
        } else {
            globalObjects.startButtonSprite.setRotation(-0.14);
            globalObjects.startButtonSprite.rotationOffset = -0.14;

        }
        globalObjects.creditsButtonSprite = PhaserScene.add.sprite(gameConsts.halfWidth + 225, gameConsts.halfHeight - 5, 'misc', 'creditsgame.webp');
        globalObjects.extrasButtonSprite = PhaserScene.add.sprite(gameConsts.halfWidth + 222, gameConsts.halfHeight - 72, 'misc', 'wishlistgame.webp')
    }
}

function playNewGameFlash() {
    let hasLvlSelect = gameVars.maxLevel >= 1;
    if (!hasLvlSelect) {
        setTimeout(() => {
            if (globalObjects.startButtonSprite.visible) {
                globalObjects.startButtonSpriteFlash = PhaserScene.add.sprite(globalObjects.startButtonSprite.x + 3, globalObjects.startButtonSprite.y, 'shields', 'btnFlash1.png');
                globalObjects.startButtonSpriteFlash.play('btnFlash');
                globalObjects.startButtonSpriteFlash.setScale(globalObjects.startButtonSprite.scaleX * 1.28).setRotation(globalObjects.startButtonSprite.rotation);
            }
        }, 250)

    }
}

function clearOnlyMenuButtons() {
    if (globalObjects.continueButton) {
        globalObjects.continueButton.destroy();
        globalObjects.continueButtonSprite.destroy();
    }

    if (globalObjects.levelSelectButton) {
        globalObjects.levelSelectButton.destroy();
        globalObjects.levelButtonSprite.destroy();
    }
    globalObjects.startButton.destroy();
    globalObjects.startButtonSprite.visible = false;
    globalObjects.startButtonSprite.destroy();
    if (globalObjects.startButtonSpriteFlash) {
        globalObjects.startButtonSpriteFlash.destroy();
    }
    // globalObjects.cheatButton.destroy();
    // globalObjects.cheatButton2.destroy();
    // globalObjects.cheatButton3.destroy();
    globalObjects.cheatButton4.destroy();
    // globalObjects.cheatButton5.destroy();



    globalObjects.creditsButton.destroy();
    globalObjects.creditsButtonSprite.destroy();
    globalObjects.extrasButton.destroy();
    globalObjects.extrasButtonSprite.destroy();


    /*
    globalObjects.lvlButton.destroy();
    globalObjects.level3Button.destroy();
    globalObjects.lvl5Button.destroy();
    globalObjects.lvl6Button.destroy();
    globalObjects.lvl7Button.destroy();
    globalObjects.lvl8Button.destroy();
    globalObjects.lvl9Button.destroy();
    globalObjects.lvl10Button.destroy();
    globalObjects.lvl11Button.destroy();
    globalObjects.lvl12Button.destroy();
    globalObjects.lvl13Button.destroy();
     */


}

function minorZoomMenu() {
    if (globalObjects.menuBack) {
        PhaserScene.tweens.add({
             targets: [globalObjects.menuBack],
             scaleX: globalObjects.menuBack.startScale * 1.19,
             scaleY: globalObjects.menuBack.startScale * 1.2,
             y: gameConsts.halfHeight - 110,
             ease: 'Quint.easeInOut',
             duration: 1500,
         });
        PhaserScene.tweens.add({
             targets: [globalObjects.menuTop],
             scaleX: globalObjects.menuTop.startScale * 1.19,
             scaleY: globalObjects.menuTop.startScale * 1.2,
             y: gameConsts.halfHeight - 110,
             ease: 'Quint.easeInOut',
             duration: 1500,
         });
        PhaserScene.tweens.add({
             targets: [globalObjects.menuButtons],
             scaleX: 1.12,
             scaleY: 1.12,
             y: gameConsts.halfHeight - 93,
             ease: 'Quint.easeInOut',
             duration: 1500,
         });
        PhaserScene.tweens.add({
             targets: [globalObjects.menuButtons],
             ease: 'Cubic.easeOut',
             duration: 700,
             alpha: 0
         });


    }
}

function clearOnlyMenuBack() {
    if (globalObjects.menuBack) {
        globalObjects.menuButtons.currAnim1 = PhaserScene.tweens.add({
             targets: [globalObjects.menuButtons],
             scaleX: 2.15,
             scaleY: 2.15,
             y: gameConsts.halfHeight + 30,
             ease: 'Cubic.easeInOut',
             duration: 2500,
         });
        globalObjects.menuButtons.currAnim2 = PhaserScene.tweens.add({
             targets: [globalObjects.menuButtons],
            ease: 'Cubic.easeOut',
             alpha: 0,
             duration: 700,
         });

        globalObjects.menuTop.currAnim1 = PhaserScene.tweens.add({
            targets: [globalObjects.menuTop],
            scaleX: globalObjects.menuTop.startScale * 1.6,
            scaleY: globalObjects.menuTop.startScale * 1.6,
            y: gameConsts.halfHeight + 20,
            ease: 'Cubic.easeInOut',
            duration: 2500,
        });
        globalObjects.menuTop.currAnim2 = PhaserScene.tweens.add({
            delay: 450,
             targets: [globalObjects.menuTop],
             alpha: 0,
             duration: 900,
            ease: 'Quad.easeInOut',
             onComplete: () => {
             }
        });
        globalObjects.menuBack.currAnim1 = PhaserScene.tweens.add({
            targets: [globalObjects.menuBack],
            scaleX: globalObjects.menuBack.startScale * 1.6,
            scaleY: globalObjects.menuBack.startScale * 1.6,
            x: gameConsts.halfWidth,
            y: gameConsts.halfHeight + 20,
            ease: 'Cubic.easeInOut',
            duration: 2500,
        });
        globalObjects.menuBack.currAnim2 = PhaserScene.tweens.add({
            delay: 1800,
             targets: [globalObjects.menuBack],
             alpha: 0,
             ease: 'Quad.easeIn',
             duration: 500,
             onComplete: () => {
             }
         });
    }
}

function clearMenuButtons() {
    gameVars.isInMainMenu = false;
    clearOnlyMenuButtons();
    clearOnlyMenuBack();
}

function gotoMainMenu() {
    switchBackground('grass_bg.webp')
    globalObjects.magicCircle.setWheelTint();
    globalObjects.magicCircle.enableMovement();
    if (gameVars.isInMainMenu) {
        return;
    }
    gameVars.isInMainMenu = true;
    gotoMainMenuNoButtons()
    showMainMenuButtons();
}



function gotoMainMenuNoButtons() {
    setupMainMenuBG();
    globalObjects.postFightScreen.clearWindSound();
    globalObjects.magicCircle.setAuraAlpha(0);
    globalObjects.encyclopedia.showButton();
    globalObjects.options.showButton();
    if (globalObjects.currentEnemy) {
        globalObjects.currentEnemy.destroy();
    }
    if (globalObjects.player) {
        globalObjects.player.resetStats();
    }
    if (globalObjects.menuBack.currAnim1) {
        globalObjects.menuBack.currAnim1.stop();
        globalObjects.menuBack.currAnim2.stop();
    }
    if (globalObjects.menuTop.currAnim1) {
        globalObjects.menuTop.currAnim1.stop();
        globalObjects.menuTop.currAnim2.stop();
    }
    if (globalObjects.menuButtons.currAnim1) {
        globalObjects.menuButtons.currAnim1.stop();
        globalObjects.menuButtons.currAnim2.stop();
    }

    globalObjects.menuBack.setAlpha(Math.max(0.2, globalObjects.menuBack.alpha)).setScale(globalObjects.menuBack.startScale).setPosition(gameConsts.halfWidth, gameConsts.halfHeight);
    globalObjects.menuTop.setAlpha(Math.max(0.2, globalObjects.menuTop.alpha)).setScale(globalObjects.menuTop.startScale).setPosition(gameConsts.halfWidth, gameConsts.halfHeight);
    globalObjects.menuButtons.setAlpha(Math.max(0.2, globalObjects.menuButtons.alpha)).setScale(globalObjects.menuButtons.startScale).setPosition(gameConsts.halfWidth, gameConsts.halfHeight);

    PhaserScene.tweens.add({
        targets: [globalObjects.menuBack, globalObjects.menuTop, globalObjects.menuButtons],
        alpha: 1,
        ease: 'Quart.easeOut',
        duration: 400,
    });

}

function showMainMenuButtons() {
    let hasLvlSelect = gameVars.maxLevel >= 1;

    if (hasLvlSelect) {
        if (!globalObjects.continueButtonSprite || !globalObjects.continueButtonSprite.active) {
            globalObjects.continueButtonSprite = PhaserScene.add.sprite(gameConsts.halfWidth - 175, gameConsts.halfHeight - 132, 'misc', 'continuegame.webp')
        }
        globalObjects.continueButton = new Button({
            normal: {
                atlas:"pixels",
                ref: "blank_pixel.png",
                x: gameConsts.halfWidth - 175,
                y: gameConsts.halfHeight - 132,
                alpha: 1,
                scaleX: 115,
                scaleY: 40
            },
            hover: {
                scaleX: 120,
                scaleY: 45
            },
            press: {
            },
            disable: {
                alpha: 0
            },
            onHover: () => {
                if (canvas) {
                    playSound('button_hover', 1.5).detune = -75;
                    canvas.style.cursor = 'pointer';
                }
                globalObjects.continueButtonSprite.setFrame('continuegame_hover.webp');
                globalObjects.continueButtonSprite.setScale(1.025);
                globalObjects.continueButtonSprite.setRotation(-0.03);
            },
            onHoverOut: () => {
                if (canvas) {
                    canvas.style.cursor = 'default';
                }
                globalObjects.continueButtonSprite.setFrame('continuegame.webp');
                globalObjects.continueButtonSprite.setRotation(0.045);
                PhaserScene.tweens.add({
                    targets: globalObjects.continueButtonSprite,
                    duration: 100,
                    scaleX: 1,
                    scaleY: 1,
                    easeParams: [3],
                    rotation: 0,
                    ease: 'Bounce.easeOut',
                });
            },
            onMouseUp: () => {
                playSound('click')
                clearMenuButtons();
                if (gameVars.currLevel) {
                    beginPreLevel(gameVars.currLevel);
                } else {
                    beginPreLevel(gameVars.latestLevel + 1);
                }
            }
        });
        globalObjects.continueButton.setOrigin(0.5, 0.5);
        let textObj = globalObjects.continueButton.addText(getLangText('cont_ui'), {fontFamily: 'germania', fontSize: 30, color: '#FDF6F4', align: 'left'}).setAlpha(0.97);
        globalObjects.continueButton.setTextOffset(0, -5);
        globalObjects.continueButton.setStroke('#301010', 5)
        globalObjects.continueButton.setRotation(-0.02)
        // globalObjects.continueButton.setScale(0.9);
    }

    if (hasLvlSelect) {
        if (!globalObjects.levelButtonSprite || !globalObjects.levelButtonSprite.active) {
            globalObjects.levelButtonSprite = PhaserScene.add.sprite(gameConsts.halfWidth - 183, gameConsts.halfHeight - 43, 'misc', 'selectgame.webp').setScale(0.85)
        }
        globalObjects.levelSelectButton = new Button({
            normal: {
                atlas: "pixels",
                ref: "blank_pixel.png",
                x: gameConsts.halfWidth - 183,
                y: gameConsts.halfHeight - 38,
                alpha: 1,
                scaleX: 135,
                scaleY: 40
            },
            hover: {
                scaleX: 140,
                scaleY: 45,
            },
            press: {
            },
            disable: {
                alpha: 0
            },
            onHover: () => {
                if (canvas) {
                    playSound('button_hover', 1.5).detune = -150;
                    canvas.style.cursor = 'pointer';
                }
                globalObjects.levelButtonSprite.setFrame('selectgame_hover.webp');
                globalObjects.levelButtonSprite.setScale(0.855);
                globalObjects.levelButtonSprite.setRotation(-0.03);
            },
            onHoverOut: () => {
                if (canvas) {
                    canvas.style.cursor = 'default';
                }
                globalObjects.levelButtonSprite.setFrame('selectgame.webp');
                globalObjects.levelButtonSprite.setRotation(0.045);
                PhaserScene.tweens.add({
                    targets: globalObjects.levelButtonSprite,
                    duration: 100,
                    scaleX: 0.85,
                    scaleY: 0.85,
                    easeParams: [3],
                    rotation: 0,
                    ease: 'Bounce.easeOut',
                });
            },
            onMouseUp: () => {
                playSound('flip1')
                showLevelSelectScreen();
            }
        });
        globalObjects.levelSelectButton.setOrigin(0.5, 0.5);
        let textObjSelect = globalObjects.levelSelectButton.addText(getLangText('lvl_select'), {fontFamily: 'germania', fontSize: 26, color: '#FDF6F4', align: 'left'})
        textObjSelect.setAlpha(0.97);
        globalObjects.levelSelectButton.setStroke('#301010', 5)
        globalObjects.levelSelectButton.setTextOffset(-6, -8);
        globalObjects.levelSelectButton.setRotation(-0.22)
        if (language === 'fr') {
            textObjSelect.setFontSize(23);
        }
    }

    let isSolo = !(hasLvlSelect);
    let yPos = isSolo ? gameConsts.halfHeight - 122 : gameConsts.halfHeight - 260;
    let xPos = isSolo ? gameConsts.halfWidth - 160 : gameConsts.halfWidth - 176;
    if (!globalObjects.startButtonSprite || !globalObjects.startButtonSprite.active) {
        globalObjects.startButtonSprite = PhaserScene.add.sprite(xPos, yPos + 38, 'misc', 'newgame.webp');
    }
    globalObjects.startButtonSprite.setScale(isSolo ? 1.02 : 0.9);
    if (isSolo) {
        globalObjects.startButtonSprite.setRotation(-0.14);
        globalObjects.startButtonSprite.rotationOffset = -0.14;
    } else {
        globalObjects.startButtonSprite.setRotation(0.17);
        globalObjects.startButtonSprite.rotationOffset = 0.17;
    }

    globalObjects.startButton = new Button({
        normal: {
            atlas: "pixels",
            ref: "blank_pixel.png",
            x: globalObjects.startButtonSprite.x,
            y: globalObjects.startButtonSprite.y - 5,
            alpha: 1,
            scaleX: 120,
            scaleY: 40,
        },
        hover: {
            scaleX: 125,
            scaleY: 45,
        },
        press: {

        },
        disable: {
            alpha: 0
        },
        onHover: () => {
            if (canvas) {
                playSound('button_hover', 1.5).detune = 0;
                canvas.style.cursor = 'pointer';
            }
            globalObjects.startButtonSprite.setFrame('newgame_hover.webp');
            globalObjects.startButtonSprite.setScale(isSolo ? 1.03 : 0.91);
            globalObjects.startButtonSprite.setRotation(-0.03 + globalObjects.startButtonSprite.rotationOffset);
        },
        onHoverOut: () => {
            if (canvas) {
                canvas.style.cursor = 'default';
            }
            globalObjects.startButtonSprite.setFrame('newgame.webp');
            globalObjects.startButtonSprite.setRotation(0.045 + globalObjects.startButtonSprite.rotationOffset);
            PhaserScene.tweens.add({
                targets: globalObjects.startButtonSprite,
                duration: 100,
                scaleX: isSolo ? 1.02 : 0.9,
                scaleY: isSolo ? 1.02 : 0.9,
                easeParams: [3],
                rotation: globalObjects.startButtonSprite.rotationOffset,
                ease: 'Bounce.easeOut',
            });
        },
        onMouseUp: () => {
            // playSound('button_hover', 1).detune = -250;
            if (!isSolo) {
                let titleText = getLangText('new_game') + "?";
                showYesNoPopup(getLangText('cont_ui'), getLangText('back'), titleText, getLangText('new_game_long'), () => {
                    clearOnlyMenuButtons();
                    beginPreLevel(0)
                }, true)
            } else {
                clearOnlyMenuButtons();
                beginPreLevel(0)
            }
        }
    });
    globalObjects.startButton.setOrigin(0.5, 0.5);
    let textObj = globalObjects.startButton.addText(getLangText('new_game'), {fontFamily: 'germania', fontSize: 30, color: '#FDF6F4', align: 'left'});
    textObj.alpha = 0.96;
    globalObjects.startButton.setTextOffset(-6, -2)
    globalObjects.startButton.setStroke('#301010', 5)
    // textObj.setBlendMode(Phaser.BlendModes.SCREEN);
    globalObjects.startButton.setRotation(-0.05 + globalObjects.startButtonSprite.rotationOffset)
    // globalObjects.startButton.setScale(0.9);
    globalObjects.startButton.isSolo = isSolo;

    if (isSolo) {
        globalObjects.menuButtons.setFrame('menu_buttons_start.png');
        setTimeout(() => {
            // let flash = PhaserScene.add.sprite(gameConsts.halfWidth, globalObjects.startButton.getYPos(), 'shields', 'btnFlash12.png').setScale(1.12).setDepth(100).play('btnFlash');
            // globalObjects.startButton.addToDestructibles(flash)
        }, 850)
    } else {
        globalObjects.menuButtons.setFrame('menu_buttons.png');
    }

    let hideCheatConst = 0;

    globalObjects.cheatButton4 = new Button({
        normal: {
            ref: "menu_btn_normal.png",
            atlas: 'buttons',
            x: gameConsts.width - 150,
            y: 270,
        },
        hover: {
            ref: "menu_btn_hover.png",
            atlas: 'buttons',
        },
        press: {
            ref: "menu_btn_press.png",
            atlas: 'buttons',
        },
        disable: {
            alpha: 0
        },
        onMouseUp: () => {
            playSound('click')
            toggleCheat('inam')
        }
    });
    globalObjects.cheatButton4.setScale(0.5);
    globalObjects.cheatButton4.addText("INFINITE AMMO", {fontFamily: 'germania', fontSize: 20, color: '#000000', align: 'left'})

    /*
    globalObjects.level3Button = new Button({
        normal: {
            ref: "menu_btn_normal.png",
            atlas: 'buttons',
            x: 100,
            y: 140,
        },
        hover: {
            ref: "menu_btn_hover.png",
            atlas: 'buttons',
        },
        press: {
            ref: "menu_btn_press.png",
            atlas: 'buttons',
        },
        disable: {
            alpha: 0.001
        },
        onMouseUp: () => {
            clearMenuButtons();
            beginPreLevel(3);
        }
    });
    globalObjects.level3Button.setScale(0.5);
    globalObjects.level3Button.addText("LEVEL TREE", {fontFamily: 'germania', fontSize: 20, color: '#000000', align: 'left'})

    globalObjects.lvlButton = new Button({
        normal: {
            ref: "menu_btn_normal.png",
            atlas: 'buttons',
            x: 100,
            y: 180,
        },
        hover: {
            ref: "menu_btn_hover.png",
            atlas: 'buttons',
        },
        press: {
            ref: "menu_btn_press.png",
            atlas: 'buttons',
        },
        disable: {
            alpha: 0.001
        },
        onMouseUp: () => {
            clearMenuButtons();
            beginPreLevel(4);
        }
    });
    globalObjects.lvlButton.setScale(0.5);
    globalObjects.lvlButton.addText("LEVEL MAGICIAN", {fontFamily: 'germania', fontSize: 20, color: '#000000', align: 'left'})

    globalObjects.lvl5Button = new Button({
        normal: {
            ref: "menu_btn_normal.png",
            atlas: 'buttons',
            x: 100,
            y: 220,
        },
        hover: {
            ref: "menu_btn_hover.png",
            atlas: 'buttons',
        },
        press: {
            ref: "menu_btn_press.png",
            atlas: 'buttons',
        },
        disable: {
            alpha: 0.001
        },
        onMouseUp: () => {
            clearMenuButtons();
            beginPreLevel(5);
        }
    });
    globalObjects.lvl5Button.setScale(0.5);
    globalObjects.lvl5Button.addText("LEVEL KNIGHT", {fontFamily: 'germania', fontSize: 20, color: '#000000', align: 'left'})

    globalObjects.lvl6Button = new Button({
        normal: {
            ref: "menu_btn_normal.png",
            atlas: 'buttons',
            x: 100,
            y: 260,
        },
        hover: {
            ref: "menu_btn_hover.png",
            atlas: 'buttons',
        },
        press: {
            ref: "menu_btn_press.png",
            atlas: 'buttons',
        },
        disable: {
            alpha: 0.001
        },
        onMouseUp: () => {
            clearMenuButtons();
            beginPreLevel(6);
        }
    });
    globalObjects.lvl6Button.setScale(0.5);
    globalObjects.lvl6Button.addText("LEVEL WALL", {fontFamily: 'germania', fontSize: 20, color: '#000000', align: 'left'})

    globalObjects.lvl7Button = new Button({
        normal: {
            ref: "menu_btn_normal.png",
            atlas: 'buttons',
            x: 100,
            y: 300,
        },
        hover: {
            ref: "menu_btn_hover.png",
            atlas: 'buttons',
        },
        press: {
            ref: "menu_btn_press.png",
            atlas: 'buttons',
        },
        disable: {
            alpha: 0.001
        },
        onMouseUp: () => {
            clearMenuButtons();
            beginPreLevel(7);
        }
    });
    globalObjects.lvl7Button.setScale(0.5);
    globalObjects.lvl7Button.addText("LEVEL SUPER DUMMY", {fontFamily: 'germania', fontSize: 20, color: '#000000', align: 'left'})

    globalObjects.lvl8Button = new Button({
        normal: {
            ref: "menu_btn_normal.png",
            atlas: 'buttons',
            x: 100,
            y: 340,
        },
        hover: {
            ref: "menu_btn_hover.png",
            atlas: 'buttons',
        },
        press: {
            ref: "menu_btn_press.png",
            atlas: 'buttons',
        },
        disable: {
            alpha: 0.001
        },
        onMouseUp: () => {
            clearMenuButtons();
            beginPreLevel(8);
        }
    });
    globalObjects.lvl8Button.setScale(0.5);
    globalObjects.lvl8Button.addText("LEVEL ASSASSIN", {fontFamily: 'germania', fontSize: 20, color: '#000000', align: 'left'})

    globalObjects.lvl9Button = new Button({
        normal: {
            ref: "menu_btn_normal.png",
            atlas: 'buttons',
            x: 100,
            y: 380,
        },
        hover: {
            ref: "menu_btn_hover.png",
            atlas: 'buttons',
        },
        press: {
            ref: "menu_btn_press.png",
            atlas: 'buttons',
        },
        disable: {
            alpha: 0.001
        },
        onMouseUp: () => {
            clearMenuButtons();
            beginPreLevel(9);
        }
    });
    globalObjects.lvl9Button.setScale(0.5);
    globalObjects.lvl9Button.addText("LEVEL ROBOT", {fontFamily: 'germania', fontSize: 20, color: '#000000', align: 'left'})

    globalObjects.lvl10Button = new Button({
        normal: {
            ref: "menu_btn_normal.png",
            atlas: 'buttons',
            x: 100,
            y: 420,
        },
        hover: {
            ref: "menu_btn_hover.png",
            atlas: 'buttons',
        },
        press: {
            ref: "menu_btn_press.png",
            atlas: 'buttons',
        },
        disable: {
            alpha: 0.001
        },
        onMouseUp: () => {
            clearMenuButtons();
            beginPreLevel(10);
        }
    });
    globalObjects.lvl10Button.setScale(0.5);
    globalObjects.lvl10Button.addText("LEVEL DEATH", {fontFamily: 'germania', fontSize: 20, color: '#000000', align: 'left'})


    globalObjects.lvl11Button = new Button({
        normal: {
            ref: "menu_btn_normal.png",
            atlas: 'buttons',
            x: 100 - hideCheatConst,
            y: 460,
        },
        hover: {
            ref: "menu_btn_hover.png",
            atlas: 'buttons',
        },
        press: {
            ref: "menu_btn_press.png",
            atlas: 'buttons',
        },
        disable: {
            alpha: 0.001
        },
        onMouseUp: () => {
            clearMenuButtons();
            beginPreLevel(11);
        }
    });
    globalObjects.lvl11Button.setScale(0.5);
    globalObjects.lvl11Button.addText("LEVEL 11", {fontFamily: 'germania', fontSize: 20, color: '#000000', align: 'left'})

    globalObjects.lvl12Button = new Button({
        normal: {
            ref: "menu_btn_normal.png",
            atlas: 'buttons',
            x: 100 - hideCheatConst,
            y: 490,
        },
        hover: {
            ref: "menu_btn_hover.png",
            atlas: 'buttons',
        },
        press: {
            ref: "menu_btn_press.png",
            atlas: 'buttons',
        },
        disable: {
            alpha: 0.001
        },
        onMouseUp: () => {
            clearMenuButtons();
            beginPreLevel(12);
        }
    });
    globalObjects.lvl12Button.setScale(0.5);
    globalObjects.lvl12Button.addText("LEVEL 11.5", {fontFamily: 'germania', fontSize: 20, color: '#000000', align: 'left'});

    globalObjects.lvl13Button = new Button({
        normal: {
            ref: "menu_btn_normal.png",
            atlas: 'buttons',
            x: 100 - hideCheatConst,
            y: 520,
        },
        hover: {
            ref: "menu_btn_hover.png",
            atlas: 'buttons',
        },
        press: {
            ref: "menu_btn_press.png",
            atlas: 'buttons',
        },
        disable: {
            alpha: 0.001
        },
        onMouseUp: () => {
            clearMenuButtons();
            beginPreLevel(13);
        }
    });
    globalObjects.lvl13Button.setScale(0.5);
    globalObjects.lvl13Button.addText("LEVEL 13", {fontFamily: 'germania', fontSize: 20, color: '#000000', align: 'left'});
    */

    // globalObjects.lvlButton.destroy();
    // globalObjects.cheatButton.destroy();
    // globalObjects.cheatButton2.destroy();
    // globalObjects.cheatButton3.destroy();
    // globalObjects.cheatButton4.destroy();
    // globalObjects.cheatButton5.destroy();
    //
    // globalObjects.level3Button.destroy();
    // globalObjects.lvl5Button.destroy();
    // globalObjects.lvl6Button.destroy();
    //
    // globalObjects.lvl7Button.destroy();
    // globalObjects.lvl8Button.destroy();
    // globalObjects.lvl9Button.destroy();
    // globalObjects.lvl10Button.destroy();
    // globalObjects.lvl11Button.destroy();
    // globalObjects.lvl12Button.destroy();
    // globalObjects.lvl13Button.destroy();
    if (!globalObjects.creditsButtonSprite || !globalObjects.creditsButtonSprite.active) {
        globalObjects.creditsButtonSprite = PhaserScene.add.sprite(gameConsts.halfWidth + 225, gameConsts.halfHeight - 5, 'misc', 'creditsgame.webp');
    }
    globalObjects.creditsButton = new Button({
        normal: {
            atlas: "pixels",
            ref: "blank_pixel.png",
            x: gameConsts.halfWidth + 225,
            y: gameConsts.halfHeight - 2,
            alpha: 0.9,
            scaleX: 95,
            scaleY: 36
        },
        hover: {
            alpha: 1,
        },
        press: {
            alpha: 0.7,
        },
        disable: {
        },
        onHover: () => {
            if (canvas) {
                playSound('button_hover', 1).detune = 200;
                canvas.style.cursor = 'pointer';
            }
            globalObjects.creditsButtonSprite.setFrame('creditsgame_hover.webp');
            globalObjects.creditsButtonSprite.setScale(1.025);
            globalObjects.creditsButtonSprite.setRotation(0.03);
        },
        onHoverOut: () => {
            if (canvas) {
                canvas.style.cursor = 'default';
            }
            globalObjects.creditsButtonSprite.setFrame('creditsgame.webp');
            globalObjects.creditsButtonSprite.setRotation(-0.045);
            PhaserScene.tweens.add({
                targets: globalObjects.creditsButtonSprite,
                duration: 100,
                scaleX: 1,
                scaleY: 1,
                easeParams: [3],
                rotation: 0,
                ease: 'Bounce.easeOut',
            });
        },
        onMouseUp: () => {
            globalObjects.magicCircle.disableMovement();
            //showCutscene1();
            // clearOnlyMenuButtons()
            // rollCredits();
            // return;
            playSound('flip3');
            globalObjects.encyclopedia.hideButton();
            globalObjects.options.hideButton();
            let page1Content = [];
            let page2Content = [];
            let tab1 = PhaserScene.add.image(gameConsts.halfWidth - 190, gameConsts.halfHeight - 305, 'ui', 'paperTab.png').setDepth(99999).setAlpha(0);
            let tab1Icon = PhaserScene.add.text(tab1.x, tab1.y - 55, "PAGE 1", {fontFamily: 'germania', fontSize: 18, color: '#000000', align: 'center'}).setOrigin(0.5, 0).setDepth(99999).setAlpha(0);

            let tab2 = PhaserScene.add.image(gameConsts.halfWidth - 90, gameConsts.halfHeight - 278, 'ui', 'paperTab.png').setDepth(99999).setAlpha(0);
            let tab2Icon = PhaserScene.add.text(tab2.x, tab2.y - 55, "PAGE 2", {fontFamily: 'germania', fontSize: 18, color: '#000000', align: 'center'}).setOrigin(0.5, 0).setDepth(99999).setAlpha(0);


            let text2 = "Additional Credits:\n\n\"Magic Escape Room\" by Kevin MacLeod\n(incompetech.com)\n" +
                "Licensed under Creative Commons:\nBy Attribution 4.0 License\n\n" +
                "Rocks - Effects - Source Recordings\n- 05 by GregorQuendel\n- https://freesound.org/s/424997/\n- License: Attribution 4.0\n\n" +
                "rocks2.wav by mystiscool\n- https://freesound.org/s/7136/\n- License: Attribution 4.0\n\n" +
                "R4_00328-2_EXP.wav by kevp888\n- https://freesound.org/s/636777/\n- License: Attribution 4.0\n\n"+
                "Big Bell_4.wav by eardeer\n- https://freesound.org/s/337565/\n- License: Attribution 4.0\n\n"+
                "Unlocking lock.wav by Stefan21100190\n- https://freesound.org/s/593112/\n- License: Attribution 4.0\n\n"+
                "Sound Effects by Lara Sluyter\n(LARA’S HORROR SOUNDS on YouTube)\n\n"+
                "Small_Swoosh - 1.wav by SoundFlakes\n-- https://freesound.org/s/416468/\n- License: Attribution 4.0";
            let creditsUI = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'ui', 'paper.png').setDepth(100000).setScale(0.975);
            let creditsPaper =PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight - 1, 'misc', 'credits.png').setDepth(100000).setScale(0.975);
            let discoverText = PhaserScene.add.text(gameConsts.halfWidth - 38, gameConsts.halfHeight + 142, "DISCOVER MORE IN OUR\nEXCLUSIVE DIGITAL ARTBOOK!", {fontFamily: 'germania', fontSize: 23.5, color: '#452127', align: 'center', lineSpacing: -5}).setOrigin(0.5, -1).setDepth(100000).setAlpha(0.3).setScale(1.03);
            // let maximText = PhaserScene.add.text(gameConsts.halfWidth - 270, gameConsts.halfHeight - 206, "Programming & Game Design", {fontFamily: 'Arial', fontSize: 18, color: '#452127', align: 'left', lineSpacing: -5}).setOrigin(0, 0.25).setDepth(100000).setAlpha(0.3).setScale(0.975);
            // maximText.setFontStyle('bold');

            let artbook = PhaserScene.add.image(gameConsts.halfWidth + 191, creditsPaper.y + 203, 'misc', 'artbook.png').setDepth(100002).setScale(0.31).setAlpha(0.2);

            let artbookGlow = PhaserScene.add.image(artbook.x - 4, artbook.y, 'blurry', 'icon_glow.png').setDepth(100001).setAlpha(1).setScale(1.8);
            artbook.origX = artbook.x;
            artbook.origY = artbook.y;
            let clickBlock;
            clickBlock = new Button({
                normal: {
                    ref: "blackPixel",
                    scaleX: 1000,
                    scaleY: 1000,
                    alpha: 0.6,
                    x: gameConsts.halfWidth,
                    y: gameConsts.halfHeight,
                },
                disable: {
                    alpha: 0
                },

                onMouseUp: () => {

                }
            });
            clickBlock.setDepth(1000);

            let bookButton = new Button({
                normal: {
                    ref: "blackPixel",
                    x: artbook.x,
                    y: artbook.y,
                    alpha: 0,
                    scaleX: 90,
                    scaleY: 110
                },
                onHover: () => {
                    artbook.setScale(0.335)
                    if (canvas) {
                        canvas.style.cursor = 'pointer';
                    }
                },
                onHoverOut: () => {
                    artbook.setScale(0.326)
                    if (canvas) {
                        canvas.style.cursor = 'default';
                    }
                },
                onMouseUp: () => {
                    playSound('flip2');
                    artbookGlow.visible = false;
                    bookButton.setState(DISABLE);
                    let clickBlock;
                    clickBlock = new Button({
                        normal: {
                            ref: "blackPixel",
                            scaleX: 1000,
                            scaleY: 1000,
                            alpha: 0.6,
                            x: gameConsts.halfWidth,
                            y: gameConsts.halfHeight,
                        },
                        disable: {
                            alpha: 0
                        },
                        onMouseUp: () => {

                        }
                    });
                    clickBlock.setDepth(100001);
                    let actionText = PhaserScene.add.text(gameConsts.halfWidth, gameConsts.halfHeight + 300, "<Work in Progress>\nCheck us out later!", {fontFamily: 'germania', fontSize: 30, color: '#FFFFFF', align: 'center'}).setOrigin(0.5, 0).setDepth(100001).setAlpha(0);
                    PhaserScene.tweens.add({
                        targets: [actionText],
                        duration: 250,
                        alpha: 1,
                    });

                    PhaserScene.tweens.add({
                        targets: [artbook],
                        duration: 220,
                        ease: 'Back.easeOut',
                        scaleX: 1,
                        scaleY: 1,
                        x: gameConsts.halfWidth,
                        y: gameConsts.halfHeight,
                        onComplete: () => {
                            clickBlock.setOnMouseUpFunc(() => {
                                bookButton.setState(NORMAL)
                                clickBlock.destroy();
                                actionText.destroy();
                                PhaserScene.tweens.add({
                                    targets: [artbook],
                                    duration: 180,
                                    ease: 'Cubic.easeOut',
                                    scaleX: 0.326,
                                    scaleY: 0.326,
                                    x: artbook.origX,
                                    y: artbook.origY,
                                });
                                if (canvas) {
                                    canvas.style.cursor = 'default';
                                }
                            })
                        }
                    });
                }
            });
            bookButton.setDepth(100000)

            let creditsText2 = PhaserScene.add.text(gameConsts.halfWidth - 255, creditsUI.y - 284, text2, {fontSize: 16, color: '#000000', align: 'left'}).setOrigin(0, 0).setDepth(100000).setAlpha(0);
            PhaserScene.tweens.add({
                targets: [creditsUI, tab1, tab1Icon, tab2, tab2Icon, discoverText],
                duration: 180,
                scaleX: 1,
                scaleY: 1,
                alpha: 1,
            });

            PhaserScene.tweens.add({
                targets: [artbookGlow],
                duration: 1500,
                scaleX: 4.1,
                scaleY: 4.1,
                ease: 'Quad.easeIn',
                alpha: 1,
                onComplete: () => {
                    PhaserScene.tweens.add({
                        targets: [artbookGlow],
                        duration: 1500,
                        scaleX: 1.8,
                        scaleY: 1.8,
                        ease: 'Quad.easeOut',
                        alpha: 0,
                    });
                }
            });
            PhaserScene.tweens.add({
                targets: [artbookGlow],
                duration: 3000,
                rotation: "+=6.281",
            });
            PhaserScene.tweens.add({
                targets: [creditsPaper],
                duration: 180,
                scaleX: 0.958,
                scaleY: 0.958,
                alpha: 1,
            });

            PhaserScene.tweens.add({
                targets: [artbook],
                duration: 180,
                alpha: 1,
            });
            PhaserScene.tweens.add({
                targets: [artbook],
                duration: 250,
                scaleX: 0.326,
                scaleY: 0.326,
                easeParams: [3],
                ease: 'Back.easeOut'
            });
            page1Content.push(artbook, creditsPaper, discoverText, artbookGlow)
            page2Content.push(creditsText2)

            let page1Btn = new Button({
                normal: {
                    ref: "blackPixel",
                    alpha: 0,
                    x: tab1Icon.x,
                    y: tab1Icon.y + 26,
                    scaleX: 45,
                    scaleY: 48
                },
                hover: {
                    ref: "blackPixel",
                    alpha: 0,
                    x: tab1Icon.x,
                    y: tab1Icon.y + 26,
                    scaleX: 46,
                    scaleY: 49
                },
                disable: {
                    alpha: 0
                },
                onHover: () => {
                    tab1.setFrame('paperTab_glow.png')
                    if (canvas) {
                        canvas.style.cursor = 'pointer';
                    }
                },
                onHoverOut: () => {
                    tab1.setFrame('paperTab.png')
                    if (canvas) {
                        canvas.style.cursor = 'default';
                    }
                },
                onMouseUp: () => {
                    playSound('flip1');
                    bookButton.setState(NORMAL);
                    PhaserScene.tweens.add({
                        targets: tab1,
                        y: gameConsts.halfHeight - 305,
                        duration: 180,
                        ease: 'Cubic.easeOut'
                    })
                    PhaserScene.tweens.add({
                        targets: tab1Icon,
                        y: gameConsts.halfHeight - 305 - 55,
                        duration: 180,
                        ease: 'Cubic.easeOut'
                    })
                    PhaserScene.tweens.add({
                        targets: tab2,
                        y: gameConsts.halfHeight - 278,
                        duration: 180,
                        ease: 'Cubic.easeOut'
                    })
                    PhaserScene.tweens.add({
                        targets: tab2Icon,
                        y: gameConsts.halfHeight - 278 - 55,
                        duration: 180,
                        ease: 'Cubic.easeOut'
                    })
                    PhaserScene.tweens.add({
                        targets: page1Content,
                        alpha: 1,
                        duration: 180,
                        ease: 'Cubic.easeIn'
                    })
                    PhaserScene.tweens.add({
                        targets: page2Content,
                        alpha: 0,
                        duration: 180,
                        ease: 'Cubic.easeOut'
                    })

                }
            });
            page1Btn.setDepth(100000);

            let page2Btn = new Button({
                normal: {
                    ref: "blackPixel",
                    alpha: 0,
                    x: tab2Icon.x,
                    y: tab1Icon.y + 26,
                    scaleX: 45,
                    scaleY: 48
                },
                hover: {
                    ref: "blackPixel",
                    alpha: 0,
                    x: tab2Icon.x,
                    y: tab1Icon.y + 26,
                    scaleX: 46,
                    scaleY: 49
                },
                disable: {
                    alpha: 0
                },
                onHover: () => {
                    tab2.setFrame('paperTab_glow.png')
                    if (canvas) {
                        canvas.style.cursor = 'pointer';
                    }
                },
                onHoverOut: () => {
                    tab2.setFrame('paperTab.png')
                    if (canvas) {
                        canvas.style.cursor = 'default';
                    }
                },
                onMouseUp: () => {
                    playSound('flip2');
                    bookButton.setState(DISABLE);
                    PhaserScene.tweens.add({
                        targets: tab1,
                        y: gameConsts.halfHeight - 278,
                        duration: 180,
                        ease: 'Cubic.easeOut'
                    })
                    PhaserScene.tweens.add({
                        targets: tab1Icon,
                        y: gameConsts.halfHeight - 278 - 55,
                        duration: 180,
                        ease: 'Cubic.easeOut'
                    })
                    PhaserScene.tweens.add({
                        targets: tab2,
                        y: gameConsts.halfHeight - 305,
                        duration: 180,
                        ease: 'Cubic.easeOut'
                    })
                    PhaserScene.tweens.add({
                        targets: tab2Icon,
                        y: gameConsts.halfHeight - 305 - 55,
                        duration: 180,
                        ease: 'Cubic.easeOut'
                    })
                    PhaserScene.tweens.add({
                        targets: page2Content,
                        alpha: 1,
                        duration: 180,
                        ease: 'Cubic.easeIn'
                    })
                    PhaserScene.tweens.add({
                        targets: page1Content,
                        alpha: 0,
                        duration: 180,
                        ease: 'Cubic.easeOut'
                    })
                }
            });
            page2Btn.setDepth(100000);

            let sub = messageBus.subscribe("cancelScreen", () => {
                globalObjects.encyclopedia.showButton();
                globalObjects.options.showButton();
                clickBlock.destroy();
                creditsUI.destroy();
                discoverText.destroy();
                artbook.destroy();
                creditsPaper.destroy();
                bookButton.destroy();
                creditsText2.destroy();
                tab1.destroy();
                tab2.destroy();
                tab1Icon.destroy();
                tab2Icon.destroy();
                artbookGlow.destroy();
                sub.unsubscribe();
                globalObjects.magicCircle.enableMovement();
                this.closeButton.destroy();
                if (canvas) {
                    canvas.style.cursor = 'default';
                }
            })
            this.closeButton = new Button({
                normal: {
                    atlas: 'buttons',
                    ref: "closebtn.png",
                    alpha: 0.95,
                    x: gameConsts.halfWidth + 244,
                    y: gameConsts.halfHeight - 275,
                },
                hover: {
                    alpha: 1,
                    atlas: 'buttons',
                    ref: "closebtn_hover.png",
                },
                press: {
                    atlas: 'buttons',
                    ref: "closebtn_press.png",
                    alpha: 1
                },
                disable: {
                    atlas: 'buttons',
                    ref: "closebtn.png",
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
                    playSound('flip1', 0.7).detune = -200;
                    globalObjects.encyclopedia.showButton();
                    globalObjects.options.showButton();
                    clickBlock.destroy();
                    creditsUI.destroy();
                    discoverText.destroy();
                    artbook.destroy();
                    creditsPaper.destroy();
                    bookButton.destroy();
                    creditsText2.destroy();
                    tab1.destroy();
                    tab2.destroy();
                    tab1Icon.destroy();
                    tab2Icon.destroy();
                    artbookGlow.destroy();
                    sub.unsubscribe();
                    globalObjects.magicCircle.enableMovement();
                    this.closeButton.destroy();
                    if (canvas) {
                        canvas.style.cursor = 'default';
                    }
                }
            });
            this.closeButton.setDepth(100000);
        }
    });
    globalObjects.creditsButton.addText(getLangText('credits'), {fontFamily: 'germania', fontSize: 26, color: '#FDF6F4', align: 'center', lineSpacing: -8}).setOrigin(0.5, 0.5).setAlpha(0.96);
    globalObjects.creditsButton.setStroke('#301010', 6)
    globalObjects.creditsButton.setRotation(-0.03)

    if (!globalObjects.extrasButtonSprite || !globalObjects.extrasButtonSprite.active) {
        globalObjects.extrasButtonSprite = PhaserScene.add.sprite(gameConsts.halfWidth + 222, gameConsts.halfHeight - 72, 'misc', 'wishlistgame.webp')
    }
    globalObjects.extrasButton = new Button({
        normal: {
            atlas: "pixels",
            ref: "blank_pixel.png",
            x: globalObjects.extrasButtonSprite.x,
            y: globalObjects.extrasButtonSprite.y,
            alpha: 0.9,
            scaleX: 95,
            scaleY: 36
        },
        hover: {
            alpha: 1,
        },
        press: {
            alpha: 0.7,
        },
        disable: {
        },
        onHover: () => {
            if (canvas) {
                playSound('button_hover', 1).detune = 200;
                canvas.style.cursor = 'pointer';
            }
            globalObjects.extrasButtonSprite.setFrame('wishlistgame_hover.webp');
            globalObjects.extrasButtonSprite.setScale(1.025);
            globalObjects.extrasButtonSprite.setRotation(0.03);
        },
        onHoverOut: () => {
            if (canvas) {
                canvas.style.cursor = 'default';
            }
            globalObjects.extrasButtonSprite.setFrame('wishlistgame.webp');
            globalObjects.extrasButtonSprite.setRotation(-0.045);
            PhaserScene.tweens.add({
                targets: globalObjects.extrasButtonSprite,
                duration: 100,
                scaleX: 1,
                scaleY: 1,
                easeParams: [3],
                rotation: 0,
                ease: 'Bounce.easeOut',
            });
        },
        onMouseUp: () => {
            openUnlocks();
        }
    });
    let textObjExtras = globalObjects.extrasButton.addText(getLangText('extras'), {fontFamily: 'germania', fontSize: 26, color: '#FDF6F4', align: 'center', lineSpacing: -8}).setOrigin(0.5, 0.5)
    textObjExtras.setAlpha(0.96);
    globalObjects.extrasButton.setStroke('#301010', 6);
    if (language === 'fr') {
        textObjExtras.setFontSize(20);
    }
    globalObjects.extrasButton.setRotation(-0.145)
}

function updateMenuLanguage() {
    if (globalObjects.startButton && !globalObjects.startButton.isDestroyed) {
        globalObjects.startButton.setText(getLangText('new_game'))
    }
    if (globalObjects.continueButton && !globalObjects.continueButton.isDestroyed) {
        globalObjects.continueButton.setText(getLangText('cont_ui'))
    }
    if (globalObjects.levelSelectButton && !globalObjects.levelSelectButton.isDestroyed) {
        let textObj = globalObjects.levelSelectButton.setText(getLangText('lvl_select'))
        if (textObj) {
            if (language === 'fr') {
                textObj.setFontSize(23);
            } else {
                textObj.setFontSize(26);
            }
        }
    }
    if (globalObjects.creditsButton && !globalObjects.creditsButton.isDestroyed) {
        globalObjects.creditsButton.setText(getLangText('credits'))
    }
    if (globalObjects.extrasButton && !globalObjects.extrasButton.isDestroyed) {
        let textObj2 = globalObjects.extrasButton.setText(getLangText('extras'));
        if (textObj2) {
            if (language === 'fr') {
                textObj2.setFontSize(20);
            } else {
                textObj2.setFontSize(26);
            }
        }
    }
}


function showLevelSelectScreen(){
    globalObjects.encyclopedia.hideButton();
    globalObjects.options.hideButton();
    let clickBlocker = createGlobalClickBlocker(false);
    let positionsX = [
        gameConsts.halfWidth - 120, gameConsts.halfWidth, gameConsts.halfWidth + 120,
        gameConsts.halfWidth - 180, gameConsts.halfWidth - 60, gameConsts.halfWidth + 60, gameConsts.halfWidth + 180,
        gameConsts.halfWidth - 180, gameConsts.halfWidth - 60, gameConsts.halfWidth + 60, gameConsts.halfWidth + 180,
        gameConsts.halfWidth - 180, gameConsts.halfWidth - 60, gameConsts.halfWidth + 60, gameConsts.halfWidth + 180,
    ]
    let positionsY = [
        gameConsts.halfHeight - 180, gameConsts.halfHeight - 180, gameConsts.halfHeight - 180,
        gameConsts.halfHeight - 60, gameConsts.halfHeight - 60, gameConsts.halfHeight - 60, gameConsts.halfHeight - 60,
        gameConsts.halfHeight + 60, gameConsts.halfHeight + 60, gameConsts.halfHeight + 60, gameConsts.halfHeight + 60,
        gameConsts.halfHeight + 180, gameConsts.halfHeight + 180, gameConsts.halfHeight + 180, gameConsts.halfHeight + 180,
    ]
    let levelSelectBG = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight - 22, 'ui', 'paper.png').setDepth(10000).setScale(0.92, 0.9);
    let blackBG = getBackgroundBlackout();
    blackBG.setDepth(9999).setAlpha(0);
    let title = PhaserScene.add.text(gameConsts.halfWidth, levelSelectBG.y - 260, getLangText('lvl_select'), {fontFamily: 'germania', fontSize: 30, color: '#200000', align: 'center'}).setOrigin(0.5, 0).setAlpha(0.8).setScale(0.89, 0.89).setDepth(10000);
    PhaserScene.tweens.add({
        targets: levelSelectBG,
        scaleX: 0.93,
        scaleY: 0.91,
        ease: 'Back.easeOut',
        duration: 250
    })
    PhaserScene.tweens.add({
        targets: title,
        scaleX: 1,
        scaleY: 1,
        ease: 'Cubic.easeOut',
        duration: 250
    })
    PhaserScene.tweens.add({
        targets: blackBG,
        alpha: 0.67,
        ease: 'Quart.easeOut',
        duration: 250
    });

    let sub;
    let closeButton = new Button({
        normal: {
            atlas: 'buttons',
            ref: "closebtn.png",
            alpha: 0.95,
            x: gameConsts.halfWidth + 217,
            y: title.y + 20
        },
        hover: {
            alpha: 1,
            atlas: 'buttons',
            ref: "closebtn_hover.png",
        },
        press: {
            atlas: 'buttons',
            ref: "closebtn_press.png",
            alpha: 1
        },
        disable: {
            atlas: 'buttons',
            ref: "closebtn.png",
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
            closeLevelSelectScreen();
            // clearMenuButtons();
            blackBG.setAlpha(0);
            title.destroy();
            levelSelectBG.destroy();
            closeButton.destroy();
            sub.unsubscribe();
            for (let i in listOfBtns) {
                listOfBtns[i].destroy();
            }
        }
    });
    closeButton.setDepth(this.baseDepth + 10);

    sub = messageBus.subscribe("cancelScreen", () => {
        closeLevelSelectScreen();
        blackBG.setAlpha(0);
        title.destroy();
        levelSelectBG.destroy();
        closeButton.destroy();
        sub.unsubscribe();
        for (let i in listOfBtns) {
            listOfBtns[i].destroy();
        }
    })

    let listOfBtns = [];

    let maxLevel = Math.max(gameVars.latestLevel + 1, Math.min(gameVars.maxLevel, 15));
    for (let i = 1; i <= maxLevel; i++) {
        let xPos = positionsX[i - 1];
        let yPos = positionsY[i - 1];
        let imgRef = `level${i}btn.png`;
        let newBtn = new Button({
            normal: {
                ref: imgRef,
                atlas: 'tutorial',
                x: xPos,
                y: yPos,
                alpha: 0.75,
                scaleX: 0.98,
                scaleY: 0.98
            },
            hover: {
                alpha: 0.9,
                scaleX: 1,
                scaleY: 1
            },
            press: {
                alpha: 1,
                scaleX: 1,
                scaleY: 1
            },
            disable: {
                alpha: 0,
                scaleX: 1,
                scaleY: 1
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
                closeLevelSelectScreen();
                clearMenuButtons();
                beginPreLevel(i);
                blackBG.setAlpha(0);
                title.destroy();
                levelSelectBG.destroy();
                closeButton.destroy();
                sub.unsubscribe();
                for (let i in listOfBtns) {
                    listOfBtns[i].destroy();
                }
            }
        });
        newBtn.setDepth(10000);
        listOfBtns.push(newBtn);
    }
    // clickBlocker.setOnMouseUpFunc(() => {
    //     cleanupCutscene()
    //     hideGlobalClickBlocker();
    //     setupCreditsReturnMainMenu(textObjects);
    //     fadeAwaySound(bgMusic, 2000);
    // });
}

function closeLevelSelectScreen() {
    hideGlobalClickBlocker();
    globalObjects.encyclopedia.showButton();
    globalObjects.options.showButton();
}

function openWishlist() {
    window.open('https://store.steampowered.com/app/3170660/Spellwheel/', '_blank').focus();

}

function openUnlocks() {

}
