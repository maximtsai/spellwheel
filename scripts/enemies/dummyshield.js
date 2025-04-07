 class Dummyshield extends Dummypractice {
    constructor(scene, x, y, level) {
        super(scene, x, y, level);
    }

     initStatsCustom() {
        this.health = 65;
        this.isAsleep = true;
        this.attackScale = 1;
        this.pullbackScale = 1;
        this.damageCanEmit = true;
        this.spellsCastCount = 0;
         this.disableSkip = true;
     }

     initTutorial() {
         globalObjects.magicCircle.disableMovement();
         globalObjects.bannerTextManager.setDialog([getLangText('level_dummy_shield'), getLangText('level_dummy_shield2')]);
         globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight + 10, 0);
         globalObjects.bannerTextManager.showBanner(false, language === 'fr');


         globalObjects.bannerTextManager.setOnFinishFunc(() => {
             globalObjects.magicCircle.enableMovement();
             globalObjects.bannerTextManager.setOnFinishFunc(() => {});
             globalObjects.bannerTextManager.closeBanner();

             this.addTimeout(() => {
                 this.createPicketSign();
                 this.skipBtn = this.createSkipBtn();
                 this.addToDestructibles(this.skipBtn);
             }, 100);

             this.playerSpellCastSub = messageBus.subscribe('playerCastedSpell', () => {
                 this.spellsCastCount++;
                 if (this.spellsCastCount === 5) {
                     globalObjects.textPopupManager.setInfoText(gameConsts.width, gameConsts.halfHeight - 160, getLangText('shield_dummy_overwrite'), 'right');
                     this.playerSpellCastSub.unsubscribe();
                 }
                 if (this.spellsCastCount >= 3 && this.spellsCastCount % 2 === 1) {
                     this.picketButton.setScale(1.02, 1.05);
                     this.picketVisual.setScale(1.02, 1.05);
                     this.picketButton.tweenToScale(1.05, 1.15, 200, 'Cubic.easeOut', undefined, () => {
                         this.picketButton.tweenToScale(1, 1, 700, 'Back.easeOut');
                     });
                     if (this.birdy && this.birdy.landed) {
                         this.birdy.currAnim = this.addTween({
                             targets: this.birdy,
                             y: this.picketVisual.y - 264,
                             ease: "Cubic.easeOut",
                             duration: 205,
                             onComplete: () => {
                                 this.birdy.currAnim = this.addTween({
                                     targets: this.birdy,
                                     y: this.picketVisual.y - 234,
                                     ease: "Back.easeOut",
                                     duration: 700,
                                 });
                             }
                         });
                     }
                     this.picketVisual.currAnim = this.addTween({
                         targets: this.picketVisual,
                         scaleX: 1.05,
                         scaleY: 1.15,
                         ease: "Cubic.easeOut",
                         duration: 200,
                         onComplete: () => {
                             this.picketVisual.currAnim = this.addTween({
                                 targets: this.picketVisual,
                                 scaleX: 1,
                                 scaleY: 1,
                                 ease: "Back.easeOut",
                                 duration: 700,
                             });
                         }
                     });

                 }
             });
             this.subscriptions.push(this.playerSpellCastSub);

             // messageBus.publish('enemyAddShield', 500)
         });
    }

    summonBird() {
        this.birdy = this.addSprite(-25, 5, 'enemies', 'bird_2.png').setRotation(1.1).setDepth(12);
        this.birdy.currAnim = this.addTween({
            targets: this.birdy,
            x: this.picketVisual.x + 50,
            ease: 'Quad.easeOut',
            duration: 1050,
            onComplete: () => {
                this.birdy.landed = true;
            }
        })
        this.birdy.currAnim2 = this.addTween({
            targets: this.birdy,
            y: this.picketVisual.y - 234,
            easeParams: [2],
            ease: 'Back.easeOut',
            rotation: 0.35,
            duration: 1050,
            onComplete: () => {
                this.birdy.setDepth(5);
                playSound('chirp1');
                this.birdy.setFrame('bird_1.png');
                this.birdy.setRotation(0).setScale(1, 1.15);
                this.birdy.currAnim2 = this.addTween({
                    targets: this.birdy,
                    scaleY: 1,
                    ease: 'Back.easeOut',
                    duration: 400,
                })
            }
        })
    }

    flyBird() {
        if (this.birdy) {
            if (this.birdy.currAnim) {
                this.birdy.currAnim.stop();
                this.birdy.currAnim2.stop();
            }
            this.birdy.setFrame('bird_2.png').setRotation(0.1);
            this.addTween({
                targets: this.birdy,
                y: -25,
                ease: 'Quart.easeIn',
                duration: 800,
            })
            this.addTween({
                targets: this.birdy,
                x: "+=250",
                ease: 'Quad.easeIn',
                duration: 800,
                onComplete: () => {
                    this.birdy.destroy();
                }
            })
        }
    }

    showGoal() {
        this.backingBox = this.addImage(0, 0, 'blackPixel').setAlpha(0);
        this.text = PhaserScene.add.text(8, 8, getLangText('level2_train_tut_a'), {fontFamily: 'garamondmax', fontSize: 24, color: '#FFFFFF', align: 'left'}).setAlpha(0).setOrigin(0, 0).setDepth(100);
        this.backingBox.setScale(this.text.width * 0.5 + 8, this.text.height * 0.5 + 8).setOrigin(0, 0);
        this.addToDestructibles(this.text);
        this.highlightGoal();
    }

    highlightGoal() {
        this.text.setScale(0.98);
        this.addTween({
             targets: [this.text],
             alpha: 1,
             scaleX: 1,
             scaleY: 1,
             ease: 'Back.easeOut',
             duration: 600,
         });
         this.addTween({
             targets: [this.backingBox],
             alpha: 0.8,
             duration: 600,
         });
    }

    createPicketSign() {
        this.picketVisual = this.addSprite(this.x - 170, this.y + 18, 'dummyenemy', 'picketsign.png').setScale(1, 0).setOrigin(0.5, 1).setDepth(11);
        setTimeout(() => {
            playSound('balloon', 0.5).detune = -250;
        }, 150)
        this.addTween({
            targets: this.picketVisual,
            scaleY: 1,
            ease: "Back.easeOut",
            duration: 500,
            onComplete: () => {
                this.summonBird();
                this.addTimeout(() => {
                    this.showGoal()
                }, 600)
                this.picketButton = new Button({
                    normal: {
                        ref: "picketsign.png",
                        atlas: "dummyenemy",
                        alpha: 1,
                        x: this.picketVisual.x,
                        y: this.picketVisual.y,
                    },
                    hover: {
                        ref: "picketsign_hover.png",
                        atlas: "dummyenemy",
                    },
                    press: {
                        ref: "picketsign_press.png",
                        atlas: "dummyenemy",
                        alpha: 1,
                    },
                    disable: {
                        alpha: 0
                    },
                    onHover: () => {
                        if (canvas) {
                            canvas.style.cursor = 'pointer';
                        }
                    },
                    onHoverOut: () => {
                        if (canvas) {
                            canvas.style.cursor = 'default';
                        }
                    },
                    onMouseUp: () => {
                        this.clickPicketSign();
                    }
                });
                this.picketButton.setOrigin(0.5, 1);
                this.picketButton.setDepth(11);
            }
        });
    }

    clickPicketSign() {
        this.bgMusic = playMusic('bite_down_simplified', 0.65, true);
        this.playerSpellCastSub.unsubscribe();
        globalObjects.textPopupManager.hideInfoText();
        this.picketButton.destroy();
        playSound('balloon', 0.5).detune = -500;
        this.flyBird();
        if (this.picketVisual.currAnim) {
            this.picketVisual.currAnim.stop();
        }
        this.picketButton = null;
        this.addTween({
            targets: this.picketVisual,
            scaleY: 0,
            scaleX: 0.5,
            ease: "Back.easeIn",
            duration: 400,
            easeParams: [1.5],
            completeDelay: 400,
            onComplete: () => {
                this.picketVisual.destroy();
                this.addTween({
                     targets: [this.text, this.backingBox],
                     alpha: 0,
                     duration: 600,
                 });
                this.startFight();
            }
        });
    }

     setHealth(newHealth) {
         super.setHealth(newHealth);
         let prevHealthPercent = this.prevHealth / this.healthMax;
         let currHealthPercent = this.health / this.healthMax;
         if (currHealthPercent == 0) {
             // dead, can't do anything
             return;
         }
     }

     cleanUp() {
        if (this.picketButton) {
            this.picketButton.destroy();
        }
         if (this.runSfxLoop) {
            fadeAwaySound(this.runSfxLoop, 300)
         }
     }

     die() {
         if (this.dead) {
             return;
         }
         if (this.rune1) {
             this.rune1.visible = false;
             this.rune2.visible = false;
         }
         if (this.malfunctionTween) {
            this.malfunctionTween.stop();
         }

         if (this.text){
             this.text.destroy();
         }
         if (this.backingBox) {
             this.backingBox.destroy();
         }

        playSound('clunk2');
         if (this.runTween) {
            this.runTween.stop();
         }
         if (this.runSfxLoop) {
            fadeAwaySound(this.runSfxLoop, 300)
         }
        if (this.picketButton) {
            this.picketButton.destroy();
            this.flyBird();
            if (this.picketVisual.currAnim) {
                this.picketVisual.currAnim.stop();
            }
            this.addTween({
                targets: this.picketVisual,
                scaleY: 0,
                scaleX: 0.5,
                ease: "Back.easeIn",
                duration: 400,
                easeParams: [1.5],
                completeDelay: 400,
                onComplete: () => {
                    this.picketVisual.destroy();
                }
            });
        }



        super.die();
     }


     initAttacks() {
         this.attacks = [
             [
                 // 0
                 {
                     name: "}6",
                     chargeAmt: 550,
                     finishDelay: 800,
                     transitionFast: true,
                     chargeMult: 7,
                     damage: -1,
                    startFunction: () => {
                    },
                    attackStartFunction: () => {
                        this.hidePosterFast();
                    },
                    attackFinishFunction: () => {
                        this.tempShiftSFX();
                        this.throwWeapon('dagger.png', 6, 1);
                    }
                 },
                 {
                     name: "}10",
                     chargeAmt: 550,
                     chargeMult: 7,
                     finishDelay: 800,
                     transitionFast: true,
                     damage: -1,
                     isBigMove: true,
                    startFunction: () => {
                        this.addTimeout(() => {
                            //this.takeDamage(10, false);
                        }, 10);
                    },
                    attackStartFunction: () => {

                    },
                    attackFinishFunction: () => {
                        this.tempShiftSFX();
                        this.throwWeapon('sword.png', 10, 1);
                    }
                 },
                 {
                     name: "Malfunctioning...",
                     chargeAmt: 300,
                     chargeMult: 4,
                     damage: -1,
                     isPassive: true,
                     startFunction: () => {
                        this.runSfxLoop.detune = 900;
                        setVolume(this.runSfxLoop, 1, 300)
                        this.sprite.setRotation(0.07);
                        this.malfunctionTween = this.addTween({
                            targets: this.sprite,
                            rotation: -0.06,
                            ease: "Cubic.easeOut",
                            duration: 250,
                            repeat: -1
                        });
                     },
                    attackStartFunction: () => {
                        this.addTimeout(() => {
                            this.takeDamage(20, false);
                        }, 10);
                        playSound('clunk2');
                        this.runSfxLoop.detune = 0;
                        setVolume(this.runSfxLoop, 0, 400)
                        this.malfunctionTween.stop();
                        this.sprite.setRotation(0.2);
                        this.addTween({
                            delay: 1000,
                            targets: this.sprite,
                            rotation: 0,
                            ease: "Quart.easeIn",
                            duration: 400,
                        });
                    },
                 },
                 {
                     name: "}2x6",
                     chargeAmt: 500,
                     chargeMult: 7,
                     finishDelay: 1000,
                     transitionFast: true,
                     damage: -1,
                    startFunction: () => {
                        this.addTimeout(() => {
                            //this.takeDamage(10, false);
                        }, 10);
                    },
                    attackStartFunction: () => {

                    },
                    attackFinishFunction: () => {
                        this.tempShiftSFX();
                        this.throwTriple('star.png', 2, 2);
                    }
                 },
                 {
                     name: "|10x2",
                     chargeAmt: 700,
                     finishDelay: 1600,
                     transitionFast: true,
                     chargeMult: 7,
                     damage: -1,
                     isBigMove: true,
                    startFunction: () => {
                        this.addTimeout(() => {
                            //this.takeDamage(10, false);
                        }, 10);
                    },
                    attackStartFunction: () => {

                    },
                    attackFinishFunction: () => {
                        this.tempShiftSFX();
                        this.throwWeapon('sword.png', 10, 2);
                    }
                 },
                 {
                     name: "Malfunctioning...",
                     chargeAmt: 400,
                     chargeMult: 7,
                     damage: -1,
                     isPassive: true,
                     startFunction: () => {
                        this.runSfxLoop.detune = 900;
                        setVolume(this.runSfxLoop, 1, 300)
                        this.sprite.setRotation(-0.09);
                        this.malfunctionTween = this.addTween({
                            targets: this.sprite,
                            rotation: 0.09,
                            ease: "Cubic.easeOut",
                            duration: 400,
                            repeat: -1
                        });
                     },
                    attackStartFunction: () => {
                        this.addTimeout(() => {
                            this.takeDamage(25, false);
                        }, 10);
                        playSound('clunk');
                        this.runSfxLoop.detune = 0;
                        setVolume(this.runSfxLoop, 0, 400)
                        this.malfunctionTween.stop();
                        this.sprite.setRotation(0.2);
                        this.addTween({
                            delay: 1000,
                            targets: this.sprite,
                            rotation: 0,
                            ease: "Quart.easeIn",
                            duration: 400,
                        });
                    },
                 },
                 {
                     name: ";20",
                     chargeAmt: 1000,
                     finishDelay: 800,
                     transitionFast: true,
                     chargeMult: 7,
                     damage: -1,
                     isBigMove: true,
                    startFunction: () => {
                        this.addTimeout(() => {
                            //this.takeDamage(10, false);
                        }, 10);
                    },
                    attackStartFunction: () => {

                    },
                    attackFinishFunction: () => {
                        let throwSprite = 'dummy_dead.png';
                        this.tempShiftSFX();
                        this.throwWeapon(throwSprite, 20, 1);
                    }
                 },
                 {
                     name: ";10x3",
                     chargeAmt: 1000,
                     finishDelay: 800,
                     transitionFast: true,
                     chargeMult: 7,
                     damage: -1,
                     isBigMove: true,
                     startFunction: () => {
                         this.addTimeout(() => {
                             //this.takeDamage(10, false);
                         }, 10);
                     },
                     attackStartFunction: () => {

                     },
                    attackFinishFunction: () => {
                        let throwSprite = 'sword.png';
                        this.tempShiftSFX();
                        this.throwWeapon(throwSprite, 10, 3);
                    }
                },
                 {
                     name: "}6",
                     chargeAmt: 550,
                     transitionFast: true,
                     chargeMult: 7,
                     damage: -1,
                    startFunction: () => {
                        this.addTimeout(() => {
                            //this.takeDamage(10, false);
                        }, 10);
                    },
                    attackStartFunction: () => {

                    },
                    attackFinishFunction: () => {
                        this.tempShiftSFX();
                        this.throwWeapon('bird.png', 6, 1);
                        setTimeout(() => {
                            playSound('chirp1')
                        }, 1000)
                    }
                 },
                 {
                     name: "Malfunctioning...",
                     chargeAmt: 700,
                     chargeMult: 8,
                     damage: -1,
                     isPassive: true,
                     startFunction: () => {
                        this.runSfxLoop.detune = 900;
                        setVolume(this.runSfxLoop, 1, 300)
                        this.sprite.setRotation(0.07);
                        this.malfunctionTween = this.addTween({
                            targets: this.sprite,
                            rotation: -0.06,
                            ease: "Cubic.easeOut",
                            duration: 250,
                            repeat: -1
                        });
                     },
                    attackStartFunction: () => {
                        this.addTimeout(() => {
                            this.takeDamage(30, false);
                        }, 10);
                        playSound('clunk2');
                        this.runSfxLoop.detune = 0;
                        setVolume(this.runSfxLoop, 0, 400)
                        this.malfunctionTween.stop();
                        this.sprite.setRotation(0.2);
                        this.addTween({
                            delay: 1000,
                            targets: this.sprite,
                            rotation: 0,
                            ease: "Quart.easeIn",
                            duration: 400,
                        });
                    },
                 },

             ]
         ];
     }
}
