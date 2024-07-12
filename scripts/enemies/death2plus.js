 class Death2Plus extends Enemy {
     constructor(scene, x, y) {
         super(scene, x, y);
         this.initSprite('death2final.png', 0.54, 0, 0, 'deathfinal');
         this.bgMusic = playMusic('heartbeat', 0.75, true);
         this.bgtemp = this.addImage(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'star.png').setDepth(-5);
         this.handTemp = this.addImage(gameConsts.halfWidth  + 150,gameConsts.halfHeight - 200, 'deathfinal', 'okay.png').setDepth(30);
         this.handTemp2 = this.addImage(gameConsts.halfWidth  - 150,gameConsts.halfHeight - 200, 'deathfinal', 'palm.png').setDepth(30);
        setTimeout(() => {
             this.setAsleep();
         }, 10)
     }

     initStatsCustom() {
         this.health = 700;
         this.fistObjects = [];
     }

     repeatTweenBreathe(duration = 1500, magnitude = 1) {
         if (this.breatheTween) {
             this.breatheTween.stop();
         }
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

             ]
         ];
     }

     die() {
         fadeAwaySound(this.bgMusic);

     }
}
