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
         this.nextBirdIndex = 0;
         this.eyes = [];
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
             this.initEye1();
             this.birdFalls();
         } else if (currHealthPercent < 0.8 && !this.firstCanCrumble) {
             this.firstCanCrumble = true;
             this.closeEyes(100, () => {
                 console.log("reopen");
                 this.reOpenEyes()
             });
         } else if (currHealthPercent < 0.6 && !this.secondCanCrumble) {
             this.secondCanCrumble = true;

             this.closeEyes(100, () => {
                 this.reOpenEyes()
             })
         } else if (currHealthPercent < 0.4 && !this.thirdCanCrumble) {
             this.thirdCanCrumble = true;
             this.closeEyes(100, () => {
                 this.reOpenEyes()
             })
         }
     }

     initEye1() {
         this.eyes1 = this.scene.add.sprite(this.x + 5 * this.sprite.startScale, this.y - 10 * this.sprite.startScale, 'enemies', 'wall_eyes_2.png').setDepth(8).setScale(this.sprite.startScale, this.sprite.startScale * 0.1).setVisible(false);
         this.addExtraSprite(this.eyes1);
         this.eyes.push(this.eyes1);


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

     closeEyes(duration = 1, onComplete) {
         PhaserScene.tweens.add({
             targets: this.eyes,
             scaleY: 0,
             ease: 'Quad.easeIn',
             duration: duration,
             onComplete: onComplete
         });
     }

     reOpenEyes(duration = 500) {
         PhaserScene.tweens.add({
             targets: this.eyes,
             scaleY: this.sprite.startScale,
             ease: 'Back.easeOut',
             duration: duration,
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

     throwWallChunk(spriteName, damage = 40) {
         this.closeEyes(400);

         let wallChunk = this.scene.add.sprite(this.x, this.y - 170, 'enemies', spriteName).setDepth(0).setScale(this.sprite.startScale);

         PhaserScene.tweens.add({
             delay: 550,
             targets: wallChunk,
             y: -250,
             ease: 'Quad.easeOut',
             duration: 500,
             onStart: () => {
                 setTimeout(() => {
                     playSound('matter_enhance', 0.75);
                 }, 80);
             },
             onComplete: () => {
                 wallChunk.setScale(1).setRotation(-0.5).setDepth(20);
                 PhaserScene.tweens.add({
                     targets: wallChunk,
                     rotation: 0,
                     duration: 800,
                     onComplete: () => {
                         PhaserScene.tweens.add({
                             delay: 500,
                             targets: wallChunk,
                             alpha: 0,
                             duration: 600,
                             onComplete: () => {
                                 this.reOpenEyes();
                                 wallChunk.destroy();
                             }
                         });
                     }
                 });
                 PhaserScene.tweens.add({
                     targets: wallChunk,
                     y: globalObjects.player.getY() - 210,
                     ease: 'Cubic.easeIn',
                     duration: 800,
                     onComplete: () => {
                         let hitEffect2 = PhaserScene.add.sprite(wallChunk.x, wallChunk.y, 'spells', 'rockCircle.png').setScale(0.2).setRotation(Math.random() * 6).setDepth(195);
                         let hitEffect = PhaserScene.add.sprite(wallChunk.x, wallChunk.y, 'spells', 'damageEffect4.png').setScale(0.95).setRotation(Math.random()).setDepth(195);

                         this.scene.tweens.add({
                             targets: hitEffect,
                             scaleX: 1,
                             scaleY: 1,
                             ease: 'Cubic.easeOut',
                             duration: 300,
                             onComplete: () => {
                                 hitEffect.destroy();
                             }
                         });
                         this.scene.tweens.add({
                             targets: hitEffect,
                             alpha: 0,
                             duration: 300
                         });
                         this.scene.tweens.add({
                             targets: hitEffect2,
                             alpha: 0,
                             scaleX: 0.75,
                             scaleY: 0.75,
                             duration: 500,
                             onComplete: () => {
                                 hitEffect2.destroy();
                             }
                         });
                         playSound('rock_crumble', 0.5);
                         messageBus.publish("selfTakeDamage", damage);

                     }
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
                     chargeAmt: 900,
                     damage: -1,
                     attackFinishFunction: () => {
                         this.nextAttackIndex = 0;
                         if (this.thirdCanCrumble && !this.thirdCrumbled) {
                             this.thirdCrumbled = true;
                             this.secondCrumbled = true;
                             this.firstCrumbled = true;
                             this.currentAttackSetIndex = 3;
                         } else if (this.secondCanCrumble && !this.secondCrumbled) {
                             this.secondCrumbled = true;
                             this.firstCrumbled = true;
                             this.currentAttackSetIndex = 2;
                         } else if (this.firstCanCrumble && !this.firstCrumbled) {
                             this.firstCrumbled = true;
                             this.currentAttackSetIndex = 1;
                         } else {
                             this.currentAttackSetIndex = 4;
                             this.nextAttackIndex = this.nextBirdIndex;
                         }
                     }
                 },
             ],
             [
                 // 1
                 {
                     name: "CRUMBLE ;40",
                     chargeAmt: 1200,
                     damage: -1,
                     chargeMult: 1.5,
                     isBigMove: true,
                     attackStartFunction: () => {
                         this.pullbackScale = 0.99;
                         this.attackScale = 1.04;
                         this.setDefaultSprite('wall_3.png');
                         this.throwWallChunk('wall_chunk.png');
                     },
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
                     damage: -1,
                     chargeMult: 1.5,
                     isBigMove: true,
                     attackStartFunction: () => {
                         this.setDefaultSprite('wall_4.png');
                         this.throwWallChunk('wall_chunk_2.png');
                     },
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
                     attackStartFunction: () => {
                         this.setDefaultSprite('wall_5.png');
                         this.throwWallChunk('wall_chunk_2.png');
                     },
                     attackFinishFunction: () => {
                         this.currentAttackSetIndex = 0;
                         this.nextAttackIndex = 0;
                     }
                 },
             ],
             [
                 // 4
                 {
                     name: "}2",
                     chargeAmt: 400,
                     damage: 2,
                     attackFinishFunction: () => {
                         this.currentAttackSetIndex = 0;
                         this.nextAttackIndex = 0;
                     }
                 },
                 {
                     name: "}4",
                     chargeAmt: 400,
                     damage: 4,
                     attackFinishFunction: () => {
                         this.currentAttackSetIndex = 0;
                         this.nextAttackIndex = 0;
                     }
                 },
                 {
                     name: "}2x3",
                     chargeAmt: 500,
                     damage: 2,
                     attackTimes: 3,
                     attackFinishFunction: () => {
                         this.currentAttackSetIndex = 0;
                         this.nextAttackIndex = 0;
                     }
                 },
                 {
                     name: "}4x3",
                     chargeAmt: 500,
                     damage: 4,
                     attackTimes: 3,
                     attackFinishFunction: () => {
                         this.currentAttackSetIndex = 0;
                         this.nextAttackIndex = 0;
                     }
                 },
                 {
                     name: "}2x6",
                     chargeAmt: 600,
                     damage: 2,
                     attackTimes: 6,
                     attackFinishFunction: () => {
                         this.currentAttackSetIndex = 0;
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
