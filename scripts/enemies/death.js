 class Death extends Enemy {
     constructor(scene, x, y) {
         super(scene, x, y);
         this.initSprite('blurryball.png', 0.7);
        this.sprite.setOrigin(0.5, 0.4);
        swirlInReaperFog(1.25);
        this.setupCustomDeathSprite();
        setTimeout(() => {
             this.setAsleep();
         }, 10)
     }

     initStatsCustom() {
         this.health = 666;
     }

     // update(dt) {}

     // reset(x, y) {
     //     this.x = x;
     //     this.y = y;
     // }

     repeatTweenBreathe(duration = 1500, magnitude = 1) {
         if (this.breatheTween) {
             this.breatheTween.stop();
         }
     }

     setupCustomDeathSprite() {
        this.floatingDeath = getFloatingDeath();
        // this.floatingDeath1 = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 300, 'enemies', 'max_death_1a.png').setDepth(1).setScale(0.3).setAlpha(0);
        // this.floatingDeath2 = PhaserScene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 300, 'enemies', 'max_death_1b.png').setDepth(1).setScale(0.3).setAlpha(0);
        // this.floatingDeath1.fakeAlpha = 0;
        // this.floatingDeath2.fakeAlpha = 0;
        // this.deathBreathe();
        repeatDeathHandsRotate();
        startDeathFlutterAnim();
        tweenFloatingDeath(0.667, 1, 1800, "Cubic.easeOut", () => {
            globalObjects.bannerTextManager.setDialog(["THUS COMES THE END.", "UNFORTUNATE, BUT YOUR JOURNEY\nWAS NEVER MEANT TO BE.", "FAREWELL."]);
            globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight + 10, 0);
            globalObjects.bannerTextManager.showBanner(true);
            globalObjects.bannerTextManager.setOnFinishFunc(() => {
                this.setAwake();
            })
        });
     }

/*
     deathBreathe() {
        if (this.flutterAnim) {
            this.flutterAnim.stop();
        }

        this.flutterAnim = PhaserScene.tweens.add({
            targets: this.floatingDeath2,
            alpha: this.floatingDeath2.fakeAlpha,
            duration: 500,
            ease: 'Cubic.easeIn',
            onComplete: () => {
                this.flutterAnim = PhaserScene.tweens.add({
                    targets: this.floatingDeath1,
                    alpha: 0,
                    duration: 500,
                    ease: 'Cubic.easeOut',
                    completeDelay: 700,
                    onComplete: () => {
                        this.floatingDeath2.setDepth(this.floatingDeath1.depth - 1);
                        this.flutterAnim = PhaserScene.tweens.add({
                            targets: this.floatingDeath1,
                            alpha: this.floatingDeath1.fakeAlpha,
                            duration: 500,
                            ease: 'Cubic.easeIn',
                            onComplete: () => {
                                this.flutterAnim = PhaserScene.tweens.add({
                                    targets: this.floatingDeath2,
                                    alpha: 0,
                                    duration: 500,
                                    ease: 'Cubic.easeOut',
                                    completeDelay: 700,
                                    onComplete: () => {
                                        this.floatingDeath2.setDepth(this.floatingDeath1.depth + 1);
                                        this.deathBreathe();
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });

     }
*/



     setHealth(newHealth) {
        messageBus.publish('animateBlockNum', gameConsts.halfWidth, this.sprite.y + 50, 'IMMATERIAL', 0.8, {y: "+=5", ease: 'Quart.easeOut'}, {alpha: 0, scaleX: 1.4, scaleY: 1.4});

         // super.setHealth(newHealth);
         // let prevHealthPercent = this.prevHealth / this.healthMax;
         // let currHealthPercent = this.health / this.healthMax;
         // if (currHealthPercent == 0) {
         //     // dead, can't do anything
         //     return;
         // }
     }

     initAttacks() {
         this.attacks = [
             [
                 {
                     name: ";4444",
                     chargeAmt: 600,
                     chargeMult: 1.1,
                     damage: -1,
                     isBigMove: true,
                     attackStartFunction: () => {
                         this.isPulsing = false;
                     },
                 },
             ]
         ];

         // this.attacks = [
         //     [
         //         {
         //             name: "REAP }44x4",
         //             chargeAmt: 300,
         //             damage: 44,
         //             attackTimes: 4
         //         },
         //         {
         //             name: "EXECUTE }66",
         //             chargeAmt: 300,
         //             chargeMult: 5,
         //             damage: 66,
         //         }
         //     ]
         // ];
     }

}
