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
    globalObjects.cutsceneBack.setDepth(CUTSCENE_DEPTH + 2);
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

function tryRunCutscene1End(bgMusic, wind) {
    if (globalObjects.cutSceneAnim) {
        globalObjects.cutSceneAnim.stop();
        delete globalObjects.cutSceneAnim;
    }
    if (globalObjects.cutSceneLastClicked && globalObjects.cutSceneLastTweened && !globalObjects.isCutsceneLastRunning) {
        globalObjects.isCutsceneLastRunning = true;
        let cutsceneBG2 = setCutscene2('ending_1_blue.png');
        cutsceneBG2.setScale(0.78).setAlpha(0).setDepth(CUTSCENE_DEPTH + 1);
        PhaserScene.time.delayedCall(800, () => {
            globalObjects.bannerTextManager.setDialog([getLangText('epilogue1d'), getLangText('epilogue1e')]);
            globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.height - 58, 0);
            globalObjects.bannerTextManager.showBanner(false);
            globalObjects.bannerTextManager.setOnFinishFunc(() => {
                fadeAwaySound(wind, 3400, 'Quad.easeIn');
                fadeAwaySound(bgMusic, 3400, 'Quad.easeIn');
                globalObjects.cutSceneLastClicked = false;
                globalObjects.cutSceneLastTweened = false;
                globalObjects.isCutsceneLastRunning = false;
                PhaserScene.tweens.add({
                    targets: globalObjects.cutsceneBack,
                    alpha: 1,
                    ease: 'Quad.easeInOut',
                    duration: 2500,
                    onComplete: () => {
                        rollCredits();
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
        duration: 3000,
        onComplete: () => {
            if (globalObjects.currentEnemy && !globalObjects.currentEnemy.isDestroyed) {
                globalObjects.currentEnemy.destroy();
            }
            let wind = playFakeBGMusic('wind', 0.04, true);
            fadeInSound(wind, 0.55, 1800)

            globalObjects.cutsceneBarTop.y = gameConsts.halfHeight - 272;
            globalObjects.cutsceneBarBot.y = gameConsts.halfHeight + 272;
            globalObjects.cutsceneBarTop.alpha = 1;
            globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.height - 58, 0);
            globalObjects.bannerTextManager.setDialog([getLangText('epilogue1a')]);
            globalObjects.bannerTextManager.setOnFinishFunc(() => {
                let bgMusic = playMusic('sleepless_long', 1);
                setTimeout(() => {
                    globalObjects.bannerTextManager.setDialog([getLangText('epilogue1b'), getLangText('epilogue1c')]);
                    globalObjects.bannerTextManager.setDialogFunc([() => {
                        globalObjects.bannerTextManager.setForcePause(true);
                        setTimeout(() => {
                            globalObjects.bannerTextManager.setForcePause(false);
                        }, 1000)
                    }, () => {
                        globalObjects.bannerTextManager.setForcePause(true);
                        setTimeout(() => {
                            globalObjects.bannerTextManager.setForcePause(false);
                        }, 1000)
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
                                        tryRunCutscene1End(bgMusic, wind);
                                    }
                                });
                            }
                        }
                    }]);
                    globalObjects.bannerTextManager.setOnFinishFunc(() => {
                        globalObjects.cutSceneLastClicked = true;
                        tryRunCutscene1End(bgMusic, wind);
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
                                    tryRunCutscene1End(bgMusic, wind);
                                }
                            });
                        }
                    });
                }, 500);

            })
            globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.height - 58, 0);
            globalObjects.bannerTextManager.showBanner(false);

        }
    });
    // PhaserScene.tweens.add({
    //     targets: globalObjects.cutsceneBarBot,
    //     y: gameConsts.halfHeight + 300,
    //     duration: 2500,
    //     ease: 'Cubic.easeOut'
    // })
}
let bansheeCanTween = false;
function showCutscene2() {
    readyShowCutsceneLogic();
    globalObjects.cutsceneBarTop.y = gameConsts.height;
    globalObjects.cutsceneBarTop.alpha = 0;
    globalObjects.cutsceneBack.alpha = 0;
    let demon = playSound('deepdemon', 0.02, true);
    demon.currSfx = fadeInSound(demon, 0.4, 4000);

    let bansheeGlow = PhaserScene.add.image(gameConsts.halfWidth, 200, 'deathfinal', 'max_death_3_banshee.png').setAlpha(0).setScale(0.6).setDepth(CUTSCENE_DEPTH+3);
    let banshee = PhaserScene.add.image(gameConsts.halfWidth, 200, 'deathfinal', 'max_death_3_banshee.png').setAlpha(0).setScale(0.6).setDepth(CUTSCENE_DEPTH+3);
    globalObjects.cutsceneBack.setDepth(CUTSCENE_DEPTH);
    PhaserScene.tweens.add({
        delay: 400,
        targets: banshee,
        scaleX: 0.85,
        scaleY: 0.85,
        ease: 'Quart.easeInOut',
        duration: 1400,
        onComplete: () => {
            bansheeCanTween = true;
            bansheeGlow.setScale(0.8).setAlpha(1);
            tweenRandomBanshee(bansheeGlow, gameConsts.halfWidth, 200, 0.85)
        }
    })
    PhaserScene.tweens.add({
        delay: 400,
        ease: "Cubic.easeIn",
        targets: banshee,
        alpha: 1,
        duration: 1100,
    })

    PhaserScene.tweens.add({
        targets: globalObjects.cutsceneBack,
        alpha: 1,
        duration: 1100,
        onComplete: () => {
            if (globalObjects.currentEnemy && !globalObjects.currentEnemy.isDestroyed) {
                globalObjects.currentEnemy.destroy();
            }

            globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight + 20, 0);
            globalObjects.bannerTextManager.setDialog([getLangText('death3_angry'), getLangText('death3_angry2'), getLangText('death3_angry3'), getLangText('death3_angry4')]);

            globalObjects.bannerTextManager.setDialogFunc([null, null, () => {
                bansheeCanTween = false;
                PhaserScene.tweens.add({
                    targets: banshee,
                    scaleX: 0.45,
                    scaleY: 0.45,
                    alpha: 0,
                    ease: 'Cubic.easeIn',
                    duration: 1600,
                    onComplete: () => {
                        banshee.destroy();
                    }
                });
            }]);
            globalObjects.bannerTextManager.setOnFinishFunc(() => {
                demon.currSfx.stop();
                demon.currSfx = fadeInSound(demon, 0.1, 1200);
                let whiteDoor = PhaserScene.add.image(gameConsts.halfWidth, 385, 'whitePixel').setDepth(CUTSCENE_DEPTH+3).setAlpha(0.1).setOrigin(0.5, 1);
                PhaserScene.tweens.add({
                    targets: whiteDoor,
                    scaleX: 120,
                    scaleY: 3,
                    alpha: 1,
                    ease: 'Cubic.easeOut',
                    duration: 400,
                    onComplete: () => {
                        PhaserScene.tweens.add({
                            targets: whiteDoor,
                            scaleY: 160,
                            ease: 'Quint.easeOut',
                            duration: 600,
                            onComplete: () => {
                                showLoverApproach(demon);
                                PhaserScene.tweens.add({
                                    delay: 500,
                                    targets: whiteDoor,
                                    alpha: 0,
                                    ease: 'Cubic.easeIn',
                                    duration: 2000,
                                    onComplete: () => {
                                        whiteDoor.destroy();
                                    }
                                })
                            }
                        })
                    }
                })
            })
            globalObjects.bannerTextManager.showBanner(false);

        }
    });
}

function showCutscene3() {
    readyShowCutsceneLogic();
    globalObjects.cutsceneBarTop.y = gameConsts.height;
    globalObjects.cutsceneBarTop.alpha = 0;
    globalObjects.cutsceneBack.alpha = 0;
    PhaserScene.tweens.add({
        targets: globalObjects.cutsceneBack,
        alpha: 1,
        duration: 3800,
        ease: 'Quad.easeInOut',
        onComplete: () => {
            if (globalObjects.currentEnemy) {
                globalObjects.currentEnemy.destroy();
            }
            let promptText = PhaserScene.add.text(gameConsts.halfWidth, gameConsts.height - 40, getLangText('click_to_continue'), {fontFamily: 'garamondmax', fontSize: 22, color: '#FFFFFF', align: 'center'}).setDepth(CUTSCENE_DEPTH+6).setOrigin(0.5, 0).setAlpha(0);
            promptText.currAnim = PhaserScene.tweens.add({
                delay: 4000,
                targets: promptText,
                alpha: 0.5,
                duration: 2500
            })
            globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight, 0);
            globalObjects.bannerTextManager.setDialog([getLangText('reunite_beloved')]);
            globalObjects.bannerTextManager.showBanner(false);
            globalObjects.bannerTextManager.setOnFinishFunc(() => {
                playSound('water_drop', 0.4)
                promptText.currAnim.stop();
                promptText.destroy();
                let bgMusic = playMusic('death3_harp', 0.65, true);
                playSound('flip3');

                globalObjects.cutsceneBarTop.y = gameConsts.halfHeight - 318;
                globalObjects.cutsceneBarBot.y = gameConsts.halfHeight + 278;
                globalObjects.cutsceneBarTop.alpha = 1;
                let cutsceneBG2 = setCutscene2('ending_3b.png');
                cutsceneBG2.alpha = 0;
                let cutsceneBG1 = setCutscene1('ending_3a.png');
                cutsceneBG1.alpha = 0;
                cutsceneBG1.setRotation(0.09).setPosition(gameConsts.halfWidth, gameConsts.halfHeight + 32).setScale(1.11);
                cutsceneBG2.setRotation(0.09).setPosition(gameConsts.halfWidth, gameConsts.halfHeight + 32).setScale(1.11);
                PhaserScene.tweens.add({
                    targets: cutsceneBG1,
                    alpha: 1,
                    duration: 1000,
                });
                cutsceneBG1.currAnim = PhaserScene.tweens.add({
                    targets: [cutsceneBG1, cutsceneBG2],
                    rotation: 0,
                    duration: 12000,
                    y: "-=50",
                    scaleX: 0.96,
                    scaleY: 0.97,
                    ease: 'Quart.easeInOut'
                });
                PhaserScene.tweens.add({
                    targets: globalObjects.cutsceneBarTop,
                    y: "-=50",
                    ease: 'Quart.easeInOut'
                });

                setTimeout(() => {
                    globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.height - 58, 0);
                    globalObjects.bannerTextManager.setDialog([getLangText('death3_talk'), getLangText('death3_talk2'), getLangText('death3_say'), getLangText('death3_letgo')]);
                    globalObjects.bannerTextManager.setDialogFunc([() => {
                        globalObjects.bannerTextManager.setForcePause(true);
                        setTimeout(() => {
                            globalObjects.bannerTextManager.setForcePause(false);
                        }, 1500)
                    }, () => {
                        cutsceneBG1.setDepth(CUTSCENE_DEPTH)
                        cutsceneBG2.setDepth(CUTSCENE_DEPTH + 1)
                        PhaserScene.tweens.add({
                            targets: cutsceneBG2,
                            alpha: 1,
                            ease: 'Cubic.easeInOut',
                            duration: 700,
                        });
                        globalObjects.bannerTextManager.setForcePause(true);
                        setTimeout(() => {
                            globalObjects.bannerTextManager.setForcePause(false);
                        }, 1500)
                    },
                        () => {
                            cutsceneBG2.setDepth(CUTSCENE_DEPTH)
                            cutsceneBG1.setDepth(CUTSCENE_DEPTH + 1).setAlpha(0)
                            PhaserScene.tweens.add({
                                targets: cutsceneBG1,
                                alpha: 1,
                                ease: 'Cubic.easeInOut',
                                duration: 800,
                            });
                            globalObjects.bannerTextManager.setForcePause(true);
                            setTimeout(() => {
                                globalObjects.bannerTextManager.setForcePause(false);
                            }, 1500)
                        },
                    () => {
                        cutsceneBG2.setDepth(CUTSCENE_DEPTH + 1).setAlpha(0).setFrame('ending_3c.png')
                        cutsceneBG1.setDepth(CUTSCENE_DEPTH)
                        PhaserScene.tweens.add({
                            targets: cutsceneBG2,
                            alpha: 1,
                            duration: 1000,
                        });
                        globalObjects.bannerTextManager.setForcePause(true);
                        setTimeout(() => {
                            globalObjects.bannerTextManager.setForcePause(false);
                        }, 1500)
                    }]);
                    globalObjects.bannerTextManager.setOnFinishFunc(() => {
                        if (cutsceneBG1.currAnim) {
                            cutsceneBG1.currAnim.stop();
                        }
                        globalObjects.cutSceneLastClicked = true;
                        cutsceneBG2.setDepth(CUTSCENE_DEPTH)
                        cutsceneBG1.setDepth(CUTSCENE_DEPTH + 1).setAlpha(0).setFrame('ending_3d.png');
                        PhaserScene.tweens.add({
                            targets: globalObjects.cutsceneBarBot,
                            y: "+=40",
                            ease: 'Cubic.easeInOut',
                            duration: 1000,
                        })
                        PhaserScene.tweens.add({
                            targets: cutsceneBG1,
                            scaleX: 0.95,
                            scaleY: 0.96,
                            rotation: 0,
                            alpha: 1,
                            ease: 'Cubic.easeInOut',
                            duration: 1290,
                            completeDelay: 50,
                            onComplete: () => {
                                if (globalObjects.cutsceneBack.currAnim) {
                                    globalObjects.cutsceneBack.currAnim.stop();
                                    delete globalObjects.cutsceneBack.currAnim;
                                    PhaserScene.tweens.add({
                                        targets: globalObjects.cutsceneBack,
                                        alpha: 0,
                                        duration: 500,
                                    });
                                }
                                fadeAwaySound(bgMusic, 5000, 'Quad.easeIn');
                                let whiteBG = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'whitePixel').setDepth(CUTSCENE_DEPTH + 2).setScale(500);
                                whiteBG.setAlpha(0);

                                PhaserScene.tweens.add({
                                    delay: 400,
                                    targets: whiteBG,
                                    alpha: 1,
                                    ease: 'Quad.easeInOut',
                                    duration: 4000,
                                    onComplete: () => {
                                        this.cleanupCutscene();
                                        this.playFinalScene();
                                        PhaserScene.tweens.add({
                                            targets: whiteBG,
                                            alpha: 0,
                                            duration: 2000,
                                            ease: 'Quad.easeOut',
                                            onComplete: () => {
                                                whiteBG.destroy();
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    })

                    globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.height - 58, 0);
                    globalObjects.bannerTextManager.showBanner(false);
                }, 1400)

                globalObjects.cutsceneBack.currAnim = PhaserScene.tweens.add({
                    targets: globalObjects.cutsceneBack,
                    alpha: 0,
                    duration: 6000,
                });
            })
        }
    });
}

function showLoverApproach(demonsfx) {
    let star = PhaserScene.add.image(gameConsts.halfWidth, 225, 'blurry', 'star_blur.png').setAlpha(1).setScale(0.4).setDepth(CUTSCENE_DEPTH+2).setOrigin(0.5, 0.5);
    let lover = PhaserScene.add.image(gameConsts.halfWidth, 150, 'ending', 'ending2_a.png').setAlpha(0).setScale(0.4).setDepth(CUTSCENE_DEPTH+3).setOrigin(0.5, 0.1);
    let horror = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'blurry', 'static0.png').setAlpha(0).setScale(1.85, 3.6).setDepth(CUTSCENE_DEPTH+3);
    let blotter = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'blurry', 'static7.png').setAlpha(0).setScale(5.2).setDepth(CUTSCENE_DEPTH+3);
    //let sleepless = playSound('sleepless');
    playSound('locket_open');
    playSound('water_drop', 0.25);
    PhaserScene.tweens.add({
        targets: star,
        scaleX: 0.8,
        scaleY: 0.8,
        ease: 'Cubic.easeIn',
        duration: 700,
        onComplete: () => {
            //fadeAwaySound(sleepless, 5500, 'Quad.easeOut');
            PhaserScene.tweens.add({
                targets: star,
                scaleX: 0.4,
                scaleY: 0.4,
                ease: 'Cubic.easeOut',
                duration: 600,
                onComplete: () => {
                    star.destroy();
                }
            })
        }
    })

    PhaserScene.tweens.add({
        targets: lover,
        alpha: 1,
        ease: 'Quad.easeOut',
        duration: 1000,
    });
    shakeStatic(horror);
    shakeStatic2(blotter);
    PhaserScene.time.delayedCall(3000, () => {
        blotter.setAlpha(0.25);
        //globalObjects.cutsceneBack.setDepth(CUTSCENE_DEPTH + 4);
        setTimeout(() => {
            blotter.setAlpha(0);
            //globalObjects.cutsceneBack.setDepth(CUTSCENE_DEPTH);
        }, 20)
        PhaserScene.time.delayedCall(1500, () => {
            blotter.setAlpha(0.3);
            //globalObjects.cutsceneBack.setDepth(CUTSCENE_DEPTH + 4);
            setTimeout(() => {
                blotter.setAlpha(0);
                //globalObjects.cutsceneBack.setDepth(CUTSCENE_DEPTH);

            }, 20)

        });
        PhaserScene.time.delayedCall(1800, () => {
            lover.setFrame('ending2_b.png').setOrigin(0.5, 0.1);

            blotter.alpha = 0.25;
            //globalObjects.cutsceneBack.setDepth(CUTSCENE_DEPTH + 4);
            setTimeout(() => {
                lover.setFrame('ending2_a.png').setOrigin(0.5, 0.1);
                blotter.scaleX = -blotter.scaleX;
                //globalObjects.cutsceneBack.setDepth(CUTSCENE_DEPTH);
                setTimeout(() => {
                    blotter.alpha = 0;
                }, 50)
            }, 30)
        });
    });
    animateStatic(horror, 0.3, 1.75, 2.4, 5000);
    setTimeout(() => {
        demonsfx.currSfx = fadeInSound(demonsfx, 1, 5000)
    }, 2500)

    PhaserScene.tweens.add({
        targets: lover,
        scaleX: 0.73,
        scaleY: 0.73,
        duration: 5100,
        onComplete: () => {
            lover.setFrame('ending2_b.png').setOrigin(0.5, 0.3);
            blotter.setAlpha(0.6).setScale(2.4);
            setTimeout(() => {
                blotter.x = gameConsts.halfWidth - 100;
                lover.setFrame('ending2_a.png').setOrigin(0.5, 0.1);
                setTimeout(() => {
                    blotter.x = gameConsts.halfWidth + 50;
                    blotter.setScale(2.65, -2.65)
                    setTimeout(() => {
                        blotter.setAlpha(0);
                    }, 40)
                }, 40)
            }, 50)

            horror.setAlpha(0.6);
            horror.setFrame('static2.png')
            animateStatic(horror, 1, 1.72, 1.6,4500);
            PhaserScene.time.delayedCall(2400, () => {
                lover.setFrame('ending2_b.png').setOrigin(0.5, 0.1);
                blotter.setAlpha(0.3);
                animateStatic(blotter, 1, 1.65, 1.7,3500);
                globalObjects.cutsceneBack.setDepth(CUTSCENE_DEPTH + 4);
                setTimeout(() => {
                    lover.setFrame('ending2_a.png').setOrigin(0.5, 0.1);

                    globalObjects.cutsceneBack.setDepth(CUTSCENE_DEPTH);
                    setTimeout(() => {
                        lover.setFrame('ending2_b.png').setOrigin(0.5, 0.02);
                            setTimeout(() => {
                                lover.setFrame('ending2_a.png').setOrigin(0.5, 0.1).setAlpha(0.7);
                                setTimeout(() => {
                                    lover.setFrame('ending2_b.png').setOrigin(0.5, 0.1).setAlpha(0.9);
                                    PhaserScene.tweens.add({
                                        targets: lover,
                                        alpha: 0.75,
                                        duration: 2700,
                                    })
                                }, 1700)
                            }, 100)
                        }, 60)

                }, 80)
            })
            lover.setScale(0.8);
            PhaserScene.tweens.add({
                targets: lover,
                scaleX: 1,
                scaleY: 1,
                ease: 'Quad.easeOut',
                duration: 5700,
                onComplete: () => {
                    stopHorror = true;
                    lover.destroy();
                    blotter.destroy();
                    horror.destroy();
                    globalObjects.cutsceneBack.setDepth(CUTSCENE_DEPTH + 4);
                    playSound('click')

                    // ', yet no longer able to die,\nyou and your lover live the rest of\neternity without ever '
                    let closeText = PhaserScene.add.text(gameConsts.halfWidth, gameConsts.height - 320, getLangText('badend_1'), {fontFamily: 'garamondmax', fontSize: 26, color: '#FFFFFF', align: 'center'}).setDepth(CUTSCENE_DEPTH + 4).setAlpha(0).setOrigin(0.5, 0);
                    let closeText2 = PhaserScene.add.text(gameConsts.halfWidth, gameConsts.height - 285, getLangText('badend_2'), {fontFamily: 'garamondmax', fontSize: 26, color: '#FFFFFF', align: 'center'}).setDepth(CUTSCENE_DEPTH + 4).setAlpha(0).setOrigin(0.5, 0);
                    let closeText3 = PhaserScene.add.text(gameConsts.halfWidth, gameConsts.height - 250, getLangText('badend_3'), {fontFamily: 'garamondmax', fontSize: 26, color: '#FFFFFF', align: 'center'}).setDepth(CUTSCENE_DEPTH + 4).setAlpha(0).setOrigin(0.5, 0);
                    let closeText4 = PhaserScene.add.text(gameConsts.halfWidth, gameConsts.height - 215, getLangText('badend_4'), {fontFamily: 'garamondmax', fontSize: 26, color: '#FFFFFF', align: 'center'}).setDepth(CUTSCENE_DEPTH + 4).setAlpha(0).setOrigin(0.5, 0);
                    let closeText5 = PhaserScene.add.text(gameConsts.halfWidth, gameConsts.height - 180, getLangText('badend_5'), {fontFamily: 'garamondmax', fontSize: 26, color: '#FFFFFF', align: 'center'}).setDepth(CUTSCENE_DEPTH + 4).setAlpha(0).setOrigin(0.5, 0);
                    let closeText6 = PhaserScene.add.text(gameConsts.halfWidth, gameConsts.height - 30, 'Ending 2\nEternal Unrest', {fontFamily: 'garamondmax', fontSize: 32, color: '#FFFFFF', align: 'center'}).setDepth(CUTSCENE_DEPTH + 4).setAlpha(0).setOrigin(0.5, 1);
                    PhaserScene.tweens.add({
                        delay: 800,
                        targets: closeText,
                        alpha: 1,
                        duration: 1500,
                        onComplete: () => {
                            PhaserScene.tweens.add({
                                delay: 1400,
                                targets: closeText2,
                                alpha: 1,
                                duration: 1500,
                                onComplete: () => {
                                    PhaserScene.tweens.add({
                                        delay: 1700,
                                        targets: closeText3,
                                        alpha: 1,
                                        duration: 1500,
                                        onComplete: () => {
                                            PhaserScene.tweens.add({
                                                delay: 3000,
                                                targets: closeText4,
                                                alpha: 1,
                                                duration: 1000,
                                                onComplete: () => {
                                                    PhaserScene.tweens.add({
                                                        delay: closeText5.text.length < 1 ? 10 : 2000,
                                                        targets: closeText5,
                                                        alpha: 1,
                                                        duration: closeText5.text.length < 1 ? 500 : 1000,
                                                        onComplete: () => {
                                                            PhaserScene.tweens.add({
                                                                delay: 3000,
                                                                targets: closeText6,
                                                                alpha: 1,
                                                                duration: 1000,
                                                                onComplete: () => {
                                                                    let clickBlocker = createGlobalClickBlocker(true);
                                                                    clickBlocker.setOnMouseUpFunc(() => {
                                                                        hideGlobalClickBlocker();
                                                                        let darkBG = getBackgroundBlackout();
                                                                        darkBG.setAlpha(1).setDepth(CUTSCENE_DEPTH);
                                                                        PhaserScene.tweens.add({
                                                                            targets: [closeText, closeText2, closeText3, closeText4, closeText5, closeText6, globalObjects.cutsceneBack],
                                                                            alpha: 0,
                                                                            duration: 750,
                                                                            onComplete: () => {
                                                                                closeText.destroy();
                                                                                closeText2.destroy();
                                                                                closeText3.destroy();
                                                                                closeText4.destroy();
                                                                                closeText5.destroy();
                                                                                closeText6.destroy();
                                                                                demonsfx.destroy();
                                                                                gotoMainMenu();
                                                                                setTimeout(() => {
                                                                                    playSound('emergency', 1.5)
                                                                                    playSound('death_cast', 0.15);
                                                                                }, 500)
                                                                                PhaserScene.tweens.add({
                                                                                    targets: [darkBG],
                                                                                    alpha: 0,
                                                                                    ease: 'Cubic.easeIn',
                                                                                    duration: 1000,
                                                                                });
                                                                            }
                                                                        });
                                                                    });
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })

                }
            })
        }
    })
}

function animateStatic(horror, amt, scaleX, scaleY, dur) {
    PhaserScene.tweens.add({
        targets: horror,
        alpha: amt,
        scaleX: scaleX,
        scaleY: scaleY,
        duration: dur,
        onComplete: () => {
        }
    })
}
let stopHorror = false;
function shakeStatic(horror) {
    stopHorror = false;
    horror.y = gameConsts.halfHeight + 500 * (Math.random() - 0.5)
    setTimeout(() => {
        if (stopHorror) {
            return;
        }
        shakeStatic(horror);
    }, 30)
}

function shakeStatic2(horror) {
    stopHorror = false;
    horror.y = gameConsts.halfHeight + 100 * (Math.random() - 0.5)
    horror.x = gameConsts.halfWidth + 500 * (Math.random() - 0.5)
    setTimeout(() => {
        if (stopHorror) {
            return;
        }
        shakeStatic(horror);
    }, 30)
}


function tweenRandomBanshee(image, x, y, scale) {
    if (!bansheeCanTween) {
        PhaserScene.tweens.add({
            targets: image,
            alpha: 0,
            duration: 700,
            onComplete: () => {
                image.destroy();
            }
        })
        return;
    }
    PhaserScene.tweens.add({
        targets: image,
        alpha: 0,
        x: x + (Math.random() - 0.5) * 35,
        y: y + (Math.random() - 0.5) * 35 + 5,
        scaleY: scale + 0.05,
        duration: 1000,
        onComplete: () => {
            if (!bansheeCanTween) {
                image.setScale(scale).setPosition(x, y).setAlpha(1);
            }
            tweenRandomBanshee(image, x, y, scale)
        }
    })
}

function playFinalScene() {
    playSound('whoosh');
    globalObjects.menuBack.origDepth = globalObjects.menuBack.depth;
    globalObjects.menuTop.origDepth = globalObjects.menuTop.depth;
    globalObjects.menuBack.setAlpha(1).setScale(1.3).setVisible(true).setPosition(gameConsts.halfWidth, gameConsts.halfHeight - 80).setDepth(CUTSCENE_DEPTH);
    globalObjects.menuTop.setAlpha(1).setScale(1.3).setVisible(true).setPosition(gameConsts.halfWidth, gameConsts.halfHeight - 80).setDepth(CUTSCENE_DEPTH);
    PhaserScene.tweens.add({
        targets: [globalObjects.menuBack, globalObjects.menuTop],
        y: gameConsts.halfHeight,
        scaleX: 0.91,
        scaleY: 0.91,
        duration: 900,
        ease: 'Quart.easeOut',
        completeDelay: 900,
        onComplete: () => {
            showFinalLocket()
        }
    })
}

function showFinalLocket() {
    let darkBG = getBackgroundBlackout().setDepth(CUTSCENE_DEPTH+1).setScale(500).setAlpha(0);
    globalObjects.gameLocketOpen = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.height + 180, 'misc', 'locket3.png').setScale(0.8).setDepth(CUTSCENE_DEPTH+1);
    globalObjects.gameLocketOpen.origY = gameConsts.halfHeight - 50;
    globalObjects.gameLocketOpenLight = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.height + 180, 'misc', 'locketwhite.png').setScale(0.8).setDepth(CUTSCENE_DEPTH+1).setAlpha(0);
    let closeText = PhaserScene.add.text(gameConsts.halfWidth, gameConsts.height - 80, getLangText('put_away_locket'), {fontFamily: 'garamondmax', fontSize: 32, color: '#FFFFFF', align: 'center'}).setDepth(CUTSCENE_DEPTH+1).setOrigin(0.5, 0).setAlpha(0);
    let windSFX = playMusic('wind', 0.05, true);
    windSFX.volume = 0.05;
    windSFX.detune = -500;
    setTimeout(() => {
        fadeInSound(windSFX, 0.5, 2000);
    }, 100)
    PhaserScene.tweens.add({
        targets: darkBG,
        alpha: 0.65,
        duration: 750
    });

    PhaserScene.tweens.add({
        targets: [globalObjects.gameLocketOpen, globalObjects.gameLocketOpenLight],
        y: globalObjects.gameLocketOpen.origY,
        ease: 'Quint.easeOut',
        scaleX: 1, scaleY: 1,
        duration: 850,
        onComplete: () => {
            updateManager.addFunction(locketFlash);
            closeText.currAnim = PhaserScene.tweens.add({
                delay: 1000,
                targets: closeText,
                alpha: 0.75,
                duration: 1000,
                onStart: () => {
                    globalObjects.bannerTextManager.setDialog([".", "."]);
                    globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.height + 230, 0);
                    globalObjects.bannerTextManager.setDialogFunc([null, () => {
                        playSound('deep_swish', 0.5)
                        globalObjects.gameLocketOpen.shakey = true;
                        if (closeText.currAnim) {
                            closeText.currAnim.stop();
                        }
                        closeText.currAnim = PhaserScene.tweens.add({
                            targets: closeText,
                            alpha: 0,
                            duration: 400,
                        });
                        globalObjects.gameLocketOpen.scaleX = 0.91;
                        globalObjects.gameLocketOpen.currAnim = PhaserScene.tweens.add({
                            targets: [globalObjects.gameLocketOpen, globalObjects.gameLocketOpenLight],
                            scaleX: 1,
                            scaleY: 1,
                            duration: 400,
                            ease: 'Cubic.easeInOut'
                        });
                    }
                    ]);
                    globalObjects.bannerTextManager.setOnFinishFunc(() => {
                        updateManager.removeFunction(locketFlash);
                        if (closeText.currAnim) {
                            closeText.currAnim.stop();
                            delete closeText.currAnim;
                        }
                        PhaserScene.tweens.add({
                            targets: [closeText],
                            alpha: 0,
                            duration: 200,
                            completeDelay: 800,
                            onComplete: () => {
                                closeText.destroy();
                                darkBG.alpha = 1;
                                darkBG.setDepth(CUTSCENE_DEPTH+3);
                                globalObjects.menuBack.setDepth(globalObjects.menuBack.origDepth);
                                globalObjects.menuTop.setDepth(globalObjects.menuTop.origDepth);
                                globalObjects.gameLocketOpen.destroy();
                                this.rollCredits();
                                fadeAwaySound(windSFX, 350);
                            }
                        });
                        if (globalObjects.gameLocketOpen.currAnim) {
                            globalObjects.gameLocketOpen.currAnim.stop();
                            delete globalObjects.gameLocketOpen.currAnim;
                        }
                        globalObjects.gameLocketOpenLight.destroy();
                        globalObjects.gameLocketOpen.shakey = false;
                        PhaserScene.tweens.add({
                            targets: [globalObjects.gameLocketOpen, globalObjects.gameLocketOpenLight],
                            scaleX: 0.97,
                            scaleY: 1,
                            ease: 'Quart.easeOut',
                            duration: 220,
                            onComplete: () => {
                                setTimeout(() => {
                                    globalObjects.gameLocketOpen.setFrame('locket4.png');
                                    playSound('locket_close');
                                }, 150)
                                PhaserScene.tweens.add({
                                    targets: globalObjects.gameLocketOpen,
                                    scaleX: 0.96,
                                    scaleY: 0.96,
                                    y: "+=12",
                                    ease: 'Quart.easeOut',
                                    duration: 170,
                                    onComplete: () => {
                                        PhaserScene.tweens.add({
                                            targets: globalObjects.gameLocketOpen,
                                            scaleX: 1,
                                            scaleY: 1,
                                            y: "-=7",
                                            ease: 'Quart.easeIn',
                                            duration: 100,
                                        });
                                    }
                                });
                            }
                        });
                    })
                    globalObjects.bannerTextManager.showBanner(false);
                }
            });
        }
    });
}

function cleanupCutscene() {
    if (globalObjects.cutsceneBack) {
        PhaserScene.tweens.add({
            targets: [globalObjects.cutsceneBack],
            alpha: 0,
            duration: 750,
            onComplete: () => {
                globalObjects.cutsceneBack.destroy();
                delete globalObjects.cutsceneBack;
            }
        });
        globalObjects.cutsceneBarTop.destroy();
        globalObjects.cutsceneBarBot.destroy();
        delete globalObjects.cutsceneBarTop;
        delete globalObjects.cutsceneBarBot;
    }

    if (globalObjects.cutsceneBG1) {
        globalObjects.cutsceneBG1.destroy();
        delete globalObjects.cutsceneBG1;
    }
    if (globalObjects.cutsceneBG2) {
        globalObjects.cutsceneBG2.destroy();
        delete globalObjects.cutsceneBG2;
    }
}

function rollCredits() {
    let darkBG = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setScale(500).setDepth(CUTSCENE_DEPTH);
    globalObjects.encyclopedia.hideButton();
    globalObjects.options.hideButton();
    PhaserScene.tweens.add({
        targets: [darkBG],
        alpha: 1,
        duration: 1000,
    });
    let bgMusic = playMusic('death3_harp', 0.1);
    fadeInSound(bgMusic, 0.8, 3000);
    let textCredits = [
        "Game by Maxim Tsai",
        "Character art by Theresa Kao @mothmeatstore",
        "Background and wheel art by Alex Volchek @love_sickening",
        "SFX and battle music by Chandler G @rocad_guitar",
        "Robot voice and music by @eidendalion",
        "Special thanks to @hby, Victor Kao, and Alex Arango",
        " \nRandom Stats:\n- Game Engine: Phaser 3\n- Sprites: +1000\n- Audio files: +160\n- Lines of code: ~40,000\n- Development time: 10 months",
    ];
    let textObjects = [];
    let textAnims = [];
    let clickBlocker = createGlobalClickBlocker(true);


    for (let i = 0; i < textCredits.length; i++) {
        let nextYPos = 25 + i * 35;
        let nextText = PhaserScene.add.text(25, nextYPos, textCredits[i], {fontFamily: 'garamondmax', fontSize: 24, color: '#FFFFFF', align: 'left'}).setDepth(CUTSCENE_DEPTH+6).setOrigin(0, 0).setAlpha(0);
        nextText.scaleX = 0.95;
        textObjects.push(nextText);
        let tweenObjData = {
            delay: 100 + i * 2800,
            targets: nextText,
            alpha: 1,
            duration: 1200,
        }
        if (i === textCredits.length - 1) {
            tweenObjData.onComplete = () => {
                let menuText = PhaserScene.add.text(gameConsts.width - 20, gameConsts.height - 20, getLangText('return_menu'), {fontFamily: 'garamondmax', fontSize: 16, color: '#FFFFFF', align: 'riht'}).setDepth(CUTSCENE_DEPTH+6).setOrigin(1, 1).setAlpha(0.6);
                clickBlocker.setOnMouseUpFunc(() => {
                    menuText.destroy();
                    cleanupCutscene()
                    hideGlobalClickBlocker();
                    setupCreditsReturnMainMenu(textObjects);
                    fadeAwaySound(bgMusic, 2000);
                    PhaserScene.tweens.add({
                        targets: darkBG,
                        alpha: 0,
                        duration: 2000,
                        onComplete: () => {
                            darkBG.destroy();
                        }
                    })
                });
            }
        }
        let tweenObj = PhaserScene.tweens.add(tweenObjData);
        textAnims.push(tweenObj);
    }
    clickBlocker.setOnMouseUpFunc(() => {
        for (let i in textAnims) {
            textAnims[i].stop();
        }
        PhaserScene.tweens.add({
            targets: textObjects,
            alpha: 1,
            duration: 750,
        });
        setTimeout(() => {
            let menuText = PhaserScene.add.text(gameConsts.width - 20, gameConsts.height - 20, getLangText('return_menu'), {fontFamily: 'garamondmax', fontSize: 16, color: '#FFFFFF', align: 'riht'}).setDepth(CUTSCENE_DEPTH+6).setOrigin(1, 1).setAlpha(0.6);
            clickBlocker.setOnMouseUpFunc(() => {
                menuText.destroy();
                cleanupCutscene()
                hideGlobalClickBlocker();
                setupCreditsReturnMainMenu(textObjects);
                fadeAwaySound(bgMusic, 2000);
                PhaserScene.tweens.add({
                    targets: darkBG,
                    alpha: 0,
                    duration: 2000,
                    onComplete: () => {
                        darkBG.destroy();
                    }
                })
            });
        }, 450)
        clickBlocker.setOnMouseUpFunc(() => {});
    });
}

function setupCreditsReturnMainMenu(objectsToCleanup) {
    let darkBG = getBackgroundBlackout();
    PhaserScene.tweens.add({
        delay: 250,
        targets: [darkBG],
        alpha: 0,
        ease: 'Cubic.easeIn',
        duration: 1000,
    });
    PhaserScene.tweens.add({
        targets: objectsToCleanup,
        alpha: 0,
        duration: 500,
        onComplete: () => {
            for (let i in objectsToCleanup) {
                objectsToCleanup[i].destroy();
            }
        }
    });
    globalObjects.player.revive();
    gotoMainMenu();
}
