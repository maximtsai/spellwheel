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
            fadeInBackgroundAtlas('backgrounds', 'background3.webp', 1500, 1, 1, 'Quart.easeIn', 0, false);
            break;
        case 2:
            fadeInBackgroundAtlas('backgrounds', 'background5.webp', 1500, 1, 1, 'Quart.easeIn', 0, false);
            break;
        case 3:
            fadeInBackgroundAtlas('backgrounds', 'background6.webp', 1500, 1, 1, 'Quart.easeIn', 0, false);
            break;
        case 4:
            fadeInBackgroundAtlas('backgrounds', 'background3.webp', 1500, 1, 1, 'Quart.easeIn', 0, false);
            break;
        case 5:
            fadeInBackgroundAtlas('backgrounds', 'background5.webp', 1500, 1, 1, 'Quart.easeIn', 0, false);
            break;
        case 6:
            fadeInBackgroundAtlas('backgrounds', 'background6.webp', 1500, 1, 1, 'Quart.easeIn', 0, false);
            break;

        case 7:
            fadeInBackgroundAtlas('backgrounds', 'firebg1.png', 1500, 5, 1, 'Quart.easeIn', 0, true);
            break;
        case 8:
            fadeInBackgroundAtlas('backgrounds', 'firebg1.png', 1500, 5, 1, 'Quart.easeIn', 0, true);
            break;
        case 9:
            fadeInBackgroundAtlas('backgrounds', 'tunnel.webp', 1500, 1, 1, 'Quart.easeIn', 0, false);
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

