function showVictoryScreen() {
    globalObjects.player.getPlayerCastSpellsCount();
}

function swirlInReaperFog(customScale = 1.66, offsetY = 0, depth = -5) {
    let fogSwirlGlow = getFogSwirlGlow(offsetY);
    let fogSwirl = getFogSwirl(offsetY);
    fogSwirlGlow.setDepth(depth);
    fogSwirl.setDepth(depth);

    fogSwirl.currAnimScale = PhaserScene.tweens.add({
        targets: [fogSwirl, fogSwirlGlow],
        scaleX: customScale,
        scaleY: customScale,
        alpha: 0.5,
        ease: 'Cubic.easeOut',
        duration: 12000,
    });
    fogSwirl.currAnim = PhaserScene.tweens.add({
        targets: [fogSwirl, fogSwirlGlow],
        rotation: "+=6.283",
        duration: 67018,
        repeat: -1
    });
}

function clearDeathFog() {
    if (!globalObjects.fogSwirl) {
        return;
    }
    if (globalObjects.fogSwirl.currAnim) {
        globalObjects.fogSwirl.currAnim.stop();
    }
    if (globalObjects.fogSwirl.currAnimScale) {
        globalObjects.fogSwirl.currAnimScale.stop();
    }
    PhaserScene.tweens.add({
        targets: [globalObjects.fogSwirl],
        scaleX: 2.25,
        scaleY: 2.25,
        alpha: 0,
        ease: 'Quad.easeIn',
        duration: 550,
    });

    PhaserScene.tweens.add({
        targets: [globalObjects.fogSwirlGlow],
        scaleX: 2,
        scaleY: 2,
        alpha: 0,
        ease: 'Cubic.easeIn',
        duration: 600,
    });
}

function getFogSlice() {
    if (!globalObjects.fogSlice) {
        globalObjects.fogSlice = PhaserScene.add.image(gameConsts.halfWidth + 8, -44, 'backgrounds', 'fog_slice.png').setDepth(-2).setOrigin(0.68, 0.29);
    }
    globalObjects.fogSlice.setAlpha(0.2).setScale(1.01).setRotation(-0.8).setPosition(gameConsts.halfWidth + 8, -45);
    return globalObjects.fogSlice;
}

function getFogSliceDarken() {
    if (!globalObjects.fogSliceDarken) {
        globalObjects.fogSliceDarken = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setDepth(-3).setScale(500, 500);
    }
    globalObjects.fogSliceDarken.setAlpha(1).setPosition(gameConsts.halfWidth, gameConsts.halfHeight);
    return globalObjects.fogSliceDarken;
}

function getFogSwirl(offsetY) {
    if (!globalObjects.fogSwirl) {
        globalObjects.fogSwirl = PhaserScene.add.image(gameConsts.halfWidth, 240, 'backgrounds', 'fog_swirl.png').setDepth(-3).setScale(2.2).setRotation(-1).setAlpha(0);
        globalObjects.fogSwirl.scrollFactorX = 0.25;
        globalObjects.fogSwirl.scrollFactorY = 0.25;
    }
    if (globalObjects.fogSwirl.alpha == 0) {
        globalObjects.fogSwirl.setScale(2.25).setRotation(-1);
    }
    globalObjects.fogSwirl.setPosition(gameConsts.halfWidth, 240 + offsetY);
    return globalObjects.fogSwirl;
}

function tweenObjectRotationTo(obj, rotation, duration = 250, ease, onComplete) {
    return PhaserScene.tweens.add({
        targets: obj,
        rotation: rotation,
        duration: duration,
        ease: ease,
        onComplete: onComplete
    })
}

// Hacky way to hide hands
function hideHandsTemp() {
    globalObjects.deathLeftHand.setOrigin(0, 1000);
    globalObjects.deathRightHand.setOrigin(0, 1000);
}
function showHandsTemp() {
    globalObjects.deathLeftHand.setOrigin(0.5, 0.5);
    globalObjects.deathRightHand.setOrigin(0.5, 0.5);
}

function getFloatingDeath() {
    if (!globalObjects.floatingDeath) {
        globalObjects.floatingDeath = PhaserScene.add.image(gameConsts.halfWidth, 95, 'enemies', 'max_death_1a.png').setDepth(-1);
        globalObjects.floatingDeath.setAlpha(0.4);
        globalObjects.floatingDeath2 = PhaserScene.add.image(gameConsts.halfWidth, 95, 'enemies', 'max_death_1b.png').setDepth(-1).setVisible(false);
        let leftHandOffsetX = -114; leftHandOffsetY = 26;
        let rightHandOffsetX = 189; rightHandOffsetY = -50;
        globalObjects.deathLeftHand = PhaserScene.add.image(gameConsts.halfWidth + leftHandOffsetX, globalObjects.floatingDeath.y + leftHandOffsetY, 'enemies', 'max_death_left_arm.png');
        globalObjects.deathRightHand = PhaserScene.add.image(gameConsts.halfWidth + rightHandOffsetX, globalObjects.floatingDeath.y + rightHandOffsetY, 'enemies', 'max_death_right_hand.png');
        globalObjects.deathLeftHand.startY = globalObjects.deathLeftHand.y;
        globalObjects.deathRightHand.startY = globalObjects.deathRightHand.y;


        globalObjects.deathLeftHand.offsetX = leftHandOffsetX; globalObjects.deathLeftHand.offsetY = leftHandOffsetY;
        globalObjects.deathRightHand.offsetX = rightHandOffsetX; globalObjects.deathRightHand.offsetY = rightHandOffsetY;
        setFloatingDeathScale(0.32)
    }
    if (globalObjects.floatingDeath.visible === false) {
        globalObjects.floatingDeath.setVisible(true).setAlpha(0.05).setScale(0.35).setDepth(-1);
        globalObjects.floatingDeath2.setVisible(false);
        globalObjects.deathLeftHand.setAlpha(0.05);
        globalObjects.deathRightHand.setAlpha(0.05);
        setFloatingDeathScale(0.32)
    }
    globalObjects.deathLeftHand.setDepth(globalObjects.floatingDeath.depth + 1);
    globalObjects.deathRightHand.setDepth(globalObjects.floatingDeath.depth + 1)
    tweenObjectRotationTo(globalObjects.deathLeftHand, -0.35, 10);
    tweenObjectRotationTo(globalObjects.deathRightHand, 0.3, 10);

    globalObjects.deathLeftHand.fakeAlpha = 0;
    globalObjects.deathRightHand.fakeAlpha = 0;
    globalObjects.floatingDeath.fakeAlpha = globalObjects.floatingDeath.alpha;
    globalObjects.floatingDeath2.fakeAlpha = globalObjects.floatingDeath.alpha;

    return globalObjects.floatingDeath;
}

function getFogSwirlGlow(offsetY) {
    if (!globalObjects.fogSwirlGlow) {
        globalObjects.fogSwirlGlow = PhaserScene.add.image(gameConsts.halfWidth, 225, 'backgrounds', 'fog_swirl_glow.png').setDepth(-3).setAlpha(0);
        globalObjects.fogSwirlGlow.scrollFactorX = 0.25;
        globalObjects.fogSwirlGlow.scrollFactorY = 0.25;
    }
    if (globalObjects.fogSwirlGlow.alpha == 0) {
        globalObjects.fogSwirlGlow.setScale(2).setRotation(-1);
    }
    globalObjects.fogSwirlGlow.setPosition(gameConsts.halfWidth, 225 + offsetY)
    return globalObjects.fogSwirlGlow;
}

function setFloatingDeathScale(scale) {
    globalObjects.floatingDeath.setScale(scale);
    globalObjects.floatingDeath2.setScale(scale);

    globalObjects.deathLeftHand.setScale(scale);
    globalObjects.deathLeftHand.setPosition(globalObjects.floatingDeath.x + globalObjects.deathLeftHand.offsetX * scale, globalObjects.floatingDeath.y + globalObjects.deathLeftHand.offsetY * scale);

    globalObjects.deathRightHand.setScale(scale);
    globalObjects.deathRightHand.setPosition(globalObjects.floatingDeath.x + globalObjects.deathRightHand.offsetX * scale, globalObjects.floatingDeath.y + globalObjects.deathRightHand.offsetY * scale);
}

function stopFloatingDeathTween() {
    if (globalObjects.floatingDeath.currAnim1) {
        globalObjects.floatingDeath.currAnim1.stop();
        globalObjects.floatingDeath.currAnim2.stop();
        globalObjects.floatingDeath.currAnim3.stop();
    }
}

function tweenFloatingDeath(scale = 0.75, alpha = 1, duration = 1200, ease = "Cubic.easeInOut", onComplete) {
    let fakeAlphaAdjusted = alpha < 0.15 ? alpha - 0.15 : alpha;
    stopFloatingDeathTween();
    setFloatingDeathVisible(true)
    globalObjects.floatingDeath.currAnim1 = PhaserScene.tweens.add({
        targets: [globalObjects.floatingDeath, globalObjects.floatingDeath2, globalObjects.deathLeftHand, globalObjects.deathRightHand],
        scaleX: scale,
        scaleY: scale,
        ease: ease,
        fakeAlpha: fakeAlphaAdjusted,
        duration: duration,
        onComplete: onComplete
    });

    globalObjects.floatingDeath.currAnim2 = PhaserScene.tweens.add({
        targets: [globalObjects.deathLeftHand],
        x: globalObjects.floatingDeath.x + globalObjects.deathLeftHand.offsetX * scale,
        y: globalObjects.floatingDeath.y + globalObjects.deathLeftHand.offsetY * scale,
        ease: ease,
        alpha: alpha,
        duration: duration,
    });

    globalObjects.floatingDeath.currAnim3 = PhaserScene.tweens.add({
        targets: [globalObjects.deathRightHand],
        x: globalObjects.floatingDeath.x + globalObjects.deathRightHand.offsetX * scale,
        y: globalObjects.floatingDeath.y + globalObjects.deathRightHand.offsetY * scale,
        ease: ease,
        alpha: alpha,
        duration: duration,
    });
}

function setFloatingDeathDepth(depth) {
    globalObjects.floatingDeath.setDepth(depth);
    globalObjects.floatingDeath2.setDepth(depth);
    globalObjects.deathLeftHand.setDepth(depth + 1);
    globalObjects.deathRightHand.setDepth(depth + 1)
}

function repeatDeathHandsRotate() {
    globalObjects.deathLeftHand.currAnim = tweenObjectRotationTo(globalObjects.deathLeftHand, 0.03, 2500, "Cubic.easeInOut");
    globalObjects.deathRightHand.currAnim = tweenObjectRotationTo(globalObjects.deathRightHand, -0.03, 2500, "Cubic.easeInOut", () => {
        globalObjects.deathLeftHand.currAnim = tweenObjectRotationTo(globalObjects.deathLeftHand, -0.05, 2500, "Cubic.easeInOut");
        globalObjects.deathRightHand.currAnim = tweenObjectRotationTo(globalObjects.deathRightHand, 0.05, 2500, "Cubic.easeInOut", () => {
            repeatDeathHandsRotate();
        });
    });
}

function setFloatingDeathVisible(visible, hideHands = false) {
    globalObjects.floatingDeath.visible = visible;
    globalObjects.floatingDeath2.visible = visible;
    if (hideHands) {
        globalObjects.deathLeftHand.visible = false;
        globalObjects.deathRightHand.visible = false;
    } else {
        globalObjects.deathLeftHand.visible = visible;
        globalObjects.deathRightHand.visible = visible;
    }
}

function playReaperAnim(enemy, customFinFunc, showDarkScreen = true) {
    let level = enemy.getLevel();

    if (showDarkScreen) {
        playSound('whoosh').detune = -500;
        if (!globalObjects.reaperDarkFlashTop) {
            globalObjects.reaperDarkFlashBot = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel')
            globalObjects.reaperDarkFlashTop = PhaserScene.add.image(-150, gameConsts.halfHeight, 'pixels', 'black_blue_pixel.png').setOrigin(1, 0.5).setDepth(60)
            globalObjects.reaperDarkFlashTop2 = PhaserScene.add.image(-150, gameConsts.halfHeight, 'pixels', 'black_blue_pixel.png').setOrigin(1, 0.5).setDepth(60);
            globalObjects.reaperDarkFlashTop3 = PhaserScene.add.image(-150, gameConsts.halfHeight, 'pixels', 'black_blue_pixel.png').setOrigin(1, 0.5).setDepth(60);
        }
        globalObjects.reaperDarkFlashBot.setScale(700).setAlpha(0).setVisible(true);
        globalObjects.reaperDarkFlashTop.setScale(500, 750).setRotation(0.38).setPosition(-160, gameConsts.halfHeight).setAlpha(0.05).setVisible(true);
        globalObjects.reaperDarkFlashTop2.setScale(50 + Math.random() * 80, 700).setRotation(0.3).setPosition(-140, gameConsts.halfHeight).setAlpha(0.65).setVisible(true);
        globalObjects.reaperDarkFlashTop3.setScale(500, 750).setRotation(0.26).setPosition(-120, gameConsts.halfHeight).setAlpha(0.3).setVisible(true);

        let randExtraTime = Math.floor(Math.random() * 50);
        PhaserScene.tweens.add({
            targets: globalObjects.reaperDarkFlashTop,
            scaleY: 750,
            duration: 350 + randExtraTime,
            onComplete: () => {
                setupReaperArrival();
                tweenFloatingDeath(0.75, 1, 1200, "Cubic.easeInOut", () => {
                    gameVars.deathFlutterDelay = 450;
                    // repeatDeathFlutterAnimation();
                    let scythe = PhaserScene.add.sprite(gameConsts.halfWidth, 140, 'misc', 'scythe1.png').setDepth(999).setAlpha(0).setScale(0.65).setRotation(-1.5);
                    scythe.play('scytheFlash');
                    PhaserScene.tweens.add({
                        targets: scythe,
                        alpha: 1,
                        duration: 450
                    })

                    PhaserScene.tweens.add({
                        targets: scythe,
                        y: 75,
                        scaleX: 0.8,
                        scaleY: 0.8,
                        rotation: -1.35,
                        ease: 'Quart.easeIn',
                        duration: 400,
                        onComplete: () => {
                            if (enemy.customBgMusic) {
                                fadeAwaySound(enemy.customBgMusic, 1000, '')
                            }

                            PhaserScene.time.delayedCall(820, () => {
                                tweenObjectRotationTo(globalObjects.deathLeftHand, -0.2, 500, "Cubic.easeOut");
                                tweenObjectRotationTo(globalObjects.deathRightHand, 0.1, 500, "Cubic.easeOut");
                            })
                            PhaserScene.tweens.add({
                                targets: scythe,
                                scaleX: 0.9,
                                scaleY: 0.9,
                                y: 65,
                                ease: 'Cubic.easeInOut',
                                duration: 900,
                            });
                            PhaserScene.tweens.add({
                                targets: scythe,
                                rotation: -0.5,

                                ease: 'Quart.easeOut',
                                duration: 900,
                                completeDelay: 200,
                                onComplete: () => {
                                    scythe.play('scytheReap');
                                    PhaserScene.tweens.add({
                                        targets: scythe,
                                        rotation: "-=1.5",
                                        ease: 'Quint.easeIn',
                                        duration: 50,
                                        onComplete: () => {
                                            if (enemy.customBgMusic) {
                                                enemy.customBgMusic.stop();
                                            }

                                            let fogSlice = getFogSlice();

                                            let fogSliceDarken = getFogSliceDarken();
                                            PhaserScene.tweens.add({
                                                targets: fogSliceDarken,
                                                alpha: 0.75,
                                                ease: 'Cubic.easeOut',
                                                duration: 500,
                                            });
                                            let oldSwirlAlpha = globalObjects.fogSwirl ? globalObjects.fogSwirl.alpha : 1;

                                            PhaserScene.tweens.add({
                                                targets: globalObjects.fogSwirl,
                                                alpha: 0.25,
                                                ease: 'Cubic.easeIn',
                                                duration: 300,
                                                onComplete: () => {
                                                    PhaserScene.tweens.add({
                                                        delay: 100,
                                                        targets: globalObjects.fogSwirl,
                                                        ease: 'Cubic.easeInOut',
                                                        alpha: oldSwirlAlpha,
                                                        duration: 1000,
                                                    });
                                                }
                                            });
                                            PhaserScene.tweens.add({
                                                delay: 50,
                                                targets: [fogSlice],
                                                alpha: 1,
                                                ease: 'Quad.easeOut',
                                                duration: 200,
                                                onComplete: () => {
                                                    PhaserScene.tweens.add({
                                                        delay: 200,
                                                        targets: [fogSlice, fogSliceDarken],
                                                        ease: 'Quart.easeIn',
                                                        alpha: 0,
                                                        duration: 1400,
                                                    });
                                                }
                                            });
                                            PhaserScene.tweens.add({
                                                delay: 50,
                                                targets: [fogSlice],
                                                scaleX: 1.08,
                                                scaleY: 1.08,
                                                ease: 'Quint.easeOut',
                                                duration: 300,
                                                onComplete: () => {
                                                    PhaserScene.tweens.add({
                                                        targets: [fogSlice],
                                                        scaleX: 1.1,
                                                        scaleY: 1.1,
                                                        duration: 1500,
                                                    });
                                                }
                                            });
                                            PhaserScene.tweens.add({
                                                delay: 50,
                                                targets: fogSlice,
                                                rotation: -0.85,
                                                ease: 'Quad.easeOut',
                                                duration: 1500,
                                            });
                                            if (enemy) {
                                                let body = enemy.sprite;
                                                PhaserScene.tweens.add({
                                                    targets: body,
                                                    scaleX: body.scaleX * 1.2,
                                                    scaleY: body.scaleX * 1.2,
                                                    alpha: 0,
                                                    duration: 750
                                                });
                                            }
                                            setTimeout(() => {
                                                playSound(globalObjects.reapSound || 'death_attack').detune = 0;
                                                messageBus.publish('reapedEnemyGong')
                                                messageBus.publish('showCircleShadow', 0.4);
                                                globalObjects.reapSound = null;
                                                messageBus.publish('tempPause', 70, 0.1);
                                            }, 100);
                                            // setFloatingDeathDepth(1000);
                                            let darkScreen = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setScale(500).setDepth(980).setAlpha(1)
                                            if (!this.scytheBlur) {
                                                this.scytheBlur = PhaserScene.add.image(gameConsts.halfWidth, scythe.y, 'blurry', 'scytheblur.png').setDepth(1002).setBlendMode(Phaser.BlendModes.LIGHTEN)
                                            }
                                            this.scytheBlur.setAlpha(1).setScale(0.82).setRotation(-0.15);
                                            PhaserScene.tweens.add({
                                                targets: [darkScreen],
                                                alpha: 0,
                                                duration: 1500,
                                                ease: 'Quad.easeOut',
                                                onComplete: () => {
                                                    darkScreen.destroy();
                                                }
                                            });
                                            PhaserScene.tweens.add({
                                                targets: [this.scytheBlur],
                                                alpha: 0,
                                                ease: 'Cubic.easeOut',
                                                duration: 700,
                                            });
                                            PhaserScene.tweens.add({
                                                targets: scythe,
                                                rotation: -3.5,
                                                x: "-=10",
                                                ease: 'Quint.easeOut',
                                                duration: 500,
                                                onComplete: () => {
                                                    repeatDeathHandsRotate();
                                                    PhaserScene.tweens.add({
                                                        delay: 200,
                                                        targets: scythe,
                                                        rotation: "+=0.1",
                                                        x: "-=12",
                                                        ease: 'Quart.easeInOut',
                                                        duration: 2000,
                                                    })
                                                    PhaserScene.tweens.add({
                                                        targets: scythe,
                                                        alpha: 0,
                                                        delay: 1000,
                                                        scaleX: 0.6,
                                                        scaleY: 0.6,
                                                        ease: 'Cubic.easeIn',
                                                        duration: 600,
                                                        onComplete: () => {
                                                            scythe.destroy();
                                                            enemy.destroy();
                                                            setFloatingDeathDepth(100010);
                                                            handleReaperDialog(level, () => {
                                                                gameVars.deathFlutterDelay = 10;
                                                                repeatDeathFlutterAnimation(-0.25);
                                                                clearReaper();
                                                                globalObjects.postFightScreen.startGloom();
                                                                PhaserScene.tweens.add({
                                                                    targets: [scythe],
                                                                    scaleX: 0.5,
                                                                    scaleY: 0.5,
                                                                    alpha: 0,
                                                                    ease: 'Cubic.easeIn',
                                                                    duration: 1100,
                                                                    completeDelay: 200,
                                                                    onComplete: () => {
                                                                        PhaserScene.tweens.add({
                                                                            targets: [globalObjects.fogSliceDarken],
                                                                            alpha: 0,
                                                                            duration: 1000,
                                                                            onComplete: () => {
                                                                                globalObjects.fogSliceDarken.destroy();
                                                                            }
                                                                        });
                                                                        if (customFinFunc) {
                                                                            customFinFunc();
                                                                        } else {
                                                                            setTimeout(() => {
                                                                                globalObjects.magicCircle.enableMovement();
                                                                                globalObjects.postFightScreen.createWinScreen(level);
                                                                            }, 200)
                                                                        }
                                                                    }
                                                                });
                                                            })
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                })
                if (globalObjects.reaperDarkFlashTop2.visible) {
                    setFloatingDeathVisible(false)
                }
            }
        })


        PhaserScene.tweens.add({
            targets: globalObjects.reaperDarkFlashTop3,
            duration: 320 + Math.floor(Math.random() * 30),
            rotation: 0.12,
            ease: 'Quad.easeIn',
            x: gameConsts.width + 160,
            onComplete: () => {
                globalObjects.reaperDarkFlashTop3.visible = false;
            }
        })
        PhaserScene.tweens.add({
            targets: globalObjects.reaperDarkFlashTop3,
            alpha: 1,
            duration: 450,
            ease: 'Cubic.easeIn',
        })

        PhaserScene.tweens.add({
            delay: 10,
            targets: globalObjects.reaperDarkFlashTop2,
            alpha: 1,
            duration: 465 + Math.random() * 30,
            ease: 'Quad.easeIn',
            rotation: 0.23,
            x: gameConsts.width + 140,
            completeDelay: 30,
            onComplete: () => {
                globalObjects.reaperDarkFlashTop2.visible = false;
            }
        })
        PhaserScene.tweens.add({
            targets: globalObjects.reaperDarkFlashTop2,
            alpha: 1,
            duration: 480,
            ease: 'Cubic.easeIn',
            scaleX: 40,
        })
        let durAmt = 570 + randExtraTime;
        PhaserScene.tweens.add({
            delay: 10,
            targets: globalObjects.reaperDarkFlashTop,
            alpha: 1,
            duration: durAmt,
            ease: 'Quint.easeIn',
        });
        PhaserScene.tweens.add({
            delay: 20,
            targets: globalObjects.reaperDarkFlashTop,
            duration: durAmt,
            ease: 'Cubic.easeIn',
            rotation: 0.32,
            x: gameConsts.width + 180,
            completeDelay: 100,
            onComplete: () => {
                setFloatingDeathVisible(true);
                globalObjects.reaperDarkFlashTop.setAlpha(1);
                globalObjects.reaperDarkFlashBot.setAlpha(1);
                PhaserScene.tweens.add({
                    targets: globalObjects.reaperDarkFlashBot,
                    alpha: 0,
                    duration: 1500,
                    ease: 'Cubic.easeOut',
                    onComplete: () => {
                        globalObjects.reaperDarkFlashBot.visible = false;
                    }
                })
                globalObjects.reaperDarkFlashBot.setRotation(0.15);
                PhaserScene.tweens.add({
                    targets: globalObjects.reaperDarkFlashTop,
                    scaleX: 0,
                    alpha: 0,
                    duration: 500,
                    ease: 'Cubic.easeOut',
                    onComplete: () => {
                        globalObjects.reaperDarkFlashTop2.visible = false;
                    }
                })
            }
        })
    } else {
        setupReaperArrival();
        tweenFloatingDeath(0.75, 1, 1200, "Cubic.easeInOut", () => {
            gameVars.deathFlutterDelay = 450;
            // repeatDeathFlutterAnimation();
            let scythe = PhaserScene.add.sprite(gameConsts.halfWidth, 140, 'misc', 'scythe1.png').setDepth(999).setAlpha(0).setScale(0.65).setRotation(-1.5);
            scythe.play('scytheFlash');
            PhaserScene.tweens.add({
                targets: scythe,
                alpha: 1,
                duration: 450
            })

            PhaserScene.tweens.add({
                targets: scythe,
                y: 75,
                scaleX: 0.8,
                scaleY: 0.8,
                rotation: -1.35,
                ease: 'Quart.easeIn',
                duration: 400,
                onComplete: () => {
                    if (enemy.customBgMusic) {
                        fadeAwaySound(enemy.customBgMusic, 1000, '')
                    }

                    PhaserScene.time.delayedCall(820, () => {
                        tweenObjectRotationTo(globalObjects.deathLeftHand, -0.2, 500, "Cubic.easeOut");
                        tweenObjectRotationTo(globalObjects.deathRightHand, 0.1, 500, "Cubic.easeOut");
                    })
                    PhaserScene.tweens.add({
                        targets: scythe,
                        scaleX: 0.9,
                        scaleY: 0.9,
                        y: 65,
                        ease: 'Cubic.easeInOut',
                        duration: 900,
                    });
                    PhaserScene.tweens.add({
                        targets: scythe,
                        rotation: -0.5,

                        ease: 'Quart.easeOut',
                        duration: 900,
                        completeDelay: 200,
                        onComplete: () => {
                            scythe.play('scytheReap');
                            PhaserScene.tweens.add({
                                targets: scythe,
                                rotation: "-=1.5",
                                ease: 'Quint.easeIn',
                                duration: 50,
                                onComplete: () => {
                                    if (enemy.customBgMusic) {
                                        enemy.customBgMusic.stop();
                                    }

                                    let fogSlice = getFogSlice();

                                    let fogSliceDarken = getFogSliceDarken();
                                    PhaserScene.tweens.add({
                                        targets: fogSliceDarken,
                                        alpha: 0.75,
                                        ease: 'Cubic.easeOut',
                                        duration: 500,
                                    });
                                    let oldSwirlAlpha = globalObjects.fogSwirl ? globalObjects.fogSwirl.alpha : 1;

                                    PhaserScene.tweens.add({
                                        targets: globalObjects.fogSwirl,
                                        alpha: 0.25,
                                        ease: 'Cubic.easeIn',
                                        duration: 300,
                                        onComplete: () => {
                                            PhaserScene.tweens.add({
                                                delay: 100,
                                                targets: globalObjects.fogSwirl,
                                                ease: 'Cubic.easeInOut',
                                                alpha: oldSwirlAlpha,
                                                duration: 1000,
                                            });
                                        }
                                    });
                                    PhaserScene.tweens.add({
                                        delay: 50,
                                        targets: [fogSlice],
                                        alpha: 1,
                                        ease: 'Quad.easeOut',
                                        duration: 200,
                                        onComplete: () => {
                                            PhaserScene.tweens.add({
                                                delay: 200,
                                                targets: [fogSlice, fogSliceDarken],
                                                ease: 'Quart.easeIn',
                                                alpha: 0,
                                                duration: 1400,
                                            });
                                        }
                                    });
                                    PhaserScene.tweens.add({
                                        delay: 50,
                                        targets: [fogSlice],
                                        scaleX: 1.08,
                                        scaleY: 1.08,
                                        ease: 'Quint.easeOut',
                                        duration: 300,
                                        onComplete: () => {
                                            PhaserScene.tweens.add({
                                                targets: [fogSlice],
                                                scaleX: 1.09,
                                                scaleY: 1.09,
                                                duration: 1500,
                                            });
                                        }
                                    });
                                    PhaserScene.tweens.add({
                                        delay: 50,
                                        targets: fogSlice,
                                        rotation: -0.85,
                                        ease: 'Quad.easeOut',
                                        duration: 1500,
                                    });
                                    if (enemy) {
                                        let body = enemy.sprite;
                                        PhaserScene.tweens.add({
                                            targets: body,
                                            scaleX: body.scaleX * 1.2,
                                            scaleY: body.scaleX * 1.2,
                                            alpha: 0,
                                            duration: 750
                                        });
                                    }
                                    setTimeout(() => {
                                        playSound(globalObjects.reapSound || 'death_attack').detune = 0;
                                        messageBus.publish('reapedEnemyGong')
                                        messageBus.publish('showCircleShadow', 0.4);
                                        globalObjects.reapSound = null;
                                        messageBus.publish('tempPause', 70, 0.1);
                                    }, 100);
                                    // setFloatingDeathDepth(1000);
                                    let darkScreen = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setScale(500).setDepth(980).setAlpha(1)
                                    if (!this.scytheBlur) {
                                        this.scytheBlur = PhaserScene.add.image(gameConsts.halfWidth, scythe.y, 'blurry', 'scytheblur.png').setDepth(1002).setBlendMode(Phaser.BlendModes.LIGHTEN)
                                    }
                                    this.scytheBlur.setAlpha(1).setScale(0.82).setRotation(-0.15);
                                    PhaserScene.tweens.add({
                                        targets: [darkScreen],
                                        alpha: 0,
                                        duration: 1500,
                                        ease: 'Quad.easeOut',
                                        onComplete: () => {
                                            darkScreen.destroy();
                                        }
                                    });
                                    PhaserScene.tweens.add({
                                        targets: [this.scytheBlur],
                                        alpha: 0,
                                        ease: 'Cubic.easeOut',
                                        duration: 700,
                                    });
                                    PhaserScene.tweens.add({
                                        targets: scythe,
                                        rotation: -3.5,
                                        x: "-=10",
                                        ease: 'Quint.easeOut',
                                        duration: 500,
                                        onComplete: () => {
                                            repeatDeathHandsRotate();
                                            PhaserScene.tweens.add({
                                                delay: 200,
                                                targets: scythe,
                                                rotation: "+=0.1",
                                                x: "-=12",
                                                ease: 'Quart.easeInOut',
                                                duration: 2000,
                                            })
                                            PhaserScene.tweens.add({
                                                targets: scythe,
                                                alpha: 0,
                                                delay: 1000,
                                                scaleX: 0.6,
                                                scaleY: 0.6,
                                                ease: 'Cubic.easeIn',
                                                duration: 600,
                                                onComplete: () => {
                                                    scythe.destroy();
                                                    enemy.destroy();
                                                    setFloatingDeathDepth(100010);
                                                    handleReaperDialog(level, () => {
                                                        gameVars.deathFlutterDelay = 10;
                                                        repeatDeathFlutterAnimation(-0.25);
                                                        clearReaper();
                                                        globalObjects.postFightScreen.startGloom();
                                                        PhaserScene.tweens.add({
                                                            targets: [scythe],
                                                            scaleX: 0.5,
                                                            scaleY: 0.5,
                                                            alpha: 0,
                                                            ease: 'Cubic.easeIn',
                                                            duration: 1100,
                                                            completeDelay: 200,
                                                            onComplete: () => {
                                                                PhaserScene.tweens.add({
                                                                    targets: [globalObjects.fogSliceDarken],
                                                                    alpha: 0,
                                                                    duration: 1000,
                                                                    onComplete: () => {
                                                                        globalObjects.fogSliceDarken.destroy();
                                                                    }
                                                                });
                                                                if (customFinFunc) {
                                                                    customFinFunc();
                                                                } else {
                                                                    setTimeout(() => {
                                                                        globalObjects.magicCircle.enableMovement();
                                                                        globalObjects.postFightScreen.createWinScreen(level);
                                                                    }, 200)
                                                                }
                                                            }
                                                        });
                                                    })
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        })
    }
}

// Currently this is customized for the statue hand level
function playReaperPassiveAnim(enemy, customFinFunc, showDarkScreen = true) {
    let level = enemy.getLevel();

    if (showDarkScreen) {
        playSound('whoosh').detune = -500;
        if (!globalObjects.reaperDarkFlashTop) {
            globalObjects.reaperDarkFlashBot = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel')
            globalObjects.reaperDarkFlashTop = PhaserScene.add.image(-150, gameConsts.halfHeight, 'pixels', 'black_blue_pixel.png').setOrigin(1, 0.5).setDepth(60)
            globalObjects.reaperDarkFlashTop2 = PhaserScene.add.image(-150, gameConsts.halfHeight, 'pixels', 'black_blue_pixel.png').setOrigin(1, 0.5).setDepth(60);
            globalObjects.reaperDarkFlashTop3 = PhaserScene.add.image(-150, gameConsts.halfHeight, 'pixels', 'black_blue_pixel.png').setOrigin(1, 0.5).setDepth(60);
        }
        globalObjects.reaperDarkFlashBot.setScale(700).setAlpha(0).setVisible(true);
        globalObjects.reaperDarkFlashTop.setScale(500, 750).setRotation(0.38).setPosition(-160, gameConsts.halfHeight).setAlpha(0.05).setVisible(true);
        globalObjects.reaperDarkFlashTop2.setScale(50 + Math.random() * 80, 700).setRotation(0.3).setPosition(-140, gameConsts.halfHeight).setAlpha(0.65).setVisible(true);
        globalObjects.reaperDarkFlashTop3.setScale(500, 750).setRotation(0.26).setPosition(-120, gameConsts.halfHeight).setAlpha(0.3).setVisible(true);

        let randExtraTime = Math.floor(Math.random() * 50);
        PhaserScene.tweens.add({
            targets: globalObjects.reaperDarkFlashTop,
            scaleY: 750,
            duration: 495 + randExtraTime,
            onComplete: () => {
                setupReaperArrival();
                setFloatingDeathDepth(100010);

                tweenFloatingDeath(0.75, 1, 1350, "Cubic.easeOut", () => {
                    gameVars.deathFlutterDelay = 450;
                    repeatDeathHandsRotate();

                    // repeatDeathFlutterAnimation();
                    setFloatingDeathDepth(100010);
                    repeatDeathFlutterAnimation(-0.25);
                    handleReaperDialog(level, () => {
                        gameVars.deathFlutterDelay = 10;
                        clearReaper();
                        PhaserScene.tweens.add({
                            targets: [globalObjects.fogSliceDarken],
                            alpha: 0,
                            duration: 1000,
                            onComplete: () => {
                                globalObjects.fogSliceDarken.destroy();
                            }
                        });
                        if (customFinFunc) {
                            customFinFunc();
                        } else {
                            //globalObjects.magicCircle.enableMovement();
                            //globalObjects.postFightScreen.createWinScreen(level);
                        }

                    })

                })
                if (globalObjects.reaperDarkFlashTop2.visible) {
                    setFloatingDeathVisible(false)
                }
            }
        })


        PhaserScene.tweens.add({
            targets: globalObjects.reaperDarkFlashTop3,
            duration: 335 + Math.floor(Math.random() * 30),
            rotation: 0.12,
            ease: 'Quad.easeIn',
            x: gameConsts.width + 160,
            onComplete: () => {
                globalObjects.reaperDarkFlashTop3.visible = false;
            }
        })
        PhaserScene.tweens.add({
            targets: globalObjects.reaperDarkFlashTop3,
            alpha: 1,
            duration: 460,
            ease: 'Cubic.easeIn',
        })

        PhaserScene.tweens.add({
            delay: 10,
            targets: globalObjects.reaperDarkFlashTop2,
            alpha: 1,
            duration: 465 + Math.random() * 30,
            ease: 'Quad.easeIn',
            rotation: 0.23,
            x: gameConsts.width + 140,
            completeDelay: 30,
            onComplete: () => {
                globalObjects.reaperDarkFlashTop2.visible = false;
            }
        })
        PhaserScene.tweens.add({
            targets: globalObjects.reaperDarkFlashTop2,
            alpha: 1,
            duration: 480,
            ease: 'Cubic.easeIn',
            scaleX: 40,
        })
        let durAmt = 580 + randExtraTime;
        PhaserScene.tweens.add({
            delay: 10,
            targets: globalObjects.reaperDarkFlashTop,
            alpha: 1,
            duration: durAmt,
            ease: 'Quint.easeIn',
        });
        PhaserScene.tweens.add({
            delay: 20,
            targets: globalObjects.reaperDarkFlashTop,
            duration: durAmt,
            ease: 'Cubic.easeIn',
            rotation: 0.32,
            x: gameConsts.width + 180,
            completeDelay: 100,
            onComplete: () => {
                setFloatingDeathVisible(true);
                globalObjects.reaperDarkFlashTop.setAlpha(1);
                globalObjects.reaperDarkFlashBot.setAlpha(1);
                PhaserScene.tweens.add({
                    targets: globalObjects.reaperDarkFlashBot,
                    alpha: 0,
                    duration: 1500,
                    ease: 'Cubic.easeOut',
                    onComplete: () => {
                        globalObjects.reaperDarkFlashBot.visible = false;
                    }
                })
                globalObjects.reaperDarkFlashBot.setRotation(0.15);
                PhaserScene.tweens.add({
                    targets: globalObjects.reaperDarkFlashTop,
                    scaleX: 0,
                    alpha: 0,
                    duration: 500,
                    ease: 'Cubic.easeOut',
                    onComplete: () => {
                        globalObjects.reaperDarkFlashTop2.visible = false;
                    }
                })
            }
        })
    } else {
        setupReaperArrival();
        setFloatingDeathDepth(100010);

        tweenFloatingDeath(0.75, 1, 1200, "Cubic.easeInOut", () => {
            gameVars.deathFlutterDelay = 450;
            repeatDeathHandsRotate();

            // repeatDeathFlutterAnimation();
            setFloatingDeathDepth(100010);
            repeatDeathFlutterAnimation(-0.25);
            handleReaperDialog(level, () => {
                gameVars.deathFlutterDelay = 10;
                clearReaper();
                PhaserScene.tweens.add({
                    targets: [globalObjects.fogSliceDarken],
                    alpha: 0,
                    duration: 1000,
                    onComplete: () => {
                        globalObjects.fogSliceDarken.destroy();
                    }
                });
                if (customFinFunc) {
                    customFinFunc();
                } else {
                    //globalObjects.magicCircle.enableMovement();
                    //globalObjects.postFightScreen.createWinScreen(level);
                }

            })

        })
    }


}

function setupReaperArrival() {
    playSound('sound_of_death');
    messageBus.publish('reapedEnemyGong');

    globalObjects.magicCircle.disableMovement();
    getFloatingDeath();
    showHandsTemp();
    if (globalObjects.fogSwirl) {
        globalObjects.fogSwirl.currAnim.stop();
        globalObjects.fogSwirl.currAnimScale.stop();
        // let continuousAnim = PhaserScene.tweens.add({
        //     targets: [globalObjects.fogSwirl, globalObjects.fogSwirlGlow],
        //     rotation: "+=6.283",
        //     duration: 35000,
        //     repeat: -1
        // });
        globalObjects.fogSwirl.currAnim = PhaserScene.tweens.add({
            targets: [globalObjects.fogSwirl, globalObjects.fogSwirlGlow],
            scaleX: 1.15,
            scaleY: 1.15,
            alpha: 0.9,
            ease: 'Cubic.easeInOut',
            rotation: "+=1.5",
            duration: 1600,
        });
        let newAnim = PhaserScene.tweens.add({
            delay: 1400,
            targets: [globalObjects.fogSwirl, globalObjects.fogSwirlGlow],
            rotation: "+=6.283",
            duration: 45000,
            repeat: -1,
            onStart: () => {
                PhaserScene.tweens.add({
                    targets: [globalObjects.fogSwirl, globalObjects.fogSwirlGlow],
                    scaleX: 1.17,
                    scaleY: 1.17,
                    alpha: 0.92,
                    ease: 'Quad.easeOut',
                    duration: 1000,
                });
                globalObjects.fogSwirl.currAnim.stop();
                globalObjects.fogSwirl.currAnim = newAnim;
            }
        });
    }

    startDeathFlutterAnim();
    globalObjects.floatingDeath.fakeAlpha = globalObjects.floatingDeath.alpha;
    globalObjects.floatingDeath2.fakeAlpha = globalObjects.floatingDeath.alpha;
    globalObjects.deathLeftHand.setRotation(-0.55);
    globalObjects.deathRightHand.setRotation(0.45);

    // globalObjects.deathLeftHand.setAlpha(0.4).setScale(0.35).setDepth(0);
    // globalObjects.deathRightHand.setAlpha(0.4).setScale(0.35).setDepth(-1);
    tweenObjectRotationTo(globalObjects.deathLeftHand, 0.2, 2400, "Cubic.easeInOut");
    tweenObjectRotationTo(globalObjects.deathRightHand, -0.1, 2400, "Cubic.easeInOut");
}

function clearReaper() {
    if (globalObjects.deathLeftHand.currAnim) {
        globalObjects.deathLeftHand.currAnim.stop();
        globalObjects.deathRightHand.currAnim.stop();
    }
    globalObjects.floatingDeath.visible = true;
    globalObjects.floatingDeath2.visible = true;
    tweenObjectRotationTo(globalObjects.deathLeftHand, -0.38, 1100, "Cubic.easeIn");
    tweenObjectRotationTo(globalObjects.deathRightHand, 0.32, 1100, "Cubic.easeIn");
    globalObjects.deathLeftHand.alpha = 3;
    globalObjects.deathRightHand.alpha = 3;
    tweenFloatingDeath(0.5, 0.1, 1100, "Quad.easeIn", () => {
        globalObjects.floatingDeath.flutterAnim.stop();
        globalObjects.floatingDeath.visible = true;
        globalObjects.floatingDeath2.visible = false;
        globalObjects.floatingDeath.alpha = 0.1;
        PhaserScene.tweens.add({
            targets: [globalObjects.floatingDeath, globalObjects.deathLeftHand, globalObjects.deathRightHand],
            alpha: 0,
            fakeAlpha: 0,
            scaleX: 0.3,
            scaleY: 0.3,
            duration: 400,
            ease: 'Quad.easeOut',
            onComplete: () => {
                globalObjects.floatingDeath.visible = false;
                globalObjects.deathLeftHand.visible = true;
                globalObjects.deathRightHand.visible = true;
                globalObjects.floatingDeath.setFrame('max_death_1a.png');
                globalObjects.floatingDeath2.setFrame('max_death_1b.png');
            }
        });
    });
}

function stopDeathFlutterAnim() {
    if (globalObjects.floatingDeath.flutterAnim) {
        globalObjects.floatingDeath.flutterAnim.stop();
    }
}


function startDeathFlutterAnim(alphaOffset) {
    globalObjects.floatingDeath2.setVisible(true).setScale(globalObjects.floatingDeath.scaleX).setDepth(globalObjects.floatingDeath.depth);
    gameVars.deathFlutterDelay = 0;
    repeatDeathFlutterAnimation(alphaOffset);
}

function repeatDeathFlutterAnimation(alphaOffset = 0) {
    stopDeathFlutterAnim();
    globalObjects.floatingDeath2.alpha = 0;
    globalObjects.floatingDeath.alpha = 1;
    globalObjects.floatingDeath.flutterAnim = PhaserScene.tweens.add({
        targets: globalObjects.floatingDeath2,
        alpha: globalObjects.floatingDeath2.fakeAlpha + alphaOffset,
        duration: 70 + gameVars.deathFlutterDelay,
        ease: 'Cubic.easeIn',
        onComplete: () => {
            globalObjects.floatingDeath.flutterAnim = PhaserScene.tweens.add({
                targets: globalObjects.floatingDeath,
                alpha: 0,
                duration: 20 + gameVars.deathFlutterDelay,
                ease: 'Cubic.easeOut',
                completeDelay: 100 + gameVars.deathFlutterDelay * 2,
                onComplete: () => {
                    globalObjects.floatingDeath2.setDepth(globalObjects.floatingDeath.depth - 1);
                    globalObjects.floatingDeath.flutterAnim = PhaserScene.tweens.add({
                        targets: globalObjects.floatingDeath,
                        alpha: globalObjects.floatingDeath.fakeAlpha + alphaOffset,
                        duration: 70 + gameVars.deathFlutterDelay,
                        ease: 'Cubic.easeIn',
                        onComplete: () => {
                            globalObjects.floatingDeath.flutterAnim = PhaserScene.tweens.add({
                                targets: globalObjects.floatingDeath2,
                                alpha: 0,
                                duration: 20 + gameVars.deathFlutterDelay,
                                ease: 'Cubic.easeOut',
                                completeDelay: 100 + gameVars.deathFlutterDelay * 2,
                                onComplete: () => {
                                    globalObjects.floatingDeath2.setDepth(globalObjects.floatingDeath.depth + 1);
                                    repeatDeathFlutterAnimation();
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

function handleReaperDialog(level = 0, onComplete) {
    let reaperDialog = [];
    let reaperFuncList = [];
    switch(level) {
        case 1:
            if (onComplete) {
                onComplete();
            }
            return;
            break;
        case 2:
            reaperDialog = [
                getLangText('death2a'),
                getLangText('death2b'),
                getLangText('death2c'),
            ];
            break;
        case 3:
            reaperDialog = [
                getLangText('death3a'),
                getLangText('death3b'),
                getLangText('death3c'),
            ];
            break;
        case 4:
            reaperDialog = [
                getLangText('death4b'),
                getLangText('death4c'),
                getLangText('death4d'),
            ];
            break;
        case 5:
            reaperDialog = [
                getLangText('death_statue1'),
                getLangText('death_statue2'),
                getLangText('death_statue3'),
            ];
            reaperFuncList = [null, null, () => {
                messageBus.publish('lift_statue');
            }]
            break;
        case 6:
            reaperDialog = [
                getLangText('death5demoa'),
                getLangText('death5demob'),
                getLangText('death5democ'),
                getLangText('death5demod'),
            ];
            break;
        case 7:
            reaperDialog = [
                getLangText('death6a'),
                getLangText('death6b'),
            ];
            reaperFuncList = [() => {
                stopDeathFlutterAnim();
                tweenFloatingDeath(0.75, 0, 400, 'Quad.easeOut', () => {
                    hideHandsTemp();
                    // setFloatingDeathVisible(false);
                    globalObjects.floatingDeath.visible = true;
                    globalObjects.floatingDeath2.visible = true;
                    globalObjects.deathLeftHand.visible = false;
                    globalObjects.deathRightHand.visible = false;
                    globalObjects.floatingDeath.alpha = 0.15;
                    globalObjects.floatingDeath2.alpha = 0.15;
                    // globalObjects.floatingDeath.setFrame('max_death_1a_angry.png');
                    // globalObjects.floatingDeath2.setFrame('max_death_1b_angry.png');
                    globalObjects.floatingDeath.fakeAlpha = 1;
                    globalObjects.floatingDeath2.fakeAlpha = 1;
                    gameVars.deathFlutterDelay = 350;
                    repeatDeathFlutterAnimation(0);
                });
            }]
            break;
        case 8:
            reaperDialog = [
                getLangText('death7a'),
                getLangText('death7b'),
                getLangText('death7c'),
                getLangText('death7d'),
                getLangText('death7e'),
                getLangText('death7f'),
            ];
            reaperFuncList = [() => {
                globalObjects.bannerTextManager.speedUpText();
            }, () => {
                playSound('slice_in', 0.4);
                playSound('enemy_attack', 0.68)
                let darkBG = getBackgroundBlackout();
                darkBG.setDepth(100).setAlpha(0.5).setVisible(true);
                screenShakeLong(2);
                PhaserScene.tweens.add({
                    targets: darkBG,
                    alpha: 0,
                    duration: 3000,
                    ease: 'Quart.easeOut'
                })
                globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.height - 130);

            },
                () => {
                    playSound('enemy_attack_2', 0.68);
                },
                () => {
                    let darkBG = getBackgroundBlackout();
                    darkBG.setDepth(100).setAlpha(0.4).setVisible(true);
                    PhaserScene.tweens.add({
                        targets: darkBG,
                        alpha: 0,
                        duration: 4000,
                    })
                    globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight + 10);
                },

            ]
            break;
        case 9:
            reaperDialog = [
                getLangText('death8a'),
                getLangText('death8b'),
            ];
            break;

        default:
            if (onComplete) {
                onComplete();
            }
            return;
    }
    playReaperDialog(reaperDialog, reaperFuncList, onComplete);
}

function playReaperDialog(dialog, funcList, onComplete) {
    globalObjects.bannerTextManager.setDialog(dialog);
    globalObjects.bannerTextManager.setDialogFunc(funcList);
    let fogSliceDarken = getFogSliceDarken();
    PhaserScene.tweens.add({
        targets: fogSliceDarken,
        alpha: 0.5,
        ease: 'Cubic.easeOut',
        duration: 500,
    });
    globalObjects.bannerTextManager.showBanner();
    globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight);
    globalObjects.bannerTextManager.setOnFinishFunc(onComplete, 100)
    // if (!globalObjects.reaperText) {
    //     globalObjects.reaperTextBG = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight + 25, 'misc', 'victory_banner.png').setScale(100, 1).setDepth(100002).setAlpha(0);
    //     globalObjects.reaperText = this.scene.add.text(gameConsts.halfWidth, globalObjects.reaperTextBG.y, '...', {fontFamily: 'garamond', fontSize: 26, color: '#FFFFFF', align: 'center'}).setAlpha(0).setOrigin(0.5, 0.5).setDepth(100002);
    //     globalObjects.reaperText.setFontStyle('italic');
    // }

}
