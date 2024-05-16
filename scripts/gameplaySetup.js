let loadObjects = {};
let castButton;
let loadingIcons = [];
let loadingIconsFlash = [];
let icons = [];
let canFinishLoading = false;
let loadLevel = 0;
let MAGIC_CIRCLE_HEIGHT = 0;
let canvas;

function setupLoadingBar(scene) {
    PhaserScene.cameras.main.setZoom(0.98);
    fadeInBackground('backgroundPreload', 5000, 3.28);

    // Basic loading bar visual
    loadObjects.loadingSpinner = scene.add.image(gameConsts.halfWidth, gameConsts.height - 124, 'loadingSpinner');
    loadObjects.castButton = scene.add.image(gameConsts.halfWidth, gameConsts.height - 124, 'castNormal');

    loadObjects.introLocket = scene.add.image(gameConsts.halfWidth, gameConsts.halfHeight - 100, 'introLocket').setScale(0.47).setAlpha(0).setDepth(1001).setOrigin(0.5, 0.75);
    loadObjects.introLocket.currAnim = PhaserScene.tweens.add({
        targets: loadObjects.introLocket,
        alpha: 1,
        scaleX: 0.5,
        scaleY: 0.5,
        ease: 'Cubic.easeOut',
        duration: 1500,
    });
    let iconsHeight = gameConsts.height - 124;

    icons.push(scene.add.image(gameConsts.halfWidth, iconsHeight, 'runeMatterPre'));
    icons.push(scene.add.image(gameConsts.halfWidth, iconsHeight, 'runeMindPre'));
    icons.push(scene.add.image(gameConsts.halfWidth, iconsHeight, 'runeTimePre'));
    icons.push(scene.add.image(gameConsts.halfWidth, iconsHeight, 'runeVoidPre'));
    icons.push(scene.add.image(gameConsts.halfWidth, iconsHeight, 'runeStrikePre'));
    icons.push(scene.add.image(gameConsts.halfWidth, iconsHeight, 'runeEnhancePre')); // prepare
    icons.push(scene.add.image(gameConsts.halfWidth, iconsHeight, 'runeProtectPre')); // shield
    icons.push(scene.add.image(gameConsts.halfWidth, iconsHeight, 'runeReinforcePre')); // body
    icons.push(scene.add.image(gameConsts.halfWidth, iconsHeight, 'runeUnloadPre')); // ultimate

    let loadIconHeight = gameConsts.halfHeight + 20;
    loadingIcons.push(scene.add.image(gameConsts.halfWidth - 200, loadIconHeight, 'runeMatterPre'));
    loadingIcons.push(scene.add.image(gameConsts.halfWidth - 150, loadIconHeight, 'runeMindPre'));
    loadingIcons.push(scene.add.image(gameConsts.halfWidth - 100, loadIconHeight, 'runeTimePre'));
    loadingIcons.push(scene.add.image(gameConsts.halfWidth - 50, loadIconHeight, 'runeVoidPre'));
    loadingIcons.push(scene.add.image(gameConsts.halfWidth, loadIconHeight, 'runeStrikePre'));
    loadingIcons.push(scene.add.image(gameConsts.halfWidth + 50, loadIconHeight, 'runeEnhancePre')); // prepare
    loadingIcons.push(scene.add.image(gameConsts.halfWidth + 100, loadIconHeight, 'runeProtectPre')); // shield
    loadingIcons.push(scene.add.image(gameConsts.halfWidth + 150, loadIconHeight, 'runeReinforcePre')); // body
    loadingIcons.push(scene.add.image(gameConsts.halfWidth + 200, loadIconHeight, 'runeUnloadPre')); // ultimate


    for (let i = 0; i < loadingIcons.length; i++) {
        let currIcon = loadingIcons[i];
        let newFlashImage = scene.add.image(currIcon.x, currIcon.y, currIcon.texture.key);
        loadingIconsFlash.push(newFlashImage)
        // icons[i].visible = false;
        // icons[i].setScale(0);
        currIcon.setOrigin(0.5, 0.123);
        newFlashImage.setOrigin(0.5, 0.123);
        newFlashImage.alpha = 0;
        currIcon.alpha = 0;
    }

    for (let i = 0; i < icons.length; i++) {
        // icons[i].visible = false;
        // icons[i].setScale(0);
        icons[i].alpha = 0;
        icons[i].setDepth(201);
        icons[i].setOrigin(0.5, 0.85);
        icons[i].setScale(1.25, 1.75);
        icons[i].rotation = (i / icons.length) * Math.PI * 2;
        icons[i].startRotation = icons[i].rotation;
    }



    loadObjects.loadingText = scene.add.text(gameConsts.halfWidth, gameConsts.halfHeight + 60, 'LOADING...', {fontFamily: 'verdanabold', fontSize: 42, color: '#FFFFFF', align: 'center'}).setDepth(1001);
    loadObjects.loadingText.setScale(0.6);
    loadObjects.loadingText.setAlign('center');
    loadObjects.loadingText.setOrigin(0.5, 0);

    loadObjects.loadingSpinner.setDepth(200);
    loadObjects.castButton.setDepth(200);

    // Setup loading bar logic
    scene.load.on('progress', function (value) {
        while (loadLevel <= value * 8.5) {
            loadObjects.loadingSpinner.goalRot = loadLevel * -Math.PI/4.5;//value * Math.PI * -1;
            let iconToEdit = icons[loadLevel];
            let loadingIconToEdit = loadingIcons[loadLevel];
            let loadingIconFlashToEdit = loadingIconsFlash[loadLevel];

            PhaserScene.tweens.add({
                targets: iconToEdit,
                alpha: 1,
                ease: 'Quint.easeOut',
                duration: 200,
            });
            PhaserScene.tweens.add({
                targets: iconToEdit,
                ease: 'Cubic.easeOut',
                scaleX: 1,
                scaleY: 1,
                duration: 250,
            });
            loadingIconToEdit.alpha = 1;
            loadingIconToEdit.setScale(0.75);
            loadingIconFlashToEdit.alpha = 1;
            PhaserScene.tweens.add({
                targets: loadingIconToEdit,
                ease: 'Back.easeOut',
                scaleX: 1,
                scaleY: 1,
                duration: 200,
            });
            PhaserScene.tweens.add({
                targets: loadingIconFlashToEdit,
                ease: 'Cubic.easeOut',
                scaleX: 2.2,
                scaleY: 2.2,
                duration: 500,
            });
            PhaserScene.tweens.add({
                targets: loadingIconFlashToEdit,
                ease: 'Quad.easeOut',
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    if (loadingIconFlashToEdit) {
                        loadingIconFlashToEdit.destroy();
                    }
                }
            });
            switch(loadLevel) {
                case 1:
                    loadObjects.loadingText.setText('LOADED\nMIND RUNE');
                    break;
                case 2:
                    loadObjects.loadingText.setText('LOADED\nTIME RUNE');
                    break;
                case 3:
                    loadObjects.loadingText.setText('LOADED\nVOID RUNE');
                    break;
                case 4:
                    loadObjects.loadingText.setText('LOADED\nSTRIKE RUNE');
                    break;
                case 5:
                    loadObjects.loadingText.setText('LOADED\nENHANCE RUNE');
                    break;
                case 6:
                    loadObjects.loadingText.setText('LOADED\nSHIELD RUNE');
                    break;
                case 7:
                    loadObjects.loadingText.setText('LOADED\nBODY RUNE');
                    break;
                case 8:
                    loadObjects.loadingText.setText('LOADED\nULTIMATE RUNE');
                    break;
                case 9:
                    loadObjects.loadingText.setText('LOADING\nPRECIOUS MEMORIES');
                    break;
            }

            loadLevel++;
        }
    });
    scene.load.on('complete', () => {
                onLoadComplete(scene);
        loadObjects.loadingText.setText('LOADING\nPRECIOUS MEMORIES');
        for (let i = 0; i < loadingIcons.length; i++) {
            let loadIcon = loadingIcons[i];
            scene.tweens.add({
                targets: loadIcon,
                alpha: 0,
                x: gameConsts.halfWidth * 0.5 + loadIcon.x * 0.5,
                y: gameConsts.height * 0.75,
                duration: 800,
                ease: 'Cubic.easeInOut',
                onComplete: () => {
                    loadIcon.destroy();
                }
            });
        }

        loadObjects.flash = scene.add.image(gameConsts.halfWidth, -10, 'lowq', 'flash.webp').setScale(0).setRotation(-0.2).setDepth(1002);

        loadObjects.flash.currAnim = scene.tweens.add({
            targets: loadObjects.flash,
            delay: 10,
            scaleX: 0.85,
            scaleY: 0.85,
            ease: 'Cubic.easeIn',
            duration: 400,
            onComplete: () => {
                loadObjects.flash.currAnim = scene.tweens.add({
                    targets: loadObjects.flash,
                    scaleX: 0.1,
                    scaleY: 0.2,
                    ease: 'Back.easeOut',
                    duration: 400,
                    completeDelay: 200,
                    onComplete: () => {
                        this.repeatFlash();
                    }
                });
            }
        });
        scene.tweens.add({
            targets: loadObjects.flash,
            y: gameConsts.halfHeight - 85,
            rotation: "+=1.78",
            duration: 4000,
            ease: 'Quad.easeOut',
            onComplete: () => {
                if (!loadObjects.introLocketOpen) {
                    loadObjects.flash.currAnim.stop()
                    loadObjects.flash.setScale(loadObjects.flash.scaleX * 1.25, loadObjects.flash.scaleY * 1.25);
                    loadObjects.flash.currAnim = scene.tweens.add({
                        targets: loadObjects.flash,
                        scaleX: 0,
                        scaleY: 0,
                        alpha: 0,
                        ease: 'Quad.easeOut',
                        duration: 400,
                    });
                    let oldX = loadObjects.introLocket.x; let oldY = loadObjects.introLocket.y; let oldScale = loadObjects.introLocket.scaleX;
                    loadObjects.introLocket.destroy();
                    loadObjects.introLocketOpen = scene.add.image(oldX, oldY, 'ui', 'locket2.png').setScale(oldScale * 1.05).setDepth(1001).setOrigin(0.5, 0.75);
                    scene.tweens.add({
                        targets: loadObjects.introLocketOpen,
                        scaleX: oldScale,
                        scaleY: oldScale,
                        ease: 'Back.easeOut',
                        duration: 400
                    });
                }
            }
        });

        loadObjects.fadeBG = scene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setScale(1000).setAlpha(0).setDepth(1000);

        scene.tweens.add({
            targets: loadObjects.fadeBG,
            alpha: 0.65,
            duration: 1100,
        });
        scene.tweens.add({
            targets: [loadObjects.loadingText],
            alpha: 0,
            duration: 300,
            onComplete: () => {
                loadObjects.loadingText.setText("START").setScale(1).setPosition(loadObjects.loadingText.x, loadObjects.loadingText.y - 20);
                loadObjects.loadingText.alpha = 1;
                let clickBlocker = createGlobalClickBlocker(true);
                clickBlocker.setOnMouseUpFunc(() => {
                    if (!gameVars.runningIntro) {
                        this.clickIntro();
                        // this.cleanupIntro(scene);
                        setTimeout(() => {
                            scene.tweens.add({
                                targets: loadObjects.skipIntroText,
                                alpha: 0.5,
                                duration: 1250,
                            });
                        

                            clickBlocker.setOnMouseUpFunc(() => {
                                this.skipIntro();
                            })
                        }, 100);

                    }
                })
                loadObjects.introLocket.currAnim.stop();
                scene.tweens.add({
                    targets: [loadObjects.introLocket],
                    scaleX: 0.55,
                    scaleY: 0.55,
                    y: gameConsts.halfHeight - 68,
                    duration: 600,
                    ease: 'Cubic.easeOut',
                    onComplete: () => {
                        // cleanupIntro(scene)

                    }
                });
            }
        });


    });
}

function clickIntro() {
    gameVars.runningIntro = true;
     loadObjects.flash.currAnim.stop();
    loadObjects.introLocket.destroy();
    loadObjects.flash.currAnim = PhaserScene.tweens.add({
        targets: loadObjects.flash,
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
        y: Math.min(loadObjects.flash.y + 70, gameConsts.halfHeight - 85),
        ease: 'Quad.easeOut',
        duration: 400,
    });
    loadObjects.whiteBG = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'whitePixel').setScale(1000).setAlpha(0).setDepth(1002);
    PhaserScene.tweens.add({
        targets: loadObjects.whiteBG,
        alpha: 1,
        duration: 3500,
        ease: 'Cubic.easeIn',
        onComplete: () => {
            cleanupIntro(PhaserScene);
        }
    });
    loadObjects.skipIntroText = PhaserScene.add.text(gameConsts.width - 5, gameConsts.height - 5, 'CLICK TO SKIP', {fontFamily: 'verdana', fontSize: 18, color: '#FFFFFF', align: 'right'}).setDepth(1005).setAlpha(0).setOrigin(1, 1);
    loadObjects.loadingText.setText("I will find you\n ").setAlpha(0.2).setScale(0.75).y -= 18;
    PhaserScene.tweens.add({
        targets: loadObjects.loadingText,
        alpha: 1,
        ease: 'Quad.easeOut',
        duration: 500
    });
    setTimeout(() => {
        if (!gameVars.introFinished) {
            loadObjects.loadingText2 = PhaserScene.add.text(gameConsts.halfWidth, loadObjects.loadingText.y + 40, 'my beloved', {fontFamily: 'verdanabold', fontSize: 42, color: '#FFFFFF', align: 'center'}).setDepth(1001);
            loadObjects.loadingText2.setScale(loadObjects.loadingText.scaleX).setAlpha(0);
            loadObjects.loadingText2.setAlign('center');
            loadObjects.loadingText2.setOrigin(0.5, 0);
            PhaserScene.tweens.add({
                targets: loadObjects.loadingText2,
                alpha: 1,
                duration: 1000,
            });
        }
    }, 2000)


    if (!loadObjects.introLocketOpen) {
         loadObjects.introLocketOpen = PhaserScene.add.image(loadObjects.introLocket.x, loadObjects.introLocket.y, 'ui', 'locket3.png').setDepth(1001).setOrigin(0.5, 0.75);
    } else {
        loadObjects.introLocketOpen.setFrame('locket3.png').setOrigin(0.5, 0.75);
    }
    let oldScale = 0.55;
    loadObjects.introLocketOpen.setScale(oldScale * 1.05);
    PhaserScene.tweens.add({
        targets: loadObjects.introLocketOpen,
        scaleX: 0.65,
        scaleY: 0.65,
         y: gameConsts.halfHeight - 50,
        ease: 'Cubic.easeOut',
        duration: 1000
    });
}

function skipIntro() {
    tempBG = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'whitePixel').setScale(1000).setAlpha(0.5).setDepth(1002);
    PhaserScene.tweens.add({
        targets: tempBG,
        alpha: 0,
        ease: 'Cubic.easeOut',
        duration: 1000
    });
    setTimeout(() => {
        cleanupIntro();
    }, 0)

}

function cleanupIntro() {
    if (gameVars.introFinished) {
        return;
    }
    gameVars.introFinished = true;

    hideGlobalClickBlocker();
    for (let i = 0; i < icons.length; i++) {
        icons[i].destroy();
    }

    globalObjects.tempBG.destroy();
    for (let i in loadObjects) {
        loadObjects[i].destroy();
    }
    setupPlayer();
    gotoMainMenu();
}

function createGlobalClickBlocker(showPointer) {
    if (!globalObjects.clickBlocker) {
        globalObjects.clickBlocker = new Button({
             normal: {
                 ref: "blackPixel",
                 x: gameConsts.halfWidth,
                 y: gameConsts.halfHeight,
                 alpha: 0.001,
                 scaleX: 1000,
                 scaleY: 1000
             },
             onMouseUp: () => {

             }
         });
    } else {
        globalObjects.clickBlocker.setState(NORMAL);
        globalObjects.clickBlocker.setOnMouseUpFunc(() => {});
        buttonManager.bringButtonToTop(globalObjects.clickBlocker);
    }
    if (showPointer && canvas) {
        canvas.style.cursor = 'pointer';
    }
    return globalObjects.clickBlocker;
}

function hideGlobalClickBlocker() {
    globalObjects.clickBlocker.setState(DISABLE);
    if (canvas) {
        canvas.style.cursor = 'default';
    }
}

function resetGame() {
    for (let i in globalObjects) {
        globalObjects[i].destroy();
    }
}

function setupGame() {
    canvas = game.canvas;
    if (gameVars.started) {
        return;
    }

    gameVars.started = true;
    PhaserScene.sound.pauseOnBlur = false;

    createAnimations(PhaserScene);

    globalObjects.gameStats = new GameStats();
    globalObjects.hoverTextManager = new InternalHoverTextManager(PhaserScene);
    globalObjects.textPopupManager = new TextPopupManager(PhaserScene);
    globalObjects.spellManager = new SpellManager(PhaserScene);
    globalObjects.spellRecorder = new SpellRecorder(PhaserScene);
    globalObjects.bannerTextManager = new BannerTextManager(PhaserScene);


    globalObjects.statusManager = new StatusManager(PhaserScene);
    globalObjects.postFightScreen = new PostFightScreen(PhaserScene);

    // globalObjects.dummyEnemy = new Wall(PhaserScene, gameConsts.halfWidth, 165);
    // globalObjects.dummyEnemy = new Death(PhaserScene, gameConsts.halfWidth, 173);
    //globalObjects.dummyEnemy = new Goblin(PhaserScene, gameConsts.halfWidth, 173);


    // globalObjects.optionsButton = new Button(
    // {
    //     normal: {
    //         "ref": "optionsNormal",
    //         "x": gameConsts.width - 55,
    //         "y": gameConsts.height - 22
    //     },
    //     hover: {
    //         "ref": "optionsHover"
    //     },
    //     press: {
    //         "ref": "optionsPress"
    //     },
    //     onMouseUp: () => {
    //
    //     }
    // });
    // globalObjects.optionsButton.setDepth(20);


    // globalObjects.interestManager = new InterestManager();
    // updateManager.addFunction(globalObjects.interestManager.update);
}

function setupPlayer() {
    MAGIC_CIRCLE_HEIGHT = gameConsts.height - 124;
    PhaserScene.tweens.add({
        targets: PhaserScene.cameras.main,
        zoom: 1,
        ease: "Quint.easeInOut",
        duration: 900,
    });
    globalObjects.magicCircle = new MagicCircle(PhaserScene, gameConsts.halfWidth, MAGIC_CIRCLE_HEIGHT);
    globalObjects.player = new Player(PhaserScene, gameConsts.halfWidth, MAGIC_CIRCLE_HEIGHT);
}

function onCreditsButtonClicked() {
    globalObjects.creditsText.visible = true;
    playSound('button');
}

function repeatFlash() {
    if (gameVars.introFinished) {
        return;
    }

    loadObjects.flash.currAnim = PhaserScene.tweens.add({
        targets: loadObjects.flash,
        scaleX: 0.28,
        scaleY: 0.4,
        ease: 'Quart.easeIn',
        duration: 500,
        onComplete: () => {
            loadObjects.flash.currAnim = PhaserScene.tweens.add({
                targets: loadObjects.flash,
                scaleX: 0.1,
                scaleY: 0.2,
                ease: 'Back.easeOut',
                duration: 600,
                onComplete: () => {
                    loadObjects.flash.currAnim = PhaserScene.tweens.add({
                        targets: loadObjects.flash,
                        scaleX: 0.18,
                        scaleY: 0.3,
                        ease: 'Quart.easeIn',
                        duration: 550,
                        onComplete: () => {
                            loadObjects.flash.currAnim = PhaserScene.tweens.add({
                                targets: loadObjects.flash,
                                scaleX: 0.1,
                                scaleY: 0.2,
                                ease: 'Back.easeOut',
                                duration: 600,
                                onComplete: () => {
                                    this.repeatFlash();
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}