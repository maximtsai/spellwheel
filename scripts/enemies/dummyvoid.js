class Dummyvoid extends Dummypractice {
    constructor(scene, x, y, level) {
        super(scene, x, y, level);
    }

    initStatsCustom() {
        this.health = 400;
        this.isAsleep = true;
        this.attackScale = 1;
        this.pullbackScale = 1;
        this.damageCanEmit = true;
        this.spellsCastCount = 0;
    }
    startFight() {
        super.startFight();
        this.bgMusic = playMusic('bite_down_simplified', 0.7, true);
    }

    initTutorial() {
        this.playerSpellCastSub = messageBus.subscribe('playerCastedSpell', () => {
            this.spellsCastCount++;
            if (this.spellsCastCount >= 2) {
                this.playerSpellCastSub.unsubscribe();
                this.addTween({
                    targets: [this.text, this.backingBox],
                    alpha: 0,
                    duration: 600,
                });
            }
        })
        this.addDelay(() => {
            this.showGoal();
        }, 1000)
    }

    showGoal() {
        this.backingBox = this.addImage(0, 0, 'blackPixel').setAlpha(0);
        this.text = PhaserScene.add.text(8, 8, getLangText('level5_train_tut_a'), {fontFamily: 'garamondmax', fontSize: 24, color: '#FFFFFF', align: 'left'}).setAlpha(0).setOrigin(0, 0).setDepth(100);
        this.backingBox.setScale(this.text.width * 0.5 + 8, this.text.height * 0.5 + 8).setOrigin(0, 0);
        this.addToDestructibles(this.text);
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

    setHealth(newHealth) {
        super.setHealth(newHealth);
        let prevHealthPercent = this.prevHealth / this.healthMax;
        let currHealthPercent = this.health / this.healthMax;
        if (currHealthPercent < 0.999 && !this.fightStarted) {
            this.startFight();
            this.addDelay(() => {
                this.addTween({
                    targets: [this.text, this.backingBox],
                    alpha: 0,
                    duration: 600,
                });
            }, 3000)
        }
        if (currHealthPercent == 0) {
            // dead, can't do anything
            return;
        }
    }

    cleanUp() {
        if (this.runSfxLoop) {
            fadeAwaySound(this.runSfxLoop, 300)
        }
    }

    die() {
        if (this.dead) {
            return;
        }
        if (this.playerSpellBodyTrack) {
            this.playerSpellBodyTrack.unsubscribe();
        }
        if (this.playerSpellShieldTrack) {
            this.playerSpellShieldTrack.unsubscribe();
        }
        if (this.playerSpellCastSub) {
            this.playerSpellCastSub.unsubscribe();
        }
        if (this.rune1) {
            this.rune1.destroy();
            this.rune2.destroy();
        }
        if (this.rune3) {
            this.rune3.destroy();
            this.rune4.destroy();
        }
        playSound('clunk2');
        if (this.runTween) {
            this.runTween.stop();
        }
        if (this.runSfxLoop) {
            fadeAwaySound(this.runSfxLoop, 300)
        }
        super.die();
    }


    initAttacks() {
        this.attacks = [
            [
                // 0
                {
                    name: "|10x6",
                    chargeAmt: 500,
                    finishDelay: 1200,
                    chargeMult: 10,
                    isBigMove: true,
                    transitionFast: true,
                    damage: -1,
                    startFunction: () => {

                    },
                    attackStartFunction: () => {

                    },
                    attackFinishFunction: () => {
                        this.throwTriple('sword.png', 10, 2);
                    }
                },
                {
                    name: "WAITING...",
                    chargeAmt: 400,
                    transitionFast: true,
                    isPassive: true,
                    damage: -1,
                    startFunction: () => {
                        globalObjects.textPopupManager.setInfoText(gameConsts.width, gameConsts.halfHeight - 160, getLangText('level5_train_tut_b'), 'right');
                        let runeYPos = globalObjects.textPopupManager.getBoxBottomPos();
                        let centerXPos = globalObjects.textPopupManager.getCenterPos();

                        this.rune1 = this.addSprite(centerXPos - 28, runeYPos + 28, 'circle', 'rune_reinforce_glow.png').setDepth(10001).setScale(0.75).setAlpha(0);
                        this.rune2 = this.addSprite(centerXPos + 30, runeYPos + 27, 'circle', 'rune_void_glow.png').setDepth(10001).setScale(0.75).setAlpha(0);
                        this.addTween({
                            targets: [this.rune1, this.rune2],
                            alpha: 1,
                            duration: 200,
                        });
                        this.addTween({
                            targets: [this.rune1, this.rune2],
                            scaleX: 1,
                            scaleY: 1,
                            ease: 'Quart.easeOut',
                            duration: 450,
                            onComplete: () => {
                                this.addTween({
                                    targets: [this.rune1, this.rune2],
                                    scaleX: 0.85,
                                    scaleY: 0.85,
                                    ease: 'Back.easeOut',
                                    duration: 300,
                                });
                            }
                        });
                        this.playerSpellBodyTrack = messageBus.subscribe('recordSpell', (spellId) => {
                            if (spellId == 'voidReinforce') {
                                this.playerSpellBodyTrack.unsubscribe();
                                this.playerSpellBodyTrack = null;
                                this.addDelay(() => {
                                    globalObjects.textPopupManager.hideInfoText();
                                    this.addTween({
                                        targets: [this.rune1, this.rune2],
                                        alpha: 0,
                                        duration: 200,
                                        onComplete: () => {
                                            this.rune1.visible = false;
                                            this.rune2.visible = false;
                                        }
                                    });
                                }, 650)
                            }
                        })

                    },
                    attackStartFunction: () => {
                        this.currentAttackSetIndex = 1;
                        this.nextAttackIndex = 0;
                    },
                    attackFinishFunction: () => {
                        globalObjects.textPopupManager.setInfoText(gameConsts.width, gameConsts.halfHeight - 180, getLangText('level5_train_tut_c'), 'right');
                        let runeYPos = globalObjects.textPopupManager.getBoxBottomPos();
                        let centerXPos = globalObjects.textPopupManager.getCenterPos();
                        if (this.rune1) {
                            this.addTween({
                                targets: [this.rune1, this.rune2],
                                alpha: 0,
                                duration: 200,
                            });
                        }


                        this.rune3 = this.addSprite(centerXPos - 35, runeYPos + 27, 'circle', 'rune_protect_glow.png').setDepth(10001).setScale(0.75).setAlpha(0);
                        this.rune4 = this.addSprite(centerXPos + 28, runeYPos + 28, 'circle', 'rune_void_glow.png').setDepth(10001).setScale(0.75).setAlpha(0);
                        this.addTween({
                            targets: [this.rune3, this.rune4],
                            alpha: 1,
                            duration: 200,
                        });
                        this.addTween({
                            targets: [this.rune3, this.rune4],
                            scaleX: 1.1,
                            scaleY: 1.1,
                            ease: 'Quart.easeOut',
                            duration: 600,
                            onComplete: () => {
                                this.addTween({
                                    targets: [this.rune3, this.rune4],
                                    scaleX: 0.85,
                                    scaleY: 0.85,
                                    ease: 'Back.easeOut',
                                    duration: 400,
                                });
                            }
                        });
                        if (this.playerSpellBodyTrack) {
                            this.playerSpellBodyTrack.unsubscribe();
                        }
                        this.playerSpellShieldTrack = messageBus.subscribe('recordSpell', (spellId) => {
                            if (spellId == 'voidProtect') {
                                this.playerSpellShieldTrack.unsubscribe();
                                this.playerSpellShieldTrack = null;
                                globalObjects.textPopupManager.hideInfoText();
                                this.addTween({
                                    targets: [this.rune3, this.rune4],
                                    alpha: 0,
                                    duration: 200,
                                    onComplete: () => {
                                        this.rune3.visible = false;
                                        this.rune4.visible = false;
                                    }
                                });
                            }
                        })
                    }
                },
            ],
            [
                {
                    name: ";20",
                    chargeAmt: 550,
                    finishDelay: 300,
                    transitionFast: true,
                    damage: -1,
                    startFunction: () => {

                    },
                    attackStartFunction: () => {

                    },
                    attackFinishFunction: () => {
                        this.throwWeapon('scythe.png', 20, 1);
                    }
                },
                {
                    name: "PAUSING...",
                    chargeAmt: 450,
                    chargeMult: 2,
                    transitionFast: true,
                },
                {
                    name: "|2x9",
                    chargeAmt: 600,
                    finishDelay: 2000,
                    transitionFast: true,
                    damage: -1,
                    startFunction: () => {

                    },
                    attackStartFunction: () => {

                    },
                    attackFinishFunction: () => {
                        this.throwTriple('star.png', 2, 3);
                    }
                },
                {
                    name: "PAUSING...",
                    chargeAmt: 450,
                    chargeMult: 2,
                    transitionFast: true,
                },
                {
                    name: ";25",
                    chargeAmt: 550,
                    finishDelay: 300,
                    transitionFast: true,
                    damage: -1,
                    startFunction: () => {

                    },
                    attackStartFunction: () => {

                    },
                    attackFinishFunction: () => {
                        this.throwWeapon('scythe.png', 25, 1);
                    }
                },
                {
                    name: "PAUSING...",
                    chargeAmt: 450,
                    chargeMult: 2,
                    transitionFast: true,
                },
                {
                    name: "|2x9",
                    chargeAmt: 600,
                    finishDelay: 2000,
                    transitionFast: true,
                    damage: -1,
                    startFunction: () => {

                    },
                    attackStartFunction: () => {

                    },
                    attackFinishFunction: () => {
                        this.throwTriple('star.png', 2, 3);
                    }
                },
                {
                    name: "PAUSING...",
                    chargeAmt: 450,
                    chargeMult: 2,
                    transitionFast: true,
                },
                {
                    name: ";30",
                    chargeAmt: 550,
                    finishDelay: 300,
                    transitionFast: true,
                    damage: -1,
                    startFunction: () => {

                    },
                    attackStartFunction: () => {

                    },
                    attackFinishFunction: () => {
                        this.throwWeapon('scythe.png', 30, 1);
                    }
                },
                {
                    name: "PAUSING...",
                    chargeAmt: 450,
                    chargeMult: 2,
                    transitionFast: true,
                },
                {
                    name: "|2x12",
                    chargeAmt: 600,
                    finishDelay: 2400,
                    transitionFast: true,
                    damage: -1,
                    startFunction: () => {

                    },
                    attackStartFunction: () => {

                    },
                    attackFinishFunction: () => {
                        this.throwTriple('star.png', 2, 4);
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
