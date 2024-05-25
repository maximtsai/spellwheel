 class MenuDummy extends Enemy {
    constructor(scene, x, y, level) {
        super(scene, x, y, level);
        this.initSprite('lesser_dummy.png', 0.8, 0, 5);
        this.sprite.setOrigin(0.5, 0.99);
    }

     initStatsCustom() {
         this.health = 500;
         this.isAsleep = true;
     }

     setHealth(newHealth) {
         super.setHealth(500);
         if (newHealth > 0) {
             PhaserScene.tweens.add({
                 targets: this.sprite,
                 rotation: -0.12,
                 ease: "Quart.easeOut",
                 duration: 50,
                 onComplete: () => {
                     PhaserScene.tweens.add({
                         targets: this.sprite,
                         rotation: 0,
                         ease: "Back.easeOut",
                         duration: 400,
                     });
                 }
             });
         }
     }

     die() {
         if (this.dead) {
             return;
         }
        super.die();

         PhaserScene.tweens.add({
             targets: this.sprite,
             rotation: -0.5,
             ease: "Cubic.easeIn",
             duration: 500,
             onComplete: () => {
                 this.setSprite('lesser_dummy_dead.png', this.sprite.scaleX);
                 this.sprite.rotation = 0;
                 this.sprite.y += 35;
                 this.sprite.x -= 40;
             }
         });
     }

     initAttacks() {
         this.attacks = [
             [
                 // 0
                 {
                     name: "}999 ",
                     chargeAmt: 999,
                     damage: 999,
                    attackFinishFunction: () => {
                        let dmgEffect = this.scene.add.sprite(gameConsts.halfWidth + (Math.random() - 0.5) * 20, globalObjects.player.getY() - 185, 'spells', 'damageEffect1.png').setDepth(998).setScale(1.5);
                        setTimeout(() => {
                            dmgEffect.destroy();
                        }, 150)
                    }
                 }
             ]
         ];
     }
}
