 class Death2Plus extends Enemy {
     constructor(scene, x, y) {
         super(scene, x, y);
         this.initSprite('death2final.png', 0.93, 0, 0, 'deathfinal');
         this.bgMusic = playMusic('but_never_forgotten_metal', 0.9, true);
         this.bgtemp = this.addImage(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'star.png').setDepth(-5);
         this.addTimeout(() => {
             this.setAsleep();
             this.repeatTweenBreathe()
             this.beginBattleAnim();
         }, 10)
     }

     initStatsCustom() {
         this.health = 110;
         this.handObjects = [];
         this.shieldScale = 1.5;
         this.shieldOffsetY = 40;
         this.shieldTextOffsetY = -65;
     }

     beginBattleAnim() {
         this.setAwake();
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


     setHealth(newHealth) {
        // messageBus.publish('animateBlockNum', gameConsts.halfWidth, this.sprite.y + 50, 'IMMATERIAL', 0.8, {y: "+=5", ease: 'Quart.easeOut'}, {alpha: 0, scaleX: 1.1, scaleY: 1.1});

         super.setHealth(newHealth);
         let currHealthPercent = this.health / this.healthMax;
         if (currHealthPercent == 0) {
             // dead, can't do anything
             return;
         } else {
             let prevHealthPercent = this.prevHealth / this.healthMax;
             if (this.health <= 99 && this.prevHealth > 99) {
                 this.emergencyShield();
                 globalObjects.bannerTextManager.setDialog([getLangText('deathFight2plusz'), getLangText('deathFight2plusz2')]);
                 globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.halfHeight + 10, 0);
                 globalObjects.bannerTextManager.showBanner(0);
                 globalObjects.bannerTextManager.setOnFinishFunc(() => {
                     this.setAwake();
                 })
             }
         }
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
         messageBus.publish("enemyAddShield", 999);
         this.currentAttackSetIndex = 1;
         this.nextAttackIndex = 0;
         this.setAsleep();
     }

     initAttacks() {
         this.attacks = [
             [
                 {
                     name: "|30",
                     chargeAmt: 600,
                     chargeMult: 2,
                     finishDelay: 3000,
                     damage: -1,
                     isBigMove: true,
                     attackStartFunction: () => {

                     },
                     finaleFunction: () => {
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

     die() {
         super.die();
         if (this.breathTween) {
             this.breathTween.stop();
         }
         this.clearHandObjects();
         globalObjects.encyclopedia.hideButton();
         globalObjects.options.hideButton();
         globalObjects.magicCircle.disableMovement();
         this.fallAnim();
         fadeAwaySound(this.bgMusic);
     }

     fallAnim() {
         this.bgtemp.setAlpha(0.5);
         this.sprite.setRotation(-0.07);
         let deathFallTemp = this.addImage(this.sprite.x, this.y + 30, "deathfinal", 'death2fall.png').setScale(0.58).setAlpha(0).setDepth(this.sprite.depth);
         this.addTween({
             delay: 1000,
             targets: this.sprite,
             duration: 1000,
             rotation: -0.08,
             scaleX: this.sprite.startScale * 0.9,
             scaleY: this.sprite.startScale * 0.9,
             y: this.y + 25,
             ease: "Cubic.easeIn",
             onStart: () => {
                 this.addTween({
                     targets: this.bgtemp,
                     duration: 2000,
                     alpha: 0,
                 })
                 this.addTween({
                     delay: 500,
                     targets: this.sprite,
                     ease: 'Quint.easeIn',
                     duration: 500,
                     alpha: 0,
                 })
                 this.addTween({
                     delay: 800,
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
                         playSound("whoosh");
                     }
                 })
             }
         })
     }
}
