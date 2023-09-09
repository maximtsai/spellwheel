let config = {
    type: Phaser.CANVAS,
    scale: {
        parent: 'spellwheel',
        width: 620,
        height: 720
    },
    mode: Phaser.Scale.FIT,
    antialias: true,
    transparent: true,
    roundPixels: false,
    parent: 'spellwheel',
    loader: {
        baseURL: '' // Where we begin looking for files
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

function isSafariIOS() {
    var ua = window.navigator.userAgent;
    var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    var webkit = !!ua.match(/WebKit/i);
    var iOSSafari = iOS && webkit && !ua.match(/CriOS/i);
    return iOSSafari;
}

let game = new Phaser.Game(config); // var canvas = game.canvas;
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
    if (loadingSpinner && loadingSpinner.goalRot) {
        let adjustedSpinnerRot = loadingSpinner.rotation;
        if (adjustedSpinnerRot < 0) {
            adjustedSpinnerRot += Math.PI * 2;
        }
        let rotDiff = loadingSpinner.goalRot - adjustedSpinnerRot;
        loadingSpinner.rotation += rotDiff * Math.min(0.3, delta * 0.005);
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
