const CUTSCENE_DEPTH = 99999;
function readyShowCutsceneLogic() {
    globalObjects.textPopupManager.hideInfoText();
    globalObjects.bannerTextManager.closeBanner();
    globalObjects.encyclopedia.hideButton();
    globalObjects.options.hideButton();
    globalObjects.magicCircle.disableMovement();
    messageBus.publish('selfClearStatuses');

    if (!globalObjects.cutsceneBarTop) {
        globalObjects.cutsceneBack = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setDepth(CUTSCENE_DEPTH + 2).setScale(500);
        globalObjects.cutsceneBarTop = PhaserScene.add.image(gameConsts.halfWidth, 0, 'blackPixel').setDepth(CUTSCENE_DEPTH + 1).setOrigin(0.5, 1).setScale(500);
        globalObjects.cutsceneBarBot = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.height, 'blackPixel').setDepth(CUTSCENE_DEPTH + 1).setOrigin(0.5, 0).setScale(500);
    }
}

function setCutscene1(name) {
    if (globalObjects.cutsceneBG1) {
        globalObjects.cutsceneBG1.destroy();
    }
    globalObjects.cutsceneBG1 = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'ending', name).setDepth(CUTSCENE_DEPTH);
    return globalObjects.cutsceneBG1;
}

function setCutscene2(name) {
    if (globalObjects.cutsceneBG2) {
        globalObjects.cutsceneBG2.destroy();
    }
    globalObjects.cutsceneBG2 = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'ending', name).setDepth(CUTSCENE_DEPTH);
    return globalObjects.cutsceneBG2;
}

function tryRunCutscene1End() {
    if (globalObjects.cutSceneLastClicked && globalObjects.cutSceneLastTweened && !globalObjects.isCutsceneLastRunning) {
        globalObjects.isCutsceneLastRunning = true;
        let cutsceneBG2 = setCutscene2('ending_1_blue.png');
        cutsceneBG2.setScale(0.78).setAlpha(0).setDepth(CUTSCENE_DEPTH + 1);
        PhaserScene.time.delayedCall(1000, () => {
            globalObjects.bannerTextManager.setDialog([getLangText('epilogue1d'), getLangText('epilogue1e')]);
            globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.height - 58, 0);
            globalObjects.bannerTextManager.showBanner(false);
            globalObjects.bannerTextManager.setOnFinishFunc(() => {
                PhaserScene.tweens.add({
                    targets: globalObjects.cutsceneBack,
                    alpha: 1,
                    ease: 'Quad.easeInOut',
                    duration: 2500,
                    onComplete: () => {

                    }
                });
            });
        });
        PhaserScene.tweens.add({
            targets: cutsceneBG2,
            alpha: 1,
            ease: 'Quad.easeInOut',
            duration: 5000,
            onComplete: () => {
                // globalObjects.cutsceneBack.alpha = 1;

            }
        });
    }
}

function showCutscene1() {
    readyShowCutsceneLogic();
    globalObjects.cutsceneBarTop.y = gameConsts.height;
    globalObjects.cutsceneBarTop.alpha = 0;
    globalObjects.cutsceneBack.alpha = 0;
    PhaserScene.tweens.add({
        targets: globalObjects.cutsceneBack,
        alpha: 1,
        duration: 1500,
        onComplete: () => {
            globalObjects.cutsceneBarTop.y = gameConsts.halfHeight - 272;
            globalObjects.cutsceneBarBot.y = gameConsts.halfHeight + 272;
            globalObjects.cutsceneBarTop.alpha = 1;
            globalObjects.bannerTextManager.setDialog([getLangText('epilogue1a'), getLangText('epilogue1b'), getLangText('epilogue1c')]);
            globalObjects.bannerTextManager.setDialogFunc([null, null, () => {
                if (globalObjects.cutSceneAnim) {
                    let remainingDur = globalObjects.cutSceneAnim.duration - globalObjects.cutSceneAnim.elapsed;
                    if (remainingDur > 100) {
                        globalObjects.cutSceneAnim.stop();
                        PhaserScene.tweens.add({
                            targets: cutsceneBG1,
                            scaleX: 0.78,
                            scaleY: 0.78,
                            x: gameConsts.halfWidth,
                            y: gameConsts.halfHeight,
                            rotation: 0,
                            duration: remainingDur * 0.4,
                            ease: globalObjects.cutSceneAnim.totalProgress > 0.45 ? 'Cubic.easeOut' : 'Cubic.easeInOut',
                            onComplete: () => {
                                globalObjects.cutSceneLastTweened = true;
                                tryRunCutscene1End();
                            }
                        });
                    }
                }
            }]);
            globalObjects.bannerTextManager.setOnFinishFunc(() => {
                globalObjects.cutSceneLastClicked = true;
                tryRunCutscene1End();
            })
            globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.height - 58, 0);
            globalObjects.bannerTextManager.showBanner(false);

            let cutsceneBG1 = setCutscene1('ending_1_pink.png');
            cutsceneBG1.setScale(3).setRotation(0.3).setPosition(gameConsts.halfWidth + 170, gameConsts.halfHeight - 200);
            PhaserScene.tweens.add({
                delay: 600,
                targets: globalObjects.cutsceneBack,
                alpha: 0,
                duration: 6000,
                onStart: () => {
                    globalObjects.cutSceneAnim = PhaserScene.tweens.add({
                        targets: cutsceneBG1,
                        scaleX: 0.78,
                        scaleY: 0.78,
                        x: gameConsts.halfWidth,
                        y: gameConsts.halfHeight,
                        rotation: 0,
                        duration: 15000,
                        ease: 'Cubic.easeInOut',
                        onComplete: () => {
                            globalObjects.cutSceneLastTweened = true;
                            tryRunCutscene1End();
                        }
                    });
                }
            });
        }
    });
    // PhaserScene.tweens.add({
    //     targets: globalObjects.cutsceneBarBot,
    //     y: gameConsts.halfHeight + 300,
    //     duration: 2500,
    //     ease: 'Cubic.easeOut'
    // })
}

function showCutscene2() {
    readyShowCutsceneLogic();
}

function showCutscene3() {
    readyShowCutsceneLogic();
}
