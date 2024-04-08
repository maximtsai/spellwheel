 class Tree extends Enemy {
     constructor(scene, x, y, level) {
         super(scene, x, y, level);
         this.initSprite('tree.png', 0.7);// 0.7
         this.sprite.setOrigin(0.52, 0.9); // 0.9
         this.shieldAdded = false;

     }

     initStatsCustom() {
         this.health = gameVars.isHardMode ? 300 : 250;
         this.isAsleep = true;
         this.leafObjects = [];
         this.pullbackScale = 0.99;
         this.attackScale = 1.03;

         //
         // this.bg1 =  this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'firebg1.png').setDepth(-2);
         // this.bg2 =  this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'firebg2.png').setDepth(-2).setAlpha(0);
         // this.fadeInBg(this.bg2, 'firebg2.png', () => {
         //     this.bg1.alpha = 0;
         //     this.bg2.depth = -2;
         //     this.fadeInBg(this.bg1, 'firebg3.png', () => {
         //         this.bg2.alpha = 0;
         //         this.bg1.depth = -2;
         //         this.fadeInBg(this.bg2, 'firebg2.png', () => {
         //             this.bg1.alpha = 0;
         //             this.bg2.depth = -2;
         //             this.fadeInBg(this.bg1, 'firebg1.png', () => {
         //                 this.bg2.alpha = 0;
         //                 this.bg1.depth = -2;
         //                 this.fadeInBg(this.bg2, 'firebg2.png', () => {
         //                     this.bg1.alpha = 0;
         //                     this.bg2.depth = -2;
         //                     this.fadeInBg(this.bg1, 'firebg3.png', () => {
         //                         this.bg2.alpha = 0;
         //                         this.bg1.depth = -2;
         //                         this.fadeInBg(this.bg1, 'firebg2.png', () => {})
         //                     })
         //                 })
         //             })
         //         })
         //     })
         // })

     }

     // fadeInBg(img, name, onComplete) {
     //     img.setFrame(name).setDepth(-1);
     //     PhaserScene.tweens.add({
     //         targets: img,
     //         alpha: 1,
     //         duration: 1200,
     //         ease: 'Quad.easeInOut',
     //         completeDelay: 0,
     //         onComplete: () => {
     //             onComplete();
     //         }
     //     });
     // }

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
         if (this.isAsleep) {
             if (this.breatheTween) {
                 this.breatheTween.stop();
                 this.sprite.setScale(this.sprite.startScale);
             }
             this.isAsleep = false;
             let eyePosX = this.x + 129 * this.sprite.startScale;
             let eyePosY = this.y - 94 * this.sprite.startScale;
             let eye = this.scene.add.sprite(eyePosX, eyePosY, 'enemies', 'tree_eye.png').setDepth(9).setOrigin(0.5, 0.5).setRotation(-0.13).setScale(0, this.sprite.startScale);
             this.eyeMagic1 = this.scene.add.sprite(this.x + 4, this.y - 69, 'enemies', 'glowSpike.png').setDepth(999).setRotation(1.57).setOrigin(0.5, 1).setScale(0.7, 0.5);
             this.eyeMagic2 = this.scene.add.sprite(this.x + 4, this.y - 69, 'enemies', 'glowSpike.png').setDepth(999).setRotation(1.57 + 3.1415).setOrigin(0.5, 1).setScale(0.7, 0.5);
             this.eyeMagic1.alpha = 0;
             this.eyeMagic2.alpha = 0;
             this.addToDestructibles(this.eyeMagic1);
             this.addToDestructibles(this.eyeMagic2);


             this.addExtraSprite(eye, 3.5, -84)
             PhaserScene.tweens.add({
                 targets: eye,
                 scaleX: this.sprite.startScale * 0.6,
                 ease: "Back.easeOut",
                 easeParams: [1.5],
                 rotation: -0.08,
                 duration: 450,
                 onComplete: () => {
                     PhaserScene.tweens.add({
                         delay: 500,
                         targets: eye,
                         rotation: 0,
                         scaleX: this.sprite.startScale * 1.2,
                         ease: "Cubic.easeIn",
                         duration: 350,
                         onComplete: () => {
                             PhaserScene.tweens.add({
                                 targets: eye,
                                 scaleX: this.sprite.startScale,
                                 ease: "Cubic.easeOut",
                                 duration: 300,
                                 onComplete: () => {
                                     this.setDefaultSprite('tree_open.png', this.sprite.startScale);
                                     this.removeExtraSprite(eye);
                                     eye.destroy();
                                 }
                             });
                         }
                     });
                 }
             });
         }
         if (prevHealthPercent >= 0.5 && !this.hasCrushed) {
             if (currHealthPercent < 0.5) {
                 this.hasCrushed = true;
                 this.currentAttackSetIndex = 3;
                 this.nextAttackIndex = 0;
                 this.pullbackScale = 0.98;
                 this.attackScale = 1.1;
                 // Going to shield
             }
         } else if (prevHealthPercent >= 0.2 && !this.hasTimbered) {
             if (currHealthPercent < 0.2) {
                 this.hasTimbered = true;
                 this.currentAttackSetIndex = 4;
                 this.nextAttackIndex = 0;
             }
         }
     }

     initSpriteAnim(scale) {
         this.sprite.setScale(scale * 0.99, scale * 1.02);
         this.scene.tweens.add({
             targets: this.sprite,
             duration: 1500,
             scaleX: scale,
             scaleY: scale,
             ease: 'Cubic.easeOut',
             alpha: 1,
             onComplete: () => {
                 this.repeatTweenBreathe()
             }
         });
         this.scene.tweens.add({
             targets: this.sprite,
             duration: 1000,
             alpha: 1
         });
     }

     repeatTweenBreathe(duration = 2500) {
         this.breatheTween = this.scene.tweens.add({
             targets: this.sprite,
             duration: duration,
             scaleY: "+=0.01",
             ease: 'Quart.easeOut',
             onComplete: () => {
                 this.scene.tweens.add({
                     targets: this.sprite,
                     duration: duration * 0.8,
                     scaleY: "-=0.01",
                     ease: 'Cubic.easeInOut',
                     onComplete: () => {
                         this.repeatTweenBreathe()
                     }
                 });
             }
         });
     }

     heal(amt) {
         this.health = Math.min(this.healthMax, this.health + amt);
        this.updateHealthBar(true);
     }

     startHealing(amt = 10) {
         if (!this.statuses[0]) {
             let healSprite = this.scene.add.sprite(gameConsts.halfWidth, this.y - 70, 'misc', 'heal.png').setDepth(999).setAlpha(0);
             let statusObj = {};
             statusObj = {
                 animObj: healSprite,
                 amt: amt,
                 duration: 1001,
                 onUpdate: () => {
                     let canHeal = statusObj.duration % 6 == 0;
                     if (canHeal) {
                         if (statusObj.amt <= 0) {
                             statusObj.cleanUp();
                             return;
                         }
                         this.heal(statusObj.amt);
                         this.healText.setText("+" + statusObj.amt)
                         statusObj.amt -= 1;
                         this.healText.alpha = 1;
                         this.healText.y = this.healText.startY;
                         PhaserScene.tweens.add({
                             targets: this.healText,
                             scaleX: 1,
                             scaleY: 1,
                             y: "-=13",
                             ease: 'Quart.easeOut',
                             duration: 3000,
                         });
                         PhaserScene.tweens.add({
                             delay: 2500,
                             targets: this.healText,
                             alpha: 0,
                             ease: 'Quad.easeIn',
                             duration: 1000,
                         });

                         healSprite.alpha = 1;
                         healSprite.y = this.y - 85;
                         healSprite.scaleX = healSprite.scaleX * -1

                         PhaserScene.tweens.add({
                             targets: healSprite,
                             y: "-=50",
                             duration: 1200,
                         });
                         PhaserScene.tweens.add({
                             delay: 200,
                             targets: healSprite,
                             alpha: 0,
                             ease: 'Quad.easeIn',
                             duration: 1000,
                         });

                     }
                 },
                 cleanUp: () => {
                     healSprite.destroy();
                     this.statuses[0] = null;
                 }
             }
             this.statuses[0] = statusObj;
         }
     }

     stopHealing() {
         if (this.statuses[0]) {
             this.statuses[0].cleanUp();
             this.statuses[0] = null;
         }
     }

     createLeafObject(name, x, y, delay = 0) {
         let newObj = PhaserScene.add.sprite(x, y, 'enemies', name).setRotation((Math.random() - 0.5) * 3).setScale(0).setDepth(110);
         this.leafObjects.push(newObj);
         let xDist = gameConsts.halfWidth - x;
         let yDist = globalObjects.player.getY() - 175 - y;
         let angleToPlayer = Math.atan2(yDist, xDist) - 1.57;
         this.scene.tweens.add({
             delay: delay,
             targets: newObj,
             scaleX: 1,
             scaleY: 1,
             ease: 'Back.easeOut',
             easeParams: [2],
             duration: 300
         });
         this.scene.tweens.add({
             delay: delay,
             targets: newObj,
             ease: 'Cubic.easeOut',
             rotation: angleToPlayer,
             duration: 500
         });

     }

     fireObjects(damage = 10) {
         let totalObjects = this.leafObjects.length;
         let projDur = 550 - Math.floor(Math.sqrt(totalObjects) * 50);
         let leafObjectsFired = 0;
         while (this.leafObjects.length > 0) {
             let currObj = this.leafObjects.shift();
             let delayAmt = leafObjectsFired * 100;
             this.scene.tweens.add({
                 delay: delayAmt,
                 targets: currObj,
                 scaleX: 0.85,
                 scaleY: 1.2,
                 ease: 'Cubic.easeIn',
                 duration: projDur,
             });
             leafObjectsFired++;
             this.scene.tweens.add({
                 targets: currObj,
                 delay: delayAmt,
                 y: globalObjects.player.getY() - 190,
                 x: gameConsts.halfWidth * 0.9 + currObj.x * 0.1,
                 ease: 'Quad.easeIn',
                 duration: projDur,
                 onStart: () => {
                     currObj.setScale(1);
                 },
                 onComplete: () => {
                     currObj.destroy();
                     let dur = 280 - Math.sqrt(totalObjects) * 40;
                     let hitEffect = PhaserScene.add.sprite(currObj.x - 10 + Math.random() * 20, currObj.y + Math.random() * 8, 'spells', 'damageEffect4.png').setScale(0.95).setRotation(Math.random()).setDepth(195);
                     this.scene.tweens.add({
                         targets: hitEffect,
                         scaleX: 1,
                         scaleY: 1,
                         ease: 'Cubic.easeOut',
                         duration: dur,
                         onComplete: () => {
                             hitEffect.destroy();
                         }
                     });
                     this.scene.tweens.add({
                         targets: hitEffect,
                         alpha: 0,
                         duration: dur
                     });
                     messageBus.publish("selfTakeDamage", damage);
                 }
             });
         }
     }

     attackWithBranch(damage = 12) {
         let currObj;
         if (!this.treeBranch) {
             this.treeBranch = PhaserScene.add.sprite(gameConsts.halfWidth - 75 + Math.random() * 150, -50, 'enemies', 'tree_branch.webp').setRotation(-0.7 + Math.random()).setDepth(110).setOrigin(0.6, 0.6);
             this.addToDestructibles(this.treeBranch);
         } else {
             this.treeBranch.setPosition(gameConsts.halfWidth - 75 + Math.random() * 150, -50).setRotation(-0.7 + Math.random()).setAlpha(1);
         }
         currObj = this.treeBranch;

         this.scene.tweens.add({
             targets: currObj,
             rotation: -0.2,
             duration: 700
         });

         this.scene.tweens.add({
             targets: currObj,
             x: gameConsts.halfWidth * 0.2 + currObj.x * 0.8,
             y: gameConsts.height - 320,
             ease: 'Quad.easeIn',
             duration: 700,
             onComplete: () => {
                 messageBus.publish("selfTakeDamage", damage);
                 let xPos = gameConsts.halfWidth * 0.5 + currObj.x * 0.5;
                 let hitEffect = PhaserScene.add.sprite(xPos, currObj.y + Math.random() * 8, 'spells').play('damageEffect').setRotation((Math.random() - 0.5) * 3).setScale(0.95).setDepth(195);
                 this.scene.tweens.add({
                     targets: hitEffect,
                     scaleX: 0.7,
                     scaleY: 0.7,
                     ease: 'Cubic.easeOut',
                     duration: 150,
                     onComplete: () => {
                         hitEffect.destroy();
                     }
                 });
                 this.scene.tweens.add({
                     targets: hitEffect,
                     alpha: 0,
                     duration: 150
                 });
                 let horizShift = currObj.x - gameConsts.halfWidth;
                 this.scene.tweens.add({
                     targets: currObj,
                     alpha: 0,
                     x: "+=" + horizShift * 4,
                     rotation: horizShift * 0.05,
                     duration: 600,
                 });
                 this.scene.tweens.add({
                     targets: currObj,
                     y: "-=120",
                     duration: 600,
                     ease: 'Cubic.easeOut',
                 });
             }
         });
     }

     playRegrowthAnim(regrowthAmt) {
         let healAmt = regrowthAmt - 1;
         this.startHealing(healAmt);
         this.healText = this.scene.add.text(gameConsts.halfWidth, 65, '+' + regrowthAmt, {fontFamily: 'Arial', fontSize: 48, color: '#00F254', align: 'left'})
         this.healText.setFontStyle('bold').setOrigin(0.5, 0.5).setDepth(9);
         this.healText.startY = this.healText.y;
         let healSprite = this.scene.add.sprite(gameConsts.halfWidth, this.y - 90, 'misc', 'heal.png').setScale(1.1).setDepth(999).setAlpha(0);
         this.heal(regrowthAmt);
         healSprite.alpha = 1;

         if (this.eyeMagicAnim) {
             this.eyeMagicAnim.stop();
         }

         this.eyeMagic1.setScale(1);
         this.eyeMagic2.setScale(1);
         PhaserScene.tweens.add({
             targets: [this.eyeMagic1, this.eyeMagic2],
             scaleX: 0.95,
             scaleY: 0.95,
             alpha: 1,
             ease: 'Cubic.easeOut',
             duration: 500,
             completeDelay: 600,
             onComplete: () => {
                 PhaserScene.tweens.add({
                     targets: [this.eyeMagic1, this.eyeMagic2],
                     scaleX: 0.8,
                     scaleY: 0.3,
                     ease: 'Quart.easeIn',
                     alpha: 0,
                     duration: 400,
                 });
             }
         });

         PhaserScene.tweens.add({
             targets: this.healText,
             scaleX: 1,
             scaleY: 1,
             y: "-=13",
             ease: 'Cubic.easeOut',
             duration: 3000,
         });
         PhaserScene.tweens.add({
             delay: 2500,
             targets: this.healText,
             alpha: 0,
             ease: 'Quad.easeIn',
             duration: 1000,
         });

         PhaserScene.tweens.add({
             targets: healSprite,
             scaleX: 1,
             scaleY: 1,
             y: "-=60",
             duration: 1300,
             onComplete: () => {
                 healSprite.destroy()
             }
         });
         PhaserScene.tweens.add({
             delay: 600,
             targets: healSprite,
             alpha: 0,
             ease: 'Quad.easeIn',
             duration: 700,
         });
     }

     initAttacks() {
         let regrowthAmt1 = gameVars.isHardMode ? 8 : 6;
         let regrowthAmt2 = gameVars.isHardMode ? 11 : 10;
         this.attacks = [
             [
                 // 0
                 {
                     name: "}12 ",
                     announceName: "BRANCH ATTACK",
                     desc: "The tree swipes a branch at you",
                     chargeAmt: 300,
                     damage: -1,
                     attackSprites: ['tree_open_glow.png'],
                     attackStartFunction: () => {
                         this.attackWithBranch(12);
                     },
                     attackFinishFunction: () => {
                         this.currentAttackSetIndex = 1;
                         this.nextAttackIndex = 0;
                     }
                 }
             ],
             [
                 // 1
                 {
                     name: "REGROWTH (+" + regrowthAmt1 + ")",
                     announceName: "REGROWTH (+" + regrowthAmt1 + ")",
                     desc: "The tree recovers its injuries over time",
                     chargeAmt: 500,
                     damage: -1,
                     attackStartFunction: () => {
                         this.eyeMagic1.setAlpha(0.2).setScale(0.8, 0.4);
                         this.eyeMagic2.setAlpha(0.2).setScale(0.8, 0.4);
                         this.eyeMagicAnim = PhaserScene.tweens.add({
                             targets: [this.eyeMagic1, this.eyeMagic2],
                             scaleX: 0.95,
                             scaleY: 0.92,
                             alpha: 1,
                             ease: 'Cubic.easeOut',
                             duration: 600,
                         });
                     },
                     attackFinishFunction: () => {
                         this.playRegrowthAnim(regrowthAmt1);

                         this.currentAttackSetIndex = 2;
                         this.nextAttackIndex = 0;
                     }
                 }
             ],
             [
                 // 2
                 {
                     name: "}12 ",
                     announceName: "BRANCH ATTACK",
                     desc: "The tree swipes a branch at you",
                     chargeAmt: 300,
                     damage: -1,
                     attackSprites: ['tree_open_glow.png'],
                     attackStartFunction: () => {
                         this.attackWithBranch(12);
                     }
                 },
                 {
                     name: "}4x5 ",
                     announceName: "LEAF SHOWER",
                     desc: "The tree showers you with sharp leaves",
                     chargeAmt: 600,
                     damage: 0,
                     attackSprites: ['tree_open_glow.png'],
                     attackFinishFunction: () => {
                         for (let i = 0; i < 5; i++) {
                             let xPos = gameConsts.halfWidth + -200 + i * 100;
                             let yPos = 75 + Math.random() * 40;
                             this.createLeafObject('tree_leaf.webp', xPos, yPos, i * 25);
                         }
                         setTimeout(() => {
                             this.fireObjects(4);
                         }, 300);
                     }
                 },
             ],
             [
                 // 3
                 {
                     name: "CRUSH}30 ",
                     announceName: "CRUSH",
                     desc: "The tree tries to crush you",
                     chargeAmt: 600,
                     damage: 30,
                     attackFinishFunction: () => {
                         this.pullbackScale = 0.99;
                         this.attackScale = 1.03;
                         let currHealthPercent = this.health / this.healthMax;
                         if (currHealthPercent >= 0.2) {
                             this.currentAttackSetIndex = 4;
                             this.nextAttackIndex = 0;
                         }
                     }
                 },
             ],
             [
                 // 4
                 {
                     name: "}14 ",
                     announceName: "HEAVY BRANCH ATTACK",
                     desc: "The tree swipes a branch at you",
                     chargeAmt: 300,
                     damage: -1,
                     attackSprites: ['tree_open_glow.png'],
                     attackStartFunction: () => {
                         this.attackWithBranch(14);
                     }
                 },
                 {
                     name: "}4x6 ",
                     announceName: "LEAF SHOWER",
                     desc: "The tree showers you with sharp leaves",
                     chargeAmt: 600,
                     damage: 0,
                     attackSprites: ['tree_open_glow.png'],
                     attackFinishFunction: () => {
                         for (let i = 0; i < 6; i++) {
                             let xPos = gameConsts.halfWidth + -200 + i * 80;
                             let yPos = 75 + Math.random() * 40;
                             this.createLeafObject('tree_leaf.webp', xPos, yPos, i * 25);
                         }
                         setTimeout(() => {
                             this.fireObjects(4);
                         }, 350);
                     }
                 },
             ],
             [
                 // 5
                 {
                     name: "TIMBER!!!}40 ",
                     announceName: "TIMBER!!!",
                     desc: "The tree tries to crush you",
                     chargeAmt: 900,
                     chargeMult: 2,
                     damage: 40,
                     attackFinishFunction: () => {
                         this.pullbackScale = 0.99;
                         this.attackScale = 1.01;
                         this.stopHealing();
                         this.currentAttackSetIndex = 6;
                         this.nextAttackIndex = 0;
                         let treeTop = this.scene.add.sprite(this.sprite.x, this.sprite.y, 'enemies', 'tree_top.png');
                         treeTop.setScale(this.sprite.scaleX, this.sprite.scaleY).setOrigin(this.sprite.originX, this.sprite.originY).setDepth(this.sprite.depth - 1);
                         this.setDefaultSprite('tree_stumped.png', this.sprite.startScale);
                         PhaserScene.tweens.add({
                             targets: treeTop,
                             alpha: 0,
                             scaleX: this.sprite.startScale + 0.1,
                             scaleY: this.sprite.startScale + 0.1,
                             duration: 1200,
                             onComplete: () => {
                                 treeTop.destroy();
                             }
                         });
                     }
                 },
             ],
             [
                 // 6
                 {
                     name: "STUMPED...",
                     desc: "The tree is stumped",
                     chargeAmt: 1000,
                     damage: 0,
                 },
                 {
                     name: "STILL STUMPED...",
                     desc: "The tree is still stumped",
                     chargeAmt: 1000,
                     damage: 0
                 },
             ],
         ];
     }
     die() {
         super.die();

         if (this.currAnim) {
             this.currAnim.stop();
         }

     }
}