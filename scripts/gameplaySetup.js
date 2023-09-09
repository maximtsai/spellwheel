let loadingSpinner;
let castButton;
let loadingText;
let icons = [];

function setupLoadingBar(scene) {
    // Basic loading bar visual
    loadingSpinner = scene.add.image(gameConsts.halfWidth, gameConsts.height - 124, 'loadingSpinner');
    castButton = scene.add.image(gameConsts.halfWidth, gameConsts.height - 124, 'castNormal');

    icons.push(scene.add.image(gameConsts.halfWidth, gameConsts.height - 124, 'runeMatterPre'));
    icons.push(scene.add.image(gameConsts.halfWidth, gameConsts.height - 124, 'runeMindPre'));
    icons.push(scene.add.image(gameConsts.halfWidth, gameConsts.height - 124, 'runeTimePre'));
    icons.push(scene.add.image(gameConsts.halfWidth, gameConsts.height - 124, 'runeVoidPre'));
    icons.push(scene.add.image(gameConsts.halfWidth, gameConsts.height - 124, 'runeStrikePre'));
    icons.push(scene.add.image(gameConsts.halfWidth, gameConsts.height - 124, 'runeProtectPre')); // shield
    icons.push(scene.add.image(gameConsts.halfWidth, gameConsts.height - 124, 'runeEnhancePre')); // prepare
    icons.push(scene.add.image(gameConsts.halfWidth, gameConsts.height - 124, 'runeReinforcePre')); // body
    icons.push(scene.add.image(gameConsts.halfWidth, gameConsts.height - 124, 'runeUnloadPre')); // ultimate

    for (let i = 0; i < icons.length; i++) {
        // icons[i].visible = false;
        // icons[i].setScale(0);
        icons[i].setDepth(101);
        icons[i].setOrigin(0.5, 0.85);
        icons[i].rotation = (i / icons.length) * Math.PI * 2;
    }


    loadingText = scene.add.text(gameConsts.halfWidth, gameConsts.halfHeight - 160, 'LOADING...');
    loadingText.setFontSize(28);
    loadingText.setAlign('center');
    loadingText.setOrigin(0.5, 0);

    loadingSpinner.setDepth(100);
    castButton.setDepth(100);

    // Setup loading bar logic
    scene.load.on('progress', function (value) {
        loadingSpinner.goalRot = value * Math.PI * 1.95;
    });
    scene.load.on('complete', () => {
        console.log("complt")
        loadingText.setText('BEGINNING MAGIC SEQUENCE')
        loadingSpinner.goalRot = null;
        // Animate out the loading bar
        scene.tweens.add({
            targets: [loadingSpinner],
            rotation: Math.PI * 2,
            duration: 450,
            ease: 'Cubic.easeInOut'
        });
        scene.tweens.add({
            targets: [loadingSpinner, loadingText],
            delay: 350,
            alpha: 0,
            duration: 400,
            onComplete: () => {
                loadingSpinner.destroy();
                loadingText.destroy();
                onLoadComplete(scene);
            }
        });
        scene.tweens.add({
            targets: [loadingSpinner],
            y: loadingSpinner.y + 280,
            delay: 350,
            duration: 400,
            ease: 'Cubic.easeIn'
        });
    });
}

let MAGIC_CIRCLE_HEIGHT = 0;

function setupGame() {

    createAnimations(PhaserScene);
    PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'background');
    MAGIC_CIRCLE_HEIGHT = gameConsts.height - 124;

    globalObjects.gameStats = new GameStats();
    globalObjects.hoverTextManager = new InternalHoverTextManager(PhaserScene);
    globalObjects.textPopupManager = new TextPopupManager(PhaserScene);
    globalObjects.spellManager = new SpellManager(PhaserScene);
    globalObjects.spellRecorder = new SpellRecorder(PhaserScene);
    globalObjects.magicCircle = new MagicCircle(PhaserScene, gameConsts.halfWidth, MAGIC_CIRCLE_HEIGHT);
    updateManager.addFunction(globalObjects.magicCircle.update.bind(globalObjects.magicCircle));

    globalObjects.statusManager = new StatusManager(PhaserScene);


    globalObjects.player = new Player(PhaserScene, gameConsts.halfWidth, MAGIC_CIRCLE_HEIGHT);
    // globalObjects.dummyEnemy = new Wall(PhaserScene, gameConsts.halfWidth, 165);
    // globalObjects.dummyEnemy = new Death(PhaserScene, gameConsts.halfWidth, 173);
    globalObjects.dummyEnemy = new Goblin(PhaserScene, gameConsts.halfWidth, 173);


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
