class StatusObj {
    constructor(scene, spellID, x, y, sprite, sprite2, displayAmt, infoText) {
        this.scene = scene;
        this.setup(x, y);
        this.init(spellID, x, y, sprite, sprite2, displayAmt, infoText);
    }

    setup(x, y) {
        this.active = true;
        this.sprite = this.scene.add.sprite(x, y, 'circle', 'rune_void_glow.png').setAlpha(0.75);
        this.sprite2 = this.scene.add.sprite(x - 11, y + 16, 'circle', 'rune_void_glow.png');
        this.sprite2.setScale(0.6, 0.6);
        this.sprite2.visible = false;
        this.amtText = this.scene.add.bitmapText(x + 9, y+28, 'normalStroke', '0', isMobile ? 24 : 22, 0);
        this.amtText.visible = false;
        this.amtText.setOrigin(isMobile ? 0.2 : 0.26, 0.5);
        this.timeLeftText = this.scene.add.bitmapText(x + 27, y, 'normalStroke', '99', isMobile ? 30 : 28, 0);
        this.timeLeftText.setOrigin(0, 0.5);

        this.sprite.setDepth(9999);
        this.sprite2.setDepth(9999);
        this.timeLeftText.setDepth(9999);
        this.amtText.setDepth(9999);
        this.statusInfo = "";

    }

    setHoverText(text) {
        this.statusInfo = text;
    }

    setPosition(x, y) {
        this.sprite.setPosition(x, y);
        this.sprite2.setPosition(x-11, y + 16);
        this.timeLeftText.setPosition(x + 27, y);
        this.amtText.setPosition(x + 9, y+28)
        this.buttonHover.setPosition(x - 1, y - 34);
    }

    init(spellID, x, y, spriteSrc = 'rune_void_glow.png', spriteSrc2, amt, infoText) {
        this.statusInfo = infoText;
        this.spellID = spellID;
        this.active = true;
        this.sprite.setFrame(spriteSrc);
        let yOffset = 0;
        if (this.sprite.height > 50) {
            yOffset = this.sprite.height * 0.5 - 25;
        }
        this.sprite.setPosition(x, y + yOffset);
        this.timeLeftText.setPosition(x + 27, y);
        this.timeLeftText.setVisible(true);
        this.sprite.visible = true;
        if (spriteSrc2) {
            this.sprite2.visible = true;
            this.sprite2.setFrame(spriteSrc2);
            let y2Offset = 0;
            if (this.sprite2.height > 50) {
                y2Offset = this.sprite2.height * 0.5 - 25;
                y2Offset *= this.sprite2.scaleY;
            }
            this.sprite2.setPosition(x - 11, y + 16 + y2Offset);
        }
        if (amt) {
            this.amtText.setText(amt);
            this.amtText.setPosition(x + 9, y+28);
        }
        this.amtText.visible = true;
        this.buttonHover = new Button({
            normal: {
                ref: "blackPixel",
                alpha: 0,
                x: this.sprite.x - 1,
                y: this.sprite.y - 34,
                scaleX: 29,
                scaleY: 33
            },
            hover: {
                ref: "blackPixel",
                alpha: 0,
                x: this.sprite.x - 1,
                y: this.sprite.y - 34,
                scaleX: 30,
                scaleY: 33
            },
            disable: {
                alpha: 0
            },
            onHover: () => {
                this.showInfo();
            },
            onHoverOut: () => {
                this.hideInfo();
            },
            onMouseUp: () => {
                this.showInfo();
            }
        });
    }

    showInfo() {
        messageBus.publish("showStatusInfo", this.statusInfo)
    }

    hideInfo() {
        messageBus.publish("hideStatusInfo")
    }

    setDurationText(text = ' ') {
        this.timeLeftText.setText(text);
    }

    setAmtText(text = ' ') {
        this.amtText.setText(text);
    }

    clear() {
        this.sprite.setVisible(false);
        this.sprite2.setVisible(false);
        this.timeLeftText.setVisible(false);
        this.amtText.setVisible(false);
        this.buttonHover.setState(DISABLE);
        this.active = false;
    }
}
