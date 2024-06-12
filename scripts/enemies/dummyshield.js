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
     }

     initTutorial() {
        setTimeout(() => {
            this.createPicketSign();
        }, 1000);
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
                playSound('inflate', 0.6).detune = 500;
                this.picketVisual.destroy();
                this.addTween({
                    targets: this.sprite,
                    scaleX: this.sprite.startScale * 0.85,
                    scaleY: this.sprite.startScale * 0.85,
                    rotation: -0.25,
                    ease: "Quint.easeOut",
                    duration: 700,
                    onComplete: () => {
                        playSound('tractor_loop', 1);
                        this.addTween({
                            targets: this.sprite,
                            scaleX: this.sprite.startScale * 1.25,
                            scaleY: this.sprite.startScale * 1.25,
                            rotation: 0.08,
                            ease: "Quart.easeIn",
                            duration: 600,
                            onComplete: () => {
                                this.setDefaultSprite('dummy_paper_face.png');
                                this.addTween({
                                    targets: this.sprite,
                                    scaleX: this.sprite.startScale,
                                    scaleY: this.sprite.startScale,
                                    rotation: -0.02,
                                    easeParams: [2],
                                    ease: "Bounce.easeOut",
                                    duration: 500,
                                    onComplete: () => {
                                        this.runSfxLoop = playSound('tractor_loop', 0, true);
                                        this.runTween = this.addTween({
                                            targets: this.sprite,
                                            rotation: 0.02,
                                            ease: "Quart.easeInOut",
                                            duration: 500,
                                            repeat: -1,
                                            yoyo: true
                                        });
                                    }
                                });

                                 let shinePattern = getTempPoolObject('spells', 'brickPattern2.png', 'brickPattern', 700);
                                 shinePattern.setPosition(this.x, this.y - 120).setScale(0.65).setDepth(-1).setAlpha(0.5);
                                 this.addTween({
                                     targets: shinePattern,
                                     scaleX: 0.85,
                                     scaleY: 0.85,
                                     duration: 700,
                                     ease: 'Cubic.easeOut'
                                 });
                                 this.addTween({
                                     targets: shinePattern,
                                     alpha: 0,
                                     ease: 'Cubic.easeIn',
                                     duration: 700,
                                 });
                            }
                        });
                    }
                });
            }
        });
        this.setAwake();
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
                        setTimeout(() => {
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
                     name: "}10",
                     chargeAmt: 500,
                     chargeMult: 8,
                     finishDelay: 800,
                     transitionFast: true,
                     damage: -1,
                     isBigMove: true,
                    startFunction: () => {
                        setTimeout(() => {
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
                     chargeAmt: 350,
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
                        setTimeout(() => {
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
                     name: "}12",
                     chargeAmt: 500,
                     chargeMult: 8,
                     finishDelay: 800,
                     transitionFast: true,
                     damage: -1,
                    startFunction: () => {
                        setTimeout(() => {
                            this.takeDamage(10, false);
                        }, 10);
                    },
                    attackStartFunction: () => {

                    },
                    attackFinishFunction: () => {
                        this.tempShiftSFX();
                        this.throwWeapon('sword.png', 12, 1);
                    }
                 },
                 {
                     name: "}12x2",
                     chargeAmt: 700,
                     finishDelay: 1800,
                     transitionFast: true,
                     chargeMult: 8,
                     damage: -1,
                     isBigMove: true,
                    startFunction: () => {
                        setTimeout(() => {
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
                     chargeAmt: 350,
                     chargeMult: 7,
                     damage: -1,
                     isPassive: true,
                     isBigMove: true,
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
                        setTimeout(() => {
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
                     name: "}30",
                     chargeAmt: 1000,
                     finishDelay: 4000,
                     transitionFast: true,
                     chargeMult: 8,
                     damage: -1,
                     isBigMove: true,
                    startFunction: () => {
                        setTimeout(() => {
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
                        setTimeout(() => {
                            this.takeDamage(10, false);
                        }, 3000)
                    }
                 },
                 {
                     name: "}30",
                     chargeAmt: 1000,
                     finishDelay: 4000,
                     transitionFast: true,
                     chargeMult: 8,
                     damage: -1,
                     isBigMove: true,
                    startFunction: () => {
                        setTimeout(() => {
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
                        setTimeout(() => {
                            this.takeDamage(10, false);
                        }, 3000)
                    }
                },
             ]
         ];
     }
}
