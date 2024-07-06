let isMobile = testMobile();
let gameVersion = "version 1.22";
let config = {
    type: Phaser.AUTO,
    scale: {
        parent: 'spellwheel',
        autoRound: true,
        width: isMobile ? 596 : 610,
        height: isMobile ? 810: 770,
        mode: Phaser.Scale.FIT,
        orientation: 'landscape',
        forceLandscape: true
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

function testMobile() {
    return true;
  const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(navigator.userAgent);
}


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
let cheats = {
    extraHealth: false,
    extraExtraHealth: false,
    extraDmg: false,
    extraExtraDmg: false,
    fullArsenal: false,
    infiniteAmmo: false,
    slowEnemies: false,
    frail: false,
    grudge: false,
    toughEnemies: false,
};
let funnies = {
    mustache: false,
};
let gameVars = {
    gameConstructed: false,
    mousedown: false,
    mouseJustDowned: false,
    mouseposx: 0,
    mouseposy: 0,
    lastmousedown: {x: 0, y: 0},
    timeSlowRatio: 1,
    timeScale: 1,
    gameManualSlowSpeed: 1,
    gameManualSlowSpeedInverse: 1,
    gameScale: 1,
    canvasXOffset: 0,
    canvasYOffset: 0
};
let globalObjects = {};
let updateFunctions = {};
let PhaserScene = null; // Global
let oldTime = 0;
let deltaScale = 1;
let timeUpdateCounter = 0;
let timeUpdateCounterMax = 3;
let canResizeGame = false;
let url1 = null;// 'crazygames';
let url2 = null;// '1001juegos';

function preload ()
{
    gameVars.latestLevel = parseInt(localStorage.getItem("latestLevel"));
    if (!gameVars.latestLevel) {
        gameVars.latestLevel = 0;
    }
    console.log("latest level reached: ", gameVars.latestLevel);

    if (isMobile && screen && screen.orientation && screen.orientation.lock) {
        var myScreenOrientation = window.screen.orientation;
        console.log(myScreenOrientation)
        myScreenOrientation.lock('portrait')
    }
    if (!document.location.href.includes(url1) && !document.location.href.includes(url2)) {
        // TODO turn on
        // return;
    }
    canResizeGame = true;
    resizeGame();
    let gameDiv = document.getElementById('preload-notice');
    gameDiv.innerHTML = "";
    loadFileList(this, imageFilesPreload, 'image');
    setTimeout(() => {
        resizeGame();
    }, 100)
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
    loadFileList(scene, videoFiles, 'video');

    scene.load.start();
}

function onLoadComplete(scene) {
    initializeSounds(scene);
    setupGame(scene);
}

let lastUpdateValues = [1, 1, 1, 1, 1];
let lastUpdateValuesIdx = 0;
let avgDeltaScale = 1;
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
        lastUpdateValues[lastUpdateValuesIdx] = deltaScale;
        lastUpdateValuesIdx = (lastUpdateValuesIdx + 1) % 5;
        avgDeltaScale = 0;
        for (let i = 0; i < 5; i++) {
            avgDeltaScale += lastUpdateValues[i] * 0.2;
        }
    } else {
        timeUpdateCounter++;
    }

    avgDeltaScale *= gameVars.timeScale;


    buttonManager.update(avgDeltaScale);
    updateManager.update(avgDeltaScale);

    gameVars.mouseJustDowned = false;
    gameVars.mouseJustUpped = false;
    if (!gameVars.wasTouch && !game.input.mousePointer.isDown && gameVars.mousedown) {
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
            case 'video':
                scene.load.video({
                    key: data.name,
                    url: data.src,
                    noAudio: true
                });
                break;
            default:
                console.warn('unrecognized type: ', type);
                break;
        }
    }
}

function screenShake(amt) {
    PhaserScene.cameras.main.scrollX = amt;
    let durMult = 1 + 0.1 * amt;
    PhaserScene.tweens.add({
        targets: PhaserScene.cameras.main,
        scrollX: amt,
        ease: "Quint.easeOut",
        duration: 50*durMult,
        onComplete: () => {
            PhaserScene.tweens.add({
                targets: PhaserScene.cameras.main,
                scrollX: 0,
                ease: "Bounce.easeOut",
                easeParams: [3],
                duration: 150*durMult,
            });
        }
    });
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
