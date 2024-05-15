 class Mantis extends Enemy {
     constructor(scene, x, y, level) {
         super(scene, x, y, level);
         this.initSprite('mantis_a.png', 0.92);
         this.bgMusic = playSound('fightbg1', 0.7, true);

         // ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MIND, RUNE_MIND, null, null, null , RUNE_MATTER];
         setTimeout(() => {
             this.backForthAnim();
         }, 100);
     }

     backForthAnim() {
         PhaserScene.time.delayedCall(1000, () => {
            if (!this.dead && !this.isDestroyed && !this.isUnloading) {
                if (this.defaultSprite === 'mantis_a.png') {
                    this.sprite.setFrame('mantis_b.png');
                }
                PhaserScene.time.delayedCall(1000, () => {
                    if (!this.dead && !this.isDestroyed && !this.isUnloading) {
                        if (this.defaultSprite === 'mantis_a.png') {
                            this.sprite.setFrame('mantis_a.png');
                        }
                        this.backForthAnim();
                    }
                });
            }
         });
     }
     initStatsCustom() {
         this.health = gameVars.isHardMode ? 240 : 180;
         this.pullbackDurMult = 0.5;
         this.pullbackScale = 0.99;
         this.pullbackScaleDefault = 0.99;
         this.attackScale = 1.01;
     }

     // update(dt) {}


     setHealth(newHealth) {
         super.setHealth(newHealth);
         let prevHealthPercent = this.prevHealth / this.healthMax;
         let currHealthPercent = this.health / this.healthMax;
         if (currHealthPercent == 0) {
             // dead, can't do anything
             return;
         }
     }

     initAttacks() {
        let attackDamages = 14;
        let attackTimes = 16;
         this.attacks = [
             [
                 // 0
                 {
                     name: ";"+attackDamages+"x"+attackTimes+"; ",
                     desc: "Secret weapon",
                     chargeAmt: 1200,
                     damage: -1,
                     finishDelay: 8000,
                     startFunction: () => {
                        playSound('enemy_attack');
                        setTimeout(() => {
                            playSound('enemy_attack_2');
                            this.attackName.setText("|;"+attackDamages+"x"+attackTimes+";| ");
                            setTimeout(() => {
                                playSound('enemy_attack_major');
                                this.attackName.setText("}|;"+attackDamages+"x"+attackTimes+";|} ");
                            }, 550);
                        }, 550);
                     },
                     attackStartFunction: () => {
                        this.isUnloading = true;
                        this.setSprite('mantis_preparing.png')
                        PhaserScene.time.delayedCall(300, () => {
                            if (this.dead) {
                                return;
                            }
                            this.setSprite('mantis_reveal.png');
                            this.bgMusic.stop();
                            PhaserScene.time.delayedCall(500, () => {
                                if (this.dead) {
                                    return;
                                }
                                this.setDefaultSprite('mantis_unveiled.png');
                                this.sprite.setScale(0.88, 0.93);
                                PhaserScene.tweens.add({
                                    targets: this.sprite,
                                    scaleX: 0.9,
                                    scaleY: 0.9,
                                    duration: 600,
                                    ease: 'Back.easeOut',
                                });
                                PhaserScene.time.delayedCall(1500, () => {
                                    if (this.dead) {
                                        return;
                                    }
                                    let attackText = PhaserScene.add.bitmapText(this.sprite.x + 120, this.sprite.y - 120, 'damage', "GET EM'", 42, 1).setDepth(999).setOrigin(0.5, 0.5);
                                    PhaserScene.tweens.add({
                                         targets: attackText,
                                         x: this.sprite.x + 127,
                                         duration: 20,
                                         ease: 'Quint.easeOut',
                                         yoyo: true,
                                         repeat: 7,
                                         repeatDelay: 150,
                                         onComplete: () => {
                                            attackText.destroy();
                                         }
                                     });
                                    this.bgMusic = playSound('gunsequence', 0.75);
                                    setTimeout(() => {
                                        if (this.dead) {
                                            return;
                                        }
                                        this.startGunSequence(attackDamages, attackTimes);
                                    }, 500)
                                });
                            })
                        })
                     },
                     attackFinishFunction: () => {
                     }
                 },
                 {
                     name: "...ARE YOU ALIVE?",
                     chargeAmt: 500,
                     damage: -1,
                     chargeMult: 4,
                     startFunction: () => {
                        this.setDefaultSprite('mantis_unveiled.png')

                     },
                     attackStartFunction: () => {

                     },
                 },
                 {
                     name: "PANIK!",
                     chargeAmt: 1000,
                     damage: -1,
                     chargeMult: 8,
                     startFunction: () => {
                        this.isUnloading = false;
                        this.setDefaultSprite('mantis_a.png');
                        this.isPaniking = true;
                        this.panik();
                     },
                     attackFinishFunction: () => {
                        this.isPaniking = false;
                        this.panicTween.stop();
                        this.sprite.setScale(this.sprite.startScale);
                     },
                 },
                 {
                     name: "KALM",
                     chargeAmt: 150,
                     damage: -1,
                     startFunction: () => {
                        this.backForthAnim();
                        this.repeatTweenBreathe();
                     },
                 },

             ]

         ];
     }

     panik() {
        if (this.isPaniking) {
            let isUpsideDown = this.isAngry && Math.random() < 0.1;
            this.panicTween = PhaserScene.tweens.add({
                delay: this.isAngry ? 150 : 300,
                 targets: this.sprite,
                 scaleX: -this.sprite.scaleX,
                 scaleY: isUpsideDown ? -this.sprite.startScale : this.sprite.startScale,
                 duration: 10,
                 ease: 'Quint.easeOut',
                 onComplete: () => {
                    this.panik();
                 }
             });
        }

     }

    startGunSequence(attackDamages, attackTimes) {
        if (!this.gunFlash1) {
            this.gunFlash1 = PhaserScene.add.sprite(this.sprite.x - 50, this.sprite.y + 10, 'enemies', 'gunflash_1.png').setDepth(11).setVisible(false);
            this.gunFlash2 = PhaserScene.add.sprite(this.sprite.x + 50, this.sprite.y + 10, 'enemies', 'gunflash_1.png').setDepth(11).setVisible(false);
            this.addToDestructibles(this.gunFlash1);
            this.addToDestructibles(this.gunFlash2);
        }
        if (!this.dead) {
            this.repeatGunSequenceA(attackDamages, attackTimes);
        }
    }

    repeatGunSequenceA(damage = 1, hits = 0) {
        if (this.dead) {
            return;
        }
        if (hits === 0) {
            this.gunFlash1.visible = false;
            this.gunFlash2.visible = false;
            this.setDefaultSprite('mantis_unveiled.png')
            return;
        }
        let flashDelay = 65;
        for (let i = 1; i <= 6; i++) {
            setTimeout(() => {
                if (!this.dead) {
                    if (i == 2) {
                        messageBus.publish("selfTakeDamage", damage);
                    } else if (i == 6) {
                        this.repeatGunSequenceA(damage, hits - 1);
                    }
                    let randFrameNum = Math.floor(Math.random() * 5) + 1;
                    let randFrame = 'gunflash_' + randFrameNum + '.png';
                    let isLeft = i % 2 == 1;
                    if (i == 1) {
                        this.gunFlash1.setScale(1.8);
                        this.scene.tweens.add({
                            targets: this.gunFlash1,
                            scaleX: 1,
                            scaleY: 1,
                            duration: 100,
                            ease: 'Cubic.easeOut',
                        });
                    } else if (i == 2) {
                        this.gunFlash2.setScale(1.8);
                        this.scene.tweens.add({
                            targets: this.gunFlash2,
                            scaleX: 1,
                            scaleY: 1,
                            duration: 100,
                            ease: 'Cubic.easeOut',
                        });
                    }
                    if (isLeft) {
                        this.setSprite('mantis_shoot_left.png');
                        this.gunFlash1.setPosition(this.sprite.x - 85 + Math.random() * 30, this.sprite.y - 15 + Math.random() * 65).setVisible(true).setFrame(randFrame).setRotation(Math.random());
                    } else {
                        this.setSprite('mantis_shoot_right.png');
                        this.gunFlash2.setPosition(this.sprite.x + 85 - Math.random() * 30, this.sprite.y - 15 + Math.random() * 65).setVisible(true).setFrame(randFrame).setRotation(Math.random());
                    }
                }
            }, flashDelay * i);
        }

    }

     initSpriteAnim(scale) {
         super.initSpriteAnim(scale);
         this.sprite.startX = this.sprite.x;

         this.repeatTweenBreathe();
     }

     repeatTweenBreathe(duration = 1500, magnitude = 1) {
         if (this.breatheTween) {
             this.breatheTween.stop();
         }
         if (this.isUnloading) {
            return;
         }
         let horizMove = Math.ceil(3.5 * magnitude);
         this.breatheTween = this.scene.tweens.add({
             targets: this.sprite,
             duration: duration * (Math.random() * 0.5 + 1),
             rotation: -0.02 * magnitude,
             x: this.sprite.startX - horizMove,
             ease: 'Cubic.easeInOut',
             completeDelay: 150,
             onComplete: () => {
                 if (this.isUnloading) {
                    return;
                 }
                 this.breatheTween = this.scene.tweens.add({
                     targets: this.sprite,
                     duration: duration * (Math.random() * 0.5 + 1),
                     rotation: 0.02 * magnitude,
                     x: this.sprite.startX + horizMove,
                     ease: 'Cubic.easeInOut',
                     completeDelay: 150,
                     onComplete: () => {
                         this.repeatTweenBreathe(duration, magnitude);
                     }
                 });
             }
         });
     }

     die() {
        if (this.dead) {
             return;
        }
        super.die();
        if (this.currAnim) {
            this.currAnim.stop();
        }
        if (this.gunFlash1) {
            this.gunFlash1.alpha = 0;
            this.gunFlash2.alpha = 0;
        }

        playSound('goblin_grunt');
        if (this.isUnloading) {
            this.head1 = PhaserScene.add.sprite(this.sprite.x + 12, this.sprite.y -68, 'enemies', 'mantis_head_1.png').setDepth(8).setScale(this.sprite.startScale);
            this.head2 = PhaserScene.add.sprite(this.sprite.x + 12, this.sprite.y -15, 'enemies', 'mantis_head_2.png').setDepth(8).setScale(this.sprite.startScale);
            this.head3 = PhaserScene.add.sprite(this.sprite.x + 12, this.sprite.y + 32, 'enemies', 'mantis_head_3.png').setDepth(8).setScale(this.sprite.startScale);
            this.addToDestructibles(this.head1); this.addToDestructibles(this.head2); this.addToDestructibles(this.head3);
             PhaserScene.tweens.add({
                 targets: this.head1,
                 y: this.sprite.y + 120,
                 ease: "Cubic.easeIn",
                 duration: 1050,
             });
             PhaserScene.tweens.add({
                 targets: this.head2,
                 y: this.sprite.y + 120,
                 ease: "Cubic.easeIn",
                 duration: 850,
             });
             PhaserScene.tweens.add({
                 targets: this.head3,
                 y: this.sprite.y + 120,
                 ease: "Cubic.easeIn",
                 duration: 600,
             });

             PhaserScene.tweens.add({
                 targets: this.head1,
                 x: this.sprite.x - 70,
                 rotation: -1.5,
                 duration: 1050,
             });
             PhaserScene.tweens.add({
                 targets: this.head2,
                 x: this.sprite.x + 65,
                 rotation: 3.14,
                 duration: 850,
             });
             PhaserScene.tweens.add({
                 targets: this.head3,
                 x: this.sprite.x - 10,
                 rotation: -0.2,
                 duration: 600,
             });


            this.setDefaultSprite('mantis_shoot_headless.png').setScale(this.sprite.startScale * 0.94);
            this.sprite.setOrigin(0.5, 0.98).setPosition(this.sprite.x, this.sprite.y + 275 * 0.57)
             PhaserScene.tweens.add({
                delay: 3000,
                 targets: this.sprite,
                 rotation: -0.3,
                 scaleX: this.sprite.startScale * 0.88,
                 scaleY: this.sprite.startScale * 0.5,
                 ease: "Cubic.easeIn",
                 duration: 1200,
                 onComplete: () => {
                    this.lieDown()
                     PhaserScene.tweens.add({
                         targets: [this.head1, this.head2, this.head3],
                         alpha: 0,
                         duration: 1000,
                     });
                 }
             });

        } else {
            this.lieDown();
        }

         this.dieClickBlocker = new Button({
             normal: {
                 ref: "blackPixel",
                 x: gameConsts.halfWidth,
                 y: gameConsts.halfHeight,
                 alpha: 0.001,
                 scaleX: 1000,
                 scaleY: 1000
             },
             onMouseUp: () => {

             }
         });

     }
     lieDown() {
         this.setDefaultSprite('mantis_dead.png', this.sprite.startScale, true);
         this.sprite.setRotation(0).setScale(this.sprite.startScale);
         this.y -= 10;
         setTimeout(() => {
            setTimeout(() => {
                let rune = this.scene.add.sprite(this.x, this.y, 'tutorial', 'rune_protect_large.png').setScale(0.5).setDepth(9999).setVisible(false);
                playSound('victory_2');
                PhaserScene.tweens.add({
                    targets: rune,
                    x: gameConsts.halfWidth,
                    y: gameConsts.halfHeight - 170,
                    scaleX: 1,
                    scaleY: 1,
                    ease: "Cubic.easeOut",
                    duration: 500,
                    onComplete: () => {
                        this.showVictory(rune);
                    }
                });
            }, 250)
         }, 1400);
     }

}
