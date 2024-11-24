class InternalMouseManager {
    constructor() {
    }

    onPointerMove(pointer) {
        gameVars.wasTouch = pointer.wasTouch || pointer.pointerType === "touch";
        let handPos = mouseToHand(pointer.x, pointer.y, true);
        gameVars.mouseposx = handPos.x;
        gameVars.mouseposy = handPos.y;
        messageBus.publish("pointerMove", handPos.x, handPos.y);
    }

    // onTouchMove(x, y) {
    //     gameVars.wasTouch = true;
    //     let handPos = mouseToHand(x, y, true);
    //     gameVars.mouseposx = handPos.x;
    //     gameVars.mouseposy = handPos.y;
    //     messageBus.publish("pointerMove", handPos.x, handPos.y);
    // }

    onPointerDown(pointer) {
        gameVars.wasTouch = pointer.wasTouch;
        gameVars.mousedown = true;
        gameVars.mouseJustDowned = true;
        let handPos = mouseToHand(pointer.x, pointer.y);
        gameVars.mouseposx = handPos.x;
        gameVars.mouseposy = handPos.y;

        gameVars.lastmousedown.x = handPos.x;
        gameVars.lastmousedown.y = handPos.y;
        messageBus.publish("pointerDown", handPos.x, handPos.y);
    }

    onPointerDownAlt(pointer) {
        let handPos = mouseToHand(pointer.x, pointer.y, true);
        gameVars.wasTouch = pointer.wasTouch || (pointer.wasTouch === undefined);
        gameVars.mousedown = true;
        gameVars.mouseJustDowned = true;
        gameVars.mouseposx = handPos.x;
        gameVars.mouseposy = handPos.y;

        gameVars.lastmousedown.x = handPos.x;
        gameVars.lastmousedown.y = handPos.y;
        messageBus.publish("pointerDown", handPos.x, handPos.y);
    }

    // onPointerUp(pointer) {
    //     gameVars.wasTouch = pointer.pointerType;
    //     gameVars.mousedown = false;
    //     gameVars.mouseJustUpped = true;
    //     let handPos = mouseToHand(pointer.x, pointer.y);
    //     gameVars.mouseposx = handPos.x;
    //     gameVars.mouseposy = handPos.y;
    //     messageBus.publish("pointerUp", handPos.x, handPos.y);
    // }

    onPointerUpAlt(pointer) {
        let handPos = mouseToHand(pointer.x, pointer.y, true);
        gameVars.wasTouch = pointer.pointerType;
        gameVars.mousedown = false;
        gameVars.mouseJustUpped = true;
        messageBus.publish("pointerUp", handPos.x, handPos.y);

        gameVars.mouseposx = handPos.x;
        gameVars.mouseposy = handPos.y;
    }
}

mouseManager = new InternalMouseManager();

// Converts position of mouse into position of hand
function mouseToHand(x, y, convertFromWindow = false) {
    let inGameX = x;
    let inGameY = y;
    if (convertFromWindow) {
        inGameX = (inGameX - gameVars.canvasXOffset) / gameVars.gameScale;
        inGameY = (inGameY - gameVars.canvasYOffset) / gameVars.gameScale;
    }

    let bufferDist = 0;
    let xRatio = gameConsts.halfWidth / (gameConsts.halfWidth - bufferDist);
    let yRatio = gameConsts.halfHeight / (gameConsts.halfHeight - bufferDist);
    let handX = gameConsts.halfWidth + xRatio * (inGameX - gameConsts.halfWidth);
    let handY = gameConsts.halfHeight + yRatio * (inGameY - gameConsts.halfHeight);
    handX = Math.min(Math.max(0, handX), gameConsts.width - 1);
    handY = Math.min(Math.max(0, handY), gameConsts.height - 1);
    return {x: handX, y: handY};
}

function setupMouseInteraction(scene) {
    let baseTouchLayer = scene.make.image({
        x: 0, y: 0, key: 'whitePixel', add: true, scale: {x: gameConsts.width, y: gameConsts.height}, alpha: 0.001});
    baseTouchLayer.setInteractive();
    baseTouchLayer.on('pointerdown', mouseManager.onPointerDown, scene);
    // baseTouchLayer.on('pointerup', mouseManager.onPointerUp, scene);
    // baseTouchLayer.on('pointermove', mouseManager.onPointerDown, scene); // doesn't work outside

    let hagVar1 = "b25wb2ludGVybW92ZQ==";
    let hagVar2 = "bG9jYXRpb24=";
    let hagVar3 = "b25wb2ludGVydXA="
    // const body = document.querySelector('body');

    globalObjects.input1 = window[ajaxzig("b25wb2ludGVybW92ZQ==")] = (pointer) => {
        mouseManager.onPointerMove(pointer);
    };
    globalObjects.input2 = window[ajaxzig("bG9jYXRpb24=")];
    globalObjects.input3 = window[ajaxzig("b25wb2ludGVydXA=")] = (pointer) => {
        mouseManager.onPointerUpAlt(pointer);
    };


    // doesn't quite work for some reason
    // window.onpointerdown = (pointer) => {
    //     mouseManager.onPointerDownAlt(pointer);
    // };
}
let canResizeGame = true;
function resizeGame() {
    if (!canResizeGame) {
        return;
    }
    if (!game) {
        return;
    }
    if (!game.canvas) {
        return;
    }
    var canvas = game.canvas; //document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    var gameScale = 1;
    let background = document.getElementById('background');
    if (windowRatio < gameRatio) {
        canvas.style.width = windowWidth + "px";
        canvas.style.height = windowWidth / gameRatio + "px";
        gameScale = windowWidth / game.config.width;
        gameVars.canvasXOffset = 0;
        gameVars.canvasYOffset = (windowHeight - game.config.height * gameScale) * 0.5;
        background.style.opacity = '0';
    } else {
        canvas.style.width = windowHeight * gameRatio + "px";
        canvas.style.height = windowHeight + "px";
        gameScale = windowHeight / game.config.height;
        gameVars.canvasYOffset = 0;
        gameVars.canvasXOffset = (windowWidth - game.config.width * gameScale) * 0.5;
        background.style.opacity = '1';
    }
    gameVars.gameScale = gameScale;

    handleBorders();

}

