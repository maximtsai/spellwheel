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
        globalObjects.fogSlice = PhaserScene.add.image(gameConsts.halfWidth + 8, -60, 'backgrounds', 'fog_slice.png').setDepth(-2).setOrigin(0.68, 0.29);
    }
    globalObjects.fogSlice.setAlpha(0.2).setScale(1.01).setRotation(-0.8);
    return globalObjects.fogSlice;
}

function getFogSliceDarken() {
    if (!globalObjects.fogSliceDarken) {
        globalObjects.fogSliceDarken = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setDepth(-3).setScale(500, 500);
    }
    globalObjects.fogSliceDarken.setAlpha(1);
    return globalObjects.fogSliceDarken;
}

function getFogSwirl(offsetY) {
    if (!globalObjects.fogSwirl) {
        globalObjects.fogSwirl = PhaserScene.add.image(gameConsts.halfWidth, 240, 'backgrounds', 'fog_swirl.png').setDepth(-1).setScale(2.2).setRotation(-1).setAlpha(0);
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

function getFloatingDeath() {
    if (!globalObjects.floatingDeath) {
        globalObjects.floatingDeath = PhaserScene.add.image(gameConsts.halfWidth, 95, 'enemies', 'max_death_1a.png').setDepth(-1);
        globalObjects.floatingDeath.setAlpha(0.4);
        globalObjects.floatingDeath2 = PhaserScene.add.image(gameConsts.halfWidth, 95, 'enemies', 'max_death_1b.png').setDepth(-1).setVisible(false);
        let leftHandOffsetX = -114; leftHandOffsetY = 26;
        let rightHandOffsetX = 190; rightHandOffsetY = -49;
        globalObjects.deathLeftHand = PhaserScene.add.image(gameConsts.halfWidth + leftHandOffsetX, globalObjects.floatingDeath.y + leftHandOffsetY, 'enemies', 'max_death_left_arm.png');
        globalObjects.deathRightHand = PhaserScene.add.image(gameConsts.halfWidth + rightHandOffsetX, globalObjects.floatingDeath.y + rightHandOffsetY, 'enemies', 'max_death_right_hand.png');

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
        globalObjects.fogSwirlGlow = PhaserScene.add.image(gameConsts.halfWidth, 225, 'backgrounds', 'fog_swirl_glow.png').setDepth(-1).setAlpha(0);
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
    globalObjects.floatingDeath.currAnim1.stop();
    globalObjects.floatingDeath.currAnim2.stop();
    globalObjects.floatingDeath.currAnim3.stop();
}

function tweenFloatingDeath(scale = 0.75, alpha = 1, duration = 1200, ease = "Cubic.easeInOut", onComplete) {
    let fakeAlphaAdjusted = alpha < 0.15 ? alpha - 0.15 : alpha;

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

function playReaperAnim(enemy, customFinFunc) {
    playSound('sound_of_death');
    messageBus.publish('reapedEnemyGong')
    globalObjects.magicCircle.disableMovement();
    let level = enemy.getLevel();
    let floatingDeath = getFloatingDeath();
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

    tweenFloatingDeath(0.75, 1, 1200, "Cubic.easeInOut", () => {
            gameVars.deathFlutterDelay = 450;
            // repeatDeathFlutterAnimation();
            let scythe = PhaserScene.add.sprite(gameConsts.halfWidth, 140, 'misc', 'scythe1.png').setDepth(999).setAlpha(0).setScale(0.8).setRotation(-1);
            PhaserScene.tweens.add({
                targets: scythe,
                alpha: 1,
                y: 60,
                scaleX: 0.7,
                scaleY: 0.7,
                rotation: -0.95,
                ease: 'Cubic.easeIn',
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
                        rotation: 0,
                        ease: 'Cubic.easeOut',
                        duration: 800,
                        completeDelay: 100,
                        onComplete: () => {
                            if (enemy.customBgMusic) {
                                enemy.customBgMusic.stop();
                            }
                            playSound(globalObjects.reapSound || 'death_attack');
                            messageBus.publish('reapedEnemyGong')
                            globalObjects.reapSound = null;
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
                                targets: fogSlice,
                                rotation: -0.85,
                                ease: 'Quad.easeOut',
                                duration: 1500,
                            });

                            scythe.play('scytheReap');
                            scythe.rotation = -1;
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

                            PhaserScene.tweens.add({
                                targets: scythe,
                                rotation: -1.5,
                                ease: 'Quint.easeOut',
                                duration: 1500,
                                onComplete: () => {
                                    repeatDeathHandsRotate();
                                    PhaserScene.tweens.add({
                                        targets: [scythe],
                                        alpha: 0,
                                        delay: 50,
                                        scaleX: 0.5,
                                        scaleY: 0.5,
                                        ease: 'Cubic.easeIn',
                                        duration: 600,
                                        onComplete: () => {
                                            scythe.destroy();
                                            enemy.destroy();
                                            setFloatingDeathDepth(100010);
                                            handleReaperDialog(level, () => {
                                                gameVars.deathFlutterDelay = 10;
                                                repeatDeathFlutterAnimation(-0.25);
                                                if (globalObjects.deathLeftHand.currAnim) {
                                                    globalObjects.deathLeftHand.currAnim.stop();
                                                    globalObjects.deathRightHand.currAnim.stop();
                                                }
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
                                                        }
                                                    });
                                                });
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
                                                            globalObjects.magicCircle.enableMovement();
                                                            globalObjects.postFightScreen.createWinScreen(level);
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
        })
    // PhaserScene.tweens.add({
    //     targets: [globalObjects.floatingDeath, globalObjects.floatingDeath2],
    //     scaleX: 0.75,
    //     scaleY: 0.75,
    //     ease: 'Cubic.easeInOut',
    //     fakeAlpha: 1,
    //     duration: 1200,

    // });
}

function startDeathFlutterAnim() {
    globalObjects.floatingDeath2.setVisible(true).setAlpha(0).setScale(globalObjects.floatingDeath.scaleX).setDepth(globalObjects.floatingDeath.depth);
    gameVars.deathFlutterDelay = 0;
    repeatDeathFlutterAnimation();
}

function repeatDeathFlutterAnimation(alphaOffset = 0) {
    if (globalObjects.floatingDeath.flutterAnim) {
        globalObjects.floatingDeath.flutterAnim.stop();
    }

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
        ];
        break;
    case 4:
        reaperDialog = [
            getLangText('death4a'),
            getLangText('death4b'),
            getLangText('death4c'),
        ];
        break;
    case 5:
        reaperDialog = [
            getLangText('death5a'),
            getLangText('death5b'),
        ];
        break;
    case 6:
        reaperDialog = [
            getLangText('death6a'),
            getLangText('death6b'),
        ];
        break;
    case 7:
        reaperDialog = [
            getLangText('death7a'),
            getLangText('death7b'),
            getLangText('death7c'),
        ];
        break;
    case 8:
        reaperDialog = [
            getLangText('death8a'),
            getLangText('death8b'),
            getLangText('death8c'),
        ];
        break;

    default:
        if (onComplete) {
            onComplete();
        }
        return;
    }
    playReaperDialog(reaperDialog, onComplete);
}

function playReaperDialog(dialog, onComplete) {
    globalObjects.bannerTextManager.setDialog(dialog);
    let fogSliceDarken = getFogSliceDarken();
    PhaserScene.tweens.add({
        targets: fogSliceDarken,
        alpha: 0.5,
        ease: 'Cubic.easeOut',
        duration: 500,
    });
    globalObjects.bannerTextManager.showBanner();
    globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight + 10);
    globalObjects.bannerTextManager.setOnFinishFunc(onComplete, 100)
    // if (!globalObjects.reaperText) {
    //     globalObjects.reaperTextBG = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight + 25, 'misc', 'victory_banner.png').setScale(100, 1).setDepth(100002).setAlpha(0);
    //     globalObjects.reaperText = this.scene.add.text(gameConsts.halfWidth, globalObjects.reaperTextBG.y, '...', {fontFamily: 'garamond', fontSize: 26, color: '#FFFFFF', align: 'center'}).setAlpha(0).setOrigin(0.5, 0.5).setDepth(100002);
    //     globalObjects.reaperText.setFontStyle('italic');
    // }

}
