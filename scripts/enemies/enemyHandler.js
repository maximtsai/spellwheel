function createEnemy(num) {
    if (globalObjects.currentEnemy) {
        globalObjects.currentEnemy.destroy();
    }
    switch(num) {
    case 0:
        globalObjects.currentEnemy = new LesserDummy(PhaserScene, gameConsts.halfWidth, 275, num);
        break;
    case 1:
        globalObjects.currentEnemy = new Dummy(PhaserScene, gameConsts.halfWidth, 173, num);
        break;
    case 2:
        globalObjects.currentEnemy = new Goblin(PhaserScene, gameConsts.halfWidth, 185, num);
        break;
    case 3:
        globalObjects.currentEnemy = new Tree(PhaserScene, gameConsts.halfWidth, 311, num);
        break;
    case 4:
        globalObjects.currentEnemy = new Magician(PhaserScene, gameConsts.halfWidth, 180, num);
        break;
    case 5:
        globalObjects.currentEnemy = new Knight(PhaserScene, gameConsts.halfWidth, 173, num);
        break;
    case 6:
        globalObjects.currentEnemy = new Wall(PhaserScene, gameConsts.halfWidth, 210, num);
        break;
    case 7:
        globalObjects.currentEnemy = new SuperDummy(PhaserScene, gameConsts.halfWidth, 173, num);
        break;
    case 8:
        globalObjects.currentEnemy = new Mantis(PhaserScene, gameConsts.halfWidth, 160, num);
        break;
    case 9:
        globalObjects.currentEnemy = new KillerRobot(PhaserScene, gameConsts.halfWidth, 158, num);
        break;
    case 10:
        break;
    case 11:
        break;
    case 12:
        break;
    default:
        globalObjects.currentEnemy = new Goblin(PhaserScene, gameConsts.halfWidth, 185);
        break;

    }
}
