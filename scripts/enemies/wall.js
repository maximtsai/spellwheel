 class Wall extends Enemy {
     constructor(scene, x, y) {
         super(scene, x, y);
         this.initSprite('wall.png', 0.62);
         this.shieldAdded = false;
     }

     initStatsCustom() {
         this.health = 3000;
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
                 // 0
                 {
                     name: "CRUSH }50 ",
                     chargeAmt: 1500,
                     damage: 50,
                 }
             ]
         ];
     }

}
