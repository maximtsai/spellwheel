class InternalMouseManager {
    constructor() {
    }

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

    onPointerMove(pointer) {
        gameVars.wasTouch = pointer.wasTouch;
        let handPos = mouseToHand(pointer.x, pointer.y);
        gameVars.mouseposx = handPos.x;
        gameVars.mouseposy = handPos.y;
        messageBus.publish("pointerMove", handPos.x, handPos.y);
    }

    onPointerUp(pointer) {
        gameVars.wasTouch = pointer.wasTouch;
        gameVars.mousedown = false;
        gameVars.mouseJustUpped = true;
        let handPos = mouseToHand(pointer.x, pointer.y);
        gameVars.mouseposx = handPos.x;
        gameVars.mouseposy = handPos.y;
        messageBus.publish("pointerUp", handPos.x, handPos.y);
    }
}

mouseManager = new InternalMouseManager();

// Converts position of mouse into position of hand
function mouseToHand(x, y) {
    let bufferDist = 0;
    let mouseDistFromCenterX = gameConsts.halfWidth - x;
    let mouseDistFromCenterY = gameConsts.halfHeight - y;
    let xRatio = gameConsts.halfWidth / (gameConsts.halfWidth - bufferDist);
    let yRatio = gameConsts.halfHeight / (gameConsts.halfHeight - bufferDist);
    let handX = gameConsts.halfWidth + xRatio * (x - gameConsts.halfWidth);
    let handY = gameConsts.halfHeight + yRatio * (y - gameConsts.halfHeight);
    handX = Math.min(Math.max(0, handX), gameConsts.width - 1);
    handY = Math.min(Math.max(0, handY), gameConsts.height - 1);
    return {x: handX, y: handY};
}

function setupMouseInteraction(scene) {
    let baseTouchLayer = scene.make.image({
        x: 0, y: 0, key: 'whitePixel', add: true, scale: {x: gameConsts.width, y: gameConsts.height}, alpha: 0.001});
    baseTouchLayer.setInteractive();
    baseTouchLayer.on('pointerdown', mouseManager.onPointerDown, scene);
    baseTouchLayer.on('pointermove', mouseManager.onPointerMove, scene);
    baseTouchLayer.on('pointerup', mouseManager.onPointerUp, scene);
}
