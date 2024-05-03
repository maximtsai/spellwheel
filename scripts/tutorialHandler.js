function buildTutorialMind() {
    let clickBlocker = buildClickblocker();
    let initTutText = getLangText('mind_tut_desc');
    let strikeText = getLangText('mind_tut_strike_desc');
    let enhanceText = getLangText('mind_tut_enhance_desc');

    let tutText = PhaserScene.add.text(gameConsts.halfWidth - 125, gameConsts.halfHeight - 120, initTutText, {fontFamily: 'Verdana', fontSize: 24, color: '#2A1122', align: 'left'}).setDepth(10001).setOrigin(0, 0);
    globalObjects.runePicture.setVisible(true).setAlpha(0).setScale(0.96);
    PhaserScene.tweens.add({
        delay: 1,
        targets: [tutText, globalObjects.runePicture],
        alpha: 1,
        scaleX: 1,
        scaleY: 1,
        duration: 1,
    });
    globalObjects.runePicture.setFrame('rune_mind_large.png');

    let tutTitleText = PhaserScene.add.text(gameConsts.halfWidth - 170, gameConsts.halfHeight - 285, 'ENERGY RUNE', {fontFamily: 'Verdana', fontSize: 23, color: '#2A1122', align: 'left'}).setScale(1).setDepth(10001).setOrigin(0.5, 0.5);
    let tutRune = PhaserScene.add.sprite(gameConsts.halfWidth - 200, gameConsts.halfHeight - 190, 'tutorial', 'rune_mind_large.png').setScale(0.96).setAlpha(0.5).setDepth(10001);
    let runeClicker1 = buildRuneclicker(tutRune.x, tutRune.y, () => {
        tutText.setText(initTutText);
        globalObjects.runePicture.setFrame('rune_mind_large.png');
    })

    globalObjects.runeHighlight.setVisible(true).setScale(1).setPosition(tutRune.x, tutRune.y);

    let tutRune2 = PhaserScene.add.sprite(gameConsts.halfWidth - 0, gameConsts.halfHeight - 190, 'tutorial', 'rune_strike_large.png').setScale(0.96).setAlpha(0.5).setDepth(10001);
    let runeClicker2 = buildRuneclicker(tutRune2.x, tutRune2.y, () => {
        tutText.setText(strikeText);
        globalObjects.runePicture.setFrame('tut_mind_strike.png');

    })

    let tutRune3 = PhaserScene.add.sprite(gameConsts.halfWidth + 150, gameConsts.halfHeight - 190, 'tutorial', 'rune_enhance_large.png').setScale(0.96).setAlpha(0.5).setDepth(10001);
    let runeClicker3 = buildRuneclicker(tutRune3.x, tutRune3.y, () => {
        tutText.setText(enhanceText);
        globalObjects.runePicture.setFrame('tut_mind_enhance.png');
    })

    buildTutorialBasic([tutTitleText, tutRune, tutRune2, tutRune3, tutText], [runeClicker1, runeClicker2, runeClicker3, clickBlocker]);
}
