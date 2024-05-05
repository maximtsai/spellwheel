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

    icons.push(scene.add.image(gameConsts.halfWidth, gameConsts.height - 124, 'runeMatterPre'));
    icons.push(scene.add.image(gameConsts.halfWidth, gameConsts.height - 124, 'runeMindPre'));
    icons.push(scene.add.image(gameConsts.halfWidth, gameConsts.height - 124, 'runeTimePre'));
    icons.push(scene.add.image(gameConsts.halfWidth, gameConsts.height - 124, 'runeVoidPre'));
    icons.push(scene.add.image(gameConsts.halfWidth, gameConsts.height - 124, 'runeStrikePre'));
    icons.push(scene.add.image(gameConsts.halfWidth, gameConsts.height - 124, 'runeEnhancePre')); // prepare
    icons.push(scene.add.image(gameConsts.halfWidth, gameConsts.height - 124, 'runeProtectPre')); // shield
    icons.push(scene.add.image(gameConsts.halfWidth, gameConsts.height - 124, 'runeReinforcePre')); // body
    icons.push(scene.add.image(gameConsts.halfWidth, gameConsts.height - 124, 'runeUnloadPre')); // ultimate

    let loadIconHeight = gameConsts.halfHeight - 4;
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

    loadObjects.loadingText = scene.add.text(gameConsts.halfWidth, gameConsts.halfHeight - 220, 'LOADING...');
    loadObjects.loadingText.setFontSize(28);
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
                    loadObjects.loadingText.setText('LOADING\nFINAL FILES');
                    break;
            }

            loadLevel++;
        }
    });
    scene.load.on('complete', () => {
        loadObjects.loadingText.setText('LOADING\nFINAL FILES');
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
        scene.tweens.add({
            delay: 250,
            targets: icons,
            alpha: 0,
            duration: 800,
            onComplete: () => {
                // loadIcon.destroy();
            }
        });
        loadObjects.loadingSpinnerOuter = scene.add.image(gameConsts.halfWidth, gameConsts.height - 124, 'loadingSpinnerOuter').setScale(0.7).setDepth(199).setRotation(1);
        scene.tweens.add({
            targets: loadObjects.loadingSpinnerOuter,
            delay: 500,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            duration: 750,
            ease: 'Cubic.easeOut',
        });
        setupMainMenu();
        loadObjects.loadingSpinner.goalRot = Math.PI * -14/8 - 0.08;//value * Math.PI * -1;

        scene.tweens.add({
            targets: [loadObjects.loadingText, globalObjects.tempBG],
            delay: 350,
            alpha: 0,
            duration: 1000,
            onComplete: () => {
                let loadObjectsArray = [];
                for (let i in loadObjects) {
                    loadObjectsArray.push(loadObjects[i]);
                }
                globalObjects.tempBG.destroy();
                scene.tweens.add({
                    targets: loadObjectsArray,
                    alpha: 0,
                    duration: 700,
                    onComplete: () => {
                        for (let i in loadObjects) {
                            loadObjects[i].destroy();
                        }
                    }
                });
                onLoadComplete(scene);
            }
        });
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

    PhaserScene.tweens.add({
        targets: PhaserScene.cameras.main,
        zoom: 1,
        ease: "Quint.easeInOut",
        duration: 900,
    });
    createAnimations(PhaserScene);
    MAGIC_CIRCLE_HEIGHT = gameConsts.height - 124;

    globalObjects.gameStats = new GameStats();
    globalObjects.hoverTextManager = new InternalHoverTextManager(PhaserScene);
    globalObjects.textPopupManager = new TextPopupManager(PhaserScene);
    globalObjects.spellManager = new SpellManager(PhaserScene);
    globalObjects.spellRecorder = new SpellRecorder(PhaserScene);
    globalObjects.magicCircle = new MagicCircle(PhaserScene, gameConsts.halfWidth, MAGIC_CIRCLE_HEIGHT);
    globalObjects.bannerTextManager = new BannerTextManager(PhaserScene);


    globalObjects.statusManager = new StatusManager(PhaserScene);
    globalObjects.postFightScreen = new PostFightScreen(PhaserScene);


    globalObjects.player = new Player(PhaserScene, gameConsts.halfWidth, MAGIC_CIRCLE_HEIGHT);

    gotoMainMenu();

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


function onCreditsButtonClicked() {
    globalObjects.creditsText.visible = true;
    playSound('button');
}
