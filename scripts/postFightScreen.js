class PostFightScreen {
    constructor(scene) {
        this.scene = scene;
        this.bgShade = null;
        this.backing = null;
        this.titleText = null;
        this.spellsCastText = null;
    }

    initAssets() {
        if (!this.bgShade) {
            this.bgShade = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setDepth(100000).setAlpha(0).setScale(500, 500);
        }
        if (!this.backing) {
            this.backing = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 120, 'ui', 'battleOverScreen.png').setDepth(100000).setAlpha(0);
        }
        if (!this.titleText) {
            this.titleText = this.scene.add.text(gameConsts.halfWidth, gameConsts.halfHeight - 300, '(placeholder title)').setAlpha(0).setOrigin(0.5, 0.25).setAlign('center').setDepth(100000).setFontSize(42);
        }
        if (!this.spellsCastText) {
            this.spellsCastText = this.scene.add.text(gameConsts.halfWidth - 250, gameConsts.halfHeight - 200, '(placeholder stat)').setAlpha(0).setOrigin(0, 0.5).setAlign('left').setDepth(100000).setFontSize(26);
        }
        this.backing.setScale(0.98);
        this.titleText.setScale(0.97);
        this.spellsCastText.setScale(0.97);
        PhaserScene.tweens.add({
            targets: [this.bgShade, this.backing, this.titleText],
            scaleX: 1,
            scaleY: 1,
            alpha: 1,
            ease: 'Back.easeOut',
            duration: 300,
            onComplete: () => {
                PhaserScene.tweens.add({
                    delay: 500,
                    targets: [this.spellsCastText],
                    alpha: 1,
                    duration: 300,
                });
            }
        });
    }

    createWinScreen(sprite) {
        this.initAssets()
    }
}
