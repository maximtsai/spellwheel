 class Water extends Enemy {
     constructor(scene, x, y, level) {
         super(scene, x, y, level);
         this.initSprite('water_elemental.png', 1);
         this.bgMusic = playMusic('echos_of_time', 0.8, true);

         // ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MIND, RUNE_MIND, null, null, null , RUNE_MATTER];

         this.popupTimeout = this.addTimeout(() => {
             this.tutorialButton = createTutorialBtn(this.level);
             this.addToDestructibles(this.tutorialButton);
         }, 3000)
         // this.addSubscription("clearMindBurn", this.clearMindBurn.bind(this))
         // this.addSubscription("enemyOnFire", this.setOnFire.bind(this))

     }

     initStatsCustom() {
         this.health = gameVars.isHardMode ? 140 : 120;
        // this.pullbackScale = 1;
        // this.attackScale = 1;
         this.attackEase = "Quart.easeIn";
         this.accumulatedAnimDamage = 0;
         this.setDefense(999);
     }

     takeEffect(newEffect) {
         if (this.sprite) {
            if (newEffect.name === 'mindStrike' && !this.dead) {
                this.sprite.stop();
                this.isAnimating = false;
                 // let oldSprite = this.sprite.frame.name;
                 // if (oldSprite === 'gobbo_elec.png') {
                 //     oldSprite = this.defaultSprite;
                 // } else if (this.isUsingAttack) {
                 //     oldSprite = this.defaultSprite;
                 // }
                 this.setSprite('water_elec.png');

                 this.sprite.x = gameConsts.halfWidth + (Math.random() < 0.5 ? -13 : 13);
                 this.sprite.play('waterelec')
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
            }
            // else if (newEffect.name === 'mindBurn') {
            //     this.sprite.stop();
            //     this.isAnimating = false;
            //     this.burnAnim = this.sprite.play('gobboshieldfire');
            //     this.isBurning = true;
            // }
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
         if (this.prevHealth > 80) {
             if (this.health <= 80) {
                 this.currentAttackSetIndex = 1;
                 this.nextAttackIndex = 0;
                 // Going to shield
             }
         }
     }

     initAttacks() {
         this.attacks = [
             [
                 // 0
                 {
                     name: "STARE",
                     chargeAmt: 300,
                     isPassive: true,
                     startFunction: () => {
                         this.showEnergyTut();
                     }
                 },
                 {
                     name: "}10 ",
                     chargeAmt: gameVars.isHardMode ? 400 : 450,
                     damage: 10,
                     prepareSprite: "",
                     attackSprites: ['gobboAttack1.png', 'gobboAttack2.png'],
                     attackFinishFunction: () => {
                         this.makeSlashEffect();
                     }
                 },
             ],
             [
                 // 1
                 {
                     name: "}4x2 ",
                     chargeAmt: gameVars.isHardMode ? 150 : 200,
                     damage: 4,
                     attackTimes: 2,
                     prepareSprite: "",
                     attackSprites: ['gobboAttack1.png', 'gobboAttack2.png'],
                     attackFinishFunction: () => {
                         this.makeSlashEffect();
                     }
                 },
                 {
                     name: "}4x3 ",
                     chargeAmt: gameVars.isHardMode ? 170 : 220,
                     damage: 4,
                     attackTimes: 3,
                     attackSprites: ['gobboAttack1.png', 'gobboAttack2.png'],
                     attackFinishFunction: () => {
                         this.makeSlashEffect();
                     }
                 },
             ],
         ];
     }

     showEnergyTut() {
         this.addDelay(() => {
             this.shownTut = true;
             globalObjects.textPopupManager.setInfoText(gameConsts.width, gameConsts.halfHeight - 150, getLangText("energy_tut_goblin"), 'right');
             let runeYPos = globalObjects.textPopupManager.getBoxBottomPos();
             let centerXPos = globalObjects.textPopupManager.getCenterPos();
             let runeDepth = globalObjects.bannerTextManager.getDepth() + 1;
             this.rune3 = this.addImage(centerXPos - 32, runeYPos + 17, 'circle', 'bright_rune_mind.png').setDepth(runeDepth).setScale(0.78, 0.78).setAlpha(0);
             this.rune4 = this.addImage(centerXPos + 38, runeYPos + 17, 'circle', 'bright_rune_enhance.png').setDepth(runeDepth).setScale(0.78, 0.78).setAlpha(0);
             messageBus.publish("closeCombatText")
             this.addTween({
                 targets: [this.rune3, this.rune4],
                 scaleX: 1,
                 scaleY: 1,
                 ease: 'Quart.easeOut',
                 duration: 500,
                 onComplete: () => {
                     this.addTween({
                         targets: [this.rune3, this.rune4],
                         scaleX: 0.8,
                         scaleY: 0.8,
                         ease: 'Back.easeOut',
                         duration: 300,
                     });
                 }
             });
             this.addTween({
                 targets: [this.rune3, this.rune4],
                 alpha: 1,
                 duration: 200,
                 completeDelay: 1000,
                 onComplete: () => {
                     this.playerSpellCastSub = this.addSubscription('playerCastedSpell', () => {
                         this.playerSpellCastSub.unsubscribe();
                         this.addTimeout(() => {
                             this.addTween({
                                 targets: [this.rune3, this.rune4],
                                 alpha: 0,
                                 duration: 300,
                                 onComplete: () => {
                                     this.rune3.visible = false;
                                     this.rune4.visible = false;
                                 }
                             });
                             globalObjects.textPopupManager.hideInfoText();
                         }, 300);
                     });
                 }
             });
         }, 1000)
     }

     initSpriteAnim(scale) {
         this.sprite.startX = this.sprite.x;
         this.sprite.scaleX = 1.5;
         this.sprite.scaleY = 0.1;
         playSound('water1');

         this.addTween({
             targets: this.sprite,
             duration: 500,
             scaleY: 1.25,
             alpha: 1,
             ease: 'Cubic.easeOut',
             onComplete: () => {
                 this.addTween({
                     targets: this.sprite,
                     duration: 500,
                     scaleX: 0.9,
                     scaleY: 0.9,
                     ease: 'Back.easeOut',
                     onComplete: () => {
                         this.repeatTweenBreathe();
                     }
                 });
             }
         });
         this.addTween({
             targets: this.sprite,
             duration: 500,
             scaleX: 0.8,
             ease: 'Cubic.easeOut',
             onComplete: () => {
                 playSound('water2');

             }
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

        if (this.rune3) {
            this.rune3.visible = false;
            this.rune4.visible = false;
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
                            duration: 1500,
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
