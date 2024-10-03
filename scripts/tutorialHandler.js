function buildTutorialMatter() {
    let clickBlocker = buildClickblocker();
    let initTutText = getLangText('matter_tut_desc');
    let strikeText = getLangText('matter_tut_strike_desc');
    let enhanceText = getLangText('matter_tut_enhance_desc');
    let startFrame = 'rune_matter_large.png';

    let tutText = PhaserScene.add.text(gameConsts.halfWidth - 125, gameConsts.halfHeight - 75, initTutText, {fontFamily: 'Verdana', fontSize: 22, color: '#2A1122', align: 'left'}).setDepth(10001).setOrigin(0, 0.34);
    globalObjects.runePicture.setVisible(true).setAlpha(0).setScale(0.96);
    PhaserScene.tweens.add({
        delay: 1,
        targets: [tutText, globalObjects.runePicture],
        alpha: 1,
        scaleX: 1,
        scaleY: 1,
        duration: 1,
    });
    globalObjects.runePicture.setFrame(startFrame).setRotation(0);

    let tutTitleText = PhaserScene.add.text(gameConsts.halfWidth - 143, gameConsts.halfHeight - 285, 'MATTER RUNE SPELLS', {fontFamily: 'Verdana', fontSize: 23, color: '#2A1122', align: 'left'}).setScale(1).setDepth(10001).setOrigin(0.5, 0.5);
    let tutRune = PhaserScene.add.sprite(gameConsts.halfWidth - 205, gameConsts.halfHeight - 200, 'tutorial', startFrame).setScale(0.96).setAlpha(0.5).setDepth(10001);
    let runeClicker1 = buildRuneclicker(tutRune.x, tutRune.y, () => {
        tutText.setText(initTutText);
        globalObjects.runePicture.setFrame(startFrame).setRotation(0);
    })


    let tutRune2 = PhaserScene.add.sprite(gameConsts.halfWidth - 0, gameConsts.halfHeight - 200, 'tutorial', 'rune_strike_large.png').setScale(0.96).setAlpha(0.5).setDepth(10001);
    let runeClicker2 = buildRuneclicker(tutRune2.x, tutRune2.y, () => {
        tutText.setText(strikeText);
        globalObjects.runePicture.setFrame('tut_matter_strike.png').setRotation(-0.1);

    })
    globalObjects.runeHighlight.setVisible(true).setScale(1).setPosition(tutRune2.x, tutRune2.y);
    tutText.setText(strikeText);
    globalObjects.runePicture.setFrame('tut_matter_strike.png').setRotation(-0.1);

    let tutRune3 = PhaserScene.add.sprite(gameConsts.halfWidth + 150, gameConsts.halfHeight - 200, 'tutorial', 'rune_enhance_large.png').setScale(0.96).setAlpha(0.5).setDepth(10001);
    let runeClicker3 = buildRuneclicker(tutRune3.x, tutRune3.y, () => {
        tutText.setText(enhanceText);
        globalObjects.runePicture.setFrame('tut_matter_enhance.png').setRotation(-0.1);
    })

    buildTutorialBasic([tutTitleText, tutRune, tutRune2, tutRune3, tutText], [runeClicker1, runeClicker2, runeClicker3, clickBlocker]);
}


function buildTutorialMind() {
    let clickBlocker = buildClickblocker();
    let initTutText = getLangText('mind_tut_desc');
    let strikeText = getLangText('mind_tut_strike_desc');
    let enhanceText = getLangText('mind_tut_enhance_desc');
    let startFrame = 'rune_energy_large.png';

    let tutText = PhaserScene.add.text(gameConsts.halfWidth - 125, gameConsts.halfHeight - 75, initTutText, {fontFamily: 'Verdana', fontSize: 22, color: '#2A1122', align: 'left'}).setDepth(10001).setOrigin(0, 0.34);
    globalObjects.runePicture.setVisible(true).setAlpha(0).setScale(0.96);
    PhaserScene.tweens.add({
        delay: 1,
        targets: [tutText, globalObjects.runePicture],
        alpha: 1,
        scaleX: 1,
        scaleY: 1,
        duration: 1,
    });
    globalObjects.runePicture.setFrame(startFrame).setRotation(0);

    let tutTitleText = PhaserScene.add.text(gameConsts.halfWidth - 143, gameConsts.halfHeight - 285, 'ENERGY RUNE SPELLS', {fontFamily: 'Verdana', fontSize: 23, color: '#2A1122', align: 'left'}).setScale(1).setDepth(10001).setOrigin(0.5, 0.5);
    let tutRune = PhaserScene.add.sprite(gameConsts.halfWidth - 205, gameConsts.halfHeight - 200, 'tutorial', startFrame).setScale(0.96).setAlpha(0.5).setDepth(10001);
    let runeClicker1 = buildRuneclicker(tutRune.x, tutRune.y, () => {
        tutText.setText(initTutText);
        globalObjects.runePicture.setFrame(startFrame).setRotation(0);
    })

    tutText.setText(strikeText);
    globalObjects.runePicture.setFrame('tut_mind_strike.png').setRotation(-0.1);
    let tutRune2 = PhaserScene.add.sprite(gameConsts.halfWidth - 0, gameConsts.halfHeight - 200, 'tutorial', 'rune_strike_large.png').setScale(0.96).setAlpha(0.5).setDepth(10001);
    globalObjects.runeHighlight.setVisible(true).setScale(1).setPosition(tutRune2.x, tutRune2.y);
    let runeClicker2 = buildRuneclicker(tutRune2.x, tutRune2.y, () => {
        tutText.setText(strikeText);
        globalObjects.runePicture.setFrame('tut_mind_strike.png').setRotation(-0.1);

    })

    let tutRune3 = PhaserScene.add.sprite(gameConsts.halfWidth + 150, gameConsts.halfHeight - 200, 'tutorial', 'rune_enhance_large.png').setScale(0.96).setAlpha(0.5).setDepth(10001);
    let runeClicker3 = buildRuneclicker(tutRune3.x, tutRune3.y, () => {
        tutText.setText(enhanceText);
        globalObjects.runePicture.setFrame('tut_mind_enhance.png').setRotation(-0.1);
    })

    buildTutorialBasic([tutTitleText, tutRune, tutRune2, tutRune3, tutText], [runeClicker1, runeClicker2, runeClicker3, clickBlocker]);
}

function buildTutorialTime() {
    let clickBlocker = buildClickblocker();
    let initTutText = getLangText('time_tut_desc');
    let strikeText = getLangText('time_tut_strike_desc');
    let enhanceText = getLangText('time_tut_enhance_desc');
    let protectText = getLangText('time_tut_protect_desc');
    let reinforceText = getLangText('time_tut_reinforce_desc');
    let startFrame = 'rune_time_large.png';

    let tutText = PhaserScene.add.text(gameConsts.halfWidth - 125, gameConsts.halfHeight - 75, initTutText, {fontFamily: 'Verdana', fontSize: 22, color: '#2A1122', align: 'left'}).setDepth(10001).setOrigin(0, 0.34);
    globalObjects.runePicture.setVisible(true).setAlpha(0).setScale(0.96);
    PhaserScene.tweens.add({
        delay: 1,
        targets: [tutText, globalObjects.runePicture],
        alpha: 1,
        scaleX: 1,
        scaleY: 1,
        duration: 1,
    });
    globalObjects.runePicture.setFrame(startFrame).setRotation(0);

    let tutTitleText = PhaserScene.add.text(gameConsts.halfWidth - 143, gameConsts.halfHeight - 285, 'TIME RUNE SPELLS', {fontFamily: 'Verdana', fontSize: 23, color: '#2A1122', align: 'left'}).setScale(1).setDepth(10001).setOrigin(0.5, 0.5);
    let tutRune = PhaserScene.add.sprite(gameConsts.halfWidth - 205, gameConsts.halfHeight - 200, 'tutorial', startFrame).setScale(0.96).setAlpha(0.5).setDepth(10001);
    let runeClicker1 = buildRuneclicker(tutRune.x, tutRune.y, () => {
        tutText.setText(initTutText);
        globalObjects.runePicture.setFrame(startFrame).setRotation(0);
    })

    let tutRune2 = PhaserScene.add.sprite(gameConsts.halfWidth - 60, gameConsts.halfHeight - 200, 'tutorial', 'rune_strike_large.png').setScale(0.96).setAlpha(0.5).setDepth(10001);
    let runeClicker2 = buildRuneclicker(tutRune2.x, tutRune2.y, () => {
        tutText.setText(strikeText);
        globalObjects.runePicture.setFrame('tut_time_strike.png').setRotation(-0.1);
    })
    globalObjects.runeHighlight.setVisible(true).setScale(1).setPosition(tutRune2.x, tutRune2.y);
    tutText.setText(strikeText);
    globalObjects.runePicture.setFrame('tut_time_strike.png').setRotation(-0.1);

    let tutRune3 = PhaserScene.add.sprite(gameConsts.halfWidth + 30, gameConsts.halfHeight - 200, 'tutorial', 'rune_enhance_large.png').setScale(0.96).setAlpha(0.5).setDepth(10001);
    let runeClicker3 = buildRuneclicker(tutRune3.x, tutRune3.y, () => {
        tutText.setText(enhanceText);
        globalObjects.runePicture.setFrame('tut_time_enhance.png').setRotation(-0.1);
    })

    let tutRune4 = PhaserScene.add.sprite(gameConsts.halfWidth + 120, gameConsts.halfHeight - 200, 'tutorial', 'rune_protect_large.png').setScale(0.96).setAlpha(0.5).setDepth(10001);
    let runeClicker4 = buildRuneclicker(tutRune4.x, tutRune4.y, () => {
        tutText.setText(protectText);
        globalObjects.runePicture.setFrame('tut_time_shield.png').setRotation(-0.1);
    })

    let tutRune5 = PhaserScene.add.sprite(gameConsts.halfWidth + 210, gameConsts.halfHeight - 200, 'tutorial', 'rune_reinforce_large.png').setScale(0.96).setAlpha(0.5).setDepth(10001);
    let runeClicker5 = buildRuneclicker(tutRune5.x, tutRune5.y, () => {
        tutText.setText(reinforceText);
        globalObjects.runePicture.setFrame('tut_time_reinforce.png').setRotation(-0.1);
    })

    buildTutorialBasic([tutTitleText, tutRune, tutRune2, tutRune3, tutRune4, tutRune5, tutText], [runeClicker1, runeClicker2, runeClicker3, runeClicker4, runeClicker5, clickBlocker]);
}

function buildTutorialVoid() {
    let clickBlocker = buildClickblocker();
    let initTutText = getLangText('void_tut_desc');
    let strikeText = getLangText('void_tut_strike_desc');
    let enhanceText = getLangText('void_tut_enhance_desc');
    let protectText = getLangText('void_tut_protect_desc');
    let reinforceText = getLangText('void_tut_reinforce_desc');
    let startFrame = 'rune_void_large.png';

    let tutText = PhaserScene.add.text(gameConsts.halfWidth - 125, gameConsts.halfHeight - 75, initTutText, {fontFamily: 'Verdana', fontSize: 22, color: '#2A1122', align: 'left'}).setDepth(10001).setOrigin(0, 0.34);
    globalObjects.runePicture.setVisible(true).setAlpha(0).setScale(0.96);
    PhaserScene.tweens.add({
        delay: 1,
        targets: [tutText, globalObjects.runePicture],
        alpha: 1,
        scaleX: 1,
        scaleY: 1,
        duration: 1,
    });
    globalObjects.runePicture.setFrame(startFrame).setRotation(0);

    let tutTitleText = PhaserScene.add.text(gameConsts.halfWidth - 143, gameConsts.halfHeight - 285, 'VOID RUNE SPELLS', {fontFamily: 'Verdana', fontSize: 23, color: '#2A1122', align: 'left'}).setScale(1).setDepth(10001).setOrigin(0.5, 0.5);
    let tutRune = PhaserScene.add.sprite(gameConsts.halfWidth - 205, gameConsts.halfHeight - 200, 'tutorial', startFrame).setScale(0.96).setAlpha(0.5).setDepth(10001);
    let runeClicker1 = buildRuneclicker(tutRune.x, tutRune.y, () => {
        tutText.setText(initTutText);
        globalObjects.runePicture.setFrame(startFrame).setRotation(0);
    })

    let tutRune2 = PhaserScene.add.sprite(gameConsts.halfWidth - 60, gameConsts.halfHeight - 200, 'tutorial', 'rune_strike_large.png').setScale(0.96).setAlpha(0.5).setDepth(10001);
    let runeClicker2 = buildRuneclicker(tutRune2.x, tutRune2.y, () => {
        tutText.setText(strikeText);
        globalObjects.runePicture.setFrame('tut_void_strike.png').setRotation(-0.1);

    })
    globalObjects.runeHighlight.setVisible(true).setScale(1).setPosition(tutRune2.x, tutRune2.y);
    tutText.setText(strikeText);
    globalObjects.runePicture.setFrame('tut_void_strike.png').setRotation(-0.1);

    let tutRune3 = PhaserScene.add.sprite(gameConsts.halfWidth + 30, gameConsts.halfHeight - 200, 'tutorial', 'rune_enhance_large.png').setScale(0.96).setAlpha(0.5).setDepth(10001);
    let runeClicker3 = buildRuneclicker(tutRune3.x, tutRune3.y, () => {
        tutText.setText(enhanceText);
        globalObjects.runePicture.setFrame('tut_void_enhance.png').setRotation(-0.1);
    })

    let tutRune4 = PhaserScene.add.sprite(gameConsts.halfWidth + 120, gameConsts.halfHeight - 200, 'tutorial', 'rune_protect_large.png').setScale(0.96).setAlpha(0.5).setDepth(10001);
    let runeClicker4 = buildRuneclicker(tutRune4.x, tutRune4.y, () => {
        tutText.setText(protectText);
        globalObjects.runePicture.setFrame('tut_void_protect.png').setRotation(-0.1);
    })

    let tutRune5 = PhaserScene.add.sprite(gameConsts.halfWidth + 210, gameConsts.halfHeight - 200, 'tutorial', 'rune_reinforce_large.png').setScale(0.96).setAlpha(0.5).setDepth(10001);
    let runeClicker5 = buildRuneclicker(tutRune5.x, tutRune5.y, () => {
        tutText.setText(reinforceText);
        globalObjects.runePicture.setFrame('tut_void_reinforce.png').setRotation(-0.1);
    })

    buildTutorialBasic([tutTitleText, tutRune, tutRune2, tutRune3, tutRune4, tutRune5, tutText], [runeClicker1, runeClicker2, runeClicker3, runeClicker4, runeClicker5, clickBlocker]);
}


function buildTutorialProtect() {
    let clickBlocker = buildClickblocker();
    let initTutText = getLangText('protect_tut_desc');
    let firstText = getLangText('matter_tut_protect_desc');
    let secondText = getLangText('mind_tut_protect_desc');

    let tutText = PhaserScene.add.text(gameConsts.halfWidth - 125, gameConsts.halfHeight - 75, initTutText, {fontFamily: 'Verdana', fontSize: 22, color: '#2A1122', align: 'left'}).setDepth(10001).setOrigin(0, 0.34).setAlpha(0.5);
    globalObjects.runePicture.setVisible(true).setAlpha(0.5).setScale(0.96);
    PhaserScene.tweens.add({
        targets: [tutText, globalObjects.runePicture],
        alpha: 1,
        scaleX: 1,
        scaleY: 1,
        duration: 1,
    });
    let startFrame = 'rune_protect_large.png'
    globalObjects.runePicture.setFrame(startFrame).setRotation(0);

    let tutTitleText = PhaserScene.add.text(gameConsts.halfWidth - 143, gameConsts.halfHeight - 285, 'SHIELD RUNE SPELLS', {fontFamily: 'Verdana', fontSize: 23, color: '#2A1122', align: 'left'}).setScale(1).setDepth(10001).setOrigin(0.5, 0.5);
    let tutRune = PhaserScene.add.sprite(gameConsts.halfWidth - 205, gameConsts.halfHeight - 200, 'tutorial', startFrame).setScale(0.96).setAlpha(0.5).setDepth(10001);
    let runeClicker1 = buildRuneclicker(tutRune.x, tutRune.y, () => {
        tutText.setText(initTutText);
        globalObjects.runePicture.setFrame(startFrame).setRotation(0);
    })

    let tutRune2 = PhaserScene.add.sprite(gameConsts.halfWidth - 0, gameConsts.halfHeight - 200, 'tutorial', 'rune_matter_large.png').setScale(0.96).setAlpha(0.5).setDepth(10001);
    let runeClicker2 = buildRuneclicker(tutRune2.x, tutRune2.y, () => {
        tutText.setText(firstText);
        globalObjects.runePicture.setFrame('tut_matter_shield.png').setRotation(-0.1);
    })

    globalObjects.runeHighlight.setVisible(true).setScale(1).setPosition(tutRune2.x, tutRune2.y);
    tutText.setText(firstText);
    globalObjects.runePicture.setFrame('tut_matter_shield.png').setRotation(-0.1);

    let tutRune3 = PhaserScene.add.sprite(gameConsts.halfWidth + 150, gameConsts.halfHeight - 200, 'tutorial', 'rune_energy_large.png').setScale(0.96).setAlpha(0.5).setDepth(10001);
    let runeClicker3 = buildRuneclicker(tutRune3.x, tutRune3.y, () => {
        tutText.setText(secondText);
        globalObjects.runePicture.setFrame('tut_mind_shield.png').setRotation(-0.1);
    })

    buildTutorialBasic([tutTitleText, tutRune, tutRune2, tutRune3, tutText], [runeClicker1, runeClicker2, runeClicker3, clickBlocker]);
}

function buildTutorialReinforce() {
    let clickBlocker = buildClickblocker();
    let initTutText = getLangText('reinforce_tut_desc');
    let firstText = getLangText('matter_tut_reinforce_desc');
    let secondText = getLangText('mind_tut_reinforce_desc');

    let tutText = PhaserScene.add.text(gameConsts.halfWidth - 125, gameConsts.halfHeight - 75, initTutText, {fontFamily: 'Verdana', fontSize: 22, color: '#2A1122', align: 'left'}).setDepth(10001).setOrigin(0, 0.34);
    globalObjects.runePicture.setVisible(true).setAlpha(0).setScale(0.96);
    PhaserScene.tweens.add({
        delay: 1,
        targets: [tutText, globalObjects.runePicture],
        alpha: 1,
        scaleX: 1,
        scaleY: 1,
        duration: 1,
    });
    let startFrame = 'rune_reinforce_large.png'
    globalObjects.runePicture.setFrame(startFrame).setRotation(0);

    let tutTitleText = PhaserScene.add.text(gameConsts.halfWidth - 143, gameConsts.halfHeight - 285, 'BODY RUNE SPELLS', {fontFamily: 'Verdana', fontSize: 23, color: '#2A1122', align: 'left'}).setScale(1).setDepth(10001).setOrigin(0.5, 0.5);
    let tutRune = PhaserScene.add.sprite(gameConsts.halfWidth - 205, gameConsts.halfHeight - 200, 'tutorial', startFrame).setScale(0.96).setAlpha(0.5).setDepth(10001);
    let runeClicker1 = buildRuneclicker(tutRune.x, tutRune.y, () => {
        tutText.setText(initTutText);
        globalObjects.runePicture.setFrame(startFrame).setRotation(0);
    })

    let tutRune2 = PhaserScene.add.sprite(gameConsts.halfWidth - 0, gameConsts.halfHeight - 200, 'tutorial', 'rune_matter_large.png').setScale(0.96).setAlpha(0.5).setDepth(10001);
    let runeClicker2 = buildRuneclicker(tutRune2.x, tutRune2.y, () => {
        tutText.setText(firstText);
        globalObjects.runePicture.setFrame('tut_matter_reinforce.png').setRotation(-0.1);
    })

    globalObjects.runeHighlight.setVisible(true).setScale(1).setPosition(tutRune2.x, tutRune2.y);
    tutText.setText(firstText);
    globalObjects.runePicture.setFrame('tut_matter_reinforce.png').setRotation(-0.1);

    let tutRune3 = PhaserScene.add.sprite(gameConsts.halfWidth + 150, gameConsts.halfHeight - 200, 'tutorial', 'rune_energy_large.png').setScale(0.96).setAlpha(0.5).setDepth(10001);
    let runeClicker3 = buildRuneclicker(tutRune3.x, tutRune3.y, () => {
        tutText.setText(secondText);
        globalObjects.runePicture.setFrame('tut_mind_reinforce.png').setRotation(-0.1);
    })

    buildTutorialBasic([tutTitleText, tutRune, tutRune2, tutRune3, tutText], [runeClicker1, runeClicker2, runeClicker3, clickBlocker]);
}

function buildTutorialUnload() {
    let clickBlocker = buildClickblocker();
    let initTutText = getLangText('unload_tut_desc');
    let firstText = getLangText('matter_tut_unload_desc');
    let secondText = getLangText('mind_tut_unload_desc');
    let thirdText = getLangText('time_tut_unload_desc');
    let fourthText = getLangText('void_tut_unload_desc');

    let tutText = PhaserScene.add.text(gameConsts.halfWidth - 125, gameConsts.halfHeight - 75, initTutText, {fontFamily: 'Verdana', fontSize: 22, color: '#2A1122', align: 'left'}).setDepth(10001).setOrigin(0, 0.34);
    globalObjects.runePicture.setVisible(true).setAlpha(0).setScale(0.96);
    PhaserScene.tweens.add({
        delay: 1,
        targets: [tutText, globalObjects.runePicture],
        alpha: 1,
        scaleX: 1,
        scaleY: 1,
        duration: 1,
    });
    let startFrame = 'rune_unload_large.png'
    globalObjects.runePicture.setFrame(startFrame).setRotation(0);

    let tutTitleText = PhaserScene.add.text(gameConsts.halfWidth - 143, gameConsts.halfHeight - 285, 'ULTIMATE RUNE SPELLS', {fontFamily: 'Verdana', fontSize: 23, color: '#2A1122', align: 'left'}).setScale(1).setDepth(10001).setOrigin(0.5, 0.5);
    let tutRune = PhaserScene.add.sprite(gameConsts.halfWidth - 205, gameConsts.halfHeight - 200, 'tutorial', startFrame).setScale(0.96).setAlpha(0.5).setDepth(10001);
    let runeClicker1 = buildRuneclicker(tutRune.x, tutRune.y, () => {
        tutText.setText(initTutText);
        globalObjects.runePicture.setFrame(startFrame).setRotation(0);
    })

    let tutRune2 = PhaserScene.add.sprite(gameConsts.halfWidth - 50, gameConsts.halfHeight - 200, 'tutorial', 'rune_matter_large.png').setScale(0.96).setAlpha(0.5).setDepth(10001);
    let runeClicker2 = buildRuneclicker(tutRune2.x, tutRune2.y, () => {
        tutText.setText(firstText);
        globalObjects.runePicture.setFrame('tut_matter_unload.png').setRotation(-0.1);
    })

    globalObjects.runeHighlight.setVisible(true).setScale(1).setPosition(tutRune2.x, tutRune2.y);
    tutText.setText(firstText);
    globalObjects.runePicture.setFrame('tut_matter_unload.png').setRotation(-0.1);

    let tutRune3 = PhaserScene.add.sprite(gameConsts.halfWidth + 30, gameConsts.halfHeight - 200, 'tutorial', 'rune_energy_large.png').setScale(0.96).setAlpha(0.5).setDepth(10001);
    let runeClicker3 = buildRuneclicker(tutRune3.x, tutRune3.y, () => {
        tutText.setText(secondText);
        globalObjects.runePicture.setFrame('tut_mind_unload.png').setRotation(-0.1);
    })

    let tutRune4 = PhaserScene.add.sprite(gameConsts.halfWidth + 110, gameConsts.halfHeight - 200, 'tutorial', 'rune_time_large.png').setScale(0.96).setAlpha(0.5).setDepth(10001);
    let runeClicker4 = buildRuneclicker(tutRune4.x, tutRune4.y, () => {
        tutText.setText(thirdText);
        globalObjects.runePicture.setFrame('tut_time_unload.png').setRotation(-0.1);
    })

    let tutRune5 = PhaserScene.add.sprite(gameConsts.halfWidth + 190, gameConsts.halfHeight - 200, 'tutorial', 'rune_void_large.png').setScale(0.96).setAlpha(0.5).setDepth(10001);
    let runeClicker5 = buildRuneclicker(tutRune5.x, tutRune5.y, () => {
        tutText.setText(fourthText);
        globalObjects.runePicture.setFrame('tut_void_unload.png').setRotation(-0.1);
    })

    buildTutorialBasic([tutTitleText, tutRune, tutRune2, tutRune3, tutRune4, tutRune5, tutText], [runeClicker1, runeClicker2, runeClicker3, runeClicker4, runeClicker5, clickBlocker]);
}
