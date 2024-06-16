class ConfirmPopup {
    constructor(scene) {
        this.scene = scene;
        this.confirmFunc = () => {}
        messageBus.subscribe('showConfirmPopup', (func) => {
            this.confirmFunc = func;
            // this.showPopup();
        })
        this.defaultDepth = 100100;
        this.darkBG = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setScale(500).setDepth(this.defaultDepth).setAlpha(0);
        this.backing = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'ui', 'small_paper.png').setDepth(this.defaultDepth).setAlpha(0);
        // this.confirmButton = new Button({
        //     normal: {
        //         atlas: "ui",
        //         ref: "more.png",
        //         visible: true,
        //         alpha: 0.85,
        //         x: gameConsts.halfWidth - 56,
        //         y: gameConsts.halfHeight - 157,
        //     },
        //     hover: {
        //         atlas: "ui",
        //         alpha: 1,
        //         ref: "more_hover.png",
        //     },
        //     press: {
        //         atlas: "ui",
        //         alpha: 0.8,
        //         ref: "more_press.png",
        //     },
        //     disable: {
        //         atlas: "ui",
        //         ref: "more_press.png",
        //         alpha: 0
        //     },
        //     onHover: () => {
        //         if (canvas) {
        //             canvas.style.cursor = 'pointer';
        //         }
        //     },
        //     onHoverOut: () => {
        //         if (canvas) {
        //             canvas.style.cursor = 'default';
        //         }
        //     },
        //     onMouseUp: () => {
        //         this.showRuneDescBtn.setState(DISABLE);
        //         if (canvas) {
        //             canvas.style.cursor = 'default';
        //         }
        //         this.newRuneDesc.visible = true;
        //         PhaserScene.tweens.add({
        //             targets: [this.newRuneDesc],
        //             alpha: 1,
        //             ease: 'Cubic.easeOut',
        //             duration: 250,
        //         });
        //     }
        // });
    }

    showPopup() {
        this.scene.tweens.add({
            targets: this.darkBG,
            alpha: 0.4,
            ease: 'Cubic.easeOut',
            duration: 250
        })
        this.scene.tweens.add({
            targets: this.backing,
            alpha: 1,
            ease: 'Cubic.easeOut',
            duration: 250
        })
    }

    confirm() {
        this.confirmFunc();
    }

    hide() {
        this.scene.tweens.add({
            targets: [this.darkBG, this.backing],
            alpha: 0,
            duration: 250
        })
    }

}
