let config = {
    type: Phaser.CANVAS,
    scale: {
        parent: 'spellwheel',
        width: 620,
        height: 720,
        autoRound: true,
        mode: Phaser.Scale.FIT,
    },
    render: {
        // Leave on to prevent pixelated graphics
        antialias: true,
        roundPixels: true,
    },
    transparent: true,
    expandParent: true,
    clearBeforeRender: false,
    parent: 'spellwheel',
    loader: {
        baseURL: '' // Where we begin looking for files
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    dom: {
        createContainer: true,
    },
};

function isSafariIOS() {
    var ua = window.navigator.userAgent;
    var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    var webkit = !!ua.match(/WebKit/i);
    var iOSSafari = iOS && webkit && !ua.match(/CriOS/i);
    return iOSSafari;
}
let game;

function onloadFunc() {
    game = new Phaser.Game(config); // var canvas = game.canvas;
}

let gameConsts = {
    width: config.scale.width,
    halfWidth: config.scale.width * 0.5,
    height: config.scale.height,
    halfHeight: config.scale.height * 0.5,
    SDK: null
};
let gameVars = {
    gameConstructed: false,
    mousedown: false,
    mouseJustDowned: false,
    mouseposx: 0,
    mouseposy: 0,
    lastmousedown: {x: 0, y: 0},
    timeSlowRatio: 1,
    playerSpeed: 1,
    gameScale: 1,
    canvasXOffset: 0
};
let globalObjects = {};
let updateFunctions = {};
let PhaserScene = null; // Global
let oldTime = 0;
let deltaScale = 1;
let timeUpdateCounter = 0;
let timeUpdateCounterMax = 5;

function preload ()
{
    resizeGame();
    let gameDiv = document.getElementById('preload-notice');
    gameDiv.innerHTML = "";
    loadFileList(this, imageFilesPreload, 'image');
}

function create ()
{
    oldTime = Date.now();
    PhaserScene = this;
    onPreloadComplete(this);
}

function onPreloadComplete (scene)
{
    globalObjects.tempBG = scene.add.sprite(0, 0, 'blackPixel').setScale(1000, 1000).setDepth(-1);
    setupMouseInteraction(scene);
    setupLoadingBar(scene);

    loadFileList(scene, audioFiles, 'audio');
    loadFileList(scene, imageAtlases, 'atlas');
    loadFileList(scene, imageFiles, 'image');
    loadFileList(scene, fontFiles, 'bitmap_font');

    scene.load.start();
}

function onLoadComplete(scene) {
    initializeSounds(scene);
    setupGame(scene);
}

function update(time, delta) {
    if (loadObjects.loadingSpinner && loadObjects.loadingSpinner.goalRot) {
        let adjustedSpinnerRot = loadObjects.loadingSpinner.rotation;
        if (adjustedSpinnerRot > 0) {
            adjustedSpinnerRot -= Math.PI * 2;
        }
        let rotDiff = loadObjects.loadingSpinner.goalRot - adjustedSpinnerRot;
        loadObjects.loadingSpinner.rotation += rotDiff * Math.min(0.4, delta * 0.01);
        for (let i = 0; i < icons.length; i++) {
            icons[i].rotation = icons[i].startRotation + loadObjects.loadingSpinner.rotation;
        }

    }
    // check mouse
    if (timeUpdateCounter >= timeUpdateCounterMax) {
        timeUpdateCounter = 0;
        let newTime = Date.now();
        let deltaTime = newTime - oldTime;
        oldTime = newTime;
        deltaScale = Math.min(5, deltaTime / 100);
    } else {
        timeUpdateCounter++;
    }

    buttonManager.update(deltaScale);
    updateManager.update(deltaScale);

    gameVars.mouseJustDowned = false;
    gameVars.mouseJustUpped = false;
    if (!gameVars.wasTouch && !game.input.mousePointer.isDown) {
        gameVars.mousedown = false;
    }
}

function loadFileList(scene, filesList, type) {
    for (let i in filesList) {
        let data = filesList[i];
        switch (type) {
            case 'audio':
                scene.load.audio(data.name, data.src);
                break;
            case 'image':
                scene.load.image(data.name, data.src);
                break;
            case 'bitmap_font':
                scene.load.bitmapFont(data.name, data.imageUrl, data.url);
                break;
            case 'atlas':
                scene.load.multiatlas(data.name, data.src);
                break;
            default:
                console.warn('unrecognized type: ', type);
                break;
        }
    }
}

function zoomTemp(zoomAmt) {
    PhaserScene.cameras.main.setZoom(zoomAmt);
    PhaserScene.tweens.add({
        targets: PhaserScene.cameras.main,
        zoom: 1,
        ease: "Cubic.easeOut",
        duration: 200
    });
}
