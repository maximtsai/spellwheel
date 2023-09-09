 class Death extends Enemy {
     constructor(scene, x, y) {
         super(scene, x, y);
         this.initSprite('max_death_3.png', 0.55);
         this.shieldAdded = false;
     }

     initStatsCustom() {
         this.health = 333;
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
     }

     initAttacks() {
         this.attacks = [
             [
                 {
                     name: "Let me tell you a story",
                     chargeAmt: 100,
                     chargeMult: 1.1,
                     damage: 0,
                 },
                 {
                     name: "About a greedy man who wanted everything.",
                     chargeAmt: 120,
                     chargeMult: 1.1,
                     damage: 0,
                 },
                 {
                     name: "Fame, wealth, admiration,",
                     chargeAmt: 100,
                     chargeMult: 1.1,
                     damage: 0,
                 },
                 {
                     name: "And of course...",
                     chargeAmt: 50,
                     chargeMult: 1.1,
                     damage: 0,
                 },
                 {
                     name: "Immortality.",
                     chargeAmt: 150,
                     chargeMult: 1.1,
                     damage: 0,
                 }
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
