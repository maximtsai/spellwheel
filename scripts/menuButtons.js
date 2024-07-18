function setupMainMenuBG() {
    if (!globalObjects.menuBack) {
        globalObjects.menuBack = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'menu_back.png').setDepth(-9).setScale(0.92);
        globalObjects.menuTop = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'menu_top.png').setDepth(-9).setScale(0.92);
        globalObjects.menuBot = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'menu_bot.png').setDepth(-9).setScale(0.92);
    }
}

function clearOnlyMenuButtons() {
    if (globalObjects.continueButton) {
        globalObjects.continueButton.destroy();
    }
    globalObjects.startButton.destroy();
    globalObjects.levelSelectButton.destroy();
    globalObjects.lvlButton.destroy();
    globalObjects.cheatButton.destroy();
    globalObjects.cheatButton2.destroy();
    globalObjects.cheatButton3.destroy();
    globalObjects.cheatButton4.destroy();

    globalObjects.level3Button.destroy();
    globalObjects.lvl5Button.destroy();
    globalObjects.lvl6Button.destroy();

    globalObjects.creditsButton.destroy();
    globalObjects.lvl7Button.destroy();
    globalObjects.lvl8Button.destroy();
    globalObjects.lvl9Button.destroy();
    globalObjects.lvl10Button.destroy();
    globalObjects.lvl11Button.destroy();
    globalObjects.lvl12Button.destroy();
    globalObjects.lvl13Button.destroy();


    globalObjects.en_us_button.destroy();
    globalObjects.fr_button.destroy();
    globalObjects.zh_cn_button.destroy();
    globalObjects.zh_tw_button.destroy();

}

function minorZoomMenu() {
    if (globalObjects.menuBack) {
        PhaserScene.tweens.add({
             targets: [globalObjects.menuBack],
             scaleX: 1,
             scaleY: 1,
             y: gameConsts.halfHeight - 100,
             ease: 'Quint.easeInOut',
             duration: 1500,
         });
        PhaserScene.tweens.add({
             targets: [globalObjects.menuTop],
             scaleX: 1.05,
             scaleY: 1.05,
             y: gameConsts.halfHeight - 100,
             ease: 'Quint.easeInOut',
             duration: 1500,
         });

        globalObjects.menuBot.destroy();

        // PhaserScene.tweens.add({
        //      targets: [globalObjects.menuBot],
        //      scaleX: 1.2,
        //      scaleY: 1.2,
        //      y: gameConsts.halfHeight - 70,
        //      ease: 'Cubic.easeInOut',
        //      duration: 1500,
        //  });
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
             targets: [globalObjects.menuBot],
             scaleX: 2.1,
             scaleY: 1.4,
             y: gameConsts.halfHeight + 130,
             ease: 'Cubic.easeInOut',
             duration: 2500,
         });

        PhaserScene.tweens.add({
            delay: 1000,
             targets: [globalObjects.menuTop, globalObjects.menuBot],
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
    clearOnlyMenuButtons();
    clearOnlyMenuBack();
}

function gotoMainMenu() {
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

    globalObjects.menuBack.setAlpha(1).setScale(0.902).setPosition(gameConsts.halfWidth, gameConsts.halfHeight);
    globalObjects.menuTop.setAlpha(1).setScale(0.902).setPosition(gameConsts.halfWidth, gameConsts.halfHeight);
    globalObjects.menuBot.setAlpha(1).setScale(0.902).setPosition(gameConsts.halfWidth, gameConsts.halfHeight - 89).setOrigin(0.5, 0.4);

    if (globalObjects.startButton && !globalObjects.startButton.isDestroyed) {
        return;
    }
}

function showMainMenuButtons() {
    let hasContinue = false;

    if (hasContinue) {
        globalObjects.continueButton = new Button({
            normal: {
                ref: "continue_game.png",
                atlas: 'buttons',
                x: gameConsts.halfWidth,
                y: gameConsts.halfHeight - 200,
                alpha: 0.95
            },
            hover: {
                ref: "continue_game_hover.png",
                atlas: 'buttons',
                alpha: 1
            },
            press: {
                ref: "continue_game_hover.png",
                atlas: 'buttons',
                alpha: 0.8
            },
            disable: {
                alpha: 0.001
            },
            onMouseUp: () => {
                clearMenuButtons();
                beginPreLevel(1);
            }
        });
        globalObjects.continueButton.setOrigin(0.5, 0.5);
        globalObjects.continueButton.addText(getLangText('cont_game'), {fontFamily: 'garamondmax', fontSize: 28, color: '#000000', align: 'left'})
        globalObjects.continueButton.setScale(0.9);
    }
    globalObjects.startButton = new Button({
        normal: {
            ref: "menu_btn_normal.png",
            atlas: 'buttons',
            x: gameConsts.halfWidth,
            y: 40,
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
            if (canvas) {
                playSound('button_hover');
                canvas.style.cursor = 'pointer';
            }
        },
        onHoverOut: () => {
            if (canvas) {
                canvas.style.cursor = 'default';
            }
        },
        onMouseUp: () => {
            clearOnlyMenuButtons();
            beginPreLevel(0)
        }
    });
    globalObjects.startButton.setOrigin(0.5, 0.5);
    globalObjects.startButton.addText(getLangText('new_game'), {fontFamily: 'garamondmax', fontSize: 28, color: '#000000', align: 'left'})
    globalObjects.startButton.setScale(0.9);

    let hideCheatConst = 500;

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
    globalObjects.cheatButton.addText("2X DAMAGE CHEAT", {fontFamily: 'garamondmax', fontSize: 20, color: '#000000', align: 'left'})

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
    globalObjects.cheatButton2.addText("2X DAMAGE CHEAT", {fontFamily: 'garamondmax', fontSize: 20, color: '#000000', align: 'left'})

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
    globalObjects.cheatButton3.addText("+1000 HP CHEAT", {fontFamily: 'garamondmax', fontSize: 20, color: '#000000', align: 'left'})

    globalObjects.cheatButton4 = new Button({
        normal: {
            ref: "menu_btn_normal.png",
            atlas: 'buttons',
            x: gameConsts.width - 100 + hideCheatConst,
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
            toggleCheat('inam')
        }
    });
    globalObjects.cheatButton4.setScale(0.5);
    globalObjects.cheatButton4.addText("INFINITE AMMO", {fontFamily: 'garamondmax', fontSize: 20, color: '#000000', align: 'left'})


    globalObjects.levelSelectButton = new Button({
        normal: {
            ref: "menu_btn_normal.png",
            atlas: 'buttons',
            x: 100,
            y: 100,
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
            beginPreLevel(2);
        }
    });
    globalObjects.levelSelectButton.setScale(0.5);
    globalObjects.levelSelectButton.addText("LEVEL GOBLIN", {fontFamily: 'garamondmax', fontSize: 20, color: '#000000', align: 'left'})

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
    globalObjects.level3Button.addText("LEVEL TREE", {fontFamily: 'garamondmax', fontSize: 20, color: '#000000', align: 'left'})

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
    globalObjects.lvlButton.addText("LEVEL MAGICIAN", {fontFamily: 'garamondmax', fontSize: 20, color: '#000000', align: 'left'})

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
    globalObjects.lvl5Button.addText("LEVEL KNIGHT", {fontFamily: 'garamondmax', fontSize: 20, color: '#000000', align: 'left'})

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
    globalObjects.lvl6Button.addText("LEVEL WALL", {fontFamily: 'garamondmax', fontSize: 20, color: '#000000', align: 'left'})

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
    globalObjects.lvl7Button.addText("LEVEL SUPER DUMMY", {fontFamily: 'garamondmax', fontSize: 20, color: '#000000', align: 'left'})

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
    globalObjects.lvl8Button.addText("LEVEL ASSASSIN", {fontFamily: 'garamondmax', fontSize: 20, color: '#000000', align: 'left'})

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
    globalObjects.lvl9Button.addText("LEVEL ROBOT", {fontFamily: 'garamondmax', fontSize: 20, color: '#000000', align: 'left'})

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
    globalObjects.lvl10Button.addText("LEVEL DEATH", {fontFamily: 'garamondmax', fontSize: 20, color: '#000000', align: 'left'})


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
    globalObjects.lvl11Button.addText("LEVEL 11", {fontFamily: 'garamondmax', fontSize: 20, color: '#000000', align: 'left'})

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
    globalObjects.lvl12Button.addText("LEVEL 11.5", {fontFamily: 'garamondmax', fontSize: 20, color: '#000000', align: 'left'});

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
    globalObjects.lvl13Button.addText("LEVEL 13", {fontFamily: 'garamondmax', fontSize: 20, color: '#000000', align: 'left'});

    globalObjects.creditsButton = new Button({
        normal: {
            ref: "menu_btn_normal.png",
            atlas: 'buttons',
            x: gameConsts.width - 80,
            y: gameConsts.height - 330,
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
            //showCutscene1();
            showCutscene2();
            return;
            let creditsUI = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'ui', 'credits.png').setDepth(100000).setScale(0.975);
            PhaserScene.tweens.add({
                targets: creditsUI,
                duration: 250,
                scaleX: 1,
                scaleY: 1,
                alpha: 1,
                ease: 'Cubic.easeOut',
            });
            if (canvas) {
                canvas.style.cursor = 'pointer';
            }
            let creditsButton;
            creditsButton = new Button({
                normal: {
                    ref: "blackPixel",
                    scaleX: 1000,
                    scaleY: 1000,
                    alpha: 0.5,
                    x: gameConsts.halfWidth,
                    y: gameConsts.halfHeight,
                },
                disable: {
                    alpha: 0.1
                },

                onMouseUp: () => {
                    creditsButton.destroy();
                    creditsUI.destroy();
                    if (canvas) {
                        canvas.style.cursor = 'default';
                    }
                }
            });
            creditsButton.setDepth(99999);
        }
    });
    globalObjects.creditsButton.setScale(0.5, 0.5);
    globalObjects.creditsButton.addText("CREDITS", {fontFamily: 'garamondmax', fontSize: 20, color: '#000000', align: 'left'})

    globalObjects.en_us_button = new Button({
        normal: {
            ref: "slip.png",
            atlas: 'buttons',
            alpha: 1,
            x: 45,
            y: gameConsts.height - 230,
        },
        hover: {
            alpha: 1,
            ref: "slip_hover.png",
            atlas: 'buttons',
        },
        press: {
            alpha: 1,
            ref: "slip_press.png",
            atlas: 'buttons',
        },
        disable: {
            alpha: 0
        },
        onMouseUp: () => {
            setLanguage('en_us')
            updateMenuLanguage();
        }
    });
    globalObjects.en_us_button.addText("English", {fontFamily: 'garamondmax', fontSize: 17, color: '#000000', align: 'left'})

    globalObjects.fr_button = new Button({
        normal: {
            ref: "slip.png",
            atlas: 'buttons',
            alpha: 1,
            x: 45,
            y: gameConsts.height - 190,
        },
        hover: {
            alpha: 1,
            ref: "slip_hover.png",
            atlas: 'buttons',
        },
        press: {
            alpha: 1,
            ref: "slip_press.png",
            atlas: 'buttons',
        },
        disable: {
            alpha: 0
        },
        onMouseUp: () => {
            setLanguage('fr')
            updateMenuLanguage();
        }
    });
    globalObjects.fr_button.addText("français", {fontSize: 16, color: '#000000', align: 'left'})

    globalObjects.zh_cn_button = new Button({
        normal: {
            ref: "slip.png",
            atlas: 'buttons',
            alpha: 1,
            x: 45,
            y: gameConsts.height - 150,
        },
        hover: {
            alpha: 1,
            ref: "slip_hover.png",
            atlas: 'buttons',
        },
        press: {
            alpha: 1,
            ref: "slip_press.png",
            atlas: 'buttons',
        },
        disable: {
            alpha: 0
        },
        onMouseUp: () => {
            setLanguage('zh_cn')
            updateMenuLanguage();
        }
    });
    globalObjects.zh_cn_button.addText("中文(简体)", {fontSize: 16, color: '#000000', align: 'left'})

    globalObjects.zh_tw_button = new Button({
        normal: {
            ref: "slip.png",
            atlas: 'buttons',
            alpha: 1,
            x: -85,
            y: gameConsts.height - 110,
        },
        hover: {
            alpha: 1,
            ref: "slip_hover.png",
            atlas: 'buttons',
        },
        press: {
            alpha: 1,
            ref: "slip_press.png",
            atlas: 'buttons',
        },
        disable: {
            alpha: 0
        },
        onMouseUp: () => {
            setLanguage('zh_tw')
            updateMenuLanguage();
        }
    });
    globalObjects.zh_tw_button.addText("中文(繁體)", {fontSize: 16, color: '#000000', align: 'left'})
}

function updateMenuLanguage() {
    console.log("todo");
    if (globalObjects.startButton) {
        globalObjects.startButton.setText(getLangText('new_game'))
    }
    if (globalObjects.continueButton) {
        globalObjects.continueButton.setText(getLangText('cont_game'))
    }
}
