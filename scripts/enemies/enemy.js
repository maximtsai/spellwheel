class Enemy {
    constructor(scene, x, y, level = 1) {
        this.scene = scene;
        this.level = level;
        this.initStats();
        this.initAttacks();
        this.resetStats(x, y);
        this.createHealthBar(x, y);
        this.createChargeBar(x);
        this.subscriptions = [
            messageBus.subscribe("enemyTakeEffect", this.takeEffect.bind(this)),
            messageBus.subscribe("enemyClearEffect", this.clearEffects.bind(this)),
            messageBus.subscribe("enemyTakeDamage", this.takeDamage.bind(this)),
            messageBus.subscribe("enemyTakeTrueDamage", this.takeTrueDamage.bind(this)),
            messageBus.subscribe("enemyTakeDamagePercent", this.takeDamagePercent.bind(this)),
            messageBus.subscribe("enemyTakeDamagePercentTotal", this.takeDamagePercentTotal.bind(this)),
            messageBus.subscribe("setSlowMult", this.setSlowMult.bind(this)),

            messageBus.subscribe("disruptOpponentAttack", this.disruptOpponentAttack.bind(this)),
            messageBus.subscribe("disruptOpponentAttackPercent", this.disruptOpponentAttackPercent.bind(this)),
            messageBus.subscribe("statusesTicked", this.updateStatuses.bind(this)),
            messageBus.subscribe("enemyStartDamageCountdown", this.startDamageCountdown.bind(this)),
            messageBus.subscribe("enemyAddShield", this.addShield.bind(this)),
            messageBus.subscribe("increaseCurse", this.increaseCurse.bind(this)),

        ];

        this.boundUpdateFunc = this.update.bind(this);
        updateManager.addFunction(this.boundUpdateFunc);
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

    addExtraSprite(sprite, startOffsetX = 0, startOffsetY = 0) {
        sprite.startOffsetX = startOffsetX;
        sprite.startOffsetY = startOffsetY;
        this.extraSprites.push(sprite);
    }

    initStats() {
        this.destructibles = [];
        this.health = 1000;
        this.shield = 0;
        this.isAsleep = false;
        this.timeSinceLastAttacked = 9999;
        this.damageNumOffset = 0;
        this.healthBarLengthMax = 101;
        this.extraSprites = [];
        this.statuses = [];
        this.attackCharge = 0;
        this.nextAttackChargeNeeded = 999;
        this.nextAttackMultiples = 1;
        this.delayBetweenAttacks = 100;
        this.attackCooldown = 100;
        this.nextAttackIndex = 0;
        this.currentAttackSetIndex = 0;
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
        this.attackScale = 1.1;
        this.curse = 0;

        this.initStatsCustom();
        console.log("after init stats custom");

        this.prevHealth = this.health;
        this.healthMax = this.health;
    }

    initStatsCustom() {

    }

    createHealthBar(x, y) {
        this.healthBarLengthMax = 20 + Math.floor(Math.sqrt(this.healthMax) * 5);
        this.healthBarMax = this.scene.add.sprite(x, 20, 'blackPixel');
        let healthBarMaxGoalScale = this.healthBarLengthMax + 3;
        this.healthBarMax.setScale(0, 12);
        this.healthBarMax.startScaleY = this.healthBarMax.scaleY;
        this.healthBarMax.setOrigin(0.5, 0.5);
        this.healthBarMax.setDepth(10);

        this.healthBarCurr = this.scene.add.sprite(x - this.healthBarLengthMax - 1, this.healthBarMax.y, 'pixels', 'green_pixel.png');
        this.healthBarCurr.setScale(this.healthBarLengthMax + 1, 10);
        this.healthBarCurr.setOrigin(0, 0.5);
        this.healthBarCurr.alpha = 0;
        this.healthBarCurr.setDepth(10);

        this.healthBarText = this.scene.add.bitmapText(x, this.healthBarMax.y - 3, 'plainBold', 'zxcv', 20);
        this.healthBarText.setDepth(10);
        this.healthBarText.setOrigin(0.5, 0.5);
        this.healthBarText.alpha = 0;
        this.healthBarText.setText(this.health);

        this.scene.tweens.add({
            targets: [this.healthBarMax],
            delay: 200,
            duration: 100 + this.healthBarLengthMax * 5,
            scaleX: healthBarMaxGoalScale,
            ease: 'Quint.easeInOut'
        });
        this.scene.tweens.add({
            delay: this.healthBarLengthMax * 5 + 150,
            targets: [this.healthBarCurr, this.healthBarText],
            duration: 250,
            alpha: 1
        });
    }

    createChargeBar(x) {
        let chargeBarLength = Math.floor(this.nextAttackChargeNeeded * 0.2);
        this.chargeBarWarningBig = this.scene.add.sprite(gameConsts.halfWidth, 0, 'enemies', 'warning.png');
        this.chargeBarWarningBig.setOrigin(0.5, 0);
        this.chargeBarWarningBig.setScale(gameConsts.width * 0.1, 0.65);
        this.chargeBarWarningBig.alpha = 0
        this.chargeBarWarningBig.setDepth(1);

        this.chargeBarMax = this.scene.add.sprite(x, 335, 'blackPixel');
        this.chargeBarMax.setScale(chargeBarLength + 2, 9);
        this.chargeBarMax.setOrigin(0.5, 0.5);
        this.chargeBarMax.visible = false;
        this.chargeBarMax.setDepth(10);

        this.voidPause = this.scene.add.sprite(x, this.chargeBarMax.y, 'pixels', 'purple_pixel.png');
        this.voidPause.alpha = 0;
        this.voidPause.setScale(chargeBarLength + 2, 7);
        this.voidPause.setOrigin(0.5, 0.5);
        this.voidPause.setDepth(10);

        this.chargeBarWarning = this.scene.add.sprite(x, this.chargeBarMax.y, 'pixels', 'red_pixel.png');
        this.chargeBarWarning.alphaMult = 1;
        this.chargeBarWarning.setScale(chargeBarLength + 4, 9);
        this.chargeBarWarning.setOrigin(0.5, 0.5);
        this.chargeBarWarning.visible = false;
        this.chargeBarWarning.setDepth(10);
        this.chargeBarWarning.setAlpha(0.35);

        this.chargeBarCurr = this.scene.add.sprite(x, this.chargeBarMax.y, 'pixels', 'yellow_pixel.png');
        this.chargeBarCurr.setScale(0, 7);
        this.chargeBarCurr.setOrigin(0.5, 0.5);
        this.chargeBarCurr.alpha = 0.9;
        this.chargeBarCurr.setDepth(10);

        this.chargeBarAngry = this.scene.add.sprite(x, this.chargeBarMax.y, 'pixels', 'red_pixel.png');
        this.chargeBarAngry.setScale(0, 7.5);
        this.chargeBarAngry.setOrigin(0.5, 0.5);
        this.chargeBarAngry.alpha = 0.9;
        this.chargeBarAngry.setDepth(10);
        this.chargeBarAngry.visible = false;

        this.attackName = this.scene.add.bitmapText(this.x, this.chargeBarMax.y - 25, 'normal', '', 25);
        this.attackName.setDepth(10);
        this.attackName.setOrigin(0.5, 0.5);

        this.angrySymbol = this.scene.add.sprite(x, this.attackName.y + 3, 'enemies', 'angry1.png');
        this.angrySymbol.setDepth(10);
        this.angrySymbol.visible = false;
        this.angrySymbolIsHiding = true;
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
        this.scene.tweens.add({
            targets: this.sprite,
            duration: 750,
            ease: 'Quad.easeOut',
            scaleX: scale,
            scaleY: scale,
            alpha: 1
        });
    }

    initSprite(name, scale = 1, xOffset = 0, yOffset = 0) {
        this.x += xOffset;
        this.y += yOffset;
        this.sprite = this.scene.add.sprite(this.x, this.y, 'enemies', name);
        this.sprite.setDepth(0);
        this.sprite.setAlpha(0);
        this.defaultSprite = name;

        this.initSpriteAnim(scale);

        this.sprite.startScale = scale;

        this.clockLarge = this.scene.add.sprite(this.x, this.y, 'spells', 'clock_back_large_red.png');
        this.clockLarge.alpha = 0;
        this.clockLarge.setScale(0.2);
        this.clockLarge.setDepth(2);

        this.clockLargeHand = this.scene.add.sprite(this.x, this.y, 'pixels', 'red_pixel.png');
        this.clockLargeHand.alpha = 0;
        this.clockLargeHand.rotation = -0.1;
        this.clockLargeHand.setScale(4, 28);
        this.clockLargeHand.setOrigin(0.5, 1);
        this.clockLargeHand.setDepth(2);

        this.delayedDamageText = this.scene.add.bitmapText(this.x, this.y, 'block', '', 64);
        this.delayedDamageText.alpha = 0.95;
        this.delayedDamageText.setOrigin(0.5, 0.6);
        this.delayedDamageText.setDepth(2);

        this.shieldSprite = this.scene.add.sprite(this.x, this.y + 20, 'spells', 'shield.png');
        this.shieldSprite.alpha = 0.75;
        this.shieldSprite.setScale(0.5);
        this.shieldSprite.setDepth(2);
        this.shieldSprite.visible = false;

        this.shieldText = this.scene.add.bitmapText(this.x, this.y + 90, 'block', '', 48);
        this.shieldText.alpha = 0.8;
        this.shieldText.setOrigin(0.5, 0.55);
        this.shieldText.setDepth(2);
        this.shieldText.visible = false;
    }

    setSprite(name, scale) {
        let newScale = scale ? scale : 1;
        if (!this.sprite) {
            this.sprite = this.scene.add.sprite(this.x, this.y, 'enemies', name);
            this.sprite.setDepth(1);
        } else {
            newScale = scale ? scale : this.sprite.startScale;
            let oldOriginX = this.sprite.originX;
            let oldOriginY = this.sprite.originY;
            this.sprite.setFrame(name);
            this.sprite.setOrigin(oldOriginX, oldOriginY)
        }
        this.sprite.startScale = newScale;
        this.sprite.setScale(newScale * 1.02);
        this.scene.tweens.add({
            targets: this.sprite,
            duration: 300,
            scaleX: newScale,
            scaleY: newScale,
        });
    }

    setDefaultSprite(name, scale = 1) {
        this.defaultSprite = name;
        this.setSprite(name, scale);
    }

    update(dt) {
        if (this.dead) {
            return;
        }
        let timeChange = dt * gameVars.timeSlowRatio;

        if (this.storeDamage) {
            this.damageCountdown += timeChange;
            if (this.damageCountdown < 600) {
                if (this.damageCountdown > 25 && this.damageCountdown < 510) {
                    this.clockLargeHand.rotation = -(this.damageCountdown - 20) * 0.012;
                    this.clockLargeHand.alpha = 0.92;
                } else if (this.damageCountdown >= 590) {
                    // do nothing for a brief moment
                } else if (this.damageCountdown >= 510) {
                    this.clockLargeHand.rotation = -490 * 0.012 - (this.damageCountdown - 510) * 0.0044;
                    this.clockLargeHand.alpha = 1;
                } else {
                    this.clockLargeHand.alpha = 0.85;
                }
            } else {
                // disappear
                this.clockLargeHand.rotation = 0;
                this.delayedDamageText.alpha = 0;
                this.scene.tweens.add({
                    targets: [this.clockLargeHand, this.clockLarge],
                    delay: 150,
                    duration: 250,
                    scaleX: '+=0.2',
                    scaleY: '+=0.2',
                    alpha: 0,
                });
                this.storeDamage = false;
                this.takeDamage(this.accumulatedTimeDamage);
                this.accumulatedTimeDamage = 0;
            }
        }

        let chargeMult = 1;
        if (this.isAsleep) {
            return;
        }
        if (this.attackCooldown <= 0) {
            chargeMult = this.nextAttack.chargeMult ? this.nextAttack.chargeMult : 1;
            if (this.isAngry) {
                let increaseMult = Math.max(1.75, 0.3 / 1.75 * chargeMult);
                this.attackCharge += timeChange * increaseMult * this.slowMult;
            } else {
                if (gameVars.playerNotMoved && chargeMult === 1) {
                    // this.attackCharge += timeChange * 0.02 * this.slowMult;
                    this.chargeBarCurr.alpha = 0.55;
                } else {
                    this.attackCharge += timeChange * 0.25 * this.slowMult * chargeMult;
                    this.chargeBarCurr.alpha = 0.9;
                }
            }
            this.chargeBarCurr.scaleX = Math.min(this.nextAttackChargeNeeded * 0.2, this.attackCharge * 0.2 + 1);
            this.chargeBarAngry.scaleX = this.chargeBarCurr.scaleX;
            if (this.attackCharge >= this.nextAttackChargeNeeded) {
                this.useMove();
                this.chargeBarWarning.visible = true;
                this.chargeBarWarning.alpha = 0.8;
                this.chargeBarWarningBig.alpha = Math.min(0.5, this.chargeBarWarningBig.alpha + timeChange * 0.05);
            } else if (this.attackCharge >= this.nextAttackChargeNeeded * 0.9 - 30) {
                this.chargeBarWarning.visible = true;
                this.chargeBarWarning.alpha += (this.slowMult * (timeChange + 0.5)) * 0.03 * this.chargeBarWarning.alphaMult;
                this.chargeBarWarningBig.alpha = this.chargeBarWarning.alpha * 0.5 - 0.1;
                if (this.chargeBarWarning.alpha > 0.85) {
                    this.chargeBarWarning.alphaMult = -1;
                } else if (this.chargeBarWarning.alpha < 0.05) {
                    this.chargeBarWarning.alphaMult = 1;
                }
            } else if (this.attackCharge >= this.nextAttackChargeNeeded * 0.8 - 75) {
                this.chargeBarWarning.visible = true;
                this.chargeBarWarning.alpha += (this.slowMult * (timeChange + 0.5)) * 0.01 * this.chargeBarWarning.alphaMult;
                this.chargeBarWarningBig.alpha = this.chargeBarWarning.alpha * 0.4 - 0.12;
                if (this.chargeBarWarning.alpha > 0.5) {
                    this.chargeBarWarning.alphaMult = -1;
                } else if (this.chargeBarWarning.alpha < 0.04) {
                    this.chargeBarWarning.alphaMult = 1;
                }
            } else {
                this.chargeBarWarning.visible = false;
                this.chargeBarWarningBig.alpha *= 1 - 0.08 * timeChange;
            }
        } else {
            let angerRatio = this.isAngry ? 1.5 : 1;
            this.attackCooldown -= timeChange * angerRatio;
            if (this.attackCooldown <= 0) {
                this.attackCooldown = 0;
                this.readyNextAttack();
            }
        }
        this.timeSinceLastAttacked += timeChange;
        if (this.timeSinceLastAttacked < 270) {
            if (!this.isAngry) {
                this.isAngry = true;
                this.chargeBarAngry.visible = true;
                this.showAngrySymbol('angry');
                this.chargeBarCurr.visible = false;
            }
        } else if (chargeMult > 1) {
            this.chargeBarAngry.visible = true;
            this.chargeBarAngry.alpha = 0.4;
            if (chargeMult > 1.4) {
                this.showAngrySymbol('exclamation');
            }
        } else {
            this.isAngry = false;
            this.chargeBarAngry.visible = false;
            this.chargeBarCurr.visible = true;
            this.hideAngrySymbol()
        }

        if (this.slowMultDuration > 0) {
            // slow multiplier expired
            this.slowMultDuration -= timeChange;
            this.chargeBarAngry.alpha = 0.6;
            this.chargeBarCurr.alpha = 0.55;
            if (this.slowMultDuration <= 0) {
                this.slowMult = 1;
                this.chargeBarAngry.alpha = 0.9;
                this.chargeBarCurr.alpha = 0.9;
            }
        }
    }

    adjustDamageTaken(amt, isAttack, isTrue = false) {
        if (isAttack && this.statuses['mindStrike'] && amt > 0 && !isTrue) {
            this.statuses['mindStrike'].cleanUp(this.statuses);
            let damageToTake = Math.ceil(amt * 1);
            setTimeout(() => {
                this.takeTrueDamage(damageToTake);
            }, 0);
        }

        if (this.curse > 0) {
            amt += this.curse;
        }

        if (this.shield > 0) {
            if (amt < this.shield) {
                let randX = (Math.random() - 0.5) * 60;
                let randY = (Math.random() - 0.5) * 50;
                messageBus.publish('animateBlockNum', this.shieldText.x + 1 + randX, this.shieldText.y - 15 + randY, -amt, 0.5 + Math.sqrt(amt) * 0.125);
                this.shield -= amt;
                amt = 0;
                this.shieldSprite.alpha = 1;
                this.shieldSprite.setScale(0.55);
                this.scene.tweens.add({
                    targets: this.shieldSprite,
                    scaleX: 0.5,
                    scaleY: 0.5,
                    duration: 150,
                    alpha: 0.75
                });
                this.shieldText.setText(this.shield);
            } else {
                messageBus.publish('animateBlockNum', this.shieldText.x + 1, this.shieldText.y - 15, -amt, 0.5 + Math.sqrt(amt) * 0.125);
                amt -= this.shield;
                this.clearShield();
            }
        }

        return amt;
    }

    useMove() {
        if (this.health <= 0) {
            return;
        }
        this.attackCharge = 0;
        this.attackCooldown = this.delayBetweenAttacks;
        this.chargeBarCurr.alpha = 1;
        this.chargeBarAngry.alpha = 1;

        this.timeSinceLastAttacked += 150;
        if (this.nextAttack.damage !== 0) {
            this.launchAttack(this.nextAttack.attackTimes, this.nextAttack.prepareSprite, this.nextAttack.attackSprites);
        } else {
            if (this.nextAttack.message) {
                messageBus.publish(this.nextAttack.message, this.nextAttack.messageDetail);
            }
            if (this.nextAttack.attackFinishFunction) {
                this.nextAttack.attackFinishFunction();
            }
        }
        if (this.nextAttack.block) {
            messageBus.publish("enemyAddShield", this.nextAttack.block);
        }

    }

    readyNextAttack() {
        if (this.nextAttackIndex >= this.attacks[this.currentAttackSetIndex].length) {
            this.nextAttackIndex = 0;
        }
        this.nextAttack = this.attacks[this.currentAttackSetIndex][this.nextAttackIndex];
        if (!this.nextAttack) {
            console.warn("missing attack");
            this.nextAttackIndex = 0;
            this.nextAttack = this.attacks[this.currentAttackSetIndex][this.nextAttackIndex];
        }
        this.nextAttackChargeNeeded = this.nextAttack.chargeAmt || 250;
        this.nextAttackMultiples = this.nextAttack.attackMultiplier || 1;
        let atkName = this.nextAttack.name;
        if (this.nextAttack.startFunction) {
            this.nextAttack.startFunction();
        }
        this.attackName.setText(atkName);
        if (atkName.length > 5) {
            this.attackName.setScale(0.85);
        } else {
            this.attackName.setScale(1);
        }
        this.angrySymbol.x = this.attackName.x + this.attackName.width * 0.52 + 8;

        this.prepareChargeBar();
        this.nextAttackIndex++;
    }

    setSlowMult(amt = 0, duration = 90) {
        this.slowMult = amt;
        this.slowMultDuration = duration;
        if (this.chargeBarMax.visible && this.chargeBarMax.alpha > 0) {
            this.voidPause.alpha = 1;
            this.voidPause.setScale(this.chargeBarMax.scaleX, this.chargeBarMax.scaleY);
            this.scene.tweens.add({
                targets: this.voidPause,
                duration: 200,
                alpha: 0,
                scaleY: 0,
            });
            this.scene.tweens.add({
                targets: this.voidPause,
                duration: 200,
                scaleX: this.healthBarMax.scaleX + 40,
                ease: 'Quad.easeOut',
            });

        }
    }

    disruptOpponentAttackPercent(amt = 0.5) {
        let disruptAmt = this.attackCharge * amt;
        this.disruptOpponentAttack(disruptAmt);
    }

    disruptOpponentAttack(amt = 1) {
        this.attackCharge -= amt; // Math.max(0, this.attackCharge - amt);
        // if (this.attackCharge < 0) {
        //     this.nextAttackChargeNeeded -= 0.33 * this.attackCharge;
        //     this.attackCharge = 0;
        //     this.prepareChargeBar(false);
        // }

    }

    prepareChargeBar(animate = true) {
        this.chargeBarMax.visible = true;
        let chargeBarLength = Math.floor(this.nextAttackChargeNeeded * 0.2);
        this.chargeBarMax.scaleX = chargeBarLength * 0.6 + 2;
        this.chargeBarWarning.visible = false;
        this.chargeBarWarning.scaleX = chargeBarLength + 4;
        this.chargeBarCurr.scaleX = 0;
        this.chargeBarCurr.alpha = 0.9;
        this.chargeBarAngry.scaleX = 0;
        this.chargeBarAngry.alpha = 0.9;
        let extraTimeMult = 2 - gameVars.timeSlowRatio;
        if (animate) {
            this.scene.tweens.add({
                targets: this.chargeBarMax,
                scaleX: chargeBarLength + 2,
                duration: chargeBarLength * 7 * extraTimeMult,
                ease: 'Quart.easeOut'
            });
        } else {
            this.scene.tweens.add({
                targets: this.chargeBarMax,
                scaleX: chargeBarLength + 2,
                duration: 50,
                ease: 'Quart.easeOut'
            });
        }
    }

    takeEffect(newEffect) {
        this.statuses[newEffect.name] = newEffect;
        if (newEffect.name === 'timeStrike') {

        }
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
        this.clockLarge.alpha = 0.75;
        this.clockLargeHand.alpha = 0.85;
        this.clockLargeHand.rotation = -0.1;
        this.delayedDamageText.alpha = 0.95;
        this.damageCountdown = 0;
        this.storeDamage = true;
    }

    addShield(amt) {
        this.shield = amt;
        this.shieldSprite.visible = true;
        this.shieldSprite.alpha = 0.2;
        this.shieldSprite.setScale(0.55);
        this.scene.tweens.add({
            targets: this.shieldSprite,
            scaleX: 0.5,
            scaleY: 0.5,
            alpha: 0.9,
            ease: "Cubic.easeIn",
            duration: 150,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this.shieldSprite,
                    alpha: 0.75,
                    duration: 250,
                });
            }
        });
        this.shieldText.visible = true;
        this.shieldText.setScale(0.1);
        this.shieldText.setText(this.shield);
        this.scene.tweens.add({
            targets: this.shieldText,
            scaleX: 0.7 + amt * 0.003,
            scaleY: 0.7 + amt * 0.003,
            ease: 'Back.easeOut',
            duration: 250,
        });
    }

    increaseCurse(amt = 1) {
        this.curse += amt;
    }

    clearShield() {
        this.shield = 0;
        this.shieldSprite.alpha = 1;
        this.scene.tweens.add({
            targets: this.shieldSprite,
            scaleX: 0.6,
            scaleY: 0.6,
            duration: 100,
            alpha: 0,
            onComplete: () => {
                this.shieldSprite.visible = false;
            }
        });

        this.shieldText.setText(0);
        this.scene.tweens.add({
            targets: this.shieldText,
            scaleX: 0,
            scaleY: 0,
            duration: 100,
            onComplete: () => {
                this.shieldText.visible = false;
            }
        });
    }

    handleSpecialDamageAbsorption(amt) {
        return amt;
    }

    takeDamage(amt, isAttack = true) {
        let origHealth = this.health;
        // if (this.storeDamage) {
        //     // time storage
        //     this.accumulatedTimeDamage += amt;
        //     let clockLargeGoalScale = 0.15 + Math.sqrt(this.accumulatedTimeDamage) * 0.018;
        //     this.clockLarge.setScale(clockLargeGoalScale * 1.02);
        //     this.clockLargeHand.setScale(this.clockLarge.scaleX * 20, this.clockLarge.scaleY * 140);
        //     this.delayedDamageText.setText(this.accumulatedTimeDamage);
        //     this.delayedDamageText.setScale(this.clockLarge.scaleX * 3 + 0.1);
        //
        //     this.scene.tweens.add({
        //         targets: this.clockLarge,
        //         scaleX: clockLargeGoalScale,
        //         scaleY: clockLargeGoalScale,
        //         ease: "Cubic.easeOut",
        //         duration: 100 + amt * 5
        //     });
        //
        //     this.scene.tweens.add({
        //         targets: this.delayedDamageText,
        //         scaleX: this.clockLarge.scaleX * 3,
        //         scaleY: this.clockLarge.scaleX * 3,
        //         ease: "Cubic.easeOut",
        //         duration: 100 + amt * 5
        //     });
        //     amt = 0;
        // }

        let damageTaken = this.adjustDamageTaken(amt, isAttack);
        if (this.specialDamageAbsorptionActive) {
            damageTaken = this.handleSpecialDamageAbsorption(damageTaken);
        }
        this.setHealth(Math.max(0, this.health - damageTaken));
        let healthLoss = origHealth - this.health;
        if (healthLoss > 0) {
            this.animateShake();
            this.animateDamageNum(healthLoss, undefined, this.damageNumOffset);
        }
        if (isAttack) {
            this.timeSinceLastAttacked = 0;
        }

        this.updateHealthBar();

        if (this.health <= 0) {
            this.die();
        }
    }

    updateHealthBar(isHealing) {
        if (this.health <= 0) {
            this.healthBarCurr.scaleX = 0;
        } else {
            let healthBarRatio = 1 + this.healthBarLengthMax * this.health / this.healthMax;
            this.healthBarCurr.scaleX = healthBarRatio;
        }
        this.healthBarText.setText(this.health);
    }


    takeTrueDamage(amt, isAttack = true, extraOffsetY = 0) {
        let origHealth = this.health;
        if (this.storeDamage) {
            // time storage
            this.accumulatedTimeDamage += amt;
            this.clockLarge.setScale(0.18 + Math.sqrt(this.accumulatedTimeDamage) * 0.01);
            this.clockLargeHand.setScale(this.clockLarge.scaleX * 20, this.clockLarge.scaleY * 140);
            this.delayedDamageText.setText(this.accumulatedTimeDamage);
            this.delayedDamageText.setScale(this.clockLarge.scaleX * 3 + 0.1);
            this.scene.tweens.add({
                targets: this.delayedDamageText,
                scaleX: this.clockLarge.scaleX * 3,
                scaleY: this.clockLarge.scaleX * 3,
                ease: "Cubic.easeOut",
                duration: 100 + amt * 5
            });

            amt = 0;
        }
        let damageTaken = this.adjustDamageTaken(amt, isAttack, true);
        this.setHealth(Math.max(0, this.health - damageTaken));
        let healthLoss = origHealth - this.health;
        if (healthLoss > 0) {
            this.animateShake();
            let offsetY = -damageTaken * 0.1 + extraOffsetY;
            this.animateDamageNum(healthLoss, true, offsetY);
            if (isAttack) {
                this.timeSinceLastAttacked = 0;
            }
        }
        this.updateHealthBar();

        if (this.health <= 0) {
            this.die();
        }
    }

    setHealth(newHealth) {
        this.prevHealth = this.health;
        this.health = newHealth;
    }

    takeDamagePercent(amt, bonusDamage = 0) {
        let origHealth = this.health;
        let timeUpdatedHealth = origHealth - this.accumulatedTimeDamage;
        let healthRemoved = Math.ceil(amt * 0.01 * timeUpdatedHealth) + bonusDamage;
        this.takeDamage(healthRemoved);
    }

    takeDamagePercentTotal(amt, bonusDamage = 0) {
        let origHealth = this.healthMax;
        let healthRemoved = Math.ceil(amt * origHealth) + bonusDamage;
        this.takeDamage(healthRemoved);
    }

    setAsleep() {
        this.isAsleep = true;
        this.chargeBarWarning.visible = false;
        this.chargeBarWarningBig.visible = false;
        this.chargeBarAngry.visible = false;
        this.chargeBarWarning.visible = false;
        this.hideAngrySymbol()
        PhaserScene.tweens.add({
            targets: [this.chargeBarCurr],
            alpha: 0,
            duration: 400,
        });

        PhaserScene.tweens.add({
            targets: [this.chargeBarMax, this.chargeBarCurr],
            scaleX: 0,
            ease: "Cubic.easeOut",
            duration: 400,
        });
        this.attackName.visible = false;
    }

    hideAngrySymbol() {
        if (!this.angrySymbolIsHiding) {
            this.angrySymbolIsHiding = true;
            this.angrySymbolAnim = PhaserScene.tweens.add({
                targets: [this.angrySymbol],
                scaleX: 0,
                scaleY: 0,
                ease: "Cubic.easeIn",
                duration: 200,
                onComplete: () => {
                    this.angrySymbol.visible = false;
                }
            });
        }
    }

    showAngrySymbol(state) {
        if (this.angrySymbol.currAnim !== state) {
            console.log("change state angry symbol");
            this.angrySymbol.currAnim = state;
            this.angrySymbol.play(state);
        }
        if (this.angrySymbolIsHiding) {
            this.angrySymbolIsHiding = false;
            if (this.angrySymbolAnim) {
                this.angrySymbolAnim.stop();
            }
            this.scene.tweens.add({
                targets: this.angrySymbol,
                scaleX: 0.6,
                scaleY: 0.6,
                duration: 200,
                ease: 'Back.easeOut',
            });
            this.angrySymbol.visible = true;
        }
    }

    destroy() {
        this.healthBarMax.destroy();
        this.healthBarCurr.destroy();
        this.healthBarText.destroy();

        this.chargeBarWarningBig.destroy();
        this.chargeBarMax.destroy();
        this.chargeBarWarning.destroy();
        this.chargeBarAngry.destroy();
        this.chargeBarCurr.destroy();
        this.voidPause.destroy();
        this.attackName.destroy();
        this.angrySymbol.destroy();

        this.sprite.destroy();

        this.clockLarge.destroy();
        this.clockLargeHand.destroy();
        this.delayedDamageText.destroy();
        this.shieldSprite.destroy();
        this.shieldText.destroy();

        for (let i = 0; i < this.destructibles.length; i++) {
            this.destructibles[i].destroy();
        }

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
        // undo any time magic
        globalObjects.magicCircle.setTimeSlowRatio(1);
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
        this.hideAngrySymbol()
        this.voidPause.visible = false;

        this.attackName.visible = false;
        messageBus.publish('enemyHasDied');

        for (let i in this.statuses) {
            let status = this.statuses[i];
            if (status == null) {
                continue;
            }
            status.cleanUp(this.statuses);
            delete this.statuses[i];
        }

        PhaserScene.time.delayedCall(750, () => {
            PhaserScene.tweens.add({
                targets: [this.chargeBarCurr],
                scaleX: 0,
                ease: "Cubic.easeOut",
                duration: 400,
                 onComplete: () => {
                     PhaserScene.tweens.add({
                         targets: [this.chargeBarMax],
                         scaleX: 0,
                         ease: "Cubic.easeOut",
                         duration: 400,
                         onComplete: () => {
                             PhaserScene.tweens.add({
                                 targets: [this.healthBarMax],
                                 scaleX: 0,
                                 duration: 1000
                             });
                             PhaserScene.tweens.add({
                                 delay: 400,
                                 targets: [this.healthBarText],
                                 alpha: 0,
                                 duration: 300
                             });
                         }
                     });
                 }
            });
        });
    }

    animateShake(amt = 1) {
        this.sprite.x -= 4;
        let extraTimeMult = 2 - gameVars.timeSlowRatio;
        PhaserScene.tweens.add({
            targets: this.sprite,
            x: this.x + 3 * amt,
            ease: "Quad.easeOut",
            duration: 100 * extraTimeMult,
            onComplete: () => {
                PhaserScene.tweens.add({
                    targets: this.sprite,
                    x: this.x - 2 * amt,
                    ease: "Cubic.easeInOut",
                    duration: 100 * extraTimeMult,
                    onComplete: () => {
                        PhaserScene.tweens.add({
                            targets: this.sprite,
                            x: this.x,
                            ease: "Cubic.easeInOut",
                            duration: 60 * extraTimeMult
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
                duration: 100 * extraTimeMult,
                onComplete: () => {
                    PhaserScene.tweens.add({
                        targets: currSprite,
                        x: this.x - 2 * amt + currSprite.startOffsetX,
                        ease: "Cubic.easeInOut",
                        duration: 100 * extraTimeMult,
                        onComplete: () => {
                            PhaserScene.tweens.add({
                                targets: currSprite,
                                x: this.x + currSprite.startOffsetX,
                                ease: "Cubic.easeInOut",
                                duration: 60 * extraTimeMult
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
            messageBus.publish("animateTrueDamageNum", this.x + randX, 100 + randY + offsetY, '-' + val, scale);
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
    }

    triggerVoidFeedback() {

    }

    launchAttack(attackTimes = 1, prepareSprite, attackSprites = [], isRepeatedAttack = false) {
        if (this.dead){
            return;
        }
        let extraTimeMult = 2 - gameVars.timeSlowRatio;
        if (prepareSprite) {
            this.setSprite(prepareSprite, this.sprite.startScale);
        }
        if (this.nextAttack.attackStartFunction) {
            this.nextAttack.attackStartFunction();
        }
        let pullbackScale = this.pullbackScale * this.sprite.startScale;
        this.attackAnim = this.scene.tweens.add({
            targets: this.sprite,
            scaleX: pullbackScale,
            scaleY: pullbackScale,
            rotation: 0,
            duration: isRepeatedAttack ? 200 * extraTimeMult : 300 * extraTimeMult,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                if (this.dead){
                    return;
                }
                if (!prepareSprite) {
                    this.setSprite(this.defaultSprite);
                    this.sprite.setScale(pullbackScale);
                }
                let attackScale = this.attackScale * this.sprite.startScale
                this.attackAnim = this.scene.tweens.add({
                    targets: this.sprite,
                    scaleX: attackScale,
                    scaleY: attackScale,
                    duration: isRepeatedAttack ? 300 * extraTimeMult : 350 * extraTimeMult,
                    rotation: 0,
                    ease: 'Cubic.easeIn',
                    onComplete: () => {
                        if (this.dead){
                            return;
                        }
                        if (!isRepeatedAttack) {
                            messageBus.publish("enemyMadeAttack");
                        }
                        this.triggerVoidFeedback();
                        if (this.dead){
                            return;
                        }
                        if (attackSprites.length > 0) {
                            if (this.sprite.attackNum === undefined) {
                                this.sprite.attackNum = 0;
                            } else {
                                this.sprite.attackNum = (this.sprite.attackNum + 1) % attackSprites.length;
                            }
                            this.setSprite(attackSprites[this.sprite.attackNum], this.sprite.startScale);
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
                            this.launchAttack(attackTimes - 1, prepareSprite, attackSprites, true);
                        } else {
                            this.attackAnim = this.scene.tweens.add({
                                targets: this.sprite,
                                scaleX: this.sprite.startScale,
                                scaleY: this.sprite.startScale,
                                rotation: 0,
                                duration: 500 * extraTimeMult,
                                ease: 'Cubic.easeInOut'
                            });
                            setTimeout(() => {
                                if (!this.dead) {
                                    this.setSprite(this.defaultSprite);
                                }
                            }, 500 * extraTimeMult * 0.65);
                        }
                    }
                });
            }
        });
    }

    getMaxHealth() {
        return this.healthMax;
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
}
