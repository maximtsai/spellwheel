 class Wall extends Enemy {
     constructor(scene, x, y) {
         super(scene, x, y);
         this.initSprite('wall_1.png', 0.80);
         this.shieldAdded = false;
         this.initBird();
     }

     initStatsCustom() {
         this.health = 1000;
         this.pullbackScale = 0.9999;
         this.attackScale = 1;
         this.isAsleep = true;
     }

     initBird() {
         this.bird = this.scene.add.sprite(this.x - 335 * this.sprite.startScale, this.y - 223 * this.sprite.startScale, 'enemies', 'bird_1.png').setAlpha(0).setDepth(10).setScale(this.sprite.startScale);
         this.addToDestructibles(this.bird);
         PhaserScene.tweens.add({
             targets: [this.bird],
             alpha: 1,
             ease: 'Quad.easeIn',
             duration: 800,
         });
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
         if (currHealthPercent < 0.9999 && this.isAsleep && !this.isStarting) {
             this.isStarting = true;
             this.setDefaultSprite('wall_2.png');
             this.openEyes();
             this.birdFalls();
         }
     }

     openEyes() {
         this.eyes1 = this.scene.add.sprite(this.x + 5 * this.sprite.startScale, this.y - 10 * this.sprite.startScale, 'enemies', 'wall_eyes_2.png').setDepth(8).setScale(this.sprite.startScale, this.sprite.startScale * 0.1).setVisible(false);
         this.addExtraSprite(this.eyes1);


         PhaserScene.tweens.add({
             delay: 250,
             targets: [this.eyes1],
             scaleY: this.sprite.startScale * 0.25,
             duration: 55,
             ease: 'Back.easeOut',
             completeDelay: 700,
             onStart: () => {
                 this.eyes1.setVisible(true);
             },
             onComplete: () => {
                 PhaserScene.tweens.add({
                     targets: [this.eyes1],
                     scaleY: this.sprite.startScale * 1.1,
                     duration: 900,
                     ease: 'Back.easeIn',
                     completeDelay: 200,
                     onComplete: () => {
                         PhaserScene.tweens.add({
                             targets: [this.eyes1],
                             scaleY: this.sprite.startScale,
                             duration: 300,
                             ease: 'Cubic.easeInOut',
                             onComplete: () => {
                                 this.setAwake();
                             }
                         });
                     }
                 });
             }
         });
     }

     birdFalls() {
         PhaserScene.tweens.add({
             targets: [this.bird],
             x: "+=90",
             rotation: "+=5.9",
             duration: 1150,
         });
         PhaserScene.tweens.add({
             targets: [this.bird],
             y: "+=140",
             duration: 1150,
             ease: 'Back.easeIn',
             onComplete: () => {
                 this.bird.setFrame('bird_2.png')
                 this.bird.setRotation(0.4);
                 PhaserScene.tweens.add({
                     targets: [this.bird],
                     y: -40,
                     duration: 1000,
                     easeParams: [1.4],
                     ease: 'Back.easeIn',
                 });
                 PhaserScene.tweens.add({
                     targets: [this.bird],
                     x: "+=400",
                     rotation: 0,
                     duration: 1000,
                     ease: 'Quad.easeIn',
                 });
             }
         });
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
