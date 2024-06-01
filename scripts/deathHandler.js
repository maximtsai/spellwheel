function showVictoryScreen() {
    globalObjects.player.getPlayerCastSpellsCount();
}

function swirlInReaperFog(customScale = 1.66) {
    let fogSwirlGlow = getFogSwirlGlow();
    let fogSwirl = getFogSwirl();

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
        globalObjects.fogSlice = PhaserScene.add.sprite(gameConsts.halfWidth + 12, -53, 'backgrounds', 'fog_slice.png').setDepth(-2).setOrigin(0.68, 0.29);
    }
    globalObjects.fogSlice.setAlpha(0.2).setScale(1.01).setRotation(-0.8);
    return globalObjects.fogSlice;
}

function getFogSliceDarken() {
    if (!globalObjects.fogSliceDarken) {
        globalObjects.fogSliceDarken = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setDepth(-3).setScale(500, 500);
    }
    globalObjects.fogSliceDarken.setAlpha(1);
    return globalObjects.fogSliceDarken;
}

function getFogSwirl() {
    if (!globalObjects.fogSwirl) {
        globalObjects.fogSwirl = PhaserScene.add.sprite(gameConsts.halfWidth, 240, 'backgrounds', 'fog_swirl.png').setDepth(-4).setScale(2.2).setRotation(-1).setAlpha(0);
    }
    if (globalObjects.fogSwirl.alpha == 0) {
        globalObjects.fogSwirl.setScale(2.25).setRotation(-1);
    }
    return globalObjects.fogSwirl;
}

function getFloatingDeath() {
    if (!globalObjects.floatingDeath) {
        globalObjects.floatingDeath = PhaserScene.add.sprite(gameConsts.halfWidth, 95, 'enemies', 'max_death_1a.png').setDepth(-1);
        globalObjects.floatingDeath.setAlpha(0.4).setScale(0.35);
        globalObjects.floatingDeath2 = PhaserScene.add.sprite(gameConsts.halfWidth, 95, 'enemies', 'max_death_1b.png').setDepth(-1).setVisible(false);
    }
    if (globalObjects.floatingDeath.visible === false) {
        globalObjects.floatingDeath.setVisible(true).setAlpha(0.4).setScale(0.35).setDepth(-1);
        globalObjects.floatingDeath2.setVisible(false);
    }
    globalObjects.floatingDeath.fakeAlpha = globalObjects.floatingDeath.alpha;
    globalObjects.floatingDeath2.fakeAlpha = globalObjects.floatingDeath.alpha;

    return globalObjects.floatingDeath;
}

function getFogSwirlGlow() {
    if (!globalObjects.fogSwirlGlow) {
        globalObjects.fogSwirlGlow = PhaserScene.add.sprite(gameConsts.halfWidth, 225, 'backgrounds', 'fog_swirl_glow.png').setDepth(-4).setAlpha(0);
    }
    if (globalObjects.fogSwirlGlow.alpha == 0) {
        globalObjects.fogSwirlGlow.setScale(2).setRotation(-1);
    }
    return globalObjects.fogSwirlGlow;
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
    PhaserScene.tweens.add({
        targets: [globalObjects.floatingDeath, globalObjects.floatingDeath2],
        scaleX: 0.75,
        scaleY: 0.75,
        ease: 'Cubic.easeInOut',
        fakeAlpha: 1,
        duration: 1200,
        onComplete: () => {
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
                            let oldSwirlAlpha = globalObjects.fogSwirl.alpha;

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
                                            globalObjects.floatingDeath.setDepth(100010);
                                            globalObjects.floatingDeath2.setDepth(100010);
                                            handleReaperDialog(level, () => {
                                                gameVars.deathFlutterDelay = 10;
                                                repeatDeathFlutterAnimation(-0.25);
                                                PhaserScene.tweens.add({
                                                    targets: [globalObjects.floatingDeath, globalObjects.floatingDeath2],
                                                    fakeAlpha: 0.1,
                                                    scaleX: 0.5,
                                                    scaleY: 0.5,
                                                    ease: 'Quad.easeIn',
                                                    duration: 1100,
                                                    onComplete: () => {
                                                        globalObjects.floatingDeath.flutterAnim.stop();
                                                        globalObjects.floatingDeath.visible = true;
                                                        globalObjects.floatingDeath2.visible = false;
                                                        globalObjects.floatingDeath.alpha = 0.1;
                                                        PhaserScene.tweens.add({
                                                            targets: [globalObjects.floatingDeath],
                                                            alpha: 0,
                                                            fakeAlpha: 0,
                                                            scaleX: 0.3,
                                                            scaleY: 0.3,
                                                            duration: 300,
                                                            onComplete: () => {
                                                                globalObjects.floatingDeath.visible = false;
                                                            }
                                                        });
                                                    }
                                                });
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
        }
    });
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
            "...OH? IT'S YOU AGAIN.",
            "YOU DO NOT BELONG HERE,\nIN THE LANDS OF PASSING.",
            "TURN BACK TO\nWHERE YOU CAME FROM."
            ];
        break;
    case 3:
        reaperDialog = [
            "I WILL ONLY\nWARN YOU ONCE MORE,",
            "THAT WHICH YOU SEEK HERE\nCANNOT BE ATTAINED.",
            "RETURN TO THE MORTAL REALM.",
        ];
        break;
    case 4:
        reaperDialog = [
            "THE MAGICIAN THOUGHT HIS\nMAGIC COULD ELUDE ME,",
            "BUT THE PASSAGE OF TIME\nCANNOT BE UNDONE.",
            "AND NEITHER CAN YOUR\nLOVED ONE RETURN.",
        ];
        break;
    case 5:
        reaperDialog = [
            "YOU ARE PERSISTENT.",
            "BUT UNDERSTAND THAT ONLY\nMISERY AWAITS AT THE END.",
        ];
        break;
    case 6:
        reaperDialog = [
            "I SHOULD PERHAPS TELL YOU...",
            "THAT YOU ARE MAKING\nQUITE A MESS OF THINGS.",
            "AND MY SCHEDULE IS\nBUSY ENOUGH AS-IS.",
        ];
        break;
    case 7:
        reaperDialog = [
            "ALAS, IT IS NOT WITHIN MY\nAUTHORITY TO STOP YOU.",
            "BUT SHOULD YOU PERHAPS... \'STUMBLE\'",
            "THEN THAT WILL BE A VERY\nDIFFERENT STORY.",
        ];
        break;
    case 8:
        reaperDialog = [
            "...",
            "I HAVE A FEELING THAT\nIT WON'T BE LONG",
            "BEFORE I HAVE BUSINESS WITH YOU.",
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
