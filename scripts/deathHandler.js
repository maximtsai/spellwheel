

function playReaperAnim(enemy) {
    let floatingDeath = PhaserScene.add.sprite(gameConsts.halfWidth, 150, 'misc', 'floating_death.png').setDepth(-1).setAlpha(0).setScale(0.35);
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
