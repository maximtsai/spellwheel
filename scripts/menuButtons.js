function setupMainMenu() {
    globalObjects.menuBack = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'menu_back.png').setDepth(-9).setScale(0.92);
    globalObjects.menuTop = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'menu_top.png').setDepth(-9).setScale(0.92);
    globalObjects.menuBot = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'menu_bot.png').setDepth(-9).setScale(0.92);
}

function clearOnlyMenuButtons() {
    if (globalObjects.continueButton) {
        globalObjects.continueButton.destroy();
    }
    globalObjects.startButton.destroy();
    globalObjects.levelSelectButton.destroy();
    globalObjects.lvlButton.destroy();
    globalObjects.level3Button.destroy();
    globalObjects.lvl5Button.destroy();
    globalObjects.lvl6Button.destroy();

    globalObjects.creditsButton.destroy();
    globalObjects.lvl7Button.destroy();
    globalObjects.lvl8Button.destroy();
    globalObjects.lvl9Button.destroy();
    globalObjects.lvl10Button.destroy();
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
    setupMainMenu();
    let hasContinue = false;
    if (globalObjects.currentEnemy) {
        globalObjects.currentEnemy.destroy();
    }
    if (globalObjects.player) {
        globalObjects.player.resetStats();

    }

    globalObjects.menuBack.setAlpha(1).setScale(0.902).setPosition(gameConsts.halfWidth, gameConsts.halfHeight);
    globalObjects.menuTop.setAlpha(1).setScale(0.902).setPosition(gameConsts.halfWidth, gameConsts.halfHeight);
    globalObjects.menuBot.setAlpha(1).setScale(0.902).setPosition(gameConsts.halfWidth, gameConsts.halfHeight - 89).setOrigin(0.5, 0.4);

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
                beginLevel(1);
            }
        });
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
        onMouseUp: () => {
            clearOnlyMenuButtons();
            beginPreLevel(0)
        }
    });
    globalObjects.startButton.setOrigin(0.5, 0.5);
    globalObjects.startButton.addText("NEW GAME", {fontFamily: 'Garamond', fontSize: 28, color: '#000000', align: 'left'})
    globalObjects.startButton.setScale(0.9);

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
            beginLevel(2);
        }
    });
    globalObjects.levelSelectButton.setScale(0.5);
    globalObjects.levelSelectButton.addText("LEVEL 2", {fontFamily: 'Garamond', fontSize: 20, color: '#000000', align: 'left'})

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
            beginLevel(3);
        }
    });
    globalObjects.level3Button.setScale(0.5);
    globalObjects.level3Button.addText("LEVEL 3", {fontFamily: 'Garamond', fontSize: 20, color: '#000000', align: 'left'})

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
            beginLevel(4);
        }
    });
    globalObjects.lvlButton.setScale(0.5);
    globalObjects.lvlButton.addText("LEVEL 4", {fontFamily: 'Garamond', fontSize: 20, color: '#000000', align: 'left'})

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
            beginLevel(5);
        }
    });
    globalObjects.lvl5Button.setScale(0.5);
    globalObjects.lvl5Button.addText("LEVEL 5", {fontFamily: 'Garamond', fontSize: 20, color: '#000000', align: 'left'})


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
            beginLevel(6);
        }
    });
    globalObjects.lvl6Button.setScale(0.5);
    globalObjects.lvl6Button.addText("LEVEL 6", {fontFamily: 'Garamond', fontSize: 20, color: '#000000', align: 'left'})



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
            beginLevel(7);
        }
    });
    globalObjects.lvl7Button.setScale(0.5);
    globalObjects.lvl7Button.addText("LEVEL 7", {fontFamily: 'Garamond', fontSize: 20, color: '#000000', align: 'left'})

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
            beginLevel(8);
        }
    });
    globalObjects.lvl8Button.setScale(0.5);
    globalObjects.lvl8Button.addText("LEVEL 8", {fontFamily: 'Garamond', fontSize: 20, color: '#000000', align: 'left'})

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
            beginLevel(9);
        }
    });
    globalObjects.lvl9Button.setScale(0.5);
    globalObjects.lvl9Button.addText("LEVEL 9", {fontFamily: 'Garamond', fontSize: 20, color: '#000000', align: 'left'})


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
            beginLevel(10);
        }
    });
    globalObjects.lvl10Button.setScale(0.5);
    globalObjects.lvl10Button.addText("LEVEL 10", {fontFamily: 'Garamond', fontSize: 20, color: '#000000', align: 'left'})


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
    globalObjects.creditsButton.addText("CREDITS", {fontFamily: 'Garamond', fontSize: 20, color: '#000000', align: 'left'})

}
