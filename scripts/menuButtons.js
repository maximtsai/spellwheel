function clearMenuButtons() {
    if (globalObjects.continueButton) {
        globalObjects.continueButton.destroy();
    }
    globalObjects.startButton.destroy();
    globalObjects.levelSelectButton.destroy();
    globalObjects.creditsButton.destroy();
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
                createEnemy(1);
            }
        });
    }
    globalObjects.startButton = new Button({
        normal: {
            ref: "new_game.png",
            atlas: 'buttons',
            x: gameConsts.halfWidth,
            y: gameConsts.halfHeight - 200,
            alpha: 0.95
        },
        hover: {
            ref: "new_game_hover.png",
            atlas: 'buttons',
            alpha: 1
        },
        press: {
            ref: "new_game_hover.png",
            atlas: 'buttons',
            alpha: 0.8
        },
        disable: {
            alpha: 0.001
        },
        onMouseUp: () => {
            clearMenuButtons();
            createEnemy(0);
        }
    });
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
            // clearMenuButtons();
            // createEnemy(0);
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
            // clearMenuButtons();
            // createEnemy(0);
        }
    });
    globalObjects.creditsButton.setScale(0.6);
}