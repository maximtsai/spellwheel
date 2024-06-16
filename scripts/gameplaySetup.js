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
    let iconsHeight = gameConsts.height - (isMobile ? 134 : 124);
    loadObjects.version = scene.add.text(4, gameConsts.height - 4, gameVersion).setOrigin(0, 1).setAlpha(0.7);
    loadObjects.loadingSpinner = scene.add.image(gameConsts.halfWidth, iconsHeight, 'loadingSpinner');
    loadObjects.castButton = scene.add.image(gameConsts.halfWidth, iconsHeight, 'castNormal');

    loadObjects.introLocket = scene.add.image(gameConsts.halfWidth, gameConsts.halfHeight - 85, 'introLocket').setScale(0.47).setAlpha(0).setDepth(1001).setOrigin(0.5, 0.75);
    loadObjects.introLocket.currAnim = PhaserScene.tweens.add({
        targets: loadObjects.introLocket,
        alpha: 1,
        scaleX: 0.5,
        scaleY: 0.5,
        ease: 'Cubic.easeOut',
        duration: 1500,
    });

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

        loadObjects.flash = scene.add.image(gameConsts.halfWidth - 30, loadObjects.introLocket.y - 25, 'lowq', 'flash.webp').setScale(0).setRotation(-0.1).setDepth(1002);

        loadObjects.flash.currAnim = scene.tweens.add({
            targets: loadObjects.flash,
            scaleX: 0.85,
            scaleY: 0.85,
            ease: 'Cubic.easeIn',
            duration: 350,
            onComplete: () => {
                loadObjects.flash.currAnim = scene.tweens.add({
                    targets: loadObjects.flash,
                    scaleX: 0,
                    scaleY: 0,
                    ease: 'Cubic.easeOut',
                    rotation: "+=0.1",
                    duration: 700,
                    onComplete: () => {
                        // this.repeatFlash();
                    }
                });
            }
        });
        setTimeout(() => {
            if (!loadObjects.introLocketOpen) {
                let oldX = loadObjects.introLocket.x; let oldY = loadObjects.introLocket.y; let oldScale = loadObjects.introLocket.scaleX;
                loadObjects.introLocket.destroy();
                loadObjects.introLocketOpen = scene.add.image(oldX, oldY, 'ui', 'locket2.png').setScale(oldScale * 1.1).setDepth(1001).setOrigin(0.5, 0.75);
                scene.tweens.add({
                    targets: loadObjects.introLocketOpen,
                    scaleX: oldScale,
                    scaleY: oldScale,
                    ease: 'Back.easeOut',
                    duration: 400
                });
            }
        }, 100)

        loadObjects.fadeBG = scene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setScale(1000).setAlpha(0).setDepth(-5);

        scene.tweens.add({
            targets: loadObjects.fadeBG,
            alpha: 0.65,
            duration: 1100,
        });
        let clickBlocker = createGlobalClickBlocker(true);
        clickBlocker.setOnMouseUpFunc(() => {
            if (!gameVars.runningIntro) {
                // loadObjects.loadingText.visible = false;
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
                }, 150);

            }
        });
        swirlInReaperFog(1.15, 75, 1000);
        scene.tweens.add({
            targets: [loadObjects.loadingText],
            alpha: 0,
            duration: 300,
            onComplete: () => {
                loadObjects.loadingText.setText("START").setScale(1).setPosition(loadObjects.loadingText.x, loadObjects.loadingText.y - 20);
                loadObjects.loadingText.alpha = 1;

                loadObjects.loadingText2 = scene.add.text(loadObjects.loadingText.x, loadObjects.loadingText.y, "START", {fontFamily: 'verdanabold', fontSize: 42, color: '#FFFFFF', align: 'center'}).setDepth(1001);
                loadObjects.loadingText2.setScale(1).setAlign('center').setOrigin(0.5, 0);

                loadObjects.loadingText3 = scene.add.text(loadObjects.loadingText.x, loadObjects.loadingText.y, "START", {fontFamily: 'verdanabold', fontSize: 42, color: '#FFFFFF', align: 'center'}).setDepth(1001);
                loadObjects.loadingText3.setScale(1).setAlign('center').setOrigin(0.5, 0);

                this.animateStart();

                loadObjects.introLocket.currAnim.stop();
                scene.tweens.add({
                    targets: [loadObjects.introLocket],
                    scaleX: 0.55,
                    scaleY: 0.55,
                    y: gameConsts.halfHeight - 55,
                    duration: 600,
                    ease: 'Cubic.easeOut',
                    onComplete: () => {
                    }
                });
            }
        });
    });
}

function animateStart() {
    let newX = loadObjects.loadingText.x - 20 + Math.random() * 40;
    let newY = loadObjects.loadingText.y - 5 + Math.random() * 45;
    loadObjects.loadingText2.alpha = 0.7;
    loadObjects.loadingText2.setPosition(loadObjects.loadingText.x, loadObjects.loadingText.y);
    loadObjects.loadingText2.currAnim = PhaserScene.tweens.add({
        targets: loadObjects.loadingText2,
        alpha: 0,
        x: newX,
        duration: 1500,
        completeDelay: 150,
        onComplete: () => {
            if (!gameVars.runningIntro) {
                this.animateStart();
            }
        }
    });
    PhaserScene.tweens.add({
        targets: loadObjects.loadingText2,
        ease: 'Quad.easeIn',
        y: newY,
        duration: 1500,
    });


    let new3X = loadObjects.loadingText.x - 20 + Math.random() * 40;
    let new3Y = loadObjects.loadingText.y - 5 + Math.random() * 45;
    loadObjects.loadingText3.currAnim = PhaserScene.tweens.add({
        delay: 750,
        targets: loadObjects.loadingText3,
        x: new3X,
        alpha: 0,
        duration: 1500,
        onStart: () => {
            loadObjects.loadingText3.alpha = 0.7;
            loadObjects.loadingText3.setPosition(loadObjects.loadingText.x, loadObjects.loadingText.y);
        }
    });

    PhaserScene.tweens.add({
        delay: 750,
        targets: loadObjects.loadingText3,
        y: new3Y,
        ease: 'Quad.easeIn',
        duration: 1500,
    });
}
let randIntroTexts = ["find her", "I will find you", "my beloved", "searching", "dearest", "bring her back",
    "rescue her", "seek her", "lovely departed", "find", "rescue", "save", "love", "I will be a hero", "triumph", "from the dead", "not yet gone"
    ];
function generateRandIntroText() {
    let randVal = Math.floor(Math.random() * randIntroTexts.length);
    if (randVal == gameVars.lastIntroTextGenerated) {
        randVal = Math.floor(Math.random() * randIntroTexts.length);
    } else if (randVal == gameVars.lastLastIntroTextGenerated) {
        randVal = Math.floor(Math.random() * randIntroTexts.length);
    }
    if (randVal == gameVars.lastIntroTextGenerated) {
        randVal = Math.floor(Math.random() * randIntroTexts.length);
    } else if (randVal == gameVars.lastLastIntroTextGenerated) {
        randVal = Math.floor(Math.random() * randIntroTexts.length);
    }
    gameVars.lastLastIntroTextGenerated = gameVars.lastIntroTextGenerated;
    gameVars.lastIntroTextGenerated = randVal;
    return randIntroTexts[randVal];
}

function recursiveCreateIntroText(delay = 100, num = 180) {
    if (num <= 0 || gameVars.introFinished) {
        return;
    }

    let randX = Math.random() * gameConsts.width;
    let randY = Math.random() * gameConsts.height;
    let numAttempts = 3;
    while (numAttempts > 0) {
        if (Math.abs(randX - gameConsts.halfWidth) < 120) {
            // might be in middle of somethin
            if (randY > gameConsts.height - 150) {
                randX = Math.random() * gameConsts.width;
                randY = Math.random() * gameConsts.height;
            } else {
                numAttempts = 0;
            }
        } else {
            numAttempts = 0;
        }
    }

    let extraAlpha = 0.6 - delay * 0.004;
    let newText = PhaserScene.add.text(randX, randY, generateRandIntroText(), {fontFamily: 'verdanabold', fontSize: 28, color: '#EEEEEE', align: 'center'}).setDepth(100).setAlpha(Math.random() * 0.25 - 0.15).setOrigin(0.5, 0.5).setScale(1 + Math.random() * 1);
    PhaserScene.tweens.add({
        targets: newText,
        alpha: Math.max(0.1, newText.alpha + extraAlpha),
        duration: 400,
        onComplete: () => {
            PhaserScene.tweens.add({
                targets: newText,
                alpha: 0,
                duration: 1200,
                onComplete: () => {

                }
            });
        }
    });
    let randShiftX = 20 * (Math.random() - 0.5)
    let randShiftY = 20 * (Math.random() - 0.5)
    PhaserScene.tweens.add({
        targets: newText,
        scaleX: newText.scaleX * 0.9,
        scaleY: newText.scaleX * 0.9,
        x: "+=" + randShiftX,
        y: "+=" + randShiftY,
        duration: 1600,
    });

    globalObjects.tempIntroText.push(newText)
    let newDelay = Math.ceil(delay * 0.93);
    PhaserScene.time.delayedCall(delay, () => {
        recursiveCreateIntroText(newDelay, num - 1)
    })
}

function clickIntro() {
    clearDeathFog();
    globalObjects.tempIntroText = [];
    recursiveCreateIntroText();
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

    if (loadObjects.loadingText2 && loadObjects.loadingText2.currAnim) {
    loadObjects.loadingText2.currAnim.stop();
    loadObjects.loadingText3.currAnim.stop();
    }
    PhaserScene.tweens.add({
        targets: [loadObjects.loadingText2, loadObjects.loadingText3],
        alpha: 0,
        duration: 500,
        ease: 'Quint.easeOut'
    });


    loadObjects.glowBG = PhaserScene.add.image(loadObjects.introLocket.x, loadObjects.introLocket.y, 'lowq', 'circle.webp').setDepth(2000).setAlpha(0.5).setScale(0);
    loadObjects.glowStar = PhaserScene.add.image(loadObjects.introLocket.x, loadObjects.introLocket.y, 'lowq', 'flashbg.webp').setDepth(1000).setAlpha(0.3).setScale(0.4);
    loadObjects.sharpStar = PhaserScene.add.image(loadObjects.introLocket.x, loadObjects.introLocket.y - 30, 'lowq', 'star_blur_sharp.png').setDepth(1000).setAlpha(0.75).setScale(0.6, 0.05);
    loadObjects.sharpStar2 = PhaserScene.add.image(loadObjects.introLocket.x, loadObjects.introLocket.y - 25, 'lowq', 'star_blur_sharp.png').setDepth(1000).setAlpha(0.75).setScale(0.1, 0.15);

    loadObjects.sharpStar.setRotation(0.01);
    loadObjects.sharpStar2.setRotation(-0.02);
    PhaserScene.tweens.add({
        targets: loadObjects.glowStar,
        alpha: 1,
        scaleX: 2.4,
        scaleY: 2.4,
        duration: 3000,
    });

    PhaserScene.tweens.add({
        targets: loadObjects.sharpStar,
        alpha: 0.9,
        scaleX: 0.9,
        scaleY: 0.15,
        duration: 50,
        rotation: 0.02,
        ease: 'Cubic.easeOut',
        onComplete: () => {
            PhaserScene.tweens.add({
                targets: loadObjects.sharpStar,
                alpha: 0.4,
                scaleX: 0.1,
                scaleY: 0.15,
                duration: 250,
                rotation: 0.03,
                ease: 'Cubic.easeOut',
            });
        }
    });


    PhaserScene.tweens.add({
        targets: loadObjects.sharpStar2,
        alpha: 0.9,
        scaleX: 1.7,
        scaleY: 0.5,
        duration: 200,
        rotation: -0.03,
        ease: 'Cubic.easeOut',
        onComplete: () => {
            PhaserScene.tweens.add({
                targets: loadObjects.sharpStar2,
                alpha: 0.4,
                scaleX: 0.1,
                scaleY: 0.2,
                duration: 550,
                ease: 'Cubic.easeOut',
            });
        }
    });

    PhaserScene.tweens.add({
        delay: 2500,
        targets: loadObjects.glowBG,
        alpha: 1.25,
        scaleX: 14,
        scaleY: 14,
        duration: 500,
        ease: 'Quart.easeIn',
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
    loadObjects.whiteOverall = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'whitePixel').setDepth(2000).setAlpha(0).setScale(1000);
    PhaserScene.tweens.add({
        targets: loadObjects.whiteOverall,
        alpha: 1,
        ease: 'Cubic.easeIn',
        duration: 3200
    });
    PhaserScene.time.delayedCall(2000, () => {
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
    });


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
    setTimeout(() => {
        cleanupIntro();
    }, 0)

}

function cleanupIntro() {
    if (gameVars.introFinished) {
        return;
    }
    gameVars.introFinished = true;
    tempBG = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'whitePixel').setScale(1000).setAlpha(0.85).setDepth(1002);
    PhaserScene.tweens.add({
        targets: tempBG,
        alpha: 0,
        duration: 750,
        onComplete: () => {
            tempBG.destroy();
        }
    });

    hideGlobalClickBlocker();
    for (let i = 0; i < icons.length; i++) {
        icons[i].destroy();
    }

    globalObjects.tempBG.alpha = 0;
    for (let i in loadObjects) {
        loadObjects[i].destroy();
    }
    for (let i in globalObjects.tempIntroText) {
        globalObjects.tempIntroText[i].destroy();
    }
    setupPlayer();
    gotoMainMenu();
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
    // PhaserScene.sound.pauseOnBlur = false;

    createAnimations(PhaserScene);

    globalObjects.gameStats = new GameStats();
    globalObjects.hoverTextManager = new InternalHoverTextManager(PhaserScene);
    globalObjects.textPopupManager = new TextPopupManager(PhaserScene);
    globalObjects.spellManager = new SpellManager(PhaserScene);
    globalObjects.spellRecorder = new SpellRecorder(PhaserScene);
    globalObjects.bannerTextManager = new BannerTextManager(PhaserScene);


    globalObjects.statusManager = new StatusManager(PhaserScene);
    globalObjects.postFightScreen = new PostFightScreen(PhaserScene);
    globalObjects.confirmPopup = new ConfirmPopup(PhaserScene);
    globalObjects.bgHandler = new BgHandler();

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
    MAGIC_CIRCLE_HEIGHT = gameConsts.height - (isMobile ? 134 : 124);
    PhaserScene.tweens.add({
        targets: PhaserScene.cameras.main,
        zoom: 1,
        ease: "Quint.easeInOut",
        duration: 900,
    });
    globalObjects.magicCircle = new MagicCircle(PhaserScene, gameConsts.halfWidth, MAGIC_CIRCLE_HEIGHT);
    globalObjects.player = new Player(PhaserScene, gameConsts.halfWidth, MAGIC_CIRCLE_HEIGHT);
    globalObjects.encyclopedia = new Encyclopedia(PhaserScene, gameConsts.width - 80, 30);
    globalObjects.options = new Options(PhaserScene, gameConsts.width - 35, 30);
}

function onCreditsButtonClicked() {
    globalObjects.creditsText.visible = true;
    playSound('button');
}

// function repeatFlash() {
//     if (gameVars.introFinished) {
//         return;
//     }

//     loadObjects.flash.currAnim = PhaserScene.tweens.add({
//         targets: loadObjects.flash,
//         scaleX: 0.28,
//         scaleY: 0.4,
//         ease: 'Quart.easeIn',
//         duration: 500,
//         onComplete: () => {
//             loadObjects.flash.currAnim = PhaserScene.tweens.add({
//                 targets: loadObjects.flash,
//                 scaleX: 0.1,
//                 scaleY: 0.2,
//                 ease: 'Back.easeOut',
//                 duration: 600,
//                 onComplete: () => {
//                     loadObjects.flash.currAnim = PhaserScene.tweens.add({
//                         targets: loadObjects.flash,
//                         scaleX: 0.18,
//                         scaleY: 0.3,
//                         ease: 'Quart.easeIn',
//                         duration: 550,
//                         onComplete: () => {
//                             loadObjects.flash.currAnim = PhaserScene.tweens.add({
//                                 targets: loadObjects.flash,
//                                 scaleX: 0.1,
//                                 scaleY: 0.2,
//                                 ease: 'Back.easeOut',
//                                 duration: 600,
//                                 onComplete: () => {
//                                     this.repeatFlash();
//                                 }
//                             });
//                         }
//                     });
//                 }
//             });
//         }
//     });
// }
