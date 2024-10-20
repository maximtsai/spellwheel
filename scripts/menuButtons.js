function setupMainMenuBG() {
    if (!globalObjects.menuBack) {
        globalObjects.menuBack = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'menu_back.png').setDepth(-9).setScale(0.85);
        globalObjects.menuBack.startScale = globalObjects.menuBack.scaleX;
        globalObjects.menuTop = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'menu_top.png').setDepth(-9).setScale(0.85);
        globalObjects.menuTop.startScale = globalObjects.menuTop.scaleX;
        globalObjects.menuButtons = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'menu_buttons.png').setDepth(-9).setScale(1);
    }
}

function clearOnlyMenuButtons() {
    if (globalObjects.continueButton) {
        globalObjects.continueButton.destroy();
    }
    if (globalObjects.lvlPickButton) {
        globalObjects.lvlPickButton.destroy();
    }
    globalObjects.startButton.destroy();
    // globalObjects.cheatButton.destroy();
    // globalObjects.cheatButton2.destroy();
    // globalObjects.cheatButton3.destroy();
    globalObjects.cheatButton4.destroy();
    // globalObjects.cheatButton5.destroy();



    globalObjects.creditsButton.destroy();
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
             scaleX: 0.91,
             scaleY: 0.91,
             y: gameConsts.halfHeight - 110,
             ease: 'Quint.easeInOut',
             duration: 1500,
         });
        PhaserScene.tweens.add({
             targets: [globalObjects.menuTop],
             scaleX: 0.91,
             scaleY: 0.91,
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
        PhaserScene.tweens.add({
             targets: [globalObjects.menuBack],
             scaleX: 1.26,
             scaleY: 1.26,
             x: gameConsts.halfWidth - 1,
             y: gameConsts.halfHeight + 15,
             ease: 'Cubic.easeInOut',
             duration: 2500,
         });
        PhaserScene.tweens.add({
             targets: [globalObjects.menuTop],
             scaleX: 2,
             scaleY: 2,
             y: gameConsts.halfHeight + 20,
             ease: 'Cubic.easeInOut',
             duration: 2500,
         });
        PhaserScene.tweens.add({
             targets: [globalObjects.menuButtons],
             scaleX: 2.15,
             scaleY: 2.15,
             y: gameConsts.halfHeight + 30,
             ease: 'Cubic.easeInOut',
             duration: 2500,
         });
        PhaserScene.tweens.add({
             targets: [globalObjects.menuButtons],
            ease: 'Cubic.easeOut',
             alpha: 0,
             duration: 700,
         });


        PhaserScene.tweens.add({
            delay: 1000,
             targets: [globalObjects.menuTop],
             alpha: 0,
             duration: 1500,
             onComplete: () => {
             }
         });

        PhaserScene.tweens.add({
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

    globalObjects.menuBack.setAlpha(1).setScale(globalObjects.menuBack.startScale).setPosition(gameConsts.halfWidth, gameConsts.halfHeight);
    globalObjects.menuTop.setAlpha(1).setScale(globalObjects.menuTop.startScale).setPosition(gameConsts.halfWidth, gameConsts.halfHeight);
    globalObjects.menuButtons.setAlpha(1).setScale(globalObjects.menuButtons.startScale).setPosition(gameConsts.halfWidth, gameConsts.halfHeight);

    if (globalObjects.startButton && !globalObjects.startButton.isDestroyed) {
        return;
    }
}

function showMainMenuButtons() {
    let hasContinue = gameVars.latestLevel >= 1;
    let hasLvlSelect = gameVars.maxLevel >= 1;

    if (hasContinue) {
        globalObjects.continueButton = new Button({
            normal: {
                atlas: "pixels",
                ref: "blank_pixel.png",
                x: gameConsts.halfWidth - 173,
                y: gameConsts.halfHeight - 151,
                alpha: 0.9,
                scaleX: 130,
                scaleY: 40
            },
            hover: {
                atlas: "pixels",
                ref: "blank_pixel.png",
                alpha: 1
            },
            press: {
                atlas: "pixels",
                ref: "blank_pixel.png",
                alpha: 0.7
            },
            disable: {
                alpha: 0
            },
            onHover: () => {
                if (canvas) {
                    playSound('button_hover').detune = -75;
                    canvas.style.cursor = 'pointer';
                }
            },
            onHoverOut: () => {
                if (canvas) {
                    canvas.style.cursor = 'default';
                }
            },
            onMouseUp: () => {
                playSound('click')
                clearMenuButtons();
                beginPreLevel(gameVars.latestLevel + 1);
            }
        });
        globalObjects.continueButton.setOrigin(0.5, 0.5);
        globalObjects.continueButton.addText(getLangText('cont_ui'), {fontFamily: 'germania', fontSize: 30, color: '#FFFFFF', align: 'left'})
        globalObjects.continueButton.setStroke('#301010', 5)
        // globalObjects.continueButton.setScale(0.9);
    }

    if (hasLvlSelect) {
        globalObjects.lvlPickButton = new Button({
            normal: {
                atlas: "pixels",
                ref: "blank_pixel.png",
                x: gameConsts.halfWidth - 181,
                y: gameConsts.halfHeight - 67,
                alpha: 0.9,
                scaleX: 130,
                scaleY: 37
            },
            hover: {
                atlas: "pixels",
                ref: "blank_pixel.png",
                alpha: 1
            },
            press: {
                atlas: "pixels",
                ref: "blank_pixel.png",
                alpha: 0.7
            },
            disable: {
                alpha: 0
            },
            onHover: () => {
                if (canvas) {
                    playSound('button_hover').detune = -150;
                    canvas.style.cursor = 'pointer';
                }
            },
            onHoverOut: () => {
                if (canvas) {
                    canvas.style.cursor = 'default';
                }
            },
            onMouseUp: () => {
                playSound('click')
                showLevelSelectScreen();
            }
        });
        globalObjects.lvlPickButton.setOrigin(0.5, 0.5);
        globalObjects.lvlPickButton.addText(getLangText('lvl_select'), {fontFamily: 'germania', fontSize: 26, color: '#FFFFFF', align: 'left'})
        globalObjects.lvlPickButton.setStroke('#301010', 5)
        globalObjects.lvlPickButton.setRotation(0.27)
    }
    let yPos = (hasLvlSelect || hasContinue) ? gameConsts.halfHeight - 260 : gameConsts.halfHeight - 132;
    globalObjects.startButton = new Button({
        normal: {
            atlas: "pixels",
            ref: "blank_pixel.png",
            x: gameConsts.halfWidth - 176,
            y: yPos + 32,
            scaleX: 130,
            scaleY: 40,
            alpha: 0.9
        },
        hover: {
            atlas: "pixels",
            ref: "blank_pixel.png",
            alpha: 1,
        },
        press: {
            atlas: "pixels",
            ref: "blank_pixel.png",
            alpha: 0.7
        },
        disable: {
            alpha: 0
        },
        onHover: () => {
            if (canvas) {
                playSound('button_hover').detune = 0;
                canvas.style.cursor = 'pointer';
            }
        },
        onHoverOut: () => {
            if (canvas) {
                canvas.style.cursor = 'default';
            }
        },
        onMouseUp: () => {
            playSound('click')
            if (gameVars.latestLevel >= 1) {
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
    globalObjects.startButton.addText(getLangText('new_game'), {fontFamily: 'germania', fontSize: 30, color: '#FFFFFF', align: 'left'});
    globalObjects.startButton.setStroke('#301010', 5)
    globalObjects.startButton.setRotation(-0.05)
    // globalObjects.startButton.setScale(0.9);
    globalObjects.startButton.isSolo = !hasLvlSelect && !hasContinue;
    if (globalObjects.startButton.isSolo) {
        setTimeout(() => {
            let flash = PhaserScene.add.sprite(gameConsts.halfWidth, globalObjects.startButton.getYPos(), 'shields', 'btnFlash12.png').setScale(1.12).setDepth(100).play('btnFlash');
            globalObjects.startButton.addToDestructibles(flash)
        }, 850)
    }

    let hideCheatConst = 0;

    /*
    globalObjects.cheatButton = new Button({
        normal: {
            ref: "menu_btn_normal.png",
            atlas: 'buttons',
            x: gameConsts.width - 100 + hideCheatConst,
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
            toggleCheat('dd')
        }
    });
    globalObjects.cheatButton.setScale(0.5);
    globalObjects.cheatButton.addText("2X DAMAGE CHEAT", {fontFamily: 'germania', fontSize: 20, color: '#000000', align: 'left'})

    globalObjects.cheatButton2 = new Button({
        normal: {
            ref: "menu_btn_normal.png",
            atlas: 'buttons',
            x: gameConsts.width - 100 + hideCheatConst,
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
            toggleCheat('edd')
        }
    });
    globalObjects.cheatButton2.setScale(0.5);
    globalObjects.cheatButton2.addText("2X DAMAGE CHEAT", {fontFamily: 'germania', fontSize: 20, color: '#000000', align: 'left'})

    globalObjects.cheatButton3 = new Button({
        normal: {
            ref: "menu_btn_normal.png",
            atlas: 'buttons',
            x: gameConsts.width - 100 + hideCheatConst,
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
            toggleCheat('hpx')
        }
    });
    globalObjects.cheatButton3.setScale(0.5);
    globalObjects.cheatButton3.addText("+20 HP CHEAT", {fontFamily: 'germania', fontSize: 20, color: '#000000', align: 'left'})
    */

    globalObjects.cheatButton4 = new Button({
        normal: {
            ref: "menu_btn_normal.png",
            atlas: 'buttons',
            x: gameConsts.width + 180,
            y: 390,
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
    globalObjects.cheatButton5 = new Button({
        normal: {
            ref: "menu_btn_normal.png",
            atlas: 'buttons',
            x: gameConsts.width - 100 + hideCheatConst,
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
            challenges.lowHealth = !challenges.lowHealth;
            globalObjects.player.reInitStats();
            globalObjects.player.resetStats();
        }
    });
    globalObjects.cheatButton5.setScale(0.5);
    globalObjects.cheatButton5.addText("LOW HEALTH", {fontFamily: 'germania', fontSize: 20, color: '#000000', align: 'left'})
*/


    // globalObjects.levelSelectButton = new Button({
    //     normal: {
    //         ref: "menu_btn_normal.png",
    //         atlas: 'buttons',
    //         x: 100,
    //         y: 100,
    //     },
    //     hover: {
    //         ref: "menu_btn_hover.png",
    //         atlas: 'buttons',
    //     },
    //     press: {
    //         ref: "menu_btn_press.png",
    //         atlas: 'buttons',
    //     },
    //     disable: {
    //         alpha: 0.001
    //     },
    //     onMouseUp: () => {
    //         clearMenuButtons();
    //         beginPreLevel(2);
    //     }
    // });
    // globalObjects.levelSelectButton.setScale(0.5);
    // globalObjects.levelSelectButton.addText("LEVEL GOBLIN", {fontFamily: 'germania', fontSize: 20, color: '#000000', align: 'left'})

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

    globalObjects.creditsButton = new Button({
        normal: {
            atlas: "pixels",
            ref: "blank_pixel.png",
            x: gameConsts.width - 88,
            y: gameConsts.halfHeight - 7,
            alpha: 0.9,
            scaleX: 85,
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
                playSound('button_hover', 0.5).detune = 200;
                canvas.style.cursor = 'pointer';
            }
        },
        onHoverOut: () => {
            if (canvas) {
                canvas.style.cursor = 'default';
            }
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
                artbook.destroy();
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
                    artbook.destroy();
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
    globalObjects.creditsButton.addText("CREDITS", {fontFamily: 'germania', fontSize: 24, color: '#FFFFFF', align: 'left'});
    globalObjects.creditsButton.setStroke('#301010', 5)
    globalObjects.creditsButton.setRotation(-0.03)
}

function updateMenuLanguage() {
    if (globalObjects.startButton && !globalObjects.startButton.isDestroyed) {
        globalObjects.startButton.setText(getLangText('new_game'))
    }
    if (globalObjects.continueButton && !globalObjects.continueButton.isDestroyed) {
        globalObjects.continueButton.setText(getLangText('cont_ui'))
    }
    if (globalObjects.lvlPickButton && !globalObjects.lvlPickButton.isDestroyed) {
        globalObjects.lvlPickButton.setText(getLangText('lvl_select'))
    }


}


function showLevelSelectScreen(){
    globalObjects.encyclopedia.hideButton();
    globalObjects.options.hideButton();
    let clickBlocker = createGlobalClickBlocker(false);
    let positionsX = [
        gameConsts.halfWidth - 120, gameConsts.halfWidth, gameConsts.halfWidth + 120,
        gameConsts.halfWidth - 180, gameConsts.halfWidth - 60, gameConsts.halfWidth + 60, gameConsts.halfWidth + 180,
        gameConsts.halfWidth - 120, gameConsts.halfWidth, gameConsts.halfWidth + 120,
        gameConsts.halfWidth - 180, gameConsts.halfWidth - 60, gameConsts.halfWidth + 60, gameConsts.halfWidth + 180,
    ]
    let positionsY = [
        gameConsts.halfHeight - 180, gameConsts.halfHeight - 180, gameConsts.halfHeight - 180,
        gameConsts.halfHeight - 60, gameConsts.halfHeight - 60, gameConsts.halfHeight - 60, gameConsts.halfHeight - 60,
        gameConsts.halfHeight + 60, gameConsts.halfHeight + 60, gameConsts.halfHeight + 60,
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
    let maxLevel = Math.min(gameVars.maxLevel + 1, 14);
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
