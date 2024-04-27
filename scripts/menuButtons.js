function setupMainMenu() {
    globalObjects.menuBack = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'menu_back.png').setDepth(-9);
    globalObjects.menuTop = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'menu_top.png').setDepth(-9);
    globalObjects.menuBot = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'menu_bot.png').setDepth(-9);
}


function clearMenuButtons() {
    if (globalObjects.continueButton) {
        globalObjects.continueButton.destroy();
    }
    globalObjects.startButton.destroy();
    globalObjects.levelSelectButton.destroy();
    globalObjects.creditsButton.destroy();
    globalObjects.lvlButton.destroy();
    globalObjects.lvl5Button.destroy();

    globalObjects.creditsButton2.destroy();
    globalObjects.creditsButton3.destroy();



    if (globalObjects.menuBack) {
        PhaserScene.tweens.add({
             targets: [globalObjects.menuBack],
             scaleX: 1.26,
             scaleY: 1.26,
             x: gameConsts.halfWidth - 2,
             y: gameConsts.halfHeight + 55,
             ease: 'Cubic.easeInOut',
             duration: 2500,
         });
        PhaserScene.tweens.add({
             targets: [globalObjects.menuTop],
             scaleX: 2.1,
             scaleY: 2.1,
             y: gameConsts.halfHeight + 130,
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

function gotoMainMenu() {
    let hasContinue = false;
    if (globalObjects.currentEnemy) {
        globalObjects.currentEnemy.destroy();
    }
    if (globalObjects.player) {
        globalObjects.player.resetStats();

    }

    globalObjects.menuBack.setAlpha(1).setScale(1).setPosition(gameConsts.halfWidth, gameConsts.halfHeight);
    globalObjects.menuTop.setAlpha(1).setScale(1).setPosition(gameConsts.halfWidth, gameConsts.halfHeight);
    globalObjects.menuBot.setAlpha(1).setScale(1).setPosition(gameConsts.halfWidth, gameConsts.halfHeight);

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
            clearMenuButtons();
            beginLevel(0);
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

    globalObjects.creditsButton = new Button({
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
    globalObjects.creditsButton.setScale(0.5);
    globalObjects.creditsButton.addText("LEVEL 3", {fontFamily: 'Garamond', fontSize: 20, color: '#000000', align: 'left'})

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


    globalObjects.creditsButton2 = new Button({
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
            beginLevel(7);
        }
    });
    globalObjects.creditsButton2.setScale(0.5);
    globalObjects.creditsButton2.addText("LEVEL 7", {fontFamily: 'Garamond', fontSize: 20, color: '#000000', align: 'left'})

    globalObjects.creditsButton3 = new Button({
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
            beginLevel(9);
        }
    });
    globalObjects.creditsButton3.setScale(0.5);
    globalObjects.creditsButton3.addText("LEVEL 9", {fontFamily: 'Garamond', fontSize: 20, color: '#000000', align: 'left'})

}
