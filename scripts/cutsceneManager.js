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
            globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.height - 58, 0);
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
let bansheeCanTween = false;
function showCutscene2() {
    playSound('sound_of_death');
    readyShowCutsceneLogic();
    globalObjects.cutsceneBarTop.y = gameConsts.height;
    globalObjects.cutsceneBarTop.alpha = 0;
    globalObjects.cutsceneBack.alpha = 0;

    let bansheeGlow = PhaserScene.add.image(gameConsts.halfWidth, 200, 'deathfinal', 'max_death_3_banshee.png').setAlpha(0).setScale(0.6).setDepth(CUTSCENE_DEPTH+3);
    let banshee = PhaserScene.add.image(gameConsts.halfWidth, 200, 'deathfinal', 'max_death_3_banshee.png').setAlpha(0).setScale(0.6).setDepth(CUTSCENE_DEPTH+3);
    globalObjects.cutsceneBack.setDepth(CUTSCENE_DEPTH);
    PhaserScene.tweens.add({
        delay: 500,
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
        delay: 500,
        ease: "Cubic.easeIn",
        targets: banshee,
        alpha: 1,
        duration: 1200,
    })

    PhaserScene.tweens.add({
        targets: globalObjects.cutsceneBack,
        alpha: 1,
        duration: 1400,
        onComplete: () => {
            if (globalObjects.currentEnemy && !globalObjects.currentEnemy.isDestroyed) {
                globalObjects.currentEnemy.destroy();
            }

            globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight, 0);
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
                                showLoverApproach();
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

function showLoverApproach() {
    let star = PhaserScene.add.image(gameConsts.halfWidth, 225, 'blurry', 'star_blur.png').setAlpha(1).setScale(0.4).setDepth(CUTSCENE_DEPTH+2).setOrigin(0.5, 0.5);
    let lover = PhaserScene.add.image(gameConsts.halfWidth, 150, 'ending', 'ending2_a.png').setAlpha(0).setScale(0.4).setDepth(CUTSCENE_DEPTH+3).setOrigin(0.5, 0.1);
    let horror = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'blurry', 'static0.png').setAlpha(0).setScale(1.9, 3.6).setDepth(CUTSCENE_DEPTH+3);
    let blotter = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'blurry', 'static7.png').setAlpha(0).setScale(5.2).setDepth(CUTSCENE_DEPTH+3);
    PhaserScene.tweens.add({
        targets: star,
        scaleX: 0.8,
        scaleY: 0.8,
        ease: 'Cubic.easeIn',
        duration: 700,
        onComplete: () => {
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
    animateStatic(horror, 0.3, 1.7, 2.4, 5000);
    PhaserScene.tweens.add({
        targets: lover,
        scaleX: 0.73,
        scaleY: 0.73,
        duration: 5000,
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
            animateStatic(horror, 1, 1.65, 1.6,4500);
            PhaserScene.time.delayedCall(2000, () => {
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
                                        duration: 2500,
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
                duration: 5000,
                onComplete: () => {
                    stopHorror = true;
                    lover.destroy();
                    globalObjects.cutsceneBack.setDepth(CUTSCENE_DEPTH + 4);

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
                                                        delay: 3000,
                                                        targets: closeText5,
                                                        alpha: 1,
                                                        duration: 1000,
                                                        onComplete: () => {
                                                            PhaserScene.tweens.add({
                                                                delay: 3000,
                                                                targets: closeText6,
                                                                alpha: 1,
                                                                duration: 1000,
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

function showCutscene3() {
    readyShowCutsceneLogic();
}
