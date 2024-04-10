class InternalHoverTextManager {
    constructor(scene) {
        PhaserScene = scene || PhaserScene;
        this.hoverTextList = [];
        this.lastHovered = null;

        // this.hoverDisplay = new HoverDisplay();

        // messageBus.subscribe("pointerUp", this.onPointerUp.bind(this));
        messageBus.subscribe("pointerMove", this.onPointerMove.bind(this));
        messageBus.subscribe("pointerDown", this.onPointerDown.bind(this));
    }

    update(delta) {

    }

    // onPointerUp(mouseX, mouseY) {
    //     let hoverTextObj = this.getLastClickedButton();
    //     if (hoverTextObj && hoverTextObj.checkCoordOver(mouseX, mouseY)) {
    //         hoverTextObj.onMouseUp();
    //     }
    //     if (this.draggedObj) {
    //         if (this.draggedObj.onDrop) {
    //             this.draggedObj.onDrop();
    //         }
    //         this.draggedObj = null
    //     }
    // }

    onPointerMove(mouseX, mouseY) {
        let handX = gameVars.mouseposx;
        let handY = gameVars.mouseposy;
        // check hovering
        let currentHovered = null;

        for (let i = this.hoverTextList.length - 1; i >= 0; i--) {
            let hoverTextObj = this.hoverTextList[i];
            if (hoverTextObj && hoverTextObj.checkCoordOver(handX, handY)) {
                currentHovered = hoverTextObj;
                if (this.lastHovered !== currentHovered && currentHovered.onHover) {
                    currentHovered.onHover();
                }
                let posX = hoverTextObj.displayX ? hoverTextObj.displayX : mouseX;
                let posY = hoverTextObj.displayY ? hoverTextObj.displayY : mouseY;
                this.hoverBacking.x = posX; this.hoverBacking.y = posY;
                this.hoverBacking.setOrigin(hoverTextObj.originX, hoverTextObj.originY);
                this.hoverTextDisplay.x = this.hoverBacking.x + 2 * (1 - hoverTextObj.originX * 2 - 2);
                this.hoverTextDisplay.y = this.hoverBacking.y - 1 * (hoverTextObj.originX * 2 - 1);
                this.hoverTextDisplay.setText(hoverTextObj.text);
                this.hoverTextDisplay.visible = true;
                this.hoverTextDisplay.setOrigin(hoverTextObj.originX, hoverTextObj.originY);
                this.hoverBacking.visible = true;
                this.hoverBacking.setScale((this.hoverTextDisplay.width + 13) * 0.5 * this.hoverTextDisplay.scaleX, (this.hoverTextDisplay.height + 10) * 0.5 * this.hoverTextDisplay.scaleY);
                break;
            }
        }
        if (this.lastHovered && this.lastHovered !== currentHovered) {
            this.hoverTextDisplay.visible = false;
            this.hoverBacking.visible = false;
            if (this.lastHovered.onHoverOut) {
                this.lastHovered.onHoverOut();
            }
        }

        this.lastHovered = currentHovered;
    }

    onPointerDown(mouseX, mouseY) {
        this.onPointerMove(mouseX, mouseY);
    }

    addToHoverTextList(button) {
        this.hoverTextList.push(button);
    }

    removeHoverText(button) {
        for (let i in this.hoverTextList) {
            if (this.hoverTextList[i] === button) {
                this.hoverTextList.splice(parseInt(i), 1);
                break;
            }
        }
    }
}

// hoverTextManager = new InternalHoverTextManager();
class HoverDisplay {
    constructor(data) {
        this.hoverBacking = PhaserScene.add.sprite(0, 0, 'blackPixel');
        this.hoverBacking.visible = false;
        this.hoverBacking.setDepth(data.depth || 9992);
        this.hoverBacking.alpha = 0.6;


        // this.hoverTextDisplay = PhaserScene.add.bitmapText(0, 0, 'plainBold', '', isMobile ? 19 : 18);
        this.hoverTextDisplay = PhaserScene.add.text(0, 0, 'desc.', {fontFamily: 'Tahoma', fontSize: isMobile ? 18 : 17, color: '#FFFFFF', align: 'left'});
        this.hoverTextDisplay.visible = false;
        this.hoverTextDisplay.setDepth(data.depth || 9992);

        this.setPosition(data.x, data.y)
        this.setOrigin(data.originX, data.originY);

    }

    setPosition(x, y) {
        this.hoverBacking.x = x; this.hoverBacking.y = y;
        this.hoverTextDisplay.x = this.hoverBacking.x + 2 * (1 - this.hoverBacking.originX * 2 - 2);
    }

    setOrigin(x = 0.5, y = 0.5) {
        this.hoverBacking.setOrigin(x, y);
        this.hoverTextDisplay.setOrigin(x, y);
    }

    setText(text) {
        this.hoverTextDisplay.setText(text);
        this.hoverTextDisplay.x = this.hoverBacking.x + 2 * (1 - this.hoverBacking.originX * 2 - 2);
        this.hoverTextDisplay.y = this.hoverBacking.y - 1 * (this.hoverBacking.originX * 2 - 1);
        this.hoverBacking.setScale((this.hoverTextDisplay.width + 13) * 0.5 * this.hoverTextDisplay.scaleX, (this.hoverTextDisplay.height + 10) * 0.5 * this.hoverTextDisplay.scaleY);
        if (text.length > 0) {
            this.setVisible(true);
        } else {
            this.setVisible(false);
        }
    }

    setVisible(val) {
        this.hoverTextDisplay.visible = val;
        this.hoverBacking.visible = val;
    }
}

class HoverText {
    /**
     * Create a hover area with some parameters
     *
     * data = {normal: ..., press: ...}
     */
    constructor(data) {
        this.origin = {};
        this.origin.x = data.origin ? data.origin.x : 0.5;
        this.origin.y = data.origin ? data.origin.y : 0.5;
        this.width = data.width;
        this.height = data.height;
        this.x = data.x - this.width * this.origin.x;
        this.y = data.y - this.height * this.origin.y;
        this.endX = data.x + this.width * (1 - this.origin.x);
        this.endY = data.y + this.height * (1 - this.origin.y);
        this.text = data.text || '...';
        this.onHover = data.onHover;
        this.onHoverOut = data.onHoverOut;

        this.displayX = data.displayX;
        this.displayY = data.displayY;
        this.originX = data.displayOrigin ? data.displayOrigin.x : 0;
        this.originY = data.displayOrigin ? data.displayOrigin.y : 0;


        globalObjects.hoverTextManager.addToHoverTextList(this);

        this.depth = 0;
    }

    checkCoordOver(x, y) {
        if (x < this.x || x > this.endX) {
            return false;
        }
        if (y < this.y || y > this.endY) {
            return false
        }
        return true;
    }

    getPosX() {
        return this.getXPos();
    }

    getPosY() {
        return this.getYPos();
    }

    getXPos() {
        return this.x;
    }

    getYPos() {
        return this.y;
    }

    getWidth() {
        return this.endX - this.x;
    }

    getHeight() {
        return this.endY - this.y;
    }

    setText(text) {
        this.text = text;
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
        this.endX = this.x + this.width;
        this.endY = this.y + this.height;
    }


    bringToTop() {
        console.log("TODO")
        // for (let i in this.imageRefs) {
        //     this.container.bringToTop(this.imageRefs[i]);
        // }
    }

    setOrigin(origX, origY) {
        console.log("todo");
    }

    destroy() {
        globalObjects.hoverTextManager.removeHoverText(this);
    }
}

