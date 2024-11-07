const DECAY = 0.000045;
const STATIC = 0.0054;
const MIN_VEL = 0.0001;
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
        this.storedDragAngleDiff = 0;
        this.dScaleAccumulate = 0;
        this.draggedDuration = 0;
        this.preventRotDecay = 0;
        this.lastPlayedClickTime = 0;
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
            messageBus.subscribe('enemyHasDied', this.cancelTimeSlow.bind(this)),
            messageBus.subscribe('selfClearStatuses', this.clearEffects.bind(this)),

            messageBus.subscribe("applyMindBurn", this.applyMindBurn.bind(this)),
            messageBus.subscribe("playerDied", this.playerDied.bind(this)),
            messageBus.subscribe("playerRevived", this.playerRevived.bind(this)),
            messageBus.subscribe("highlightRunes", this.highlightRunes.bind(this)),
            messageBus.subscribe("unhighlightRunes", this.unhighlightRunes.bind(this)),
            messageBus.subscribe("showCircleShadow", this.showCircleShadow.bind(this)),

            messageBus.subscribe("setCircleShadow", this.setCircleShadow.bind(this)),
            messageBus.subscribe("refreshHoverDisplay", this.refreshHoverText.bind(this))

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
        this.keyP = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

        this.keyLeft = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.keyRight = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.keyUp = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyDown = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.keyEnter = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.keySpace = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyEscape = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    update(dScale) {
        if (this.lastDragTime > 15) {
            gameVars.playerNotMoved = true;
        } else {
            gameVars.playerNotMoved = false;
        }
        this.handleTimeSlow(dScale);
        this.lastDragTime += dScale;

        let mouseDistX = gameVars.mouseposx - this.x;
        let mouseDistY = gameVars.mouseposy - this.y;
        let totalDist = Math.sqrt(mouseDistX * mouseDistX + mouseDistY * mouseDistY);

        this.setFrameLazy(this.castButton, this.altString + 'cast_normal.png');
        globalObjects.player.setCastTextAlpha(0.65);

        this.setFrameLazy(this.innerCircle,this.altString + 'element_normal.png');
        this.setFrameLazy(this.outerCircle, this.altString + 'usage_normal.png');
        if (this.manualDisabled) {
            this.dragArrow.visible = false;
            this.dragCircle.visible = false;
        }

        if (this.delayedDamage > this.delayedDamageBase) {
            let extraOverload = Math.sqrt(Math.max(0, this.delayedDamage - this.delayedDamageBase) * 6);
            if (this.delayedDamage > this.delayedDamageBase * 1.25) {
                // way overflow
                this.delayDamageSandFull.x += Math.random() * extraOverload * 0.03;
            }
            this.delayDamageSandFull.x = this.delayDamageSandFull.origX + (this.delayDamageSandFull.origX - this.delayDamageSandFull.x) * 0.75;
            this.delayDamageSandFull.x += Math.random() * (extraOverload * 0.12 + 0.5);
            this.delayDamageHourglass.x = this.delayDamageSandFull.x;
        } else {
            this.delayDamageSandFull.x = this.delayDamageSandFull.origX
            this.delayDamageHourglass.x = this.delayDamageSandFull.x;
        }

        if (!this.recentSkipped && (this.keyEnter.isDown || this.keySpace.isDown || this.keyEscape.isDown)) {
            let hasDoneStuff = globalObjects.bannerTextManager.continueDialog();
            // click through victory
            if (globalObjects.currentEnemy) {
                if (globalObjects.currentEnemy.dieClickBlocker && !globalObjects.currentEnemy.dieClickBlocker.isDestroyed) {
                    if (globalObjects.currentEnemy.dieClickBlocker.onMouseUpFunc) {
                        globalObjects.currentEnemy.dieClickBlocker.clickMouseUp();
                        hasDoneStuff = true;
                    }
                }
            }

            if (globalObjects.lvlCloseButton && !globalObjects.lvlCloseButton.isDestroyed) {
                if (globalObjects.lvlCloseButton.onMouseUpFunc) {
                    globalObjects.lvlCloseButton.clickMouseUp();
                    hasDoneStuff = true;
                }
            }

            this.recentSkipped = true;
            if (this.keyEscape.isDown) {
                if (globalObjects.encyclopedia.canClose) {
                    hasDoneStuff = true;
                    messageBus.publish("cancelScreen"); // cancelScreen
                }
                if (globalObjects.options.canClose) {
                    messageBus.publish("cancelScreen");
                } else if (!hasDoneStuff) {
                    messageBus.publish("toggleCancelScreen");
                } else {
                    messageBus.publish("cancelScreen");
                }
            }
        } else if (!this.recentSkipped && this.keyP.isDown) {
            this.recentSkipped = true;
            messageBus.publish("toggleCancelScreen");

        } else if (this.recentSkipped && !this.keyEnter.isDown && !this.keySpace.isDown && !this.keyEscape.isDown && !this.keyP.isDown) {
            this.recentSkipped = false;
        }

        if (ENABLE_KEYBOARD && !this.outerDragDisabled && !this.innerDragDisabled && !this.manualDisabled) {
            if (this.keyA.isDown || this.keyDown.isDown) {
                if (this.keyboardRotateInner > -0.25) {
                    this.keyboardRotateInner = -1.46;
                    this.keyboardRotateInnerDeadTime = this.defaultDeadTime;
                } else if (this.keyboardRotateInnerDeadTime > 0) {
                    this.keyboardRotateInnerDeadTime -= dScale;
                    this.keyboardRotateInner = -0.4;
                } else {
                    this.keyboardRotateInner = -1;
                }
            } else if (this.keyD.isDown || this.keyUp.isDown) {
                if (this.keyboardRotateInner < 0.25) {
                    this.keyboardRotateInner = 1.46;
                    this.keyboardRotateInnerDeadTime = this.defaultDeadTime;
                } else if (this.keyboardRotateInnerDeadTime > 0) {
                    this.keyboardRotateInnerDeadTime -= dScale;
                    this.keyboardRotateInner = 0.4;
                } else {
                    this.keyboardRotateInner = 1;
                }
            } else {
                this.keyboardRotateInner = 0;
            }

            if (this.keyW.isDown || this.keyRight.isDown || this.keyE.isDown) {
                if (this.keyboardRotateOuter < 0.25) {
                    this.keyboardRotateOuter = 1.41;
                    this.keyboardRotateOuterDeadTime = this.defaultDeadTime;
                } else if (this.keyboardRotateOuterDeadTime > 0) {
                    this.keyboardRotateOuterDeadTime -= dScale;
                    this.keyboardRotateOuter = 0.3;
                } else {
                    this.keyboardRotateOuter = 1;
                }
            } else if (this.keyS.isDown || this.keyLeft.isDown || this.keyQ.isDown) {
                if (this.keyboardRotateOuter > -0.25) {
                    this.keyboardRotateOuter = -1.41;
                    this.keyboardRotateOuterDeadTime = this.defaultDeadTime;

                } else if (this.keyboardRotateOuterDeadTime > 0) {
                    this.keyboardRotateOuterDeadTime -= dScale;
                    this.keyboardRotateOuter = -0.3;
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
                    this.setFrameLazy(this.castButton,this.altString + 'cast_press.png');
                    globalObjects.player.setCastTextAlpha(0.65);
                } else if (totalDist < this.innerCircleSize && !this.innerDragDisabled) {
                    this.draggedObj = this.innerCircle;
                    this.dragPointDist = totalDist;
                    this.dragPointAngle = Math.atan2(mouseDistY, mouseDistX);
                    this.dragPointAngleVisual = this.dragPointAngle;
                    this.setFrameLazy(this.innerCircle, this.altString + 'element_drag.png');
                } else if (!this.outerDragDisabled) {
                    this.draggedObj = this.outerCircle;
                    this.dragPointDist = Math.min(totalDist, this.trueSize);
                    this.dragPointAngle = Math.atan2(mouseDistY, mouseDistX);
                    this.dragPointAngleVisual = this.dragPointAngle;
                    this.setFrameLazy(this.outerCircle,this.altString + 'usage_drag.png');
                }
            } else if (gameVars.mouseJustUpped) {
                // this.draggedDuration = -2;
                if (this.draggedDuration < 12) {
                    this.preventRotDecay = (12 - this.draggedDuration) * 0.4;
                }
                // let go
                if (totalDist < this.castButtonSize && this.draggedObj === this.castButton) {
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
                if (totalDist < this.castButtonSize && this.draggedObj === this.castButton) {
                    this.setFrameLazy(this.castButton,this.altString + 'cast_press.png');
                    globalObjects.player.setCastTextAlpha(0.6);
                }
            } else {
                // plain ol hovering
                canvas.style.cursor = 'default';
                if (totalDist < this.castButtonSize) {
                    this.setFrameLazy(this.castButton,this.altString + 'cast_hover.png');
                    globalObjects.player.setCastTextAlpha(0.7);
                    if (!this.innerDragDisabled && !this.outerDragDisabled && !this.recharging && !this.castDisabled && canvas) {
                        canvas.style.cursor = 'pointer';
                    }
                } else if (!this.innerDragDisabled && totalDist < this.innerCircleSize) {
                    this.setFrameLazy(this.innerCircle, this.altString + 'element_hover.png');
                } else if (!this.outerDragDisabled) {
                    this.setFrameLazy(this.outerCircle,this.altString + 'usage_hover.png');
                }
            }
        }

        if (!gameVars.mousedown) {
            this.draggedObj = null;
        }

        if (this.innerDragDisabled && this.innerCircle === this.draggedObj) {
            this.draggedObj = null;
        }
        if (this.outerDragDisabled && this.outerCircle === this.draggedObj) {
            this.draggedObj = null;
        }

        if (dScale > 0.9 && dScale < 1.14) {
            dScale = 1;
        }
        if (dScale > 1.1) {
            this.dScaleAccumulate += dScale;
            while (this.dScaleAccumulate > 1) {
                this.dScaleAccumulate -= 1;
                this.updateInterval(1, mouseDistX, mouseDistY);
            }
            // causes jitter, unfortunate bad
            // if (this.dScaleAccumulate > 0.3) {
            //     this.updateInterval(this.dScaleAccumulate, mouseDistX, mouseDistY);
            //     this.dScaleAccumulate = 0;
            // }
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
            this.storedDragAngleDiff = dragAngleDiff;
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

            let torqueConst = gameVars.wasTouch ? 0.047 : 0.0445;
            // castDisable

            // Using both rotation diff and mult val to calculate
            if (dragForceSqr < 0) {
                this.draggedObj.torque = dragForce * -Math.sqrt(-dragForceSqr) * torqueConst * (1 + dScale * 0.01);
            } else {
                this.draggedObj.torque = dragForce * Math.sqrt(dragForceSqr) * torqueConst * (1 + dScale * 0.01);
            }
            // TODO: Remove if not needed
            this.draggedObj.torque += dragAngleDiff * torqueConst - this.draggedObj.rotVel * 0.38;
            // this.draggedObj.torque = this.draggedObj.torque + (this.draggedObj.torque * this.draggedObj.torque) * minusMult * 150;
            //this.draggedObj.torque += this.draggedObj.torqueOnRelease * 0.5;

            this.draggedObj.torqueOnRelease = this.draggedObj.torque * 4; // there's some more oomph to when you sling out a spin

            if (this.draggedObj.rotVel * dragAngleDiff < -0.01) {
                // if drag force is acting opposite of current velocity, slow down current velocity
                this.draggedObj.rotVel *= 0.2;
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
                this.setFrameLazy(this.innerCircle, this.altString + 'element_drag.png');
            } else if (this.draggedObj == this.outerCircle) {
                this.setFrameLazy(this.outerCircle,this.altString + 'usage_drag.png');
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
        this.size = isMobile ? 252 : 230;
        this.draggedObj = null;
        this.dragPointAngle = 0;
        this.dragPointAngleVisual = this.dragPointAngle;
        this.dragPointDist = 100;
        this.keyboardRotateOuter = 0;
        this.keyboardRotateInner = 0;
        this.defaultDeadTime = 8;
        this.keyboardRotateOuterDeadTime = 5;
        this.keyboardRotateInnerDeadTime = 5;
        this.keyboardCasted = false;
        this.delayedDamage = 0;
        this.delayedDamageBase = 60;
        this.delayedDamageShouldTick = false;
    }

    buildCircles(x, y, scene) {
        this.aura = scene.add.image(x, y, 'circle', 'aura.png');
        this.aura.setDepth(101);
        this.aura.setScale(0.9);
        this.aura.rotVel = 0;
        this.aura.alpha = 0;

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

        this.altString = ""//"alt2_";

        this.outerCircle = scene.add.sprite(x, y, 'circle', this.altString + 'usage_normal.png').setDepth(101);
        this.outerCircle.torque = 0;
        this.outerCircle.torqueDecay = 0;
        this.outerCircle.torqueOnRelease = 0;
        this.outerCircle.rotVel = 0;
        this.outerCircle.nextRotation = 0;
        this.outerCircle.prevRotation = 0;
        this.innerCircleSize = isMobile ? 153 : 149;
        this.innerCircle = scene.add.sprite(x, y, 'circle', this.altString + 'element_normal.png').setDepth(102);
        this.innerCircle.setOrigin(0.5003, 0.5003);
        this.innerCircle.torque = 0;
        this.innerCircle.torqueDecay = 0;
        this.innerCircle.torqueOnRelease = 0;
        this.innerCircle.rotVel = 0;
        this.innerCircle.nextRotation = 0;
        this.innerCircle.prevRotation = 0;
        this.shadowCircle = scene.add.sprite(x, y, 'circle', 'shadow.png').setAlpha(0).setDepth(99998).setBlendMode(Phaser.BlendModes.MULTIPLY);

        this.focusLines = scene.add.image(x, y - 130, 'circle', 'focus_lines.png').setDepth(121);
        this.focusLinesOn = scene.add.sprite(x, y - 130, 'circle', 'focus_lines_on.png').setDepth(121);
        this.castButtonSize = isMobile ? 72 : 78;
        this.castButton = scene.add.sprite(x, y, 'circle', this.altString + 'cast_normal.png').setDepth(121);
        this.castButtonSpare = scene.add.sprite(x, y, 'circle', this.altString + 'cast_press.png').setDepth(121).setAlpha(0);
        this.castHoverTemp = scene.add.sprite(x, y, 'circle', this.altString + 'cast_press.png').setDepth(121).setAlpha(0);
        this.castGlow = scene.add.sprite(x, y, 'circle', 'cast_glow.png').setDepth(121).setAlpha(0);
        this.greyedDead = scene.add.sprite(x, y, 'circle', 'greyed_dead.png').setVisible(false).setDepth(135);


        this.greyed = scene.add.sprite(x, y, 'circle', 'greyed.png').setVisible(false).setDepth(122).setVisible(false).setScale(1.01);

        this.errorBoxElement = scene.add.sprite(x, y - 115, 'circle', 'error_box.png');
        this.errorBoxElement.setDepth(131);
        this.errorBoxElement.alpha = 0;
        this.errorBoxEmbodiment = scene.add.sprite(x, y - 175, 'circle', 'error_box.png');
        this.errorBoxEmbodiment.setDepth(131);
        this.errorBoxEmbodiment.alpha = 0;

        // Toggle this true to switch back to showing the names of the two runes instead
        this.showRunes = false;

        this.spellElementText = this.scene.add.bitmapText(this.x - 11, this.y - 283, 'normal', 'MATTER', isMobile ? 30 : 28, 1);
        this.spellElementText.setScale(0.7);
        this.spellElementText.setOrigin(1, 0.5);
        this.spellElementText.setDepth(125);
        this.spellElementText.alpha = 0.55;
        this.spellElementText.startY = this.spellElementText.y;
        this.spellElementText.visible = this.showRunes;
        // this.spellElementSprite = this.scene.add.sprite(this.spellElementText.x, this.spellElementText.y, 'vfx', 'blank.png').setDepth(119).setOrigin(1, 0.5);

        this.spellNameText = this.scene.add.bitmapText(this.x + 1, this.y - 283, 'normal', '+', isMobile ? 30 : 28, 1);
        this.spellNameText.setScale(0.7);
        this.spellNameText.setOrigin(0.5, 0.5);
        this.spellNameText.setDepth(125);
        this.spellNameText.startY = this.spellNameText.y;
        this.spellNameText.alpha = 0.55;

        this.spellActionText = this.scene.add.bitmapText(this.x + 13, this.y - 283, 'normal', 'STRIKE', isMobile ? 30 : 28, 1);
        this.spellActionText.setScale(0.7);
        this.spellActionText.setOrigin(0, 0.5);
        this.spellActionText.setDepth(125);
        this.spellActionText.alpha = 0.55;
        this.spellActionText.startY = this.spellActionText.y;
        this.spellActionText.visible = this.showRunes;

        this.voidSliceImage1 = scene.add.sprite(gameConsts.halfWidth - 100, 255, 'spells', 'darkSlice.png').setDepth(21).setRotation(-Math.PI * 0.5 + 0.6).setAlpha(0).setOrigin(0.17, 0.5);
        this.voidSliceImage3 = scene.add.sprite(gameConsts.halfWidth + 100, 255, 'spells', 'darkSlice.png').setDepth(21).setRotation(-Math.PI * 0.5 - 0.6).setAlpha(0).setOrigin(0.17, 0.5);

        this.mindBurnAnim = this.scene.add.sprite(gameConsts.halfWidth, 150, 'spells').play('mindBurn').setDepth(1).setAlpha(0).setDepth(10).setBlendMode(Phaser.BlendModes.ADD);


        // this.spellDescText = this.scene.add.bitmapText(this.x + 204, this.y + 2, 'plain', '', 15);
        // this.spellDescText.setOrigin(0, 0);
        // this.spellDescText.setDepth(120);

        this.spellDescriptor = new HoverDisplay({
            x: gameConsts.halfWidth,
            y: 0,
            originX: 0.485,
            originY: 1,
            depth: 200
        })
        this.refreshHoverText();
        this.dragCircle = scene.add.sprite(x, y, 'circle', 'drag_circle.png').setAlpha(isMobile ? 0.75 : 0.55);
        this.dragCircle.setDepth(100001);
        this.dragCircle.visible = false;
        this.dragArrow = scene.add.sprite(x, y, 'circle', 'drag_arrow.png');
        this.dragArrow.setDepth(100001);
        this.dragArrow.setOrigin(0.2, 0.5);
        this.dragArrow.visible = false;

        this.elementHighlight = this.scene.add.sprite(x, y, 'circle', 'bright_rune_matter.png').setOrigin(0.5, 0.866).setDepth(104);
        this.embodimentHighlight = this.scene.add.sprite(x, y, 'circle', 'bright_rune_strike.png').setOrigin(0.5, 1.22).setDepth(104);
        this.buildRunes();
    }

    createTimeStopObjs() {
        this.gearBonusSpeed = 5;
        // this.timeStopLight = this.scene.add.sprite(this.x, this.y, 'blackPixel');
        // this.timeStopLight.alpha = 0;
        // this.timeStopLight.setScale(999);
        this.timeStopHeavy = this.scene.add.sprite(this.x, this.y, 'spells', 'blackCircleLarge.png').setDepth(-3);
        this.timeStopHeavy.alpha = 0;
        this.timeStopHeavy.setScale(1.7);

        this.clockbg = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 5, 'lowq', 'clockbg.png').setAlpha(0).setScale(1.4);
        this.clockbg.setDepth(-3);
        this.gear1 = this.scene.add.sprite(-40, 280, 'circle', 'gear.png').setAlpha(0);
        this.gear1.setDepth(1);
        this.gear1.startX = this.gear1.x; this.gear1.startY = this.gear1.y;
        this.gear2 = this.scene.add.sprite(120, 442, 'circle', 'gear_small.png').setAlpha(0);
        this.gear2.setDepth(1);
        this.gear2.rotation = -0.25;
        this.gear2.startX = this.gear2.x; this.gear2.startY = this.gear2.y;
        this.gear3 = this.scene.add.sprite(565, -15, 'circle', 'gear.png').setAlpha(0);
        this.gear3.setDepth(1);
        this.gear3.startX = this.gear3.x; this.gear3.startY = this.gear3.y;
        this.gear4 = this.scene.add.sprite(538, 575, 'circle', 'gear_small.png').setAlpha(0);
        this.gear4.setDepth(1);
        this.gear4.startX = this.gear4.x; this.gear4.startY = this.gear4.y;
    }

     finishUpMindDamage(charge) {
         this.laserIsFiring = false;
     }

    handleTimeSlow(dt) {
        if (gameVars.timeSlowRatio === 1) {
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
            duration: gameVars.gameManualSlowSpeed * 280,
        });

        this.scene.tweens.add({
            targets: this.clockbg,
            alpha: 0.10,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: gameVars.gameManualSlowSpeed * 250,
        });
        this.gear1.setPosition(gameConsts.halfWidth, 190).setScale(1.13);
        this.gear2.setPosition(gameConsts.halfWidth, 190).setScale(0.88);
        this.gear3.setPosition(gameConsts.halfWidth, 190).setScale(2.09);
        this.scene.tweens.add({
            targets: [this.gear1, this.gear2, this.gear3],
            ease: 'Quart.easeOut',
            alpha: 0.15,
            duration: gameVars.gameManualSlowSpeed * 1000,
        });
        this.scene.tweens.add({
            targets: [this.gear4],
            ease: 'Quart.easeOut',
            alpha: 0,
            duration: gameVars.gameManualSlowSpeed * 1000,
        });
    }

    cancelTimeSlow() {
        messageBus.publish('clearGameSlow');
        if (gameVars.timeSlowRatio !== 1) {
            gameVars.timeSlowRatio = 1;
            if (globalObjects.currentEnemy && globalObjects.currentEnemy.bgMusic) {
                globalObjects.currentEnemy.bgMusic.detune = 0;
            }
            this.scene.tweens.add({
                // this.timeStopLight,
                targets: [this.timeStopHeavy],
                ease: 'Quint.easeOut',
                alpha: 0.01,
                duration: gameVars.gameManualSlowSpeed * 700,
                onComplete: () => {
                    this.scene.tweens.add({
                        targets: [this.timeStopHeavy],
                        alpha: 0,
                        duration: gameVars.gameManualSlowSpeed * 500
                    });
                }
            });
            this.scene.tweens.add({
                targets: [this.gear1, this.gear2, this.gear3, this.gear4, this.clockbg],
                ease: 'Quad.easeIn',
                alpha: 0,
                duration: gameVars.gameManualSlowSpeed * 300,
            });
        }
    }

     manualSetTimeSlowRatio(slowRatio = 1, multiplier = 1) {
        this.setTimeSlowRatio(slowRatio / multiplier, true);
         if (slowRatio > 0.999) {
             messageBus.publish('clearGameSlow');
         } else {
             // messageBus.publish('setGameSlow', 0.2 + 0.8 * slowRatio);
             let slowAmt = 0.46;
             gameVars.gameManualSlowSpeed = slowAmt;
             gameVars.gameManualSlowSpeedInverse = 1 / gameVars.gameManualSlowSpeed;
             PhaserScene.tweens.timeScale = slowAmt;
             // PhaserScene.time.timeScale = slowAmt;
             PhaserScene.anims.globalTimeScale = slowAmt;
         }
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
             duration: gameVars.gameManualSlowSpeed * 280,
         });

         this.scene.tweens.add({
             targets: this.clockbg,
             alpha: 0.07 + multiplierAddition * 0.025,
             scaleX: 1.3,
             scaleY: 1.3,
             duration: gameVars.gameManualSlowSpeed * 250,
         });
         this.gear1.setPosition(this.gear1.startX, this.gear1.startY).setScale(1).setDepth(1);
         this.gear2.setPosition(this.gear2.startX, this.gear2.startY).setScale(1).setDepth(1);
         this.gear3.setPosition(this.gear3.startX, this.gear3.startY).setScale(1).setDepth(1);
         this.gear4.setPosition(this.gear4.startX, this.gear4.startY);
         this.scene.tweens.add({
             targets: [this.gear1, this.gear2, this.gear3, this.gear4],
             ease: 'Quart.easeOut',
             alpha: 0.2 + multiplierAddition * 0.11,
             duration: gameVars.gameManualSlowSpeed * 1000,
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
                    duration: gameVars.gameManualSlowSpeed * 700,
                    onComplete: () => {
                        this.scene.tweens.add({
                            targets: [this.timeStopHeavy],
                            alpha: 0,
                            duration: gameVars.gameManualSlowSpeed * 500
                        });
                    }
                });
                this.scene.tweens.add({
                    targets: [this.gear1, this.gear2, this.gear3, this.gear4, this.clockbg],
                    ease: 'Quad.easeIn',
                    alpha: 0,
                    duration: gameVars.gameManualSlowSpeed * 300,
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
                duration: gameVars.gameManualSlowSpeed * 150,
                scaleX: 1.135 + 0.02 * multiplier,
                scaleY: 1.135 + 0.02 * multiplier,
                alpha: 1,
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    this.scene.tweens.add({
                        targets: energyCircle1,
                        duration: gameVars.gameManualSlowSpeed * 400,
                        scaleX: 0.975 + 0.01 * multiplier,
                        scaleY: 0.975 + 0.01 * multiplier,
                        ease: 'Back.easeOut',
                        onComplete: () => {
                            this.scene.tweens.add({
                                targets: energyCircle1,
                                duration: gameVars.gameManualSlowSpeed * 750,
                                alpha: 0.6,
                            });
                        }
                    });
                }
            });

            this.scene.tweens.add({
                targets: energyCircle2,
                duration: gameVars.gameManualSlowSpeed * 200,
                scaleX: 1.17 + 0.02 * multiplier,
                scaleY: 1.17 + 0.02 * multiplier,
                alpha: 1,
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    this.scene.tweens.add({
                        targets: energyCircle2,
                        duration: gameVars.gameManualSlowSpeed * 550,
                        scaleX: 1 + 0.012 * multiplier,
                        scaleY: 1 + 0.012 * multiplier,
                        ease: 'Back.easeOut',
                        onComplete: () => {
                            this.scene.tweens.add({
                                targets: energyCircle2,
                                duration: gameVars.gameManualSlowSpeed * 750,
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
            this.elements[i].setOrigin(0.5, 0.866);
            this.elements[i].setDepth(103);
            this.elements[i].rotation = (Math.PI * 2)/ELEMENT_ARRAY.length * i;
            this.elements[i].startRotation = this.elements[i].rotation
            this.elements[i].runeName = ELEMENT_ARRAY[i];
            this.elements[i].alpha = 0.44;

            this.elements[i].glow = this.scene.add.sprite(x, y, 'circle', ELEMENT_ARRAY[i] + '_glow.png');
            this.elements[i].glow.setOrigin(0.5, 0.866);
            this.elements[i].glow.setDepth(103).setAlpha(0.99);
            this.elements[i].glow.rotation = this.elements[i].rotation;
        }
        for (let i = 0; i < EMBODIMENT_ARRAY.length; i++) {
            this.embodiments[i] = this.scene.add.sprite(x, y, 'circle', EMBODIMENT_ARRAY[i] + '.png');
            this.embodiments[i].setOrigin(0.5, 1.22);
            this.embodiments[i].setDepth(103);
            this.embodiments[i].rotation = (Math.PI * 2)/EMBODIMENT_ARRAY.length * i;
            this.embodiments[i].startRotation = this.embodiments[i].rotation;
            this.embodiments[i].runeName = EMBODIMENT_ARRAY[i];
            this.embodiments[i].alpha = 0.44;

            this.embodiments[i].glow = this.scene.add.sprite(x, y, 'circle', EMBODIMENT_ARRAY[i] + '_glow.png');
            this.embodiments[i].glow.setOrigin(0.5, 1.22);
            this.embodiments[i].glow.setDepth(103).setAlpha(0.99);
            this.embodiments[i].glow.rotation = this.embodiments[i].rotation;
        }
         //blastEffect6.png

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
         if (this.elementHighlight.closest) {
             this.elementHighlight.rotation = this.elementHighlight.closest.rotation;
         }
         if (this.embodimentHighlight.closest) {
            this.embodimentHighlight.rotation = this.embodimentHighlight.closest.rotation;
         }

    }

    calculateRotations(dt, distToTarget = 99) {
        if (this.innerDragDisabled || this.outerDragDisabled) {
            return;
        }
        let decayAltered = DECAY;

        let innerDecayMult = 1;
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

        if (this.outerDragDisabled || this.castDisabled || this.manualDisabled || this.recharging) {
            this.elementHighlight.visible = false;
            this.embodimentHighlight.visible = false;
        } else {
            if (closestElement.glow.visible) {
                this.elementHighlight.closest = closestElement;
                this.elementHighlight.visible = true;
                this.elementHighlight.setRotation(closestElement.rotation).setFrame("bright_" + closestElement.frame.name).setOrigin(0.5, 0.866);
            } else {
                this.elementHighlight.visible = false;
            }
            if (closestEmbodiment.glow.visible) {
                this.embodimentHighlight.closest = closestEmbodiment;
                this.embodimentHighlight.visible = true;
                this.embodimentHighlight.setRotation(closestEmbodiment.rotation).setFrame("bright_" + closestEmbodiment.frame.name).setOrigin(0.5, 1.22);
            } else {
                this.embodimentHighlight.visible = false;
            }
        }

        if (!this.recentlyUpdatedSpellHover) {
            this.recentlyUpdatedSpellHover = true;
            this.updateSpellHover(closestElement, closestEmbodiment, distToClosestRuneElement, distToClosestRuneEmbodiment);
        } else {
            this.recentlyUpdatedSpellHover = false;
        }

        // high torque = lower friction
        let torqueMultInner = this.innerCircle.torque * this.innerCircle.torque > 0.00001 ? 0.6 : 1;
        let torqueMultOuter = this.outerCircle.torque * this.outerCircle.torque > 0.00001 ? 0.6 : 1;

        let velMultInner = (Math.abs(this.innerCircle.rotVel) + 0.001) / 0.004;
        let velMultOuter = (Math.abs(this.outerCircle.rotVel) + 0.001) / 0.004;

        // higher decayAltered = more friction
        let decayAmtInner = 1 - decayAltered * dt * innerDecayMult * torqueMultInner * velMultInner;
        let decayAmtOuter = 1 - decayAltered * dt * 0.9 * torqueMultOuter * velMultOuter;
        // higher static = more friction
        let staticAmtInner = STATIC * dt * innerDecayMult * torqueMultInner;
        let staticAmtOuter = STATIC * dt * 0.84 * torqueMultOuter;

        // keyboard torque
        if (this.keyboardRotateInner !== 0 && !this.innerDragDisabled) {
            this.usedKeyboardInner = true;
            let rotMult = 0.005/(0.005+Math.abs(this.innerCircle.rotVel));
            this.innerCircle.torque = this.keyboardRotateInner * 0.05 * rotMult;
        } else if (this.usedKeyboardInner) {
            this.usedKeyboardInner = false;
            this.innerCircle.rotVel *= 0.7;
        }

        if (this.keyboardRotateOuter !== 0 && !this.outerDragDisabled) {
            this.usedKeyboardOuter = true;
            let rotMult = 0.005/(0.005+Math.abs(this.outerCircle.rotVel));
            this.outerCircle.torque = this.keyboardRotateOuter * 0.05 * rotMult;
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
            if (this.innerCircle.rotVel < -MIN_VEL) {
                if (this.innerCircle !== this.draggedObj && this.keyboardRotateInner === 0 && distToClosestRuneElement > 0 && this.innerCircle.rotVel > -0.1 && this.innerCircle.rotVel < -0.028) {
                    staticAmtInner *= 3.1;
                    decayAmtInner *= 0.98;
                }
                this.innerCircle.rotVel = Math.min(0, this.innerCircle.rotVel * decayAmtInner + staticAmtInner);
            } else if (this.innerCircle.rotVel > MIN_VEL) {
                if (this.innerCircle !== this.draggedObj && this.keyboardRotateInner === 0 && distToClosestRuneElement < 0 && this.innerCircle.rotVel < 0.1 && this.innerCircle.rotVel > 0.028) {
                    staticAmtInner *= 3.1;
                    decayAmtInner *= 0.98;
                }
                this.innerCircle.rotVel = Math.max(0, this.innerCircle.rotVel * decayAmtInner - staticAmtInner);
            } else {
                this.innerCircle.rotVel = 0;
            }

            if (this.outerCircle.rotVel < -MIN_VEL) {
                if (this.outerCircle !== this.draggedObj && this.keyboardRotateOuter === 0 && distToClosestRuneEmbodiment > 0 && this.outerCircle.rotVel < -0.024) {
                    if (this.outerCircle.rotVel > -0.09)  {
                        staticAmtOuter *= 3.5;
                        decayAmtOuter *= 0.98;
                    }
                }
                this.outerCircle.rotVel = Math.min(0, this.outerCircle.rotVel * decayAmtOuter + staticAmtOuter);
            } else if (this.outerCircle.rotVel > MIN_VEL) {
                if (this.outerCircle !== this.draggedObj && this.keyboardRotateOuter === 0 && distToClosestRuneEmbodiment < 0 && this.outerCircle.rotVel < 0.09 && this.outerCircle.rotVel > 0.024) {
                    staticAmtOuter *= 3.5;
                    decayAmtOuter *= 0.98;
                }
                this.outerCircle.rotVel = Math.max(0, this.outerCircle.rotVel * decayAmtOuter - staticAmtOuter);
            } else {
                this.outerCircle.rotVel = 0;
            }
        }

        if (Math.abs(this.innerCircle.rotVel) > 0.036) {
            this.innerCircle.rotVel *= 0.98;
        }
        if (Math.abs(this.outerCircle.rotVel) > 0.036) {
            this.outerCircle.rotVel *= 0.98;
        }

        const torqueReleaseThreshold = 0.005; // if torque on release is higher, then full speed ahead
        let lagMultReducer = 1;// Math.max(0, Math.min(1, 2 - dt * 0.5));
        if (this.innerCircle.torque === 0 && Math.abs(this.innerCircle.torqueOnRelease) > 0.001) {
            let isTorqueOpposing = this.innerCircle.torqueOnRelease * this.innerCircle.rotVel < 0;
            if (isTorqueOpposing) {
                this.innerCircle.rotVel *= 0.05;
            } else if (Math.abs(this.innerCircle.torqueOnRelease) > torqueReleaseThreshold) {
                let slowOnRelease = Math.min(1.6, Math.max(1, Math.abs(this.innerCircle.torqueOnRelease) * lagMultReducer / torqueReleaseThreshold));
                this.innerCircle.rotVel *= slowOnRelease;
                if (this.innerCircle.rotVel > -0.043 && this.innerCircle.rotVel < -0.009) {
                    this.innerCircle.rotVel = -0.043;
                } else if (this.innerCircle.rotVel < 0.043 && this.innerCircle.rotVel > 0.009) {
                    this.innerCircle.rotVel = 0.043;
                }
                this.innerCircle.nextRotation += this.innerCircle.rotVel;
            } else {
                this.innerCircle.rotVel = 0;
            }
            this.innerCircle.torqueOnRelease = 0;
        }
        if (this.outerCircle.torque === 0 && Math.abs(this.outerCircle.torqueOnRelease) > 0.001) {
            let isTorqueOpposing = this.outerCircle.torqueOnRelease * this.outerCircle.rotVel < 0;
            if (isTorqueOpposing) {
                this.outerCircle.rotVel *= 0.05;
            } else if (Math.abs(this.outerCircle.torqueOnRelease) > torqueReleaseThreshold) {
                let slowOnRelease = Math.min(1.6, Math.max(1, Math.abs(this.outerCircle.torqueOnRelease) * lagMultReducer / torqueReleaseThreshold));
                this.outerCircle.rotVel *= slowOnRelease;
                if (this.outerCircle.rotVel > -0.038 && this.outerCircle.rotVel < -0.006) {
                    this.outerCircle.rotVel = -0.038;
                } else if (this.outerCircle.rotVel < 0.038 && this.outerCircle.rotVel > 0.006) {
                    this.outerCircle.rotVel = 0.038;
                }
                this.outerCircle.nextRotation += this.outerCircle.rotVel;
            } else {
                this.outerCircle.rotVel = 0;
            }
            this.outerCircle.torqueOnRelease = 0;
        }

        // high torque but low speed = strong push force
        // low torque but high speed = strong stop force
        let spinAmpFromRestInner = Math.abs(this.innerCircle.rotVel) < 0.01 ? 2 : 1;
        let spinAmpFromRestOuter = Math.abs(this.outerCircle.rotVel) < 0.01 ? 2.25 : 1;

        let flatMoveInner = 0; //this.innerCircle.torque > 0.01;
        let flatMoveOuter = 0;

        // flat drag amount
        let alteredDT = dt + 0.1;
        let multDT = alteredDT * alteredDT;
        let angleCutoff = gameVars.wasTouch ? 0.15 : 0.08;
        if (this.storedDragAngleDiff > angleCutoff) {
            this.storedDragAngleDiff = angleCutoff;
        } else if (this.storedDragAngleDiff < -angleCutoff) {
            this.storedDragAngleDiff = -angleCutoff;
        }
        if (this.draggedObj === this.innerCircle) {
            flatMoveInner = this.storedDragAngleDiff * (gameVars.wasTouch ? 0.06 : 0.05) * multDT;
        } else if (this.draggedObj === this.outerCircle) {
            flatMoveOuter = this.storedDragAngleDiff * (gameVars.wasTouch ? 0.06 : 0.05) * multDT;
        }
        this.storedDragAngleDiff = 0;

        // if (this.innerCircle.torque > 0.003) {
        //     flatMoveInner = 0;
        // } else if (this.innerCircle.torque < -0.003) {
        //     flatMoveInner = -0;
        // }
        // if (this.outerCircle.torque > 0.0025) {
        //     flatMoveOuter = 0;
        // } else if (this.outerCircle.torque < -0.0025) {
        //     flatMoveOuter = -0;
        // }
        let spinAmtInner = this.innerCircle.rotVel + this.innerCircle.torque * dt * 5 * spinAmpFromRestInner + flatMoveInner;
        let spinAmtOuter = this.outerCircle.rotVel + this.outerCircle.torque * dt * 3.5 * spinAmpFromRestOuter + flatMoveOuter;

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
        if (this.draggedObj !== this.innerCircle) {
            let distToClosestRuneElement = 999;
            for (let i = 0; i < this.elements.length; i++) {
                let distToRune = this.getRotationDiff(this.innerCircle.nextRotation + this.innerCircle.rotVel * 2, this.elements[i].startRotation);
                if (Math.abs(distToRune) < Math.abs(distToClosestRuneElement)) {
                    distToClosestRuneElement = distToRune;
                }
            }

            let absDistToClosestRuneElement = Math.abs(distToClosestRuneElement);
            if (distToClosestRuneElement < 0.45 && absDistToClosestRuneElement > 0.005) {
                let strengthRatio = Math.min(1, Math.max(0, 1 - absDistToClosestRuneElement * 1.8))
                strengthRatio *= strengthRatio * strengthRatio * strengthRatio;

                this.innerCircle.rotation -= distToClosestRuneElement * strengthRatio;// Math.max(-0.05, Math.min(0.05, turnAmount)) * dt * rotVelMult;
                //if (!this.dragCircle.visible) {
                    // player isn't pulling
                    let absRotVelMult = Math.max(0, 1 - Math.max(0, Math.abs(this.innerCircle.rotVel) * 25));
                    this.innerCircle.nextRotation -= distToClosestRuneElement * 0.24 * absRotVelMult;
                //}
            }
        }

        if (this.draggedObj !== this.outerCircle) {
            let distToClosestRuneEmbodiment = 999;
            for (let i = 0; i < this.embodiments.length; i++) {
                let distToRune = this.getRotationDiff(this.outerCircle.nextRotation + this.outerCircle.rotVel * 2, this.embodiments[i].startRotation);
                if (Math.abs(distToRune) < Math.abs(distToClosestRuneEmbodiment)) {
                    distToClosestRuneEmbodiment = distToRune;
                }
            }
            let absDistToClosestRuneEmbodiment = Math.abs(distToClosestRuneEmbodiment);
            if (Math.abs(distToClosestRuneEmbodiment) < 0.4 && absDistToClosestRuneEmbodiment > 0.005) {
                let strengthRatio = Math.min(1, Math.max(0, 1 - absDistToClosestRuneEmbodiment * 2))
                strengthRatio *= strengthRatio * strengthRatio * strengthRatio;

                this.outerCircle.rotation -= distToClosestRuneEmbodiment * strengthRatio;// Math.max(-0.05, Math.min(0.05, turnAmount)) * dt * rotVelMult;
                //if (!this.dragCircle.visible) {
                    // player isn't pulling
                    let absRotVelMult = Math.max(0, 1 - Math.max(0, Math.abs(this.outerCircle.rotVel) * 25));
                    this.outerCircle.nextRotation -= distToClosestRuneEmbodiment * 0.2 * absRotVelMult;
                //}
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
            if (this.castButton.frame.name !== (this.altString + 'cast_disabled.png')) {
                this.castGlow.alpha = 0.5;
                this.scene.tweens.add({
                    targets: this.castGlow,
                    duration: gameVars.gameManualSlowSpeed * 1000,
                    ease: 'Quint.easeOut',
                    alpha: 0,
                });
                this.castButton.setTexture(key, (this.altString + 'cast_disabled.png'));
            }
        } else if (this.castButton.frame.customData.filename !== this.castButton.lazyFrame) {
            if (this.castButton.frame.customData.filename === (this.altString + 'cast_disabled.png') && this.castButton.lazyFrame === (this.altString + 'cast_normal.png')) {
                this.castButtonSpare.alpha = 0.6;
                this.scene.tweens.add({
                    targets: this.castButtonSpare,
                    duration: gameVars.gameManualSlowSpeed * 400,
                    ease: 'Cubic.easeOut',
                    alpha: 0,
                });
                // this.castButtonFlash.alpha = 0.15;
                // this.scene.tweens.add({
                //     targets: this.castButtonFlash,
                //     duration: gameVars.gameManualSlowSpeed * 300,
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
         let matterThorns = playerStatuses['matterReinforce'];
         if (matterThorns) {
             let thorns1 = matterThorns.animObj[0];
             let thorns2 = matterThorns.animObj[1];
             thorns1.rotation = this.outerCircle.rotation;
             thorns2.rotation = this.outerCircle.rotation;
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
                                 duration: gameVars.gameManualSlowSpeed * 275,
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
                                 duration: gameVars.gameManualSlowSpeed * 275,
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
                                 duration: gameVars.gameManualSlowSpeed * 275,
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
                                 duration: gameVars.gameManualSlowSpeed * 275,
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
                     let shieldFollowObjRot = shieldObj.animObj[1].rotation;
                     if (goalRotTime > shieldFollowObjRot + Math.PI * 2 - 0.5) {
                         shieldFollowObjRot += Math.PI * 2;
                     } else if (goalRotTime < shieldFollowObjRot - Math.PI * 2 + 0.5) {
                         shieldFollowObjRot -= Math.PI * 2;
                     }

                     let goalRotTime2 = goalRotTime * 0.5 + shieldFollowObjRot * 0.5;
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
                                 duration: gameVars.gameManualSlowSpeed * 250,
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
                                 duration: gameVars.gameManualSlowSpeed * 250,
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
                             duration: gameVars.gameManualSlowSpeed * 150,
                             scaleX: 0.1,
                             ease: 'Cubic.easeIn',
                             onComplete: () => {
                                 this.scene.tweens.add({
                                     targets: shieldEyes[randIndex],
                                     duration: gameVars.gameManualSlowSpeed * 150,
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
                duration: gameVars.gameManualSlowSpeed * 500,
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
                if (i === 0) {
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
                if (i === 0) {
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
            this.createEmbodimentCast(closestEmbodiment, () => {
                this.trueCastSpell(closestElement, closestEmbodiment, shieldId, closestEmbodiment.startRotation);
            });

            if (this.spellNameTextAnim) {
                this.spellNameTextAnim.stop();
            }

            this.spellDescriptor.addTween({ease: 'Cubic.easeIn', alpha: 0, duration: gameVars.gameManualSlowSpeed * 400});
            this.spellNameTextAnim = this.scene.tweens.add({
                targets: [this.spellNameText, this.spellElementText, this.spellActionText],
                ease: 'Cubic.easeIn',
                alpha: 0,
                duration: gameVars.gameManualSlowSpeed * 400,
            });
            messageBus.publish('spellClicked');

        } else {
            // failed cast
            let retryDelay = this.keyboardCasted ? 150 : 0;
            PhaserScene.time.delayedCall(gameVars.gameManualSlowSpeed * retryDelay, () => {
                this.bufferedCastAvailable = true;
                PhaserScene.time.delayedCall(gameVars.gameManualSlowSpeed * 250, () => {
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
            this.elementHighlight.visible = false;
            this.embodimentHighlight.visible = false;
            this.innerDragDisabled = true;
            this.outerDragDisabled = true;
            this.castDisabled = true;
            this.disableSpellDescDisplay = true;
            this.recharging = true;
            this.lastDragTime = -1000;
            messageBus.publish("resetCircle")
            this.scene.tweens.add({
                targets: this.innerCircle,
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
                duration: gameVars.gameManualSlowSpeed * 1800,
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
                duration: gameVars.gameManualSlowSpeed * 1800,
                rotation: "-=6.283"
            });
        }
    }

    manualResetElements(elemUsed, useLongDelay = false) {
        if (this.innerDragDisabled) {
            return;
        }
        this.manuallyResettingElements = true;
        this.innerDragDisabled = true;
        this.castDisabled = true;
        this.recharging = true;
        this.lastDragTime = -1000;
        this.elementHighlight.visible = false;
        this.embodimentHighlight.visible = false;
        if (useLongDelay) {
            this.spellNameText.visible = false;
            this.spellElementText.setText('');
            this.spellActionText.setText('');
            this.clearSpellDescriptorText();
            this.spellDescriptor.stopNextAudio();
        }
        let spinAmt = useLongDelay ? "+=12.566" : "+=6.283"
        this.scene.tweens.add({
            targets: this.innerCircle,
            ease: 'Back.easeIn',
            easeParams: [useLongDelay ? 0.9 : 1.1],
            onComplete: () => {
                this.resetElements(elemUsed);
                this.innerDragDisabled = false;
            },
            duration: gameVars.gameManualSlowSpeed * useLongDelay ? 2100 : 1200,
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
        this.elementHighlight.visible = false;
        this.embodimentHighlight.visible = false;
        let sprite = this.elemCircle;
        if (!sprite) {
            this.elemCircle = this.scene.add.sprite(this.x, this.y, 'circle', 'circle.png');
            sprite = this.elemCircle;
            sprite.setDepth(131);
        }

        sprite.setScale(0.8).setAlpha(1);
        this.innerCircle.prevRotation = this.innerCircle.rotation;
        this.innerCircle.nextRotation = this.innerCircle.rotation;
        this.scene.tweens.add({
            targets: sprite,
            alpha: 0,
            scaleX: 1,
            scaleY: 1,
            duration: gameVars.gameManualSlowSpeed * 500,
        });
    }


     manualResetEmbodiments(embodiUsed, useLongDelay = false) {
         if (this.outerDragDisabled) {
             return;
         }
         this.outerDragDisabled = true;
         this.castDisabled = true;
         this.disableSpellDescDisplay = true;
         this.recharging = true;
         this.lastDragTime = -1000;
         this.elementHighlight.visible = false;
         this.embodimentHighlight.visible = false;
         PhaserScene.time.delayedCall(gameVars.gameManualSlowSpeed * 250, () => {
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
                             this.readySprite = this.scene.add.sprite(this.x, this.y, 'circle').play('circleEffect').setScale(1.1).setDepth(1000);
                         } else {
                             this.readySprite.visible = true;
                             this.readySprite.play(useLongDelay ? 'circleEffect' : 'circleEffectSmall');
                             this.readySprite.setScale(1.1);
                         }
                         this.readySprite.setAlpha(1);
                         let tweenDur = gameVars.gameManualSlowSpeed * (useLongDelay ? 1200 : 900);
                         this.scene.tweens.add({
                             targets: this.readySprite,
                             scaleX: useLongDelay ? 2.63 : 2.57,
                             scaleY: useLongDelay ? 2.63 : 2.57,
                             duration: tweenDur,
                             ease: 'Cubic.easeOut',
                             onComplete: () => {
                                 this.readySprite.visible = false;
                             }
                         });
                         this.scene.tweens.add({
                             targets: this.readySprite,
                             alpha: 0,
                             duration: tweenDur,
                             ease: 'Quad.easeIn',
                         });
                     }
                 }, useLongDelay ? 800 : 0)
             },
             duration: gameVars.gameManualSlowSpeed * useLongDelay ? 2100 : 1200,
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
        this.elementHighlight.visible = false;
        this.embodimentHighlight.visible = false;
        let sprite = this.embodiCircle;
        if (!sprite) {
            this.embodiCircle = this.scene.add.sprite(this.x, this.y, 'circle', 'circle.png');
            sprite = this.embodiCircle;
            sprite.setDepth(130);
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
            duration: gameVars.gameManualSlowSpeed * 500,
            completeDelay: 500,
            onComplete: () => {
                // this.disableSpellDescDisplay = false;
            }
        });
    }

    createElementCast(elem) {
        let elemName = elem.runeName;
        let sprite = this.elementsAnimArray[elemName];
        if (!sprite || sprite.canUse === false) {
            // If cannot reuse, then make new. potentially mark for later deletion
            let hasDelete = sprite && sprite.canUse;
            sprite = this.scene.add.sprite(0, -999, 'circle', "bright_" + elemName + '.png');
            sprite.setOrigin(0.5, 0.14);
            if (!hasDelete) {
                this.elementsAnimArray[elemName] = sprite;
            }
            sprite.setDepth(130);
            sprite.shouldDelete = hasDelete;
        }
        sprite.canUse = false;

        let castCircle = poolManager.getItemFromPool('castCircle');
        if (!castCircle) {
            castCircle = this.scene.add.sprite(this.x, this.y - 100, 'circle', 'cast_circle.png');
            castCircle.setDepth(130);
        }
        castCircle.alpha = 0;
        castCircle.setScale(1.25);
        castCircle.rotation = 0;

        sprite.setPosition(this.x + Math.sin(elem.rotation) * 133, this.y - Math.cos(elem.rotation) * 133);
        sprite.setAlpha(1);
        castCircle.setPosition(sprite.x, sprite.y + 21);
        sprite.setScale(1.2);

        this.scene.tweens.add({
            targets: sprite,
            duration: gameVars.gameManualSlowSpeed * 100,
            ease: 'Cubic.easeOut',
            scaleX: isMobile ? 1.5 : 1.4,
            scaleY: isMobile ? 1.5 : 1.4,
            y: "-=6",
            onComplete: () => {
                this.scene.tweens.add({
                    targets: sprite,
                    ease: 'Cubic.easeOut',
                    y: "+=9",
                    duration: gameVars.gameManualSlowSpeed * 350,
                    scaleX: isMobile ? 1.075 : 1.05,
                    scaleY: isMobile ? 1.075 : 1.05
                });
            }
        });


        this.scene.tweens.add({
            targets: castCircle,
            duration: gameVars.gameManualSlowSpeed * 250,
            alpha: 0.95
        });

        this.scene.tweens.add({
            targets: castCircle,
            ease: 'Cubic.easeIn',
            duration: gameVars.gameManualSlowSpeed * 220,
            scaleX: 1,
            scaleY: 1,
            onComplete: () =>
            {
                castCircle.alpha = 1;
                this.scene.tweens.add({
                    targets: castCircle,
                    duration: gameVars.gameManualSlowSpeed * 650,
                    delay: 30,
                    ease: 'Quart.easeInOut',
                    rotation: -1.57,
                    alpha: 0.55
                });
                this.scene.tweens.add({
                    targets: [castCircle],
                    ease: 'Quart.easeInOut',
                    delay: 60,
                    duration: gameVars.gameManualSlowSpeed * 800,
                    x: this.x - 28,
                    y: this.y - 246,
                });

                this.scene.tweens.add({
                    targets: [sprite],
                    ease: 'Quart.easeInOut',
                    delay: 60,
                    duration: gameVars.gameManualSlowSpeed * 800,
                    x: this.x - 28,
                    y: this.y - 262,
                    onComplete: () => {
                        this.scene.tweens.add({
                            targets: [sprite, castCircle],
                            alpha: 0,
                            scaleX: 1.5,
                            scaleY: 1.5,
                            y: "-=2",
                            x: "-=2",
                            ease: 'Cubic.easeOut',
                            duration: gameVars.gameManualSlowSpeed * 600,
                            onComplete: () => {
                                poolManager.returnItemToPool(castCircle, 'castCircle');
                                if (sprite.shouldDelete) {
                                    sprite.destroy();
                                } else {
                                    sprite.setScale(1);
                                    sprite.canUse = true;
                                }
                            }
                        });
                    }
                });
            }
        });
    }

    createEmbodimentCast(elem, castFunc) {
        let elemName = elem.runeName;
        let sprite = this.embodimentsAnimArray[elemName];
        if (!sprite || sprite.canUse === false) {
            // If cannot reuse, then make new. potentially mark for later deletion
            let hasDelete = sprite && sprite.canUse;
            sprite = this.scene.add.sprite(0, -999, 'circle', "bright_" + elemName + '.png');
            sprite.setOrigin(0.5, 0.14);
            if (!hasDelete) {
                this.embodimentsAnimArray[elemName] = sprite;
            }
            sprite.setDepth(130);
            sprite.shouldDelete = hasDelete;
        }
        let isAttack = elemName === 'rune_strike';
        sprite.canUse = false;
        let castCircle = poolManager.getItemFromPool('castCircle');
        if (!castCircle) {
            castCircle = this.scene.add.sprite(this.x, this.y - 100, 'circle', 'cast_circle.png');
            castCircle.setDepth(130);
        }
        castCircle.alpha = 0;
        castCircle.setScale(1.25);
        castCircle.rotation = 0;

        sprite.setPosition(this.x + Math.sin(elem.rotation) * 196, this.y - Math.cos(elem.rotation) * 197);
        sprite.setAlpha(1);
        castCircle.setPosition(sprite.x, sprite.y + 18);
        sprite.setScale(1.2);

        this.scene.tweens.add({
            targets: sprite,
            y: "-=9",
            duration: gameVars.gameManualSlowSpeed * 100,
            ease: 'Cubic.easeOut',
            scaleX: isMobile ? 1.55 : 1.44,
            scaleY: isMobile ? 1.55 : 1.44,
            completeDelay: isMobile ? 50 : 0,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: sprite,
                    ease: 'Cubic.easeOut',
                    y: "+=9",
                    duration: gameVars.gameManualSlowSpeed * 350,
                    scaleX: isMobile ? 1.075 : 1.05,
                    scaleY: isMobile ? 1.075 : 1.05
                });
            }
        });

        this.scene.tweens.add({
            targets: castCircle,
            duration: gameVars.gameManualSlowSpeed * 250,
            alpha: 0.95,
        });
        if (this.focusLinesOn.currAnim) {
            this.focusLinesOn.currAnim.stop();
        }
        this.focusLinesOn.setFrame('focus_lines_glow.png');
        this.focusLinesOn.alpha = 1;
        this.scene.tweens.add({
            targets: this.focusLinesOn,
            duration: gameVars.gameManualSlowSpeed * 325,
            ease: 'Quart.easeIn',
            alpha: 0,
            onComplete: () => {
                this.focusLinesOn.setFrame('focus_lines_on.png')
            }
        });

        this.scene.tweens.add({
            targets: castCircle,
            ease: 'Cubic.easeIn',
            duration: gameVars.gameManualSlowSpeed * 220,
            scaleX: 1,
            scaleY: 1,
            onComplete: () => {
                castCircle.alpha = 1;
                this.scene.tweens.add({
                    targets: castCircle,
                    duration: gameVars.gameManualSlowSpeed * 650,
                    delay: 30,
                    ease: 'Quart.easeInOut',
                    rotation: 1.57,
                    alpha: 0.55
                });
                let stopForceAlignmentDelay = this.keyboardCasted ? 100 : 0;
                let attackAlignDelay = isAttack ? 100 : 0;
                let reEnableDelay = this.keyboardCasted ? 200 : 0;
                PhaserScene.time.delayedCall(gameVars.gameManualSlowSpeed * stopForceAlignmentDelay, () => {
                    this.forcingAlignment = false;
                });
                this.scene.tweens.add({
                    targets: sprite,
                    delay: 60,
                    rotation: 0,
                    duration: gameVars.gameManualSlowSpeed * 750,
                    onComplete: () => {
                        let rotateDelay = this.outerDragDisabled ? 650 : 0;
                        this.focusLinesOn.currAnim = this.scene.tweens.add({
                            delay: reEnableDelay + rotateDelay + attackAlignDelay,
                            targets: this.focusLinesOn,
                            duration: gameVars.gameManualSlowSpeed * 150,
                            alpha: 0.65,
                            ease: 'Cubic.easeIn',
                            onComplete: () => {
                                this.focusLinesOn.setAlpha(1);
                                this.focusLinesOn.currAnim = this.scene.tweens.add({
                                    targets: this.focusLinesOn,
                                    duration: gameVars.gameManualSlowSpeed * 200,
                                    alpha: 0.94,
                                    onComplete: () => {
                                        this.focusLinesOn.currAnim = null;
                                    }
                                });
                            }
                        });
                    }
                });

                this.scene.tweens.add({
                    targets: [castCircle],
                    ease: 'Quart.easeInOut',
                    delay: 60,
                    duration: gameVars.gameManualSlowSpeed * 800,
                    x: this.x + 28,
                    y: this.y - 246,
                });
                this.scene.tweens.add({
                    targets: [sprite],
                    ease: 'Quart.easeInOut',
                    delay: 60,
                    duration: gameVars.gameManualSlowSpeed * 800,
                    x: this.x + 28,
                    y: this.y - 262,
                    onComplete: () => {
                        castFunc();
                        PhaserScene.time.delayedCall(gameVars.gameManualSlowSpeed * 230, () => {
                            this.bufferedCastAvailable = true;
                        });
                        PhaserScene.time.delayedCall(gameVars.gameManualSlowSpeed * (25 + reEnableDelay + attackAlignDelay), () => {
                            if (!this.outerDragDisabled) {
                                this.castDisabled = false;
                            }
                            if (gameOptions.infoBoxAlign === 'center') {
                                this.disableSpellDescDisplay = true;
                            }

                            if (this.spellNameTextAnim) {
                                this.spellNameTextAnim.stop();
                            }
                            let extraDur = 0;
                            if (elemName === "rune_strike" || elemName === "rune_ultimate") {
                                extraDur = 400;
                            }
                            this.spellNameTextAnim = this.scene.tweens.add({
                                targets: [this.spellNameText, this.spellActionText, this.spellElementText],
                                delay: 1000 + extraDur,
                                alpha: 0.55,
                                duration: gameVars.gameManualSlowSpeed * 150,
                                onStart: () => {
                                    this.disableSpellDescDisplay = false;
                                    this.spellDescriptor.addTween({
                                        ease: 'Cubic.easeInOut',
                                        alpha: gameOptions.infoBoxAlign === 'center' ? 0.9 : 0.98,
                                        duration: gameVars.gameManualSlowSpeed * 150,
                                    });
                                }
                            });

                            this.bufferedCastAvailable = false;
                            if (this.useBufferedSpellCast) {
                                this.castSpell(true);
                            }
                        });
                        this.scene.tweens.add({
                            targets: [castCircle],
                            alpha: 0,
                            scaleX: 1.5,
                            scaleY: 1.5,
                            x: "+=2",
                            y: "-=2",
                            ease: 'Cubic.easeOut',
                            duration: gameVars.gameManualSlowSpeed * 600,
                            onComplete: () => {
                                poolManager.returnItemToPool(castCircle, 'castCircle');
                                if (sprite.shouldDelete) {
                                    sprite.destroy();
                                } else {
                                    sprite.setScale(1);
                                    sprite.canUse = true;
                                }
                            }
                        });

                        this.scene.tweens.add({
                            targets: [sprite],
                            alpha: 0,
                            scaleX: 1.5,
                            scaleY: 1.5,
                            x: "+=2",
                            y: "-=6",
                            ease: 'Cubic.easeOut',
                            duration: gameVars.gameManualSlowSpeed * 600,
                            onComplete: () => {
                                if (sprite.shouldDelete) {
                                    sprite.destroy();
                                } else {
                                    sprite.setScale(1);
                                    sprite.canUse = true;
                                }
                            }
                        });
                    }
                });
            },
        });
    }

    showReadySprite(light = true, scaleMult = 1) {
        if (this.readySprite) {
            if (this.readySprite.currAnim) {
                this.readySprite.currAnim.stop();
            }
            this.readySprite.setAlpha(1);
            this.readySprite.setScale(1.15 * scaleMult);
            this.readySprite.play(light ? 'circleEffect' : 'circleEffectSmall');
            this.readySprite.visible = true;
            let goalScale = (light ? 1.8 : 1.75)*scaleMult;
            this.readySprite.currAnim = this.scene.tweens.add({
                targets: this.readySprite,
                scaleX: goalScale,
                scaleY: goalScale,
                duration: gameVars.gameManualSlowSpeed * light ? 800 : 650,
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

    setAuraAlpha(alpha = 0) {
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
                    duration: gameVars.gameManualSlowSpeed * isMobile ? 750 : 600,
                    scaleX: 1,
                    scaleY: 1,
                    alpha: 0
                });
            },
            duration: gameVars.gameManualSlowSpeed * 50,
            alpha: isMobile ? 0.8 : 0.7
        });
    }

    getDelayedDamageClockScale() {
        let multAmt = Math.max(0, Math.floor((this.delayedDamage - 1) / this.delayedDamageBase));
        return 0.5 + 0.1 * (Math.sqrt(multAmt * 0.5) + multAmt * 0.2);
    }

    plainUpdateDelayedDamageVisual(scale) {
        this.delayDamageHourglass.setScale(scale - 0.1);
        let closestBase = Math.floor(Math.max(0, this.delayedDamage - 0.5) / this.delayedDamageBase) * this.delayedDamageBase;
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
            duration: gameVars.gameManualSlowSpeed * 400,
            alpha: 0
        });
    }

     handleStatusesTicked() {
        if (this.delayedDamage > 0) {
            if (this.delayedDamageRecentlyAdded) {
                this.delayedDamageRecentlyAdded = false;
                return;
            }
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
        if (!globalObjects.currentEnemy || globalObjects.currentEnemy.dead) {
            return;
        }
         this.delayedDamage -= amt;
        if (globalObjects.player.recentlyTakenDelayedDamageAmt > 0) {
            globalObjects.player.recentlyTakenDelayedDamageAmt -= amt;
            globalObjects.player.recentlyTakenDamageAmt += amt;
        }

         this.delayDamageText.setText(this.delayedDamage);
         // this.delayDamageSandFull.setScale(0.03 + Math.min(1, this.delayedDamage / this.delayedDamageBase));
         messageBus.publish('selfTakeTrueDamage', amt);
     }

     getDelayedDamage() {
        return this.delayedDamage;
     }

     enableVoidArm(delay, duration, scale) {
        let useBig = scale > 1.3;
        let delayAdjusted = gameVars.gameManualSlowSpeed * delay;
         this.voidArm.setScale(useBig ? scale * 0.95 : scale * 1.15);
         this.scene.tweens.add({
             targets: this.voidArm,
             delay: delayAdjusted,
             duration: gameVars.gameManualSlowSpeed * (duration - 900),
             y: 210,
             onComplete: () => {
                 this.scene.tweens.add({
                     targets: this.voidArm,
                     alpha: 0,
                     duration: gameVars.gameManualSlowSpeed * 400,
                     ease: 'Cubic.easeIn',
                 });
             }
         });
         this.scene.tweens.add({
             targets: this.voidArm,
             delay: delayAdjusted,
             duration: gameVars.gameManualSlowSpeed * 350,
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
                 delay: delayAdjusted,
                 duration: gameVars.gameManualSlowSpeed * (duration - 900),
                 y: 210,
                 onComplete: () => {
                     this.scene.tweens.add({
                         targets: this.voidArm2,
                         alpha: 0,
                         duration: gameVars.gameManualSlowSpeed * 400,
                         ease: 'Cubic.easeIn',
                     });
                 }
             });
             this.scene.tweens.add({
                 targets: this.voidArm2,
                 delay: delayAdjusted,
                 duration: gameVars.gameManualSlowSpeed * 350,
                 ease: 'Back.easeOut',
                 easeParams: [5],
                 alpha: 1,
                 scaleX: scale,
                 scaleY: scale
             });
         }
     }

     addDelayedDamage(amt) {
        if (!globalObjects.currentEnemy || globalObjects.currentEnemy.dead) {
            return;
        }
        let oldDelayedDamage = this.delayedDamage;
         this.delayedDamage += amt;
         this.delayedDamageRecentlyAdded = true;

        if (globalObjects.player.canResetRecentDamage) {
            globalObjects.player.canResetRecentDamage = false;
            globalObjects.player.resetRecentDamage();
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
                let size = 98 * (scaleAmtTotal - 0.1);
                this.delayDamagePartial.visible = true;
                this.delayDamagePartial.clear();
                this.delayDamagePartial.slice(xPos, yPos, size, -1.5708, rotateAmt, false);
                this.delayDamagePartial.fillPath();
                // this.delayDamagePartial.setAlpha(0);

                this.scene.tweens.add({
                     targets: [this.delayDamagePartial],
                     duration: gameVars.gameManualSlowSpeed * 400,
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
                     duration: gameVars.gameManualSlowSpeed * 400,
                     alpha: 1,
                     onComplete: () => {
                        let scale = this.getDelayedDamageClockScale();
                        this.plainUpdateDelayedDamageVisual(scale)
                     }
                 });
             } else {
                 this.scene.tweens.add({
                     targets: [this.delayDamageText],
                     ease: 'Cubic.easeOut',
                     rotation: 0,
                     scaleX: textScaleFinal,
                     scaleY: textScaleFinal,
                     duration: gameVars.gameManualSlowSpeed * 250,
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

     updateSpellDescriptorText(newTextStr) {
        let currText = this.spellDescriptor.getText();
         if (currText !== newTextStr) {
             if (this.disableSpellDescDisplay || this.manualDisabled || globalObjects.bannerTextManager.isShowing) {
                 this.clearSpellDescriptorText();
                 this.spellDescriptor.stopNextAudio();
                 return;
             }
             if (!this.spellDescriptor.getStopNextAudio()) {
                 let currTime = Date.now();
                 let detuneAmt = 0;
                 let volAmt = 1;
                 let lastClickedDelay = currTime - this.lastPlayedClickTime;
                 if (lastClickedDelay > 25) {
                     if (lastClickedDelay < 1000) {
                         detuneAmt = Math.floor((lastClickedDelay - 900 - Math.floor(Math.random() * 100)) * 0.5);
                         volAmt = 0.8 + detuneAmt * 0.001;
                     }
                     playSound('click', volAmt).detune = detuneAmt;
                     this.lastPlayedClickTime = Date.now();
                 }
             }

             messageBus.publish("spellNameTextUpdate", newTextStr)
             this.spellDescriptor.setText(newTextStr);
             // //this.spellDescriptor.setAlpha(0.8);
             // this.spellDescriptor.addTween({
             //     ease: 'Cubic.easeInOut',
             //     alpha: 1,
             //     duration: gameVars.gameManualSlowSpeed * 150,
             // });
             // this.spellDescriptor.addTween({ease: 'Cubic.easeInOut', alpha: 1, duration: 250, delay: 500});

             if (gameOptions.infoBoxAlign === 'center') {
                 if (this.spellDescriptor.isMultiLine()) {
                     this.spellElementText.y = this.spellElementText.startY - 15;
                     this.spellNameText.y = this.spellNameText.startY - 15;
                     this.spellActionText.y = this.spellActionText.startY - 15;
                 } else {
                     this.spellElementText.y = this.spellElementText.startY;
                     this.spellNameText.y = this.spellNameText.startY;
                     this.spellActionText.y = this.spellActionText.startY;
                 }
             }
         }
     }

     clearSpellDescriptorText() {
        if (this.spellDescriptor.getText() !== '') {
            this.spellDescriptor.setText('');
            if (!this.showRunes) {
                this.spellNameText.setText('');
            }
            if (gameOptions.infoBoxAlign === 'center') {
                this.spellElementText.y = this.spellElementText.startY;
                this.spellNameText.y = this.spellNameText.startY;
                this.spellActionText.y = this.spellActionText.startY;
            }
        }
     }

     updateSpellHover(closestElement, closestEmbodiment, closestElementDist, closestEmbodimentDist) {
        let multiplier = globalObjects.player.spellMultiplier();
        let multText = "";
        if (multiplier > 1.1) {
            multText = " X" + multiplier;
        }
        let hideSpellDescriptor = false;
         if (gameOptions.infoBoxAlign === 'left') {
             if (this.disableSpellDescDisplay || this.manualDisabled || globalObjects.bannerTextManager.isShowing) {
                 this.clearSpellDescriptorText();
                 this.spellDescriptor.stopNextAudio();
                 hideSpellDescriptor = true;
             }
         } else {
             if (this.castDisabled || this.disableSpellDescDisplay || this.manualDisabled || globalObjects.bannerTextManager.isShowing) {
                 this.clearSpellDescriptorText();
                 this.spellDescriptor.stopNextAudio();
                 hideSpellDescriptor = true;
             }
         }

        // LEt enemy finish last 3% of charge always.
         let embodimentText = '';
         if (!hideSpellDescriptor) {
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
                     embodimentText = 'SHIELD';
                     break;
                 case RUNE_UNLOAD:
                     embodimentText = 'ULTIMATE';
                     break;
                 default:
                     break;
             }
         }


         let postPendTextName = gameOptions.infoBoxAlign === 'center' ? "_long" : "";
         // let displayText = "+";
         if (!hideSpellDescriptor) {
             if (closestElement.runeName && closestEmbodiment.runeName) {
                 let nameId = closestElement.runeName + "_" + closestEmbodiment.runeName;
                 this.spellNameText.setText(getBasicText(nameId))
             } else {
                 this.spellNameText.setText('')
             }

             switch (closestElement.runeName) {
                 case RUNE_MATTER:
                     this.spellElementText.setText('MATTER');
                     switch (closestEmbodiment.runeName) {
                         case RUNE_STRIKE:
                             if (gameVars.matterPlus) {
                                 this.updateSpellDescriptorText(getLangText('matter_strike_plus_desc' + postPendTextName));
                             } else {
                                 this.updateSpellDescriptorText(getLangText('matter_strike_desc' + postPendTextName));
                             }
                             break;
                         case RUNE_REINFORCE:
                             embodimentText += multiplier > 1.1 ? (" X" + multiplier) : "";
                             this.updateSpellDescriptorText(getLangText('matter_reinforce_desc' + postPendTextName));
                             break;
                         case RUNE_ENHANCE:
                             embodimentText += multiplier > 1.1 ? (" X" + multiplier) : "";
                             this.updateSpellDescriptorText(getLangText('matter_enhance_desc' + postPendTextName));
                             break;
                         case RUNE_PROTECT:
                             embodimentText += multiplier > 1.1 ? (" X" + multiplier) : "";
                             this.updateSpellDescriptorText(getLangText((gameVars.matterPlus ? 'matter_protect_plus_desc' : 'matter_protect_desc') + postPendTextName));
                             break;
                         case RUNE_UNLOAD:
                             embodimentText += multiplier > 1.1 ? (" X" + multiplier) : "";
                             this.updateSpellDescriptorText(getLangText('matter_unload_desc' + postPendTextName));
                             break;
                         default:
                             this.clearSpellDescriptorText()
                             break;
                     }
                     break;
                 case RUNE_TIME:
                     this.spellElementText.setText('TIME');
                     switch (closestEmbodiment.runeName) {
                         case RUNE_STRIKE:
                             this.updateSpellDescriptorText(getLangText('time_strike_desc' + postPendTextName));
                             break;
                         case RUNE_REINFORCE:
                             let healMult = (1 - (0.5 ** multiplier));
                             let healToDisplay = globalObjects.player.getSelfHealAmt(healMult);
                             let maxHealAmt = globalObjects.player.lastInjuryHealth - globalObjects.player.health;
                             let healToFlash = Math.min(maxHealAmt, globalObjects.player.recentlyTakenDamageAmt * healMult);

                             embodimentText += " (\\" + healToDisplay + ")";
                             this.updateSpellDescriptorText(getLangText('time_reinforce_desc' + postPendTextName));
                            if (healToFlash > 1) {
                                globalObjects.player.flashRecentInjury(false, healToFlash, true)
                            }

                             break;
                         case RUNE_ENHANCE:
                             embodimentText += multiplier > 1.1 ? (" X" + multiplier) : "";
                             this.updateSpellDescriptorText(getLangText('time_enhance_desc' + postPendTextName));
                             break;
                         case RUNE_PROTECT:
                             embodimentText += multiplier > 1.1 ? (" X" + multiplier) : "";
                             this.updateSpellDescriptorText(getLangText('time_protect_desc' + postPendTextName));
                             break;
                         case RUNE_UNLOAD:
                             let turnsAdded = 0;
                             let tempMult = multiplier;
                             while (tempMult > 0) {
                                 tempMult--;
                                 turnsAdded += Math.max(3, 7 - globalObjects.player.getPlayerTimeExhaustion() - tempMult);
                             }
                             this.updateSpellDescriptorText(getLangText('time_unload_desc' + postPendTextName) + turnsAdded + getLangText('time_unload_desc_2' + postPendTextName));
                             break;
                         default:
                             this.clearSpellDescriptorText()
                             break;
                     }
                     break;
                 case RUNE_MIND:
                     this.spellElementText.setText('ENERGY');
                     switch (closestEmbodiment.runeName) {
                         case RUNE_STRIKE:
                             this.updateSpellDescriptorText(getLangText('mind_strike_desc' + postPendTextName));
                             break;
                         case RUNE_REINFORCE:
                             embodimentText += multiplier > 1.1 ? (" X" + multiplier) : "";
                             this.updateSpellDescriptorText(getLangText('mind_reinforce_desc' + postPendTextName));
                             break;
                         case RUNE_ENHANCE:
                             embodimentText += multiplier > 1.1 ? (" X" + multiplier) : "";
                             if (gameVars.mindPlus) {
                                 this.updateSpellDescriptorText(getLangText('mind_enhance_plus_desc' + postPendTextName));
                             } else {
                                 this.updateSpellDescriptorText(getLangText('mind_enhance_desc' + postPendTextName));
                             }
                             break;
                         case RUNE_PROTECT:
                             embodimentText += multiplier > 1.1 ? (" X" + multiplier) : "";
                             this.updateSpellDescriptorText(getLangText('mind_protect_desc' + postPendTextName));
                             break;
                         case RUNE_UNLOAD:
                             embodimentText += multiplier > 1.1 ? "" : "";
                             this.updateSpellDescriptorText(getLangText('mind_unload_desc' + postPendTextName));
                             break;
                         default:
                             this.clearSpellDescriptorText();
                             break;
                     }
                     break;
                 case RUNE_VOID:
                     this.spellElementText.setText('VOID');
                     switch (closestEmbodiment.runeName) {
                         case RUNE_STRIKE:
                             this.updateSpellDescriptorText(getLangText('void_strike_desc' + postPendTextName));
                             break;
                         case RUNE_ENHANCE:
                             embodimentText += multiplier > 1.1 ? (" X" + multiplier) : "";
                             this.updateSpellDescriptorText(getLangText('void_enhance_desc' + postPendTextName));
                             break;
                         case RUNE_PROTECT:
                             embodimentText += multiplier > 1.1 ? (" X" + multiplier) : "";
                             this.updateSpellDescriptorText(getLangText('void_protect_desc' + postPendTextName));
                             break;
                         case RUNE_REINFORCE:
                             embodimentText += multiplier > 1.1 ? (" X" + multiplier) : "";
                             this.updateSpellDescriptorText(getLangText('void_reinforce_desc' + postPendTextName));
                             break;
                         case RUNE_UNLOAD:
                             this.updateSpellDescriptorText(getLangText('void_unload_desc' + postPendTextName));
                             break;
                         default:
                             this.clearSpellDescriptorText()
                             break;
                     }
                     break;
                 default:
                     this.spellElementText.setText('');
                     this.clearSpellDescriptorText()
                     break;
             }
         }


         if (this.showRunes) {
             if (this.spellElementText.text === '' && this.spellActionText.text === '') {
                 this.spellNameText.visible = false;
             } else {
                 this.spellNameText.visible = true;
             }
         } else {
             if (this.spellElementText.text === '' || this.spellActionText.text === '') {
                 this.spellNameText.visible = false;
             } else {
                 this.spellNameText.visible = true;
             }
         }

         if (globalObjects.currentEnemy && !globalObjects.currentEnemy.isDestroyed && !globalObjects.currentEnemy.dead) {
             if (!this.spellNameText.visible) {
                 globalObjects.currentEnemy.setPredictScale(0);
             } else if (embodimentText === '' || !closestElement.runeName) {

             } else if (embodimentText === 'STRIKE') {
                 if (closestElement.runeName === RUNE_VOID) {
                     globalObjects.currentEnemy.setPredictScale(37.5);
                 } else {
                     globalObjects.currentEnemy.setPredictScale(23);
                 }
             } else if (embodimentText === 'ULTIMATE') {
                 if (closestElement.runeName === RUNE_MATTER) {
                     globalObjects.currentEnemy.setPredictScale(23);
                 }
             } else {
                 globalObjects.currentEnemy.setPredictScale();
             }
         }

         this.spellActionText.setText(embodimentText)

        if (this.castDisabled || this.manualDisabled) {
             this.spellNameText.visible = false;
             this.spellElementText.setText('')
            this.spellActionText.setText('')
        }
     }

     applyMindBurn(duration = 5, multiplier = 1) {
        if (!globalObjects.currentEnemy || globalObjects.currentEnemy.dead) {
            return;
        }
         let effectName = 'mindBurn';
         let effectObj;
         if (this.mindBurnTween) {
             this.mindBurnTween.stop();
         }
         this.mindBurnAnim.alpha = 0.5;
         let damageDealt = (gameVars.mindPlus ? 3 : 2) * multiplier;
         this.mindBurnAnim.setScale(0.55 + 0.05 * Math.sqrt(duration) + 0.05 * damageDealt);
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
            duration: gameVars.gameManualSlowSpeed * 120,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this.flashBGWhite,
                    alpha: 0,
                    duration: gameVars.gameManualSlowSpeed * 250 + duration * 10,
                    ease: 'Cubic.easeOut'
                });
            }
        });

        messageBus.publish('showCircleShadow', 0.03 + duration * 0.005, -90 + duration * 20);
        if (this.mindBurnAnim.currAnim) {
            this.mindBurnAnim.currAnim.stop();
        }
        this.animateMindBurn(5, damageDealt)
         messageBus.publish('enemyOnFire', 5);

         // effectObj = {
         //     name: effectName,
         //     duration: gameVars.gameManualSlowSpeed * duration,
         //     firstTicked: false,
         //     onUpdate: () => {
         //         if (effectObj) {
         //             if (effectObj.firstTicked) {
         //                 this.mindBurnAnim.setScale(0.55 + 0.05 * Math.sqrt(duration) + 0.05 * effectObj.duration);
         //                 messageBus.publish('enemyTakeTrueDamage', damageDealt, false, 0, true);
         //                 messageBus.publish('addCastAggravate', Math.floor(2 + damageDealt));
         //
         //             } else {
         //                 effectObj.firstTicked = true;
         //             }
         //         }
         //     },
         //     cleanUp: (statuses) => {
         //         this.mindBurnTween = this.scene.tweens.add({
         //             targets: [this.mindBurnAnim],
         //             alpha: 0,
         //             scaleX: 1,
         //             scaleY: 1,
         //             duration: gameVars.gameManualSlowSpeed * 250,
         //             ease: 'Quad.easeOut'
         //         });
         //         statuses[effectName] = null;
         //         messageBus.publish("clearMindBurn");
         //     }
         // };
         // messageBus.publish('enemyTakeEffect', effectObj);
     }

     animateMindBurn(duration, damage) {
         this.mindBurnAnim.setScale(0.75 + 0.052 * damage);
         this.mindBurnAnim.alpha = 0.9;
         messageBus.publish('enemyTakeTrueDamage', damage, false, 0, true);
         let aggAmt = Math.max(0, damage + 1) * 0.85
         messageBus.publish('addCastAggravate', aggAmt, false, 0, true);

         if (duration <= 1) {
             this.mindBurnAnim.currAnim = PhaserScene.tweens.add({
                 targets: [this.mindBurnAnim],
                 alpha: 0,
                 scaleX: 1 + 0.05 * damage,
                 scaleY: 1 + 0.05 * damage,
                 duration: 250,
                 ease: 'Quad.easeOut'
             });
         } else {
             this.mindBurnAnim.currAnim = this.scene.tweens.add({
                 targets: this.mindBurnAnim,
                 alpha: 0.42,
                 duration: 500,
                 scaleX: 0.65 + 0.05 * damage,
                 scaleY: 0.65 + 0.05 * damage,
                 completeDelay: 500,
                 onComplete: () => {
                     this.animateMindBurn(duration - 1, damage)
                 }
             });
         }
     }

     applyVoidBurn(damage = 1, number = 5, isPowerful) {
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
             duration: gameVars.gameManualSlowSpeed * 150,
         });
         if (this.voidSliceImage1.anim) {
             this.currVoidAnim.remove();
            this.voidSliceImage1.anim.stop();
            this.voidSliceImage3.anim.stop();
         }

        this.voidSliceImage1.anim = this.scene.tweens.add({
            delay: 100,
             targets: this.voidSliceImage1,
             scaleX: baseScale * 0.5,
             scaleY: baseScale * 0.95,
             alpha: 0.65,
             ease: 'Quad.easeOut',
             duration: gameVars.gameManualSlowSpeed * 1000,
         });
        this.voidSliceImage3.anim = this.scene.tweens.add({
            delay: 100,
             targets: this.voidSliceImage3,
             scaleX: baseScale * 0.45,
             scaleY: baseScale * 1,
             alpha: 0.7,
             ease: 'Quad.easeOut',
             duration: gameVars.gameManualSlowSpeed * 2000,
         });

         this.currVoidAnim = PhaserScene.time.delayedCall(1100, () => {
             this.fireVoidSpike(this.voidSliceImage1, baseScale, damage);
             this.currVoidAnim = PhaserScene.time.delayedCall(700, () => {
                 this.fireVoidSpike(this.voidSliceImage3, baseScale, damage);
                 if (isPowerful) {
                     let powerfulEffect = getTempPoolObject('tutorial', 'rune_void_large.png', 'specialAttack', 1300);
                     powerfulEffect.setAlpha(0.05).setDepth(999).setScale(5).setPosition(gameConsts.halfWidth, this.voidSliceImage3.y - 42).setRotation(-3);
                     playSound('void_body');
                     this.scene.tweens.add({
                         targets: powerfulEffect,
                         duration: 125,
                         alpha: 1,
                     });
                     this.scene.tweens.add({
                         targets: powerfulEffect,
                         duration: 1250,
                         rotation: 0,
                         ease: 'Quart.easeOut'
                     });
                     this.scene.tweens.add({
                         targets: powerfulEffect,
                         duration: 125,
                         scaleX: 3.2,
                         scaleY: 3.2,
                         ease: "Quint.easeIn",
                         onComplete: () => {
                             zoomTemp(1.02);
                             screenShake(3);
                             messageBus.publish('setSlowMult', 0.25, 15);
                             this.scene.tweens.add({
                                 delay: 200,
                                 targets: powerfulEffect,
                                 duration: 900,
                                 alpha: 0,
                                 ease: "Cubic.easeOut"
                             });
                             this.scene.tweens.add({
                                 delay: 200,
                                 targets: powerfulEffect,
                                 duration: 900,
                                 scaleX: 4,
                                 scaleY: 4,
                                 ease: 'Cubic.easeIn'
                             });
                         }
                     });
                 }
             })
         })

         // let effectName = 'voidBurn';
         // let effectObj;
         // effectObj = {
         //     name: effectName,
         //     duration: gameVars.gameManualSlowSpeed * 2,
         //     isFirst: true,
         //     onUpdate: () => {
         //         if (effectObj.isFirst) {
         //             effectObj.isFirst = false;
         //         } else if (effectObj && effectObj.duration > 0) {
         //             if (effectObj.duration <= 1) {
         //
         //             }
         //         }
         //     },
         //     cleanUp: (statuses) => {
         //         statuses[effectName] = null;
         //     }
         // };
         // messageBus.publish('enemyTakeEffect', effectObj);
     }

     fireVoidSpike(spike, baseScale, damage) {
        if (spike.anim) {
            spike.anim.stop();
        }
        spike.alpha = 1;
        playSound('void_strike', 0.3);
        PhaserScene.time.delayedCall(gameVars.gameManualSlowSpeed * 100, () => {
            messageBus.publish('enemyTakeDamage', damage, true, undefined, 'void');
            messageBus.publish('setPauseDur', 30);

        })
        spike.setScale(baseScale * 4, baseScale * 0.6)
         this.scene.tweens.add({
            delay: 1,
             targets: spike,
             ease: 'Quart.easeOut',
             scaleX: baseScale * 1.9,
             scaleY: baseScale * 0.75,
             duration: gameVars.gameManualSlowSpeed * 100,
             onComplete: () => {
                 this.scene.tweens.add({
                    delay: 100,
                     targets: spike,
                     ease: 'Cubic.easeIn',
                     scaleX: baseScale,
                     scaleY: 0,
                     duration: gameVars.gameManualSlowSpeed * 150,
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
         this.removeDelayedDamage();
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
             duration: gameVars.gameManualSlowSpeed * 250,
         });
     }

    highlightRunes() {
        this.errorBoxElement.setDepth(10000);
        this.errorBoxEmbodiment.setDepth(10000);
        this.elementHighlight.setDepth(10000);
        this.embodimentHighlight.setDepth(10000);
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
        this.elementHighlight.setDepth(104);
        this.embodimentHighlight.setDepth(104);
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

    showCircleShadow(intensity = 0.25, extraDuration = 0, depth = 99999) {
        this.shadowCircle.setDepth(depth)
        this.shadowCircle.alpha = intensity;
        if (this.shadowCircle.currAnim) {
            this.shadowCircle.currAnim.stop();
        }
        this.shadowCircle.currAnim = this.scene.tweens.add({
            targets: this.shadowCircle,
            alpha: 0,
            ease: 'Cubic.easeIn',
            duration: gameVars.gameManualSlowSpeed * 950 + intensity * 1000 + extraDuration,
        });
    }

    setCircleShadow(intensity = 0.2) {
        this.shadowCircle.alpha = intensity;
    }

     refreshHoverText() {
         if (gameOptions.infoBoxAlign === 'center') {
             this.spellDescriptor.setOrigin(0.48, 1);
             this.spellDescriptor.setPosition(gameConsts.halfWidth, isMobile ? gameConsts.height - 366 : gameConsts.height - 358);
             this.spellDescriptor.setAlign('center');
             this.spellDescriptor.setAlpha(0.9);
             this.spellElementText.y = this.spellElementText.startY;
             this.spellNameText.y = this.spellNameText.startY;
             this.spellActionText.y = this.spellActionText.startY;

         } else if (gameOptions.infoBoxAlign === "none") {
             this.spellDescriptor.setPosition(-9999, 0);
             this.spellElementText.y = this.y - 249;
             this.spellNameText.y = this.y - 249;
             this.spellActionText.y = this.y - 249;
         } else if (gameOptions.infoBoxAlign === 'left') {
             this.spellDescriptor.setOrigin(0, 1);
             this.spellDescriptor.setPosition(0, gameConsts.height - 310);
             this.spellDescriptor.setAlign('left');
             this.spellDescriptor.setAlpha(0.98);
             this.spellElementText.y = this.y - 249;
             this.spellNameText.y = this.y - 249;
             this.spellActionText.y = this.y - 249;
         }
     }
}
