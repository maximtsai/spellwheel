let CURRENT_LEVEL = null;
let levelTimeoutID = null;

function beginLevel(lvl) {
    CURRENT_LEVEL = lvl;
    createEnemyAfterDelay(lvl);
    switch(lvl) {
        case 0:
            zoomInCurrBackground(2000, 2, 'Cubic.easeIn');
            fadeInBackgroundAtlas('backgrounds', 'background1.webp', 2000, 1.3, 1, 'Quart.easeIn');
            break;
        case 1:
            break;
    }
}

function createEnemyAfterDelay(lvl) {
    levelTimeoutID = setTimeout(() => {
        if (lvl === CURRENT_LEVEL) {
            createEnemy(lvl);
        }
    }, 1800);


}