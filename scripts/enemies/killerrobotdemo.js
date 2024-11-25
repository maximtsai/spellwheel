 class KillerRobotDemo extends Enemy {
     constructor(scene, x, y, level) {
         super(scene, x, y, level);
         this.initSprite('robot_dead.png', 1);
         this.shieldAdded = false;
         this.sprite.startY = y;

        this.addTimeout(() => {
            this.setAsleep();
        }, 10)

         this.sprite.alpha = 0;
         this.sprite.rotation = -0.2;
         this.addTimeout(() => {
             this.initPreBattleLogic();
         }, 10);
         // ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MIND, RUNE_MIND, null, null, null , RUNE_MATTER];
     }

     initSpriteAnim() {

     }

     initPreBattleLogic() {
         this.lightShineLeft = this.addSprite(this.sprite.x, this.sprite.y, 'blurry', 'star_blur.png').setDepth(-1).setAlpha(0).setRotation(-0.9).setScale(0.2);
         this.lightShineLeftTop = this.addSprite(this.lightShineLeft.x, this.lightShineLeft.y, 'blurry', 'star_blur.png').setDepth(12).setAlpha(0).setRotation(this.lightShineLeft.rotation);

         this.musicNote = this.addImage(-100, 0, 'blurry', 'note.png').setScale(0).setDepth();

        this.addTween({
            delay: 500,
            targets: this.lightShineLeft,
            alpha: 0.9,
            duration: 400,
        })
         this.addTween({
             delay: 500,
             targets: this.lightShineLeft,
             scaleX: 0.75,
             scaleY: 0.75,
             duration: 400,
             ease: 'Cubic.easeIn',
             onComplete: () => {
                 this.addTween({
                     targets: this.lightShineLeft,
                     scaleX: 0,
                     scaleY: 0,
                     duration: 450,
                     ease: 'Cubic.easeOut',
                 })
             }
         })
         this.addTween({
             delay: 500,
             targets: this.lightShineLeft,
             rotation: "+=0.2",
             duration: 1250,
         })
         this.addTween({
             delay: 650,
             targets: this.sprite,
             duration: 800,
             alpha: 1,
             ease: 'Quad.easeIn',
         });
         this.addTween({
             delay: 700,
             targets: this.sprite,
             duration: 800,
             rotation: "-=0.1",
         });
         this.addTween({
             delay: 700,
             targets: this.sprite,
             duration: 800,
             y: "+=70",
             ease: 'Cubic.easeIn',
             onComplete: () => {
                 playSound('clunk');
                 this.addTween({
                     targets: this.sprite,
                     duration: 650,
                     rotation: 0.15,
                     onComplete: () => {
                         playSound('clunk', 0.5).detune = 400;
                         this.addDelayIfAlive(() => {
                             playSound('clunk2', 0.4).detune = 400;
                         }, 100)
                         this.addTween({
                             targets: this.sprite,
                             duration: 250,
                             rotation: 0,
                             ease: 'Bounce.easeOut',
                         });
                     }
                 });
                 this.addTween({
                     targets: this.sprite,
                     duration: 400,
                     y: "-=5",
                     ease: 'Cubic.easeOut',
                     onComplete: () => {
                         this.addTween({
                             targets: this.sprite,
                             duration: 500,
                             y: "+=7",
                             ease: 'Bounce.easeOut',
                             completeDelay: 1300,
                             onComplete: () => {
                                 this.bgMusic = playMusic('jpop', 0.3, true);
                                 fadeInSound(this.bgMusic, 0.85, 1200);
                                 this.playMusicNoteRepeat();
                             }
                         });
                     }
                 });

             }
         });

     }
     initPreStats() {
         // this.delayLoad = true;
         // this.loadUpHealthBar();
     }

     initStatsCustom() {
         this.health = 10;
     }


     playMusicNoteRepeat() {
         if (this.dead) {
             return;
         }
         let xShift = Math.floor(Math.random() * 100 - 50);
         this.musicNote.x = this.sprite.x - xShift * 0.7;
         this.musicNote.y = this.sprite.y;
         let yShift = Math.floor(Math.random() * 40 + 100);

         this.addTween({
             targets: this.musicNote,
             scaleX: 1,
             scaleY: 1,
             ease: 'Quart.easeOut',
             duration: 400,
             onComplete: () => {
                 this.addTween({
                     delay: 700,
                     targets: this.musicNote,
                     scaleX: 0,
                     scaleY: 0,
                     ease: 'Quart.easeIn',
                     duration: 400,
                 })
             }
         })
         this.addTween({
             targets: this.musicNote,
             x: "-=" + xShift,
             y: "-=" + yShift,
             ease: 'Quart.easeOut',
             duration: 1500,
             onComplete: () => {
                 this.playMusicNoteRepeat()
             }
         })
     }

     setHealth(newHealth) {
         super.setHealth(newHealth);
         let prevHealthPercent = this.prevHealth / this.healthMax;
         let currHealthPercent = this.health / this.healthMax;
         if (currHealthPercent === 0) {
             // dead, can't do anything
             return;
         }
         if (currHealthPercent < 0.99) {
             if (!this.playedSound) {
                 this.playedSound = true;
                 playSound('voca_short_pain')
             }
             this.addDelayIfAlive(() => {
                 this.bgMusic.detune = -1200 + this.health * 60;
             }, 150)
         }
     }


     initAttacks() {
         this.attacks = [
             [
                 {
                     name: "|12",
                     chargeAmt: 350,
                     damage: 12,
                     attackTimes: 1,
                     startFunction: () => {

                     },
                     attackStartFunction: () => {
                     },
                 },
             ],
         ];
     }


     die() {
        if (this.dead) {
             return;
        }

        super.die();

        if (this.currAnim) {
            this.currAnim.stop();
        }

        globalObjects.bannerTextManager.closeBanner();
         playSound('voca_kya_damaged', 0.15).seek = 0.85;
        playSound('cutesy_down', 0.8)

        this.lightShineLeft.visible = false;
        this.lightShineLeftTop.visible = false;

         let deathBoom = this.addSprite(this.sprite.x, this.sprite.y, 'enemies', 'robot_blast.png').setDepth(0).setOrigin(0.5, 0.65).setScale(0.2).setAlpha(0.5);
         this.addTween({
             targets: deathBoom,
             alpha: 0,
             duration: 700,
             ease: 'Quad.easeIn',
             onComplete: () => {
                 deathBoom.destroy();
             }
         });
         this.addTween({
             targets: deathBoom,
             scaleX: 0.6,
             scaleY: 0.6,
             duration: 700,
             ease: 'Cubic.easeOut',
         });
         globalObjects.textPopupManager.hideInfoText();
         globalObjects.encyclopedia.hideButton();
         globalObjects.options.hideButton();
         this.dieClickBlocker = new Button({
             normal: {
                 ref: "blackPixel",
                 x: gameConsts.halfWidth,
                 y: gameConsts.halfHeight,
                 alpha: 0.001,
                 scaleX: 1000,
                 scaleY: 1000
             },
             onMouseUp: () => {

             }
         });
         globalObjects.magicCircle.disableMovement();
         playSound('clunk');

         this.sprite.setRotation(0.2);
         this.sprite.y -= 5;
         this.addTween({
             targets: this.sprite,
             rotation: 0,
             ease: 'Quart.easeIn',
             duration: 1500
         })
         this.sprite.alpha = 0.5;
         this.addTween({
             targets: this.sprite,

             y: "+=7",
             ease: "Back.easeIn",
             duration: 1500,
             onComplete: () => {
                 playSound('clunk2')
                 let rune = this.addSprite(this.x, this.y, 'tutorial', 'rune_protect_large.png').setScale(0).setVisible(false);
                 this.addTween({
                     targets: rune,
                     x: gameConsts.halfWidth,
                     y: gameConsts.halfHeight - 170,
                     scaleX: 1,
                     scaleY: 1,
                     ease: "Cubic.easeOut",
                     duration: 3000,
                     onComplete: () => {
                         this.showVictory(rune);
                     }
                 });
             }
         });

     }

     showVictory(rune) {
         globalObjects.magicCircle.disableMovement();
         let banner = this.addSprite(gameConsts.halfWidth, gameConsts.halfHeight - 35, 'misc', 'victory_banner.png').setScale(100, 1.2).setDepth(9998).setAlpha(0);
         let victoryText = this.addSprite(gameConsts.halfWidth, gameConsts.halfHeight - 44, 'misc', 'complete.png').setScale(0.95).setDepth(9998).setAlpha(0);
         let continueText = this.addText(gameConsts.halfWidth, gameConsts.halfHeight + 1, '(MORE IN FULL VERSION)', {fontFamily: 'garamondmax', color: '#F0F0F0', fontSize: 18}).setAlpha(0).setOrigin(0.5, 0.5).setAlign('center').setDepth(9998);

         this.addTween({
             targets: banner,
             alpha: 0.75,
             duration: 500,
         });

         this.addTween({
             targets: [victoryText],
             alpha: 1,
             ease: 'Quad.easeOut',
             duration: 500,
         });
         playSound('victory_false');
         this.addTween({
             delay: 500,
             targets: continueText,
             duration: 650,
             alpha: 1
         })

         this.addTween({
             targets: victoryText,
             scaleX: 1,
             scaleY: 1,
             duration: 800,
         });
         this.addTween({
             targets: rune,
             y: gameConsts.halfHeight - 110,
             ease: 'Cubic.easeOut',
             duration: 400,
             onComplete: () => {
                 if (canvas) {
                     canvas.style.cursor = 'pointer';
                 }
                 this.dieClickBlocker.setOnMouseUpFunc(() => {
                     if (canvas) {
                         canvas.style.cursor = 'default';
                     }
                     this.dieClickBlocker.destroy();
                     continueText.destroy();
                     this.addTween({
                         targets: [victoryText, banner],
                         alpha: 0,
                         duration: 400,
                         onComplete: () => {
                             victoryText.destroy();
                             banner.destroy();
                             // go to main menu
                             gotoMainMenu();
                         }
                     });
                     rune.destroy();
                 })
             }
         });
     }
}
