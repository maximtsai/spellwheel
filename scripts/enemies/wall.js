 class Wall extends Enemy {
     constructor(scene, x, y) {
         super(scene, x, y);
         this.initSprite('wall_1.png', 0.80);
         this.shieldAdded = false;
     }

     initStatsCustom() {
         this.health = 1000;
         this.pullbackScale = 0.9999;
         this.attackScale = 1;
     }

     // update(dt) {}

     // reset(x, y) {
     //     this.x = x;
     //     this.y = y;
     // }

     setHealth(newHealth) {
         super.setHealth(newHealth);
         let prevHealthPercent = this.prevHealth / this.healthMax;
         let currHealthPercent = this.health / this.healthMax;
         if (currHealthPercent == 0) {
             // dead, can't do anything
             return;
         }
         if (currHealthPercent < 0.9999 && this.isAsleep) {
             this.setAwake();
         }

     }

     initAttacks() {
         this.attacks = [
             [
                 // 0
                 {
                     name: " STARE... ",
                     desc: "A pair of eyes watch you",
                     chargeAmt: 1200,
                     damage: -1,
                     attackFinishFunction: () => {
                         this.currentAttackSetIndex = 1;
                         this.nextAttackIndex = 0;
                     }
                 },
             ],
             [
                 // 1
                 {
                     name: "CRUMBLE ;40",
                     chargeAmt: 1200,
                     damage: 40,
                     chargeMult: 1.5,
                     isBigMove: true,
                     attackFinishFunction: () => {
                         this.currentAttackSetIndex = 0;
                         this.nextAttackIndex = 0;
                     }
                 },
             ],
             [
                 // 2
                 {
                     name: "TOPPLE ;60",
                     chargeAmt: 1200,
                     damage: 60,
                     chargeMult: 1.5,
                     isBigMove: true,

                     attackFinishFunction: () => {
                         this.currentAttackSetIndex = 0;
                         this.nextAttackIndex = 0;
                     }
                 },
             ],
             [
                 // 3
                 {
                     name: "FALL ;100",
                     chargeAmt: 1200,
                     damage: 100,
                     chargeMult: 1.5,
                     isBigMove: true,

                     attackFinishFunction: () => {
                         this.currentAttackSetIndex = 0;
                         this.nextAttackIndex = 0;
                     }
                 },
             ],
             [
                 // 4
                 {
                     name: "}1",
                     chargeAmt: 400,
                     damage: 1,
                     chargeMult: 2,
                     attackFinishFunction: () => {
                         this.currentAttackSetIndex = 3;
                         this.nextAttackIndex = 0;
                     }
                 },
             ]
         ];
     }

     die() {
         if (this.currAnim) {
             this.currAnim.stop();
         }
         this.setDefaultSprite('wall_dead.png')
         this.bgMusic.stop();
     }

}
