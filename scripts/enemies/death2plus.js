 class Death2Plus extends Enemy {
     constructor(scene, x, y) {
         super(scene, x, y);
         this.initSprite('death2final.png', 0.92, 0, 0, 'deathfinal');
         this.bgMusic = playMusic('but_never_forgotten_metal', 0.9, true);
         console.log("play Music");
         this.bgMain = this.addSprite(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'star.png').setDepth(-5)
         this.bgBlur = this.addImage(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'star_blur.png').setDepth(-5).setScale(2.5).setAlpha(1.5);
         globalObjects.player.reInitStats();
         globalObjects.player.refreshHealthBar();
         messageBus.publish('showCircleShadow', 0.7, -50);

         this.bgBlur.currAnim = this.addTween({
             targets: this.bgBlur,
             alpha: 0,
             duration: 1000,
             onComplete: () => {
                 this.bgBlur.currAnim = this.addTween({
                     targets: this.bgBlur,
                     alpha: 0.24,
                     scaleX: 2.505,
                     scaleY: 2.505,
                     ease: 'Quad.easeInOut',
                     repeat: -1,
                     yoyo: true,
                     duration: 2000,
                 })
             }
         })
         this.whiteoutTemp = this.addImage(x, y + 15, 'spells', 'whiteout_circle.png').setScale(2.55)
         this.addTween({
             targets: this.whiteoutTemp,
             scaleX: 21,
             scaleY: 21,
             duration: 575,
             ease: "Cubic.easeInOut",
             onComplete: () => {
                 this.whiteoutTemp.destroy();
             }
         })
         this.addTween({
             targets: this.whiteoutTemp,
             alpha: 0,
             duration: 575,
             ease: "Quad.easeIn"
         })
         this.addTimeout(() => {
             this.initMisc();
             this.setAsleep();
             this.repeatTweenBreathe()
             this.beginBattleAnim();
         }, 10)
     }

     initStatsCustom() {
         this.health = 777;
         this.customAngry = "angrybone";
         this.handObjects = [];
         this.glowHands = [];
         this.shieldScale = 1.5;
         this.shieldOffsetY = 40;
         this.shieldTextOffsetY = -65;
         this.shieldTextFont = "void";
         this.pullbackScale = 0.97;
         this.attackScale = 1.01;
         this.shieldAmts = 0;
         this.storedHeal = 0;
         this.extraAttackDamage = 0;
     }

     initMisc() {
         this.handShieldBack = this.addImage(this.x, this.y, 'blurry', 'handshield_back.png').setScale(2.4).setDepth(-1).setAlpha(0);
         this.handShieldBack.startScale = this.handShieldBack.scaleX;
         this.handShield = this.addSprite(this.x, this.y - 6, 'shields', 'handshield10.png').setScale(1).setDepth(3).setAlpha(0);
         this.handShield.startScale = this.handShield.scaleX;
         this.currentHandGlow = this.addImage(0, 0, 'deathfinal', 'claw_glow.png').setAlpha(0).setDepth(-1);
         this.currentHandGlowPulse = this.addImage(0, 0, 'deathfinal', 'claw.png').setAlpha(0).setDepth(-1);
         this.redClockTemp = this.addImage(gameConsts.halfWidth, globalObjects.player.getY(), 'enemies', 'red_clock_back_large_red.png').setAlpha(0);
    }

     beginBattleAnim() {
         this.spellStartY = this.y - 60;
         this.createGlowHands();
         this.addDelay(() => {
             this.spellCirclePulse = this.addImage(this.x, this.spellStartY, 'blurry', 'spellcircle_pulse.png').setAlpha(0.1).setScale(0.5).setDepth(-3);
             this.spellCircleGlow = this.addImage(this.x, this.spellStartY, 'blurry', 'spellcircle_bgglow.png').setAlpha(0.1).setScale(1).setDepth(-3);
             this.spellCircle = this.addImage(this.x, this.spellStartY, 'deathfinal', 'spellcircle.png').setAlpha(0.1).setScale(0.5);
             this.rotateSpellCircleTo(0, false, () => {
                 // this.fadeOutCurrentHand();
                 this.createHandShield(10);
                 globalObjects.magicCircle.enableMovement();
                 globalObjects.encyclopedia.showButton();
                 globalObjects.options.showButton();
                 this.addDelay(() => {
                     messageBus.publish("showCombatText", getLangText('deathFight2plusa'), -40);
                     this.addTimeout(() => {
                         this.spellsCastCounter = 0;
                         this.playerSpellCastSub = messageBus.subscribe('playerCastedSpell', () => {
                             this.spellsCastCounter++;
                             if (this.spellsCastCounter >= 2) {
                                 this.playerSpellCastSub.unsubscribe();
                                 messageBus.publish("closeCombatText")
                             }
                         });
                         this.addTimeout(() => {
                             this.playerSpellCastSub.unsubscribe();
                             messageBus.publish("closeCombatText")
                         }, 7000);
                     }, 100)
                 }, 1500)
             });

             this.addDelay(() => {
                 this.setAwake();
             }, 4000)
         }, 900)
     }

     repeatTweenBreathe(duration = 1500, magnitude = 1) {
         if (this.breatheTween) {
             this.breatheTween.stop();
         }
         this.breathTween = this.addTween({
             targets: this.sprite,
             y: "+=10",
             duration: 2000,
             ease: 'Quad.easeInOut',
             repeat: -1,
             yoyo: true
         })
     }

    fadeOutCurrentHand() {
         if (this.currentHandGlow.currAnim) {
             this.currentHandGlow.currAnim.stop();
         }
        this.currentHandGlow.alpha = 1.1;
        this.addTween({
            targets: this.currentHandGlow,
            alpha: 0,
            duration: 500
        })
        this.currentHandGlow.currAnim = this.addTween({
            targets: this.currentHandGlow,
            scaleX: 0.5,
            scaleY: 0.5,
            ease: 'Cubic.easeIn',
            duration: 500
        })
    }

    fadeMainBG(showup) {
         this.addTween({
             targets: this.bgMain,
             alpha: showup ? 1 : 0.5,
             duration: 1000
         })
    }

     initAttacks() {
         this.attacks = [
             [
                 // 0
                 {
                     name: "OBSERVING...",
                     chargeAmt: 300,
                     finishDelay: 3000,
                     damage: 0,
                     isPassive: true,
                     startFunction: () => {
                     },
                     attackStartFunction: () => {
                         // this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                     },
                     finaleFunction: () => {

                     }
                 },
                 {
                     name: "}14x2",
                     chargeAmt: 450,
                     finishDelay: 2000,
                     damage: -1,
                     isBigMove: true,
                     startFunction: () => {
                         this.pulseHand(1);
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                         let pokeHand = this.addImage(this.x - 180, this.y - 50, 'deathfinal', 'poke.png').setScale(0.1).setAlpha(0.65);
                         let pokeHandGlow = this.addImage(this.x - 180, this.y - 50, 'deathfinal', 'poke_glow.png').setScale(0.2).setAlpha(0);
                         this.summonHand(pokeHand, pokeHandGlow, 0.26, 0.6, () => {
                             this.fireTwoPokes(14, pokeHand);
                         })
                     },
                 },
                 {
                     name: "$20",
                     chargeAmt: 550,
                     finishDelay: 2000,
                     damage: -1,
                     startFunction: () => {
                         this.pulseHand(2);
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                         let okayHand = this.addImage(this.x + 200, this.y + 20, 'deathfinal', 'okay.png').setScale(0.1).setAlpha(0.65);
                         let okayHandGlow = this.addImage(this.x + 200, this.y + 20, 'deathfinal', 'okay_glow.png').setScale(0.2).setAlpha(0);
                         okayHand.setDepth(50);
                         okayHandGlow.setDepth(50);
                         let damage = 20;

                         this.summonHand(okayHand, okayHandGlow, 0.28, 1, () => {
                             this.fireTimeAttack(damage, okayHand, () => {
                                 this.redClockTemp = this.addImage(gameConsts.halfWidth, globalObjects.player.getY(), 'enemies', 'red_clock_back_large_red.png');
                                 this.redClockTemp.setAlpha(0).setScale(1.5).setDepth(50).setRotation(-1);
                                 this.addTween({
                                     targets: this.redClockTemp,
                                     rotation: 0,
                                     alpha: 1,
                                     scaleX: 1.27,
                                     scaleY: 1.27,
                                     ease: 'Cubic.easeIn',
                                     duration: 200,
                                     onComplete: () => {
                                         this.addTween({
                                             targets: this.redClockTemp,
                                             alpha: 0,
                                             duration: 800,
                                         })
                                     }
                                 })
                                 messageBus.publish('playerAddDelayedDamage', damage);
                             });
                         })
                     },
                     finaleFunction: () => {

                     }
                 },
                 {
                     name: "}4x3",
                     chargeAmt: 500,
                     finishDelay: 100,
                     chargeMult: 2,
                     damage: -1,
                     startFunction: () => {
                         this.pulseHand(3);
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                         let pokeHand = this.addImage(this.x + 180, this.y + 150, 'deathfinal', 'claw.png').setScale(0.1).setAlpha(0.65).setRotation(0.4);
                         let pokeHandGlow = this.addImage(this.x + 180, this.y + 150, 'deathfinal', 'claw_glow.png').setScale(0.2).setAlpha(0).setRotation(0.4);
                         this.summonHand(pokeHand, pokeHandGlow, 0.4, 0.7, () => {
                             this.fireTwoClaws(4, 3, pokeHand);
                         })
                     },
                     finaleFunction: () => {
                         this.currentAttackSetIndex = 1;
                         this.nextAttackIndex = 0;
                         this.interruptCurrentAttack();
                         this.setAsleep();
                         this.addDelay(() => {
                             this.rotateSpellCircleTo(1, true, () => {
                                 // this.fadeOutCurrentHand();
                                 this.createPokePower();
                                 this.addDelay(() => {
                                     messageBus.publish("showCombatText", getLangText('deathFight2plusb'), -40);
                                     this.addTimeout(() => {
                                         this.setAwake();
                                         this.spellAbsorber = messageBus.subscribe('playerCastedSpell', () => {
                                             this.addExtraDamage();
                                         });
                                         this.spellsCastCounter = 0;
                                         this.playerSpellCastSub = messageBus.subscribe('playerCastedSpell', () => {
                                             this.spellsCastCounter++;
                                             if (this.spellsCastCounter >= 2) {
                                                 this.playerSpellCastSub.unsubscribe();
                                                 messageBus.publish("closeCombatText")
                                             }
                                         });
                                     }, 100)
                                 }, 600)
                             });
                         }, 3000)
                     }
                 },
             ],
             [
                 {
                     name: ";40+#1",
                     chargeAmt: 700,
                     finishDelay: 2000,
                     damage: -1,
                     isBigMove: true,
                     startFunction: () => {
                         this.attackToStrengthen = 0;
                         this.attackToStrengthenStartDmg = 40;
                         this.pulseHand(0);
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                         this.attackToStrengthen = undefined;
                         let palmHand = this.addImage(this.x - 180, this.y - 50, 'deathfinal', 'palm.png').setScale(0.1).setAlpha(0.65);
                         let palmHandGlow = this.addImage(this.x - 180, this.y - 50, 'deathfinal', 'palm_glow.png').setScale(0.2).setAlpha(0);
                         let finalDamage = 40 + this.extraAttackDamage;
                         this.summonHand(palmHand, palmHandGlow, 0.2, 0.7, () => {
                             this.firePalm(finalDamage, palmHand);
                         }, 3)
                         this.clearExtraAttackDamage();

                     },
                 },
                 {
                     name: "$24",
                     chargeAmt: 550,
                     finishDelay: 2000,
                     damage: -1,
                     startFunction: () => {
                         this.attackToStrengthen = 2;
                         this.attackToStrengthenStartDmg = 24;
                         this.pulseHand(2);
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                         let okayHand = this.addImage(this.x + 200, this.y + 20, 'deathfinal', 'okay.png').setScale(0.1).setAlpha(0.65);
                         let okayHandGlow = this.addImage(this.x + 200, this.y + 20, 'deathfinal', 'okay_glow.png').setScale(0.2).setAlpha(0);
                         okayHand.setDepth(50);
                         okayHandGlow.setDepth(50);
                         let damage = 24 + this.extraAttackDamage;
                         this.attackToStrengthen = undefined;

                         this.summonHand(okayHand, okayHandGlow, 0.28, 1, () => {
                             this.fireTimeAttack(damage, okayHand, () => {
                                 this.redClockTemp = this.addImage(gameConsts.halfWidth, globalObjects.player.getY(), 'enemies', 'red_clock_back_large_red.png');
                                 this.redClockTemp.setAlpha(1).setScale(1.4).setDepth(50);
                                 this.addTween({
                                     targets: this.redClockTemp,
                                     alpha: 0,
                                     scaleX: 1.27,
                                     scaleY: 1.27,
                                     duration: 1000,
                                 })
                                 messageBus.publish('playerAddDelayedDamage', damage);
                             });
                         });
                         this.clearExtraAttackDamage();

                     },
                     finaleFunction: () => {

                     }
                 },
                 {
                     name: "}4x4",
                     chargeAmt: 750,
                     finishDelay: 100,
                     chargeMult: 2,
                     damage: -1,
                     isBigMove: true,
                     startFunction: () => {
                         this.pulseHand(3);
                         this.attackToStrengthen = 3;
                         this.attackToStrengthenStartDmg = 4;
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                         this.attackToStrengthen = undefined;
                         let pokeHand = this.addImage(this.x + 180, this.y + 150, 'deathfinal', 'claw.png').setScale(0.1).setAlpha(0.65).setRotation(0.4);
                         let pokeHandGlow = this.addImage(this.x + 180, this.y + 150, 'deathfinal', 'claw_glow.png').setScale(0.2).setAlpha(0).setRotation(0.4);
                         this.summonHand(pokeHand, pokeHandGlow, 0.4, 0.7, () => {
                             this.fireTwoClaws(4 + this.extraAttackDamage, 4, pokeHand);
                         })
                     },
                     finaleFunction: () => {
                         this.currentAttackSetIndex = 2;
                         this.nextAttackIndex = 0;
                         this.interruptCurrentAttack();
                         this.setAsleep();
                         this.clearPower();

                         this.addDelay(() => {
                             this.rotateSpellCircleTo(2, true, () => {
                                 this.createOkayPower();
                                 this.addDelay(() => {
                                     messageBus.publish("showCombatText", getLangText('deathFight2plusc'), -40);
                                     this.healFromAttacks = true;
                                     this.addTimeout(() => {
                                         this.setAwake();
                                         if (this.spellAbsorber) {
                                             this.spellAbsorber.unsubscribe();
                                             this.spellAbsorber = null;
                                         }
                                         this.spellsCastCounter = 0;
                                         this.playerSpellCastSub = messageBus.subscribe('playerCastedSpell', () => {
                                             this.playerSpellCastSub.unsubscribe();
                                             messageBus.publish("closeCombatText")
                                         });

                                     }, 2000)
                                 }, 600)
                             });
                         }, 3000)
                     }
                 },
             ],
             [
                 {
                     name: "OBSERVING...",
                     chargeAmt: 300,
                     finishDelay: 3000,
                     damage: 0,
                     isPassive: true,
                     startFunction: () => {
                     },
                     attackStartFunction: () => {
                         // this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                     },
                     finaleFunction: () => {

                     }
                 },
                 {
                     name: ";40+#2",
                     chargeAmt: 700,
                     finishDelay: 2000,
                     damage: -1,
                     startFunction: () => {
                         this.pulseHand(0);
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                         let palmHand = this.addImage(this.x - 180, this.y - 50, 'deathfinal', 'palm.png').setScale(0.1).setAlpha(0.65);
                         let palmHandGlow = this.addImage(this.x - 180, this.y - 50, 'deathfinal', 'palm_glow.png').setScale(0.2).setAlpha(0);
                         let finalDamage = 40 + this.extraAttackDamage;
                         this.summonHand(palmHand, palmHandGlow, 0.2, 0.7, () => {
                             this.firePalm(finalDamage, palmHand, 2);
                         }, 3)
                     },
                 },
                 {
                     name: "}15x2",
                     chargeAmt: 450,
                     finishDelay: 2000,
                     damage: -1,
                     startFunction: () => {
                         this.pulseHand(1);
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                         let pokeHand = this.addImage(this.x - 180, this.y - 50, 'deathfinal', 'poke.png').setScale(0.1).setAlpha(0.65);
                         let pokeHandGlow = this.addImage(this.x - 180, this.y - 50, 'deathfinal', 'poke_glow.png').setScale(0.2).setAlpha(0);
                         this.summonHand(pokeHand, pokeHandGlow, 0.26, 0.6, () => {
                             this.fireTwoPokes(15, pokeHand);
                         })
                     },
                 },
                 {
                     name: "|4x5",
                     chargeAmt: 750,
                     finishDelay: 1000,
                     chargeMult: 2,
                     damage: -1,
                     startFunction: () => {
                         this.pulseHand(3);
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                         let pokeHand = this.addImage(this.x + 180, this.y + 150, 'deathfinal', 'claw.png').setScale(0.1).setAlpha(0.65).setRotation(0.4);
                         let pokeHandGlow = this.addImage(this.x + 180, this.y + 150, 'deathfinal', 'claw_glow.png').setScale(0.2).setAlpha(0).setRotation(0.4);
                         this.summonHand(pokeHand, pokeHandGlow, 0.4, 0.7, () => {
                             this.fireTwoClaws(4, 5, pokeHand);
                         })
                     },
                     finaleFunction: () => {
                         this.currentAttackSetIndex = 3;
                         this.nextAttackIndex = 0;
                         this.interruptCurrentAttack();
                         this.setAsleep();
                         this.addDelay(() => {
                             this.healFromAttacks = false;
                             this.clearPower();
                             this.rotateSpellCircleTo(3, true, () => {
                                 // this.fadeOutCurrentHand();
                                 this.createClawPower();
                                 this.addDelay(() => {
                                     messageBus.publish("showCombatText", getLangText('deathFight2plusd'), -40);
                                     this.addTimeout(() => {
                                         this.setAwake();
                                         if (this.spellAbsorber) {
                                             this.spellAbsorber.unsubscribe();
                                             this.spellAbsorber = null;
                                         }
                                         this.spellsCastCounter = 0;
                                         this.playerSpellCastSub = messageBus.subscribe('playerCastedSpell', () => {
                                             this.playerSpellCastSub.unsubscribe();
                                             messageBus.publish("closeCombatText")
                                         });
                                     }, 1800)
                                 }, 600)
                             });
                         }, 3000)
                     }
                 },
             ],
             [
                 {
                     name: ";40+#3",
                     chargeAmt: 800,
                     chargeMult: 2,
                     finishDelay: 2000,
                     damage: -1,
                     isBigMove: true,
                     startFunction: () => {
                         this.pulseHand(0);
                         this.healFromAttacks = false;
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                         this.attackToStrengthen = undefined;
                         let palmHand = this.addImage(this.x - 180, this.y - 50, 'deathfinal', 'palm.png').setScale(0.1).setAlpha(0.65);
                         let palmHandGlow = this.addImage(this.x - 180, this.y - 50, 'deathfinal', 'palm_glow.png').setScale(0.2).setAlpha(0);
                         let finalDamage = 40 + this.extraAttackDamage;
                         this.summonHand(palmHand, palmHandGlow, 0.2, 0.7, () => {
                             this.firePalm(finalDamage, palmHand, 3);
                         }, 3)
                     },
                 },
                 {
                     name: "}16x2",
                     chargeAmt: 650,
                     chargeMult: 2,
                     finishDelay: 2000,
                     damage: -1,
                     isBigMove: true,
                     startFunction: () => {
                         this.pulseHand(1);
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                         let pokeHand = this.addImage(this.x - 180, this.y - 50, 'deathfinal', 'poke.png').setScale(0.1).setAlpha(0.65);
                         let pokeHandGlow = this.addImage(this.x - 180, this.y - 50, 'deathfinal', 'poke_glow.png').setScale(0.2).setAlpha(0);
                         this.summonHand(pokeHand, pokeHandGlow, 0.26, 0.6, () => {
                             this.fireTwoPokes(16, pokeHand);
                         })
                     },
                 },
                 {
                     name: "$28",
                     chargeAmt: 700,
                     chargeMult: 2,
                     finishDelay: 2000,
                     damage: -1,
                     isBigMove: true,
                     startFunction: () => {
                         this.pulseHand(2);
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                         let okayHand = this.addImage(this.x + 200, this.y + 20, 'deathfinal', 'okay.png').setScale(0.1).setAlpha(0.65);
                         let okayHandGlow = this.addImage(this.x + 200, this.y + 20, 'deathfinal', 'okay_glow.png').setScale(0.2).setAlpha(0);
                         okayHand.setDepth(50);
                         okayHandGlow.setDepth(50);
                         let damage = 28

                         this.summonHand(okayHand, okayHandGlow, 0.28, 1, () => {
                             this.fireTimeAttack(damage, okayHand, () => {
                                 this.redClockTemp = this.addImage(gameConsts.halfWidth, globalObjects.player.getY(), 'enemies', 'red_clock_back_large_red.png');
                                 this.redClockTemp.setAlpha(1).setScale(1.4).setDepth(50);
                                 this.addTween({
                                     targets: this.redClockTemp,
                                     alpha: 0,
                                     scaleX: 1.27,
                                     scaleY: 1.27,
                                     duration: 1000,
                                 })
                                 messageBus.publish('playerAddDelayedDamage', damage);
                             });
                         });
                     },
                     finaleFunction: () => {
                         this.interruptCurrentAttack();
                         this.setAsleep();
                         this.addDelay(() => {
                             this.clearPower();
                             this.addDelay(() => {
                                 messageBus.publish("showCombatText", getLangText('deathFight2pluse'), -40);
                                 this.addTimeout(() => {
                                     this.setAwake();
                                     this.spellsCastCounter = 0;
                                     this.playerSpellCastSub = messageBus.subscribe('playerCastedSpell', () => {
                                         this.playerSpellCastSub.unsubscribe();
                                         messageBus.publish("closeCombatText")
                                     });
                                 }, 1800)
                             }, 600)
                         }, 3000)
                     }
                 },
                 {
                     name: ";100",
                     chargeAmt: 700,
                     finishDelay: 2500,
                     damage: -1,
                     isBigMove: true,
                     startFunction: () => {
                         this.pulseSpellCircle(true)
                         this.pulseHand(0);
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                         let palmHand = this.addImage(this.x - 180, this.y - 50, 'deathfinal', 'palm.png').setScale(0.1).setAlpha(0.65);
                         let palmHandGlow = this.addImage(this.x - 180, this.y - 50, 'deathfinal', 'palm_glow.png').setScale(0.2).setAlpha(0);
                         let finalDamage = 100;
                         this.summonHand(palmHand, palmHandGlow, 0.18, 0.7, () => {
                             this.firePalm(finalDamage, palmHand, 0);
                         }, 4)
                     },
                 },
                 {
                     name: "}16x3",
                     chargeAmt: 450,
                     finishDelay: 2500,
                     damage: -1,
                     isBigMove: true,
                     startFunction: () => {
                         this.pulseSpellCircle(true)
                         this.pulseHand(1);
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                         let pokeHand = this.addImage(this.x - 180, this.y - 50, 'deathfinal', 'poke.png').setScale(0.1).setAlpha(0.65);
                         let pokeHandGlow = this.addImage(this.x - 180, this.y - 50, 'deathfinal', 'poke_glow.png').setScale(0.2).setAlpha(0);
                         this.summonHand(pokeHand, pokeHandGlow, 0.26, 0.6, () => {
                             this.fireTwoPokes(16, pokeHand, true);
                         })
                     },
                 },
                 {
                     name: "$999",
                     chargeAmt: 550,
                     finishDelay: 5000,
                     damage: -1,
                     startFunction: () => {
                         this.pulseSpellCircle(true)
                         this.pulseHand(2);
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                         let okayHand = this.addImage(this.x + 200, this.y + 20, 'deathfinal', 'okay.png').setScale(0.1).setAlpha(0.65);
                         let okayHandGlow = this.addImage(this.x + 200, this.y + 20, 'deathfinal', 'okay_glow.png').setScale(0.2).setAlpha(0);
                         okayHand.setDepth(50);
                         okayHandGlow.setDepth(50);
                         let damage = 999;

                         this.summonHand(okayHand, okayHandGlow, 0.28, 1, () => {
                             this.fireTimeAttack(damage, okayHand, () => {
                                 countdown(50, 999);
                             });
                         });
                     },
                     finaleFunction: () => {

                     }
                 },
                 {
                     name: "|4x10",
                     chargeAmt: 750,
                     finishDelay: 2000,
                     chargeMult: 2,
                     damage: -1,
                     startFunction: () => {
                         this.pulseSpellCircle(true)
                         this.pulseHand(3);
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                         let pokeHand = this.addImage(this.x + 180, this.y + 150, 'deathfinal', 'claw.png').setScale(0.1).setAlpha(0.65).setRotation(0.4);
                         let pokeHandGlow = this.addImage(this.x + 180, this.y + 150, 'deathfinal', 'claw_glow.png').setScale(0.2).setAlpha(0).setRotation(0.4);
                         this.summonHand(pokeHand, pokeHandGlow, 0.4, 0.7, () => {
                             this.fireTwoClaws(4, 10, pokeHand);
                         })
                     },
                     finaleFunction: () => {
                         this.currentAttackSetIndex = 4;
                         this.nextAttackIndex = 0;
                         //this.interruptCurrentAttack();
                         //this.setAsleep();
                     }
                 },
             ],
             [
                 {
                     name: "}44x4",
                     chargeAmt: 1200,
                     chargeMult: 2,
                     finishDelay: 3000,
                     damage: -1,
                     isBigMove: true,
                     attackStartFunction: () => {

                     },
                     finaleFunction: () => {
                     }
                 },

             ]
         ];
     }

     /*
                      {
                     name: "$28",
                     chargeAmt: 550,
                     finishDelay: 2000,
                     damage: -1,
                     startFunction: () => {
                         this.attackToStrengthen = 2;
                         this.attackToStrengthenStartDmg = 24;
                         this.pulseHand(2);
                     },
                     attackStartFunction: () => {
                         this.fadeOutCurrentHand();
                     },
                     attackFinishFunction: () => {
                         let okayHand = this.addImage(this.x + 200, this.y + 20, 'deathfinal', 'okay.png').setScale(0.1).setAlpha(0.65);
                         let okayHandGlow = this.addImage(this.x + 200, this.y + 20, 'deathfinal', 'okay_glow.png').setScale(0.2).setAlpha(0);
                         okayHand.setDepth(50);
                         okayHandGlow.setDepth(50);
                         let damage = 28 + this.extraAttackDamage;
                         this.attackToStrengthen = undefined;

                         this.summonHand(okayHand, okayHandGlow, 0.28, 1, () => {
                             this.fireTimeAttack(damage, okayHand, () => {
                                 this.redClockTemp = this.addImage(gameConsts.halfWidth, globalObjects.player.getY(), 'enemies', 'red_clock_back_large_red.png');
                                 this.redClockTemp.setAlpha(1).setScale(1.4).setDepth(50);
                                 this.addTween({
                                     targets: this.redClockTemp,
                                     alpha: 0,
                                     scaleX: 1.27,
                                     scaleY: 1.27,
                                     duration: 1000,
                                 })
                                 messageBus.publish('playerAddDelayedDamage', damage);
                             });
                         });
                         this.clearExtraAttackDamage();

                     },
                     finaleFunction: () => {

                     }
                 },
      */

     setHealth(newHealth, isTrue) {
        // messageBus.publish('animateBlockNum', gameConsts.halfWidth, this.sprite.y + 50, 'IMMATERIAL', 0.8, {y: "+=5", ease: 'Quart.easeOut'}, {alpha: 0, scaleX: 1.1, scaleY: 1.1});
         if (this.shieldAmts > 0 && !isTrue) {
             this.damageHandShield();
             super.setHealth(this.health);
             return;
         } else {
             super.setHealth(newHealth);
         }

         let currHealthPercent = this.health / this.healthMax;
         if (currHealthPercent == 0) {
             // dead, can't do anything
             return;
         } else {
             let prevHealthPercent = this.prevHealth / this.healthMax;
             if (this.health <= 99 && this.prevHealth > 99) {
                 messageBus.publish("closeCombatText")
                 this.emergencyShield();
                 this.clearExtraAttackDamage();
                 this.clearPower();

                 globalObjects.bannerTextManager.setDialog([getLangText('deathFight2plusz'), getLangText('deathFight2plusz2')]);
                 globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight + 10, 0);
                 globalObjects.bannerTextManager.showBanner(0);
                 globalObjects.bannerTextManager.setOnFinishFunc(() => {
                     this.setAwake();
                 })
             }
         }
     }

     reactToDamageTypes(amt, isAttack, type) {
         if (this.healFromAttacks && isAttack && amt >= 1) {
             this.addExtraHeal();
         }
         return super.reactToDamageTypes(amt, isAttack, type);
     }

     clearHandObjects() {
         for (let i = 0; i < this.handObjects.length; i++) {
             let currObj = this.handObjects[i]
         }
     }

     emergencyShield() {
         this.interruptCurrentAttack();
         this.clearHandObjects();
         playSound('slice_in');
         this.createHandShield(10, true);
         this.currentAttackSetIndex = 1;
         this.nextAttackIndex = 0;
         this.setAsleep();
     }

     summonHand(hand, glow, scaleAmt = 0.26, goalAlpha = 0.6, onComplete, enlargeTimes = 2) {
         let startAlpha = hand.alpha;
         for (let i = 0; i < enlargeTimes; i++) {
             let pebbles = getTempPoolObject('blurry', 'rock_rush.png', 'rockRush', 800);
             pebbles.setPosition(hand.x, hand.y).setAlpha(0).setScale(1);
             this.addTween({
                 delay: i * 350,
                 targets: pebbles,
                 duration: 350,
                 ease: 'Quad.easeIn',
                 scaleX: 0.15,
                 scaleY: 0.15,
                 onStart: () => {
                     playSound('matter_strike_heavy',0.9 - 0.05 * i).detune = -100 * i * i;
                 }
             })
             this.addTween({
                 delay: i * 350,
                 targets: pebbles,
                 duration: 200,
                 ease: 'Quad.easeOut',
                 alpha: 1,
                 onComplete: () => {
                     let scaleGoal = (i + 1) * scaleAmt;
                     this.addTween({
                         targets: [hand],
                         alpha: startAlpha * 0.5 - (i * 0.25) + goalAlpha * 0.5 + (i * 0.25),
                         duration: 150,
                         ease: 'Quad.easeIn',
                         scaleX: scaleGoal,
                         scaleY: scaleGoal,
                         onComplete: () => {
                             if (i == enlargeTimes - 1) {
                                 glow.setAlpha(0.8).setScale(scaleGoal * 2)
                                 this.addTween({
                                     targets: glow,
                                     alpha: 0,
                                     duration: 500,
                                     onComplete: () => {
                                         glow.destroy();
                                        onComplete();
                                     }
                                 })
                             }
                         }
                     })
                     this.addTween({
                         targets: pebbles,
                         duration: 150,
                         ease: 'Quad.easeOut',
                         alpha: 0,
                     })
                 }
             })
         }
     }

     firePalm(damage, palmHand, shields = 1) {
         let isExtraLarge = damage > 80;
         palmHand.setDepth(22);
         this.addTween({
             targets: palmHand,
             duration: 400,
             alpha: 1,
             ease: 'Cubic.easeOut',
         })
         this.addTween({
             targets: palmHand,
             duration: isExtraLarge ? 550 : 500,
             x: gameConsts.halfWidth - 15,
             y: globalObjects.player.getY() - 215,
             scaleX: isExtraLarge ? 1.15 : 1,
             scaleY: isExtraLarge ? 1.15 : 1,
             ease: 'Quart.easeIn',
             onComplete: () => {
                 messageBus.publish("selfTakeDamage", damage);
                 this.bgMain.setAlpha(0.75);
                 this.addTween({
                     targets: this.bgMain,
                     alpha: 1,
                     ease: "Quad.easeOut",
                     duration: 800
                 })
                 screenShake(7);
                 playSound('body_slam', 0.6);
                 playSound('rock_crumble', 0.7);
                 playSound('shield_block', 0.8).detune = -800;
                 let dmgEffect = poolManager.getItemFromPool('brickPattern2')
                 if (!dmgEffect) {
                     dmgEffect = this.addImage(gameConsts.halfWidth, globalObjects.player.getY() - 120, 'spells', 'brickPattern2.png').setDepth(998).setScale(0.9);
                 }
                 dmgEffect.setDepth(998).setScale(0.95).setAlpha(0.9).setPosition(gameConsts.halfWidth, globalObjects.player.getY() - 120);
                 this.addTween({
                     targets: dmgEffect,
                     rotation: 1,
                     alpha: 0,
                     duration: 800,
                 });
                 this.addTween({
                     targets: palmHand,
                     duration: isExtraLarge ? 200 : 150,
                     y: "-=30",
                     scaleX: "-=0.14",
                     scaleY: "-=0.14",
                     ease: "Back.easeOut",
                     completeDelay: 400,
                     onComplete: () => {
                         this.addTween({
                             delay: isExtraLarge ? 350 : 300,
                             targets: palmHand,
                             duration: 500,
                             y: this.y + 150,
                             alpha: 0.4,
                             ease: "Cubic.easeIn",
                             scaleX: isExtraLarge ? 0.75 : 0.65,
                             scaleY: isExtraLarge ? 0.75 : 0.65,
                             onStart: () => {
                                 playSound('whoosh', 0.8).setSeek(0.1);
                                 if (shields >= 1) {
                                     this.addDelay(() => {
                                         this.createHandShield(shields);
                                     }, 200);
                                 }
                             },
                             onComplete: () => {

                                 this.addTween({
                                     targets: palmHand,
                                     duration: 150,
                                     alpha: 0,
                                     scaleX: 1,
                                     scaleY: 1,
                                     ease: 'Quint.easeOut',
                                 })
                             }
                         })
                     }
                 })
             }
         })
     }


     fireTwoPokes(damage, pokeHand, hasExtraPoke = false) {
         pokeHand.setDepth(22);
         this.addTween({
             targets: pokeHand,
             duration: 400,
             alpha: 1,
             ease: 'Cubic.easeOut',
         })
         this.addTween({
             targets: pokeHand,
             duration: 500,
             x: gameConsts.halfWidth - 15,
             y: globalObjects.player.getY() - 215,
             scaleX: 1,
             scaleY: 1,
             ease: 'Quart.easeIn',
             onComplete: () => {
                 messageBus.publish("selfTakeDamage", damage);
                 this.bgMain.setAlpha(0.75);
                 this.addTween({
                     targets: this.bgMain,
                     alpha: 1,
                     ease: "Quad.easeOut",
                     duration: 800
                 })
                 screenShake(6);
                 playSound('body_slam')
                 let dmgEffect = poolManager.getItemFromPool('brickPattern2')
                 if (!dmgEffect) {
                     dmgEffect = this.addImage(gameConsts.halfWidth, globalObjects.player.getY() - 120, 'spells', 'brickPattern2.png').setDepth(998).setScale(0.75);
                 }
                 dmgEffect.setDepth(998).setScale(0.88).setAlpha(0.8).setPosition(gameConsts.halfWidth, globalObjects.player.getY() - 120);
                 this.addTween({
                     targets: dmgEffect,
                     rotation: 1,
                     alpha: 0,
                     duration: 750,
                 });
                 this.addTween({
                     delay: 250,
                     targets: pokeHand,
                     duration: 500,
                     y: globalObjects.player.getY() - 305,
                     ease: "Cubic.easeInOut",
                     scaleX: 0.7,
                     scaleY: 0.7,
                     onComplete: () => {
                         this.addTween({
                             targets: pokeHand,
                             duration: 400,
                             y: globalObjects.player.getY() - 215,
                             scaleX: 1,
                             scaleY: 1,
                             ease: 'Quint.easeIn',
                             onComplete: () => {
                                 let hitEffect = getTempPoolObject('blurry', 'pulser.png', 'pulser', 1100);
                                 hitEffect.setPosition(gameConsts.halfWidth, globalObjects.player.getY() - 220).setDepth(pokeHand.depth + 1).setScale(0.3, 0.15).setVisible(true);
                                 this.addTween({
                                     targets: hitEffect,
                                     scaleX: 3.5,
                                     scaleY: 1.75,
                                     ease: 'Quint.easeOut',
                                     duration: 900,
                                 });
                                 this.addTween({
                                     targets: hitEffect,
                                     alpha: 0,
                                     duration: 900,
                                     ease: 'Quad.easeOut'
                                 });

                                 messageBus.publish("selfTakeDamage", damage);
                                 screenShake(7);
                                 playSound('body_slam');
                                 this.bgMain.setAlpha(0.75);
                                 this.addTween({
                                     targets: this.bgMain,
                                     alpha: 1,
                                     ease: "Quad.easeOut",
                                     duration: 800
                                 })
                                 dmgEffect.setDepth(998).setScale(1).setAlpha(0.8).setPosition(gameConsts.halfWidth, globalObjects.player.getY() - 120);
                                 this.addTween({
                                     targets: dmgEffect,
                                     rotation: 2.2,
                                     alpha: 0,
                                     duration: 800,
                                     onComplete: () => {
                                         poolManager.returnItemToPool(dmgEffect, 'brickPattern2');
                                     }
                                 });
                                 if (hasExtraPoke) {
                                     this.addTween({
                                         delay: 250,
                                         targets: pokeHand,
                                         duration: 1200,
                                         y: globalObjects.player.getY() - 335,
                                         ease: "Cubic.easeInOut",
                                         scaleX: 0.7,
                                         scaleY: 0.7,
                                         onComplete: () => {
                                             this.addTween({
                                                 delay: 100,
                                                 targets: pokeHand,
                                                 duration: 350,
                                                 y: globalObjects.player.getY() - 215,
                                                 scaleX: 1,
                                                 scaleY: 1,
                                                 ease: 'Quint.easeIn',
                                                 onComplete: () => {
                                                     let hitEffect = getTempPoolObject('blurry', 'pulser.png', 'pulser', 1100);
                                                     hitEffect.setPosition(gameConsts.halfWidth, globalObjects.player.getY() - 220).setDepth(pokeHand.depth + 1).setScale(0.3, 0.15).setVisible(true);
                                                     this.addTween({
                                                         targets: hitEffect,
                                                         scaleX: 3.5,
                                                         scaleY: 1.75,
                                                         ease: 'Quint.easeOut',
                                                         duration: 900,
                                                     });
                                                     this.addTween({
                                                         targets: hitEffect,
                                                         alpha: 0,
                                                         duration: 900,
                                                         ease: 'Quad.easeOut'
                                                     });

                                                     messageBus.publish("selfTakeDamage", damage);
                                                     screenShake(7);
                                                     playSound('body_slam');
                                                     this.bgMain.setAlpha(0.75);
                                                     this.addTween({
                                                         targets: this.bgMain,
                                                         alpha: 1,
                                                         ease: "Quad.easeOut",
                                                         duration: 800
                                                     })
                                                     dmgEffect.setDepth(998).setScale(1).setAlpha(0.8).setPosition(gameConsts.halfWidth, globalObjects.player.getY() - 120);
                                                     this.addTween({
                                                         targets: dmgEffect,
                                                         rotation: 2.2,
                                                         alpha: 0,
                                                         duration: 800,
                                                         onComplete: () => {
                                                             poolManager.returnItemToPool(dmgEffect, 'brickPattern2');
                                                         }
                                                     });
                                                     this.addTween({
                                                         delay: 600,
                                                         targets: pokeHand,
                                                         duration: 400,
                                                         y: globalObjects.player.getY() - 240,
                                                         scaleX: 0.9,
                                                         scaleY: 0.9,
                                                         alpha: 0,
                                                         ease: 'Quart.easeIn',
                                                         onComplete: () => {
                                                             pokeHand.destroy();
                                                         }
                                                     })
                                                 }
                                             });
                                         }
                                     });
                                 } else {
                                     this.addTween({
                                         delay: 600,
                                         targets: pokeHand,
                                         duration: 400,
                                         y: globalObjects.player.getY() - 240,
                                         scaleX: 0.9,
                                         scaleY: 0.9,
                                         alpha: 0,
                                         ease: 'Quart.easeIn',
                                         onComplete: () => {
                                             pokeHand.destroy();
                                         }
                                     })
                                 }

                             }
                         })
                     }
                 })
             }
         })
     }

     fireTimeAttack(damage, okayHand, onComplete) {
         let blackBG = getBackgroundBlackout();
         blackBG.setDepth(okayHand.depth - 1).setAlpha(0);
         let flash = this.addImage(okayHand.x - 40, okayHand.y - 2, 'blurry', 'flash.webp');
         flash.setPosition(okayHand.x - 45, okayHand.y - 2).setScale(0.1).setDepth(okayHand.depth + 1).setAlpha(1).setRotation(-0.8);
         let starBlack = this.addImage(okayHand.x - 40, okayHand.y - 2, 'lowq', 'star_black.png').setAlpha(0.1).setScale(0.75).setDepth(-1);
         this.addTween({
             targets: starBlack,
             alpha: 0.5,
             scaleX: 1.5,
             scaleY: 1.5,
             duration: 700,
             ease: 'Quad.easeOut',
             onComplete: () => {
                 this.addTween({
                     targets: starBlack,
                     alpha: 0,
                     scaleX: 1.3,
                     scaleY: 1.3,
                     duration: 900,
                     ease: 'Quad.easeIn',
                     onComplete: () => {
                         starBlack.destroy();
                     }
                 });
             }
         });
         this.addTween({
             targets: okayHand,
             alpha: 1,
             duration: 300,
         });
         this.addTween({
             targets: flash,
             rotation: 3,
             duration: 1500,
             ease: 'Quad.easeInOut'
         });
         this.addTween({
             targets: blackBG,
             alpha: 0.4,
             duration: 1800,
             ease: 'Quad.easeOut',
         });
         this.addTween({
             targets: flash,
             scaleX: 2.5,
             scaleY: 2.5,
             duration: 700,
             ease: 'Quad.easeIn',
             onComplete: () => {
                 this.addTween({
                     targets: flash,
                     scaleX: 0,
                     scaleY: 0,
                     duration: 800,
                     ease: 'Quad.easeOut',
                     onComplete: () => {
                         let pulser = getTempPoolObject('circle', 'blastEffect1.png', 'blastEffect', 1300);
                         //let pulser2 = getTempPoolObject('blurry', 'pulser.png', 'pulser', 600);
                         pulser.setPosition(flash.x, flash.y).setDepth(okayHand.depth + 1).setScale(0.6).setVisible(true).setAlpha(0);
                         //pulser2.setPosition(flash.x, flash.y).setDepth(okayHand.depth + 1).setScale(0.5, 0.5).setVisible(true).setAlpha(0.6);
                         this.addTween({
                             targets: pulser,
                             alpha: 1.3,
                             scaleX: 0.35,
                             scaleY: 0.35,
                             ease: 'Quint.easeIn',
                             duration: 200,
                             onComplete: () => {
                                 playSound('ringknell').detune = 700;
                                 playSound('water_drop', 0.7);
                                 this.addTween({
                                     targets: pulser,
                                     scaleX: 14,
                                     scaleY: 14,
                                     duration: 750,
                                     ease: 'Quart.easeIn',
                                 });
                                 this.addTween({
                                     targets: pulser,
                                     alpha: 0,
                                     duration: 750,
                                     ease: 'Quint.easeIn',
                                     onComplete: () => {
                                         pulser.alpha = 0;
                                     }
                                 });
                             }
                         });
                         // this.addTween({
                         //     targets: pulser2,
                         //     scaleX: 1.7,
                         //     scaleY: 1.7,
                         //     duration: 550,
                         //     ease: 'Cubic.easeOut',
                         // });
                         // this.addTween({
                         //     targets: pulser2,
                         //     alpha: 0,
                         //     duration: 550,
                         // });

                         this.addDelay(() => {
                             playSound('slice_in');
                             blackBG.setAlpha(0.75);
                             this.addTween({
                                 targets: blackBG,
                                 alpha: 0,
                                 duration: 2000,
                                 ease: 'Quad.easeOut'
                             });
                             playSound('time_strike_alt');
                             playSound('heartbeatfast');
                             this.addTween({
                                 delay: 2000,
                                 targets: okayHand,
                                 alpha: 0,
                                 ease: 'Quad.easeIn',
                                 duration: 500,
                                 scaleX: 0.5,
                                 scaleY: 0.5
                             })
                             onComplete();
                         }, 850)

                     }
                 });
             }
         });
     }

     fireTwoClaws(damage, times, handObj) {
         let handStartX = handObj.x;
         let handStartY = handObj.y;

         let handMoveX = gameConsts.halfWidth - 90 - handStartX;
         let handMoveY = globalObjects.player.getY() - 68 - handStartY;
         let rotAmt = 0.8;
         handObj.setDepth(50);
        this.addTween({
            targets: handObj,
            rotation: rotAmt,
            scaleX: handObj.scaleX * 0.65,
            scaleY: handObj.scaleX * 0.65,
            duration: 400,
            ease: 'Quart.easeInOut',
            onComplete: () => {
                playSound('roar').setSeek(0.1);

                this.repeatScratch(damage, times, handObj, handMoveX, handMoveY, () => {
                    this.addTween({
                        delay: 500,
                        targets: handObj,
                        alpha: 0,
                        scaleX: 0.8,
                        scaleY: 0.8,
                        duration: 500,
                        ease: 'Quad.easeIn',
                        onComplete: () => {
                            handObj.destroy();
                        }
                    })
                });
            }
        })
     }

     playScratchTween(image) {
         this.addTween({
             targets: image,
             scaleX: 1.25,
             scaleY: 2,
             ease: 'Cubic.easeIn',
             duration: 100,
             onComplete: () => {
                 this.addTween({
                     targets: image,
                     scaleX: 1,
                     scaleY: 1,
                     ease: 'Quint.easeOut',
                     duration: 300,
                     onComplete: () => {
                         this.addTween({
                             targets: image,
                             scaleX: 0.2,
                             ease: 'Cubic.easeIn',
                             duration: 500,
                             alpha: 0,
                         })
                     }
                 })
             }
         })
     }

     repeatScratch(damage, times, handObj, handMoveX, handMoveY, onComplete) {
         this.addDelay(() => {
             let max2Scratch = times >= 2 ? 2 : times;
             times -= max2Scratch;
             for (let i = 0; i < max2Scratch; i++) {
                 this.addDelay(() => {
                     let scratch = getTempPoolObject('deathfinal', 'scratch.png', 'scratch', 1500);
                     scratch.rotation = 0.8;
                     scratch.setPosition(gameConsts.halfWidth - 35 + 70 * i, globalObjects.player.getY() - 206 + i * 40);
                     scratch.setScale(0.1, 0.5).setDepth(999);
                     this.playScratchTween(scratch);

                     messageBus.publish("selfTakeDamage", damage);
                     playSound('slice_in')
                 }, i * 45);
             }
             zoomTemp(1.02);
             messageBus.publish('tempPause', 60, 0.5);
         }, 250)
         this.addTween({
             targets: handObj,
             alpha: 1,
             duration: 250,
             ease: 'Quad.easeOut',
         })

         this.addTween({
             targets: handObj,
             scaleX: 1.15,
             scaleY: 1.15,
             alpha: 1,
             duration: 280,
             ease: 'Quad.easeIn',
         })
         this.addTween({
             targets: handObj,
             x: "+=" + handMoveX,
             y: "+=" + handMoveY,
             duration: 280,
             ease: 'Quint.easeIn',
             onComplete: () => {
                 let overshootX = handMoveX * 0.2;
                 let overshootY = handMoveY * 0.2;
                 this.addTween({
                     targets: handObj,
                     duration: 300,
                     alpha: 0,
                 })
                 this.addTween({
                     targets: handObj,
                     x: "+=" + overshootX,
                     y: "+=" + overshootY,
                     duration: 300,
                     ease: 'Quint.easeOut',
                     onComplete: () => {
                         if (times <= 0) {
                             onComplete()
                         } else {
                             handObj.scaleX = -handObj.scaleX;
                             // preparing left swipe
                             this.addTween({
                                 targets: handObj,
                                 x: gameConsts.halfWidth - 170,
                                 y: this.y + 150,
                                 scaleX: -0.65,
                                 scaleY: 0.65,
                                 alpha: 0.75,
                                 duration: 350,
                                 rotation: -handObj.rotation,
                                 ease: 'Quart.easeInOut',
                                 onComplete: () => {
                                     // next swipe
                                     this.addDelay(() => {
                                         let max2Scratch = times >= 2 ? 2 : times;
                                         times -= max2Scratch;
                                         for (let i = 0; i < max2Scratch; i++) {
                                             this.addDelay(() => {
                                                 let scratch = getTempPoolObject('deathfinal', 'scratch.png', 'scratch', 1500);
                                                 scratch.rotation = -0.8;
                                                 scratch.setPosition(gameConsts.halfWidth + 35 - 70 * i, globalObjects.player.getY() - 206 + i * 40);
                                                 scratch.setScale(0.1, 0.5).setDepth(999);
                                                 this.playScratchTween(scratch);

                                                 messageBus.publish("selfTakeDamage", damage);
                                                 playSound('slice_in')
                                             }, i * 60);
                                         }
                                         zoomTemp(1.02);
                                         messageBus.publish('tempPause', 60, 0.5);
                                         this.addTween({
                                             targets: handObj,
                                             duration: 300,
                                             alpha: 0,
                                         })
                                         this.addTween({
                                             targets: handObj,
                                             x: "-=" + overshootX,
                                             y: "+=" + overshootY,
                                             duration: 400,
                                             ease: 'Quint.easeOut',
                                             onComplete: () => {
                                                 if (times <= 0) {
                                                     onComplete()
                                                 } else {
                                                     let handStartX = gameConsts.halfWidth + 170;
                                                     let handStartY = this.y + 150;
                                                     let handMoveX = gameConsts.halfWidth - 90 - handStartX;
                                                     let handMoveY = globalObjects.player.getY() - 68 - handStartY;
                                                     let rotAmt = 0.8;
                                                     handObj.scaleX = Math.abs(handObj.scaleX);
                                                     this.addTween({
                                                         targets: handObj,
                                                         rotation: rotAmt,
                                                         x: handStartX,
                                                         y: handStartY,
                                                         alpha: 0.75,
                                                         scaleX: 0.65,
                                                         scaleY: 0.65,
                                                         duration: 350,
                                                         ease: 'Quart.easeInOut',
                                                         completeDelay: 10,
                                                         onComplete: () => {
                                                             this.repeatScratch(damage, times, handObj, handMoveX, handMoveY, onComplete);
                                                         }
                                                     })
                                                 }
                                             }
                                         })

                                     }, 250);
                                     this.addTween({
                                         targets: handObj,
                                         scaleX: -1.15,
                                         scaleY: 1.15,
                                         duration: 250,
                                         ease: 'Quad.easeIn'
                                     })
                                     this.addTween({
                                         targets: handObj,
                                         alpha: 1,
                                         duration: 250,
                                         ease: 'Cubic.easeOut'
                                     })
                                     this.addTween({
                                         targets: handObj,
                                         x: "-=" + handMoveX,
                                         y: "+=" + handMoveY,
                                         duration: 250,
                                         ease: 'Quint.easeIn',
                                     });
                                 }
                             })
                         }
                     }
                 })
             }
         });
     }

     countdown(depth, damage) {
         if (this.dead) {
             return;
         }
         this.redClockTemp.setAlpha(0).setScale(1.5).setRotation(-2).setDepth(depth + 1);
         this.addTween({
             targets: redClockTemp,
             scaleX: 1.2,
             scaleY: 1.2,
             duration: 500,
             ease: 'Cubic.easeIn',
         })
         this.addTween({
             targets: this.redClockTemp,
             rotation: 0,
             alpha: 0.8,
             duration: 500,
             onComplete: () => {
                 this.redClockTemp.setAlpha(1);
                 this.addTween({
                     targets: this.redClockTemp,
                     alpha: 0.9,
                     duration: 500,
                     ease: 'Cubic.easeOut',
                 });
                 let redClockArmBack = this.addImage(gameConsts.halfWidth, globalObjects.player.getY(), 'enemies', 'red_clock_arm_large.png');
                 let redClockArmFront = this.addImage(gameConsts.halfWidth, globalObjects.player.getY(), 'enemies', 'red_clock_arm_large.png');
                 redClockArmBack.setDepth(1).setAlpha(1).setRotation(Math.PI * 0.5).setScale(1.15).setOrigin(0.5, 1.1);
                 redClockArmFront.setDepth(10001).setAlpha(0.95).setRotation(Math.PI * 0.5).setBlendMode(Phaser.BlendModes.LIGHTEN).setScale(1.15).setOrigin(0.5, 1.1);
                 this.addTween({
                     targets: [redClockArmBack],
                     duration: 500,
                     alpha: 0.8,
                     scaleX: 1.2,
                     scaleY: 1.2
                 });
                 this.addTween({
                     targets: [redClockArmFront],
                     duration: 500,
                     alpha: 0.4,
                     scaleX: 1.2,
                     scaleY: 1.2,
                     onComplete: () => {
                         for (let i = 5; i >= 0; i--) {
                             this.addDelay(() => {
                                 redClockArmBack.setAlpha(1).setRotation(Math.PI * 0.25 * 0.33 * i - 0.04).setScale(1.05);
                                 redClockArmFront.setAlpha(0.75).setRotation(Math.PI * 0.25 * 0.33 * i - 0.04).setScale(1.05);
                                 if (i == 0) {
                                     messageBus.publish('playerAddDelayedDamage', damage);
                                     screenShake(5);
                                     this.addTween({
                                         targets: [this.redClockTemp, redClockArmBack, redClockArmFront],
                                         alpha: 0,
                                         duration: 1000,
                                     })
                                     this.addTween({
                                         targets: this.redClockTemp,
                                         scaleX: 1.4,
                                         scaleY: 1.4,
                                         ease: 'Quad.easeOut',
                                         duration: 1000,
                                         onComplete: () => {
                                             this.redClockTemp.alpha = 0;
                                             redClockArmBack.destroy();
                                             redClockArmFront.destroy();
                                         }
                                     });
                                     this.bgMain.setAlpha(0.75);
                                     this.addTween({
                                         targets: this.bgMain,
                                         alpha: 1,
                                         duration: 1000,
                                     })
                                 }
                                 this.addTween({
                                     targets: [redClockArmBack, redClockArmFront],
                                     duration: 150,
                                     scaleX: 1.2,
                                     scaleY: 1.2,
                                     rotation: Math.PI * 0.25 * 0.33 * i,
                                     ease: 'Back.easeOut'
                                 });
                                 this.addTween({
                                     targets: [redClockArmBack],
                                     duration: 500,
                                     alpha: 0.8,
                                 });
                                 this.addTween({
                                     targets: [redClockArmFront],
                                     duration: 500,
                                     alpha: 0.4,
                                 });
                                 playSound('clocktick1', 1).detune = 100 - i * 50;

                             }, (5 - i) * 1000)
                         }
                     }
                 })
             }
         })
     }

     pulseHand(idx) {
         if (this.dead) {
             return;
         }
         let xPos = 0; let yPos = 0;
         if (idx == 0) {
            xPos = gameConsts.halfWidth - 185;
            yPos = this.y - 5;

         } else if (idx == 1) {
             xPos = gameConsts.halfWidth - 102;
             yPos = this.y - 87;
         } else if (idx == 2) {
             xPos = gameConsts.halfWidth + 90;
             yPos = this.y - 90;
         } else if (idx == 3) {
             xPos = gameConsts.halfWidth + 198;
             yPos = this.y - 5;
         }
         this.currentHandGlow.setFrame('glow_hand.png');
         this.currentHandGlowPulse.setFrame('glow_hand.png');
         this.currentHandGlow.setPosition(xPos, yPos).setAlpha(0.6).setScale(0);
         this.currentHandGlowPulse.setPosition(xPos, yPos).setAlpha(0).setScale(0.65);
         this.addTween({
             targets: this.currentHandGlow,
             scaleX: 0.65,
             scaleY: 0.65,
             duration: 1200,
             ease: 'Cubic.easeIn'
         });
         this.currentHandGlow.currAnim = this.addTween({
             targets: this.currentHandGlow,
             alpha: 0.3,
             duration: 1200,
             yoyo: true,
             repeat: -1,
             onRepeat: () => {
                 this.currentHandGlowPulse.setAlpha(0.65).setScale(0.65);
                 this.addTween({
                     targets: this.currentHandGlowPulse,
                     alpha: 0,
                     scaleX: 1.1,
                     scaleY: 1.1,
                     duration: 1500,
                     ease: 'Quad.easeOut'
                 });
             }
         })
     }

     createHandShield(amt, instant) {
         if (this.dead) {
             return;
         }
         let durMut = instant ? 0.25 : 1;
         let oldShieldAmts = this.shieldAmts;
         this.shieldAmts += amt;
         this.shieldText.visible = true;
         this.shieldText.setText(this.shieldAmts);
         if (oldShieldAmts > 0) {
             this.shieldText.setScale(1.3);
             this.scene.tweens.add({
                 targets: this.shieldText,
                 scaleX: this.shieldText.startScale,
                 scaleY: this.shieldText.startScale,
                 ease: 'Back.easeOut',
                 duration: durMut * 250,
             });
             this.handShieldBack.setScale(1.9).setAlpha(1);
             this.handShieldBack.visible = true;
             this.addTween({
                 targets: [this.handShieldBack],
                 duration: durMut * 1000,
                 alpha: 0,
                 scaleX: this.handShieldBack.startScale,
                 scaleY: this.handShieldBack.startScale,
                 ease: 'Quad.easeOut',
             });

             return;
         }

         this.shieldText.setScale(0.1);
         this.shieldText.startX = this.shieldText.x;
         this.shieldText.startScale = 1;
         this.scene.tweens.add({
             targets: this.shieldText,
             scaleX: this.shieldText.startScale,
             scaleY: this.shieldText.startScale,
             ease: 'Back.easeOut',
             duration: durMut * 250,
         });
         playSound('swish');
         // playSound('slice_in');

         this.handShield.visible = true;
         this.handShield.setScale(this.handShield.startScale * 0.5).setAlpha(0.2);
         this.addTween({
             targets: [this.handShield],
             scaleX: this.handShield.startScale,
             scaleY: this.handShield.startScale,
             duration: durMut * 320,
             ease: 'Quart.easeIn',
             onComplete: () => {
                 playSound('stomp');
                 this.handShield.play('handShieldFull');
                 this.handShield.setScale(3);
                 this.handShield.once('animationcomplete', () => {
                     this.handShield.setScale(1);
                     this.handShield.setFrame('handshield10.png');
                 });
                 this.handShieldBack.setScale(1.9);
                 this.handShieldBack.visible = true;
                 this.handShieldBack.setAlpha(1);
                 this.addTween({
                     targets: [this.handShieldBack],
                     duration: durMut * 1300,
                     alpha: 0,
                     scaleX: this.handShieldBack.startScale,
                     scaleY: this.handShieldBack.startScale,
                     ease: 'Quad.easeOut',
                     onComplete: () => {
                         this.addTween({
                             targets: [this.handShield],
                             duration: durMut * 500,
                             alpha: 0.9,
                         });
                     }
                 });
             }
         });
         this.addTween({
             targets: [this.handShield],
             duration: durMut * 300,
             alpha: 1,
         });
     }

     clearHandShield(forceAnimate = false) {
        this.shieldText.setVisible(false);
        if (this.shieldAmts === 0 && !forceAnimate) {
            // already cleared perhaps
            return;
        }
        this.handShield.setFrame('handshieldbroke.png');
        this.handShield.setScale(1.7).setAlpha(1);
         this.addTween({
             targets: this.handShield,
             scaleX: 1.9,
             scaleY: 1.9,
             ease: 'Cubic.easeOut',
             duration: 250,
         })
        this.addTween({
            targets: this.handShield,
            alpha: 0,
            duration: 600,
        });
         this.shieldAmts = 0;
     }

     damageHandShield() {
         this.shieldAmts--;
         if (this.shieldAmts <= 0) {
             messageBus.publish('animateBlockNum', gameConsts.halfWidth, this.sprite.y + 50, '-BROKE-', 1.2, {y: "+=5", ease: 'Quart.easeOut'}, {alpha: 0, scaleX: 1.25, scaleY: 1.25, ease: 'Back.easeOut'});
             this.clearHandShield(true);
         } else {
             messageBus.publish('animateBlockNum', gameConsts.halfWidth + 75 - Math.random() * 150, this.sprite.y + 50 - Math.random() * 100, 'NEGATED', 0.70, {alpha: 0.7}, {alpha: 0});
            this.handShield.play('handShieldFast');
             this.handShield.setScale(3);
             this.handShield.once('animationcomplete', () => {
                 if (this.shieldAmts <= 2) {
                     this.handShield.setScale(1.6);
                     this.handShield.setFrame('handshieldbroke.png');
                 } else {
                     this.handShield.setScale(1);
                     this.handShield.setFrame('handshield10.png');
                 }
             });
         }
         this.shieldText.setText(this.shieldAmts);
     }



     die() {
         super.die();
         if (this.breathTween) {
             this.breathTween.stop();
         }
         this.bgBlur.currAnim.stop();
         this.clearHandObjects();
         this.fadeOutCurrentHand();
         this.clearHandShield();
         if (this.currentPowerHand) {
             this.currentPowerHand.destroy();
         }
         this.storedHeal = 0;
         this.extraAttackDamage = 0;
         this.healFromAttacks = false;
         if (this.spellAbsorber) {
             this.spellAbsorber.unsubscribe();
             this.spellAbsorber = null;
         }
         globalObjects.encyclopedia.hideButton();
         globalObjects.options.hideButton();
         globalObjects.magicCircle.disableMovement();
         setTimeout(() => {
             globalObjects.bannerTextManager.closeBanner();
         }, 0);
         this.bgMain.setFrame('star_shatter.png').setAlpha(1);

         this.glassBG = this.addImage(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'glass_break.png').setOrigin(0.5, 0.5).setAlpha(1).setDepth(1000).setBlendMode(Phaser.BlendModes.ADD).setScale(1.333);
         this.glassBG2 = this.addImage(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'glass_break.png').setOrigin(0.5, 0.5).setAlpha(1).setDepth(0).setBlendMode(Phaser.BlendModes.MULTIPLY).setScale(1.333);
         this.bgBlur.destroy();
         this.addTween({
             targets: this.bgMain,
             scaleX: 1.03,
             scaleY: 1.03,
             duration: 50,
             ease: 'Quart.easeOut',
             onComplete: () => {
                 this.addTween({
                     targets: this.bgMain,
                     scaleX: 1,
                     scaleY: 1,
                     duration: 250,
                     ease: 'Quart.easeOut'
                 })
             }
         })
         this.addTween({
             targets: [this.glassBG, this.glassBG2],
             scaleX: 1.37,
             scaleY: 1.37,
             duration: 50,
             ease: 'Quart.easeOut',
             onComplete: () => {
                 this.addTween({
                     targets: [this.glassBG, this.glassBG2],
                     scaleX: 1.333,
                     scaleY: 1.333,
                     duration: 250,
                     ease: 'Quart.easeOut',
                     onComplete: () => {

                     }
                 })
             }
         })
         this.addTween({
             targets: [this.bgMain],
             alpha: 0.9,
             duration: 750,
             ease: 'Cubic.easeOut'
         })
         this.addTween({
             targets: [this.glassBG],
             alpha: 0.15,
             duration: 500,
             ease: 'Quart.easeOut'
         })
         this.addTween({
             targets: [this.glassBG2],
             alpha: 0.4,
             duration: 750,
             ease: 'Cubic.easeOut'
         })

         this.fallAnim();
         fadeAwaySound(this.bgMusic);
     }

     fallAnim() {
         this.sprite.setRotation(-0.07);
         let deathFallTemp = this.addImage(this.sprite.x, this.y + 30, "deathfinal", 'death2fall.png').setScale(0.58).setAlpha(0).setDepth(this.sprite.depth);
         this.addTween({
             delay: 1300,
             targets: this.sprite,
             duration: 2200,
             rotation: -0.08,
             scaleX: this.sprite.startScale * 0.9,
             scaleY: this.sprite.startScale * 0.9,
             y: this.y + 25,
             ease: "Cubic.easeIn",
             onStart: () => {
                 this.addTween({
                     delay: 1500,
                     targets: this.sprite,
                     ease: 'Quint.easeIn',
                     duration: 500,
                     alpha: 0,
                 })
                 this.addTween({
                     delay: 1800,
                     targets: deathFallTemp,
                     duration: 600,
                     alpha: 1,
                 })
             },
             onComplete: () => {
                 this.addTween({
                     targets: deathFallTemp,
                     duration: 2000,
                     scaleX: 0.62,
                     scaleY: 0.62,
                     ease: "Cubic.easeInOut",
                     onStart: () => {
                         this.addTween({
                             targets: [this.bgMain, this.glassBG, this.glassBG2],
                             alpha: 0,
                             duration: 1000,
                             onComplete: () => {
                                 this.bgMain.destroy();
                                 this.glassBG.destroy();
                                 this.glassBG2.destroy();
                             }
                         })
                         playSound("whoosh");
                     }
                 })
             }
         })
     }

     createPokePower() {
         this.currentPowerHand = this.addImage(gameConsts.halfWidth, this.y - 50, 'deathfinal', 'poke_glow.png').setAlpha(0).setScale(0.7);
         this.currentPowerText = this.addBitmapText(gameConsts.halfWidth, this.currentPowerHand.y - 35, 'damage', "DMG\n+0", 34, 1).setAlpha(0).setDepth(50).setOrigin(0.5, 0.5);
         this.addTween({
             targets: this.currentPowerText,
             alpha: 1,
             scaleX: 1.25,
             scaleY: 1.25,
             duration: 500,
             ease: 'Cubic.easeIn',
             onComplete: () => {
                 this.addTween({
                     targets: [this.currentPowerText],
                     alpha: 0.75,
                     scaleX: 0.95,
                     scaleY: 0.95,
                     duration: 300,
                     ease: 'Cubic.easeOut',
                 })
             }
         });
         this.addTween({
             targets: [this.currentPowerHand],
             alpha: 1,
             scaleX: 2,
             scaleY: 2,
             duration: 500,
             ease: 'Cubic.easeIn',
             onComplete: () => {
                 this.addTween({
                     targets: [this.currentPowerHand],
                     alpha: 0.35,
                     duration: 300,
                     ease: 'Cubic.easeOut',
                 })
             }
         })
     }

     addExtraDamage() {
         if (this.attackToStrengthen !== undefined) {
             this.extraAttackDamage++;

             let hitEffect = getTempPoolObject('blurry', 'pulser.png', 'pulser', 700);
             hitEffect.setPosition(this.currentPowerText.x, this.currentPowerText.y).setDepth(50).setScale(2).setVisible(true).setAlpha(0.05);
             this.addTween({
                 targets: hitEffect,
                 scaleX: 0,
                 scaleY: 0,
                 ease: 'Cubic.easeIn',
                 duration: 700,
             });
             this.addTween({
                 targets: hitEffect,
                 alpha: 1,
                 duration: 450,
                 ease: "Quad.easeIn",
                 onComplete: () => {
                     this.addTween({
                         delay: 100,
                         targets: hitEffect,
                         alpha: 0,
                         ease: 'Quad.easeOut',
                         duration: 150,
                     });
                 }
             });

             this.currentPowerText.setAlpha(1.05).setScale(1.1 + this.extraAttackDamage * 0.024);
             this.currentPowerText.setText("DMG\n+" + this.extraAttackDamage);
             playSound('time_strike').detune = this.extraAttackDamage * 50;
             this.addTween({
                 targets: [this.currentPowerText],
                 alpha: 0.8,
                 scaleX: 0.9 + this.extraAttackDamage * 0.02,
                 scaleY: 0.9 + this.extraAttackDamage * 0.02,
                 duration: 300,
                 ease: 'Back.easeOut',
             })
             let damageAmt = this.attackToStrengthenStartDmg + this.extraAttackDamage;
             if (this.attackToStrengthen === 0) {
                 this.attackName.setText(";"+damageAmt+"+#2");
             } else if (this.attackToStrengthen === 2) {
                 this.attackName.setText("$"+damageAmt);
             } else if (this.attackToStrengthen === 3) {
                 if (damageAmt > 6) {
                     this.attackName.setScale(1.4);
                     this.addTween({
                         targets: this.attackName,
                         duration: 400,
                         alpha: 1,
                         scaleX: 1,
                         scaleY: 1,
                         ease: "Cubic.easeOut"
                     })
                     if (damageAmt === 7) {
                         playSound('enemy_attack_major');
                     }
                     this.attackName.setText(";"+damageAmt+"x4");
                 } else {
                     this.attackName.setScale(1.3);
                     this.addTween({
                         targets: this.attackName,
                         duration: 300,
                         scaleX: 1,
                         scaleY: 1,
                         ease: "Cubic.easeOut"
                     })
                     if (damageAmt == 5) {
                         playSound('enemy_attack');
                     }
                     this.attackName.setText("|"+damageAmt+"x4");
                 }
             }
         }

     }

     clearExtraAttackDamage() {
         this.extraAttackDamage = 0;
         if (this.currentPowerText) {
             this.addTween({
                 targets: [this.currentPowerText],
                 alpha: 0,
                 scaleX: 0.9,
                 scaleY: 0.9,
                 duration: 350,
                 onComplete: () => {
                     this.currentPowerText.destroy();
                 }
             })
         }
     }


     clearPower() {
         console.log("clear power");
         let currentPowerText = this.currentPowerText;
         let currentPowerHand = this.currentPowerHand;
         if (currentPowerText && currentPowerText.currAnim) {
             currentPowerText.currAnim.stop()
         }
         if (this.currentPowerExtra) {
             let currentPowerExtra = this.currentPowerExtra;
             if (this.currentPowerExtra.currAnim) {
                 this.currentPowerExtra.currAnim.stop();
             }
             this.addTween({
                 targets: this.currentPowerExtra,
                 alpha: 0,
                 scaleX: 0.5,
                 scaleY: 0.5,
                 duration: 500,
                 onComplete: () => {
                     currentPowerExtra.destroy();
                 }
             });
         }
         if (currentPowerText) {
             this.addTween({
                 targets: [currentPowerText],
                 alpha: 0,
                 scaleX: 0.5,
                 scaleY: 0.5,
                 duration: 500,
                 ease: 'Cubic.easeIn',
                 onComplete: () => {
                     if (currentPowerText) {
                         currentPowerText.destroy();
                     }
                 }
             });
         }

         if (currentPowerHand) {
             this.addTween({
                 targets: [currentPowerHand],
                 alpha: 0,
                 scaleX: 0.5,
                 scaleY: 0.5,
                 duration: 500,
                 ease: 'Cubic.easeIn',
                 onComplete: () => {
                     currentPowerHand.destroy();
                 }
             });
         }
     }

     createOkayPower() {
         this.currentPowerHand = this.addImage(gameConsts.halfWidth + 35, this.y - 55, 'deathfinal', 'okay_glow.png').setAlpha(0).setScale(0.7);
         this.currentPowerText = this.addBitmapText(gameConsts.halfWidth, this.currentPowerHand.y - 35, 'heal', "", 34, 1).setAlpha(0).setDepth(50).setOrigin(0.5, 0.5);
         this.currentPowerText.startY = this.currentPowerText.y;
         this.currentPowerExtra = this.addImage(gameConsts.halfWidth, this.y + 10, 'blurry', 'green_star.webp').setAlpha(0).setRotation(Math.PI * 0.25);
         this.addTween({
             targets: this.currentPowerText,
             alpha: 1,
             scaleX: 1.25,
             scaleY: 1.25,
             duration: 500,
             ease: 'Cubic.easeIn',
             onComplete: () => {
                 this.addTween({
                     targets: [this.currentPowerText],
                     alpha: 0.75,
                     scaleX: 0.95,
                     scaleY: 0.95,
                     duration: 300,
                     ease: 'Cubic.easeOut',
                 })
             }
         });
         this.addTween({
             targets: [this.currentPowerExtra],
             alpha: 0.5,
             scaleX: 3.5,
             scaleY: 3.5,
             duration: 500,
             ease: 'Cubic.easeIn',
             onComplete: () => {
                 this.addTween({
                     targets: [this.currentPowerExtra],
                     alpha: 0.05,
                     scaleX: 1.85,
                     scaleY: 1.85,
                     duration: 1500,
                     onComplete: () => {
                         this.currentPowerExtra.currAnim = this.addTween({
                             targets: [this.currentPowerExtra],
                             alpha: 0.35,
                             duration: 1000,
                             ease: 'Cubic.easeInOut',
                             yoyo: true,
                             repeat: -1
                         })
                     }
                 })
             }
         })
         this.addTween({
             targets: [this.currentPowerHand],
             alpha: 1,
             scaleX: 1.3,
             scaleY: 1.3,
             duration: 500,
             ease: 'Cubic.easeIn',
             onComplete: () => {
                 this.addTween({
                     targets: [this.currentPowerHand],
                     alpha: 0.45,
                     duration: 300,
                     ease: 'Cubic.easeOut',
                 })
             }
         })
     }

     addExtraHeal() {
         this.storedHeal += 10;
         this.currentPowerText.setText("+" + this.storedHeal).setScale(1.25).setAlpha(1);
         this.currentPowerText.y = this.currentPowerText.startY;

         if (this.currentPowerText.currAnim) {
             this.currentPowerText.currAnim.stop();
         }
         this.currentPowerText.currAnim = this.addTween({
             targets: [this.currentPowerText],
             alpha: 0.75,
             scaleX: 0.9,
             scaleY: 0.9,
             duration: 1200,
             ease: 'Quint.easeOut',
             onComplete: () => {
                 this.currentPowerText.currAnim = this.addTween({
                     targets: [this.currentPowerText],
                     alpha: 0.5,
                     scaleX: 1.1,
                     scaleY: 1.1,
                     y: "+=30",
                     duration: 500,
                     ease: 'Quint.easeIn',
                     onComplete: () => {
                         this.currentPowerText.setText("");
                         this.heal(this.storedHeal, 0.45 + Math.sqrt(this.storedHeal) * 0.12);
                         playSound('magic', 0.75);
                         messageBus.publish('animateHealNum', this.x, this.y + 20, '+' + this.storedHeal, 0.5 + Math.sqrt(this.storedHeal) * 0.15);
                         if (!this.healSprite) {
                             this.healSprite = this.addImage(gameConsts.halfWidth, this.y - 20, 'misc', 'heal.png').setScale(1).setDepth(999).setAlpha(1);
                         }
                         this.healSprite.setAlpha(1).setPosition(gameConsts.halfWidth, this.y - 20).setScale(Math.random() < 0.5 ? -1 : 1, 1);
                         this.scene.tweens.add({
                             targets: this.healSprite,
                             y: "-=30",
                             duration: 1000,
                         });
                         this.scene.tweens.add({
                             targets: this.healSprite,
                             alpha: 0,
                             duration: 1000,
                             ease: 'Cubic.easeIn',
                         });
                         this.storedHeal = 0;
                     }
                 });
             }
         })
         let healCircle = getTempPoolObject('blurry', 'pulser_green.png', 'pulsergreen', 800);
         healCircle.setPosition(this.currentPowerText.x, this.currentPowerText.y).setDepth(50).setScale(0.6).setVisible(true).setAlpha(0.05);
         this.addTween({
             targets: healCircle,
             alpha: 1,
             ease: 'Cubic.easeOut',
             duration: 100,
             onComplete: () => {
                 this.addTween({
                     targets: healCircle,
                     alpha: 0,
                     duration: 700,
                 });
             }
         });
         this.addTween({
             targets: healCircle,
             scaleX: 3,
             scaleY: 3,
             ease: 'Cubic.easeOut',
             duration: 800,
         });

     }

     createClawPower() {
         console.log("claw power");
         this.currentPowerHand = this.addImage(gameConsts.halfWidth, this.y - 50, 'deathfinal', 'claw_glow.png').setAlpha(0).setScale(0.7);
         this.addTween({
             targets: [this.currentPowerHand],
             alpha: 1,
             scaleX: 2,
             scaleY: 2,
             duration: 500,
             ease: 'Cubic.easeIn',
             onComplete: () => {
                 this.addTween({
                     targets: [this.currentPowerHand],
                     alpha: 0.35,
                     duration: 300,
                     ease: 'Cubic.easeOut',
                 })
             }
         })
     }

     createGlowHands() {
        let hand1 = this.addImage(this.x, this.spellStartY, 'deathfinal', 'palm_glow.png');
        let hand2 = this.addImage(this.x, this.spellStartY, 'deathfinal', 'poke_glow.png');
        let hand3 = this.addImage(this.x, this.spellStartY, 'deathfinal', 'okay_glow.png');
        let hand4 = this.addImage(this.x, this.spellStartY, 'deathfinal', 'claw_glow.png');
        hand1.outerRot = 0;
        hand2.outerRot = Math.PI * -0.5;
        hand3.outerRot = -Math.PI;
        hand4.outerRot = Math.PI * -1.5;
        this.glowHands.push(hand1); this.glowHands.push(hand2); this.glowHands.push(hand3); this.glowHands.push(hand4);
        for (let i in this.glowHands) {
            this.glowHands[i].setAlpha(0).setDepth(3).setScale(0.7);
        }
        this.glowHands[3].setScale(1);
    }
    pulseSpellCircle(isFast) {
        this.spellCirclePulse.setScale(0.5);
        this.addTween({
            delay: 100,
            targets: this.spellCirclePulse,
            scaleX: 4.2,
            scaleY: 4.2,
            ease: 'Cubic.easeOut',
            duration: 1400,
        });
        this.addTween({
            targets: [this.spellCirclePulse],
            alpha: 1,
            ease: 'Quart.easeOut',
            duration: isFast ? 500 : 550,
            onComplete: () => {
                this.addTween({
                    targets: this.spellCirclePulse,
                    alpha: 0,
                    duration: 1000,
                })
            }
        })
    }
    rotateSpellCircleTo(idx, isFast = true, onCompleteFunc) {
         let startRot = 0;
         let goalRot = 0;
         this.addTween({
             targets: this.bgMain,
             alpha: 0.5,
             ease: "Quad.easeOut",
             duration: 1100
         })
        this.fadeMainBG(false);
        this.spellCircleGlow.setScale(1);
        this.spellCircle.setScale(0.5);
        this.pulseSpellCircle(isFast);
        this.addTween({
            targets: this.spellCircleGlow,
            scaleX: 3,
            scaleY: 3,
            ease: 'Cubic.easeInOut',
            duration: isFast ? 600 : 700,
        });

        this.addTween({
            targets: this.spellCircle,
            scaleX: 1.5,
            scaleY: 1.5,
            ease: 'Cubic.easeInOut',
            duration: isFast ? 600 : 700,
        });
        setTimeout(() => {
            playSound('ringknell');
        }, 100)
        this.addTween({
            targets: [this.spellCircle, this.spellCircleGlow],
            alpha: 1,
            ease: 'Quart.easeOut',
            duration: isFast ? 500 : 550,
            onComplete: () => {
                this.addTween({
                    targets: [this.spellCircle, this.spellCircleGlow],
                    alpha: 0.85,
                    duration: 1500,
                })
            }
        })
        this.addTween({
            targets: this.glowHands,
            alpha: 0.8,
            ease: 'Cubic.easeInOut',
            duration: isFast ? 400 : 500,
        })
         switch(idx) {
             case 0:
                 startRot = 0;
                 goalRot = Math.PI;
                 // palm
                 break;
             case 1:
                 // poke
                 startRot = Math.PI * 0.5;
                 goalRot = Math.PI * 1.5;
                 break;
             case 2:
                 // ok
                 startRot = Math.PI;
                 goalRot = Math.PI * 2;
                 break;
             case 3:
                 // claw
                 startRot = Math.PI * -0.5;
                 goalRot = Math.PI * 0.5;
                 break;
         }
        this.spellCircle.rotation = startRot;

        this.addTween({
            targets: [this.spellCircle, this.spellCircleGlow],
            rotation: "+=3.14159",
            ease: 'Quart.easeInOut',
            duration: isFast ? 2400 : 2700,
            onUpdate: () => {
                let handDist = this.spellCircle.scaleX * 166
                for (let i = 0; i < this.glowHands.length; i++) {
                    let hand = this.glowHands[i];
                    let goalRot = hand.outerRot + this.spellCircle.rotation;
                    hand.x = this.spellCircle.x + Math.sin(goalRot) * handDist;
                    hand.y = this.spellCircle.y - Math.cos(goalRot) * handDist;
                }
            },
            onComplete: () => {
                this.addTween({
                    targets: this.glowHands,
                    alpha: 0,
                    ease: 'Quad.easeOut',
                    duration: 600
                });
                this.addTween({
                    targets: [this.spellCircle, this.spellCircleGlow],
                    ease: 'Cubic.easeOut',
                    alpha: 0,
                    duration: 600
                });
                let handToUse = this.glowHands[idx];
                this.currentHandGlow.setFrame(handToUse.frame.name).setAlpha(0).setScale(handToUse.scaleX + 0.02).setPosition(handToUse.x, handToUse.y - 2);
                this.currentHandGlow.setAlpha(1.2);
                this.currentHandGlowPulse.setFrame(handToUse.frame.name).setScale(handToUse.scaleX + 0.02).setPosition(handToUse.x, handToUse.y - 2).setAlpha(0.7);
                // let goalX = idx % 2 == 0 ? this.x - 200 : this.x + 200;
                // let goalY = (idx == 1 || idx == 2) ? this.y - 50 : this.y + 30;
                this.addTween({
                    targets: this.currentHandGlowPulse,
                    ease: 'Cubic.easeOut',
                    scaleX: handToUse.scaleX + 0.2,
                    scaleY: handToUse.scaleX + 0.2,
                    alpha: 0,
                    duration: 450,
                });
                this.addTween({
                    targets: this.currentHandGlow,
                    ease: 'Cubic.easeIn',
                    x: this.x,
                    y: this.y,
                    scaleX: 0.25,
                    scaleY: 0.25,
                    alpha: 0,
                    duration: 900,
                });
                this.currentHandGlow.alpha = 1;
                this.addDelay(() => {
                    this.fadeMainBG(true);
                    if (onCompleteFunc) {
                        onCompleteFunc();
                    }
                }, 500);
                this.currentHandGlow.currAnim = this.addTween({
                    targets: this.currentHandGlow,
                    alpha: 0,
                    ease: 'Quad.easeOut',
                    duration: 900,
                });
            }
        })
    }
}
