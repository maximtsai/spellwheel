 class Death2 extends Enemy {
     constructor(scene, x, y) {
         super(scene, x, y);
         this.initSprite('max_death_2.png', 0.9, 0, 0, 'deathfinal');
         this.whiteBG = this.addImage(gameConsts.halfWidth, gameConsts.halfHeight, 'whitePixel').setScale(500).setAlpha(0.5);
         this.createAnimatedHellBG();
         this.addTween({
            targets: this.whiteBG,
            alpha: 0,
            duration: 2000,
            onComplete: () => {
                this.whiteBG.destroy();
            }
         })
        setTimeout(() => {
             this.setAsleep();
         }, 10)
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

    initStatsCustom() {
        this.health = 666;
        this.fistObjects = [];
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
