function createEnemy(num) {
    if (globalObjects.currentEnemy) {
        globalObjects.currentEnemy.destroy();
    }
    switch(num) {
    case 0:
        globalObjects.currentEnemy = new LesserDummy(PhaserScene, gameConsts.halfWidth, 265, num);
        break;
    case 1:
        globalObjects.currentEnemy = new Dummy(PhaserScene, gameConsts.halfWidth, 173, num);
        break;
    case 2:
        globalObjects.currentEnemy = new Goblin(PhaserScene, gameConsts.halfWidth, 173, num);
        break;
    case 3:
        globalObjects.currentEnemy = new Tree(PhaserScene, gameConsts.halfWidth, 190, num);
        break;
    case 4:
        globalObjects.currentEnemy = new Magician(PhaserScene, gameConsts.halfWidth, 173, num);
        break;
    case 5:
        break;
    case 6:
        break;
    case 7:
        break;
    case 8:
        break;
    case 9:
        break;
    case 10:
        break;
    case 11:
        break;
    case 12:
        break;
    default:
        globalObjects.currentEnemy = new Goblin(PhaserScene, gameConsts.halfWidth, 173);
        break;

    }
}
