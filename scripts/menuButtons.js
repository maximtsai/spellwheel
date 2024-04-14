function clearMenuButtons() {
    if (globalObjects.continueButton) {
        globalObjects.continueButton.destroy();
    }
    globalObjects.startButton.destroy();
    globalObjects.levelSelectButton.destroy();
    globalObjects.creditsButton.destroy();
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

function createMenuButtons() {
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
                beginLevel(1);
            }
        });
    }
    globalObjects.startButton = new Button({
        normal: {
            ref: "menu_btn_normal.png",
            atlas: 'buttons',
            x: 0,
            y: 100,
        },
        hover: {
            ref: "menu_btn_hover.png",
            atlas: 'buttons',
        },
        press: {
            ref: "new_game_hover.png",
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
    globalObjects.startButton.setOrigin(0, 0.5);



    globalObjects.levelSelectButton = new Button({
        normal: {
            ref: "level_select.png",
            atlas: 'buttons',
            x: gameConsts.halfWidth,
            y: gameConsts.halfHeight - 140,
            alpha: 0.95
        },
        hover: {
            ref: "level_select_hover.png",
            atlas: 'buttons',
            alpha: 1
        },
        press: {
            ref: "level_select_hover.png",
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
    globalObjects.levelSelectButton.setScale(0.6);
    globalObjects.creditsButton = new Button({
        normal: {
            ref: "credits.png",
            atlas: 'buttons',
            x: gameConsts.halfWidth,
            y: gameConsts.halfHeight - 90,
            alpha: 0.95
        },
        hover: {
            ref: "credits_hover.png",
            atlas: 'buttons',
            alpha: 1
        },
        press: {
            ref: "credits_hover.png",
            atlas: 'buttons',
            alpha: 0.8
        },
        disable: {
            alpha: 0.001
        },
        onMouseUp: () => {
            clearMenuButtons();
            beginLevel(2);
        }
    });
    globalObjects.creditsButton.setScale(0.6);

    globalObjects.creditsButton2 = new Button({
        normal: {
            ref: "credits.png",
            atlas: 'buttons',
            x: gameConsts.halfWidth,
            y: gameConsts.halfHeight - 40,
            alpha: 0.95
        },
        hover: {
            ref: "credits_hover.png",
            atlas: 'buttons',
            alpha: 1
        },
        press: {
            ref: "credits_hover.png",
            atlas: 'buttons',
            alpha: 0.8
        },
        disable: {
            alpha: 0.001
        },
        onMouseUp: () => {
            clearMenuButtons();
            beginLevel(3);
        }
    });
    globalObjects.creditsButton2.setScale(0.6);

    globalObjects.creditsButton3 = new Button({
        normal: {
            ref: "credits.png",
            atlas: 'buttons',
            x: gameConsts.halfWidth,
            y: gameConsts.halfHeight + 40,
            alpha: 0.95
        },
        hover: {
            ref: "credits_hover.png",
            atlas: 'buttons',
            alpha: 1
        },
        press: {
            ref: "credits_hover.png",
            atlas: 'buttons',
            alpha: 0.8
        },
        disable: {
            alpha: 0.001
        },
        onMouseUp: () => {
            clearMenuButtons();
            beginLevel(7);
        }
    });
    globalObjects.creditsButton3.setScale(0.7);

}
