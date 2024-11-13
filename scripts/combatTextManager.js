class CombatTextManager {
    constructor(scene) {
        this.scene = scene;
        this.bg = this.scene.add.image(gameConsts.halfWidth, 240, 'misc', 'battletext_bg.png').setDepth(200).setAlpha(0).setScale(5);
        this.bg.startY = this.bg.y;
        this.bgBorderTop = this.scene.add.image(gameConsts.halfWidth, this.bg.y - this.bg.scaleY * 5, 'misc', 'battletext_border_top.png').setDepth(200).setAlpha(0).setOrigin(0.5, 0);
        this.bgBorderBot = this.scene.add.image(gameConsts.halfWidth, this.bg.y + this.bg.scaleY * 5, 'misc', 'battletext_border_bot.png').setDepth(200).setAlpha(0).setOrigin(0.5, 1);



        this.text = this.scene.add.text(gameConsts.halfWidth, this.bg.y, '...', {fontFamily: 'garamondmax', fontSize: isMobile ? 28 : 26, color: '#FFFFFF', align: 'center'}).setAlpha(0).setOrigin(0.5, 0.5).setDepth(201);
        // this.text.setFontStyle('bold');
        messageBus.subscribe("showCombatText", this.showCombatText.bind(this));

        messageBus.subscribe("closeCombatText", this.closeCombatText.bind(this));
    }

    setDialog(dialogArray) {
        this.dialog = dialogArray;
    }

    setText(text) {
        this.text.setText(text);
    }

    showCombatText(text, yOffset = 0, onComplete, alpha = 0.92) {
        this.isShowing = true;
        // this.setText(this.dialog[this.dialogIndex]);
        // if (this.funcArray[this.dialogIndex]) {
        //     this.funcArray[this.dialogIndex]();
        // }
        this.setText(text);
        this.setPosition(this.bg.x, this.bg.startY + yOffset);
        if (this.text.width > 370) {
            this.bg.scaleX = (this.text.width + 30) * 0.01;
        } else {
            this.bg.scaleX = 4;
        }
        this.bgBorderTop.scaleX = this.bg.scaleX * 0.25;
        this.bgBorderBot.scaleX = this.bg.scaleX * 0.25;
        if (this.text.height > 50) {
            this.bg.scaleY = 8;
        } else {
            this.bg.scaleY = 4.8;
        }
        this.bgBorderTop.y = this.bg.y - this.bg.scaleY * 4.8 - 1;
        this.bgBorderBot.y = this.bg.y + this.bg.scaleY * 4.8 + 1;
        if (this.currAnim) {
            this.currAnim.stop();
        }
        this.text.alpha = 0;
        this.onFinishFunc = onComplete;
        PhaserScene.tweens.add({
            targets: [this.bg],
            alpha: alpha,
            scaleX: 5,
            duration: 300,
            ease: 'Cubic.easeOut'
        });
        PhaserScene.tweens.add({
            targets: [this.bgBorderTop, this.bgBorderBot],
            alpha: 1,
            duration: 350,
        });
        this.currAnim = PhaserScene.tweens.add({
            delay: 100,
            targets: [this.text],
            alpha: 1,
            duration: 300,
        });
    }

    closeCombatText() {
        if (!this.isShowing) {
            return;
        }
        this.isShowing = false;
        if (this.currAnim) {
            this.currAnim.stop();
        }
        if (this.onFinishFunc) {
            this.onFinishFunc();
            this.onFinishFunc = null;
        }
        PhaserScene.tweens.add({
            targets: [this.bgBorderTop, this.bgBorderBot, this.bg, this.text],
            alpha: 0,
            duration: 400,
        });
    }

    setPosition(x, y, textOffsetY = 0) {
        this.bg.setPosition(x, y);
        this.bgBorderTop.setPosition(x, y - this.bg.scaleY * 5);
        this.bgBorderBot.setPosition(x, y + this.bg.scaleY * 5);
        this.text.setPosition(x, y + textOffsetY);
    }


    setOnFinishFunc(func, delay = 0) {
        this.onFinishFunc = func;
    }
}
