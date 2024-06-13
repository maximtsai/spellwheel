 class Dummymind extends Dummypractice {
    constructor(scene, x, y, level) {
        super(scene, x, y, level);
    }

     initStatsCustom() {
         this.health = 50;
         this.isAsleep = true;
        this.attackScale = 1;
        this.pullbackScale = 1;
     }

     initTutorial() {
        this.bgMusic = playMusic('bite_down_simplified', 0.65, true);
        globalObjects.magicCircle.disableMovement();
        globalObjects.bannerTextManager.setDialog(["This new rune that was\ndropped could come in useful"]);
        globalObjects.bannerTextManager.setPosition(gameConsts.halfWidth, gameConsts.height - 130, 0);
        globalObjects.bannerTextManager.showBanner(false);
        let runeDepth = globalObjects.bannerTextManager.getDepth() + 1;
        this.rune1 = this.addImage(gameConsts.halfWidth - 260, gameConsts.height - 130, 'tutorial', 'rune_mind_large.png').setDepth(runeDepth).setScale(0.8, 0.8).setAlpha(0);
        this.rune2 = this.addImage(gameConsts.halfWidth + 260, gameConsts.height - 130, 'tutorial', 'rune_mind_large.png').setDepth(runeDepth).setScale(0.8, 0.8).setAlpha(0);
         this.addTween({
             targets: [this.rune1, this.rune2],
             alpha: 1,
             scaleX: 1,
             scaleY: 1,
             duration: 400,
         });
        globalObjects.bannerTextManager.setOnFinishFunc(() => {
            globalObjects.magicCircle.enableMovement();
            globalObjects.bannerTextManager.setOnFinishFunc(() => {});
            globalObjects.bannerTextManager.closeBanner();
             this.addTween({
                 targets: [this.rune1, this.rune2],
                 alpha: 0,
                 duration: 200,
             });
             this.canShowShieldTip = true;
             // messageBus.publish('enemyAddShield', 500)
        });
    }


     setHealth(newHealth) {
         super.setHealth(newHealth);
         let prevHealthPercent = this.prevHealth / this.healthMax;
         let currHealthPercent = this.health / this.healthMax;
         if (currHealthPercent == 0) {
             // dead, can't do anything
             return;
         }
         if (this.canShowShieldTip) {
            this.canShowShieldTip = false;
             this.addTimeout(() => {
                 this.rune3 = this.addImage(gameConsts.width - 150, gameConsts.halfHeight + 20, 'circle', 'rune_mind_glow.png').setDepth(9999).setScale(0.8, 0.8).setAlpha(0);
                 this.rune4 = this.addImage(gameConsts.width - 82, gameConsts.halfHeight + 20, 'circle', 'rune_strike_glow.png').setDepth(9999).setScale(0.8, 0.8).setAlpha(0);
                 globalObjects.textPopupManager.setInfoText(gameConsts.width, gameConsts.halfHeight - 160, "Energy strike lets\nyour next attack\nhit twice as hard.\n             +", 'right');
                 this.addTween({
                     targets: [this.rune3, this.rune4],
                     alpha: 1,
                     duration: 200,
                     completeDelay: 1000,
                     onComplete: () => {
                        this.playerSpellCastSub = messageBus.subscribe('playerCastedSpell', () => {
                            this.playerSpellCastSub.unsubscribe();
                            this.addTimeout(() => {
                                 this.addTween({
                                     targets: [this.rune3, this.rune4],
                                     alpha: 0,
                                     duration: 300,
                                     onComplete: () => {
                                        this.rune3.visible = false;
                                        this.rune4.visible = false;
                                     }
                                 });
                                globalObjects.textPopupManager.hideInfoText();
                            }, 1000);
                        });
                     }
                 });
             }, 500)
         }
     }

     die() {
         if (this.dead) {
             return;
         }
        globalObjects.textPopupManager.hideInfoText();
         if (this.rune1) {
             this.rune1.visible = false;
             this.rune2.visible = false;
         }
         if (this.rune3) {
            this.rune3.visible = false;
         }
         if (this.rune4) {
            this.rune4.visible = false;
         }
        super.die();

     }


     initAttacks() {
         this.attacks = [
             [
                 // 0
                 {
                     name: "}5 ",
                     chargeAmt: 300,
                     damage: 5,
                     isBigMove: true,
                    attackFinishFunction: () => {
                        playSound('body_slam')
                        let dmgEffect = this.addSprite(gameConsts.halfWidth + (Math.random() - 0.5) * 20, globalObjects.player.getY() - 185, 'spells', 'damageEffect1.png').setDepth(998).setScale(1.5);
                        this.addTimeout(() => {
                            dmgEffect.destroy();
                        }, 150)
                    }
                 },
             ]
         ];
     }
}
