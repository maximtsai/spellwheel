const DECAY = 0.00006;
const STATIC = 0.006;
const ENABLE_KEYBOARD = true;

 class MagicCircle {
    constructor(scene, x, y) {
        this.scene = scene;
        this.reset(x, y);
        this.buildCircles(x, y, scene);
        this.createTimeStopObjs();
        // this.createMindSniper(x, y);
        if (ENABLE_KEYBOARD) {
            this.setupKeyPresses(scene);
        }

        this.castDisabled = false;
        this.bufferedCastAvailable = false;
        this.forcingAlignment = false;
        this.outerDragDisabled = false;
        this.innerDragDisabled = false;
        this.disableSpellDescDisplay = false;
        this.elementsAnimArray = [];
        this.embodimentsAnimArray = [];
        this.tempRotObjs = [];
        this.tempLockRot = 0;
        this.lastDragTime = 0;
        this.prevDragAngleDiff = null;
        this.dScaleAccumulate = 0;
        this.draggedDuration = 0;
        this.preventRotDecay = 0;
        this.subscriptions = [
            messageBus.subscribe('attackLaunched', this.attackLaunched.bind(this)),
            messageBus.subscribe('manualSetTimeSlowRatio', this.manualSetTimeSlowRatio.bind(this)),
            messageBus.subscribe('statusesTicked', this.handleStatusesTicked.bind(this)),
            messageBus.subscribe('playerAddDelayedDamage', this.addDelayedDamage.bind(this)),
            messageBus.subscribe('playerReduceDelayedDamage', this.reduceDelayedDamage.bind(this)),
            messageBus.subscribe('enableVoidArm', this.enableVoidArm.bind(this)),
            messageBus.subscribe('setTempRotObjs', this.setTempRotObjs.bind(this)),
            messageBus.subscribe('manualResetElements', this.manualResetElements.bind(this)),
            messageBus.subscribe('manualResetEmbodiments', this.manualResetEmbodiments.bind(this)),
            messageBus.subscribe('inflictVoidBurn', this.applyVoidBurn.bind(this)),
            messageBus.subscribe('startVoidForm', this.handleVoidForm.bind(this)),
            messageBus.subscribe('stopVoidForm', this.clearVoidForm.bind(this)),
            messageBus.subscribe('selfClearEffect', this.clearMindForm.bind(this)),
            messageBus.subscribe('enemyHasDied', this.clearEffects.bind(this)),
            messageBus.subscribe('selfClearStatuses', this.clearEffects.bind(this)),

            messageBus.subscribe("applyMindBurn", this.applyMindBurn.bind(this)),
            messageBus.subscribe("playerDied", this.playerDied.bind(this)),
            messageBus.subscribe("playerRevived", this.playerRevived.bind(this)),
            messageBus.subscribe("highlightRunes", this.highlightRunes.bind(this)),
            messageBus.subscribe("unhighlightRunes", this.unhighlightRunes.bind(this)),
            messageBus.subscribe("showCircleShadow", this.showCircleShadow.bind(this)),

            messageBus.subscribe("setCircleShadow", this.setCircleShadow.bind(this))

        ];

        updateManager.addFunction(this.update.bind(this));
    }

    setupKeyPresses(scene) {
        this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyQ = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.keyE = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        this.keyLeft = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.keyRight = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.keyUp = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyDown = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.keyEnter = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.keySpace = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update(dScale) {
        if (this.lastDragTime > 15) {
            gameVars.playerNotMoved = true;
        } else {
            gameVars.playerNotMoved = false;
        }
        this.lastDragTime += dScale;
        this.handleTimeSlow(dScale);

        let mouseDistX = gameVars.mouseposx - this.x;
        let mouseDistY = gameVars.mouseposy - this.y;
        let totalDist = Math.sqrt(mouseDistX * mouseDistX + mouseDistY * mouseDistY);

        this.setFrameLazy(this.castButton, 'cast_normal.png');
        this.setFrameLazy(this.innerCircle,'element_normal.png');
        this.setFrameLazy(this.outerCircle, 'usage_normal.png');
        if (this.manualDisabled) {
            this.dragArrow.visible = false;
            this.dragCircle.visible = false;
        }

        if (this.delayedDamage > this.delayedDamageBase) {
            let extraOverload = this.delayedDamage - this.delayedDamageBase;
            if (this.delayedDamage > this.delayedDamageBase * 1.25) {
                // way overflow
                this.delayDamageSandFull.x += Math.random() * extraOverload * 0.03;
            }
            this.delayDamageSandFull.x = this.delayDamageSandFull.origX + (this.delayDamageSandFull.origX - this.delayDamageSandFull.x) * 0.75;
            this.delayDamageSandFull.x += Math.random() * (extraOverload * 0.12 + 0.5);
            this.delayDamageHourglass.x = this.delayDamageSandFull.x;
        }

        if (!this.recentSkipped && (this.keyEnter.isDown || this.keySpace.isDown)) {
            messageBus.publish("continueDialog");
            this.recentSkipped = true;
        } else if (this.recentSkipped && !this.keyEnter.isDown && !this.keySpace.isDown) {
            this.recentSkipped = false;
        }

        if (ENABLE_KEYBOARD && !this.outerDragDisabled && !this.innerDragDisabled) {
            if (this.keyA.isDown || this.keyLeft.isDown) {
                if (this.keyboardRotateInner > -1) {
                    this.keyboardRotateInner = -1.4;
                } else {
                    this.keyboardRotateInner = -1;
                }
            } else if (this.keyD.isDown || this.keyRight.isDown) {
                if (this.keyboardRotateInner < 1) {
                    this.keyboardRotateInner = 1.4;
                } else {
                    this.keyboardRotateInner = 1;
                }
            } else {
                this.keyboardRotateInner = 0;
            }

            if (this.keyW.isDown || this.keyUp.isDown || this.keyE.isDown) {
                if (this.keyboardRotateOuter < 1) {
                    this.keyboardRotateOuter = 1.4;
                } else {
                    this.keyboardRotateOuter = 1;
                }
            } else if (this.keyS.isDown || this.keyDown.isDown || this.keyQ.isDown) {
                if (this.keyboardRotateOuter > -1) {
                    this.keyboardRotateOuter = -1.4;
                } else {
                    this.keyboardRotateOuter = -1;
                }
            } else {
                this.keyboardRotateOuter = 0;
            }
            this.keyboardCasted = false;
            if (!this.keyboardCastRestricted && (this.keyEnter.isDown || this.keySpace.isDown)) {
                this.keyboardCasted = true;
                this.keyboardCastRestricted = true;
            } else if (!this.keyEnter.isDown && !this.keySpace.isDown) {
                this.keyboardCastRestricted = false;
            }

            if (this.keyboardCasted) {
                if (!this.castDisabled && !this.recharging) {
                    // BOOM
                    this.castSpell();
                    this.keyboardCasted = false;
                } else if (this.bufferedCastAvailable && !this.recharging) {
                    this.bufferedCastAvailable = false;
                    this.useBufferedSpellCast = true;
                }
            }
        }

        if (totalDist <= this.size && !this.manualDisabled) {
            if (gameVars.mouseJustDowned) {
                this.draggedDuration = 0;
                // clicked
                if (totalDist < this.castButtonSize) {
                    this.draggedObj = this.castButton;
                    this.setFrameLazy(this.castButton,'cast_press.png');
                } else if (totalDist < this.innerCircleSize && !this.innerDragDisabled) {
                    this.draggedObj = this.innerCircle;
                    this.dragPointDist = totalDist;
                    this.dragPointAngle = Math.atan2(mouseDistY, mouseDistX);
                    this.dragPointAngleVisual = this.dragPointAngle;
                    this.setFrameLazy(this.innerCircle, 'element_drag.png');
                } else if (!this.outerDragDisabled) {
                    this.draggedObj = this.outerCircle;
                    this.dragPointDist = Math.min(totalDist, this.trueSize);
                    this.dragPointAngle = Math.atan2(mouseDistY, mouseDistX);
                    this.dragPointAngleVisual = this.dragPointAngle;
                    this.setFrameLazy(this.outerCircle,'usage_drag.png');
                }
            } else if (gameVars.mouseJustUpped) {
                // this.draggedDuration = -2;
                if (this.draggedDuration < 12) {
                    this.preventRotDecay = (12 - this.draggedDuration) * 0.4;
                }
                // let go
                if (totalDist < this.castButtonSize && this.draggedObj == this.castButton) {
                    if (!this.castDisabled && !this.recharging) {
                        // BOOM
                        this.castSpell();
                        this.keyboardCasted = false;
                    } else if (this.bufferedCastAvailable && !this.recharging) {
                        this.bufferedCastAvailable = false;
                        this.useBufferedSpellCast = true;
                    }
                }
            } else if (gameVars.mousedown) {
                this.draggedDuration += dScale;
                if (totalDist < this.castButtonSize && this.draggedObj == this.castButton) {
                    this.setFrameLazy(this.castButton,'cast_press.png');
                }
            } else {
                // plain ol hovering
                if (totalDist < this.castButtonSize) {
                    this.setFrameLazy(this.castButton,'cast_hover.png');
                } else if (!this.innerDragDisabled && totalDist < this.innerCircleSize) {
                    this.setFrameLazy(this.innerCircle, 'element_hover.png');
                } else if (!this.outerDragDisabled) {
                    this.setFrameLazy(this.outerCircle,'usage_hover.png');
                }
            }
        }

        if (!gameVars.mousedown) {
            this.draggedObj = null;
        }

        if (this.innerDragDisabled && this.innerCircle == this.draggedObj) {
            this.draggedObj = null;
        }
        if (this.outerDragDisabled && this.outerCircle == this.draggedObj) {
            this.draggedObj = null;
        }

        if (dScale > 1.05) {
            this.dScaleAccumulate += dScale;
            while (this.dScaleAccumulate > 1) {
                this.dScaleAccumulate -= 1;
                this.updateInterval(1, mouseDistX, mouseDistY);
            }
            if (this.dScaleAccumulate > 0.3) {
                this.updateInterval(this.dScaleAccumulate, mouseDistX, mouseDistY);
                this.dScaleAccumulate = 0;
            }
        } else {
            this.updateInterval(dScale, mouseDistX, mouseDistY);
        }

        let rotationOffset = this.voidArm2.alpha > 0 ? 0.35 : 0.05;
        if (this.voidArm.alpha > 0) {
            this.voidArm.bonusRotation += (Math.random() - 0.5) * 0.05;
            this.voidArm.bonusRotation *= 0.98;
            this.voidArm.rotation = this.voidArm.bonusRotation + rotationOffset;
            if (this.voidArm.alpha > 0.92) {
                this.voidArm.alpha = 0.92 + Math.random() * 0.08;
            }
        }
        if (this.voidArm2.alpha > 0) {
            this.voidArm2.bonusRotation += (Math.random() - 0.5) * 0.05;
            this.voidArm2.bonusRotation *= 0.97;
            this.voidArm2.rotation = Math.PI * 0.5 + this.voidArm2.bonusRotation + rotationOffset;
            if (this.voidArm2.alpha > 0.92) {
                this.voidArm2.alpha = 0.92 + Math.random() * 0.08;
            }
        }
        if (this.innerCircle.rotVel !== 0 || this.outerCircle.rotVel !== 0 || this.draggedObj !== null) {
            this.lastDragTime = Math.min(this.lastDragTime, 0);
        }

        this.updateShields(dScale);
        this.updateFramesLazy();
    }

    updateInterval(dScale, mouseDistX, mouseDistY) {
        if (this.draggedObj && this.draggedObj !== this.castButton) {
            this.dragArrow.visible = true;
            this.dragCircle.visible = true;
            while (this.dragPointAngle > Math.PI * 2) {
                this.dragPointAngle -= Math.PI * 2
            }
            while (this.dragPointAngle < Math.PI * -2) {
                this.dragPointAngle += Math.PI * 2;
            }

            let dragGoalAngle = Math.atan2(mouseDistY, mouseDistX);
            let dragAngleDiff = dragGoalAngle - this.dragPointAngle;
            if (dragAngleDiff > Math.PI) {
                dragAngleDiff -= Math.PI * 2;
            } else if (dragAngleDiff < -Math.PI) {
                dragAngleDiff += Math.PI * 2;
            }

            if (!this.prevDragAngleDiff) {
                this.prevDragAngleDiff = dragAngleDiff;
            }
            let dragAngleDiffDiff = (dragAngleDiff - this.prevDragAngleDiff) * Math.abs(dragAngleDiff);
            if (dragAngleDiffDiff < -0.24) {
                dragAngleDiffDiff = -0.24;
            } else if (dragAngleDiffDiff > 0.24) {
                dragAngleDiffDiff = 0.24;
            }
            // alt method of calculating torque
            let dragPointX = Math.cos(this.dragPointAngle) * this.dragPointDist;
            let dragPointY = Math.sin(this.dragPointAngle) * this.dragPointDist;
            let dragDistX = mouseDistX - dragPointX;
            let dragDistY = mouseDistY - dragPointY;
            //
            let dragDist = Math.sqrt(dragDistX * dragDistX + dragDistY * dragDistY);
            let dragDistXOrigin = dragDistX / (dragDist + 0.001);
            let dragDistYOrigin = dragDistY / (dragDist + 0.001);

            let dragPointXOrigin = dragPointX / this.dragPointDist;
            let dragPointYOrigin = dragPointY / this.dragPointDist;
            let dragForce = 0;
            if (dragDist < 25) {
                dragForce = Math.max(0, Math.min(1, dragDist * 0.015));
            } else {
                dragForce = Math.min(1, 0.25 + dragDist * 0.002);
            }

            let vertForce = dragPointXOrigin * dragDistYOrigin;
            let horizForce = -dragPointYOrigin * dragDistXOrigin;

            let dragForceSqr = horizForce + vertForce;

            let torqueConst = gameVars.wasTouch ? 0.046 : 0.042;
            // castDisable

            // Using both rotation diff and mult val to calculate
            if (dragForceSqr < 0) {
                this.draggedObj.torque = dragForce * -Math.sqrt(-dragForceSqr) * torqueConst * (1 + dScale * 0.00);
            } else {
                this.draggedObj.torque = dragForce * Math.sqrt(dragForceSqr) * torqueConst * (1 + dScale * 0.00);
            }
            // TODO: Remove if not needed
            this.draggedObj.torque += dragAngleDiff * torqueConst * 0.65 - this.draggedObj.rotVel * 0.325;
            // this.draggedObj.torque = this.draggedObj.torque + (this.draggedObj.torque * this.draggedObj.torque) * minusMult * 150;
            //this.draggedObj.torque += this.draggedObj.torqueOnRelease * 0.5;

            this.draggedObj.torqueOnRelease = this.draggedObj.torque * 5; // there's some more oomph to when you sling out a spin

            if (this.draggedObj.rotVel * dragAngleDiff < -0.01) {
                // if drag force is acting opposite of current velocity, slow down current velocity
                this.draggedObj.rotVel *= 0.25;
            }

            let oldObjVisualRot = this.draggedObj.rotation;
            let oldObjRot = this.draggedObj.nextRotation;
            this.calculateRotations(dScale);
            this.updateRotationVisuals(dScale);
            let visualDiff = this.draggedObj.rotation - oldObjVisualRot;
            let rotDiff = this.draggedObj.nextRotation - oldObjRot;
            this.dragPointAngle += rotDiff;
            this.dragPointAngleVisual += visualDiff;

            // recalculating it all for drag arrow visual update
            dragPointX = Math.cos(this.dragPointAngleVisual) * this.dragPointDist;
            dragPointY = Math.sin(this.dragPointAngleVisual) * this.dragPointDist;
            dragDistX = mouseDistX - dragPointX;
            dragDistY = mouseDistY - dragPointY;
            this.dragArrow.setPosition(this.x + dragPointX, this.y + dragPointY);
            this.dragCircle.setPosition(this.x + dragPointX, this.y + dragPointY);
            this.dragArrow.setScale(Math.max(0.08, Math.min(1, dragDist * 0.0135)), 1);
            this.dragArrow.setAlpha(Math.min(this.dragArrow.scaleX * 5 - 2))
            this.dragArrow.setRotation(Math.atan2(dragDistY, dragDistX));

            // dragging affects outside of circle
            if (this.draggedObj == this.innerCircle) {
                this.setFrameLazy(this.innerCircle, 'element_drag.png');
            } else if (this.draggedObj == this.outerCircle) {
                this.setFrameLazy(this.outerCircle,'usage_drag.png');
            }
            this.prevDragAngleDiff = dragAngleDiff;
        } else {
            this.prevDragAngleDiff = null;
            this.dragArrow.visible = false;
            this.dragCircle.visible = false;
            this.calculateRotations(dScale);
            this.updateRotationVisuals(dScale);
        }
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.trueSize = 205;
        this.size = isMobile ? 252 : 225;
        this.draggedObj = null;
        this.dragPointAngle = 0;
        this.dragPointAngleVisual = this.dragPointAngle;
        this.dragPointDist = 100;
        this.keyboardRotateOuter = 0;
        this.keyboardRotateInner = 0;
        this.keyboardCasted = false;
        this.delayedDamage = 0;
        this.delayedDamageBase = 60;
        this.delayedDamageShouldTick = false;
    }

    buildCircles(x, y, scene) {
        this.aura = scene.add.sprite(x, y, 'circle', 'aura.png');
        this.aura.setDepth(101);
        this.aura.setScale(0.9);
        this.aura.rotVel = 0;
        this.aura.alpha = 0.02;

        this.voidArm = this.scene.add.sprite(gameConsts.halfWidth, 210, 'spells', 'blackHoleArms.png').setScale(1.25);
        this.voidArm.setDepth(15);
        this.voidArm.alpha = 0;
        this.voidArm.bonusRotation = 0;

        this.voidArm2 = this.scene.add.sprite(gameConsts.halfWidth, 210, 'spells', 'blackHoleArms.png').setScale(1.25);
        this.voidArm2.setDepth(15);
        this.voidArm2.alpha = 0;
        this.voidArm2.bonusRotation = 0;


        this.delayDamageSandFull = scene.add.sprite(x - 240, y - 130, 'circle', 'delayed_damage_full.png');
        this.delayDamagePartial = scene.add.graphics().setDepth(101);
        this.delayDamagePartial.fillStyle(0xff0000, 0.7)
        this.delayDamagePartial.visible = true;
        this.delayDamagePartial.setDepth(101);


        this.delayDamageHourglass = scene.add.sprite(x - 240, y - 130, 'circle', 'delayed_damage.png').setScale(0.9);
        this.delayDamageHourglass.setDepth(101);
        this.delayDamageHourglass.alpha = 0;

        this.delayDamageSandFull.setDepth(101);
        this.delayDamageSandFull.alpha = 0;
        this.delayDamageSandFull.origX = this.delayDamageSandFull.x;

        this.delayDamageText = this.scene.add.bitmapText(this.delayDamageHourglass.x, this.delayDamageHourglass.y, 'damage', '0', 48, 0);
        this.delayDamageText.setDepth(101);
        this.delayDamageText.alpha = 0;
        this.delayDamageText.setOrigin(0.5, -0.35);



        this.outerCircle = scene.add.sprite(x, y, 'circle', 'usage_normal.png').setDepth(101);
        this.outerCircle.torque = 0;
        this.outerCircle.torqueDecay = 0;
        this.outerCircle.torqueOnRelease = 0;
        this.outerCircle.rotVel = 0;
        this.outerCircle.nextRotation = 0;
        this.outerCircle.prevRotation = 0;
        this.innerCircleSize = isMobile ? 138 : 143;
        this.innerCircle = scene.add.sprite(x, y, 'circle', 'element_normal.png').setDepth(102);
        this.innerCircle.setOrigin(0.5003, 0.5003);
        this.innerCircle
        this.innerCircle.torque = 0;
        this.innerCircle.torqueDecay = 0;
        this.innerCircle.torqueOnRelease = 0;
        this.innerCircle.rotVel = 0;
        this.innerCircle.nextRotation = 0;
        this.innerCircle.prevRotation = 0;
        this.shadowCircle = scene.add.sprite(x, y, 'circle', 'shadow.png').setAlpha(0).setDepth(99999).setBlendMode(Phaser.BlendModes.MULTIPLY);

        this.castButtonSize = isMobile ? 72 : 78;
        this.castButton = scene.add.sprite(x, y, 'circle', 'cast_normal.png').setDepth(105);
        this.castButtonSpare = scene.add.sprite(x, y, 'circle', 'cast_press.png').setDepth(106).setAlpha(0);
        // this.castButtonFlash = scene.add.sprite(x, y, 'circle', 'cast_flash.png').setDepth(106).setAlpha(0);
        this.castHoverTemp = scene.add.sprite(x, y, 'circle', 'cast_press.png').setDepth(106).setAlpha(0);
        this.castGlow = scene.add.sprite(x, y, 'circle', 'cast_glow.png').setDepth(106).setAlpha(0);
        this.greyedDead = scene.add.sprite(x, y, 'circle', 'greyed_dead.png').setVisible(false).setDepth(119);

        this.focusLines = scene.add.sprite(x, y - 137, 'circle', 'focus_lines.png').setDepth(120);
        this.greyed = scene.add.sprite(x, y, 'circle', 'greyed.png').setVisible(false).setDepth(120).setVisible(false);

        this.castTriangles = [];
        let triangle1 = scene.add.sprite(x - 35, y - 113.5, 'circle', 'cast_triangle.png');
        triangle1.setDepth(120).setScale(0.8, 0.7);
        this.castTriangles.push(triangle1)
        let triangle2 = scene.add.sprite(x + 35, y - 113.5, 'circle', 'cast_triangle.png');
        triangle2.setDepth(120).setScale(-0.8, 0.7);
        this.castTriangles.push(triangle2)
        let triangle3 = scene.add.sprite(x + 34, y - 167, 'circle', 'cast_triangle.png');
        triangle3.setDepth(120).setScale(-0.8, 0.7);
        this.castTriangles.push(triangle3)
        let triangle4 = scene.add.sprite(x - 34, y - 167, 'circle', 'cast_triangle.png');
        triangle4.setDepth(120).setScale(0.8, 0.7);
        this.castTriangles.push(triangle4)
        for (let i = 0; i < this.castTriangles.length; i++) {
            this.castTriangles[i].startScaleX = this.castTriangles[i].scaleX;
            this.castTriangles[i].startScaleY = this.castTriangles[i].scaleY;
        }

        this.errorBoxElement = scene.add.sprite(x, y - 115, 'circle', 'error_box.png');
        this.errorBoxElement.setDepth(121);
        this.errorBoxElement.alpha = 0;
        this.errorBoxEmbodiment = scene.add.sprite(x, y - 175, 'circle', 'error_box.png');
        this.errorBoxEmbodiment.setDepth(121);
        this.errorBoxEmbodiment.alpha = 0;

        this.spellElementText = this.scene.add.bitmapText(this.x - 11, this.y - 238, 'normal', 'MATTER STRIKE', 30, 1);
        this.spellElementText.setScale(0.7);
        this.spellElementText.setOrigin(1, 0.5);
        this.spellElementText.setDepth(125);
        this.spellElementText.alpha = 0.4;
        this.spellElementSprite = this.scene.add.sprite(this.spellElementText.x, this.spellElementText.y, 'vfx', 'blank.png').setDepth(119).setOrigin(1, 0.5);

        this.spellNameText = this.scene.add.bitmapText(this.x + 1, this.y - 238, 'normal', '+', 30, 1);
        this.spellNameText.setScale(0.7);
        this.spellNameText.setOrigin(0.5, 0.5);
        this.spellNameText.setDepth(125);
        this.spellNameText.alpha = 0.4;

        this.spellActionText = this.scene.add.bitmapText(this.x + 13, this.y - 238, 'normal', 'MATTER STRIKE', 30, 1);
        this.spellActionText.setScale(0.7);
        this.spellActionText.setOrigin(0, 0.5);
        this.spellActionText.setDepth(125);
        this.spellActionText.alpha = 0.4;

        this.voidSliceImage1 = scene.add.sprite(gameConsts.halfWidth - 100, 255, 'spells', 'darkSlice.png').setDepth(21).setRotation(-Math.PI * 0.5 + 0.6).setAlpha(0).setOrigin(0.17, 0.5);
        this.voidSliceImage3 = scene.add.sprite(gameConsts.halfWidth + 100, 255, 'spells', 'darkSlice.png').setDepth(21).setRotation(-Math.PI * 0.5 - 0.6).setAlpha(0).setOrigin(0.17, 0.5);

        this.mindBurnAnim = this.scene.add.sprite(gameConsts.halfWidth, 150, 'spells').play('mindBurn').setDepth(1).setAlpha(0).setDepth(10).setBlendMode(Phaser.BlendModes.ADD);


        // this.spellDescText = this.scene.add.bitmapText(this.x + 204, this.y + 2, 'plain', '', 15);
        // this.spellDescText.setOrigin(0, 0);
        // this.spellDescText.setDepth(120);

        // this.spellDescriptor = new HoverDisplay(
        // {
        //     x: this.spellNameText.x - 4,
        //     y: this.spellNameText.y + 6,
        //     width: this.spellNameText.width + 18,
        //     height: this.spellNameText.height + 7,
        //     text: "",
        //     displayX: gameConsts.width,
        //     displayY: this.spellNameText.y + 3,
        //     displayOrigin: {
        //         x: 1,
        //         y: 0.5
        //     },
        //     onHover: () => {
        //         this.spellNameText.alpha = 1;
        //     },
        //     onHoverOut: () => {
        //         this.spellNameText.alpha = 0.4;
        //         messageBus.publish('hoveredSpell', this.spellNameText.text);
        //     }
        // });
        this.spellDescriptor = new HoverDisplay({
            x: 0,
            y: gameConsts.height - 305,
            originX: 0,
            originY: 1,
            depth: 20
        })

        this.dragCircle = scene.add.sprite(x, y, 'circle', 'drag_circle.png').setAlpha(isMobile ? 0.75 : 0.55);
        this.dragCircle.setDepth(100001);
        this.dragCircle.visible = false;
        this.dragArrow = scene.add.sprite(x, y, 'circle', 'drag_arrow.png');
        this.dragArrow.setDepth(100001);
        this.dragArrow.setOrigin(0.2, 0.5);
        this.dragArrow.visible = false;
        this.buildRunes();
    }

    createTimeStopObjs() {
        this.gearBonusSpeed = 5;
        // this.timeStopLight = this.scene.add.sprite(this.x, this.y, 'blackPixel');
        // this.timeStopLight.alpha = 0;
        // this.timeStopLight.setScale(999);
        this.timeStopHeavy = this.scene.add.sprite(this.x, this.y, 'spells', 'blackCircleLarge.png');
        this.timeStopHeavy.alpha = 0;
        this.timeStopHeavy.setScale(1.7);

        this.clockbg = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 2, 'lowq', 'clockbg.png').setAlpha(0).setScale(1.06);
        this.clockbg.setDepth(1);
        this.gear1 = this.scene.add.sprite(-40, 280, 'circle', 'gear.png').setAlpha(0);
        this.gear1.setDepth(1);
        this.gear2 = this.scene.add.sprite(120, 442, 'circle', 'gear_small.png').setAlpha(0);
        this.gear2.setDepth(1);
        this.gear2.rotation = -0.25;
        this.gear3 = this.scene.add.sprite(565, -15, 'circle', 'gear.png').setAlpha(0);
        this.gear3.setDepth(1);
        this.gear4 = this.scene.add.sprite(538, 575, 'circle', 'gear_small.png').setAlpha(0);
        this.gear4.setDepth(1);
    }

     finishUpMindDamage(charge) {
         this.laserIsFiring = false;
     }

    handleTimeSlow(dt) {
        if (gameVars.timeSlowRatio == 1) {
            // passive time slowdown
            this.gearBonusSpeed = Math.min(10, this.gearBonusSpeed + dt);
            if (this.gearBonusSpeed < 10) {
                this.gear1.rotation += dt * 0.0045 * this.gearBonusSpeed;
                this.gear2.rotation -= dt * 0.006 * this.gearBonusSpeed;
                this.gear3.rotation += dt * 0.003 * this.gearBonusSpeed;
                this.gear4.rotation += dt * 0.006 * this.gearBonusSpeed;
            }
        } else {
            this.gearBonusSpeed = Math.max(0.1, Math.max(gameVars.timeSlowRatio, this.gearBonusSpeed * 0.985 -dt * 0.03));
            this.gear1.rotation += dt * 0.0045 * this.gearBonusSpeed;
            this.gear2.rotation -= dt * 0.006 * this.gearBonusSpeed;
            this.gear3.rotation += dt * 0.003 * this.gearBonusSpeed;
            this.gear4.rotation += dt * 0.006 * this.gearBonusSpeed;
        }
    }

    timeSlowFromEnemy() {
        // this.setTimeSlowRatio(slowRatio / multiplier, true);
        gameVars.timeSlowRatio = 0.9;
        this.timeStopHeavy.setScale(1.95);
        this.timeStopHeavy.setAlpha(1);
        this.timeStopHeavy.y = 150;
        this.scene.tweens.add({
            targets: this.timeStopHeavy,
            scaleX: 7,
            scaleY: 7,
            alpha: 0.8,
            ease: 'Cubic.easeIn',
            duration: 280,
        });

        this.scene.tweens.add({
            targets: this.clockbg,
            alpha: 0.15,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 250,
        });
        this.scene.tweens.add({
            targets: [this.gear1, this.gear2, this.gear3, this.gear4],
            ease: 'Quart.easeOut',
            alpha: 0.5,
            duration: 1000,
        });
    }

    cancelTimeSlow() {
        if (gameVars.timeSlowRatio !== 1) {
            gameVars.timeSlowRatio = 1;
            messageBus.publish("clearPermPause");

            this.scene.tweens.add({
                // this.timeStopLight,
                targets: [this.timeStopHeavy],
                ease: 'Quint.easeOut',
                alpha: 0.01,
                duration: 700,
                onComplete: () => {
                    this.scene.tweens.add({
                        targets: [this.timeStopHeavy],
                        alpha: 0,
                        duration: 500
                    });
                }
            });
            this.scene.tweens.add({
                targets: [this.gear1, this.gear2, this.gear3, this.gear4, this.clockbg],
                ease: 'Quad.easeIn',
                alpha: 0,
                duration: 300,
            });
        }
    }

     manualSetTimeSlowRatio(slowRatio = 1, multiplier = 1) {
        this.setTimeSlowRatio(slowRatio / multiplier, true);
         this.timeStopHeavy.y = this.y;
         this.timeStopHeavy.setScale(1.7);
         this.timeStopHeavy.setAlpha(1);
         let multiplierAddition = Math.max(0, (multiplier - 2) / multiplier);
         this.scene.tweens.add({
             targets: this.timeStopHeavy,
             scaleX: 7,
             scaleY: 7,
             alpha: 0.8 + multiplierAddition * 0.2,
             ease: 'Cubic.easeIn',
             duration: 280,
         });

         this.scene.tweens.add({
             targets: this.clockbg,
             alpha: 0.08 + multiplierAddition * 0.1,
             scaleX: 1.1 - multiplier * 0.005,
             scaleY: 1.1 - multiplier * 0.005,
             duration: 250,
         });
         this.scene.tweens.add({
             targets: [this.gear1, this.gear2, this.gear3, this.gear4],
             ease: 'Quart.easeOut',
             alpha: 0.4 + multiplierAddition * 0.2,
             duration: 1000,
         });
     }

    setTimeSlowRatio(ratio = 1, manual = false) {
        let oldRatio = gameVars.timeSlowRatio;
        gameVars.timeSlowRatio = ratio;
        if (ratio < 0.99) {
            playSound('timeSlow');
            if (globalObjects.currentEnemy && globalObjects.currentEnemy.bgMusic) {
                globalObjects.currentEnemy.bgMusic.detune = -1000;
            }
        } else {
            if (globalObjects.currentEnemy && globalObjects.currentEnemy.bgMusic) {
                globalObjects.currentEnemy.bgMusic.detune = 0;
            }
        }

        if (oldRatio != ratio) {
            messageBus.publish('setTimeSlowRatio', ratio);
            if (ratio == 1) {

                this.scene.tweens.add({
                    // this.timeStopLight,
                    targets: [this.timeStopHeavy],
                    ease: 'Quint.easeOut',
                    alpha: 0.01,
                    duration: 700,
                    onComplete: () => {
                        this.scene.tweens.add({
                            targets: [this.timeStopHeavy],
                            alpha: 0,
                            duration: 500
                        });
                    }
                });
                this.scene.tweens.add({
                    targets: [this.gear1, this.gear2, this.gear3, this.gear4, this.clockbg],
                    ease: 'Quad.easeIn',
                    alpha: 0,
                    duration: 300,
                });
            }
        }
    }

    attackLaunched() {
        let mindReinforceStatus = globalObjects.player.getStatuses()['mindReinforce'];
        if (mindReinforceStatus) {
            let multiplier = mindReinforceStatus.multiplier;
            let energyCircle1 = mindReinforceStatus.animObj[1];
            let energyCircle2 = mindReinforceStatus.animObj[1];
            this.scene.tweens.add({
                targets: energyCircle1,
                duration: 150,
                scaleX: 1.135 + 0.02 * multiplier,
                scaleY: 1.135 + 0.02 * multiplier,
                alpha: 1,
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    this.scene.tweens.add({
                        targets: energyCircle1,
                        duration: 400,
                        scaleX: 0.975 + 0.01 * multiplier,
                        scaleY: 0.975 + 0.01 * multiplier,
                        ease: 'Back.easeOut',
                        onComplete: () => {
                            this.scene.tweens.add({
                                targets: energyCircle1,
                                duration: 750,
                                alpha: 0.6,
                            });
                        }
                    });
                }
            });

            this.scene.tweens.add({
                targets: energyCircle2,
                duration: 200,
                scaleX: 1.17 + 0.02 * multiplier,
                scaleY: 1.17 + 0.02 * multiplier,
                alpha: 1,
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    this.scene.tweens.add({
                        targets: energyCircle2,
                        duration: 550,
                        scaleX: 1 + 0.012 * multiplier,
                        scaleY: 1 + 0.012 * multiplier,
                        ease: 'Back.easeOut',
                        onComplete: () => {
                            this.scene.tweens.add({
                                targets: energyCircle2,
                                duration: 750,
                                alpha: 0.6,
                            });
                        }
                    });
                }
            });

            this.showReadySprite(true, 1.5);
        }
    }

    buildRunes() {
        let x = this.x;
        let y = this.y;
        if (this.elements) {
            for (let i = 0; i < this.elements.length; i++) {
                this.elements[i].destroy();
                this.elements[i].glow.destroy();
            }
        }
        if (this.embodiments) {
            for (let i = 0; i < this.embodiments.length; i++) {
                this.embodiments[i].destroy();
                this.embodiments[i].glow.destroy();
            }
        }
        this.elements = [];
        this.embodiments = [];
        for (let i = 0; i < ELEMENT_ARRAY.length; i++) {
            this.elements[i] = this.scene.add.sprite(x, y, 'circle', ELEMENT_ARRAY[i] + '.png');
            this.elements[i].setOrigin(0.5, 0.84);
            this.elements[i].setDepth(103);
            this.elements[i].rotation = (Math.PI * 2)/ELEMENT_ARRAY.length * i;
            this.elements[i].startRotation = this.elements[i].rotation
            this.elements[i].runeName = ELEMENT_ARRAY[i];
            this.elements[i].alpha = 0.5;

            this.elements[i].glow = this.scene.add.sprite(x, y, 'circle', ELEMENT_ARRAY[i] + '_glow.png');
            this.elements[i].glow.setOrigin(0.5, 0.84);
            this.elements[i].glow.setDepth(103);
            this.elements[i].glow.rotation = this.elements[i].rotation;
        }
        for (let i = 0; i < EMBODIMENT_ARRAY.length; i++) {
            this.embodiments[i] = this.scene.add.sprite(x, y, 'circle', EMBODIMENT_ARRAY[i] + '.png');
            this.embodiments[i].setOrigin(0.5, 1.22);
            this.embodiments[i].setDepth(103);
            this.embodiments[i].rotation = (Math.PI * 2)/EMBODIMENT_ARRAY.length * i;
            this.embodiments[i].startRotation = this.embodiments[i].rotation;
            this.embodiments[i].runeName = EMBODIMENT_ARRAY[i];
            this.embodiments[i].alpha = 0.5;

            this.embodiments[i].glow = this.scene.add.sprite(x, y, 'circle', EMBODIMENT_ARRAY[i] + '_glow.png');
            this.embodiments[i].glow.setOrigin(0.5, 1.22);
            this.embodiments[i].glow.setDepth(103);
            this.embodiments[i].glow.rotation = this.embodiments[i].rotation;
        }
        // const ELEMENT_ARRAY = ['rune_time', 'rune_mind', 'rune_matter', 'rune_void'];
        // const EMBODIMENT_ARRAY = ['rune_enhance', 'rune_protect', 'rune_reinforce', 'rune_strike', 'rune_unload'];
    }

    setFrameLazy(item, frame) {
        item.lazyFrame = frame;
    }

     updateRotationVisuals(dt) {
         this.aura.rotVel += this.innerCircle.rotVel * 0.006 * dt + this.outerCircle.rotVel * 0.008 * dt;
         this.aura.rotVel *= 1 - 0.07 * dt;
         this.aura.rotation += dt * 0.001 + this.aura.rotVel;
         this.aura.setScale(0.9 + Math.abs(this.aura.rotVel));

         for (let i = 0; i < this.elements.length; i++) {
             this.elements[i].rotation = this.innerCircle.rotation + this.elements[i].startRotation;
             this.elements[i].glow.rotation = this.elements[i].rotation;
         }
         for (let i = 0; i < this.embodiments.length; i++) {
             this.embodiments[i].rotation = this.outerCircle.rotation + this.embodiments[i].startRotation;
             this.embodiments[i].glow.rotation = this.embodiments[i].rotation;
         }

     }

    calculateRotations(dt, distToTarget = 99) {
        if (this.innerDragDisabled || this.outerDragDisabled) {
            return;
        }
        let decayAltered = DECAY;

        let innerDecayMult = 1;
        let outerDecayMult = 1;
        let distToClosestRuneElement = 999;
        let distToClosestRuneEmbodiment = 999;
        let distToRuneElem = 999;
        let distToRuneEmbodi = 999;
        let closestElement = null;
        let closestEmbodiment = null;
        for (let i = 0; i < this.elements.length; i++) {
            distToRuneElem = this.getRotationDiff(this.innerCircle.nextRotation, -this.elements[i].startRotation);
            if (Math.abs(distToRuneElem) < Math.abs(distToClosestRuneElement)) {
                distToClosestRuneElement = distToRuneElem;
                closestElement = this.elements[i];
            }
        }
        for (let i = 0; i < this.embodiments.length; i++) {
            distToRuneEmbodi = this.getRotationDiff(this.outerCircle.nextRotation, -this.embodiments[i].startRotation);
            if (Math.abs(distToRuneEmbodi) < Math.abs(distToClosestRuneEmbodiment)) {
                distToClosestRuneEmbodiment = distToRuneEmbodi;
                closestEmbodiment = this.embodiments[i];
            }
        }

        if (!this.recentlyUpdatedSpellHover) {
            this.recentlyUpdatedSpellHover = true;
            this.updateSpellHover(closestElement, closestEmbodiment, distToClosestRuneElement, distToClosestRuneEmbodiment);
        } else {
            this.recentlyUpdatedSpellHover = false;
        }

        // high torque = lower friction
        let torqueMultInner = this.innerCircle.torque * this.innerCircle.torque > 0.00001 ? 0.6: 1;
        let torqueMultOuter = this.outerCircle.torque * this.outerCircle.torque > 0.00001 ? 0.6 : 1;

        let velMultInner = (Math.abs(this.innerCircle.rotVel) + 0.001) / 0.004;
        let velMultOuter = (Math.abs(this.outerCircle.rotVel) + 0.001) / 0.004;

        // higher decayAltered = more friction
        let decayAmtInner = 1 - decayAltered * dt * innerDecayMult * torqueMultInner * velMultInner;
        let decayAmtOuter = 1 - decayAltered * dt * outerDecayMult * torqueMultOuter * velMultOuter;
        // higher static = more friction
        let staticAmtInner = STATIC * dt * innerDecayMult * torqueMultInner;
        let staticAmtOuter = STATIC * dt * outerDecayMult * torqueMultOuter;

        // keyboard torque
        if (this.keyboardRotateInner != 0 && !this.innerDragDisabled) {
            this.usedKeyboardInner = true;
            let rotMult = 0.005/(0.005+Math.abs(this.innerCircle.rotVel));
            this.innerCircle.torque = this.keyboardRotateInner * 0.048 * rotMult;
        } else if (this.usedKeyboardInner) {
            this.usedKeyboardInner = false;
            this.innerCircle.rotVel *= 0.7;
        }

        if (this.keyboardRotateOuter != 0 && !this.outerDragDisabled) {
            this.usedKeyboardOuter = true;
            let rotMult = 0.005/(0.005+Math.abs(this.outerCircle.rotVel));
            this.outerCircle.torque = this.keyboardRotateOuter * 0.048 * rotMult;
        } else if (this.usedKeyboardOuter) {
            this.usedKeyboardOuter = false;
            this.outerCircle.rotVel *= 0.7;
        }

        // Slow down high speeds
        if (Math.abs(this.innerCircle.rotVel) > 0.01) {
            this.innerCircle.torque *= 0.7;
        }
        if (Math.abs(this.outerCircle.rotVel) > 0.01) {
            this.outerCircle.torque *= 0.7;
        }

        if (this.forcingAlignment) {
            this.innerCircle.torque = 0;
            this.outerCircle.torque = 0;
        }

        // ROT VEL UPDATE
        this.innerCircle.rotVel += this.innerCircle.torque;
        this.outerCircle.rotVel += this.outerCircle.torque;

        if (this.preventRotDecay > 0) {
            this.preventRotDecay -= dt;
        } else {
            if (this.innerCircle.rotVel < 0) {
                this.innerCircle.rotVel = Math.min(0, this.innerCircle.rotVel * decayAmtInner + staticAmtInner);
            } else {
                this.innerCircle.rotVel = Math.max(0, this.innerCircle.rotVel * decayAmtInner - staticAmtInner);
            }

            if (this.outerCircle.rotVel < 0) {
                this.outerCircle.rotVel = Math.min(0, this.outerCircle.rotVel * decayAmtOuter + staticAmtOuter);
            } else {
                this.outerCircle.rotVel = Math.max(0, this.outerCircle.rotVel * decayAmtOuter - staticAmtOuter);
            }
        }

        if (Math.abs(this.innerCircle.rotVel) > 0.036) {
            this.innerCircle.rotVel *= 0.98;
        }
        if (Math.abs(this.outerCircle.rotVel) > 0.036) {
            this.outerCircle.rotVel *= 0.98;
        }

        const torqueReleaseThreshold = 0.003; // if torque on release is higher, then full speed ahead
        let lagMultReducer = 1;// Math.max(0, Math.min(1, 2 - dt * 0.5));
        if (this.innerCircle.torque == 0 && Math.abs(this.innerCircle.torqueOnRelease) > 0.001) {
            let isTorqueOpposing = this.innerCircle.torqueOnRelease * this.innerCircle.rotVel < 0;
            if (isTorqueOpposing) {
                this.innerCircle.rotVel *= 0.05;
            } else if (Math.abs(this.innerCircle.torqueOnRelease) > torqueReleaseThreshold) {
                let slowOnRelease = Math.min(1.6, Math.max(1, Math.abs(this.innerCircle.torqueOnRelease) * lagMultReducer / torqueReleaseThreshold));
                this.innerCircle.rotVel *= slowOnRelease;
                this.innerCircle.torque *= slowOnRelease;
                this.innerCircle.nextRotation += this.innerCircle.rotVel;
            }
            this.innerCircle.torqueOnRelease = 0;
        }
        if (this.outerCircle.torque == 0 && Math.abs(this.outerCircle.torqueOnRelease) > 0.001) {
            let isTorqueOpposing = this.outerCircle.torqueOnRelease * this.outerCircle.rotVel < 0;
            if (isTorqueOpposing) {
                this.outerCircle.rotVel *= 0.05;
            } else if (Math.abs(this.outerCircle.torqueOnRelease) > torqueReleaseThreshold) {
                let slowOnRelease = Math.min(1.6, Math.max(1, Math.abs(this.outerCircle.torqueOnRelease) * lagMultReducer / torqueReleaseThreshold));
                this.outerCircle.rotVel *= slowOnRelease;
                this.outerCircle.torque *= slowOnRelease;
                this.outerCircle.nextRotation += this.outerCircle.rotVel;
            }
            this.outerCircle.torqueOnRelease = 0;
        }

        // high torque but low speed = strong push force
        // low torque but high speed = strong stop force
        let spinAmpFromRestInner = Math.abs(this.innerCircle.rotVel) < 0.01 ? 2 : 1;
        let spinAmpFromRestOuter = Math.abs(this.outerCircle.rotVel) < 0.01 ? 2.25 : 1;
        let spinAmtInner = this.innerCircle.rotVel + this.innerCircle.torque * dt * 5.5 * spinAmpFromRestInner;
        let spinAmtOuter = this.outerCircle.rotVel + this.outerCircle.torque * dt * 3 * spinAmpFromRestOuter;

        let spinSlowTimeDilation = 1 - (1-gameVars.timeSlowRatio)*0.02;
        let spinSnapSlowAmtInner = this.handleSpinSnapSlowAmt(this.innerCircle, this.elements);
        let spinSnapSlowAmtOuter = this.handleSpinSnapSlowAmt(this.outerCircle, this.embodiments);

        // spell multiplier slows things down
        let multDrag = 1;
        let spellMult = globalObjects.player.spellMultiplier();
        if (spellMult > 1) {
            multDrag = 0.85;
            if (spellMult > 3) {
                multDrag = 0.6;
            }
        }
        this.innerCircle.prevRotation = this.innerCircle.nextRotation;
        this.outerCircle.prevRotation = this.outerCircle.nextRotation;
        this.innerCircle.nextRotation += spinAmtInner * spinSlowTimeDilation * spinSnapSlowAmtInner * multDrag;
        this.outerCircle.nextRotation += spinAmtOuter * spinSlowTimeDilation * spinSnapSlowAmtOuter * multDrag;

        this.innerCircle.rotation = (this.innerCircle.nextRotation + this.innerCircle.prevRotation) * 0.5;
        this.outerCircle.rotation = (this.outerCircle.nextRotation + this.outerCircle.prevRotation) * 0.5;

        this.autolockRune(1);

        this.innerCircle.torqueDecay = (this.innerCircle.torqueDecay / (1+dt)) + this.innerCircle.torque;
        this.outerCircle.torqueDecay = (this.outerCircle.torqueDecay / (1+dt)) + this.outerCircle.torque;

        this.innerCircle.torque = 0;// 0.6 - lagMultTorque;
        this.outerCircle.torque = 0;//0.6 - lagMultTorque;
    }

    handleSpinSnapSlowAmt(circle, elements) {
        let distToClosestElement = 999;
        let closestRune = null;
        let distToRune = 999;
        for (let i = 0; i < elements.length; i++) {
            distToRune = this.getRotationDiff(circle.rotation, elements[i].startRotation);
            if (Math.abs(distToRune) < Math.abs(distToClosestElement)) {
                distToClosestElement = distToRune;
                closestRune = elements[i];
            }
        }
        let slowAmt = 1;
        if (distToClosestElement < 0.025 && distToClosestElement > 0.001) {
            slowAmt = Math.min(0.9, 0.5 + 10 * Math.abs(circle.rotVel));
        } else if (distToClosestElement > 0.15) {
            slowAmt = 1.5;
        }

        return slowAmt;
    }

    // snap to rune
    autolockRune(dt) {
        if (this.dragCircle.visible) {
            return;
        }

        let distToClosestRuneEmbodiment = 999;
        let distToClosestRuneElement = 999;
        for (let i = 0; i < this.elements.length; i++) {
            let distToRune = this.getRotationDiff(this.innerCircle.nextRotation + this.innerCircle.rotVel * 2, this.elements[i].startRotation);
            if (Math.abs(distToRune) < Math.abs(distToClosestRuneElement)) {
                distToClosestRuneElement = distToRune;
            }
        }
        for (let i = 0; i < this.embodiments.length; i++) {
            let distToRune = this.getRotationDiff(this.outerCircle.nextRotation + this.outerCircle.rotVel * 2, this.embodiments[i].startRotation);
            if (Math.abs(distToRune) < Math.abs(distToClosestRuneEmbodiment)) {
                distToClosestRuneEmbodiment = distToRune;
            }
        }

        let absDistToClosestRuneElement = Math.abs(distToClosestRuneElement);
        if (distToClosestRuneElement < 0.45 && absDistToClosestRuneElement > 0.005) {
            let strengthRatio = Math.min(1, Math.max(0, 1 - absDistToClosestRuneElement * 1.8))
            strengthRatio *= strengthRatio * strengthRatio * strengthRatio;

            this.innerCircle.rotation -= distToClosestRuneElement * strengthRatio;// Math.max(-0.05, Math.min(0.05, turnAmount)) * dt * rotVelMult;
            if (!this.dragCircle.visible) {
                // player isn't pulling
                let absRotVelMult = Math.max(0, 1 - Math.max(0, Math.abs(this.innerCircle.rotVel) * 25));
                this.innerCircle.nextRotation -= distToClosestRuneElement * 0.24 * absRotVelMult;
            }
        }

        let absDistToClosestRuneEmbodiment = Math.abs(distToClosestRuneEmbodiment);
        if (Math.abs(distToClosestRuneEmbodiment) < 0.4 && absDistToClosestRuneEmbodiment > 0.005) {
            let strengthRatio = Math.min(1, Math.max(0, 1 - absDistToClosestRuneEmbodiment * 2))
            strengthRatio *= strengthRatio * strengthRatio * strengthRatio;

            this.outerCircle.rotation -= distToClosestRuneEmbodiment * strengthRatio;// Math.max(-0.05, Math.min(0.05, turnAmount)) * dt * rotVelMult;
            if (!this.dragCircle.visible) {
                // player isn't pulling
                let absRotVelMult = Math.max(0, 1 - Math.max(0, Math.abs(this.outerCircle.rotVel) * 25));
                this.outerCircle.nextRotation -= distToClosestRuneEmbodiment * 0.2 * absRotVelMult;
            }
        }

        // if (this.forcingAlignment) {
        //     if (distToClosestRuneElement < 2) {
        //         let turnAmount = distToClosestRuneElement * 0.05;
        //         this.innerCircle.rotation -= turnAmount * dt;
        //         this.innerCircle.rotVel *= 1 - (0.2 * dt);
        //     }
        //     if (distToClosestRuneEmbodiment < 2) {
        //         let turnAmount = distToClosestRuneEmbodiment * 0.05;
        //         this.outerCircle.rotation -= turnAmount * dt;
        //         this.outerCircle.rotVel *= 1 - (0.2 * dt);
        //     }
        // }
    }

    updateFramesLazy() {
        const key = 'circle';
        if (this.castDisabled) {
            if (this.castButton.frame.name !== 'cast_disabled.png') {
                this.castGlow.alpha = 0.5;
                this.scene.tweens.add({
                    targets: this.castGlow,
                    duration: 1000,
                    ease: 'Quint.easeOut',
                    alpha: 0,
                });
                this.castButton.setTexture(key, 'cast_disabled.png');
            }
        } else if (this.castButton.frame.customData.filename !== this.castButton.lazyFrame) {
            if (this.castButton.frame.customData.filename == 'cast_disabled.png' && this.castButton.lazyFrame == 'cast_normal.png') {
                this.castButtonSpare.alpha = 0.6;
                this.scene.tweens.add({
                    targets: this.castButtonSpare,
                    duration: 400,
                    ease: 'Cubic.easeOut',
                    alpha: 0,
                });
                // this.castButtonFlash.alpha = 0.15;
                // this.scene.tweens.add({
                //     targets: this.castButtonFlash,
                //     duration: 300,
                //     ease: 'Quad.easeOut',
                //     alpha: 0,
                // });
            }
            this.castButton.setTexture(key, this.castButton.lazyFrame);
        }
        if (this.innerCircle.frame.customData.filename !== this.innerCircle.lazyFrame) {
            this.innerCircle.setTexture(key, this.innerCircle.lazyFrame).setOrigin(0.50012, 0.500);
        }
        if (this.outerCircle.lazyFrame && this.outerCircle.frame.customData.filename !== this.outerCircle.lazyFrame) {
            this.outerCircle.setTexture(key, this.outerCircle.lazyFrame).setOrigin(0.4999, 0.5000001);
        }
    }


     updateShields(dScale) {
         let playerStatuses = globalObjects.player.getStatuses();
         let shieldObjects = [];
         for (let i = 0; i < this.tempRotObjs.length; i++) {
             this.tempRotObjs[i].rotation = this.tempLockRot + this.outerCircle.rotation;
         }
         let matterBlock = playerStatuses['matterUnload'];
         if (matterBlock) {
             let fullShield = matterBlock.animObj[0];
             fullShield.rotation = this.outerCircle.rotation;
         }
         for (let i = 0; i < 10; i++) {
             if (playerStatuses['shield' + i]) {
                 shieldObjects.push(playerStatuses['shield' + i]);
             }
         }
         for (let i = 0; i < shieldObjects.length; i++) {
             let shieldObj = shieldObjects[i];
             if (shieldObj.animObj[0] === this.tempRotObjs[0]) {
                 this.tempRotObjs = [];
             }
             let distFromCenter = 0;
             switch(shieldObj.type) {
                 case 'mind':
                     const painStartRot = 0.28 + shieldObj.multiplier * 0.03;
                     let goalRotMind = shieldObj.lockRotation + this.outerCircle.rotation;
                     if (!shieldObj.isLocked) {
                        shieldObj.animObj[0].rotation = goalRotMind;
                     }
                     if (shieldObj.isBlasting) {
                         shieldObj.animObj[2].visible = true;
                         let impactRotation = goalRotMind + shieldObj.animObj[2].rotateOffset;
                         shieldObj.animObj[2].rotation = impactRotation;
                         let sinX = Math.sin(impactRotation);
                         let cosY = Math.cos(impactRotation);
                         shieldObj.animObj[2].x = shieldObj.animObj[2].startX + sinX * 210;
                         shieldObj.animObj[2].y = shieldObj.animObj[2].startY - cosY * 210 + 220;

                         shieldObj.textObj.x = shieldObj.animObj[2].startX + sinX * 150;
                         shieldObj.textObj.y = shieldObj.animObj[2].startY - cosY * 150 + 175;
                     } else if (shieldObj.impactVisibleTime > 0) {
                         shieldObj.animObj[2].visible = true;
                         shieldObj.impactVisibleTime = Math.max(0, shieldObj.impactVisibleTime - dScale);
                         let impactRotation = goalRotMind + shieldObj.animObj[2].rotateOffset;
                         shieldObj.animObj[2].rotation = impactRotation;
                         let sinX = Math.sin(impactRotation);
                         let cosY = Math.cos(impactRotation);
                         shieldObj.animObj[2].x = shieldObj.animObj[2].startX + sinX * 220;
                         shieldObj.animObj[2].y = shieldObj.animObj[2].startY - cosY * 220 + 220;

                         shieldObj.textObj.x = shieldObj.animObj[2].startX + sinX * 150;
                         shieldObj.textObj.y = shieldObj.animObj[2].startY - cosY * 150 + 175;
                     } else if (shieldObj.animObj[2].visible) {
                         shieldObj.animObj[2].visible = false;
                     }

                     distFromCenter = Math.abs(shieldObj.animObj[0].rotation);
                     if (distFromCenter < painStartRot) {
                         if (!shieldObj.active) {
                             shieldObj.active = true;
                             this.scene.tweens.add({
                                 targets: shieldObj.animObj[0],
                                 duration: 275,
                                 scaleX: shieldObj.animObj[0].origScaleX * 1.05,
                                 easeParams: [4],
                                 scaleY: 1,
                                 ease: 'Back.easeOut',
                             });
                             // reticle
                         }
                     } else if (distFromCenter > painStartRot * 1.1) {
                         if (shieldObj.active) {
                             shieldObj.active = false;
                             if (shieldObj.animObj[0].currAnim) {
                                 shieldObj.animObj[0].currAnim.stop();
                             }
                             this.scene.tweens.add({
                                 targets: shieldObj.animObj[0],
                                 duration: 275,
                                 scaleX: shieldObj.animObj[0].origScaleX - 0.2,
                                 scaleY: 0.985,
                                 ease: 'Cubic.easeOut'
                             });
                         }
                     }
                    shieldObj.animObj[0].alpha = shieldObj.active ? 0.82 : 0.5;
                    shieldObj.animObj[1].visible = shieldObj.active;

                     break;
                 case 'matter':
                     const blockStartRot = 0.54 + shieldObj.multiplier * 0.03;
                     let goalRotMatter = shieldObj.lockRotation + this.outerCircle.rotation;
                     shieldObj.animObj[0].rotation = goalRotMatter;
                     shieldObj.animObj[1].x = shieldObj.animObj[1].startX + Math.sin(goalRotMatter) * 222;
                     shieldObj.animObj[1].y = shieldObj.animObj[1].startY - Math.cos(goalRotMatter) * 222 + 222;
                    if (shieldObj.impactVisibleTime > 0) {
                        shieldObj.animObj[2].visible = true;
                        shieldObj.impactVisibleTime = Math.max(0, shieldObj.impactVisibleTime - dScale);
                        let impactRotation = goalRotMatter + shieldObj.animObj[2].rotateOffset;
                        shieldObj.animObj[2].rotation = impactRotation;
                        shieldObj.animObj[2].x = shieldObj.animObj[2].startX + Math.sin(impactRotation) * 225;
                        shieldObj.animObj[2].y = shieldObj.animObj[2].startY - Math.cos(impactRotation) * 225 + 225;
                    } else if (shieldObj.animObj[2].visible) {
                        shieldObj.animObj[2].visible = false;
                    }

                     distFromCenter = Math.abs(shieldObj.animObj[0].rotation);
                     if (shieldObj.shakeAmt > 0) {
                         let shakeOffset = shieldObj.shakeAmt * (Math.random() - 0.5);
                         shieldObj.shakeAmt = Math.max(0, shieldObj.shakeAmt - dScale * 0.012);
                         shieldObj.animObj[0].rotation += shakeOffset;
                     }
                     if (distFromCenter < blockStartRot) {
                         if (!shieldObj.active) {
                             shieldObj.active = true;
                             shieldObj.animObj[0].alpha = 1;
                             shieldObj.animObj[1].alpha = 1;
                             this.scene.tweens.add({
                                 targets: shieldObj.animObj[0],
                                 duration: 275,
                                 scaleX: shieldObj.animObj[0].origScaleX,
                                 easeParams: [3],
                                 scaleY: 1,
                                 ease: 'Back.easeOut',
                             });
                         }
                     } else if (distFromCenter > blockStartRot * 1.1) {
                         if (shieldObj.active) {
                             shieldObj.active = false;
                             shieldObj.animObj[0].alpha = 0.75;
                             shieldObj.animObj[1].alpha = 0.75;
                             if (shieldObj.animObj[0].currAnim) {
                                 shieldObj.animObj[0].currAnim.stop();
                             }
                             this.scene.tweens.add({
                                 targets: shieldObj.animObj[0],
                                 duration: 275,
                                 scaleX: shieldObj.animObj[0].origScaleX - 0.06,
                                 scaleY: 0.99,
                                 ease: 'Cubic.easeOut',
                             });
                         }
                     }
                     break;
                 case 'time':
                     const blockTimeStartRot = 0.52 + shieldObj.multiplier * 0.03;
                     let goalRotTime = shieldObj.lockRotation + this.outerCircle.rotation;
                     let goalRotTime1 = goalRotTime;
                     if (goalRotTime > shieldObj.animObj[1].rotation + Math.PI * 2) {
                         shieldObj.animObj[1].rotation += Math.PI * 2;
                     } else if (goalRotTime < shieldObj.animObj[1].rotation - Math.PI * 2) {
                         shieldObj.animObj[1].rotation -= Math.PI * 2;
                     }
                     let goalRotTime2 = goalRotTime * 0.5 + shieldObj.animObj[1].rotation * 0.5;
                     shieldObj.animObj[0].rotation = goalRotTime1;
                     shieldObj.animObj[1].rotation = goalRotTime2;

                     distFromCenter = Math.abs(shieldObj.animObj[0].rotation);
                     if (shieldObj.shakeAmt > 0) {
                         let shakeOffset = shieldObj.shakeAmt * (Math.random() - 0.5);
                         shieldObj.shakeAmt = Math.max(0, shieldObj.shakeAmt - dScale * 0.012);
                         shieldObj.animObj[0].rotation += shakeOffset;
                         shieldObj.animObj[1].rotation += shakeOffset * 0.5;
                     }
                     if (distFromCenter < blockTimeStartRot) {
                         if (!shieldObj.active) {
                             shieldObj.active = true;
                             shieldObj.animObj[0].alpha = 0.85;
                             shieldObj.animObj[1].alpha = 0.85;
                             this.scene.tweens.add({
                                 targets: [shieldObj.animObj[0], shieldObj.animObj[1]],
                                 duration: 250,
                                 scaleX: shieldObj.animObj[0].origScaleX,
                                 scaleY: 0.965,
                                 ease: 'Cubic.easeOut',
                             });
                         }
                     } else if (distFromCenter > blockTimeStartRot * 1.1) {
                         if (shieldObj.active) {
                             shieldObj.active = false;
                             shieldObj.animObj[0].alpha = 0.5;
                             shieldObj.animObj[1].alpha = 0.5;
                             this.scene.tweens.add({
                                 targets: [shieldObj.animObj[0], shieldObj.animObj[1]],
                                 duration: 250,
                                 scaleX: shieldObj.animObj[0].origScaleX - 0.35,
                                 scaleY: 0.95,
                                 ease: 'Cubic.easeOut',
                             });
                         }
                     }
                     break;
                 case 'void':
                     let goalRotVoid = shieldObj.lockRotation + this.outerCircle.rotation;

                     let shieldArray = shieldObj.animObj[0];
                     let shieldEyes = shieldObj.animObj[1];
                     let shieldGlow = shieldObj.animObj[2];
                     shieldGlow.rotation = goalRotVoid;
                     shieldObj.jiggleAmt = Math.max(0, shieldObj.jiggleAmt - 0.01 * dScale);
                     let shieldMidPoint = (shieldArray.length - 1)/2;
                     for (let i = 0; i < shieldArray.length; i++) {
                         let distFromMid = shieldMidPoint - i;
                         distFromMid *= distFromMid;
                         let rotationOffset = shieldObj.spreadAmt * shieldArray[i].rotationOffset;
                         shieldArray[i].x = shieldArray[i].startX + Math.sin(goalRotVoid + rotationOffset) * (206 + distFromMid * -0.8);
                         shieldArray[i].y = shieldArray[i].startY - Math.cos(goalRotVoid + rotationOffset) * (210 + distFromMid * -0.8) - 10;
                         shieldArray[i].scaleVel += ((Math.random() - 0.45) * (0.003 + shieldObj.jiggleAmt * 0.08) + ((0.95 - distFromMid * 0.01) - shieldArray[i].scaleX) * (0.005 + shieldObj.jiggleAmt * 0.008)) * dScale;
                         shieldArray[i].scaleVel *= 1 - (0.03 + shieldObj.jiggleAmt * 0.02) * dScale;
                         shieldArray[i].setScale(shieldArray[i].scaleX + shieldArray[i].scaleVel);
                     }
                     for (let i = 0; i < shieldEyes.length; i++) {
                         shieldEyes[i].x = shieldEyes[i].startX + Math.sin(goalRotVoid + shieldEyes[i].rotationOffset) * 206;
                         shieldEyes[i].y = shieldEyes[i].startY - Math.cos(goalRotVoid + shieldEyes[i].rotationOffset) * 209 - 11;
                         shieldEyes[i].rotVel += (Math.random() - 0.5) * 0.02 * dScale;
                         shieldEyes[i].rotVel *= 1 - 0.02 * dScale;
                         shieldEyes[i].rotation += shieldEyes[i].rotVel;
                     }
                     if (Math.random() < (0.003 + shieldEyes.length* 0.001) * dScale) {
                        let randIndex = Math.floor(Math.random() * shieldEyes.length);
                         this.scene.tweens.add({
                             targets: shieldEyes[randIndex],
                             duration: 150,
                             scaleX: 0.1,
                             ease: 'Cubic.easeIn',
                             onComplete: () => {
                                 this.scene.tweens.add({
                                     targets: shieldEyes[randIndex],
                                     duration: 150,
                                     scaleX: 1,
                                     ease: 'Cubic.easeOut'
                                 });
                             }
                         });
                     }

                     distFromCenter = Math.abs(goalRotVoid);

                     if (distFromCenter < 0.48) {
                         shieldObj.active = true;
                         shieldObj.spreadAmt += (1 - shieldObj.spreadAmt) * 0.1 * dScale;
                         for (let i = 0; i < shieldArray.length; i++) {
                             shieldArray[i].scaleVel += 0.001 * dScale;
                         }
                     } else if (distFromCenter > 0.48 * 1.1) {
                         shieldObj.active = false;
                         shieldObj.spreadAmt += (0.8 - shieldObj.spreadAmt) * 0.1 * dScale;
                     }
                     break;
             }
         }
     }

    getRotationDiff(rot1, rot2) {
        let diffAmt = rot1 - rot2;
        while (diffAmt > 3.142) {
            diffAmt -= Math.PI * 2;
        }
        while (diffAmt < -3.142) {
            diffAmt += Math.PI * 2;
        }
        return diffAmt;
    }

    castSpell(wasBuffered = false) {
        if (this.manualDisabled) {
            return;
        }
        this.castDisabled = true;
        this.useBufferedSpellCast = false;
        this.bufferedCastAvailable = false;
        let distToClosestRuneElement = 999;
        let distToClosestRuneEmbodiment = 999;
        let closestElement = null;
        let closestEmbodiment = null;

        let shieldId = 0;
        if (wasBuffered) {
            if (this.castHoverTempAnim) {
                this.castHoverTempAnim.stop();
            }
            this.castHoverTemp.alpha = 1;
            this.castHoverTempAnim = this.scene.tweens.add({
                targets: this.castHoverTemp,
                duration: 500,
                ease: 'Cubic.easeOut',
                alpha: 0,
            });
        }
        for (let i = 0; i < this.elements.length; i++) {
            let distToRune = this.getRotationDiff(this.innerCircle.rotation, this.elements[i].startRotation);
            if (Math.abs(distToRune) < Math.abs(distToClosestRuneElement)) {
                distToClosestRuneElement = distToRune;
                // I messed up and inversed
                let idx = this.elements.length - i;
                if (i == 0) {
                    idx = 0;
                }
                closestElement = this.elements[idx];
            }
        }

        if (Math.abs(distToClosestRuneElement) > 0.24 || closestElement.burnedOut) {
            // No closest usable rune
            closestElement = null;
        }

        for (let i = 0; i < this.embodiments.length; i++) {
            let distToRune = this.getRotationDiff(this.outerCircle.rotation, this.embodiments[i].startRotation);
            if (Math.abs(distToRune) < Math.abs(distToClosestRuneEmbodiment)) {
                distToClosestRuneEmbodiment = distToRune;
                let idx = this.embodiments.length - i;
                if (i == 0) {
                    idx = 0;
                }
                closestEmbodiment = this.embodiments[idx];
                shieldId = idx;
            }
        }

        if (Math.abs(distToClosestRuneEmbodiment) > 0.22 || closestEmbodiment.burnedOut) {
            closestEmbodiment = null;
            shieldId = -1;
        }
        if (closestElement && closestElement.runeName == null) {
            closestElement = null;
        }
        if (closestEmbodiment && closestEmbodiment.runeName == null) {
            closestEmbodiment = null;
        }

        if (closestElement !== null && closestEmbodiment !== null) {
            // Casting the spell now
            if (!cheats.infiniteAmmo) {
                closestElement.glow.visible = false;
                closestEmbodiment.glow.visible = false;
                closestElement.burnedOut = true;
                closestEmbodiment.burnedOut = true;
            }

            this.forcingAlignment = true;
            this.outerCircle.rotVel *= 0.01;
            this.innerCircle.rotVel *= 0.01;

            this.createElementCast(closestElement);
            this.createEmbodimentCast(closestEmbodiment);

            if (this.spellNameTextAnim) {
                this.spellNameTextAnim.stop();
            }
            this.spellNameTextAnim = this.scene.tweens.add({
                targets: [this.spellNameText, this.spellElementText, this.spellActionText],
                delay: 50,
                ease: 'Cubic.easeIn',
                alpha: 0,
                duration: 400,
            });
            messageBus.publish('spellClicked');
            PhaserScene.time.delayedCall(1250, () => {
                this.trueCastSpell(closestElement, closestEmbodiment, shieldId, closestEmbodiment.startRotation);
            });
        } else {
            // failed cast
            let retryDelay = this.keyboardCasted ? 800 : 500;
            PhaserScene.time.delayedCall(retryDelay - 250, () => {
                this.bufferedCastAvailable = true;
                PhaserScene.time.delayedCall(250, () => {
                    this.castDisabled = false;
                    this.bufferedCastAvailable = false;
                    if (this.useBufferedSpellCast) {
                        this.castSpell(true);
                    }
                });
            });
            if (closestElement == null) {
                this.flashElement(this.errorBoxElement);
            }
            if (closestEmbodiment == null) {
                this.flashElement(this.errorBoxEmbodiment);
            }
        }

        let hasRemainingElement = false;
        let hasRemainingEmbodiment = false;
        for (let i = 0; i < this.elements.length; i++) {
            if (!this.elements[i].burnedOut && this.elements[i].runeName != null) {
                hasRemainingElement = true;
                break;
            }
        }
        for (let i = 0; i < this.embodiments.length; i++) {
            if (!this.embodiments[i].burnedOut && this.embodiments[i].runeName != null) {
                hasRemainingEmbodiment = true;
                break;
            }
        }
        if (!hasRemainingElement || !hasRemainingEmbodiment) {
            this.innerDragDisabled = true;
            this.outerDragDisabled = true;
            this.castDisabled = true;
            this.disableSpellDescDisplay = true;
            this.recharging = true;
            this.lastDragTime = -1000;
            messageBus.publish("resetCircle")
            this.scene.tweens.add({
                targets: this.innerCircle,
                delay: 0,
                ease: 'Back.easeIn',
                easeParams: [1.1],
                onComplete: () => {
                    this.resetElements();
                    this.innerDragDisabled = false;
                    if (!this.innerDragDisabled && !this.outerDragDisabled) {
                        this.castDisabled = false;
                        this.recharging = false;
                        this.bufferedCastAvailable = false;
                    }
                },
                duration: 1800,
                rotation: "+=6.283"
            });

            this.scene.tweens.add({
                targets: this.outerCircle,
                delay: 0,
                easeParams: [1.1],
                ease: 'Back.easeIn',
                onComplete: () => {
                    this.resetEmbodiments();
                    this.outerDragDisabled = false;
                    if (!this.innerDragDisabled && !this.outerDragDisabled) {
                        this.castDisabled = false;
                        this.recharging = false;
                        this.bufferedCastAvailable = false;
                    }
                },
                duration: 1800,
                rotation: "-=6.283"
            });
        }
    }

    manualResetElements(elemUsed, useLongDelay = false) {
        this.innerDragDisabled = true;
        this.castDisabled = true;
        this.recharging = true;
        this.lastDragTime = -1000;
        let spinAmt = useLongDelay ? "+=12.566" : "+=6.283"
        this.scene.tweens.add({
            targets: this.innerCircle,
            ease: 'Back.easeIn',
            easeParams: [useLongDelay ? 0.9 : 1.1],
            onComplete: () => {
                this.resetElements(elemUsed);
                this.innerDragDisabled = false;
            },
            duration: useLongDelay ? 2100 : 1200,
            rotation: spinAmt
        });
    }

    resetElements(runeToNotReset) {
        this.lastDragTime = 0;
        for (let i = 0; i < this.elements.length; i++) {
            if (!runeToNotReset || runeToNotReset != this.elements[i]) {
                this.elements[i].glow.visible = true;
                this.elements[i].burnedOut = false;
            }
        }
        let sprite = this.elemCircle;
        if (!sprite) {
            this.elemCircle = this.scene.add.sprite(this.x, this.y, 'circle', 'circle.png');
            sprite = this.elemCircle;
            sprite.setDepth(101);
        }

        sprite.setScale(0.8).setAlpha(1);
        this.innerCircle.prevRotation = this.innerCircle.rotation;
        this.innerCircle.nextRotation = this.innerCircle.rotation;
        this.scene.tweens.add({
            targets: sprite,
            alpha: 0,
            scaleX: 1,
            scaleY: 1,
            duration: 500,
        });
    }


     manualResetEmbodiments(embodiUsed, useLongDelay = false) {
         this.outerDragDisabled = true;
         this.castDisabled = true;
         this.disableSpellDescDisplay = true;
         this.recharging = true;
         this.lastDragTime = -1000;
         PhaserScene.time.delayedCall(250, () => {
             this.bufferedCastAvailable = true;
         });

        let spinAmt = useLongDelay ? "+=12.566" : "+=6.283"
         this.scene.tweens.add({
             targets: this.outerCircle,
             ease: 'Back.easeIn',
            easeParams: [useLongDelay ? 1.1 : 1.25],
             onComplete: () => {
                 this.resetEmbodiments(embodiUsed);
                 this.outerDragDisabled = false;
                 setTimeout(() => {
                     if (!this.outerDragDisabled) {
                        if (useLongDelay) {
                            this.disableSpellDescDisplay = false;
                        }
                         this.castDisabled = false;
                         this.recharging = false;
                         this.bufferedCastAvailable = false;
                         if (this.useBufferedSpellCast) {
                             this.castSpell(true);
                         }
                         if (!this.readySprite) {
                             this.readySprite = this.scene.add.sprite(this.x, this.y, 'circle').play('circleEffect').setScale(1.1).setDepth(100000);
                         } else {
                             this.readySprite.visible = true;
                             this.readySprite.play(useLongDelay ? 'circleEffect' : 'circleEffectSmall');
                             this.readySprite.setScale(1.1);
                         }

                         this.scene.tweens.add({
                             targets: this.readySprite,
                             scaleX: useLongDelay ? 2.2 : 1.75,
                             scaleY: useLongDelay ? 2.2 : 1.75,
                             duration: useLongDelay ? 1200 : 600,
                             ease: 'Cubic.easeOut',
                             onComplete: () => {
                                 this.readySprite.visible = false;
                             }
                         });
                     }
                 }, useLongDelay ? 800 : 0)
             },
             duration: useLongDelay ? 2100 : 1200,
             rotation: spinAmt
         });
     }

    resetEmbodiments(runeToNotReset) {
        this.lastDragTime = 0;
        for (let i = 0; i < this.embodiments.length; i++) {
            if (!runeToNotReset || runeToNotReset != this.embodiments[i]) {
                this.embodiments[i].glow.visible = true;
                this.embodiments[i].burnedOut = false;
            }
        }
        let sprite = this.embodiCircle;
        if (!sprite) {
            this.embodiCircle = this.scene.add.sprite(this.x, this.y, 'circle', 'circle.png');
            sprite = this.embodiCircle;
            sprite.setDepth(100);
        }
        sprite.setAlpha(0).setScale(1.05);

        messageBus.publish("wheelReloaded");
        this.outerCircle.prevRotation = this.outerCircle.rotation;
        this.outerCircle.nextRotation = this.outerCircle.rotation;
        this.scene.tweens.add({
            targets: sprite,
            alpha: 0,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 500,
            completeDelay: 500,
            onComplete: () => {
                // this.disableSpellDescDisplay = false;
            }
        });
    }

    createElementCast(elem) {
        let elemName = elem.runeName;
        let sprite = this.elementsAnimArray[elemName];
        if (!sprite) {
            sprite = this.scene.add.sprite(0, -999, 'circle', elemName + '_glow' + '.png');
            sprite.setOrigin(0.5, 0.14);
            this.elementsAnimArray[elemName] = sprite;
            sprite.setDepth(119);
        }

        let castCircle = poolManager.getItemFromPool('castCircle');
        if (!castCircle) {
            castCircle = this.scene.add.sprite(this.x, this.y - 100, 'circle', 'cast_circle.png');
            castCircle.setDepth(120);
        }
        castCircle.alpha = 0;
        castCircle.setScale(1.25);
        castCircle.rotation = 0;

        sprite.setPosition(this.x + Math.sin(elem.rotation) * 115, this.y - Math.cos(elem.rotation) * 115);
        sprite.setAlpha(1);
        castCircle.setPosition(sprite.x, sprite.y);
        sprite.setScale(1.07);
        this.scene.tweens.add({
            targets: sprite,
            duration: 100,
            ease: 'Cubic.easeOut',
            scaleX: isMobile ? 1.5 : 1.4,
            scaleY: isMobile ? 1.5 : 1.4,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: sprite,
                    ease: 'Cubic.easeOut',
                    duration: 350,
                    scaleX: isMobile ? 1.075 : 1.05,
                    scaleY: isMobile ? 1.075 : 1.05
                });
            }
        });


        this.scene.tweens.add({
            targets: castCircle,
            duration: 250,
            alpha: 0.85
        });

        this.scene.tweens.add({
            targets: castCircle,
            ease: 'Cubic.easeIn',
            onComplete: () =>
            {
                castCircle.alpha = 1;
                this.scene.tweens.add({
                    targets: castCircle,
                    duration: 650,
                    delay: 30,
                    ease: 'Quart.easeInOut',
                    rotation: -1.57,
                    alpha: 0.5
                });

                this.scene.tweens.add({
                    targets: [sprite, castCircle],
                    ease: 'Quart.easeInOut',
                    delay: 60,
                    onComplete: () => {
                        this.scene.tweens.add({
                            targets: [sprite, castCircle],
                            alpha: 0,
                            scaleX: 1.5,
                            scaleY: 1.5,
                            duration: 500,
                            onComplete: () => {
                                poolManager.returnItemToPool(castCircle, 'castCircle');

                                sprite.setScale(1, 1);
                            }
                        });
                    },
                    duration: 840,
                    x: this.x - 28,
                    y: this.y - 224
                });
            },
            duration: 250,
            scaleX: 1,
            scaleY: 1
        });
    }

    createEmbodimentCast(elem) {
        let elemName = elem.runeName;
        let sprite = this.embodimentsAnimArray[elemName];
        if (!sprite) {
            sprite = this.scene.add.sprite(0, -999, 'circle', elemName + '_glow' + '.png');
            sprite.setOrigin(0.5, 0.14);
            this.elementsAnimArray[elemName] = sprite;
            sprite.setDepth(119);
        }
        let castCircle = poolManager.getItemFromPool('castCircle');
        if (!castCircle) {
            castCircle = this.scene.add.sprite(this.x, this.y - 100, 'circle', 'cast_circle.png');
            castCircle.setDepth(120);
        }
        castCircle.alpha = 0;
        castCircle.setScale(1.25);
        castCircle.rotation = 0;

        sprite.setPosition(this.x + Math.sin(elem.rotation) * 175, this.y - Math.cos(elem.rotation) * 175);
        sprite.setAlpha(1);
        castCircle.setPosition(sprite.x, sprite.y);

        sprite.setScale(1.07);
        this.scene.tweens.add({
            targets: sprite,
            duration: 100,
            ease: 'Cubic.easeOut',
            scaleX: isMobile ? 1.55 : 1.44,
            scaleY: isMobile ? 1.55 : 1.44,
            completeDelay: isMobile ? 50 : 0,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: sprite,
                    ease: 'Cubic.easeOut',
                    duration: 350,
                    scaleX: isMobile ? 1.075 : 1.05,
                    scaleY: isMobile ? 1.075 : 1.05
                });
            }
        });

        this.scene.tweens.add({
            targets: castCircle,
            duration: 250,
            alpha: 0.85,
        });

        this.scene.tweens.add({
            targets: this.castTriangles,
            duration: 200,
            alpha: 0
        });

        this.scene.tweens.add({
            targets: castCircle,
            ease: 'Cubic.easeIn',
            onComplete: () => {
                castCircle.alpha = 1;
                this.scene.tweens.add({
                    targets: castCircle,
                    duration: 650,
                    delay: 30,
                    ease: 'Quart.easeInOut',
                    rotation: 1.57,
                    alpha: 0.5
                });
                this.scene.tweens.add({
                    delay: 340,
                    targets: this.castTriangles[0],
                    duration: 300,
                    alpha: 0.6,
                    ease: 'Cubic.easeOut'
                });
                this.scene.tweens.add({
                    delay: 600,
                    targets: this.castTriangles[1],
                    duration: 200,
                    alpha: 0.6,
                    ease: 'Cubic.easeOut'
                });
                this.scene.tweens.add({
                    targets: [sprite, castCircle],
                    ease: 'Quart.easeInOut',
                    delay: 60,
                    duration: 840,
                    x: this.x + 28,
                    y: this.y - 224,
                    onStart: () => {
                        let stopForceAlignmentDelay = this.keyboardCasted ? 350 : 0;
                        PhaserScene.time.delayedCall(stopForceAlignmentDelay, () => {
                            this.forcingAlignment = false;
                        });
                    },
                    onComplete: () => {
                        PhaserScene.time.delayedCall(250, () => {
                            this.bufferedCastAvailable = true;
                        });
                        this.scene.tweens.add({
                            targets: this.castTriangles[2],
                            duration: 200,
                            alpha: 0.6,
                            ease: 'Cubic.easeOut'
                        });
                        this.scene.tweens.add({
                            delay: 450,
                            targets: this.castTriangles,
                            duration: 100,
                            alpha: 1,
                            ease: 'Cubic.easeOut'
                        });
                        this.scene.tweens.add({
                            targets: [sprite, castCircle],
                            alpha: 0,
                            scaleX: 1.5,
                            scaleY: 1.5,
                            duration: 500,
                            onComplete: () => {
                                poolManager.returnItemToPool(castCircle, 'castCircle');
                                sprite.setScale(1);
                                let reEnableDelay = this.keyboardCasted ? 400 : 0;

                                PhaserScene.time.delayedCall(reEnableDelay, () => {
                                    if (!this.outerDragDisabled) {
                                        this.castDisabled = false;
                                    }
                                    if (this.spellNameTextAnim) {
                                        this.spellNameTextAnim.stop();
                                    }
                                    this.spellNameTextAnim = this.scene.tweens.add({
                                        targets: [this.spellNameText, this.spellActionText, this.spellElementText],
                                        delay: 1400,
                                        alpha: 0.55,
                                        duration: 150,
                                        onComplete: () => {
                                            this.disableSpellDescDisplay = false;
                                        }
                                    });
                                    this.bufferedCastAvailable = false;
                                    if (this.useBufferedSpellCast) {
                                        this.castSpell(true);
                                    }
                                });
                            }
                        });
                    }
                });
            },
            duration: 250,
            scaleX: 1,
            scaleY: 1
        });
    }

    showReadySprite(light = true, scaleMult = 1) {
        if (this.readySprite) {
            console.log("readysprite");
            if (this.readySprite.currAnim) {
                this.readySprite.currAnim.stop();
            }
            this.readySprite.setScale(1.15 * scaleMult);
            this.readySprite.play(light ? 'circleEffect' : 'circleEffectSmall');
            this.readySprite.visible = true;
            let goalScale = (light ? 1.8 : 1.75)*scaleMult;
            this.readySprite.currAnim = this.scene.tweens.add({
                targets: this.readySprite,
                scaleX: goalScale,
                scaleY: goalScale,
                duration: light ? 800 : 650,
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    this.readySprite.visible = false;
                }
            });
        }
    }

    trueCastSpell(elem, embodi, shieldId = -1, rotation) {
        let actualShieldId = shieldId != -1 ? 'shield' + shieldId : 'undefinedShield';
        messageBus.publish('castSpell', elem, embodi, actualShieldId, rotation);
    }

    setAuraAlpha(alpha = 0.02) {
        this.aura.alpha = alpha;
    }

    flashElement(elem) {
        if (!this.playErrorSfxCooldown) {
            playSound('fizzle', 0.8)
            this.playErrorSfxCooldown = true;
            setTimeout(() => {
                this.playErrorSfxCooldown = false;
            }, 300)
        }
        elem.setAlpha(0.25);
        elem.setScale(0.98);
        this.scene.tweens.add({
            targets: elem,
            ease: 'Cubic.easeIn',
            scaleX: 1.02,
            scaleY: 1.02,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: elem,
                    ease: 'Cubic.easeOut',
                    duration: isMobile ? 750 : 600,
                    scaleX: 1,
                    scaleY: 1,
                    alpha: 0
                });
            },
            duration: 50,
            alpha: isMobile ? 0.8 : 0.7
        });
    }

    getDelayedDamageClockScale() {
        return 0.5 + 0.1 * Math.floor(this.delayedDamage / this.delayedDamageBase);
    }

    plainUpdateDelayedDamageVisual(scale) {
        this.delayDamageHourglass.setScale(scale - 0.1);
        let closestBase = Math.floor(this.delayedDamage / this.delayedDamageBase) * this.delayedDamageBase;
        if (closestBase > 0) {
            this.delayDamageSandFull.alpha = 1;
            this.delayDamageSandFull.setScale(scale - 0.28);
        } else {
            this.delayDamageSandFull.setScale(0);
        }

        let rotateAmt = (this.delayedDamage - closestBase) / this.delayedDamageBase * 6.283 - 1.5708;
        let xPos = this.delayDamageHourglass.x;
        let yPos = this.delayDamageHourglass.y;
        let size = 98 * this.delayDamageHourglass.scaleX;
        this.delayDamagePartial.visible = true;
        this.delayDamagePartial.canCleanup = true;
        this.delayDamagePartial.clear();
        this.delayDamagePartial.slice(xPos, yPos, size, -1.5708, rotateAmt, false)
        this.delayDamagePartial.fillPath();
    }

    clearClock() {
        if (this.delayDamagePartial && this.delayDamagePartial.canCleanup) {
            this.delayDamagePartial.clear();
            this.delayDamagePartial.canCleanup = false;
        }
        this.scene.tweens.add({
            delay: 100,
            targets: [this.delayDamageHourglass, this.delayDamageSandFull, this.delayDamageText],
            ease: 'Back.easeIn',
            scaleX: 0,
            scaleY: 0,
            duration: 400,
            alpha: 0
        });
    }

     handleStatusesTicked() {
        if (this.delayedDamage > 0) {
            if (this.delayedDamageShouldTick) {
                this.tickDelayedDamage();
                let scale = this.getDelayedDamageClockScale();
                this.plainUpdateDelayedDamageVisual(scale);

                if (this.delayedDamage <= this.delayedDamageBase) {
                    this.delayedDamageShouldTick = false;
                }
                if (this.delayedDamage <= 0) {
                    this.clearClock()
                }
            } else {
                this.delayedDamageShouldTick = true;
            }
        }
     }

     tickDelayedDamage(amt = 1) {
         this.delayedDamage -= amt;
         this.delayDamageText.setText(this.delayedDamage);
         // this.delayDamageSandFull.setScale(0.03 + Math.min(1, this.delayedDamage / this.delayedDamageBase));
         messageBus.publish('selfTakeTrueDamage', amt);
     }

     getDelayedDamage() {
        return this.delayedDamage;
     }

     enableVoidArm(delay, duration, scale) {
        let useBig = scale > 1.3;
         this.voidArm.setScale(useBig ? scale * 0.95 : scale * 1.15);
         this.scene.tweens.add({
             targets: this.voidArm,
             delay: delay,
             duration: duration - 900,
             y: 210,
             onComplete: () => {
                 this.scene.tweens.add({
                     targets: this.voidArm,
                     alpha: 0,
                     duration: 400,
                     ease: 'Cubic.easeIn',
                 });
             }
         });
         this.scene.tweens.add({
             targets: this.voidArm,
             delay: delay,
             duration: 350,
             ease: useBig ? 'Back.easeOut' : 'Quad.easeOut',
             easeParams: [5],
             alpha: 1,
             scaleX: scale,
             scaleY: scale
         });

         if (useBig) {
             this.voidArm2.setScale(useBig ? scale * 0.95 : scale * 1.15);
             this.scene.tweens.add({
                 targets: this.voidArm2,
                 delay: delay,
                 duration: duration - 900,
                 y: 210,
                 onComplete: () => {
                     this.scene.tweens.add({
                         targets: this.voidArm2,
                         alpha: 0,
                         duration: 400,
                         ease: 'Cubic.easeIn',
                     });
                 }
             });
             this.scene.tweens.add({
                 targets: this.voidArm2,
                 delay: delay,
                 duration: 350,
                 ease: 'Back.easeOut',
                 easeParams: [5],
                 alpha: 1,
                 scaleX: scale,
                 scaleY: scale
             });
         }
     }

     addDelayedDamage(amt) {
        let oldDelayedDamage = this.delayedDamage;
         this.delayedDamage += amt;

        if (globalObjects.player.canResetRecentDamage) {

            globalObjects.player.canResetRecentDamage = false;
            globalObjects.player.recentlyTakenDamageAmt = 0;
            globalObjects.player.recentlyTakenDelayedDamageAmt = 0;
            globalObjects.player.lastInjuryHealth = globalObjects.player.health;

        }
        globalObjects.player.addRecentlyTakenDelayedDamage(amt);

         if (this.delayedDamage > 0) {
             this.delayDamageText.setText(this.delayedDamage);
             let scaleAmtTotal = this.getDelayedDamageClockScale();
            let textScaleFinal = Math.sqrt(scaleAmtTotal * 2) * 0.75;
             if (oldDelayedDamage <= 0) {
                 // animation in
                 this.delayDamageHourglass.setScale(scaleAmtTotal - 0.4);
                 this.delayDamageText.setScale(textScaleFinal - 0.3);

                 this.delayDamageHourglass.setRotation(0.5);
                 this.delayDamageHourglass.setAlpha(0.5);
                 this.delayDamageText.setAlpha(0.5);


                let rotateAmt = this.delayedDamage / this.delayedDamageBase * 6.283 - 1.5708;
                let xPos = this.delayDamageHourglass.x;
                let yPos = this.delayDamageHourglass.y;
                let size = 98 * scaleAmtTotal;
                this.delayDamagePartial.visible = true;
                this.delayDamagePartial.clear();
                this.delayDamagePartial.slice(xPos, yPos, size, -1.5708, rotateAmt, false);
                this.delayDamagePartial.fillPath();
                // this.delayDamagePartial.setAlpha(0);

                this.scene.tweens.add({
                     targets: [this.delayDamagePartial],
                     duration: 400,
                     alpha: 1
                 });

                let itemsToScaleOut = [this.delayDamageHourglass, this.delayDamageText];
                if (this.delayedDamage > this.delayedDamageBase) {
                    this.delayDamageSandFull.setScale(this.delayDamageHourglass.scaleX - 0.175)
                    itemsToScaleOut.push(this.delayDamageSandFull);
                }

                 this.scene.tweens.add({
                     targets: itemsToScaleOut,
                     ease: 'Cubic.easeOut',
                     rotation: 0,
                     scaleX: "+= 0.3",
                     scaleY: "+= 0.3",
                     duration: 400,
                     alpha: 1,
                     onComplete: () => {
                        let scale = this.getDelayedDamageClockScale();
                        this.plainUpdateDelayedDamageVisual(scale)
                     }
                 });
             } else {
                 // just animate scale
                 // this.scene.tweens.add({
                 //     targets: [this.delayDamageHourglass],
                 //     ease: 'Cubic.easeOut',
                 //     rotation: 0,
                 //     scaleX: scaleAmtTotal,
                 //     scaleY: scaleAmtTotal,
                 //     duration: 250,
                 //     alpha: 1
                 // });
                 this.scene.tweens.add({
                     targets: [this.delayDamageText],
                     ease: 'Cubic.easeOut',
                     rotation: 0,
                     scaleX: textScaleFinal,
                     scaleY: textScaleFinal,
                     duration: 250,
                     alpha: 1
                 });
                let scale = this.getDelayedDamageClockScale();
                this.plainUpdateDelayedDamageVisual(scale)


             }


             // if (this.delayedDamage > 60) {
             //     this.delayDamageSandFull.setAlpha(1);
             // }
         }
         return this.delayedDamage;
     }

     reduceDelayedDamage(amt) {
         this.delayedDamage = Math.max(0, this.delayedDamage - amt);
        // globalObjects.player.recentlyTakenDelayedDamageAmt = Math.max(0, globalObjects.player.recentlyTakenDelayedDamageAmt - amt);
        if (amt > 0) {
            let textScale = Math.min(1.25, 0.5 + (0.2 * Math.sqrt(Math.abs(amt))));

            messageBus.publish('animateHealNum', this.delayDamageText.x - 1, this.delayDamageText.y - 50, '+' + amt, 0.5 + textScale);
        }
         if (this.delayedDamage <= 0) {
            this.removeDelayedDamage();
         } else {
             this.delayDamageText.setText(this.delayedDamage);
            let scale = this.getDelayedDamageClockScale();
            this.plainUpdateDelayedDamageVisual(scale)
         }
     }

     removeDelayedDamage() {
         this.delayedDamage = 0;
         this.delayDamageText.setText(this.delayedDamage);
         this.clearClock();
     }

     setTempRotObjs(obj, rotation) {
        this.tempRotObjs = obj;
        this.tempLockRot = rotation;
     }

     updateSpellHover(closestElement, closestEmbodiment, closestElementDist, closestEmbodimentDist) {
        let multiplier = globalObjects.player.spellMultiplier();
        let multText = "";
        if (multiplier > 1.1) {
            multText = " X" + multiplier;
        }
        // LEt enemy finish last 3% of charge always.
         let embodimentText = '';
         switch (closestEmbodiment.runeName) {
             case RUNE_STRIKE:
                 embodimentText = 'STRIKE';
                 break;
             case RUNE_REINFORCE:
                 embodimentText = 'BODY';
                 break;
             case RUNE_ENHANCE:
                 embodimentText = 'ENHANCE';
                 break;
             case RUNE_PROTECT:
                 embodimentText = 'PROTECT';
                 break;
             case RUNE_UNLOAD:
                 embodimentText = 'ULTIMATE';
                 break;
             default:
                 break;
         }

         // let displayText = "+";
         switch (closestElement.runeName) {
             case RUNE_MATTER:
                 this.spellElementText.setText('MATTER');
                 switch (closestEmbodiment.runeName) {
                     case RUNE_STRIKE:
                         if (gameVars.matterPlus) {
                            this.spellDescriptor.setText(getLangText('matter_strike_plus_desc'));
                         } else {
                            this.spellDescriptor.setText(getLangText('matter_strike_desc'));
                         }
                         break;
                     case RUNE_REINFORCE:
                         embodimentText += multiplier > 1.1 ? (" X" + multiplier) : "";
                         this.spellDescriptor.setText(getLangText('matter_reinforce_desc'));
                         break;
                     case RUNE_ENHANCE:
                         embodimentText += multiplier > 1.1 ? (" X" + multiplier) : "";
                         this.updateTextIfDifferent(this.spellDescriptor, getLangText('matter_enhance_desc'))
                         break;
                     case RUNE_PROTECT:
                         embodimentText += multiplier > 1.1 ? (" X" + multiplier) : "";
                         this.spellDescriptor.setText(getLangText('matter_protect_desc'));
                         break;
                     case RUNE_UNLOAD:
                         embodimentText += multiplier > 1.1 ? (" X" + multiplier) : "";
                         this.spellDescriptor.setText(getLangText('matter_unload_desc'));
                         break;
                     default:
                         this.spellDescriptor.setText('');
                         break;
                 }
                 break;
             case RUNE_TIME:
                 this.spellElementText.setText('TIME');
                 switch (closestEmbodiment.runeName) {
                     case RUNE_STRIKE:
                         this.spellDescriptor.setText(getLangText('time_strike_desc'));
                         break;
                     case RUNE_REINFORCE:
                        let healMult = (1 - (0.5 ** multiplier));
                        let recentlyTakenDamage = globalObjects.player.getRecentlyTakenDamageAmt();
                        let recentlyHealAmt = Math.ceil(recentlyTakenDamage * healMult);
                        let overheal = Math.max(0, globalObjects.player.health + recentlyHealAmt - globalObjects.player.healthMax)
                        let healDelayed = this.delayedDamage - overheal;
                         let healAmt = recentlyHealAmt + Math.ceil(healDelayed * healMult);
                         // this.updateTextIfDifferent(this.spellNameText, 'UNDO WOUNDS (\\'+ healAmt + ")")
                         embodimentText += " (" + healAmt + ")";
                         this.updateTextIfDifferent(this.spellDescriptor, getLangText('time_reinforce_desc'))
                         break;
                     case RUNE_ENHANCE:
                         embodimentText += multiplier > 1.1 ? (" X" + multiplier) : "";
                         this.spellDescriptor.setText(getLangText('time_enhance_desc'));
                         break;
                     case RUNE_PROTECT:
                         embodimentText += multiplier > 1.1 ? (" X" + multiplier) : "";
                         this.spellDescriptor.setText(getLangText('time_protect_desc'));
                         break;
                     case RUNE_UNLOAD:
                         embodimentText += multiplier > 1.1 ? (" X" + multiplier) : "";
                         this.spellDescriptor.setText(getLangText('time_unload_desc'));
                         break;
                     default:
                         this.spellDescriptor.setText('');
                         break;
                 }
                 break;
             case RUNE_MIND:
                 this.spellElementText.setText('ENERGY');
                 switch (closestEmbodiment.runeName) {
                     case RUNE_STRIKE:
                         this.spellDescriptor.setText(getLangText('mind_strike_desc'));
                         break;
                     case RUNE_REINFORCE:
                         embodimentText += multiplier > 1.1 ? (" X" + multiplier) : "";
                         this.spellDescriptor.setText(getLangText('mind_reinforce_desc'));
                         break;
                     case RUNE_ENHANCE:
                         embodimentText += multiplier > 1.1 ? (" X" + multiplier) : "";
                         if (gameVars.mindPlus) {
                            this.spellDescriptor.setText(getLangText('mind_enhance_plus_desc'));
                         } else {
                            this.spellDescriptor.setText(getLangText('mind_enhance_desc'));
                         }
                         break;
                     case RUNE_PROTECT:
                         embodimentText += multiplier > 1.1 ? (" X" + multiplier) : "";
                         this.spellDescriptor.setText(getLangText('mind_protect_desc'));
                         break;
                     case RUNE_UNLOAD:
                         embodimentText += multiplier > 1.1 ? " (DOUBLE)" : "";
                         this.spellDescriptor.setText(getLangText('mind_unload_desc'));
                         break;
                     default:
                         this.spellDescriptor.setText('');
                         break;
                 }
                 break;
             case RUNE_VOID:
                 this.spellElementText.setText('VOID');
                 switch (closestEmbodiment.runeName) {
                     case RUNE_STRIKE:
                         this.spellDescriptor.setText(getLangText('void_strike_desc'));
                         break;
                     case RUNE_REINFORCE:
                         embodimentText += multiplier > 1.1 ? (" X" + multiplier) : "";
                         this.spellDescriptor.setText(getLangText('void_reinforce_desc'));
                         break;
                     case RUNE_ENHANCE:
                         embodimentText += multiplier > 1.1 ? (" X" + multiplier) : "";
                         this.spellDescriptor.setText(getLangText('void_enhance_desc'));
                         break;
                     case RUNE_PROTECT:
                         embodimentText += multiplier > 1.1 ? (" X" + multiplier) : "";
                         this.spellDescriptor.setText(getLangText('void_protect_desc'));
                         break;
                     case RUNE_UNLOAD:
                         // this.updateTextIfDifferent(this.spellNameText, 'UN-MAKE')
                         this.updateTextIfDifferent(this.spellDescriptor, getLangText('void_unload_desc'))
                         break;
                     default:
                         this.updateTextIfDifferent(this.spellNameText, '')
                         this.spellDescriptor.setText('');
                         break;
                 }
                 break;
             default:
                 this.spellElementText.setText('');
                this.spellDescriptor.setText('');
                 break;
         }
         if (this.spellElementText.text == '' && this.spellActionText.text == '') {
             this.spellNameText.visible = false;
         } else {
             this.spellNameText.visible = true;
         }
         // this.updateTextIfDifferent(this.spellNameText, displayText)
         this.spellActionText.setText(embodimentText)

        if (this.castDisabled || this.manualDisabled) {
             this.spellNameText.visible = false;
             this.spellElementText.setText('')
            this.spellActionText.setText('')
        }
        if (this.disableSpellDescDisplay || this.manualDisabled) {
            this.spellDescriptor.setText('');
        }
     }

     updateTextIfDifferent(textObj, newTextStr) {
        if (textObj.text !== newTextStr) {
            messageBus.publish("spellNameTextUpdate", newTextStr)
            textObj.setText(newTextStr);
        }
     }

     applyMindBurn(duration = 5) {
        if (!globalObjects.currentEnemy || globalObjects.currentEnemy.dead) {
            return;
        }
         let effectName = 'mindBurn';
         let effectObj;
         if (this.mindBurnTween) {
             this.mindBurnTween.stop();
         }
         this.mindBurnAnim.alpha = 0.5;
         let damageDealt = gameVars.mindPlus ? 3 : 2;
         this.mindBurnAnim.setScale(0.55 + 0.05 * Math.sqrt(duration) + 0.05 * duration);
        messageBus.publish('enemyTakeTrueDamage', damageDealt, false);
        if (!this.flashBGWhite) {
            this.flashBGWhite = PhaserScene.add.image(gameConsts.halfWidth,gameConsts.halfHeight - 200,'blurry', 'circle.webp').setDepth(-1).setAlpha(0);
        }
        let scaleFlash = 2 + duration * 0.02;
        this.flashBGWhite.setScale(scaleFlash);
        this.scene.tweens.add({
            targets: this.flashBGWhite,
            alpha: duration * 0.005 - 0.02,
            scaleX: scaleFlash * 1.2,
            scaleY: scaleFlash * 1.2,
            duration: 120,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this.flashBGWhite,
                    alpha: 0,
                    duration: 250 + duration * 10,
                    ease: 'Cubic.easeOut'
                });
            }
        });

        messageBus.publish('showCircleShadow', 0.03 + duration * 0.005, -90 + duration * 20);
         effectObj = {
             name: effectName,
             duration: duration,
             firstTicked: false,
             onUpdate: () => {
                 if (effectObj) {
                     if (effectObj.firstTicked) {
                         this.mindBurnAnim.setScale(0.55 + 0.05 * Math.sqrt(duration) + 0.05 * effectObj.duration);
                         messageBus.publish('enemyTakeTrueDamage', damageDealt, false);
                     } else {
                         effectObj.firstTicked = true;
                     }
                 }
             },
             cleanUp: (statuses) => {
                 this.mindBurnTween = this.scene.tweens.add({
                     targets: [this.mindBurnAnim],
                     alpha: 0,
                     scaleX: 1,
                     scaleY: 1,
                     duration: 250,
                     ease: 'Quad.easeOut'
                 });
                 statuses[effectName] = null;
             }
         };
         messageBus.publish('enemyTakeEffect', effectObj);
     }

     applyVoidBurn(damage = 1, number = 5) {
        if (!globalObjects.currentEnemy) {
            return;
        }
        let baseScale = 0.7 + Math.sqrt(damage) * 0.1;
        this.voidSliceImage1.visible = true;
        this.voidSliceImage3.visible = true;
         this.voidSliceImage1.alpha = 0.75;
         this.voidSliceImage3.alpha = 0.75;
         this.voidSliceImage1.setScale(baseScale * 0.4, baseScale * 0.95);
         this.voidSliceImage3.setScale(baseScale * 0.4, baseScale * 0.95);
         this.scene.tweens.add({
             targets: [this.voidSliceImage1, this.voidSliceImage3],
             ease: 'Cubic.easeOut',
             scaleX: baseScale * 0.8,
             scaleY: baseScale * 0.8,
             alpha: 0.45,
             duration: 150,
         });
         if (this.voidSliceImage1.anim) {
            this.voidSliceImage1.anim.stop();
            this.voidSliceImage3.anim.stop();
         }

        this.voidSliceImage1.anim = this.scene.tweens.add({
            delay: 180,
             targets: this.voidSliceImage1,
             scaleX: baseScale * 0.5,
             scaleY: baseScale * 0.95,
             alpha: 0.65,
             ease: 'Quad.easeOut',
             duration: 200,
         });
        this.voidSliceImage3.anim = this.scene.tweens.add({
            delay: 180,
             targets: this.voidSliceImage3,
             scaleX: baseScale * 0.45,
             scaleY: baseScale * 1,
             alpha: 0.7,
             ease: 'Quad.easeOut',
             duration: 3000,
         });

         let effectName = 'voidBurn';
         let effectObj;
         effectObj = {
             name: effectName,
             duration: 3,
             isFirst: true,
             onUpdate: () => {
                 if (effectObj.isFirst) {
                     effectObj.isFirst = false;
                 } else if (effectObj && effectObj.duration > 0) {
                     if (effectObj.duration <= 1) {
                         this.fireVoidSpike(this.voidSliceImage3, baseScale, damage);
                     } else if (effectObj.duration == 2) {
                         this.fireVoidSpike(this.voidSliceImage1, baseScale, damage);
                     }
                 }
             },
             cleanUp: (statuses) => {
                 statuses[effectName] = null;
             }
         };
         messageBus.publish('enemyTakeEffect', effectObj);
     }

     fireVoidSpike(spike, baseScale, damage) {
        if (spike.anim) {
            spike.anim.stop();
        }
        spike.alpha = 1;
        playSound('void_strike', 0.3);
        PhaserScene.time.delayedCall(100, () => {
            messageBus.publish('enemyTakeDamage', damage);
            messageBus.publish('setPauseDur', 5);
        })
        spike.setScale(baseScale * 4, baseScale * 0.6)
         this.scene.tweens.add({
            delay: 1,
             targets: spike,
             ease: 'Quart.easeOut',
             scaleX: baseScale * 1.9,
             scaleY: baseScale * 0.75,
             duration: 100,
             onComplete: () => {
                 this.scene.tweens.add({
                    delay: 100,
                     targets: spike,
                     ease: 'Cubic.easeIn',
                     scaleX: baseScale,
                     scaleY: 0,
                     duration: 150,
                 });
             }
         });
     }

     handleVoidForm() {
         this.castDisabled = true;
         this.bufferedCastAvailable = false;
         this.outerDragDisabled = true;
         this.innerDragDisabled = true;
         this.lastDragTime = Math.min(this.lastDragTime, -9999);
         gameVars.playerNotMoved = false;
        this.disableSpellDescDisplay = true;
     }

     clearVoidForm() {
         this.castDisabled = false;
         this.outerDragDisabled = false;
         this.innerDragDisabled = false;
         this.lastDragTime = 0
        this.disableSpellDescDisplay = false;
     }

     clearMindForm(id) {

     }


     clearEffects(specific) {
        if (specific) {
            return;
        }
        this.voidSliceImage1.visible = false;
        this.voidSliceImage3.visible = false;
         this.mindBurnAnim.alpha = 0;
         this.removeDelayedDamage();
     }

     disableMovement() {
         this.greyed.visible = true;
        this.manualDisabled = true;
         // this.castDisabled = true;
         // this.outerDragDisabled = true;
         // this.innerDragDisabled = true;
         this.disableSpellDescDisplay = true;
     }
     enableMovement() {
         this.greyed.visible = false;
         this.manualDisabled = false;
         this.disableSpellDescDisplay = false;
     }

     playerDied() {
        this.removeDelayedDamage();
        this.disableMovement();
         this.greyedDead.visible = true;
         this.greyedDead.alpha = 1;
         if (this.disappearDeath) {
             this.disappearDeath.stop();
         }
     }

     playerRevived() {
         this.enableMovement();
         this.disappearDeath = this.scene.tweens.add({
             targets: this.greyedDead,
             alpha: 0,
             duration: 250,
         });
     }

    highlightRunes() {
        this.errorBoxElement.setDepth(10000);
        this.errorBoxEmbodiment.setDepth(10000);
        if (this.elements) {
            for (let i = 0; i < this.elements.length; i++) {
                this.elements[i].glow.setDepth(10000);
            }
        }
        if (this.embodiments) {
            for (let i = 0; i < this.embodiments.length; i++) {
                this.embodiments[i].glow.setDepth(10000);
            }
        }
    }

    unhighlightRunes() {
        this.errorBoxElement.setDepth(121);
        this.errorBoxEmbodiment.setDepth(121);
        if (this.elements) {
            for (let i = 0; i < this.elements.length; i++) {
                this.elements[i].glow.setDepth(103);
            }
        }
        if (this.embodiments) {
            for (let i = 0; i < this.embodiments.length; i++) {
                this.embodiments[i].glow.setDepth(103);
            }
        }
    }

    showCircleShadow(intensity = 0.25, extraDuration = 0) {
        this.shadowCircle.alpha = intensity;
        if (this.shadowCircle.currAnim) {
            this.shadowCircle.currAnim.stop();
        }
        this.shadowCircle.currAnim = this.scene.tweens.add({
            targets: this.shadowCircle,
            alpha: 0,
            ease: 'Cubic.easeIn',
            duration: 950 + intensity * 1000 + extraDuration,
        });
    }

    setCircleShadow(intensity = 0.2) {
        this.shadowCircle.alpha = intensity;
    }

}
