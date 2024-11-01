 class KillerRobotDemo extends Enemy {
     constructor(scene, x, y, level) {
         super(scene, x, y, level);
         this.initSprite('robot_dead.png', 1);
         this.shieldAdded = false;
         this.sprite.startY = y;
        this.bgMusic = playMusic('jpop', 0.85, true);

        this.addTimeout(() => {
            this.setAsleep();
        }, 10)
         this.addTimeout(() => {
             globalObjects.magicCircle.disableMovement();
         }, 900);
         this.sprite.alpha = 0;
         this.sprite.rotation = -0.2;
         this.addTimeout(() => {
             this.initPreBattleLogic();
         }, 300);
         // ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MIND, RUNE_MIND, null, null, null , RUNE_MATTER];
     }

     initPreBattleLogic() {
         this.lightShineLeft = this.addSprite(gameConsts.halfWidth, gameConsts.halfHeight - 320, 'blurry', 'star_blur_sharp.png').setDepth(-1).setAlpha(0).setRotation(-0.5);
         this.lightShineLeftTop = this.addSprite(this.lightShineLeft.x, this.lightShineLeft.y, 'blurry', 'star_blur.png').setDepth(12).setAlpha(0).setRotation(this.lightShineLeft.rotation);

         this.addTween({
             targets: this.sprite,
             duration: 1250,
             alpha: 1,
             ease: 'Quad.easeIn',
             onComplete: () => {
                 this.addTween({
                     targets: this.sprite,
                     duration: 500,
                     y: "+=40",
                     ease: 'Cubic.easeIn',
                     onComplete: () => {

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
         this.health = 2;
     }


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

         this.disco.destroy();
        if (this.currAnim) {
            this.currAnim.stop();
        }

        globalObjects.bannerTextManager.closeBanner();
         playSound('voca_kya_damaged', 0.85);


        this.lightShineLeft.visible = false;
        this.lightShineLeftTop.visible = false;

         this.addTween({
             targets: this.tunnelBG,
             duration: 700,
             alpha: 0,
             ease: 'Quint.easeOut',
         });
         let deathBoom = this.addSprite(this.sprite.x, this.sprite.y, 'enemies', 'robot_blast.png').setDepth(0).setOrigin(0.5, 0.65).setScale(0.25, -0.25);
         this.addTween({
             targets: deathBoom,
             alpha: 0,
             duration: 900,
             ease: 'Quad.easeIn',
             onComplete: () => {
                 deathBoom.destroy();
             }
         });
         this.addTween({
             targets: deathBoom,
             scaleX: 1,
             scaleY: -1,
             duration: 900,
             ease: 'Cubic.easeOut',
         });
         globalObjects.textPopupManager.hideInfoText();

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

         playSound('clunk');

         this.sprite.setRotation(0.2);
         this.sprite.y -= 5;
         this.addTween({
             targets: this.sprite,
             rotation: 0,
             ease: 'Quart.easeIn',
             duration: 1500
         })
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
                     duration: 1500,
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
         let victoryText = this.addSprite(gameConsts.halfWidth, gameConsts.halfHeight - 44, 'misc', 'victory_text.png').setScale(0.95).setDepth(9998).setAlpha(0);
         let continueText = this.addText(gameConsts.width - 15, gameConsts.halfHeight + 2, getLangText('cont_ui'), {fontFamily: 'Verdana', color: '#F0F0F0', fontSize: 20}).setAlpha(0).setOrigin(1, 0.5).setAlign('right').setDepth(9998);

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
         this.addTimeout(() => {
             continueText.alpha = 1;
         }, 1000);

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
