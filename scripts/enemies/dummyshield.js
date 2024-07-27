 class Dummyshield extends Dummypractice {
    constructor(scene, x, y, level) {
        super(scene, x, y, level);
    }

     initStatsCustom() {
        this.health = 120;
        this.isAsleep = true;
        this.attackScale = 1;
        this.pullbackScale = 1;
        this.damageCanEmit = true;
        this.spellsCastCount = 0;
     }

     initTutorial() {
         this.addTimeout(() => {
            this.createPicketSign();
        }, 1000);

         this.playerSpellCastSub = messageBus.subscribe('playerCastedSpell', () => {
             this.spellsCastCount++;
             if (this.spellsCastCount >= 3 && this.spellsCastCount % 2 == 1) {
                 this.picketButton.setScale(1.02, 1.05);
                 this.picketVisual.setScale(1.02, 1.05);
                 this.picketButton.tweenToScale(1.05, 1.15, 200, 'Cubic.easeOut', undefined, () => {
                     this.picketButton.tweenToScale(1, 1, 700, 'Back.easeOut');
                 });
                 this.addTween({
                     targets: this.picketVisual,
                     scaleX: 1.05,
                     scaleY: 1.15,
                     ease: "Cubic.easeOut",
                     duration: 200,
                     onComplete: () => {
                         this.addTween({
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
        this.picketVisual = this.addSprite(this.x - 170, this.y + 15, 'dummyenemy', 'picketsign.png').setScale(1, 0).setOrigin(0.5, 1).setDepth(11);
        playSound('balloon', 0.6)
        this.addTween({
            targets: this.picketVisual,
            scaleY: 1,
            ease: "Back.easeOut",
            duration: 500,
            onComplete: () => {
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
        this.picketButton.destroy();
        playSound('balloon', 0.5).detune = -500;
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
        playSound('clunk2');
         if (this.runTween) {
            this.runTween.stop();
         }
         if (this.runSfxLoop) {
            fadeAwaySound(this.runSfxLoop, 300)
         }
        if (this.picketButton) {
            this.picketButton.destroy();
        }
        super.die();
     }


     initAttacks() {
         this.attacks = [
             [
                 // 0
                 {
                     name: "}6",
                     chargeAmt: 500,
                     finishDelay: 800,
                     transitionFast: true,
                     chargeMult: 8,
                     damage: -1,
                    startFunction: () => {
                    },
                    attackStartFunction: () => {

                    },
                    attackFinishFunction: () => {
                        this.tempShiftSFX();
                        this.throwWeapon('dagger.png', 6, 1);
                    }
                 },
                 {
                     name: "}10",
                     chargeAmt: 500,
                     chargeMult: 8,
                     finishDelay: 800,
                     transitionFast: true,
                     damage: -1,
                     isBigMove: true,
                    startFunction: () => {
                        this.addTimeout(() => {
                            this.takeDamage(10, false);
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
                     chargeMult: 8,
                     finishDelay: 1000,
                     transitionFast: true,
                     damage: -1,
                    startFunction: () => {
                        this.addTimeout(() => {
                            this.takeDamage(10, false);
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
                     name: "|12x2",
                     chargeAmt: 700,
                     finishDelay: 1600,
                     transitionFast: true,
                     chargeMult: 8,
                     damage: -1,
                     isBigMove: true,
                    startFunction: () => {
                        this.addTimeout(() => {
                            this.takeDamage(10, false);
                        }, 10);
                    },
                    attackStartFunction: () => {

                    },
                    attackFinishFunction: () => {
                        this.tempShiftSFX();
                        this.throwWeapon('sword.png', 12, 2);
                    }
                 },
                 {
                     name: "Malfunctioning...",
                     chargeAmt: 300,
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
                            this.takeDamage(20, false);
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
                     name: ";30",
                     chargeAmt: 1000,
                     finishDelay: 800,
                     transitionFast: true,
                     chargeMult: 8,
                     damage: -1,
                     isBigMove: true,
                    startFunction: () => {
                        this.addTimeout(() => {
                            this.takeDamage(10, false);
                        }, 10);
                    },
                    attackStartFunction: () => {

                    },
                    attackFinishFunction: () => {
                        let throwSprite = 'super_dummy_tpose.png';
                        if (gameVars.latestLevel > 4 || Math.random() < 0.96) {
                            throwSprite = 'scythe.png';
                        }
                        this.tempShiftSFX();
                        this.throwWeapon(throwSprite, 30, 1);
                    }
                 },
                 {
                     name: ";30",
                     chargeAmt: 1000,
                     finishDelay: 800,
                     transitionFast: true,
                     chargeMult: 8,
                     damage: -1,
                     isBigMove: true,
                    startFunction: () => {
                        this.addTimeout(() => {
                            this.takeDamage(10, false);
                        }, 10);
                    },
                    attackStartFunction: () => {

                    },
                    attackFinishFunction: () => {
                        let throwSprite = 'super_dummy_tpose.png';
                        if (gameVars.latestLevel > 4 || Math.random() < 0.96) {
                            throwSprite = 'scythe.png';
                        }
                        this.tempShiftSFX();
                        this.throwWeapon(throwSprite, 30, 1);
                    }
                },
                 {
                     name: "}6",
                     chargeAmt: 500,
                     transitionFast: true,
                     chargeMult: 8,
                     damage: -1,
                    startFunction: () => {
                        this.addTimeout(() => {
                            this.takeDamage(10, false);
                        }, 10);
                    },
                    attackStartFunction: () => {

                    },
                    attackFinishFunction: () => {
                        this.tempShiftSFX();
                        this.throwWeapon('dagger.png', 6, 1);
                    }
                 },
                 {
                     name: "Malfunctioning...",
                     chargeAmt: 300,
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

             ]
         ];
     }
}
