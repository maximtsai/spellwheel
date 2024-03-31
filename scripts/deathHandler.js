function showVictoryScreen() {
    globalObjects.player.getPlayerCastSpellsCount();
}

function swirlInReaperFog() {
    let fogSwirlGlow = getFogSwirlGlow();
    let fogSwirl = getFogSwirl();

    fogSwirl.currAnimScale = PhaserScene.tweens.add({
        targets: [fogSwirl, fogSwirlGlow],
        scaleX: 1.6,
        scaleY: 1.6,
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

function getFogSlice() {
    if (!globalObjects.fogSlice) {
        globalObjects.fogSlice = PhaserScene.add.sprite(gameConsts.halfWidth, 170, 'backgrounds', 'fog_slice.jpg').setDepth(-2).setOrigin(0.5, 0.4);
    }
    globalObjects.fogSlice.setAlpha(0).setScale(0.6).setRotation(-0.45);
    return globalObjects.fogSlice;
}

function getFogSwirl() {
    if (!globalObjects.fogSwirl) {
        globalObjects.fogSwirl = PhaserScene.add.sprite(gameConsts.halfWidth, 240, 'backgrounds', 'fog_swirl.png').setDepth(-2);
    }
    globalObjects.fogSwirl.setAlpha(0).setScale(2.2).setRotation(-1);
    return globalObjects.fogSwirl;
}

function getFogSwirlGlow() {
    if (!globalObjects.fogSwirlGlow) {
        globalObjects.fogSwirlGlow = PhaserScene.add.sprite(gameConsts.halfWidth, 225, 'backgrounds', 'fog_swirl_glow.png').setDepth(-2);
    }
    globalObjects.fogSwirlGlow.setAlpha(0).setScale(2).setRotation(-1);
    return globalObjects.fogSwirlGlow;
}


function playReaperAnim(enemy) {
    let floatingDeath = PhaserScene.add.sprite(gameConsts.halfWidth, 130, 'misc', 'floating_death.png').setDepth(-1).setAlpha(0.5).setScale(0.35);
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
            scaleX: 1.09,
            scaleY: 1.09,
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
                    scaleX: 1.08,
                    scaleY: 1.08,
                    alpha: 0.92,
                    ease: 'Quad.easeOut',
                    duration: 1000,
                });
                globalObjects.fogSwirl.currAnim.stop();
                globalObjects.fogSwirl.currAnim = newAnim;
            }
        });;

    }
    PhaserScene.tweens.add({
        targets: floatingDeath,
        scaleX: 0.75,
        scaleY: 0.75,
        ease: 'Cubic.easeInOut',
        alpha: 1,
        duration: 1200,
        onComplete: () => {
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
                    PhaserScene.tweens.add({
                        targets: scythe,
                        rotation: 0,
                        ease: 'Cubic.easeOut',
                        duration: 800,
                        completeDelay: 100,
                        onComplete: () => {
                            let fogSlice = getFogSlice();
                            PhaserScene.tweens.add({
                                targets: fogSlice,
                                scaleX: 1,
                                scaleY: 1,
                                ease: 'Quart.easeOut',
                                alpha: 1,
                                duration: 100,
                                completeDelay: 150,
                                onComplete: () => {
                                    PhaserScene.tweens.add({
                                        targets: fogSlice,
                                        ease: 'Quart.easeIn',
                                        alpha: 0,
                                        duration: 1200,
                                    });

                                }
                            });
                            PhaserScene.tweens.add({
                                targets: fogSlice,
                                rotation: -0.65,
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
                                        targets: [floatingDeath, scythe],
                                        alpha: 0,
                                        scaleX: 0.5,
                                        scaleY: 0.5,
                                        ease: 'Cubic.easeIn',
                                        duration: 1000,
                                        onComplete: () => {
                                            floatingDeath.destroy();
                                            scythe.destroy();
                                            globalObjects.postFightScreen.createWinScreen(enemy.getLevel());
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
