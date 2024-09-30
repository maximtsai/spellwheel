function setupMainMenuBG() {
    if (!globalObjects.menuBack) {
        globalObjects.menuBack = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'menu_back.png').setDepth(-9).setScale(0.92);
        globalObjects.menuTop = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'menu_top.png').setDepth(-9).setScale(0.92);
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
    clearOnlyMenuButtons();
    clearOnlyMenuBack();
}

function gotoMainMenu() {
    gotoMainMenuNoButtons()
    showMainMenuButtons();
    globalObjects.magicCircle.enableMovement();
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

    if (globalObjects.startButton && !globalObjects.startButton.isDestroyed) {
        return;
    }
}

function showMainMenuButtons() {
    let hasContinue = gameVars.latestLevel >= 1;

    if (hasContinue) {
        globalObjects.continueButton = new Button({
            normal: {
                ref: "menu_btn_normal.png",
                atlas: 'buttons',
                x: gameConsts.halfWidth,
                y: gameConsts.halfHeight - 227,
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
            onMouseUp: () => {
                clearMenuButtons();
                beginPreLevel(gameVars.latestLevel + 1);
            }
        });
        globalObjects.continueButton.setOrigin(0.5, 0.5);
        globalObjects.continueButton.addText(getLangText('cont_ui'), {fontFamily: 'opensans', fontSize: 28, color: '#000000', align: 'left'})
        globalObjects.continueButton.setScale(0.9);

        globalObjects.lvlPickButton = new Button({
            normal: {
                ref: "menu_btn_normal.png",
                atlas: 'buttons',
                x: gameConsts.halfWidth,
                y: gameConsts.halfHeight - 150,
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
            onMouseUp: () => {
                showLevelSelectScreen();
            }
        });
        globalObjects.lvlPickButton.setOrigin(0.5, 0.5);
        globalObjects.lvlPickButton.addText(getLangText('lvl_select'), {fontFamily: 'opensans', fontSize: 28, color: '#000000', align: 'left'})
        globalObjects.lvlPickButton.setScale(0.9);
    }
    globalObjects.startButton = new Button({
        normal: {
            ref: "menu_btn_normal.png",
            atlas: 'buttons',
            x: gameConsts.halfWidth,
            y: 80,
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
    globalObjects.startButton.addText(getLangText('new_game'), {fontFamily: 'opensans', fontSize: 28, color: '#000000', align: 'left'})
    globalObjects.startButton.setScale(0.9);

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
    globalObjects.cheatButton.addText("2X DAMAGE CHEAT", {fontFamily: 'opensans', fontSize: 20, color: '#000000', align: 'left'})

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
    globalObjects.cheatButton2.addText("2X DAMAGE CHEAT", {fontFamily: 'opensans', fontSize: 20, color: '#000000', align: 'left'})

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
    globalObjects.cheatButton3.addText("+20 HP CHEAT", {fontFamily: 'opensans', fontSize: 20, color: '#000000', align: 'left'})
    */

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
    globalObjects.cheatButton4.addText("INFINITE AMMO", {fontFamily: 'opensans', fontSize: 20, color: '#000000', align: 'left'})
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
    globalObjects.cheatButton5.addText("LOW HEALTH", {fontFamily: 'opensans', fontSize: 20, color: '#000000', align: 'left'})
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
    // globalObjects.levelSelectButton.addText("LEVEL GOBLIN", {fontFamily: 'opensans', fontSize: 20, color: '#000000', align: 'left'})

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
    globalObjects.level3Button.addText("LEVEL TREE", {fontFamily: 'opensans', fontSize: 20, color: '#000000', align: 'left'})

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
    globalObjects.lvlButton.addText("LEVEL MAGICIAN", {fontFamily: 'opensans', fontSize: 20, color: '#000000', align: 'left'})

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
    globalObjects.lvl5Button.addText("LEVEL KNIGHT", {fontFamily: 'opensans', fontSize: 20, color: '#000000', align: 'left'})

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
    globalObjects.lvl6Button.addText("LEVEL WALL", {fontFamily: 'opensans', fontSize: 20, color: '#000000', align: 'left'})

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
    globalObjects.lvl7Button.addText("LEVEL SUPER DUMMY", {fontFamily: 'opensans', fontSize: 20, color: '#000000', align: 'left'})

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
    globalObjects.lvl8Button.addText("LEVEL ASSASSIN", {fontFamily: 'opensans', fontSize: 20, color: '#000000', align: 'left'})

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
    globalObjects.lvl9Button.addText("LEVEL ROBOT", {fontFamily: 'opensans', fontSize: 20, color: '#000000', align: 'left'})

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
    globalObjects.lvl10Button.addText("LEVEL DEATH", {fontFamily: 'opensans', fontSize: 20, color: '#000000', align: 'left'})


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
    globalObjects.lvl11Button.addText("LEVEL 11", {fontFamily: 'opensans', fontSize: 20, color: '#000000', align: 'left'})

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
    globalObjects.lvl12Button.addText("LEVEL 11.5", {fontFamily: 'opensans', fontSize: 20, color: '#000000', align: 'left'});

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
    globalObjects.lvl13Button.addText("LEVEL 13", {fontFamily: 'opensans', fontSize: 20, color: '#000000', align: 'left'});
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
            rollCredits();
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
    globalObjects.creditsButton.addText("CREDITS", {fontFamily: 'opensans', fontSize: 20, color: '#000000', align: 'left'})

}

function updateMenuLanguage() {
    if (globalObjects.startButton && !globalObjects.startButton.isDestroyed) {
        globalObjects.startButton.setText(getLangText('new_game'))
    }
    if (globalObjects.continueButton && !globalObjects.continueButton.isDestroyed) {
        globalObjects.continueButton.setText(getLangText('cont_ui'))
    }
}


function showLevelSelectScreen(){
    globalObjects.encyclopedia.hideButton();
    globalObjects.options.hideButton();
    let clickBlocker = createGlobalClickBlocker(false);
    let levelSelectBG = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight - 10, 'ui', 'paper.png').setDepth(10000).setScale(0.98, 0.88);
    let blackBG = getBackgroundBlackout();
    blackBG.setDepth(9999).setAlpha(0);
    let title = PhaserScene.add.text(gameConsts.halfWidth, levelSelectBG.y - 251, getLangText('lvl_select'), {fontFamily: 'opensans', fontSize: 28, color: '#200000', align: 'center'}).setOrigin(0.5, 0).setAlpha(0.8).setScale(0.98).setDepth(10000);
    PhaserScene.tweens.add({
        targets: levelSelectBG,
        scaleX: 1,
        scaleY: 0.89,
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

    let closeButton = new Button({
        normal: {
            atlas: 'buttons',
            ref: "closebtn.png",
            alpha: 0.95,
            x: gameConsts.width - 66,
            y: levelSelectBG.y - 236,
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
            for (let i in listOfBtns) {
                listOfBtns[i].destroy();
            }
        }
    });
    closeButton.setDepth(this.baseDepth + 10);

    let listOfBtns = [];
    let maxLevel = Math.min(gameVars.latestLevel + 1, 12);
    for (let i = 1; i <= maxLevel; i++) {
        let xPos = gameConsts.halfWidth + ((i - 1) % 4) * 120 - 180;
        let yPos = levelSelectBG.y + Math.floor((i - 1) * 0.25) * 125 - 146;
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
                closeLevelSelectScreen();
                clearMenuButtons();
                beginPreLevel(i);
                blackBG.setAlpha(0);
                title.destroy();
                levelSelectBG.destroy();
                closeButton.destroy();
                for (let i in listOfBtns) {
                    listOfBtns[i].destroy();
                }
            }
        });
        newBtn.setDepth(10000);
        listOfBtns.push(newBtn);
    }

    if (gameVars.latestLevel >= 13) {

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
