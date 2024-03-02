 class Goblin extends Enemy {
     constructor(scene, x, y) {
         super(scene, x, y);
         this.initSprite('gobbo0.png', 0.56);
         this.shieldAdded = false;
     }

     initStatsCustom() {
         this.health = 100;
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
         if (prevHealthPercent >= 0.98) {
             if (currHealthPercent < 0.98) {
                 this.currentAttackSetIndex = 2;
                 this.nextAttackIndex = 0;
                 // Going to shield
             }
         }
         if (this.shieldAdded && this.currentAttackSetIndex == 3) {
             if (this.shield == 0) {
                 // shield must have broke
                 this.setSprite('gobbo2.png', 0.56);
                 this.interruptCurrentAttack();
                 this.currentAttackSetIndex = 4;
                 this.nextAttackIndex = 0;
             }
         }
     }

     initAttacks() {
         this.attacks = [
             [
                 // 0
                 {
                     name: "NERVOUS POKE }5 ",
                     chargeAmt: 300,
                     damage: 5,
                     function: () => {
                         if (this.currentAttackSetIndex === 0) {
                             this.currentAttackSetIndex = 1;
                             this.nextAttackIndex = 0;
                         }
                     }
                 }
             ],
             [
                 // 1
                 {
                     name: "CAUTIOUS STAB }5",
                     chargeAmt: 180,
                     damage: 5
                 },
                 {
                     name: "HASTY STAB }6",
                     chargeAmt: 240,
                     damage: 6
                 },
             ],
             [
                 // 2
                 {
                     name: "PREPARING SHIELD {40",
                     block: 40,
                     chargeAmt: 250,
                     function: () => {
                         this.setSprite('gobbo1.png', 0.56);
                         this.currentAttackSetIndex = 3;
                         this.nextAttackIndex = 0;
                         this.shieldAdded = true;
                     }
                 }
             ],
             [
                 // 3 - attacks from behind shield
                 {
                     name: "SHIELD BASH }10",
                     chargeAmt: 400,
                     damage: 10
                 },
             ],
             [
                 // 4
                 {
                     name: "TAKING OUT KNIVES (uh oh!)",
                     chargeAmt: 400,
                     chargeMult: 5,
                     function: () => {
                         this.currentAttackSetIndex = 5;
                         this.nextAttackIndex = 0;
                         this.setSprite('gobbo3.png', 0.56);
                     }
                 }
             ],
             [
                 // 5 - dual wield attacks
                 {
                     name: "MULTI STAB }5x2",
                     chargeAmt: 120,
                     damage: 5,
                     attackTimes: 2
                 },
                 {
                     name: "MULTI STAB }5x3",
                     chargeAmt: 140,
                     damage: 5,
                     attackTimes: 3
                 },
                 {
                     name: "MULTI STAB }5x4",
                     chargeAmt: 160,
                     damage: 5,
                     attackTimes: 4
                 },
                 {
                     name: "MULTI STAB }5x5",
                     chargeAmt: 180,
                     damage: 5,
                     attackTimes: 5
                 },
                 {
                     name: "SPIT IN YOUR FACE }2",
                     chargeAmt: 200,
                     chargeMult: 5,
                     damage: 2,
                     tease: true
                 }
             ],
         ];
     }

}
