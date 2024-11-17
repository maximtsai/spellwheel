class Enemy {
    constructor(scene, x, y, level = 1) {
        this.scene = scene;
        this.level = level;
        gameVars.currLevel = level;
        this.initPreStats();
        this.initStats();
        this.initAttacks();
        let extraOffset = isMobile ? 0 : -8;
        y = y + extraOffset;
        this.resetStats(x, y);
        this.createHealthBar(gameConsts.halfWidth, y);
        this.createChargeBar(gameConsts.halfWidth);
        this.subscriptions = [
            messageBus.subscribe("enemyTakeEffect", this.takeEffect.bind(this)),
            messageBus.subscribe("enemyClearEffect", this.clearEffects.bind(this)),
            messageBus.subscribe("enemyTakeDamage", this.takeDamage.bind(this)),
            messageBus.subscribe("enemyTakeTrueDamage", this.takeTrueDamage.bind(this)),
            messageBus.subscribe("enemyTakeDamagePercent", this.takeDamagePercent.bind(this)),
            messageBus.subscribe("enemyTakeDamagePercentTotal", this.takeDamagePercentTotal.bind(this)),
            messageBus.subscribe("setSlowMult", this.setSlowMult.bind(this)),
            messageBus.subscribe("setPauseDur", this.setPauseDur.bind(this)),

            messageBus.subscribe("disruptOpponentAttack", this.disruptOpponentAttack.bind(this)),
            messageBus.subscribe("disruptOpponentAttackPercent", this.disruptOpponentAttackPercent.bind(this)),
            messageBus.subscribe("statusesTicked", this.updateStatuses.bind(this)),
            messageBus.subscribe("enemyStartDamageCountdown", this.startDamageCountdown.bind(this)),
            messageBus.subscribe("enemyAddShield", this.addShield.bind(this)),
            messageBus.subscribe('spellClicked', this.playerClickedSpell.bind(this)),
            messageBus.subscribe("playerDied", this.playerDied.bind(this)),
            messageBus.subscribe("addCastAggravate", this.addCastAggravate.bind(this)),
        ];


        this.boundUpdateFunc = this.update.bind(this);
        updateManager.addFunction(this.boundUpdateFunc);
    }

    initPreStats() {
        this.delayLoad = false; // delays showing health bar
    }

    getLevel() {
        return this.level;
    }

    removeExtraSprite(sprite) {
        for (let i = 0; i < this.extraSprites.length; i++) {
            if (this.extraSprites[i] == sprite) {
                this.extraSprites.splice(i, 1);
            }
        }
    }

    addExtraSprite(sprite, startOffsetX = null, startOffsetY = null) {
        sprite.startOffsetX = startOffsetX === null ? sprite.x - this.x : startOffsetX;
        sprite.startOffsetY = startOffsetY === null ? sprite.y - this.y : startOffsetY;
        this.extraSprites.push(sprite);
    }

    initStats() {
        this.destructibles = [];
        this.health = 1000;
        this.chargeBarOffsetY = 0;
        this.chargeBarHeightOffset = 0;
        this.angerThreshold = 17;
        this.shield = 0;
        this.shieldOffsetY = 0;
        this.isAsleep = false;
        this.timeSinceLastAttacked = 9999;
        this.castAggravateCharge = 0;
        this.damageNumOffset = 0;
        this.healthBarLengthMax = 101;
        this.extraSprites = [];
        this.statuses = [];
        this.attackCharge = 0;
        this.nextAttackChargeNeeded = 999;
        this.nextAttackMultiples = 1;
        this.delayBetweenAttacks = 50;
        this.attackCooldown = 50;
        this.nextAttackIndex = 0;
        this.currentAttackSetIndex = 0;
        this.pauseMultDuration = 0;
        this.healthTextPopups = [];
        this.isAngry = false;
        this.slowMult = 1;
        this.slowMultDuration = 0;
        this.timeWhenLastDamageTaken = 0;
        this.damageCountdown = 0;
        this.accumulatedTimeDamage = 0;
        this.specialDamageAbsorptionActive = false;
        this.storeDamage = false;
        this.dead = false;
        this.pullbackScale = 0.9;
        this.pullbackScaleDefault = this.pullbackScale;
        this.attackDurMult = 1;
        this.attackScale = 1.1;
        this.attackScaleDefault = this.attackScale;
        this.lastAttackLingerMult = 1;
        this.extraRepeatDelay = 0;
        this.attackSlownessMult = 1;
        this.pullbackHoldRatio = 0.5;
        this.chargeBarAlphaOffset = isMobile ? -0.1 : -0.18;
        this.accumulatedDamageReaction = 0;

        this.initStatsCustom();

        this.prevHealth = this.health;
        this.healthMax = this.health;
    }

    initStatsCustom() {

    }

    createHealthBar(x, y) {
        this.healthBarLengthMax = 65 + Math.floor(Math.sqrt(this.healthMax) * 5);
        this.healthBarMax = this.scene.add.sprite(x, isMobile ? 16 : 14, 'blackPixel');
        this.healthBarMaxGoalScale = this.healthBarLengthMax + 3;
        this.healthBarMax.setScale(0, 11);
        this.healthBarMax.startScaleY = this.healthBarMax.scaleY;
        this.healthBarMax.setOrigin(0.5, 0.5);
        this.healthBarMax.setDepth(10);

        this.healthBarRed = this.scene.add.sprite(x - this.healthBarLengthMax - 3, this.healthBarMax.y, 'pixels', 'red_pixel.png');
        this.healthBarRed.setScale(this.healthBarLengthMax + 3, this.healthBarMax.scaleY);
        this.healthBarRed.setOrigin(0, 0.5);
        this.healthBarRed.alpha = 0;
        this.healthBarRed.setDepth(10);

        this.healthBarFlash = this.scene.add.sprite(x - this.healthBarLengthMax - 3, this.healthBarMax.y, 'pixels', 'white_pixel.png');
        this.healthBarFlash.setScale(this.healthBarLengthMax + 3, this.healthBarMax.scaleY - 2);
        this.healthBarFlash.setOrigin(0, 0.5);
        this.healthBarFlash.alpha = 0;
        this.healthBarFlash.setDepth(10);

        this.healthBarCurr = this.scene.add.sprite(x - this.healthBarLengthMax - 1, this.healthBarMax.y, 'pixels', 'green_pixel.png');
        this.healthBarCurr.setScale(this.healthBarLengthMax + 1, this.healthBarMax.scaleY - 2);
        this.healthBarCurr.setOrigin(0, 0.5);
        this.healthBarCurr.alpha = 0;
        this.healthBarCurr.setDepth(10);

        this.healthBarText = this.scene.add.bitmapText(x, this.healthBarMax.y - 3, 'plainBold', 'zxcv', 20);
        this.healthBarText.setDepth(10);
        this.healthBarText.setOrigin(0.5, 0.5);
        this.healthBarText.alpha = 0;
        this.healthBarText.setText(this.health);

        if (!this.delayLoad) {
            this.loadUpHealthBar();
        }
    }

    loadUpHealthBar() {
        this.delayLoad = false;
        this.scene.tweens.add({
            targets: [this.healthBarMax],
            delay: 200,
            duration: gameVars.gameManualSlowSpeedInverse * 100 + this.healthBarLengthMax * 5,
            scaleX: this.healthBarMaxGoalScale,
            ease: 'Quint.easeInOut'
        });
        this.scene.tweens.add({
            delay: this.healthBarLengthMax * 5 + 150,
            targets: [this.healthBarCurr, this.healthBarText],
            duration: gameVars.gameManualSlowSpeedInverse * 250,
            alpha: 1
        });
    }

    loadUpHealthBarSecond() {
        this.healthBarLengthMax = 45 + Math.floor(Math.sqrt(this.healthMax) * 5.5);
        this.healthBarMaxGoalScale = this.healthBarLengthMax + 3;
        this.scene.tweens.add({
            targets: [this.healthBarMax],
            duration: gameVars.gameManualSlowSpeedInverse * 100 + this.healthBarLengthMax * 5,
            scaleX: this.healthBarMaxGoalScale,
            ease: 'Quint.easeInOut',
        });

        this.scene.tweens.add({
            targets: [this.healthBarCurr],
            duration: gameVars.gameManualSlowSpeedInverse * 100 + this.healthBarLengthMax * 5,
            x: gameConsts.halfWidth - this.healthBarLengthMax - 1,
            scaleX: this.healthBarLengthMax + 1,
            ease: 'Quint.easeInOut',
        });
        let flashLength = this.healthBarLengthMax == 0 ? 0 : this.healthBarLengthMax + 3;
        this.scene.tweens.add({
            targets: [this.healthBarFlash],
            duration: gameVars.gameManualSlowSpeedInverse * 100 + this.healthBarLengthMax * 5,
            x: gameConsts.halfWidth - this.healthBarLengthMax - 3,
            scaleX: flashLength,
            ease: 'Quint.easeInOut',
        });

        this.scene.tweens.add({
            targets: [this.healthBarRed],
            duration: gameVars.gameManualSlowSpeedInverse * 100 + this.healthBarLengthMax * 5,
            x: gameConsts.halfWidth - this.healthBarLengthMax - 3,
            scaleX: this.healthBarLengthMax + 3,
            ease: 'Quint.easeInOut',
        });

        this.scene.tweens.add({
            targets: [this.healthBarCurr, this.healthBarText],
            duration: gameVars.gameManualSlowSpeedInverse * 400,
            alpha: 1
        });
    }

    createChargeBar(x) {
        let chargeBarLength = Math.floor(this.nextAttackChargeNeeded * 0.2);
        this.chargeBarWarningBig = this.scene.add.image(gameConsts.halfWidth, 0, 'enemies', 'warning.png');
        this.chargeBarWarningBig.setOrigin(0.5, 0);
        this.chargeBarWarningBig.setScale(gameConsts.width * 0.1, 0.65);
        this.chargeBarWarningBig.alpha = 0
        this.chargeBarWarningBig.setDepth(1);
        let mobileY = isMobile ? 333 : 315 + this.chargeBarOffsetY;

        this.chargeBarReady1 = this.scene.add.image(x, mobileY, 'enemies', 'ready_glow.png').setAlpha(0).setDepth(9).setBlendMode(Phaser.BlendModes.ADD);
        this.chargeBarReady2 = this.scene.add.image(x, mobileY, 'enemies', 'ready_glow.png').setAlpha(0).setDepth(9).setBlendMode(Phaser.BlendModes.ADD);

        this.chargeBarOutline = this.scene.add.image(x, mobileY, 'whitePixel');
        this.chargeBarOutline.setScale(chargeBarLength + 4, (isMobile ? 14 : 11) + this.chargeBarHeightOffset);
        this.chargeBarOutline.setOrigin(0.5, 0.5);
        this.chargeBarOutline.visible = false;
        this.chargeBarOutline.alpha = 0.4;
        this.chargeBarOutline.setDepth(9);

        this.chargeBarMax = this.scene.add.image(x, mobileY, 'pixels', 'black_blue_pixel.png');
        this.chargeBarMax.setScale(chargeBarLength + 2, (isMobile ? 12 : 10) + this.chargeBarHeightOffset);
        this.chargeBarMax.setOrigin(0.5, 0.5);
        this.chargeBarMax.visible = false;
        this.chargeBarMax.setDepth(9);

        this.voidPause = this.scene.add.image(x, this.chargeBarMax.y, 'pixels', 'purple_pixel.png');
        this.voidPause.alpha = 0;
        this.voidPause.setScale(chargeBarLength + 2, this.chargeBarMax.scaleY - 2);
        this.voidPause.setOrigin(0.5, 0.5);
        this.voidPause.setDepth(9);

        this.chargeBarWarning = this.scene.add.image(x, this.chargeBarMax.y, 'pixels', 'red_pixel.png');
        this.chargeBarWarning.alphaMult = 1;
        this.chargeBarWarning.setScale(chargeBarLength + 2, this.chargeBarMax.scaleY);
        this.chargeBarWarning.setOrigin(0.5, 0.5);
        this.chargeBarWarning.visible = false;
        this.chargeBarWarning.setDepth(9);
        this.chargeBarWarning.setAlpha(0.35);

        this.chargeVertical = this.scene.add.image(x, this.chargeBarMax.y, 'blurry', 'yellow_vertical.webp').setScale(1.5, 1.35).setAlpha(0).setOrigin(0, 0.5);
        this.chargeVertical2 = this.scene.add.image(x, this.chargeBarMax.y, 'blurry', 'yellow_vertical.webp').setScale(-1.5, 1.35).setAlpha(0).setOrigin(0, 0.5);


        this.chargeBarCurr = this.scene.add.image(x, this.chargeBarMax.y, 'pixels', 'yellow_pixel.png');
        this.chargeBarCurr.setScale(0, this.chargeBarMax.scaleY - 2);
        this.chargeBarCurr.setOrigin(0.5, 0.5);
        this.chargeBarCurr.alpha = 0.9;
        this.chargeBarCurr.setDepth(9);

        this.chargeBarAngry = this.scene.add.image(x, this.chargeBarMax.y, 'pixels', 'red_pixel.png');
        this.chargeBarAngry.midAlpha = 0.55;
        this.chargeBarAngry.setScale(0, this.chargeBarMax.scaleY - 2);
        this.chargeBarAngry.setOrigin(0.5, 0.5);
        this.chargeBarAngry.alpha = 0.9;
        this.chargeBarAngry.setDepth(9);
        this.chargeBarAngry.visible = false;

        this.chargeBarFlash1 = this.scene.add.image(x, this.chargeBarMax.y, 'whitePixel').setAlpha(0).setDepth(9);
        this.chargeBarFlash2 = this.scene.add.image(x, this.chargeBarMax.y, 'whitePixel').setAlpha(0).setDepth(9);
        this.chargeBarFlash1.scaleY = this.chargeBarMax.scaleY;
        this.chargeBarFlash2.scaleY = this.chargeBarMax.scaleY;

        this.chargeBarEst1 = this.scene.add.image(x, this.chargeBarMax.y, 'misc', 'estbar.webp');
        this.chargeBarEst1.setScale(0.085, this.chargeBarMax.scaleY - 2);
        this.chargeBarEst1.setOrigin(1, 0.5);
        this.chargeBarEst1.alpha = 0;
        this.chargeBarEst1.setDepth(9);
        this.chargeBarShow = false;
        this.chargeBarEstScale = 8.5;

        this.chargeBarEst2 = this.scene.add.image(x, this.chargeBarMax.y, 'misc', 'estbar.webp');
        this.chargeBarEst2.setScale(-0.085, this.chargeBarMax.scaleY - 2);
        this.chargeBarEst2.setOrigin(1, 0.5);
        this.chargeBarEst2.alpha = 0;
        this.chargeBarEst2.setDepth(9);

        let attackNameYPos = isMobile ? this.chargeBarMax.y - 23 : this.chargeBarMax.y - 22

        this.angryAlert = this.addSprite(x, attackNameYPos - 8, 'misc', 'exclamation_tri.png').setAlpha(0).setDepth(9).setOrigin(0.46, 0.65);
        this.angryAlert2 = this.addSprite(x, attackNameYPos - 8, 'misc', 'exclamation_tri.png').setAlpha(0).setDepth(9).setOrigin(0.54, 0.65);
        this.angrySymbol = this.addSprite(x, attackNameYPos - 8, 'misc', 'angry1.png');
        this.angrySymbol.setDepth(9);
        this.angrySymbol.visible = false;
        this.angrySymbol2 = this.addSprite(x, attackNameYPos - 8, 'misc', 'exclamation1.png');
        this.angrySymbol2.setDepth(9);
        this.angrySymbol2.visible = false;

        this.angrySymbolIsHiding = true;


        this.attackNameHighlight = this.scene.add.image(x, attackNameYPos - 13, 'blurry', 'glow_flat_red.webp').setAlpha(0).setDepth(9);
        this.attackGlow = this.scene.add.image(x, attackNameYPos - 10, 'blurry', 'glow_flat.webp').setAlpha(0).setDepth(9).setVisible(false);
        this.attackDarken = this.scene.add.image(x, this.chargeBarMax.y - 1, 'blurry', 'attack_dark.png').setAlpha(0).setDepth(this.attackGlow.depth - 1).setScale(0, 1).setVisible(false);

        this.attackName = this.scene.add.bitmapText(this.x, attackNameYPos, 'normal', '', isMobile ? 38 : 36, 1);
        this.attackName.setDepth(9);
        this.attackName.setOrigin(0.5, 0.85);
    }

    setDepth(depth) {
        this.sprite.depth = depth - 5;
        this.chargeBarReady1.depth = depth;
        this.chargeBarReady2.depth = depth;
        this.chargeBarOutline.depth = depth;
        this.chargeBarMax.depth = depth;
        this.voidPause.depth = depth;
        this.chargeBarWarning.depth = depth;
        this.chargeVertical.depth = depth;
        this.chargeVertical2.depth = depth;
        this.chargeBarCurr.depth = depth;
        this.chargeBarAngry.depth = depth;
        this.chargeBarFlash1.depth = depth;
        this.chargeBarFlash2.depth = depth;
        this.chargeBarEst1.depth = depth;
        this.chargeBarEst2.depth = depth;
        this.angryAlert.depth = depth;
        this.angryAlert2.depth = depth;
        this.angrySymbol.depth = depth;
        this.angrySymbol2.depth = depth;
        this.attackNameHighlight.depth = depth;
        this.attackGlow.depth = depth;
        this.attackDarken.depth = depth;
        this.attackName.depth = depth;
    }

    resetStats(x, y) {
        this.x = x;
        this.y = y;
        if (this.sprite) {
            this.sprite.x = this.x; this.sprite.y = this.y;
        }
        for (let i = 0; i < this.extraSprites.length; i++) {
            this.extraSprites[i].x = this.x + this.extraSprites[i].startOffsetX;
            this.extraSprites[i].y = this.y + this.extraSprites[i].startOffsetY;
        }
        this.health = this.healthMax;
        this.prevHealth = this.health;
    }

    initSpriteAnim(scale) {
        this.sprite.setScale(scale * 0.98, scale * 0.95);
        if (!this.delayLoad) {
            this.scene.tweens.add({
                targets: this.sprite,
                duration: gameVars.gameManualSlowSpeedInverse * 750,
                ease: 'Quad.easeOut',
                scaleX: scale,
                scaleY: scale,
                alpha: 1
            });
        }
    }

    initSprite(name, scale = 1, xOffset = 0, yOffset = 0, atlas) {
        if (this.isDestroyed) {
            return;
        }
        this.x += xOffset;
        this.y += yOffset;
        let usedAtlas = atlas ? atlas : 'enemies';
        this.atlas = usedAtlas;
        this.sprite = this.scene.add.sprite(this.x, this.y, usedAtlas, name);
        this.sprite.setDepth(1);
        this.sprite.setAlpha(0);
        this.sprite.startX = this.sprite.x;
        this.sprite.startY = this.sprite.y;
        this.defaultSprite = name;

        this.initSpriteAnim(scale);

        this.sprite.startScale = scale;

        this.delayedDamageText = this.scene.add.bitmapText(this.x, this.y, 'block', '', 64);
        this.delayedDamageText.alpha = 0.95;
        this.delayedDamageText.setOrigin(0.5, 0.6);
        this.delayedDamageText.setDepth(2);

        this.shieldSprite = this.scene.add.sprite(this.x, this.y + this.shieldOffsetY, 'shields', 'shield10.png');
        this.shieldSprite.alpha = 0.85;
        this.shieldSprite.setDepth(8).setScale(this.shieldScale || 1);
        this.shieldSprite.visible = false;
        this.shieldSprite.startScale = this.shieldSprite.scaleX;

        let textOffsetY = 68 * this.shieldSprite.startScale + (this.shieldTextOffsetY || 0);
        this.shieldText = this.scene.add.bitmapText(gameConsts.halfWidth, this.y + textOffsetY + this.shieldOffsetY, this.shieldTextFont || 'armor', '', this.shieldTextSize || 48);
        this.shieldText.alpha = 1;
        this.shieldText.setOrigin(0.5, 0.55);
        this.shieldText.setDepth(8);
        this.shieldText.visible = false;
    }

    setSpriteIfNotInactive(name, scale, noAnim, depth = 1) {
        if (!this.dead && !this.isAsleep && !this.isDestroyed) {
            this.setSprite(name, scale, noAnim, depth);
        }
    }

    setSprite(name, scale, noAnim, depth = 1) {
        if (this.isDestroyed) {
            return;
        }
        if (this.forceOverrideSprite && name !== this.forceOverrideSprite) {
            return;
        }
        let newScale = scale ? scale : 1;
        if (!this.sprite) {
            this.sprite = this.scene.add.sprite(this.x, this.y, this.atlas, name);
            this.sprite.setDepth(depth);
        } else {
            newScale = scale ? scale : this.sprite.startScale;
            let oldOriginX = this.sprite.originX;
            let oldOriginY = this.forcedOriginY || this.sprite.originY;
            let oldFrame = this.sprite.frame;
            this.sprite.stop();
            if (oldFrame.name !== name) {
                this.sprite.setFrame(name);
            }
            this.sprite.setOrigin(oldOriginX, oldOriginY);
            this.sprite.setDepth(depth);
        }
        this.sprite.startScale = newScale;
        if (!noAnim) {
            this.sprite.setScale(newScale * 1.02);
            this.scene.tweens.add({
                targets: this.sprite,
                duration: gameVars.gameManualSlowSpeedInverse * 300,
                scaleX: newScale,
                scaleY: newScale,
            });
        }
        return this.sprite;
    }

    setDefaultSprite(name, scale = null, noAnim) {
        if (this.isDestroyed) {
            return;
        }
        if (this.forceOverrideSprite && name !== this.forceOverrideSprite) {
            return;
        }
        this.defaultSprite = name;
        if (!scale) {
            scale = this.sprite ? this.sprite.startScale : 1;
        }
        this.sprite.stop();
        return this.setSprite(name, scale, noAnim);
    }

    update(dt) {
        if (this.dead || this.isDestroyed) {
            return;
        }
        let timeChange = dt * gameVars.timeSlowRatio;

        let almostDone = false;
        let chargeMult = 1;
        if (this.isAsleep) {
            return;
        }
        let completePercent = 0;
        if (this.attackCharge) {
            completePercent = this.attackCharge / (this.nextAttackChargeNeeded + 0.01);
        }
        if (this.attackCooldown <= 0) {
            if (this.pauseMultDuration > 0) {
                this.pauseMultDuration -= timeChange;
                timeChange = 0;
            }
            chargeMult = this.nextAttack.chargeMult ? this.nextAttack.chargeMult : 1;
            if (chargeMult > 1) {
                if (challenges.angryEnemies) {
                    chargeMult = chargeMult * 1.1;
                } else if (cheats.calmEnemies) {
                    chargeMult = chargeMult * 0.5 + 1;
                }
            }
            let almostIshDone = this.attackCharge > this.nextAttackChargeNeeded - 145;
            if (almostIshDone) {
                if (!this.attackName.hasWarned && !this.nextAttack.isPassive && this.attackName.active && !this.dead) {
                    this.attackName.hasWarned = true;
                    let origScale = this.attackName.origScale;
                    if (this.attackName.currAnim) {
                        this.attackName.currAnim.stop();
                    }

                    if (this.attackGlow.currAnim) {
                        this.attackGlow.currAnim.stop();
                    }
                    if (this.attackDarken.currAnim) {
                        this.attackDarken.currAnim.stop();
                    }
                    this.attackGlow.visible = true;
                    this.attackDarken.visible = true;
                    if (this.attackName.width) {
                        this.attackGlow.setScale(this.attackName.width * 0.009, 1.4);
                    }

                    this.attackName.setAlpha(0.95);
                    let isShortName = this.nextAttack.name.length <= 7;
                    this.attackName.currAnim = PhaserScene.tweens.add({
                        targets: this.attackName,
                        ease: 'Cubic.easeIn',
                        duration: gameVars.gameManualSlowSpeedInverse * 500,
                        alpha: 1,
                        yoyo: true,
                        repeat: -1,
                        scaleX: origScale + (isShortName ? 0.25 : 0.09),
                        scaleY: origScale + (isShortName ? 0.35 : 0.2),
                    });
                    this.attackGlow.currAnim = PhaserScene.tweens.add({
                        targets: this.attackGlow,
                        duration: gameVars.gameManualSlowSpeedInverse * 500,
                        alpha: 0.7,
                        ease: 'Quad.easeIn',
                        yoyo: true,
                        repeat: -1,
                        scaleX: this.attackName.width * 0.014,
                        scaleY: 1.55,
                    });
                    this.attackDarken.currAnim = PhaserScene.tweens.add({
                        targets: this.attackDarken,
                        duration: gameVars.gameManualSlowSpeedInverse * 500,
                        alpha: 0.85,
                        ease: 'Quad.easeInOut',
                    });
                }
            }
            this.chargeBarShow = false;
            this.chargeVertical.scaleY = 1.28;
            this.chargeVertical2.scaleY = 1.28;
            if (this.isAngry) {
                let increaseMult = Math.max(8.3, 0.34 * chargeMult);
                if (challenges.angryEnemies) {
                    increaseMult = 1.2;
                } else if (cheats.calmEnemies) {
                    increaseMult = 1 + increaseMult * 0.6;
                }
                let castAggravateBonus = 0;
                if (this.castAggravateCharge > 0) {
                    this.castAggravateCharge -= timeChange;
                    if (this.castAggravateCharge >= 0) {
                        castAggravateBonus = timeChange;
                    } else {
                        castAggravateBonus = timeChange + this.castAggravateCharge;
                    }
                }
                // 1.02 is for players trying to rush things
                this.attackCharge += timeChange * increaseMult * this.slowMult + castAggravateBonus * 1.02;
                this.chargeVertical.alpha = Math.min(1, this.chargeVertical.alpha + timeChange * 0.3 * dt);
                this.chargeVertical2.alpha = this.chargeVertical.alpha;
                this.chargeVertical.scaleY = 1.4;
                this.chargeVertical2.scaleY = 1.4;
            } else {
                this.chargeVertical.alpha = Math.max(0, this.chargeVertical.alpha - timeChange * 0.04 * dt) * (1 - 0.08 * dt);
                this.chargeVertical2.alpha = this.chargeVertical.alpha;

                almostDone = this.attackCharge > this.nextAttackChargeNeeded - 45;

                if (gameVars.playerNotMoved && chargeMult === 1 && !almostDone && this.castAggravateCharge <= 0) {
                    // this.attackCharge += timeChange * 0.02 * this.slowMult;
                    this.chargeBarCurr.alpha = 0.7;
                    this.chargeBarShow = true;
                } else {
                    // Normal slow chargin
                    if (almostDone || chargeMult > 1 || this.castAggravateCharge > 0) {
                        if (!this.isUsingAttack) {
                            this.chargeVertical.alpha = Math.min(0.65, this.chargeVertical.alpha + timeChange * 0.29 * dt);
                            this.chargeVertical2.alpha = this.chargeVertical.alpha;
                        }

                        let castAggravateBonus = 0; // if recently casted a spell, that speeds up opponent charge
                        if (this.castAggravateCharge > 0) {
                            this.castAggravateCharge -= timeChange;
                            if (this.castAggravateCharge >= 0) {
                                castAggravateBonus = timeChange;
                            } else {
                                castAggravateBonus = timeChange + this.castAggravateCharge;
                            }
                        }
                        if (!(chargeMult > 1) && !almostDone) {
                            this.chargeBarCurr.alpha = 0.85;
                        } else {
                            this.chargeBarCurr.alpha = 0.99;
                        }
                        if (chargeMult > 1) {
                            this.attackCharge += timeChange * 0.5 * this.slowMult * chargeMult;
                        } else {
                            this.attackCharge += timeChange * this.slowMult * chargeMult;
                        }
                        this.attackCharge += castAggravateBonus * 3.3;

                    } else {
                        this.chargeBarCurr.alpha = 0.7;
                        this.chargeBarShow = true;
                    }

                }
            }
            this.chargeBarCurr.scaleX = Math.min(this.nextAttackChargeNeeded * 0.2, this.attackCharge * 0.2 + 1);
            this.chargeVertical.x = gameConsts.halfWidth - this.chargeBarCurr.scaleX - 1.5;
            this.chargeVertical2.x = gameConsts.halfWidth + this.chargeBarCurr.scaleX + 1.5;
            if (this.chargeBarShow) {
                this.chargeBarEst1.x = gameConsts.halfWidth - this.chargeBarCurr.scaleX;
                this.chargeBarEst2.x = gameConsts.halfWidth + this.chargeBarCurr.scaleX;
                if (!this.chargeBarEst1.currAnim) {
                    this.chargeBarEst1.alpha = 0;
                    this.chargeBarEst2.alpha = 0;
                    this.chargeBarEst1.currAnim = PhaserScene.tweens.add({
                        delay: 250,
                        targets: [this.chargeBarEst1, this.chargeBarEst2],
                        duration: 1250,
                        alpha: 0.33,
                        yoyo: true,
                        repeat: -1
                    });
                }
            } else {
                if (this.chargeBarEst1.currAnim) {
                    this.chargeBarEst1.currAnim.stop();
                    this.chargeBarEst1.currAnim = null;
                    PhaserScene.tweens.add({
                        targets: [this.chargeBarEst1, this.chargeBarEst2],
                        duration: 470 + this.chargeBarEst1.scaleX * 4,
                        alpha: 0,
                        ease: 'Quad.easeOut',
                    });
                }
            }

            let estScale = this.chargeBarEstScale;
            if (this.chargeBarCurr.scaleX + estScale * 2 + 10.05 > this.chargeBarMax.scaleX) {
                estScale = 99;
            }
            let willBeAlmostDone = this.attackCharge > this.nextAttackChargeNeeded - 50;
            // if () {
            //
            // }

            let trueScale = Math.min(estScale, (this.chargeBarMax.scaleX - this.chargeBarCurr.scaleX) * 0.5 - 1) * 0.01;
            this.chargeBarEst1.scaleX = trueScale;
            this.chargeBarEst2.scaleX = -trueScale;
            // this.setPredictScale();

            let goalAlpha = 1.18 * (this.chargeBarCurr.scaleX) / (this.chargeBarMax.scaleX + 1) + this.chargeBarAlphaOffset;

            let changeSpd = 0.06 * dt;
            this.chargeBarOutline.alpha = goalAlpha * changeSpd + this.chargeBarOutline.alpha * (1-changeSpd);
            if (this.attackDarken) {
                this.attackDarken.scaleX = this.chargeBarMax.scaleX * 0.009 + 0.1;
            }
            this.chargeBarAngry.scaleX = this.chargeBarCurr.scaleX;
            if (this.attackPaused) {
                // doNothing
                this.chargeVertical.alpha = Math.max(0, this.chargeVertical.alpha - timeChange * 0.35 * dt);
                this.chargeVertical2.alpha = this.chargeVertical.alpha;
            } else if (this.isUsingAttack) {
                this.chargeVertical.alpha = Math.max(0, this.chargeVertical.alpha - timeChange * 0.35 * dt);
                this.chargeVertical2.alpha = this.chargeVertical.alpha;
            } else if (this.attackCharge >= this.nextAttackChargeNeeded) {
                if (this.nextAttack.damage !== undefined && this.nextAttack.damage !== 0) {

                    this.chargeBarReady1.setAlpha(1).setScale(0.9, 0.5);
                    this.chargeBarReady2.setAlpha(1).setScale(0.9, 0.5);
                    this.chargeBarReady1.x = this.chargeBarMax.x - this.chargeBarMax.scaleX;
                    this.chargeBarReady2.x = this.chargeBarMax.x + this.chargeBarMax.scaleX;
                    this.chargeBarReadyAnim = this.scene.tweens.add({
                        targets: [this.chargeBarReady1, this.chargeBarReady2],
                        scaleX: 1.25,
                        scaleY: 0.95,
                        ease: 'Cubic.easeIn',
                        duration: gameVars.gameManualSlowSpeedInverse * 100,
                        onComplete: () => {
                            this.chargeBarReadyAnim = this.scene.tweens.add({
                                targets: [this.chargeBarReady1, this.chargeBarReady2],
                                scaleX: 0.9,
                                scaleY: 0.8,
                                alpha: 0.95,
                                ease: 'Cubic.easeOut',
                                duration: gameVars.gameManualSlowSpeedInverse * 400,
                                onComplete: () => {
                                    this.chargeBarReadyAnim = this.scene.tweens.add({
                                        targets: [this.chargeBarReady1, this.chargeBarReady2],
                                        alpha: 0,
                                        scaleX: 0.75,
                                        scaleY: 0.75,
                                        duration: gameVars.gameManualSlowSpeedInverse * 600,
                                        ease: 'Quad.easeIn'
                                    });
                                    this.scene.tweens.add({
                                        targets: [this.chargeBarOutline],
                                        alpha: 0,
                                        duration: gameVars.gameManualSlowSpeedInverse * 800,
                                        ease: 'Cubic.easeIn'
                                    });
                                }
                            });
                        }
                    });

                    if (this.nextAttack.isBigMove) {
                        this.chargeBarFlash1.setAlpha(1).setScale(0, this.chargeBarMax.scaleY);
                        this.chargeBarFlash1.x = this.chargeBarMax.x;
                        this.chargeBarFlash2.setAlpha(1).setScale(0, this.chargeBarMax.scaleY);
                        this.chargeBarFlash2.x = this.chargeBarMax.x;
                        let goalPos1X = this.chargeBarMax.x - this.chargeBarMax.scaleX;
                        let goalPos2X = this.chargeBarMax.x + this.chargeBarMax.scaleX;
                        let totalDur = 150 + Math.floor(this.chargeBarMax.scaleX);
                        this.scene.tweens.add({
                            targets: this.chargeBarFlash1,
                            x: this.chargeBarMax.x - this.chargeBarMax.scaleX * 0.5,
                            scaleX: this.chargeBarMax.scaleX * 0.5,
                            ease: 'Quart.easeOut',
                            duration: totalDur - 20,
                            completeDelay: 150,
                            onComplete: () => {
                                this.chargeBarFlash1.scaleY = this.chargeBarMax.scaleY + 6;
                                this.chargeBarFlash2.scaleY = this.chargeBarFlash1.scaleY;
                                this.scene.tweens.add({
                                    delay: 20,
                                    targets: [this.chargeBarFlash1, this.chargeBarFlash2],
                                    scaleY: this.chargeBarMax.scaleY,
                                    ease: 'Cubic.easeOut',
                                    duration: 150,
                                })
                                this.scene.tweens.add({
                                    targets: this.chargeBarFlash1,
                                    x: goalPos1X,
                                    scaleX: 0,
                                    ease: 'Quart.easeOut',
                                    duration: totalDur,
                                    onComplete: () => {
                                        this.chargeBarFlash1.setAlpha(0);
                                    }
                                })
                            }
                        });
                        this.scene.tweens.add({
                            targets: this.chargeBarFlash2,
                            x: this.chargeBarMax.x + this.chargeBarMax.scaleX * 0.5,
                            scaleX: this.chargeBarMax.scaleX * 0.5,
                            ease: 'Quart.easeOut',
                            duration: totalDur - 20,
                            completeDelay: 130,
                            onComplete: () => {
                                this.scene.tweens.add({
                                    targets: this.chargeBarFlash2,
                                    x: goalPos2X,
                                    scaleX: 0,
                                    ease: 'Quart.easeOut',
                                    duration: totalDur,
                                    onComplete: () => {
                                        this.chargeBarFlash2.setAlpha(0);
                                    }
                                })
                            }
                        });
                    } else {
                        this.chargeBarFlash1.setAlpha(1).setScale(0, this.chargeBarMax.scaleY);
                        this.chargeBarFlash1.x = this.chargeBarMax.x - this.chargeBarMax.scaleX;
                        let goalPosX = this.chargeBarMax.x + this.chargeBarMax.scaleX;
                        let totalDur = 100 + Math.floor(this.chargeBarMax.scaleX);

                        this.scene.tweens.add({
                            targets: this.chargeBarFlash1,
                            x: this.chargeBarMax.x,
                            scaleX: this.chargeBarMax.scaleX,
                            ease: 'Cubic.easeOut',
                            duration: totalDur,
                            completeDelay: 120,
                            onComplete: () => {
                                this.scene.tweens.add({
                                    targets: this.chargeBarFlash1,
                                    x: goalPosX,
                                    scaleX: 0,
                                    ease: 'Cubic.easeOut',
                                    duration: totalDur,
                                    onComplete: () => {
                                        this.chargeBarFlash1.setAlpha(0);
                                    }
                                })
                            }
                        })
                    }
                }

                this.chargeBarWarning.visible = true;
                this.chargeBarWarning.alpha = 0.34;
                this.chargeBarWarningBig.alpha = Math.min(0.5, this.chargeBarWarningBig.alpha + timeChange * 0.05);
                this.addTween({
                    targets: [this.chargeVertical, this.chargeVertical2],
                    alpha: 0,
                    duration: 500,
                    ease: 'Cubic.easeOut'
                })
                this.useMove();
            } else if (this.attackCharge >= this.nextAttackChargeNeeded * 0.9 - 30) {
                this.chargeBarWarning.visible = true;
                this.chargeBarWarning.alpha += (this.slowMult * (timeChange + 0.5)) * 0.03 * this.chargeBarWarning.alphaMult;
                this.chargeBarWarningBig.alpha = this.chargeBarWarning.alpha * 0.5 - 0.1;
                if (this.chargeBarWarning.alpha > 0.89) {
                    this.chargeBarWarning.alphaMult = -1;
                } else if (this.chargeBarWarning.alpha < 0.05) {
                    this.chargeBarWarning.alphaMult = 1;
                }
            } else if (this.attackCharge >= this.nextAttackChargeNeeded * 0.8 - 75) {
                this.chargeBarWarning.visible = true;
                this.chargeBarWarning.alpha += (this.slowMult * (timeChange + 0.5)) * 0.01 * this.chargeBarWarning.alphaMult;
                this.chargeBarWarningBig.alpha = this.chargeBarWarning.alpha * 0.4 - 0.12;
                if (this.chargeBarWarning.alpha > 0.53) {
                    this.chargeBarWarning.alphaMult = -1;
                } else if (this.chargeBarWarning.alpha < 0.04) {
                    this.chargeBarWarning.alphaMult = 1;
                }
            } else {
                this.chargeBarWarning.visible = false;
                this.chargeBarWarningBig.alpha *= 1 - 0.08 * timeChange;
            }
        } else if (!this.isUsingAttack) {
            let angerRatio = this.isAngry ? 1.5 : 1;
            this.attackCooldown -= timeChange * angerRatio;
            if (this.attackCooldown <= 0) {
                this.attackCooldown = 0;
                this.readyNextAttack();
            }
        }
        if (this.pauseMultDuration <= 0.001) {
            this.timeSinceLastAttacked += timeChange;
        }

        // this.timeSinceLastAttacked += timeChange;
        if (this.isAsleep) {
            this.chargeBarAngry.visible = false;
            this.chargeBarCurr.visible = false;
            this.chargeVertical.alpha = 0;
            this.chargeVertical2.alpha = 0;
        } else if (this.timeSinceLastAttacked < this.angerThreshold) {
            if (!this.isAngry) {
                this.isAngry = true;
                if (!this.isAsleep) {
                    this.chargeBarAngry.alpha = 1;
                    this.chargeBarAngry.visible = true;
                    this.showAngrySymbol(this.customAngry || 'angry');
                }
                this.chargeBarCurr.visible = false;
                this.chargeVertical.alpha = 0;
                this.chargeVertical2.alpha = 0;
            }
        } else if (chargeMult > 1) {
            this.isAngry = false;
            this.chargeBarAngry.visible = true;
            this.chargeBarCurr.visible = true;
            this.chargeBarAngry.alpha = this.chargeBarAngry.midAlpha;
            if (chargeMult > 1.001) {
                this.showAngrySymbol('exclamation');
            }
        } else {
            if (almostDone) {
                this.chargeBarAngry.visible = true;
                this.chargeBarAngry.alpha = 1;
            } else {
                this.chargeBarAngry.visible = true;
                this.chargeBarAngry.alpha = (completePercent - 0.15) * 0.8;
            }
            this.isAngry = false;
            this.chargeBarCurr.visible = true;
            this.hideAngrySymbol()
        }


        if (this.slowMultDuration > 0) {
            // slow multiplier expired
            this.slowMultDuration -= timeChange;
            this.chargeBarAngry.alpha = this.chargeBarAngry.midAlpha + 0.05;
            this.chargeBarCurr.alpha = 0.7;
            if (this.slowMultDuration <= 0) {
                this.slowMult = 1;
                this.chargeBarAngry.alpha = this.chargeBarAngry.midAlpha * 1.63;
                this.chargeBarCurr.alpha = 0.9;
            }
        }
    }

    setDefense(amt) {
        this.defense = amt;
    }

    playShieldHitAnim() {
        this.shieldSprite.alpha = 1;
        this.shieldSprite.play(this.shieldSprite.damageAnim ? this.shieldSprite.damageAnim : 'shieldHit')
        this.shieldSprite.setScale(this.shieldSprite.startScale * 1.1);
        this.shieldText.setDepth(99);
        this.scene.tweens.add({
            targets: this.shieldSprite,
            scaleX: this.shieldSprite.startScale,
            scaleY: this.shieldSprite.startScale,
            duration: gameVars.gameManualSlowSpeedInverse * 150,
            alpha: 0.85,
        });
    }

    adjustDamageTaken(amt, isAttack, isTrue = false) {
        let mindReinforceStatus = globalObjects.player.getStatuses()['mindReinforce'];
        if (mindReinforceStatus) {
            amt += mindReinforceStatus.displayAmt;
        }
        if (this.defense && !isTrue) {
            amt = Math.max(0, amt - this.defense);
        }
        if (isAttack && this.statuses['mindStrike']) {
            // let xPos = this.statuses['mindStrike'].x; let yPos = this.statuses['mindStrike'].y;
            let damageToTake = Math.max(0, Math.ceil(amt));
            this.statuses['mindStrike'].cleanUp(this.statuses, damageToTake, true);
            let damageSqrt = Math.sqrt(damageToTake);
            setTimeout(() => {
                messageBus.publish('animateTrueDamageNum', gameConsts.halfWidth - 45, 218 - damageSqrt * 2.2, 'X2', 0.5 + damageSqrt * 0.1);
            }, Math.floor(damageSqrt) * 15)

            amt += damageToTake;
            // setTimeout(() => {
            //     this.takeTrueDamage(damageToTake, false, 0, false);
            // }, 0);
        }

        if (this.shield > 0 && !isTrue) {
            if (amt < this.shield) {
                let randX = (Math.random() - 0.5) * 60;
                let randY = (Math.random() - 0.5) * 50;
                messageBus.publish('animateBlockNum', this.shieldText.x + 1 + randX, this.shieldText.y - 30 + randY, -amt, 0.65 + Math.sqrt(amt) * 0.09);
                this.shield -= amt;
                amt = 0;
                this.playShieldHitAnim();
                this.shieldText.setText(this.shield).setAlpha(1);
                let startLeft = Math.random() < 0.5;
                this.scene.tweens.add({
                    targets: this.shieldText,
                    scaleX: this.shieldText.startScale + 1.25,
                    scaleY: this.shieldText.startScale + 1.25,
                    y: "-=3",
                    x: startLeft ? "-=6" : "+=6",
                    duration: gameVars.gameManualSlowSpeedInverse * 60,
                    ease: 'Quint.easeOut',
                    onComplete: () => {
                        this.scene.tweens.add({
                            targets: this.shieldText,
                            scaleX: this.shieldText.startScale,
                            scaleY: this.shieldText.startScale,
                            y: "+=3",
                            duration: gameVars.gameManualSlowSpeedInverse * 500,
                            ease: 'Quart.easeOut',
                        });
                        this.scene.tweens.add({
                            targets: this.shieldText,
                            x: startLeft ? "+=13" : "-=13",
                            duration: gameVars.gameManualSlowSpeedInverse * 100,
                            ease: 'Quint.easeInOut',
                            onComplete: () => {
                                this.shieldText.setDepth(8);
                                this.scene.tweens.add({
                                    targets: this.shieldText,
                                    x: this.shieldText.startX,
                                    duration: gameVars.gameManualSlowSpeedInverse * 400,
                                    ease: 'Bounce.easeOut',
                                });
                                this.scene.tweens.add({
                                    delay: 1500,
                                    targets: this.shieldText,
                                    alpha: 0.75,
                                    duration: 1500,
                                });
                            }
                        });
                    }
                });
            } else {
                messageBus.publish('animateBlockNum', this.shieldText.x + 1, this.shieldText.y - 15, -amt, 0.65 + Math.sqrt(amt) * 0.09);
                amt -= this.shield;
                this.clearShield();
            }
        }

        return amt;
    }

    useMove() {
        if (this.isDestroyed) {
            return;
        }
        if (this.health <= 0) {
            return;
        }
        this.attackCharge = 0;
        this.attackCooldown = this.delayBetweenAttacks;
        this.chargeBarCurr.alpha = 1;
        this.chargeBarAngry.alpha = 1;

        this.timeSinceLastAttacked += 15;
        this.castAggravateCharge = 0;
        if (this.nextAttack.damage !== 0) {
            this.launchAttack(this.nextAttack.attackTimes, this.nextAttack.prepareSprite, this.nextAttack.preAttackSprite, this.nextAttack.attackSprites, undefined, this.nextAttack.finishDelay, this.nextAttack.transitionFast);
        } else {
            if (this.nextAttack.message) {
                messageBus.publish(this.nextAttack.message, this.nextAttack.messageDetail);
            }
            if (this.nextAttack.attackFinishFunction) {
                this.nextAttack.attackFinishFunction();
            }
            if (this.nextAttack.finaleFunction) {
                this.nextAttack.finaleFunction();
            }
        }
        if (this.nextAttack.block) {
            messageBus.publish("enemyAddShield", this.nextAttack.block);
        }

    }

    repositionAngrySymbol() {
        let offsetConst = (this.nextAttack && this.nextAttack.isBigMove) ? 22 : 18
        this.angrySymbol.x = this.attackName.x + this.attackName.width * 0.496 + offsetConst;
        this.angrySymbol2.x = this.attackName.x - this.attackName.width * 0.496 - offsetConst;
        this.angryAlert.x = this.angrySymbol.x - 1;
        this.angryAlert2.x = this.angrySymbol2.x + 1;
    }

    readyNextAttack() {
        if (this.isDestroyed) {
            return;
        }
        if (this.nextAttackIndex >= this.attacks[this.currentAttackSetIndex].length) {
            this.nextAttackIndex = 0;
        }
        this.nextAttack = this.attacks[this.currentAttackSetIndex][this.nextAttackIndex];
        if (!this.nextAttack) {
            this.nextAttackIndex = 0;
            this.nextAttack = this.attacks[this.currentAttackSetIndex][this.nextAttackIndex];
        }
        this.nextAttackChargeNeeded = this.nextAttack.chargeAmt || 250;
        this.nextAttackMultiples = this.nextAttack.attackMultiplier || 1;
        let atkName = this.nextAttack.name;
        if (this.nextAttack.startFunction) {
            this.nextAttack.startFunction();
        }
        let finalScale = 1;
        let isLongName = atkName.length > 7;
        if (isLongName) {
            finalScale = 0.8;
        } else {
            finalScale = 0.98;
        }
        this.attackName.setText(atkName).setAlpha(0.2).setScale(finalScale);
        this.repositionAngrySymbol();

        this.attackName.setScale(finalScale * 0.9);
        this.attackName.hasWarned = false;

        if (!this.nextAttack.isPassive) {
            let widthToScale = this.attackName.width / 200;
            this.attackNameHighlight.setScale(widthToScale, 2.25).setAlpha(0.24);
            PhaserScene.tweens.add({
                targets: this.attackNameHighlight,
                duration: gameVars.gameManualSlowSpeedInverse * 300,
                ease: 'Quad.easeOut',
                alpha: this.nextAttack.isBigMove ? 1.1 : 0.9,
                onComplete: () => {
                    PhaserScene.tweens.add({
                        targets: this.attackNameHighlight,
                        ease: 'Quad.easeOut',
                        duration: gameVars.gameManualSlowSpeedInverse * this.nextAttack.isBigMove ? 1250 : 850,
                        alpha: 0,
                    });
                }
            });
            PhaserScene.tweens.add({
                targets: this.attackNameHighlight,
                duration: gameVars.gameManualSlowSpeedInverse * this.nextAttack.isBigMove ? 1500 : 1100,
                ease: 'Cubic.easeOut',
                scaleX: widthToScale + (this.nextAttack.isBigMove ? 1.8 : 1.5),
            });
            PhaserScene.tweens.add({
                delay: 300,
                targets: this.attackNameHighlight,
                ease: this.nextAttack.isBigMove ? 'Quad.easeIn' : 'Quad.easeOut',
                duration: gameVars.gameManualSlowSpeedInverse * this.nextAttack.isBigMove ? 1300 : 900,
                scaleY: 0,
            });
        }
        PhaserScene.tweens.add({
            targets: this.attackName,
            duration: gameVars.gameManualSlowSpeedInverse * 500,
            alpha: 1,
        });

        if (this.attackName.currAnim) {
            this.attackName.currAnim.stop();
        }
        if (this.attackGlow.currAnim) {
            this.attackGlow.currAnim.stop();
            this.attackGlow.currAnim = PhaserScene.tweens.add({
                targets: this.attackGlow,
                duration: gameVars.gameManualSlowSpeedInverse * 200,
                alpha: 0,
            });
        }
        if (this.attackDarken.currAnim) {
            this.attackDarken.currAnim.stop();
            this.attackDarken.isAnimating = true;
            PhaserScene.tweens.add({
                targets: this.attackDarken,
                duration: gameVars.gameManualSlowSpeedInverse * 200,
                alpha: 0,
                onComplete: () => {
                    this.attackDarken.isAnimating = false;
                }
            });
        }

        this.attackName.origScale = finalScale;
        PhaserScene.tweens.add({
            targets: this.attackName,
            ease: 'Cubic.easeOut',
            duration: gameVars.gameManualSlowSpeedInverse * 400,
            scaleX: isLongName && !this.nextAttack.isBigMove ? finalScale + 0.02 : finalScale * 1.6,
            scaleY: isLongName && !this.nextAttack.isBigMove ? finalScale * 1.25 : finalScale * 1.6,
            onComplete: () => {
                PhaserScene.tweens.add({
                    targets: this.attackName,
                    ease: 'Cubic.easeIn',
                    duration: gameVars.gameManualSlowSpeedInverse * 500,
                    scaleX: finalScale,
                    scaleY: finalScale,
                    onComplete: () => {
                        if (this.nextAttack.isBigMove && this.attackName.active) {
                            this.attackName.currAnim = PhaserScene.tweens.add({
                                targets: this.attackName,
                                ease: 'Cubic.easeIn',
                                duration: gameVars.gameManualSlowSpeedInverse * 750,
                                yoyo: true,
                                repeat: -1,
                                scaleX: this.attackName.origScale + 0.065,
                                scaleY: this.attackName.origScale + 0.14,
                            });
                            this.attackGlow.setAlpha(0);
                            if (this.attackName.width) {
                                this.attackGlow.setScale(this.attackName.width * 0.009, 1.4);
                            }
                            this.attackGlow.visible = true;

                            this.attackGlow.currAnim = PhaserScene.tweens.add({
                                targets: this.attackGlow,
                                duration: gameVars.gameManualSlowSpeedInverse * 750,
                                ease: 'Quad.easeIn',
                                yoyo: true,
                                alpha: 0.95,
                                repeat: -1,
                                scaleX: this.attackName.width * 0.014,
                                scaleY: 1.5,
                            });
                        }
                    }
                });
            }
        });

        this.prepareChargeBar(true, this.nextAttack.isBigMove, this.nextAttack.customCall);
        this.nextAttackIndex++;
    }

    setPauseDur(duration = 50) {
        this.pauseMultDuration = duration;
    }

    setSlowMult(amt = 0, duration = 90) {
        this.slowMult = amt;
        this.slowMultDuration = duration;

    }

    disruptOpponentAttackPercent(amt = 0.5) {
        let disruptAmt = this.attackCharge * amt;
        this.disruptOpponentAttack(disruptAmt);
    }

    disruptOpponentAttack(amt = 1) {
        this.attackCharge -= amt; // Math.max(0, this.attackCharge - amt);
        if (this.chargeBarMax.visible && this.chargeBarMax.alpha > 0) {
            this.voidPause.alpha = 1;
            this.voidPause.setScale(this.chargeBarMax.scaleX, this.chargeBarMax.scaleY);
            this.scene.tweens.add({
                targets: this.voidPause,
                duration: gameVars.gameManualSlowSpeedInverse * 200,
                alpha: 0,
                scaleY: 0,
            });
            this.scene.tweens.add({
                targets: this.voidPause,
                duration: gameVars.gameManualSlowSpeedInverse * 200,
                scaleX: this.healthBarMax.scaleX + 40,
                ease: 'Quad.easeOut',
            });
        }
        // if (this.attackCharge < 0) {
        //     this.nextAttackChargeNeeded -= 0.33 * this.attackCharge;
        //     this.attackCharge = 0;
        //     this.prepareChargeBar(false);
        // }

    }

    prepareChargeBar(animate = true, isBigMove, customCall) {
        if (this.chargeBarReadyAnim) {
            this.chargeBarReadyAnim.stop();
            this.scene.tweens.add({
                targets: [this.chargeBarReady1, this.chargeBarReady2],
                alpha: 0,
                scaleX: 0.4,
                scaleY: 0.4,
                duration: gameVars.gameManualSlowSpeedInverse * 250,
            });
        }
        this.chargeBarMax.visible = true;
        this.chargeBarOutline.visible = true;
        let chargeBarLength = Math.floor(this.nextAttackChargeNeeded * 0.2);
        this.chargeBarMax.scaleX = chargeBarLength * 0.6 + 2;
        this.chargeBarOutline.scaleX = this.chargeBarMax.scaleX + 3 + (isMobile ? 1 : 0);
        this.chargeBarOutline.alpha = 3;
        this.chargeBarOutline.isAnimating = true;

        this.chargeBarWarning.visible = false;
        this.chargeBarWarning.scaleX = chargeBarLength + 2;
        this.chargeBarCurr.scaleX = 0;
        this.chargeBarCurr.alpha = 0.9;
        this.chargeBarAngry.scaleX = 0;
        this.chargeBarAngry.alpha = 0.9;

        this.attackDarken.isAnimating = true;
        this.attackDarken.alpha *= 0.6;
        this.scene.tweens.add({
            targets: this.attackDarken,
            alpha: 0,
            duration: 500,
            onComplete: () => {
                this.attackDarken.isAnimating = false;
            }
        });
        let extraTimeMult = 2 - gameVars.timeSlowRatio;
        if (animate) {
            if (customCall) {
                if (customCall !== "" && customCall !== " ") {
                    playSound(customCall, 0.7);
                }
            } else {
                if (isBigMove) {
                    playSound('enemy_attack_major', 0.65);
                } else {
                    if (this.enemyAttackSfxFlip) {
                        playSound('enemy_attack_2', 0.58);
                    } else {
                        playSound('enemy_attack', 0.67);
                    }
                    this.enemyAttackSfxFlip = !this.enemyAttackSfxFlip;
                }
            }

            this.scene.tweens.add({
                targets: this.chargeBarMax,
                scaleX: chargeBarLength + 2,
                duration: gameVars.gameManualSlowSpeedInverse * chargeBarLength * 7 * extraTimeMult,
                ease: 'Quart.easeOut'
            });
            this.scene.tweens.add({
                targets: this.chargeBarOutline,
                scaleX: chargeBarLength + 4 + (isMobile ? 1 : 0),
                duration: gameVars.gameManualSlowSpeedInverse * chargeBarLength * 7 * extraTimeMult,
                alpha: 1,
                ease: 'Quart.easeOut',
                onComplete: () => {
                    this.chargeBarOutline.isAnimating = false;
                }
            });
        } else {
            this.scene.tweens.add({
                targets: this.chargeBarMax,
                scaleX: chargeBarLength + 2,
                duration: gameVars.gameManualSlowSpeedInverse * 50,
                ease: 'Quart.easeOut'
            });
            this.scene.tweens.add({
                targets: this.chargeBarOutline,
                scaleX: chargeBarLength + 4 + (isMobile ? 1 : 0),
                duration: gameVars.gameManualSlowSpeedInverse * 50,
                alpha: 1,
                ease: 'Quart.easeOut',
                onComplete: () => {
                    this.chargeBarOutline.isAnimating = false;
                }
            });
        }
    }

    takeEffect(newEffect) {
        this.statuses[newEffect.name] = newEffect;
    }

    hasEffect(name) {
        return !!this.statuses[name];
    }

    clearEffects() {
        for (let i in this.statuses) {
            let effect = this.statuses[i];
            if (effect) {
                effect.cleanUp(this.statuses);
            }
        }
        this.statuses = [];
        this.clearShield();
    }

    startDamageCountdown() {
        // this.clockLarge.alpha = 0.75;
        // this.clockLargeHand.alpha = 0.85;
        //this.clockLargeHand.rotation = -0.1;
        //this.delayedDamageText.alpha = 0.95;
        //this.damageCountdown = 0;
        //this.storeDamage = true;
    }

    addShield(amt) {
        if (this.isDestroyed) {
            return;
        }
        this.shield = amt;
        this.shieldSprite.visible = true;
        this.shieldSprite.play(this.shieldSprite.flashAnim ? this.shieldSprite.flashAnim : 'shieldFlash')
        this.shieldSprite.alpha = 0.2;
        this.shieldSprite.setScale(this.shieldSprite.startScale * 1.1);
        this.scene.tweens.add({
            targets: this.shieldSprite,
            scaleX: this.shieldSprite.startScale,
            scaleY: this.shieldSprite.startScale,
            alpha: 1,
            ease: "Cubic.easeIn",
            duration: gameVars.gameManualSlowSpeedInverse * 150,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this.shieldSprite,
                    alpha: 0.85,
                    duration: gameVars.gameManualSlowSpeedInverse * 250,
                });
            }
        });
        this.shieldText.visible = true;
        this.shieldText.setScale(0.1);
        this.shieldText.setText(this.shield);
        this.shieldText.startX = this.shieldText.x;
        this.shieldText.startScale = 0.8 + Math.sqrt(amt) * 0.005;
        this.scene.tweens.add({
            targets: this.shieldText,
            scaleX: this.shieldText.startScale,
            scaleY: this.shieldText.startScale,
            ease: 'Back.easeOut',
            duration: gameVars.gameManualSlowSpeedInverse * 250,
        });
        this.scene.tweens.add({
            delay: 1000,
            targets: this.shieldText,
            alpha: 0.75,
            duration: 1500,
        });
    }



    clearShield() {
        this.shield = 0;
        this.shieldSprite.alpha = 1;
        this.scene.tweens.add({
            targets: this.shieldSprite,
            scaleX: this.shieldSprite.startScale * 1.25,
            scaleY: this.shieldSprite.startScale * 1.25,
            duration: gameVars.gameManualSlowSpeedInverse * 250,
            alpha: 0,
            onComplete: () => {
                this.shieldSprite.visible = false;
            }
        });

        if (this.shieldText) {
            this.shieldText.setText(0);
            this.scene.tweens.add({
                targets: this.shieldText,
                scaleX: 0,
                scaleY: 0,
                ease: 'Quad.easeOut',
                duration: gameVars.gameManualSlowSpeedInverse * 250,
                onComplete: () => {
                    this.shieldText.visible = false;
                }
            });
        }
    }

    handleSpecialDamageAbsorption(amt) {
        return amt;
    }

    reactToDamageTypes(amt, isAttack, type) {
        if (!type) {
            return;
        }
        this.accumulatedDamageReaction += amt;
        if (this.reactTimeout) {
            clearTimeout(this.reactTimeout);
        }
        this.reactTimeout = setTimeout(() => {
            this.accumulatedDamageReaction = 0;
            this.reactTimeout = null;
        }, 1700)
    }

    takeDamage(amt, isAttack = true, yOffset = 0, type) {
        if (globalObjects.player.isDead()) {
            return;
        }
        if (this.delayLoad) {
            return;
        }
        if (isAttack && cheats.extraDmg) {
            amt *= 2;
        }
        if (isAttack && cheats.extraExtraDmg) {
            amt *= 2;
        }
        let origHealth = this.health;

        let damageTaken = this.adjustDamageTaken(amt, isAttack);
        if (this.specialDamageAbsorptionActive) {
            damageTaken = this.handleSpecialDamageAbsorption(damageTaken);
        }

        this.setHealth(Math.max(0, this.health - damageTaken));
        let healthLoss = origHealth - this.health;
        this.reactToDamageTypes(healthLoss, isAttack, type);
        if (healthLoss > 0) {
            if (healthLoss > 20) {
                this.animateShake(1.5);
                messageBus.publish('tempPause', 50, 0.15);
            } else {
                this.animateShake(1.1);
                if (healthLoss >= 6) {
                    messageBus.publish('tempPause', 30, 0.2);
                }
            }

            this.animateDamageNum(healthLoss, undefined, this.damageNumOffset + yOffset);
        }
        if (isAttack) {
            this.timeSinceLastAttacked = Math.min(this.timeSinceLastAttacked, 0);
        }

        if (this.health <= 0) {
            this.die();
        }
    }

    flashHealthChange(newScale, mult = 1) {
        if (this.isDestroyed) {
            return;
        }
        let scaleChange = this.healthBarCurr.scaleX - newScale;
        // let tallAmt = Math.max(0, Math.min(2, 0.05 * scaleChange - 10));

        this.healthBarRed.alpha = 0.4 + 0.4 * mult;

        if (mult > 1.05) {
            this.healthBarMax.scaleY = this.healthBarMax.startScaleY + 3;
            this.healthBarRed.scaleY = this.healthBarMax.scaleY;
            this.healthBarCurr.scaleY = this.healthBarMax.scaleY - 1.5;
            PhaserScene.tweens.add({
                targets: [this.healthBarMax, this.healthBarRed],
                scaleY: this.healthBarMax.startScaleY,
                ease: "Quad.easeIn",
                duration: gameVars.gameManualSlowSpeedInverse * 700
            });
            PhaserScene.tweens.add({
                targets: this.healthBarCurr,
                scaleY: this.healthBarMax.startScaleY - 2,
                ease: "Quad.easeIn",
                duration: gameVars.gameManualSlowSpeedInverse * 700
            });
            this.healthBarText.setScale(1.4);
            PhaserScene.tweens.add({
                targets: this.healthBarText,
                scaleX: 1,
                scaleY: 1,
                ease: 'Cubic.easeOut',
                duration: gameVars.gameManualSlowSpeedInverse * 500
            });
        }

        this.healthBarFlash.scaleX = this.healthBarCurr.scaleX + 2;
        if (this.healthBarCurr.scaleX === 0) {
            this.healthBarFlash.scaleX = 0;
        }
        this.healthBarFlash.scaleY = this.healthBarMax.scaleY;
        this.healthBarFlash.alpha = 1 + 0.2 * mult;
        if (this.healthBarFlashTween) {
            this.healthBarFlashTween.stop();
        }
        this.healthBarFlashTween = PhaserScene.tweens.add({
            delay: 50,
            targets: this.healthBarFlash,
            alpha: 0,
            ease: "Quad.easeOut",
            duration: gameVars.gameManualSlowSpeedInverse * 500 * mult + 150
        });
        if (this.healthBarRedTween) {
            this.healthBarRedTween.stop();
        }
        this.healthBarRedTween = PhaserScene.tweens.add({
            targets: this.healthBarRed,
            delay: 50,
            alpha: 0,
            ease: "Cubic.easeOut",
            duration: gameVars.gameManualSlowSpeedInverse * 550 * mult + 100
        })
    }

    updateHealthBar(isHealing, hurtAmt) {
        if (this.isDestroyed) {
            return;
        }
        if (this.health <= 0) {
            this.flashHealthChange(this.healthBarCurr.scaleX, 2);
            this.healthBarCurr.scaleX = 0;
        } else {
            let healthBarRatio = 1 + this.healthBarLengthMax * this.health / this.healthMax;
            if (hurtAmt >= 4) {
                if (hurtAmt >= 13) {
                    this.flashHealthChange(this.healthBarCurr.scaleX, 1.1);
                } else {
                    this.flashHealthChange(this.healthBarCurr.scaleX);
                }
            } else if (hurtAmt > 0) {
                this.flashHealthChange(this.healthBarCurr.scaleX, 0.4);
            }
            this.healthBarCurr.scaleX = healthBarRatio;
        }
        this.healthBarText.setText(this.health);
    }


    takeTrueDamage(amt, isAttack = true, extraOffsetY = 0, canAmplify, type) {
        if (globalObjects.player.isDead()) {
            return;
        }
        if (this.delayLoad) {
            return;
        }
        if (canAmplify && cheats.extraDmg) {
            amt *= 2;
        }
        if (canAmplify && cheats.extraExtraDmg) {
            amt *= 2;
        }

        let origHealth = this.health;
        // if (this.storeDamage) {
        //     // time storage
        //     this.accumulatedTimeDamage += amt;
        //     this.clockLarge.setScale(0.18 + Math.sqrt(this.accumulatedTimeDamage) * 0.01);
        //     this.clockLargeHand.setScale(this.clockLarge.scaleX * 20, this.clockLarge.scaleY * 140);
        //     this.delayedDamageText.setText(this.accumulatedTimeDamage);
        //     this.delayedDamageText.setScale(this.clockLarge.scaleX * 3 + 0.1);
        //     this.scene.tweens.add({
        //         targets: this.delayedDamageText,
        //         scaleX: this.clockLarge.scaleX * 3,
        //         scaleY: this.clockLarge.scaleX * 3,
        //         ease: "Cubic.easeOut",
        //         duration: gameVars.gameManualSlowSpeedInverse * 100 + amt * 5
        //     });
        //
        //     amt = 0;
        // }
        let damageTaken = this.adjustDamageTaken(amt, isAttack, true);
        if (this.specialDamageAbsorptionActive) {
            damageTaken = this.handleSpecialDamageAbsorption(damageTaken);
        }
        this.setHealth(Math.max(0, this.health - damageTaken), true);
        let healthLoss = origHealth - this.health;
        this.reactToDamageTypes(healthLoss, isAttack, type);
        if (healthLoss > 0) {
            this.animateShake();
            let offsetY = -damageTaken * 0.1 + extraOffsetY;
            this.animateDamageNum(healthLoss, true, offsetY);
            if (isAttack) {
                this.timeSinceLastAttacked = Math.min(this.timeSinceLastAttacked, 0);
            }
        }

        if (this.health <= 0) {
            this.die();
        }
    }

    setHealth(newHealth, isTrue) {
        this.prevHealth = this.health;
        this.health = newHealth;
        let healthDiff = this.prevHealth - newHealth;
        this.updateHealthBar(undefined, healthDiff);
    }

    getHealth() {
        return this.health;
    }

    takeDamagePercent(amt, bonusDamage = 0, type) {
        let origHealth = this.health;
        let timeUpdatedHealth = origHealth - this.accumulatedTimeDamage;
        let healthRemoved = Math.ceil(amt * 0.01 * timeUpdatedHealth) + bonusDamage;
        this.takeDamage(healthRemoved, undefined, undefined, type);
    }

    takeDamagePercentTotal(amt, bonusDamage = 0) {
        let origHealth = this.healthMax;
        let healthRemoved = Math.ceil(amt * origHealth) + bonusDamage;
        this.takeDamage(healthRemoved);
    }

    setAsleep() {
        if (this.isDestroyed) {
            return;
        }
        this.isAsleep = true;
        this.isUsingAttack = false;
        this.chargeBarWarningBig.visible = false;
        this.chargeBarAngry.visible = false;
        this.chargeBarWarning.visible = false;
        this.attackDarken.visible = false;
        this.hideAngrySymbol()
        PhaserScene.tweens.add({
            targets: [this.chargeBarCurr],
            alpha: 0,
            duration: gameVars.gameManualSlowSpeedInverse * 400,
        });
        this.chargeBarEst1.visible = false;
        this.chargeBarEst2.visible = false;

        this.addTween({
            targets: [this.chargeVertical, this.chargeVertical2],
            alpha: 0,
            duration: 500,
            ease: 'Cubic.easeOut'
        });

        PhaserScene.tweens.add({
            targets: [this.chargeBarMax, this.chargeBarCurr, this.chargeBarOutline],
            scaleX: 0,
            ease: "Cubic.easeOut",
            duration: gameVars.gameManualSlowSpeedInverse * 400,
        });
        if (this.attackName) {
            this.attackName.visible = false;
            this.attackGlow.visible = false;
        }
    }

    setAwake() {
        if (this.isDestroyed) {
            return;
        }
        this.chargeBarAngry.scaleX = 0;
        this.chargeBarWarning.scaleX = 0;
        // this.timeSinceLastAttacked = 9999;
        // this.castAggravateCharge += 20;
        this.isAsleep = false;
        if (this.attackName) {
            this.attackName.visible = true;
        }
        this.chargeBarEst1.visible = true;
        this.chargeBarEst2.visible = true;
        this.attackPaused = false;
        this.unhideCurrentAttack();

    }

    hideAngrySymbol() {
        if (this.isDestroyed) {
            return;
        }
        if (!this.angrySymbolIsHiding) {
            this.angrySymbolIsHiding = true;
            if (this.angrySymbolAnim) {
                this.angrySymbolAnim.stop();
            }
            this.angrySymbolAnim = PhaserScene.tweens.add({
                targets: [this.angrySymbol, this.angrySymbol2],
                scaleX: 0,
                scaleY: 0,
                ease: "Cubic.easeIn",
                duration: gameVars.gameManualSlowSpeedInverse * 200,
                onComplete: () => {
                    this.angrySymbol.visible = false;
                    this.angrySymbol2.visible = false;
                }
            });
        }
    }

    showAngrySymbol(state) {
        if (this.isDestroyed) {
            return;
        }
        if (this.angrySymbol.currAnim !== state) {
            this.angrySymbol.currAnim = state;
            this.angrySymbol.stop();
            this.angrySymbol.play(state);
            this.angrySymbol.rotation = 0;
            this.angrySymbol2.rotation = 0;
            if (state === 'exclamation') {
                this.angrySymbol2.play(state);
                this.angrySymbol2.alpha = 1;
            } else {
                this.angrySymbol2.stop();
                this.angrySymbol2.alpha = 0;
            }
        }
        if (this.angrySymbolIsHiding) {
            this.angrySymbolIsHiding = false;
            if (this.angrySymbolAnim) {
                this.angrySymbolAnim.stop();
            }
            if (state === 'angry' || state === 'angrybone') {
                this.angrySymbolAnim = this.scene.tweens.add({
                    targets: this.angrySymbol,
                    scaleX: 2.2,
                    scaleY: 2.2,
                    rotation: 0.17,
                    duration: gameVars.gameManualSlowSpeedInverse * 125,
                    ease: 'Quint.easeOut',
                    onComplete: () => {
                        this.angrySymbolAnim = this.scene.tweens.add({
                            targets: this.angrySymbol,
                            rotation: 0,
                            scaleX: 0.85,
                            scaleY: 0.85,
                            duration: gameVars.gameManualSlowSpeedInverse * 215,
                            ease: 'Back.easeOut',
                        });
                    }
                });
            } else {
                this.angrySymbol2.visible = true;
                this.angrySymbol.rotation = 0;
                this.angrySymbol2.rotation = 0;
                this.angrySymbolAnim = this.scene.tweens.add({
                    targets: [this.angrySymbol, this.angrySymbol2],
                    scaleX: 0.85,
                    scaleY: 0.85,
                    duration: gameVars.gameManualSlowSpeedInverse * 200,
                    ease: 'Back.easeOut',
                });
                if (!this.nextAttack.isPassive) {
                    this.angryAlert.setAlpha(1).setScale(0.75);
                    this.angryAlert2.setAlpha(1).setScale(0.75);
                    playSound('swish',0.8).detune = -300;

                    this.scene.tweens.add({
                        targets: [this.angryAlert, this.angryAlert2],
                        scaleX: 2.25,
                        scaleY: 2.25,
                        rotation: 0,
                        duration: gameVars.gameManualSlowSpeedInverse * 800,
                        ease: 'Cubic.easeOut',
                        completeDelay: 25,
                        onComplete: () => {
                            playSound('slice_in',0.3).detune = -600;

                            this.angryAlert.setAlpha(1).setScale(0.75);
                            this.angryAlert2.setAlpha(1).setScale(0.75);
                            this.scene.tweens.add({
                                targets: [this.angryAlert, this.angryAlert2],
                                scaleX: 2.25,
                                scaleY: 2.25,
                                duration: gameVars.gameManualSlowSpeedInverse * 1200,
                                ease: 'Cubic.easeOut',
                            });
                            this.scene.tweens.add({
                                targets: [this.angryAlert, this.angryAlert2],
                                alpha: 0,
                                rotation: 0,
                                ease: 'Quad.easeOut',
                                duration: gameVars.gameManualSlowSpeedInverse * 1200,
                            });
                        }
                    });
                    this.scene.tweens.add({
                        targets: [this.angryAlert, this.angryAlert2],
                        alpha: 0,
                        ease: 'Cubic.easeOut',
                        duration: gameVars.gameManualSlowSpeedInverse * 800,
                    });
                }
            }

            this.angrySymbol.visible = true;
        }
    }

    playerDied() {
        if (this.dead || this.isDestroyed) {
            return;
        }
        if (this.bgMusic) {
            fadeAwaySound(this.bgMusic, 350);
        }
        if (this.bgMusic2) {
            fadeAwaySound(this.bgMusic2, 350);
        }
        if (this.bgMusic3) {
            fadeAwaySound(this.bgMusic3, 350);
        }
        if (this.tutorialButton) {
            this.tutorialButton.destroy();
        }
        this.setAsleep();
        for (let i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].unsubscribe();
        }
        this.subscriptions = [];
    }

    cleanUp() {

    }

    destroy() {
        if (this.isDestroyed) {
            return;
        }
        this.dead = true;
        this.isDestroyed = true;
        this.clearEffects()
        this.cleanUp();
        let blackBG = getBackgroundBlackout2();
        this.addTween({
            targets: blackBG,
            duration: 500,
            alpha: 0,
        })
        if (this.attackName.currAnim) {
            this.attackName.currAnim.stop();
        }
        if (this.attackGlow.currAnim) {
            this.attackGlow.currAnim.stop();
        }
        if (this.attackDarken.currAnim) {
            this.attackDarken.currAnim.stop();
        }
        globalObjects.textPopupManager.hideInfoText();
        messageBus.publish("closeCombatText");

        for (let i = 0; i < this.destructibles.length; i++) {
            if (this.destructibles[i]) {
                this.destructibles[i].destroy();
            }
        }
        if (this.bgMusic) {
            fadeAwaySound(this.bgMusic, 200);
        }
        if (this.bgMusic2) {
            fadeAwaySound(this.bgMusic2, 200);
        }
        if (this.bgMusic3) {
            fadeAwaySound(this.bgMusic3, 200);
        }
        if (this.popupTimeout) {
            clearTimeout(this.popupTimeout);
        }

        this.healthBarMax.destroy();
        this.healthBarCurr.destroy();
        this.healthBarText.destroy();

        this.chargeBarWarningBig.destroy();
        this.chargeBarMax.destroy();
        this.chargeBarOutline.destroy();
        this.chargeBarWarning.destroy();
        this.chargeBarAngry.destroy();
        this.chargeBarCurr.destroy();
        this.attackGlow.destroy();
        this.attackDarken.destroy();
        this.attackNameHighlight.destroy();
        this.chargeVertical.destroy();
        this.chargeVertical2.destroy();

        if (this.chargeBarEst1.currAnim) {
            this.chargeBarEst1.currAnim.stop();
            this.chargeBarEst1.currAnim = null;
        }
        this.chargeBarEst1.destroy();
        this.chargeBarEst2.destroy();
        this.voidPause.destroy();
        this.attackName.destroy();
        // this.angrySymbol.destroy(); // maybe no longer needed now that i have addsprite
        this.chargeBarFlash1.destroy();
        this.chargeBarFlash2.destroy();

        this.sprite.destroy();

        this.delayedDamageText.destroy();
        this.shieldSprite.destroy();
        this.shieldText.destroy();

        for (let i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].unsubscribe();
        }
        this.subscriptions = [];
        updateManager.removeFunction(this.boundUpdateFunc);
    }

    addToDestructibles(item) {
        this.destructibles.push(item);
    }

    die() {
        if (this.dead) {
            return;
        }
        this.dead = true;
        if (this.tutorialButton) {
            this.tutorialButton.destroy();
        }
        if (this.bgMusic) {
            this.bgMusic.stop();
        }
        if (this.bgMusic3) {
            this.bgMusic3.stop();
        }
        if (this.breatheTween) {
            this.breatheTween.stop();
        }

        if (this.attackGlow) {
            if (this.attackGlow.currAnim) {
                this.attackGlow.currAnim.stop();
            }
            this.attackGlow.visible = false;
            this.attackGlow.y = -100;
        }
        if (this.attackDarken) {
            if (this.attackDarken.currAnim) {
                this.attackDarken.currAnim.stop();
            }
            this.attackDarken.visible = false;
        }
        messageBus.publish("closeCombatText");

        this.clearEffects();
        // undo any time magic
        this.sprite.setScale(this.sprite.startScale);
        globalObjects.magicCircle.setTimeSlowRatio(1);
        this.flashHealthChange(this.healthBarCurr.scaleX, 2);
        this.healthBarCurr.scaleX = 0;
        this.healthBarText.setText('0');
        for (let i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].unsubscribe();
        }
        this.subscriptions = [];
        if (this.attackAnim) {
            this.attackAnim.stop();
            this.sprite.setScale(this.sprite.startScale);
        }
        this.animateShake(3);
        this.chargeBarWarningBig.visible = false; this.chargeBarWarningBig.scaleY = 100;
        this.chargeBarWarning.visible = false; this.chargeBarWarning.scaleY = 100;
        this.chargeBarAngry.visible = false; this.chargeBarAngry.scaleY = 100;
        this.chargeBarCurr.visible = false; this.chargeBarCurr.scaleY = 100;
        this.chargeBarEst1.visible = false;
        this.chargeBarEst2.visible = false;
        this.hideAngrySymbol()
        this.voidPause.visible = false;
        this.chargeVertical.visible = false;
        this.chargeVertical2.visible = false;

        this.attackName.visible = false;
        this.attackGlow.visible = false;
        this.attackDarken.visible = false;
        messageBus.publish('enemyHasDied');

        for (let i in this.statuses) {
            let status = this.statuses[i];
            if (status == null) {
                continue;
            }
            status.cleanUp(this.statuses);
            delete this.statuses[i];
        }
        this.sprite.x -= 5;
        PhaserScene.tweens.add({
            delay: 0,
            targets: [this.sprite],
            x: "+=8",
            ease: "Cubic.easeOut",
            duration: gameVars.gameManualSlowSpeedInverse * 50,
            onStart: () => {
                PhaserScene.tweens.add({
                    targets: [this.sprite],
                    x: "-=5",
                    ease: "Cubic.easeInOut",
                    duration: gameVars.gameManualSlowSpeedInverse * 70,
                    onStart: () => {
                        PhaserScene.tweens.add({
                            targets: [this.sprite],
                            x: "+=2",
                            duration: gameVars.gameManualSlowSpeedInverse * 50,
                        });
                    }
                });
            }
        });
        this.sprite.setScale(this.sprite.startScale);


        PhaserScene.time.delayedCall(750, () => {
            PhaserScene.tweens.add({
                targets: [this.chargeBarCurr],
                scaleX: 0,
                ease: "Cubic.easeOut",
                duration: gameVars.gameManualSlowSpeedInverse * 400,
                 onComplete: () => {
                     PhaserScene.tweens.add({
                         targets: [this.chargeBarMax, this.chargeBarOutline],
                         scaleX: 0,
                         ease: "Cubic.easeOut",
                         duration: gameVars.gameManualSlowSpeedInverse * 400,
                         onComplete: () => {
                             PhaserScene.tweens.add({
                                 targets: [this.healthBarMax],
                                 scaleX: 0,
                                 duration: gameVars.gameManualSlowSpeedInverse * 1000
                             });
                             PhaserScene.tweens.add({
                                 delay: 400,
                                 targets: [this.healthBarText],
                                 alpha: 0,
                                 duration: gameVars.gameManualSlowSpeedInverse * 300
                             });
                         }
                     });
                 }
            });
        });
    }

    animateShake(amt = 1) {
        if (this.disableAnimateShake) {
            return;
        }
        this.sprite.x -= 4;
        if (amt <= 1) {
            this.sprite.setTint(0xFFBBBB);
        } else if (amt < 1.25) {
            this.sprite.setTint(0xFF7777);
        } else {
            this.sprite.setTint(0xFF0000);
        }

        PhaserScene.time.delayedCall(50 + amt * 20, ()=> {
            this.sprite.clearTint();
        });

        let extraTimeMult = 2 - gameVars.timeSlowRatio;
        PhaserScene.tweens.add({
            targets: this.sprite,
            x: this.x + 3 * amt,
            ease: "Quad.easeOut",
            duration: gameVars.gameManualSlowSpeedInverse * 100 * extraTimeMult,
            onComplete: () => {
                PhaserScene.tweens.add({
                    targets: this.sprite,
                    x: this.x - 2 * amt,
                    ease: "Cubic.easeInOut",
                    duration: gameVars.gameManualSlowSpeedInverse * 100 * extraTimeMult,
                    onComplete: () => {
                        PhaserScene.tweens.add({
                            targets: this.sprite,
                            x: this.x,
                            ease: "Cubic.easeInOut",
                            duration: gameVars.gameManualSlowSpeedInverse * 60 * extraTimeMult
                        });
                    }
                });
            }
        });
        for (let i = 0; i < this.extraSprites.length; i++) {
            let currSprite = this.extraSprites[i];
            currSprite.x -= 4;
            PhaserScene.tweens.add({
                targets: currSprite,
                x: this.x + 3 * amt + currSprite.startOffsetX,
                ease: "Quad.easeOut",
                duration: gameVars.gameManualSlowSpeedInverse * 100 * extraTimeMult,
                onComplete: () => {
                    PhaserScene.tweens.add({
                        targets: currSprite,
                        x: this.x - 2 * amt + currSprite.startOffsetX,
                        ease: "Cubic.easeInOut",
                        duration: gameVars.gameManualSlowSpeedInverse * 100 * extraTimeMult,
                        onComplete: () => {
                            PhaserScene.tweens.add({
                                targets: currSprite,
                                x: this.x + currSprite.startOffsetX,
                                ease: "Cubic.easeInOut",
                                duration: gameVars.gameManualSlowSpeedInverse * 60 * extraTimeMult
                            });
                        }
                    });
                }
            });
        }
    }

    animateDamageNum(val, isTrueDamage = false, offsetY = 0) {
        let timeNow = Date.now();
        let timeSinceLastDamageTaken = timeNow - this.timeWhenLastDamageTaken;
        let randX = 0; let randY = 0;
        if (timeSinceLastDamageTaken < 1500) {
            randX = (Math.random() - 0.5) * (1500 - timeSinceLastDamageTaken) * 0.06;
            randY = (Math.random() - 0.5) * (1500 - timeSinceLastDamageTaken) * 0.03;
        }
        if (offsetY > 0) {
            randX *= 1 / (offsetY + 1);
            randY *= 1 / (offsetY + 1);
        }
        this.timeWhenLastDamageTaken = timeNow;
        let scale = 0.5 + Math.sqrt(val) * 0.2;
        if (isTrueDamage) {
            messageBus.publish("animateTrueDamageNum", gameConsts.halfWidth + randX, 100 + randY + offsetY, '-' + val, scale);
        } else {
            messageBus.publish("animateDamageNumAccumulate", val, offsetY);
        }
    }

    initAttacks() {
        this.attacks = [
            [
                {
                    name: "Hit",
                    nameDetail: "Hit - 3 damage",
                    chargeAmt: 250,
                    damage: 3
                },
                {
                    name: "Hit 2",
                    nameDetail: "Hit 5 damage",
                    chargeAmt: 350,
                    damage: 5
                },
                {
                    name: "Hit 3",
                    nameDetail: "Hit 20 damage",
                    chargeAmt: 600,
                    damage: 20
                },
            ]
        ];
    }

    interruptCurrentAttack() {
        this.attackCharge = 0;
        this.attackCooldown = this.delayBetweenAttacks;
        this.chargeBarCurr.alpha = 1;
        this.attackName.setText(" ");
        this.isUsingAttack = false;
        if (this.attackAnim) {
            this.attackAnim.stop();
        }

        this.sprite.setScale(this.sprite.startScale);
    }

    hideCurrentAttack() {
        this.chargeBarCurr.x = -999;
        this.hideAngrySymbol();
        this.attackName.x = -999;
        this.chargeBarWarning.x = -999;
        this.chargeBarAngry.x = -999;
    }

    unhideCurrentAttack() {
        this.chargeBarCurr.x = gameConsts.halfWidth;
        this.attackName.x = gameConsts.halfWidth;
        this.chargeBarWarning.x = gameConsts.halfWidth;
        this.chargeBarAngry.x = gameConsts.halfWidth;
    }

    setNextAttack(set, index = 0) {
        this.currentAttackSetIndex = set;
        this.nextAttackIndex = index;
    }

    showFlash(x, y) {
        this.flash = this.scene.add.sprite(x, y, 'blurry', 'flash.webp').setOrigin(0.5, 0.5).setScale(0.5).setDepth(999);
         PhaserScene.tweens.add({
             targets: this.flash,
             rotation: 2,
             scaleX: 1.25,
             scaleY: 1.25,
             ease: 'Quad.easeIn',
             duration: gameVars.gameManualSlowSpeedInverse * 600,
             onComplete: () => {
                 PhaserScene.tweens.add({
                     targets: this.flash,
                     rotation: 4,
                     scaleX: 0,
                     scaleY: 0,
                     duration: gameVars.gameManualSlowSpeedInverse * 600,
                     ease: 'Quad.easeOut',
                     onComplete: () => {
                         this.flash.destroy();
                     }
                 });
             }
         });
    }

     showVictory(rune) {
        globalObjects.encyclopedia.hideButton();
        globalObjects.options.hideButton();
        globalObjects.magicCircle.disableMovement();
         let banner = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 35, 'misc', 'victory_banner.png').setScale(100, 1.2).setDepth(9998).setAlpha(0);
         let victoryText = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 44, 'misc', 'victory_text.png').setScale(0.95).setDepth(9998).setAlpha(0);
         let continueText = this.scene.add.text(gameConsts.halfWidth, gameConsts.halfHeight + 2, getLangText('cont_ui'), {fontFamily: 'garamondmax', color: '#F0F0F0', fontSize: 18}).setAlpha(0).setOrigin(0.5, 0.5).setAlign('center').setDepth(9998);
         swirlInReaperFog();

         PhaserScene.tweens.add({
             targets: banner,
             alpha: 0.75,
             duration: gameVars.gameManualSlowSpeedInverse * 500,
         });

         PhaserScene.tweens.add({
             targets: [victoryText],
             alpha: 1,
             ease: 'Quad.easeOut',
             duration: gameVars.gameManualSlowSpeedInverse * 500,
         });
        playSound('victory');
         setTimeout(() => {
             continueText.alpha = 1;
         }, 1000);

         PhaserScene.tweens.add({
             targets: victoryText,
             scaleX: 1,
             scaleY: 1,
             duration: gameVars.gameManualSlowSpeedInverse * 800,
         });
         PhaserScene.tweens.add({
             targets: rune,
             y: gameConsts.halfHeight - 110,
             ease: 'Cubic.easeOut',
             duration: gameVars.gameManualSlowSpeedInverse * 400,
             completeDelay: 300,
             onComplete: () => {
                if (this.dieClickBlocker) {
                    if (canvas) {
                        canvas.style.cursor = 'pointer';
                    }
                     this.dieClickBlocker.setOnMouseUpFunc(() => {
                         if (canvas) {
                             canvas.style.cursor = 'default';
                         }
                        this.dieClickBlocker.destroy();
                         PhaserScene.tweens.add({
                             targets: [victoryText, banner],
                             alpha: 0,
                             duration: gameVars.gameManualSlowSpeedInverse * 400,
                             onComplete: () => {
                                 victoryText.destroy();
                                 banner.destroy();
                                 playReaperAnim(this);
                             }
                         });
                        continueText.destroy();
                         PhaserScene.tweens.add({
                             targets: rune,
                             y: "+=90",
                             ease: 'Quad.easeOut',
                             duration: gameVars.gameManualSlowSpeedInverse * 400,
                             onComplete: () => {
                                 rune.destroy();
                             }
                         });
                         PhaserScene.tweens.add({
                             targets: rune,
                             alpha: 0,
                             duration: gameVars.gameManualSlowSpeedInverse * 400,
                         });
                     })
                 } else {
                    let clickBlocker = createGlobalClickBlocker(true);
                    clickBlocker.setOnMouseUpFunc(() => {
                        hideGlobalClickBlocker();
                         PhaserScene.tweens.add({
                             targets: [victoryText, banner],
                             alpha: 0,
                             duration: gameVars.gameManualSlowSpeedInverse * 400,
                             onComplete: () => {
                                 victoryText.destroy();
                                 banner.destroy();
                                 playReaperAnim(this);
                             }
                         });
                        continueText.destroy();
                         PhaserScene.tweens.add({
                             targets: rune,
                             y: "+=90",
                             ease: 'Quad.easeOut',
                             duration: gameVars.gameManualSlowSpeedInverse * 400,
                             onComplete: () => {
                                 rune.destroy();
                             }
                         });
                         PhaserScene.tweens.add({
                             targets: rune,
                             alpha: 0,
                             duration: gameVars.gameManualSlowSpeedInverse * 400,
                         });
                    });
                 }
             }
         });
     }
    launchAttack(attackTimes = 1, prepareSprite, preAttackSprite, attackSprites = [], isRepeatedAttack = false, finishDelay = 0, transitionFast = false) {
        if (this.dead || this.isDestroyed){
            return;
        }
        this.isUsingAttack = true;
        let blackBG;
        if (!this.nextAttack.isPassive) {
            blackBG = getBackgroundBlackout2();
            this.addTween({
                targets: blackBG,
                duration: 400,
                alpha: 0.12,
                ease: 'Quad.easeInOut'
            })
        }

        let extraTimeMult = (2 - gameVars.timeSlowRatio) * this.attackSlownessMult;

        if (this.nextAttack.attackStartFunction) {
            this.nextAttack.attackStartFunction();
        }
        let pullbackScale = this.pullbackScale * this.sprite.startScale;
        let pullbackDurMult = Math.sqrt(Math.abs(this.pullbackScale - this.pullbackScaleDefault) * 10) + 1;
        pullbackDurMult *= this.pullbackDurMult ? this.pullbackDurMult : 1;
        let timeSlowMult = gameVars.timeSlowRatio < 0.9 ? 0.5 : 1;

        let durationPullback = isRepeatedAttack ? (200 * extraTimeMult * pullbackDurMult + this.extraRepeatDelay) : (400 * extraTimeMult * pullbackDurMult);

        if (prepareSprite) {
            let spriteToPrepare = prepareSprite;
            if (Array.isArray(prepareSprite)) {
                if (this.sprite.prepareNum === undefined) {
                    this.sprite.prepareNum = 0;
                } else {
                    this.sprite.prepareNum = (this.sprite.prepareNum + 1) % prepareSprite.length;
                }
                spriteToPrepare = prepareSprite[this.sprite.prepareNum];
            }
            if (isRepeatedAttack) {
                PhaserScene.time.delayedCall(gameVars.gameManualSlowSpeedInverse * durationPullback * this.pullbackHoldRatio, () => {
                    this.setSpriteIfNotInactive(spriteToPrepare, this.sprite.startScale, true);
                });
            } else {
                if (this.pullbackInitialDelay) {
                    PhaserScene.time.delayedCall(this.pullbackInitialDelay, () => {
                        this.setSpriteIfNotInactive(spriteToPrepare, this.sprite.startScale, true);
                    });
                } else {
                    this.setSpriteIfNotInactive(spriteToPrepare, this.sprite.startScale, true);
                }
            }
        }

        let transitionMult = transitionFast ? 0 : 1;

        // First pull back
        let pullbackEase = this.customInitialPullback ? this.customInitialPullback : 'Cubic.easeOut';
        if (isRepeatedAttack) {
            pullbackEase = this.customRepeatPullback ? this.customRepeatPullback : pullbackEase;
        }
        this.attackAnim = this.scene.tweens.add({
            targets: this.sprite,
            scaleX: pullbackScale,
            scaleY: pullbackScale,
            rotation: 0,
            duration: gameVars.gameManualSlowSpeedInverse * durationPullback * timeSlowMult * transitionMult,
            ease: pullbackEase,
            onComplete: () => {
                if (this.dead || this.isDestroyed){
                    return;
                }
                let attackDuration = (isRepeatedAttack ? (150 * extraTimeMult) : (175 * extraTimeMult)) * this.attackDurMult;
                let attackScale = this.attackScale * this.sprite.startScale;
                attackDuration += Math.floor(this.attackScale * 200);
                if (preAttackSprite && preAttackSprite.length > 0) {
                    let origX = this.sprite.originX;
                    let origY = this.sprite.originY;
                    this.sprite.setFrame(preAttackSprite).setOrigin(origX, origY);

                }
                this.attackAnim = this.scene.tweens.add({
                    targets: this.sprite,
                    scaleX: attackScale,
                    scaleY: attackScale,
                    duration: gameVars.gameManualSlowSpeedInverse * attackDuration * transitionMult * timeSlowMult,
                    rotation: 0,
                    ease: this.attackEase ? this.attackEase : 'Cubic.easeIn',
                    onComplete: () => {
                        if (this.dead || this.isDestroyed){
                            return;
                        }
                        if (!isRepeatedAttack) {
                            messageBus.publish("enemyMadeAttack", this.nextAttack.damage);
                        }
                        if (this.dead || this.isDestroyed){
                            return;
                        }
                        if (attackSprites.length > 0) {
                            //if (!prepareSprite) {
                                if (this.sprite.attackNum === undefined) {
                                    this.sprite.attackNum = 0;
                                } else {
                                    this.sprite.attackNum = (this.sprite.attackNum + 1) % attackSprites.length;
                                }
                                this.setSpriteIfNotInactive(attackSprites[this.sprite.attackNum], this.sprite.startScale, undefined, 10);
                            //}
                        }
                        if (this.health > 0) {
                            if (this.nextAttack.damage > 0) {
                                messageBus.publish("selfTakeDamage", this.nextAttack.damage);
                            }
                            if (this.nextAttack.message) {
                                messageBus.publish(this.nextAttack.message, this.nextAttack.messageDetail);
                            }
                            if (this.nextAttack.attackFinishFunction) {
                                this.nextAttack.attackFinishFunction();
                            }
                        }
                        if (attackTimes > 1) {
                            this.launchAttack(attackTimes - 1, prepareSprite, preAttackSprite, attackSprites, true, finishDelay, transitionFast);
                        } else {
                            this.attackAnim = this.scene.tweens.add({
                                targets: this.sprite,
                                scaleX: this.sprite.startScale,
                                scaleY: this.sprite.startScale,
                                rotation: 0,
                                duration: gameVars.gameManualSlowSpeedInverse * 500 * extraTimeMult * timeSlowMult * transitionMult,
                                ease: this.returnEase ? this.returnEase : 'Cubic.easeInOut'
                            });
                            PhaserScene.time.delayedCall(finishDelay, () => {
                                this.isUsingAttack = false;
                            });
                            PhaserScene.time.delayedCall(400 * extraTimeMult * this.lastAttackLingerMult + 100, () => {
                                this.sprite.attackNum = 0;
                                this.sprite.prepareNum = 0;
                                this.attackDurMult = 1;
                                if (blackBG) {
                                    this.addTween({
                                        targets: blackBG,
                                        duration: 500,
                                        alpha: 0
                                    })
                                }

                                if (!this.dead && !this.isDestroyed) {
                                    this.setSpriteIfNotInactive(this.defaultSprite, undefined, true);
                                    if (this.nextAttack.finaleFunction) {
                                        this.nextAttack.finaleFunction();
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
    }

    getMaxHealth() {
        return this.healthMax;
    }

    addSprite(x, y, atlas, frame) {
        let newSprite = this.scene.add.sprite(x, y, atlas, frame);
        this.addToDestructibles(newSprite);
        return newSprite;
    }

    addImage(x, y, atlas, frame) {
        let newImage = this.scene.add.image(x, y, atlas, frame);
        this.addToDestructibles(newImage);
        return newImage;
    }

    addTween(param) {
        if (param.onStart) {
            let oldOnStart = param.onStart;
            param.onStart = () => {
                if (!this.isDestroyed) {
                    oldOnStart();
                }
            }
        }
        if (param.onComplete) {
            let oldOnComplete = param.onComplete;
            param.onComplete = () => {
                if (!this.isDestroyed) {
                    oldOnComplete();
                }
            }
        }
        let tweenObj = PhaserScene.tweens.add(param);
        if (param.repeat === -1 || param.repeat > 20) {
            this.addToDestructibles(tweenObj)
        }
        return tweenObj;
    }

    addText(x, y, text, param1, param2) {
        let newText = this.scene.add.text(x, y, text, param1, param2)
        this.addToDestructibles(newText);
        return newText;
    }

    addSubscription(topic, callback, target) {
        let sub = messageBus.subscribe(topic, callback, target);
        this.subscriptions.push(sub);
        return sub;
    }

    addTimeout(func, delay) {
        if (this.isDestroyed) {
            return setTimeout(() => {}, 0);
        }
        return setTimeout(() => {
            if (!this.isDestroyed) {
                func()
            }
        }, gameVars.gameManualSlowSpeedInverse * delay);
    }

    addTimeoutIfAlive(func, delay) {
        if (this.isDestroyed || this.dead) {
            return setTimeout(() => {}, 0);
        }
        return setTimeout(() => {
            if (!this.isDestroyed && !this.dead) {
                func()
            }
        }, gameVars.gameManualSlowSpeedInverse * delay);
    }

    addBitmapText(x, y, source, text, size, param1, param2, param3) {
        let newText = PhaserScene.add.bitmapText(x, y, source, text, size, param1, param2, param3)
        this.addToDestructibles(newText);
        return newText;
    }

    addDelay(func, delay) {
        return this.addDelayedCall(delay, func);
    }

    addDelayIfAlive(func, delay) {
        if (this.isDestroyed || this.dead) {
            return PhaserScene.time.delayedCall(0, () => {})
        }
        return PhaserScene.time.delayedCall(gameVars.gameManualSlowSpeedInverse * delay, () => {
            if (!this.isDestroyed && !this.dead) {
                func();
            }
        })
    }

    addDelayedCall(delay, func) {
        if (this.isDestroyed) {
            return PhaserScene.time.delayedCall(0, () => {})
        }
        return PhaserScene.time.delayedCall(gameVars.gameManualSlowSpeedInverse * delay, () => {
            if (!this.isDestroyed) {
                func();
            }
        })
    }

    updateStatuses() {
        if (this.dead) {
            return;
        }
        for (let i in this.statuses) {
            let status = this.statuses[i];
            if (status == null) {
                continue;
            }
            if (status.duration <= 0) {
                status.cleanUp(this.statuses);
                delete this.statuses[i];
            }
            if (status.onUpdate) {
                status.onUpdate();
            }
            status.duration--;
            if (status.duration <= 0) {
                status.cleanUp(this.statuses);
                delete this.statuses[i];
            }
        }
    }

    heal(amt) {
        this.health = Math.min(this.healthMax, this.health + amt);
        this.prevHealth = this.health;
        this.updateHealthBar(true);
    }

    setMaxHealth(amt) {
        this.healthMax = amt;// = Math.min(this.healthMax, this.health + amt);
        this.updateHealthBar(true);
    }

    playerClickedSpell() {
        if (this.isAsleep) {
            return;
        }
        let incAmt = cheats.calmEnemies ? 16 : 20;
        if (challenges.angryEnemies) {
            incAmt = 24;
        }
        this.castAggravateCharge = Math.max(incAmt, this.castAggravateCharge + incAmt);

    }

    addCastAggravate(amt) {
        if (this.isAsleep) {
            return;
        }
        this.castAggravateCharge += amt;
    }

    setPredictScale(amt = 8.3) {
        if (this.lastChargeEstScale != this.chargeBarEstScale) {
            this.lastChargeEstScale = this.chargeBarEstScale;
            if (this.chargeBarEst1.currAnim) {
                this.chargeBarEst1.currAnim.stop();
                this.chargeBarEst1.alpha = 0.6;
                this.chargeBarEst2.alpha = 0.6;
                this.chargeBarEst1.currAnim = PhaserScene.tweens.add({
                    delay: 250,
                    targets: [this.chargeBarEst1, this.chargeBarEst2],
                    duration: 1250,
                    alpha: 0.08,
                    onComplete: () => {
                        this.chargeBarEst1.currAnim = PhaserScene.tweens.add({
                            delay: 250,
                            targets: [this.chargeBarEst1, this.chargeBarEst2],
                            duration: 1250,
                            alpha: 0.39,
                            yoyo: true,
                            repeat: -1,
                        });
                    }
                });
            }
        }
        this.chargeBarEstScale = amt;
    }
}
