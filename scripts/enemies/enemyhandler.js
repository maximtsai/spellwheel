function createEnemy(num) {
    if (globalObjects.currentEnemy) {
        globalObjects.currentEnemy.destroy();
    }
    switch(num) {
    case -99:
        globalObjects.currentEnemy = new ArmorDummy(PhaserScene, gameConsts.halfWidth, 310, num);
        break;
    case -8:
        globalObjects.currentEnemy = new SuperDummy(PhaserScene, gameConsts.halfWidth, 170, 7, true);
        break;
    case -7:
        globalObjects.currentEnemy = new Dummyvoid(PhaserScene, gameConsts.halfWidth, 310, num);
        break;
    case -6:
    case -5:
        globalObjects.currentEnemy = new Dummytime(PhaserScene, gameConsts.halfWidth, 310, num);
        break;
    case -4:
        globalObjects.currentEnemy = new Dummybody(PhaserScene, gameConsts.halfWidth, 310, num);
        break;
    case -3:
        globalObjects.currentEnemy = new Dummyshield(PhaserScene, gameConsts.halfWidth, 310, num);
        break;
    case -1:
        globalObjects.currentEnemy = new Dummymind(PhaserScene, gameConsts.halfWidth, 328, num);
        break;
    case 0:
        globalObjects.currentEnemy = new LesserDummy(PhaserScene, gameConsts.halfWidth, 329, num);
        break;
    case 1:
        globalObjects.currentEnemy = new Dummy(PhaserScene, gameConsts.halfWidth, 125, num);
        break;
    case 2:
        globalObjects.currentEnemy = new Water(PhaserScene, gameConsts.halfWidth, 324, num);
        // globalObjects.currentEnemy = new Goblin(PhaserScene, gameConsts.halfWidth, 182, num);
        break;
    case 3:
        globalObjects.currentEnemy = new Goblin(PhaserScene, gameConsts.halfWidth, 182, num);
        break;
    case 4:
        globalObjects.currentEnemy = new Tree(PhaserScene, gameConsts.halfWidth, isMobile ? 310 : 308, num);
        break;
    case 5:
        globalObjects.currentEnemy = new Magician(PhaserScene, gameConsts.halfWidth, 171, num);
        break;
    case 6:
         globalObjects.currentEnemy = new Statue(PhaserScene, gameConsts.halfWidth + 7, 260, num);
         break;
    case 7:
        globalObjects.currentEnemy = new Knight(PhaserScene, gameConsts.halfWidth, 163, num);
        break;
    case 8:
        globalObjects.currentEnemy = new Wall(PhaserScene, gameConsts.halfWidth, 210, num);
        break;
    case 9:
        globalObjects.currentEnemy = new SuperDummy(PhaserScene, gameConsts.halfWidth, 170, num);
        break;
    case 10:
        globalObjects.currentEnemy = new Mantis(PhaserScene, gameConsts.halfWidth, gameConsts.halfHeight - 238, num);
        break;
    case 11:
        globalObjects.currentEnemy = new KillerRobot(PhaserScene, gameConsts.halfWidth, 158, num);
        break;
    case 12:
        globalObjects.currentEnemy = new Death(PhaserScene, gameConsts.halfWidth, 58, num);
        break;
    case 13:
        globalObjects.currentEnemy = new Death2(PhaserScene, gameConsts.halfWidth, 90, num);
        break;
    case 14:
        globalObjects.currentEnemy = new Death2Plus(PhaserScene, gameConsts.halfWidth, 157, num);
        break;
    case 15:
        globalObjects.currentEnemy = new Death3(PhaserScene, gameConsts.halfWidth, 190, num);
        break;
    default:
        globalObjects.currentEnemy = new Goblin(PhaserScene, gameConsts.halfWidth, 185);
        break;

    }
}
