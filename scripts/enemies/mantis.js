 class Mantis extends Enemy {
     constructor(scene, x, y, level) {
         super(scene, x, y, level);
         this.initSprite('mantis_a.png', 1);
         this.backForthDelay = 300;
         this.addTimeout(() => {
             this.backForthAnim();
         }, 10)
         // ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MIND, RUNE_MIND, null, null, null , RUNE_MATTER];
     }

     backForthAnim() {
         this.addDelayedCall(this.backForthDelay, () => {
            if (!this.dead && !this.isDestroyed && !this.isUnloading) {
                if (this.defaultSprite === 'mantis_a.png') {
                    this.sprite.setFrame('mantis_b.png');
                }
                this.addDelayedCall(this.backForthDelay, () => {
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
         this.health = gameVars.isHardMode ? 225 : 210;
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
        let attackDamages = gameVars.isHardMode ? 14 : 10;
        let attackTimes = 22;
         this.attacks = [
             [
                 // 0
                 {
                     name: ";"+attackDamages+"x"+attackTimes+"; ",
                     desc: "Secret weapon",
                     chargeAmt: 1300,
                     damage: -1,
                     finishDelay: 8000,
                     startFunction: () => {
                        playSound('enemy_attack');
                        this.addDelay(() => {
                            playSound('enemy_attack_2');
                            this.angrySymbol.x += 29;
                            this.attackName.setText("|;"+attackDamages+"x"+attackTimes+";| ");
                            this.addDelay(() => {
                                this.bgMusic = playMusic('into_the_void', 0.82, true);

                                playSound('enemy_attack_major');
                                this.angrySymbol.x += 28;
                                this.attackName.setText("}|;"+attackDamages+"x"+attackTimes+";|} ");
                            }, 550);
                        }, 550);
                     },
                     attackStartFunction: () => {
                        this.isUnloading = true;
                        this.setSprite('mantis_preparing.png')
                        this.addDelayedCall(300, () => {
                            if (this.dead) {
                                return;
                            }
                            this.setSprite('mantis_reveal.png');
                            if (this.bgMusic) {
                                this.bgMusic.stop();
                            }
                            this.addDelayedCall(400, () => {
                                if (this.dead) {
                                    return;
                                }
                                playSound('guncock');
                            });

                            this.addDelayedCall(500, () => {
                                if (this.dead) {
                                    return;
                                }
                                this.setDefaultSprite('mantis_unveiled.png');
                                this.sprite.setScale(1.01, 1.05);
                                this.addTween({
                                    targets: this.sprite,
                                    scaleX: 1,
                                    scaleY: 1,
                                    duration: 600,
                                    ease: 'Back.easeOut',
                                });
                                this.addDelayedCall(2000, () => {
                                    if (this.dead) {
                                        return;
                                    }
                                    let attackText = PhaserScene.add.bitmapText(this.sprite.x + 120, this.sprite.y - 120, 'damage', "GET 'EM", 42, 1).setDepth(999).setOrigin(0.5, 0.5);
                                    this.addTween({
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
                                    this.addDelay(() => {
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
                     chargeAmt: 250,
                    transitionFast: true,
                    isPassive: true,
                     damage: -1,
                     startFunction: () => {
                        this.setDefaultSprite('mantis_unveiled.png');
                        this.pullbackDurMult = 0.01;
                     },
                     attackStartFunction: () => {

                     },
                 },
                 {
                     name: "PANIK!",
                     chargeAmt: 1000,
                    isPassive: true,
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
                    isPassive: true,
                     damage: -1,
                     startFunction: () => {
                         playSound('magic', 0.4);
                        this.backForthAnim();
                        this.repeatTweenBreathe();
                     },
                     attackFinishFunction: () => {
                        this.pullbackDurMult = 1;
                     }
                 },

             ]

         ];
     }

     panik() {
        if (this.isPaniking) {
            let detuneAmt = Math.floor((Math.random() - 0.5) * 1500);
            playSound('derp', 0.8).detune = detuneAmt;
            let isUpsideDown = this.isAngry && Math.random() < 0.1;
            this.panicTween = this.addTween({
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
            this.gunFlash1 = this.addImage(this.sprite.x - 50, this.sprite.y + 10, 'enemies', 'gunflash_1.png').setDepth(11).setVisible(false);
            this.gunFlash2 = this.addImage(this.sprite.x + 50, this.sprite.y + 10, 'enemies', 'gunflash_1.png').setDepth(11).setVisible(false);
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
            // this.gunFlash1.visible = false;
            // this.gunFlash2.visible = false;
            this.setDefaultSprite('mantis_unveiled.png', undefined, false);
            return;
        } else {
            this.gunFlash1.setVisible(true);
            this.gunFlash2.setVisible(true);
        }
        let flashDelay = 36;
        for (let i = 1; i <= 6; i++) {
            this.addDelay(() => {
                if (!this.dead) {
                    let randFrameNum = Math.floor(Math.random() * 5) + 1;
                    let randFrame = 'gunflash_' + randFrameNum + '.png';
                    let isLeft = i % 2 == 1;
                    if (i == 1) {
                        this.gunFlash1.setScale(1.8);
                        this.currGunFlash1 = this.scene.tweens.add({
                            targets: this.gunFlash1,
                            scaleX: 1,
                            scaleY: 1,
                            duration: 100,
                            ease: 'Cubic.easeOut',
                        });
                    } else if (i == 2) {
                        this.gunFlash2.setScale(1.8);
                        this.currGunFlash2 = this.scene.tweens.add({
                            targets: this.gunFlash2,
                            scaleX: 1,
                            scaleY: 1,
                            duration: 100,
                            ease: 'Cubic.easeOut',
                        });
                    }
                    if (isLeft) {
                        this.setSprite('mantis_shoot_left.png');
                        this.gunFlash1.setPosition(this.sprite.x - 85 + Math.random() * 30, this.sprite.y - 15 + Math.random() * 65).setFrame(randFrame).setRotation(Math.random());
                    } else {
                        this.setSprite('mantis_shoot_right.png');
                        this.gunFlash2.setPosition(this.sprite.x + 85 - Math.random() * 30, this.sprite.y - 15 + Math.random() * 65).setFrame(randFrame).setRotation(Math.random());
                    }
                    if (hits === 1 && i == 6) {
                        this.gunFlash1.setScale(2.5).setPosition(this.sprite.x - 70, this.sprite.y + 25).setFrame('gunflash_1.png')
                        this.gunFlash2.setScale(2.5).setPosition(this.sprite.x + 70, this.sprite.y + 25).setFrame('gunflash_2.png')
                        this.currGunFlash1.stop();
                        this.currGunFlash2.stop();
                        this.scene.tweens.add({
                            targets: this.gunFlash1,
                            scaleX: 1,
                            scaleY: 1,
                            duration: 200,
                            ease: 'Cubic.easeOut',
                        });
                        this.scene.tweens.add({
                            targets: this.gunFlash2,
                            scaleX: 1,
                            scaleY: 1,
                            duration: 200,
                            ease: 'Cubic.easeOut',
                            onComplete: () => {
                                this.gunFlash1.visible = false;
                                this.gunFlash2.visible = false;
                            }
                        });
                    }
                    let powSize = hits < 2 ? 1.25 : 1;
                    if (i == 2) {
                        messageBus.publish("selfTakeDamage", damage);
                        messageBus.publish('showCircleShadow', 0.08, -960);

                         let powEffect = getTempPoolObject('circle', 'blastEffect0.png', 'blastEffect', 300);
                         let randX = 90 * (Math.random() - 1)
                         powEffect.setPosition(gameConsts.halfWidth + randX, globalObjects.player.getY() - 210 + Math.abs(randX) * 0.3).setDepth(998).play('blastEffect').setScale(powSize).setRotation(Math.random() * 6);
                    } else if (i == 5) {
                        let powEffect = getTempPoolObject('circle', 'blastEffect0.png', 'blastEffect', 300);
                         let randX = 90 * Math.random()
                         powEffect.setPosition(gameConsts.halfWidth + randX, globalObjects.player.getY() - 210 + Math.abs(randX) * 0.3).setDepth(998).play('blastEffect').setScale(powSize).setRotation(Math.random() * 6);
                    } else if (i == 6) {
                        this.repeatGunSequenceA(damage, hits - 1);
                    }
                }
            }, flashDelay * i);
        }

    }

     initSpriteAnim(scale) {
         super.initSpriteAnim(scale);
         this.sprite.startX = this.sprite.x;

         this.sprite.startX = this.sprite.x;
         this.sprite.startY = this.sprite.y;
         this.sprite.x = gameConsts.halfWidth + 120;
         this.sprite.y = this.sprite.startY + 24;
         this.sprite.setRotation(0.15);
         this.addTween({
             targets: this.sprite,
             y: this.sprite.startY,
             duration: gameVars.gameManualSlowSpeedInverse * 900,
             ease: 'Quart.easeOut',
         });
         this.addTween({
             targets: this.sprite,
             x: this.sprite.startX,
             rotation: 0,
             duration: gameVars.gameManualSlowSpeedInverse * 900,
             ease: 'Cubic.easeOut',
             onComplete: () => {
                 this.repeatTweenBreathe();
             }
         });
         this.addDelay(() => {
             this.backForthDelay = 1000;
         }, 700)
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
         globalObjects.encyclopedia.hideButton();
         globalObjects.options.hideButton();
        if (this.currAnim) {
            this.currAnim.stop();
        }
        if (this.gunFlash1) {
            this.gunFlash1.alpha = 0;
            this.gunFlash2.alpha = 0;
        }
         this.isPaniking = false;

        playSound('goblin_grunt');
        if (this.isUnloading) {
            this.head1 = this.addImage(this.sprite.x + 12, this.sprite.y -68, 'enemies', 'mantis_head_1.png').setDepth(8).setScale(this.sprite.startScale);
            this.head2 = this.addImage(this.sprite.x + 12, this.sprite.y -15, 'enemies', 'mantis_head_2.png').setDepth(8).setScale(this.sprite.startScale);
            this.head3 = this.addImage(this.sprite.x + 12, this.sprite.y + 32, 'enemies', 'mantis_head_3.png').setDepth(8).setScale(this.sprite.startScale);
             this.addTween({
                 targets: this.head1,
                 y: this.sprite.y + 120,
                 ease: "Cubic.easeIn",
                 duration: 1050,
             });
             this.addTween({
                 targets: this.head2,
                 y: this.sprite.y + 120,
                 ease: "Cubic.easeIn",
                 duration: 850,
             });
             this.addTween({
                 targets: this.head3,
                 y: this.sprite.y + 120,
                 ease: "Cubic.easeIn",
                 duration: 600,
             });

             this.addTween({
                 targets: this.head1,
                 x: this.sprite.x - 70,
                 rotation: -1.5,
                 duration: 1050,
             });
             this.addTween({
                 targets: this.head2,
                 x: this.sprite.x + 65,
                 rotation: 3.14,
                 duration: 850,
             });
             this.addTween({
                 targets: this.head3,
                 x: this.sprite.x - 10,
                 rotation: -0.2,
                 duration: 600,
             });


            this.setDefaultSprite('mantis_shoot_headless.png').setScale(this.sprite.startScale *1.05);
            this.sprite.setOrigin(0.5, 0.98).setPosition(this.sprite.x, this.sprite.y + 275 * 0.57)
             this.addTween({
                delay: 3000,
                 targets: this.sprite,
                 rotation: -0.3,
                 scaleX: this.sprite.startScale * 1,
                 scaleY: this.sprite.startScale * 0.55,
                 ease: "Cubic.easeIn",
                 duration: 1200,
                 onComplete: () => {
                    this.lieDown()
                     this.addTween({
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
        playSound('clunk2');
         this.setDefaultSprite('mantis_dead.png', this.sprite.startScale, true);
         this.sprite.setRotation(0).setScale(this.sprite.startScale);
         this.addTimeout(() => {
            let rune = this.addImage(this.x, this.y, 'tutorial', 'rune_protect_large.png').setScale(0.5).setDepth(9999).setVisible(false);
            playSound('victory_2');
            this.addTween({
                targets: rune,
                x: gameConsts.halfWidth,
                y: gameConsts.halfHeight - 170,
                scaleX: 1,
                scaleY: 1,
                ease: "Cubic.easeOut",
                duration: 600,
                onComplete: () => {
                    this.showVictory(rune);
                }
            });
         }, 1850);
     }

}
