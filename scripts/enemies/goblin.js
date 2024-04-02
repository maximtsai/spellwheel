 class Goblin extends Enemy {
     constructor(scene, x, y, level) {
         super(scene, x, y, level);
         this.initSprite('gobbo0.png', 0.75);
         this.shieldAdded = false;

         // ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MIND, RUNE_MIND, null, null, null , RUNE_MATTER];

     }

     initStatsCustom() {
         this.health = gameVars.isHardMode ? 110 : 90;
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
         if (prevHealthPercent >= 0.99) {
             if (currHealthPercent < 0.99) {
                 this.currentAttackSetIndex = 1;
                 this.nextAttackIndex = 0;
                 // Going to shield
             }
         }
         if (this.shieldAdded && this.currentAttackSetIndex == 2) {
             if (this.shield == 0) {
                 // shield must have broke
                 this.setDefaultSprite('gobbo2.png', 0.75);
                 this.interruptCurrentAttack();
                 this.currentAttackSetIndex = 3;
                 this.nextAttackIndex = 0;
             }
         }
     }

     initAttacks() {
         this.attacks = [
             [
                 // 0
                 {
                     name: gameVars.isHardMode ? "}8 " : "}5 ",
                     desc: "The goblin waves his\nlittle knife in front\nof your face",
                     chargeAmt: 250,
                     damage: gameVars.isHardMode ? 8 : 5,
                     attackSprites: ['gobbo0_atk.png']
                 }
             ],
             [
                 // 1
                 {
                     name: gameVars.isHardMode ? "READYING FANCY SHIELD {50 " : "READYING FANCY SHIELD {40 ",
                     desc: "The goblin hoists his\ntrusty shield (which\nwas definitely not stolen)",
                     block: gameVars.isHardMode ? 50 : 40,
                     chargeAmt: 180,
                     attackFinishFunction: () => {
                         this.setDefaultSprite('gobbo1.png', 0.75);
                         this.currentAttackSetIndex = 2;
                         this.nextAttackIndex = 0;
                         this.shieldAdded = true;
                     }
                 }
             ],
             [
                 // 2 - attacks from behind shield
                 {
                     name: gameVars.isHardMode ? "}12 " : "}10 ",
                     desc: "Goblin rams you with\nhis shield",
                     chargeAmt: 400,
                     damage: gameVars.isHardMode ? 12 : 10
                 },
             ],
             [
                 // 3
                 {
                     name: "REALIZING SHIELD IS BROKEN",
                     desc: "Goblin rams you with\nhis shield",
                     chargeAmt: gameVars.isHardMode ? 180 : 200,
                     chargeMult: 2,
                     damage: 0
                 },
                 {
                     name: "TAKING OUT KNIVES (uh oh!)",
                     chargeAmt: gameVars.isHardMode ? 225 : 250,
                     chargeMult: 5,
                     startFunction: () => {
                         this.setDefaultSprite('gobbo3.png', 0.75);
                     },
                     attackFinishFunction: () => {
                         this.currentAttackSetIndex = 4;
                         this.nextAttackIndex = 0;
                         this.setDefaultSprite('gobbo4.png', 0.75);
                         let oldScale = this.sprite.scaleX;
                         this.sprite.setScale(this.sprite.scaleX * 1.01);
                         this.currAnim = PhaserScene.tweens.add({
                             targets: this.sprite,
                             scaleX: oldScale,
                             scaleY: oldScale,
                             duration: 600,
                             completeDelay: 100,
                             onComplete: () => {
                                 this.setDefaultSprite('gobbo5.png', 0.75);
                             }
                         });
                     }
                 }
             ],
             [
                 // 4 - dual wield attacks
                 {
                     name: "}5x2 ",
                     chargeAmt: gameVars.isHardMode ? 100 : 150,
                     damage: 5,
                     attackTimes: 2,
                     attackSprites: ['gobboAttack1.png', 'gobboAttack2.png']
                 },
                 {
                     name: "}5x3 ",
                     chargeAmt: gameVars.isHardMode ? 110 : 160,
                     damage: 5,
                     attackTimes: 3,
                     attackSprites: ['gobboAttack1.png', 'gobboAttack2.png']
                 },
                 {
                     name: "}5x4 ",
                     chargeAmt: gameVars.isHardMode ? 120 : 170,
                     damage: 5,
                     attackTimes: 4,
                     attackSprites: ['gobboAttack1.png', 'gobboAttack2.png']
                 },
                 {
                     name: "}5x5 ",
                     chargeAmt: gameVars.isHardMode ? 130 : 180,
                     damage: 5,
                     attackTimes: 5,
                     attackSprites: ['gobboAttack1.png', 'gobboAttack2.png']
                 },
                 {
                     name: "LAUGH IN YOUR FACE",
                     chargeAmt: 200,
                     chargeMult: 5,
                     damage: -1,
                     tease: true,
                     attackSprites: ['gobbo4.png']
                 }
             ],
         ];
     }

}
