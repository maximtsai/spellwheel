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
    // fadeInBackground('backgroundPreload', 5000, 3.28);

    // Basic loading bar visual
    let iconsHeight = gameConsts.height - (isMobile ? 134 : 124);
    loadObjects.version = scene.add.text(4, gameConsts.height - 4, gameVersion).setOrigin(0, 1).setAlpha(0.7);
    loadObjects.loadingSpinner = scene.add.image(gameConsts.halfWidth, iconsHeight, 'loadingSpinner');
    loadObjects.castButton = scene.add.image(gameConsts.halfWidth, iconsHeight, 'castNormal');
    loadObjects.castButton.scrollFactorX = 0.35; loadObjects.castButton.scrollFactorY = 0.35;
    loadObjects.loadingSpinner.scrollFactorX = 0.35; loadObjects.loadingSpinner.scrollFactorY = 0.35;
    loadObjects.version.scrollFactorX = 0; loadObjects.version.scrollFactorY = 0;

    loadObjects.introLocket = scene.add.image(gameConsts.halfWidth, gameConsts.halfHeight - 115, 'introLocket').setScale(0.75).setAlpha(0).setDepth(1001).setOrigin(0.5, 0.65);
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
        currIcon.setOrigin(0.5, 0.123);
        newFlashImage.setOrigin(0.5, 0.123);
        newFlashImage.alpha = 0;
        currIcon.alpha = 0;
    }

    for (let i = 0; i < icons.length; i++) {
        // icons[i].visible = false;
        icons[i].alpha = 0;
        icons[i].setDepth(201);
        icons[i].setOrigin(0.5, 0.85);
        icons[i].setScale(1.25, 1.75);
        icons[i].rotation = (i / icons.length) * Math.PI * 2;
        icons[i].startRotation = icons[i].rotation;
        icons[i].scrollFactorX = 0.3; icons[i].scrollFactorY = 0.3;
    }

    loadObjects.loadingText = scene.add.text(gameConsts.halfWidth, gameConsts.height - (isMobile ? 345 : 332), 'LOADING...', {fontFamily: 'germania', fontSize: 42, color: '#FFFFFF', align: 'center'}).setDepth(1001);
    loadObjects.loadingText.setScale(0.6);
    loadObjects.loadingText.setAlign('center');
    loadObjects.loadingText.setOrigin(0.5, 0);
    loadObjects.loadingText.scrollFactorX = 0.3; loadObjects.loadingText.scrollFactorY = 0.3;

    loadObjects.loadingSpinner.setDepth(200);
    loadObjects.castButton.setDepth(200);

    // Setup loading bar logic
    scene.load.on('progress', function (value) {
        while (loadLevel <= value * 8.85) {
            loadObjects.loadingSpinner.goalRot = loadLevel * -Math.PI/4.5;//value * Math.PI * -1;
            let iconToEdit = icons[loadLevel];
            let loadingIconToEdit = loadingIcons[loadLevel];
            let loadingIconFlashToEdit = loadingIconsFlash[loadLevel];

            PhaserScene.tweens.add({
                targets: iconToEdit,
                alpha: 1,
                ease: 'Quint.easeOut',
                duration: 200,
                onComplete: () => {
                    PhaserScene.tweens.add({
                        targets: iconToEdit,
                        alpha: 0.8,
                        ease: 'Quint.easeInOut',
                        duration: 300,
                    });
                }
            });
            PhaserScene.tweens.add({
                targets: iconToEdit,
                ease: 'Cubic.easeOut',
                scaleX: 1,
                scaleY: 1,
                duration: 250,
            });
            loadingIconToEdit.alpha = 1.05;
            loadingIconToEdit.setScale(0.75);
            loadingIconFlashToEdit.alpha = 1;
            PhaserScene.tweens.add({
                targets: loadingIconToEdit,
                ease: 'Back.easeOut',
                scaleX: 1,
                scaleY: 1,
                alpha: 0.98,
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
                    loadObjects.loadingText.setText('LOADING\nFINAL ASSETS...');
                    break;
                case 9:
                    loadObjects.loadingText.setText('LOADING\nFINAL ASSETS...');
                    break;
            }

            loadLevel++;
        }
    });
    scene.load.on('complete', () => {
        onLoadComplete(scene);

        updateManager.addFunction(tempLoadFinFunc);
        loadObjects.loadingText.setText('RECALLING\nPRECIOUS MEMORIES');
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
        loadObjects.gloom = scene.add.image(gameConsts.halfWidth, loadObjects.introLocket.y, 'blurry', 'gloom.webp').setScale(5).setBlendMode(Phaser.BlendModes.MULTIPLY).setDepth(201).setAlpha(0);
        scene.tweens.add({
            targets: loadObjects.gloom,
            alpha: 0.3,
            duration: 800,
        });
        loadObjects.flash = scene.add.image(gameConsts.halfWidth - 30, loadObjects.introLocket.y - 25, 'blurry', 'flash.webp').setScale(0).setRotation(-0.1).setDepth(1002);

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
                let oldX = loadObjects.introLocket.x; let oldY = loadObjects.introLocket.y;
                loadObjects.introLocket.destroy();
                loadObjects.introLocketOpen = scene.add.image(oldX, oldY, 'misc', 'locket2.png').setScale(0.83).setDepth(1001).setOrigin(0.5, 0.65);
                loadObjects.introLocketOpen.scrollFactorX = 0; loadObjects.introLocketOpen.scrollFactorY = 0;
                scene.tweens.add({
                    targets: loadObjects.introLocketOpen,
                    scaleX: 0.75,
                    scaleY: 0.75,
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
        if (gameOptions.skipIntro && !gameOptions.isFirstTime && !gameVars.runningIntro) {
            gameOptions.skipIntroFull = true;
            this.clickIntro();
        }
        scene.tweens.add({
            targets: [loadObjects.loadingText],
            alpha: 0,
            duration: 300,
            onComplete: () => {
                if (gameOptions.skipIntroFull) {
                    return;
                }
                loadObjects.loadingText.setText(getLangText('start')).setScale(1).setPosition(loadObjects.loadingText.x, loadObjects.loadingText.y - 20);
                loadObjects.loadingText.alpha = 1;

                loadObjects.loadingText2 = scene.add.text(loadObjects.loadingText.x, loadObjects.loadingText.y, getLangText('start'), {fontFamily: 'germania', fontSize: 42, color: '#FFFFFF', align: 'center'}).setDepth(1001);
                loadObjects.loadingText2.setScale(1).setAlign('center').setOrigin(0.5, 0);

                loadObjects.loadingText3 = scene.add.text(loadObjects.loadingText.x, loadObjects.loadingText.y, getLangText('start'), {fontFamily: 'germania', fontSize: 42, color: '#FFFFFF', align: 'center'}).setDepth(1001);
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

function tempLoadFinFunc() {
    let goalX = (gameVars.mouseposx - gameConsts.halfWidth) * 0.024;
    let goalY = (gameVars.mouseposy - gameConsts.halfHeight) * 0.01;
    PhaserScene.cameras.main.scrollX = goalX * 0.08 + PhaserScene.cameras.main.scrollX * 0.92;
    PhaserScene.cameras.main.scrollY = goalY * 0.08 + PhaserScene.cameras.main.scrollY * 0.92;

    if (loadObjects.introLocketOpen) {
        if (PhaserScene.cameras.main.scrollX < 0) {
            loadObjects.introLocketOpen.rotation = -Math.sqrt(PhaserScene.cameras.main.scrollX * -0.1) * 0.015;

        } else {
            loadObjects.introLocketOpen.rotation = Math.sqrt(PhaserScene.cameras.main.scrollX * 0.1) * 0.015;

        }

    }
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
// let randIntroTexts = ["find her", "I will find you", "my beloved", "searching", "dearest", "bring her back",
//     "rescue her", "seek her", "lovely departed", "find", "rescue", "save", "love", "I will be a hero", "triumph", "from the dead", "not yet gone"
//     ];
// function generateRandIntroText() {
//     let randVal = Math.floor(Math.random() * randIntroTexts.length);
//     if (randVal == gameVars.lastIntroTextGenerated) {
//         randVal = Math.floor(Math.random() * randIntroTexts.length);
//     } else if (randVal == gameVars.lastLastIntroTextGenerated) {
//         randVal = Math.floor(Math.random() * randIntroTexts.length);
//     }
//     if (randVal == gameVars.lastIntroTextGenerated) {
//         randVal = Math.floor(Math.random() * randIntroTexts.length);
//     } else if (randVal == gameVars.lastLastIntroTextGenerated) {
//         randVal = Math.floor(Math.random() * randIntroTexts.length);
//     }
//     gameVars.lastLastIntroTextGenerated = gameVars.lastIntroTextGenerated;
//     gameVars.lastIntroTextGenerated = randVal;
//     return randIntroTexts[randVal];
// }

function recursiveCreateIntroText(delay = 150, num = 180) {
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

    let extraAlpha = 0.6 - delay * 0.0038;
    let newText = PhaserScene.add.text(randX, randY, generateRandIntroText(), {fontFamily: 'germania', fontSize: 28, color: '#EEEEEE', align: 'center'}).setDepth(100).setAlpha(Math.random() * 0.25 - 0.15).setOrigin(0.5, 0.5).setScale(1 + Math.random() * 1);
    PhaserScene.tweens.add({
        targets: newText,
        alpha: Math.max(0.1, newText.alpha + extraAlpha),
        duration: 400,
        onComplete: () => {
            PhaserScene.tweens.add({
                delay: 100,
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
    let newDelay = Math.ceil(delay * 0.85 + 1);
    PhaserScene.time.delayedCall(delay, () => {
        recursiveCreateIntroText(newDelay, num - 1)
    })
}

function clickIntro() {
    clearDeathFog();
    playSound('locket_open', 0.7);
    playSound('water_drop', 0.16);
    globalObjects.tempIntroText = [];
    // recursiveCreateIntroText();
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
    updateManager.removeFunction(tempLoadFinFunc);
    PhaserScene.tweens.add({
        targets: PhaserScene.cameras.main,
        scrollX: 0,
        scrollY: 0,
        duration: 750,
        ease: 'Cubic.easeOut'
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

    loadObjects.glowBG = PhaserScene.add.image(loadObjects.introLocket.x, loadObjects.introLocket.y, 'blurry', 'circle.webp').setDepth(2000).setAlpha(0.5).setScale(0);
    loadObjects.glowStar = PhaserScene.add.image(loadObjects.introLocket.x, loadObjects.introLocket.y - 50, 'blurry', 'flash_bg.webp').setDepth(1000).setAlpha(0.5).setScale(0.3);
    loadObjects.sharpStar = PhaserScene.add.image(loadObjects.introLocket.x, loadObjects.introLocket.y - 53, 'blurry', 'star_blur_sharp.png').setDepth(1000).setAlpha(0.75).setScale(0.6, 0.05);
    loadObjects.sharpStar2 = PhaserScene.add.image(loadObjects.introLocket.x, loadObjects.introLocket.y - 48, 'blurry', 'star_blur_sharp.png').setDepth(1000).setAlpha(0.75).setScale(0.1, 0.15);

    loadObjects.sharpStar.setRotation(0.01);
    loadObjects.sharpStar2.setRotation(-0.02);

    PhaserScene.tweens.add({
        targets: loadObjects.glowStar,
        alpha: 1.05,
        scaleX: 1.45,
        scaleY: 1.45,
        ease: 'Quad.easeIn',
        duration: 300,
        onComplete: () => {
            PhaserScene.tweens.add({
                targets: loadObjects.glowStar,
                alpha: 0.6,
                scaleX: 0.7,
                scaleY: 0.7,
                ease: 'Cubic.easeOut',
                duration: 150,
                onComplete: () => {
                    PhaserScene.tweens.add({
                        targets: loadObjects.glowStar,
                        alpha: 1.1,
                        scaleX: 3.7,
                        scaleY: 3.7,
                        ease: 'Quart.easeIn',
                        duration: 1500,
                        onComplete: () => {

                        }
                    });
                }
            });
        }
    });

    PhaserScene.tweens.add({
        targets: loadObjects.sharpStar,
        alpha: 0.9,
        scaleX: 1.1,
        scaleY: 0.18,
        duration: 50,
        rotation: 0.02,
        ease: 'Cubic.easeOut',
        onComplete: () => {
            PhaserScene.tweens.add({
                targets: loadObjects.sharpStar,
                alpha: 0.4,
                scaleX: 0.12,
                scaleY: 0.18,
                duration: 250,
                rotation: 0.03,
                ease: 'Cubic.easeOut',
            });
        }
    });


    PhaserScene.tweens.add({
        targets: loadObjects.sharpStar2,
        alpha: 0.9,
        scaleX: 1.95,
        scaleY: 0.58,
        duration: 200,
        rotation: -0.03,
        ease: 'Cubic.easeOut',
        onComplete: () => {
            PhaserScene.tweens.add({
                targets: loadObjects.sharpStar2,
                alpha: 0.4,
                scaleX: 0.12,
                scaleY: 0.24,
                duration: 550,
                ease: 'Cubic.easeOut',
            });
        }
    });

    if (gameOptions.skipIntroFull) {
        loadObjects.glowBG.alpha = 0;
        PhaserScene.tweens.add({
            targets: loadObjects.glowBG,
            alpha: 1,
            duration: 900,
            ease: 'Quart.easeIn',
            onComplete: () => {
                this.skipIntro();
            }
        });
        loadObjects.glowBG.setScale(14);

    } else {
        PhaserScene.tweens.add({
            delay: 1500,
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
    }

    loadObjects.skipIntroText = PhaserScene.add.text(gameConsts.width - 5, gameConsts.height - 5, getLangText('click_to_skip'), {fontFamily: 'verdana', fontSize: 18, color: '#FFFFFF', align: 'right'}).setDepth(1005).setAlpha(0).setOrigin(1, 1);
    loadObjects.loadingText.setText(" ").setAlpha(0).setScale(0.75).y -= 18;
    loadObjects.whiteOverall = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'whitePixel').setDepth(2000).setAlpha(0).setScale(1000);
    PhaserScene.tweens.add({
        targets: loadObjects.whiteOverall,
        alpha: 1,
        ease: 'Cubic.easeIn',
        duration: 2100
    });
    PhaserScene.time.delayedCall(1800, () => {
        if (!gameVars.introFinished) {
            loadObjects.loadingText.setAlpha(0).setText(getLangText('find_you')).setAlign('center');
            PhaserScene.tweens.add({
                targets: loadObjects.loadingText,
                alpha: 1,
                ease: 'Quad.easeIn',
                duration: 500,
            });
        }
    });


    if (!loadObjects.introLocketOpen) {
         loadObjects.introLocketOpen = PhaserScene.add.image(loadObjects.introLocket.x, loadObjects.introLocket.y, 'misc', 'locket3.png').setDepth(1001).setOrigin(0.5, 0.65);
        loadObjects.introLocketOpen.scrollFactorX = 0; loadObjects.introLocketOpen.scrollFactorY = 0;
    } else {
        loadObjects.introLocketOpen.setFrame('locket3.png').setOrigin(0.5, 0.65);
    }

    loadObjects.introLocketOpen.setScale(0.8);
    loadObjects.introLocketOpenBg = PhaserScene.add.image(loadObjects.introLocketOpen.x, loadObjects.introLocketOpen.y, 'misc', 'locket2.png');
    loadObjects.introLocketOpenBg.setDepth(loadObjects.introLocketOpen.depth - 1).setOrigin(0.5, 0.65).setScale(0.8);
    loadObjects.introLocketOpenBg.scrollFactorX = 0; loadObjects.introLocketOpenBg.scrollFactorY = 0;
    PhaserScene.tweens.add({
        targets: [loadObjects.introLocketOpenBg],
        alpha: 0,
        duration: 300
    });
    PhaserScene.tweens.add({
        targets: [loadObjects.introLocketOpen, loadObjects.introLocketOpenBg],
        rotation: 0,
        scrollY: 0,
        ease: 'Cubic.easeOut',
        duration: 750,
        onComplete: () => {
            playSound('whoosh')
        }
    });
    PhaserScene.tweens.add({
        targets: [loadObjects.introLocketOpen, loadObjects.introLocketOpenBg],
        scaleX: 0.75,
        scaleY: 0.75,
         y: gameConsts.halfHeight - 100,
        ease: 'Cubic.easeOut',
        duration: 1000
    });
}

function skipIntro() {
    gameVars.introSkipped = true;
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
    if (gameVars.introSkipped) {
        gotoMainMenu();
    } else {

        globalObjects.magicCircle.disableMovement();
        gotoMainMenuNoButtons();
        showLocket();
        globalObjects.encyclopedia.hideButton();
        globalObjects.options.hideButton();
    }
    handleGlobalKeyPresses();
}

function locketFlash() {
    let goalX = (gameVars.mouseposx - gameConsts.halfWidth) * 0.02;
    let goalY = (gameVars.mouseposy - gameConsts.height) * 0.0003;

    let scaleDiff = 0;
    scaleDiff = Math.sqrt(Math.abs(goalX)) * 0.015;
    if (goalX < 0) {
        scaleDiff = -scaleDiff;
    }
    if (goalY < 0) {
        globalObjects.gameLocketOpen.scaleY = 0.95 - goalY * goalY;
    } else {
        globalObjects.gameLocketOpen.scaleY = 0.95;
    }
    let locketGoalX = (gameConsts.halfWidth - scaleDiff * 400) * 0.2 + globalObjects.gameLocketOpen.x * 0.8;
    if (globalObjects.gameLocketOpen.shakey) {
        globalObjects.gameLocketOpen.x = locketGoalX * 0.2 + globalObjects.gameLocketOpen.x * 0.8 + (Math.random() - 0.5) * 2.5 ;
        globalObjects.gameLocketOpen.y = globalObjects.gameLocketOpen.origY * 0.2 + globalObjects.gameLocketOpen.y * 0.8 + (Math.random() - 0.5);
    } else {
        globalObjects.gameLocketOpen.x = locketGoalX;
    }

    globalObjects.gameLocketOpen.rotation = (-scaleDiff + goalY * 0.5) * 0.05 + globalObjects.gameLocketOpen.rotation * 0.95;
    globalObjects.gameLocketOpenLight.rotation = globalObjects.gameLocketOpen.rotation;
    globalObjects.gameLocketOpenLight.alpha = -globalObjects.gameLocketOpenLight.rotation * 12 - 0.1 - goalY * 1.18;
    globalObjects.gameLocketOpenLight.x = globalObjects.gameLocketOpen.x;
    globalObjects.gameLocketOpenLight.scaleY = globalObjects.gameLocketOpen.scaleY;
}

function showLocket() {
    globalObjects.gameLocketOpen = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight - 119, 'misc', 'locket3.png').setScale(0.8).setDepth(100003);
    globalObjects.gameLocketOpenLight = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight - 119, 'misc', 'locketwhite.png').setScale(0.8).setDepth(100003).setAlpha(0);
    let closeText = PhaserScene.add.text(gameConsts.halfWidth, gameConsts.halfHeight + 160, 'Put away locket', {fontFamily: 'garamondmax', fontSize: 32, color: '#FFFFFF', align: 'center'}).setDepth(100003).setOrigin(0.5, 0).setAlpha(0);
    PhaserScene.tweens.add({
        targets: [globalObjects.gameLocketOpen, globalObjects.gameLocketOpenLight],
        y: "+=25",
        ease: 'Quint.easeOut',
        scaleX: 0.95, scaleY: 0.95,
        duration: 700,
        onComplete: () => {
            updateManager.addFunction(locketFlash);

            closeText.currAnim = PhaserScene.tweens.add({
                targets: closeText,
                alpha: 0.9,
                duration: 1000,
            });
        }
    });
    globalObjects.bannerTextManager.setDialog([getLangText('beginLocket1')]);
    globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.height + 230, 0);
    globalObjects.bannerTextManager.showBanner(0.75);
    globalObjects.bannerTextManager.setOnFinishFunc(() => {
        updateManager.removeFunction(locketFlash);
        globalObjects.gameLocketOpenLight.destroy();
        playSound('locket_close');
        if (closeText.currAnim) {
            closeText.currAnim.stop();
        }
        PhaserScene.tweens.add({
            targets: [closeText],
            alpha: 0,
            duration: 300,
            onComplete: () => {
                closeText.destroy();
            }
        });

        if (gameVars.latestLevel > 1 && Math.random() > 0.75) {
            let ladyImage = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight - 90, 'ending', 'ending2_a.png').setAlpha(0.2).setDepth(200);
            PhaserScene.tweens.add({
                targets: ladyImage,
                ease: 'Cubic.easeOut',
                alpha: 0.55,
                duration: 300,
                onComplete: () => {
                    PhaserScene.tweens.add({
                        targets: ladyImage,
                        ease: 'Quad.easeOut',
                        alpha: 0,
                        duration: 900,
                    });
                }
            });
            PhaserScene.tweens.add({
                targets: ladyImage,
                ease: 'Quad.easeOut',
                scaleX: 0.46,
                scaleY: 0.46,
                duration: 1200,
            });
            setTimeout(() => {
                fadeOutLocketDisplay();
            }, 400);
        } else {
            fadeOutLocketDisplay();
        }
    })
}

function fadeOutLocketDisplay() {
    globalObjects.magicCircle.enableMovement();
    globalObjects.gameLocketOpen.setFrame('locket4.png');

    globalObjects.gameLocketOpen.setScale(0.98).setRotation(0.1);

    PhaserScene.tweens.add({
        targets: [globalObjects.gameLocketOpen],
        rotation: 0,
        ease: 'Back.easeOut',
        duration: 250,
    });
    PhaserScene.tweens.add({
        targets: [globalObjects.gameLocketOpen],
        scaleX: 0.8,
        scaleY: 0.8,
        ease: 'Cubic.easeOut',
        duration: 250,
        onComplete: () => {
            globalObjects.encyclopedia.showButton();
            globalObjects.options.showButton();
            showMainMenuButtons();
            PhaserScene.tweens.add({
                delay: 150,
                targets: globalObjects.gameLocketOpen,
                y: "+=150",
                alpha: 0,
                scaleX: 0.65,
                scaleY: 0.65,
                ease: 'Quart.easeIn',
                duration: 600,
                onComplete: () => {
                    globalObjects.gameLocketOpen.destroy();
                }
            });
        }
    });
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
    globalObjects.combatDialogManager = new CombatTextManager(PhaserScene);
    globalObjects.spellManager = new SpellManager(PhaserScene);
    globalObjects.spellRecorder = new SpellRecorder(PhaserScene);
    globalObjects.bannerTextManager = new BannerTextManager(PhaserScene);


    globalObjects.statusManager = new StatusManager(PhaserScene);
    globalObjects.postFightScreen = new PostFightScreen(PhaserScene);
    globalObjects.confirmPopup = new ConfirmPopup(PhaserScene);
    globalObjects.bgHandler = new BgHandler();
    globalObjects.unlocks = new Unlocks();
}

function setupPlayer() {
    MAGIC_CIRCLE_HEIGHT = gameConsts.height - (isMobile ? 134 : 123);
    PhaserScene.tweens.add({
        targets: PhaserScene.cameras.main,
        zoom: 1,
        ease: "Quint.easeInOut",
        duration: 900,
    });
    globalObjects.magicCircle = new MagicCircle(PhaserScene, gameConsts.halfWidth, MAGIC_CIRCLE_HEIGHT);
    globalObjects.player = new Player(PhaserScene, gameConsts.halfWidth, MAGIC_CIRCLE_HEIGHT);
    let encycX = isMobile ? gameConsts.width - 27 : gameConsts.width - 73;
    let encycY = isMobile ? 77 : 27;
    globalObjects.encyclopedia = new Encyclopedia(PhaserScene, encycX, encycY);
    globalObjects.options = new Options(PhaserScene, gameConsts.width - 27, 27);
}

function handleGlobalKeyPresses() {
    globalObjects.currentOpenedPopups = [];
    messageBus.subscribe('toggleCancelScreen', () => {
        if (globalObjects.currentOpenedPopups.length > 0) {
            let topFunc = globalObjects.currentOpenedPopups[globalObjects.currentOpenedPopups.length - 1];
            let success = topFunc(false);
            if (success) {
                globalObjects.currentOpenedPopups.pop();
            }
        } else {
            globalObjects.options.showOptions();
        }
    });
}

function addPopup(closeFunc) {
    globalObjects.currentOpenedPopups.push(closeFunc);
    if (globalObjects.length === 4) {
        console.warn("unexpected number of popups");
    }
}

function removePopup() {
    globalObjects.currentOpenedPopups.pop();
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
