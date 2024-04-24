 class Knight extends Enemy {
     constructor(scene, x, y, level) {
         super(scene, x, y, level);
         this.initSprite('void_knight.png', 1);// 0.7
         this.sprite.setOrigin(0.5, 0.5); // 0.9
         this.shieldAdded = false;
         this.initShields();
     }

     initStatsCustom() {
         this.health = gameVars.isHardMode ? 175 : 160;
         this.eyeObjects = [];
         this.pullbackScale = 0.92;
         this.attackScale = 1.11;
         this.isFirstMode = true;
         this.shieldAmts = 0;
         this.shieldsActive = 0;
         this.eyeShieldObjects = [];
         this.eyeUpdateTick = 30;
         this.slashEffect = this.scene.add.sprite(globalObjects.player.getX(), globalObjects.player.getY() - 25, 'misc', 'slash1.png').setScale(0.9).setDepth(130).setAlpha(0);
     }

     initShields() {
         this.voidShield1a = this.scene.add.sprite(this.sprite.x, this.sprite.y, 'enemies', 'void_knight_shield_1.png').setScale(0.5).setDepth(2).setAlpha(0);
         this.voidShield1b = this.scene.add.sprite(this.sprite.x, this.sprite.y, 'enemies', 'void_knight_shield_2.png').setScale(0.5).setDepth(2).setAlpha(0);
         this.voidShield1a.startScale = this.voidShield1a.scaleX;
         this.voidShield1b.startScale = this.voidShield1a.scaleX;

         this.voidShield2a = this.scene.add.sprite(this.sprite.x, this.sprite.y, 'enemies', 'void_knight_shield_1.png').setScale(0.58).setDepth(2).setAlpha(0);
         this.voidShield2b = this.scene.add.sprite(this.sprite.x, this.sprite.y, 'enemies', 'void_knight_shield_2.png').setScale(0.58).setDepth(2).setAlpha(0);
         this.voidShield2a.startScale = this.voidShield2a.scaleX;
         this.voidShield2b.startScale = this.voidShield2b.scaleX;

     }

     setHealth(newHealth, isTrue) {
         if (this.shieldAmts > 0 && !isTrue) {
             this.damageVoidShield();
             super.setHealth(this.health);
             return;
         } else {
             super.setHealth(newHealth);
         }
         let prevHealthPercent = this.prevHealth / this.healthMax;
         let currHealthPercent = this.health / this.healthMax;
         if (currHealthPercent == 0) {
             // dead, can't do anything
             return;
         }
     }

     createEyeObject(name, x, y, delay = 0) {
         let newObj = PhaserScene.add.sprite(x, y, 'enemies', name).setRotation((Math.random() - 0.5) * 3).setScale(0).setDepth(110);
         this.eyeObjects.push(newObj);
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

    update(dt) {
         super.update(dt);
        this.eyeUpdateTick -= dt;
        if (this.eyeUpdateTick < 0) {
            this.eyeUpdateTick = 25;
            for (let i = 0; i < this.eyeShieldObjects.length; i++) {
                if (Math.random() < 0.4) {
                    let obj = this.eyeShieldObjects[i];
                    if (Math.random() < 0.1) {
                        // blink
                        PhaserScene.tweens.add({
                            delay: Math.floor(Math.random() * 125),
                            targets: [obj.front],
                            scaleY: 0,
                            duration: 150,
                            ease: 'Cubic.easeIn',
                            onComplete: () => {
                                PhaserScene.tweens.add({
                                    targets: [obj.front],
                                    scaleX: obj.front.startScale,
                                    scaleY: obj.front.startScale,
                                    duration: 150,
                                    ease: 'Cubic.easeOut',
                                });
                            }
                        });
                    } else {
                        let randDist = Math.random() * obj.front.startScale * 8;
                        let randRot = Math.random() * 2 * Math.PI;
                        let xPos = Math.sin(randRot) * randDist;
                        let yPos = Math.cos(randRot) * randDist;
                        let randScale = Math.random() * 0.15;
                        randScale *= randScale;
                        let newScale = obj.front.startScale - 0.04 + randScale;
                        PhaserScene.tweens.add({
                            delay: Math.floor(Math.random() * 125),
                            targets: [obj.front],
                            x: obj.back.x + xPos,
                            y: obj.back.y + yPos,
                            scaleX: newScale,
                            scaleY: newScale,
                            duration: 400 + Math.random() * 350,
                            ease: 'Quart.easeOut',
                        });
                    }
                }
            }
        }
    }

     damageVoidShield() {
         this.shieldAmts--;
         playSound('meat_click_left', 0.4);
         playSound('meat_click_right', 0.4);
         if (this.shieldAmts <= 0) {
             this.clearVoidShield();
         } else {
             if (this.shieldsActive == 1) {
                 this.voidShield1a.setScale(this.voidShield1a.startScale * 1.12);
                 this.voidShield1b.setScale(this.voidShield1a.startScale * 1.12);
                 PhaserScene.tweens.add({
                     targets: [this.voidShield1a, this.voidShield1b],
                     scaleX: this.voidShield1a.startScale,
                     scaleY: this.voidShield1a.startScale,
                     duration: 250,
                     ease: 'Cubic.easeOut',
                 });
             } else {
                 this.voidShield2a.setScale(this.voidShield1a.startScale * 1.1);
                 this.voidShield2b.setScale(this.voidShield1a.startScale * 1.1);
                 PhaserScene.tweens.add({
                     targets: [this.voidShield2a, this.voidShield2b],
                     scaleX: this.voidShield2a.startScale,
                     scaleY: this.voidShield2a.startScale,
                     duration: 250,
                     ease: 'Cubic.easeOut',
                 });
             }
         }
         this.killEye(this.eyeShieldObjects.pop());

     }

     createVoidShield(amt, doubleShield) {
         playSound('void_shield');
         this.voidShield1a.setAlpha(1);
         this.voidShield1b.setAlpha(1);
         if (doubleShield) {
             this.voidShield2a.setAlpha(1);
             this.voidShield2b.setAlpha(1);
             this.shieldsActive = 2;
         } else {
             this.shieldsActive = 1;
             this.createShieldEye(this.x, this.y + 103, 0.6);
             this.createShieldEye(this.x + 49, this.y + 96, 0.4);
             this.createShieldEye(this.x - 49, this.y + 96, 0.4);
         }
         this.shieldAmts = amt;
     }

     killEye(obj) {
         let eyeFront = obj.front;
         let eyeBack = obj.back;
         PhaserScene.tweens.add({
             targets: [eyeBack, eyeFront],
             scaleX: eyeBack.scaleX + 0.3,
             scaleY: eyeBack.scaleX + 0.3,
             duration: 400,
             alpha: 0,
             ease: 'Cubic.easeOut',
             onComplete: () => {
                 eyeBack.destroy();
                 eyeFront.destroy();
             }
         });
     }

     createShieldEye(x, y, scale) {
         let eyeBack = this.scene.add.sprite(x, y, 'enemies', 'void_knight_shield_eye.png').setScale(scale * 0.85, scale * 0.85).setDepth(2);
         let eyeFront = this.scene.add.sprite(x, y, 'enemies', 'void_knight_shield_eye_2.png').setScale(scale * 0.85, 0).setDepth(2);
         eyeBack.startScale = scale;
         eyeFront.startScale = scale;
         let eyeObj = {
             front: eyeFront,
             back: eyeBack
         }
         this.eyeShieldObjects.push(eyeObj);
         PhaserScene.tweens.add({
             delay: 0,
             targets: [eyeBack],
             scaleX: scale,
             scaleY: scale,
             duration: 300,
             ease: 'Back.easeOut',
         });
         PhaserScene.tweens.add({
             delay: 250,
             targets: [eyeFront],
             scaleX: scale * 0.85,
             scaleY: 0.1,
             duration: 500,
             ease: 'Back.easeOut',
             onComplete: () => {
                 PhaserScene.tweens.add({
                     targets: [eyeFront],
                     scaleX: scale,
                     scaleY: scale,
                     duration: 500,
                     ease: 'Cubic.easeOut',
                 });
             }
         });

     }

     clearVoidShield(clearSecondShield) {
        if (clearSecondShield) {
            this.shieldsActive--;
            PhaserScene.tweens.add({
                targets: [this.voidShield2a, this.voidShield2b],
                scaleX: this.voidShield2a.scaleX + 0.1,
                scaleY: this.voidShield2a.scaleX + 0.1,
                duration: 300,
                ease: 'Cubic.easeOut',
                alpha: 0,
            });
        } else {
            this.shieldsActive = 0;
            PhaserScene.tweens.add({
                targets: [this.voidShield1a, this.voidShield1b],
                scaleX: this.voidShield1a.scaleX + 0.1,
                scaleY: this.voidShield1a.scaleX + 0.1,
                duration: 250,
                ease: 'Cubic.easeOut',
                alpha: 0,
            });
        }
     }

     makeSlashEffect() {
         playSound('sword_slice', 0.7);
         if (this.slashEffectAnim) {
             this.slashEffectAnim.stop();
         }
         let isFlipped = this.slashEffect.scaleX > 0;
         this.slashEffect.setAlpha(1).setScale(isFlipped ? -0.5 : 0.5, 0.4).setRotation(isFlipped ? -0.5 : 0.5);
         this.slashEffectAnim = PhaserScene.tweens.add({
             targets: this.slashEffect,
             scaleX: isFlipped ? -1 : 1,
             scaleY: 0.6,
             duration: 250,
             ease: 'Cubic.easeOut',
             alpha: 0,
         });
     }

     initAttacks() {
         this.attacks = [
             [
                 // 0
                 {
                     name: "|15 ",
                     announceName: "BRANCH ATTACK",
                     desc: "The tree swipes a branch at you",
                     chargeAmt: 300,
                     damage: 15,
                     prepareSprite: 'void_knight_pullback.png',
                     attackSprites: ['void_knight_attack.png'],
                     attackFinishFunction: () => {
                         this.currentAttackSetIndex = 1;
                         this.nextAttackIndex = 0;
                         this.makeSlashEffect();
                         playSound('sword_hit', 0.75);
                     }
                 }
             ],
             [
                 // 1
                 {
                     name: "VOID SHIELD {3",
                     announceName: "VOID SHIELD (3)",
                     desc: "The tree recovers its injuries over time",
                     chargeAmt: 400,
                     damage: -1,
                     attackFinishFunction: () => {
                         this.createVoidShield(3);
                         this.currentAttackSetIndex = 2;
                         this.nextAttackIndex = 0;

                     }
                 }
             ],
             [
                 // 2
                 {
                     name: "}8 ",
                     announceName: "FEINT ATTACK",
                     chargeAmt: 200,
                     damage: 8,
                     chargeMult: 2,
                     attackSprites: ['void_knight_attack.png'],
                     attackFinishFunction: () => {
                         this.makeSlashEffect();
                         playSound('sword_hit', 0.75);
                     }
                 },
                 {
                     name: "}8x3 ",
                     announceName: "ASSAULT",
                     chargeAmt: 400,
                     damage: 8,
                     attackTimes: 3,
                     prepareSprite: 'void_knight_pullback.png',
                     attackSprites: ['void_knight_attack.png'],
                     attackFinishFunction: () => {
                         this.makeSlashEffect();
                         playSound('sword_hit', 0.7);
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
                             this.createEyeObject('tree_leaf.webp', xPos, yPos, i * 25);
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
         if (this.currAnim) {
             this.currAnim.stop();
         }
         if (this.isFirstMode) {
            this.setMaxHealth(this.healthMax - 20);
            this.heal(this.healthMax);
         } else {
             super.die();
         }



     }
}
