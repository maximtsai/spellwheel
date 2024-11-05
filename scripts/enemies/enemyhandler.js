function createEnemy(num) {
    if (globalObjects.currentEnemy) {
        globalObjects.currentEnemy.destroy();
    }
    switch(num) {
    case -7:
        globalObjects.currentEnemy = new SuperDummy(PhaserScene, gameConsts.halfWidth, 170, 7, true);
        break;
    case -6:
        globalObjects.currentEnemy = new Dummyvoid(PhaserScene, gameConsts.halfWidth, 310, num);
        break;
    case -5:
    case -4:
        globalObjects.currentEnemy = new Dummytime(PhaserScene, gameConsts.halfWidth, 310, num);
        break;
    case -3:
        globalObjects.currentEnemy = new Dummybody(PhaserScene, gameConsts.halfWidth, 310, num);
        break;
    case -2:
        globalObjects.currentEnemy = new Dummyshield(PhaserScene, gameConsts.halfWidth, 310, num);
        break;
    case -1:
        globalObjects.currentEnemy = new Dummymind(PhaserScene, gameConsts.halfWidth, 310, num);
        break;
    case 0:
        globalObjects.currentEnemy = new LesserDummy(PhaserScene, gameConsts.halfWidth, 329, num);
        break;
    case 1:
        globalObjects.currentEnemy = new Dummy(PhaserScene, gameConsts.halfWidth, 125, num);
        break;
    case 2:
        globalObjects.currentEnemy = new Goblin(PhaserScene, gameConsts.halfWidth, 182, num);
        break;
    case 3:
        globalObjects.currentEnemy = new Tree(PhaserScene, gameConsts.halfWidth, isMobile ? 310 : 308, num);
        break;
    case 4:
        globalObjects.currentEnemy = new Magician(PhaserScene, gameConsts.halfWidth, 171, num);
        break;
    case 5:
         globalObjects.currentEnemy = new Statue(PhaserScene, gameConsts.halfWidth + 7, 260, num);
         break;
    case 6:
        globalObjects.currentEnemy = new Knight(PhaserScene, gameConsts.halfWidth, 163, num);
        break;
    case 7:
    case 8:
    case 9:
    case 10:
        globalObjects.currentEnemy = new KillerRobotDemo(PhaserScene, gameConsts.halfWidth, 158, num);
        break;
    default:
        globalObjects.currentEnemy = new Goblin(PhaserScene, gameConsts.halfWidth, 185);
        break;

    }
}
