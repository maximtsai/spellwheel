let CURRENT_LEVEL = null;
let levelTimeoutID = null;

function beginLevel(lvl) {
    CURRENT_LEVEL = lvl;

    updateSpellState(lvl)
    globalObjects.player.resetStats();
    messageBus.publish('manualResetElements', undefined, true);
    messageBus.publish('manualResetEmbodiments', undefined, true); // with long delay

    globalObjects.magicCircle.buildRunes();


    createEnemyAfterDelay(lvl);
    switch(lvl) {
        case 0:
            // zoomInCurrBackground(1500, 2, 'Cubic.easeIn');
            fadeInBackgroundAtlas('backgrounds', 'background1.webp', 1500, 1, 1, 'Quart.easeIn', 0, false);
            break;
        case 1:
            break;
        case 7:
            fadeInBackgroundAtlas('backgrounds', 'firebg1.png', 1500, 5, 1, 'Quart.easeIn', 0, true);
            break;
    }
}

function createEnemyAfterDelay(lvl) {
    levelTimeoutID = setTimeout(() => {
        if (lvl === CURRENT_LEVEL) {
            createEnemy(lvl);
        }
    }, 1400);
}

