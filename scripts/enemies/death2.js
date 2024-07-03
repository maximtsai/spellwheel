 class Death2 extends Enemy {
     constructor(scene, x, y) {
         super(scene, x, y);
         this.initSprite('max_death_2.png', 0.9, 0, 0, 'deathfinal');
         this.sprite.setOrigin(0.5, 0.25)
         this.whiteBG = this.addImage(gameConsts.halfWidth, gameConsts.halfHeight, 'whitePixel').setScale(500).setAlpha(0.5);
         this.createAnimatedHellBG();
         globalObjects.player.reInitStats();
         globalObjects.player.refreshHealthBar();

         this.addTween({
            targets: this.whiteBG,
            alpha: 0,
            duration: 2000,
            onComplete: () => {
                this.whiteBG.destroy();
            }
         })
        globalObjects.magicCircle.disableMovement();
        setTimeout(() => {
             this.setAsleep();
             this.introSpeech();
         }, 10)
     }

    introSpeech() {
        globalObjects.bannerTextManager.setDialog([getLangText('deathFight2a')]);
        globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight + 10, 0);
        globalObjects.bannerTextManager.showBanner(0);
        globalObjects.bannerTextManager.setOnFinishFunc(() => {
            this.setAwake();
            globalObjects.magicCircle.enableMovement();
        })
    }

    initStatsCustom() {
        this.health = 666;
        this.fistObjects = [];
        this.attackScale = 1.2;
        this.lastAttackLingerMult = 0.5;
        this.extraRepeatDelay = 450;
        this.pullbackHoldRatio = 0.5;
        this.attackSlownessMult = 1;
    }

     repeatTweenBreathe(duration = 1500, magnitude = 1) {
         if (this.breatheTween) {
             this.breatheTween.stop();
         }
     }


     setHealth(newHealth) {

         // super.setHealth(newHealth);
         let currHealthPercent = this.health / this.healthMax;
         if (currHealthPercent == 0) {
             // dead, can't do anything
             return;
         } else {
             let prevHealthPercent = this.prevHealth / this.healthMax;
             if (prevHealthPercent > 0.5 && currHealthPercent <= 0.5 && !this.thornForm) {
                 this.thornForm = true;
                 this.interruptCurrentAttack();
             }
         }
     }


    initAttacks() {
        this.attacks = [
            [
                {
                    name: "|8x2",
                    chargeAmt: 450,
                    damage: 8,
                    attackTimes: 2,
                    prepareSprite: ['death2windup.png', 'death2windupflip.png'],
                    attackSprites: ['death2punch.png', 'death2punchflip.png'],
                    startFunction: () => {
                    this.pullbackScale = 0.9;
                    this.attackScale = 1.2;
                    },
                    attackFinishFunction: () => {
                    // this.makeSlashEffect();
                    this.createPunchEffect();
                    },
                },
                {
                    name: "|4   ",
                    chargeAmt: 650,
                    chargeMult: 2,
                    damage: 4,
                    attackSprites: ['death2punch.png'],
                    startFunction: () => {
                        this.setDefaultSprite('death2punch.png');
                        this.addDelay(() => {
                            playSound('void_enhance', 0.5);
                            this.isPreppingFists = true;
                            this.prepareManyFists();
                        }, 500)
                    },
                    attackStartFunction: () => {
                        this.isPreppingFists = false;
                        this.launchFists();
                    },
                    attackFinishFunction: () => {
                        // this.makeSlashEffect();
                        this.setDefaultSprite('max_death_2.png');
                    },
                },

            ]
        ];
    }

    prepareManyFists() {
        if (!this.isPreppingFists) {
            return;
        }
        let xPos = this.x - 120 - this.fistObjects.length * 30; let yPos = this.y;
        let newFistObj = this.addImage(xPos, yPos, 'deathfinal', 'deathfist.png').setAlpha(0.1);
        this.addTween({
            targets: newFistObj,
            alpha: 0.6,
            scaleX: 0.3,
            scaleY: 0.3,
            duration: 400,
            ease: 'Cubic.easeIn'
        })
        this.fistObjects.push(newFistObj);
        let attackNum = this.fistObjects.length + 1;
        this.attackName.setText("}4x" + attackNum);
        this.addDelay(() => {
            prepareManyFists();
        }, 3000);
    }

    launchFists() {
        for (let i = 0; i < this.fistObjects; i++) {
            let fistObj = this.fistObjects[i];
        }
    }

    createPunchEffect() {
        let isSwingingLeft = this.sprite.attackNum % 2 == 0;
        playSound(isSwingingLeft ? 'punch' : 'punch2');
         let powEffect = getTempPoolObject('spells', 'damageEffect1.png', 'damageEffect1', 200);
         let xOffset = isSwingingLeft ? -30 : 30;
         powEffect.setPosition(gameConsts.halfWidth + xOffset, globalObjects.player.getY() - 170).setDepth(998).setScale(1.8);

         let fistEffect = getTempPoolObject('deathfinal', 'deathfist.png', 'fist', 300);
         let xOffset2 = isSwingingLeft ? -80 : 80;
         let leftMult = isSwingingLeft ? 1 : -1;
         fistEffect.setPosition(this.sprite.x + xOffset2, this.y + 10).setDepth(11).setScale(1.3 * leftMult, 1.3);
         this.addTween({
            delay: 50,
            targets: fistEffect,
            duration: 250,
            y: '-=5',
            scaleX: 0.95 * leftMult,
            scaleY: 0.95,
            ease: 'Cubic.easeOut'
         })
    }

    die() {
        fadeAwaySound(this.bgMusic);

    }

    createAnimatedHellBG() {
        this.bg1 = this.addImage(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'firebg1.png').setDepth(-5);
        this.bg2 = this.addImage(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'firebg2.png').setDepth(-5);
        this.nextBG = 0;
        this.useFirstBG = true;
        this.animateBGRepeat();
    }
    animateBGRepeat() {
        this.bg1.setDepth(-5); this.bg2.setDepth(-5);
        let bgToUse = this.useFirstBG ? this.bg1 : this.bg2;
        let newFrame = 'firebg' + this.nextBG + '.png';
        bgToUse.setFrame(newFrame);
        this.nextBG = (this.nextBG + 1) % 3;
        bgToUse.setAlpha(0).setDepth(-4);
        this.addTween({
            targets: bgToUse,
            duration: 2000,
            alpha: 1,
            onComplete: () => {
                this.useFirstBG = !this.useFirstBG;
                this.animateBGRepeat();
            } 
        })
    }
}
