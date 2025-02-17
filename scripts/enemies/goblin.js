 class Goblin extends Enemy {
     constructor(scene, x, y, level) {
         super(scene, x, y, level);
         this.initSprite('gobbo0.png', 0.92);
         this.bgMusic = playMusic('bite_down', 0.7, true);
         this.shieldAdded = false;

         // ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MIND, RUNE_MIND, null, null, null , RUNE_MATTER];

         // this.addSubscription("clearMindBurn", this.clearMindBurn.bind(this))
         this.addSubscription("enemyOnFire", this.setOnFire.bind(this))

         this.addTimeout(() => {
             messageBus.publish('castSpell', {runeName: "rune_matter"}, {runeName: "rune_lightprotect"}, 'shield9', 0);
         }, 1150)
     }

     initStatsCustom() {
         this.health = gameVars.isHardMode ? 80 : 70;
         this.slashEffect = this.addImage(globalObjects.player.getX(), globalObjects.player.getY() - 54, 'misc', 'slash1.png').setScale(0.9).setDepth(995).setAlpha(0);
        this.pullbackScale = 0.88;
        this.attackScale = 1.22;
         this.extraRepeatDelay = 40;
         this.pullbackHoldRatio = 0.6;

        this.isAnimating = false;
         this.attackEase = "Quart.easeIn";
         this.accumulatedAnimDamage = 0;
         this.shieldTextOffsetY = -1;
     }

     // update(dt) {}
     clearMindBurn() {
         if (this.burnAnim) {
             this.sprite.stop();
             this.isAnimating = false;
             this.burnAnim = null;
         }
         this.isBurning = false;
         if (this.dead) {
             return;
         } else {
             if (!this.isAnimating && !this.dead && this.shield > 0) {
                 // let oldSprite = this.sprite.frame.name;
                 // if (this.goblinBeingShocked) {
                 //     oldSprite = this.defaultSprite;
                 // } else if (this.isUsingAttack) {
                 //     oldSprite = this.defaultSprite;
                 // }
                 this.setSprite('gobbo_extinguish1.png');
                 this.sprite.play('gobboextinguish');
                 this.isAnimating = true;

                 this.sprite.once('animationcomplete', () => {
                     this.isAnimating = false;
                     this.setSpriteIfNotInactive(this.defaultSprite);
                 });
                 playSound('goblin_grunt', 0.4).detune = 500;
             }

             this.sprite.x = gameConsts.halfWidth + (Math.random() < 0.5 ? 15 : -15);
             this.addTween({
                 targets: this.sprite,
                 x: gameConsts.halfWidth,
                 ease: 'Bounce.easeOut',
                 duration: 800
             })
         }
     }

     setOnFire(duration) {
         if (this.shield >= 1) {
             this.sprite.stop();
             this.isAnimating = false;
             this.burnAnim = this.sprite.play('gobboshieldfire');
             this.isBurning = true;
         }
         // if (this.currDelay) {
         //     this.currDelay.stop();
         // }
         this.currDelay = this.addTween({
             targets: this.sprite,
             alpha: 1,
             duration: duration * 1000 - 1000,
             onComplete: () => {
                 this.clearMindBurn();
             }
         });
     }

     takeEffect(newEffect) {
         if (this.sprite) {
            if (newEffect.name === 'mindStrike' && this.shield <= 0 && !this.dead) {
                this.sprite.stop();
                this.isAnimating = false;
                 // let oldSprite = this.sprite.frame.name;
                 // if (oldSprite === 'gobbo_elec.png') {
                 //     oldSprite = this.defaultSprite;
                 // } else if (this.isUsingAttack) {
                 //     oldSprite = this.defaultSprite;
                 // }
                 this.setSprite('gobbo_elec1.png');
                 this.sprite.x = gameConsts.halfWidth + (Math.random() < 0.5 ? -13 : 13);
                this.goblinBeingShocked = true;
                 this.sprite.play('gobboshock')
                 this.addTween({
                     targets: this.sprite,
                     x: gameConsts.halfWidth,
                     ease: 'Bounce.easeOut',
                     easeParams: [1, 2.5],
                     duration: 260,
                 });
                 this.sprite.once('animationcomplete', () => {
                     this.setSpriteIfNotInactive(this.defaultSprite);
                     this.goblinBeingShocked = false;
                 })
            } else if (this.shield >= 1 && newEffect.name == 'mindBurn') {
                this.sprite.stop();
                this.isAnimating = false;
                this.burnAnim = this.sprite.play('gobboshieldfire');
                this.isBurning = true;
            }
         }
         super.takeEffect(newEffect)
     }

     setHealth(newHealth) {
         super.setHealth(newHealth);
         let prevHealthPercent = this.prevHealth / this.healthMax;
         let currHealthPercent = this.health / this.healthMax;
         let lastHealthLost = this.prevHealth - this.health;
         if (currHealthPercent == 0) {
             // dead, can't do anything
             return;
         }
         if (lastHealthLost >= 12 && this.shield === 0 && !this.goblinBeingShocked && !this.dead) {
             this.accumulatedAnimDamage += lastHealthLost;
             this.isKnocked = true;
             this.setSprite('gobbo_knock1.png');
             if (this.accumTween) {
                 this.accumTween.stop();
             }
             if (this.breatheTween) {
                 this.breatheTween.stop();
                 this.breatheTween = null;
             }
             if (lastHealthLost >= 30) {
                 messageBus.publish('newUnlock', 'gobbohit')
             }
             if (this.accumulatedAnimDamage <= 12){
                 // do nothin
             } else if (this.accumulatedAnimDamage <= 24) {
                 playSound('derp', 0.4);
                 this.addDelay(() => {
                     playSound('derp', 0.5).detune = 300;
                 }, 150)
                 this.sprite.play('gobboknock2')
             } else if (this.accumulatedAnimDamage <= 36) {
                 this.sprite.play('gobboknock3')
                 playSound('derp', 0.4);
                 this.addDelay(() => {
                     playSound('derp', 0.5).detune = 300;
                     this.addDelay(() => {
                         playSound('derp', 0.5).detune = 600;
                     }, 120)
                 }, 120)
             } else if (this.accumulatedAnimDamage > 36) {
                 this.sprite.play('gobboknock4')
                 playSound('derp', 0.4);
                 this.addDelay(() => {
                     playSound('derp', 0.5).detune = 300;
                     this.addDelay(() => {
                         playSound('derp', 0.5).detune = 600;
                         this.addDelay(() => {
                             playSound('derp', 0.6).detune = 900;
                         }, 100)
                     }, 100)
                 }, 100)
             }
             this.sprite.rotation = -0.17;
             this.accumTween = this.addTween({
                 targets: this.sprite,
                 rotation: 0.03,
                 easeParams: [1.8],
                 ease: 'Back.easeIn',
                 duration: 650 + Math.floor(this.accumulatedAnimDamage * 5.5),
                 completeDelay: 100,
                 onComplete: () => {
                     this.isKnocked = false;
                     this.accumulatedAnimDamage = 0;
                     this.setSprite(this.defaultSprite);
                     if (!this.dead) {
                         this.sprite.rotation = 0;
                     }
                 }
             });
         }
         if (prevHealthPercent >= 0.999) {
             if (currHealthPercent < 0.999) {
                 this.currentAttackSetIndex = 1;
                 this.nextAttackIndex = 0;
                 // Going to shield
             }
         }
         if (this.shieldAdded && this.currentAttackSetIndex === 2) {
             if (this.shield === 0) {
                 // shield must have broke
                 if (this.breatheTween) {
                     this.breatheTween.stop();
                     this.breatheTween = null;
                 }
                 this.setDefaultSprite('gobbo2.png', 0.92);
                 this.interruptCurrentAttack();
                 this.currentAttackSetIndex = 3;
                 this.nextAttackIndex = 0;
                 playSound('goblin_grunt', 0.95).detune = 0;
                 playSound('clunk');
             }
         }
     }

     initAttacks() {
         this.attacks = [
             [
                 // 0
                 {
                     name: gameVars.isHardMode ? "}5x2 " : "}3x2 ",
                     desc: "The goblin waves his\nlittle knife in front\nof your face",
                     chargeAmt: 250,
                     attackTimes: 2,
                     damage: gameVars.isHardMode ? 5 : 3,
                     prepareSprite: "gobbo0.png",
                     attackSprites: ['gobbo0_atk.png'],
                     attackFinishFunction: () => {
                         this.makeSlashEffect();
                         playSound('sword_hit', 0.75);
                         // this.addDelay(() => {
                         //     messageBus.publish("selfTakeDamage", 4);
                         //     this.makeSlashEffect();
                         //     playSound('sword_hit', 0.75).detune = -200;
                         // }, 180)
                     }
                 }
             ],
             [
                 // 1
                 {
                     name: "FANCY SHIELD {40",
                     block: 40,
                     isPassive: true,
                     customCall: " ",
                     chargeAmt: 360,
                    transitionFast: true,
                     startFunction: () => {
                        this.attackScale = 1;
                     },
                     attackStartFunction: () => {
                         playSound('clunk');
                         let shinePattern = getTempPoolObject('spells', 'brickPattern2.png', 'brickPattern', 700);
                         shinePattern.setPosition(this.x, this.y).setScale(0.8).setDepth(-1).setAlpha(0.5);
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

                         this.setDefaultSprite('gobboshield1.png', 0.92).play('gobboshield');
                     },
                     attackFinishFunction: () => {
                         this.currentAttackSetIndex = 2;
                         this.nextAttackIndex = 0;
                         this.repeatTweenBreathe()
                         this.shieldAdded = true;
                         messageBus.publish("showCombatText", getLangText('goblin_shield'), -41);
                     }
                 }
             ],
             [
                 // 2 - attacks from behind shield
                 {
                     name: gameVars.isHardMode ? "}12 " : "}8 ",
                     desc: "Goblin rams you with\nhis shield",
                     chargeAmt: 400,
                     damage: gameVars.isHardMode ? 12 : 8,
                     startFunction: () => {
                        this.pullbackScale = 0.85;
                        this.attackScale = 1.3;

                        if (!this.shownTut) {
                            this.addDelay(() => {
                                messageBus.publish("closeCombatText")
                            }, 6500)

                            if (globalObjects.magicCircle.hasRune(RUNE_MIND) && globalObjects.magicCircle.hasRune(RUNE_ENHANCE)) {
                                this.showEnergyTut();
                            } else {
                                this.resetCast = messageBus.subscribe('resetCircle', () => {
                                    this.showEnergyTut();
                                    this.resetCast.unsubscribe();
                                });
                                this.subscriptions.push(this.resetCast);
                            }
                        }
                     },
                     attackFinishFunction: () => {
                         playSound('body_slam')
                         let dmgEffect = getTempPoolObject('spells', 'damageEffect3.png', 'damageEffect3', 200);
                         dmgEffect.play('damageEffectShort');
                         dmgEffect.setPosition(gameConsts.halfWidth + (Math.random() - 0.5) * 20, globalObjects.player.getY() - 185).setDepth(998).setScale(1.35)
                         this.addTimeout(() => {
                             dmgEffect.x += 10;
                             dmgEffect.y += 10;
                         }, 100)

                     },
                     finaleFunction: () => {
                         if (this.isBurning && !this.dead && this.shield > 0) {
                             this.burnAnim.stop();
                             this.burnAnim = this.sprite.play('gobboshieldfire');
                         }
                     }
                 },
             ],
             [
                 // 3
                 {
                     name: "MY SHIELD!",
                     isPassive: true,
                     chargeAmt: 150,
                     customCall: " ",
                     transitionFast: true,
                     damage: 0,
                     startFunction: () => {
                         if (this.accumTween) {
                             this.accumTween.stop();
                         }
                        messageBus.publish("closeCombatText")
                         this.sprite.x = gameConsts.halfWidth + (Math.random() < 0.5 ? 15 : -15);
                         this.addTween({
                             targets: this.sprite,
                             x: gameConsts.halfWidth,
                             ease: 'Bounce.easeOut',
                             duration: 1000
                         })
                     }
                 },
                 {
                     name: "GETTING KNIVES!",
                     isPassive: true,
                     chargeAmt: 200,
                     chargeMult: 4,
                     isBigMove: true,
                     startFunction: () => {
                        this.pullbackScale = 0.91;
                        this.attackScale = 1.16;
                         this.extraRepeatDelay = 0;
                         this.pullbackHoldRatio = 0.5;
                         this.setDefaultSprite('gobbo3.png', 0.92);
                     },
                     attackFinishFunction: () => {
                         playSound('goblin_aha');
                         this.currentAttackSetIndex = 4;
                         this.nextAttackIndex = 0;
                         this.setDefaultSprite('gobbo4.png', 0.92);
                         let oldScale = this.sprite.scaleX;
                         this.sprite.setScale(this.sprite.scaleX * 1.01);
                         this.currAnim = this.addTween({
                             targets: this.sprite,
                             scaleX: oldScale,
                             scaleY: oldScale,
                             duration: 600,
                             completeDelay: 100,
                             onComplete: () => {
                                 this.setDefaultSprite('gobbo5.png', 0.92);
                                 this.repeatTweenBreathe(800, 0.5)
                             }
                         });
                     }
                 }
             ],
             [
                 {
                     name: "}4x3 ",
                     chargeAmt: gameVars.isHardMode ? 180 : 220,
                     damage: 4,
                     attackTimes: 3,
                     finishDelay: 300,
                     attackSprites: ['gobboAttack1.png', 'gobboAttack2.png'],
                     attackFinishFunction: () => {
                         this.makeSlashEffect();
                     }
                 },
                 {
                     name: "}4x4 ",
                     chargeAmt: gameVars.isHardMode ? 200 : 240,
                     damage: 4,
                     attackTimes: 4,
                     finishDelay: 400,
                     attackSprites: ['gobboAttack1.png', 'gobboAttack2.png'],
                     attackFinishFunction: () => {
                         this.makeSlashEffect();
                     }
                 },
                 {
                     name: "}4x5 ",
                     chargeAmt: gameVars.isHardMode ? 220 : 260,
                     damage: 4,
                     attackTimes: 5,
                     finishDelay: 500,
                     isBigMove: true,
                     attackSprites: ['gobboAttack1.png', 'gobboAttack2.png'],
                     attackFinishFunction: () => {
                         this.makeSlashEffect();
                     }
                 },
                 {
                     name: "LAUGH",
                     isPassive: true,
                     chargeAmt: 400,
                     finishDelay: 900,
                     chargeMult: 5,
                     damage: -1,
                     tease: true,
                     attackSprites: ['gobbo4.png'],
                     attackFinishFunction: () => {
                         playSound('goblin_aha');
                     }
                 },
                 {
                     name: "}4x3 ",
                     chargeAmt: 250,
                     damage: 4,
                     attackTimes: 3,
                     finishDelay: 1000,
                     attackSprites: ['gobboAttack1.png', 'gobboAttack2.png'],
                     attackFinishFunction: () => {
                         this.makeSlashEffect();
                     }
                 },
                 {
                     name: "}4x4 ",
                     chargeAmt: 275,
                     damage: 4,
                     attackTimes: 4,
                     finishDelay: 1200,
                     attackSprites: ['gobboAttack1.png', 'gobboAttack2.png'],
                     attackFinishFunction: () => {
                         this.makeSlashEffect();
                     }
                 },
                 {
                     name: "}4x5 ",
                     chargeAmt: 300,
                     damage: 4,
                     attackTimes: 5,
                     finishDelay: 1500,
                     attackSprites: ['gobboAttack1.png', 'gobboAttack2.png'],
                     attackFinishFunction: () => {
                         this.makeSlashEffect();
                     }
                 },
                 {
                     name: "LAUGH",
                     isPassive: true,
                     chargeAmt: 400,
                     finishDelay: 1200,
                     chargeMult: 5,
                     damage: -1,
                     tease: true,
                     attackSprites: ['gobbo4.png'],
                     attackFinishFunction: () => {
                         playSound('goblin_aha');
                     }
                 }
             ],
         ];
     }

     showEnergyTut() {
         this.addDelay(() => {
             this.shownTut = true;
             // globalObjects.textPopupManager.setInfoText(gameConsts.width, gameConsts.halfHeight - 150, getLangText("energy_tut_goblin"), 'right');
             // let runeYPos = globalObjects.textPopupManager.getBoxBottomPos();
             // let centerXPos = globalObjects.textPopupManager.getCenterPos();
             // let runeDepth = globalObjects.bannerTextManager.getDepth() + 1;
             // this.rune3 = this.addImage(centerXPos - 32, runeYPos + 17, 'circle', 'bright_rune_mind.png').setDepth(runeDepth).setScale(0.78, 0.78).setAlpha(0);
             // this.rune4 = this.addImage(centerXPos + 38, runeYPos + 17, 'circle', 'bright_rune_enhance.png').setDepth(runeDepth).setScale(0.78, 0.78).setAlpha(0);
             messageBus.publish("closeCombatText")
             // this.addTween({
             //     targets: [this.rune3, this.rune4],
             //     scaleX: 1,
             //     scaleY: 1,
             //     ease: 'Quart.easeOut',
             //     duration: 500,
             //     onComplete: () => {
             //         this.addTween({
             //             targets: [this.rune3, this.rune4],
             //             scaleX: 0.8,
             //             scaleY: 0.8,
             //             ease: 'Back.easeOut',
             //             duration: 300,
             //         });
             //     }
             // });
             // this.addTween({
             //     targets: [this.rune3, this.rune4],
             //     alpha: 1,
             //     duration: 200,
             //     completeDelay: 1000,
             //     onComplete: () => {
             //         this.playerSpellCastSub = this.addSubscription('playerCastedSpell', () => {
             //             this.playerSpellCastSub.unsubscribe();
             //             this.addTimeout(() => {
             //                 this.addTween({
             //                     targets: [this.rune3, this.rune4],
             //                     alpha: 0,
             //                     duration: 300,
             //                     onComplete: () => {
             //                         this.rune3.visible = false;
             //                         this.rune4.visible = false;
             //                     }
             //                 });
             //                 globalObjects.textPopupManager.hideInfoText();
             //             }, 300);
             //         });
             //     }
             // });
         }, 1000)
     }

     makeSlashEffect() {
         screenShake(4);
         playSound('sword_slice', 0.7).detune = Math.floor(Math.random() * 200 - 100);
         if (this.slashEffectAnim) {
             this.slashEffectAnim.stop();
         }
         let isFlipped = this.slashEffect.scaleX > 0;
         this.slashEffect.setAlpha(1.2).setScale(isFlipped ? -0.5 : 0.5, 0.4);
         this.slashEffectAnim = this.addTween({
             targets: this.slashEffect,
             delay: 25,
             duration: 330,
             ease: 'Quart.easeIn',
             alpha: 0,
         });
         this.addTween({
             targets: this.slashEffect,
             scaleX: isFlipped ? -1.05 : 1.05,
             scaleY: 0.65,
             duration: 340,
             ease: 'Quart.easeOut',
             alpha: 0,
         });
     }

     initSpriteAnim(scale) {
         super.initSpriteAnim(scale);
         this.sprite.startX = this.sprite.x;
         this.sprite.x = gameConsts.halfWidth + 150;
         this.sprite.setRotation(0.05);
         this.addTween({
             targets: this.sprite,
             rotation: -0.05,
             duration: 150,
             yoyo: true,
             completeDelay: 20,
             onComplete: () => {
                 this.addTween({
                     targets: this.sprite,
                     rotation: -0.05,
                     duration: 180,
                     yoyo: true,
                     completeDelay: 20,
                     onComplete: () => {
                         this.addTween({
                             targets: this.sprite,
                             rotation: -0.05,
                             duration: 210,
                             completeDelay: 20,
                             onComplete: () => {
                                 this.addTween({
                                     targets: this.sprite,
                                     rotation: 0,
                                     ease: 'Quad.easeOut',
                                     duration: 250,
                                     onComplete: () => {
                                         this.repeatTweenBreathe();
                                     }
                                 });
                             }
                         });
                     }
                 });
             }
         });
         this.addTween({
             targets: this.sprite,
             x: this.sprite.startX,
             duration: 1350,
             ease: 'Cubic.easeOut',
         });
     }

     repeatTweenBreathe(duration = 1500, magnitude = 1, isRepeat = false) {
        if (this.dead || this.isDestroyed) {
            return;
        }
         if (this.breatheTween) {
             this.breatheTween.stop();
             this.breatheTween = null;
         }
         let horizMove = Math.ceil(3.5 * magnitude);
         let burningMult = this.isBurning ? 0.18 : 1;
         this.breatheTween = this.addTween({
             targets: this.sprite,
             duration: duration * (Math.random() * 0.5 + 1) * burningMult,
             rotation: this.isKnocked ? 0 : -0.02 * magnitude,
             x: this.sprite.startX - horizMove,
             ease: 'Cubic.easeInOut',
             completeDelay: 150,
             onComplete: () => {
                 let burningMult2 = this.isBurning ? 0.2 : 1;
                 this.breatheTween = this.addTween({
                     targets: this.sprite,
                     duration: duration * (Math.random() * 0.5 + 1) * burningMult2,
                     rotation: this.isKnocked ? 0 : 0.02 * magnitude,
                     x: this.sprite.startX + horizMove,
                     ease: 'Cubic.easeInOut',
                     completeDelay: 150,
                     onComplete: () => {
                         this.repeatTweenBreathe(duration, magnitude, true);
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
        messageBus.publish("closeCombatText")
        if (this.burnAnim) {
            this.burnAnim.stop();
        }
        this.sprite.stop();
         this.isAnimating = false;
        if (this.currAnim) {
            this.currAnim.stop();
        }
        this.sprite.rotation = 0;
        if (this.accumTween) {
            this.accumTween.stop();
        }
        globalObjects.textPopupManager.hideInfoText();

        // if (this.rune3) {
        //     this.rune3.visible = false;
        //     this.rune4.visible = false;
        // }

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

         this.addTween({
             targets: this.sprite,
             rotation: -0.2,
             ease: "Cubic.easeIn",
             duration: 25,
             onComplete: () => {
                 playSound('goblin_grunt', 0.8).detune = -150;
                 this.setDefaultSprite('gobboDead.png');
                 this.sprite.setRotation(0);
                 this.x -= 5;
                 this.y += 48;
                 this.addTimeout(() => {
                     this.showFlash(this.x, this.y);
                    this.addTimeout(() => {
                        let rune = this.addImage(this.x, this.y, 'tutorial', 'rune_protect_large.png').setScale(0.5).setDepth(9999);
                        playSound('victory_2');
                        this.addTween({
                            targets: rune,
                            x: gameConsts.halfWidth,
                            y: gameConsts.halfHeight - 170,
                            scaleX: 1,
                            scaleY: 1,
                            ease: "Cubic.easeOut",
                            duration: 2200,
                            onComplete: () => {
                                this.showVictory(rune);
                            }
                        });
                    }, 250)
                 }, 2300);
             }
         });
    }
}
