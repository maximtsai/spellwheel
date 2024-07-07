class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.initStats(x, y);
        this.resetStats();
        this.createHealthBar(x, y + 0.5);
        this.createMisc();
        this.subscriptions = [
            messageBus.subscribe("selfTakeEffect", this.takeEffect.bind(this)),
            messageBus.subscribe("selfTakeEnemyEffect", this.takeEnemyEffect.bind(this)),
            messageBus.subscribe("selfTakeDamage", this.takeDamage.bind(this)),
            messageBus.subscribe("selfHeal", this.selfHeal.bind(this)),
            messageBus.subscribe("selfHealPercent", this.selfHealPercent.bind(this)),
            messageBus.subscribe("selfHealDelayPercent", this.selfHealDelayPercent.bind(this)),

            messageBus.subscribe("selfHealRecent", this.selfHealRecent.bind(this)),

            messageBus.subscribe("selfTakeTrueDamage", this.takeTrueDamage.bind(this)),
            messageBus.subscribe('clearSpellMultiplier', this.clearSpellMultiplier.bind(this)),
            messageBus.subscribe('clearAttackMultiplier', this.clearAttackMultiplier.bind(this)),
            messageBus.subscribe('clearDamageAdder', this.clearDamageAdder.bind(this)),

            messageBus.subscribe('startVoidForm', this.handleVoidForm.bind(this)),
            messageBus.subscribe('stopVoidForm', this.clearVoidForm.bind(this)),
            messageBus.subscribe('enemyMadeAttack', this.enemyMadeAttack.bind(this)),
            messageBus.subscribe("selfClearEffect", this.clearSpecificEffect.bind(this)),

            messageBus.subscribe("spellClicked", this.incrementSpellsCast.bind(this)),
            messageBus.subscribe("enemyHasDied", this.clearAllEffects.bind(this)),
            messageBus.subscribe("wheelReloaded", this.incrementMindReinforceStatus.bind(this)),

        ];
        updateManager.addFunction(this.update.bind(this));
        // Handles weird phaser initial lag issue. TODO: replace with something else later
        this.bleedObj = this.scene.add.sprite(x, y, 'pixels', 'red_pixel.png');
        this.bleedObj.alpha = 0.001;
        this.scene.tweens.add({
            targets: this.bleedObj,
            duration: 1,
            scaleX: 1000,
            scaleY: 1000,
        });
    }

    initStats(x, y) {
        this.x = x;
        this.y = y;
        this.reInitStats();
    }

    reInitStats() {
        let maxHealth = 80;
        if (cheats.extraHealth) {
            maxHealth += 1000;
        }
        if (cheats.extraExtraHealth) {
            maxHealth += 80;
        }
        this.trueHealthMax = maxHealth;
        console.log(this.trueHealthMax);
        this.healthMax = this.trueHealthMax;
        this.health = this.healthMax;
        this.lastInjuryHealth = this.healthMax;
        this.recentlyTakenDamageAmt = 0;
        this.recentlyTakenDelayedDamageAmt = 0;
        this.playerCastSpells = 0;
        this.statuses = {};
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getStatuses() {
        return this.statuses;
    }

    getHealth() {
        return this.health;
    }

    getHealthMax() {
        return this.healthMax;
    }

    setHealth(amt = 80) {
        console.log("Setting health to ", amt);
        this.health = amt;
        this.refreshHealthBar();
    }

    setHealthMaxTemp(amt = 80) {
        this.healthMax = amt;
        this.refreshHealthBar();
    }

    incrementSpellsCast() {
        this.playerCastSpells++;
        let timeFreezeStatus = this.statuses['timeUnload'];
        if (timeFreezeStatus) {
            timeFreezeStatus.turns--;
            timeFreezeStatus.displayAmt = timeFreezeStatus.turns;

            if (timeFreezeStatus.turns <= 0) {
                messageBus.publish("selfClearStatuses", 'timeUnload');
            } else {
                messageBus.publish('selfTakeEffect', timeFreezeStatus);
            }
        }
        messageBus.publish("playerCastedSpell");
    }

    spellMultiplier() {
        if (this.statuses['mindUnload']) {
            return this.statuses['mindUnload'].multiplier ? this.statuses['mindUnload'].multiplier : 3;
        } else {
            return 1;
        }
    }

    attackEnhanceMultiplier() {
        if (this.statuses['timeEnhance']) {
            return this.statuses['timeEnhance'].multiplier ? this.statuses['timeEnhance'].multiplier : 2;
        } else {
            return 1;
        }
    }

    attackDamageAdder() {
        const flatDamage = 6;
        let addedAmt = 0;
        let matterEnhanceStatus = this.statuses['matterEnhance'];
        if (matterEnhanceStatus) {
            let multiplier = matterEnhanceStatus.multiplier ? matterEnhanceStatus.multiplier : 1;
            let damageBoost = multiplier * flatDamage;
            addedAmt += damageBoost
        }
        let mindReinforceStatus = this.statuses['mindReinforce'];
        if (mindReinforceStatus) {
            let additionalAmt = mindReinforceStatus.displayAmt || 0;
            addedAmt += additionalAmt;
        }
        return addedAmt;
    }

    incrementMindReinforceStatus() {
        // let mindReinforceStatus = this.statuses['mindReinforce'];
        // if (mindReinforceStatus) {
        //     mindReinforceStatus.displayAmt += mindReinforceStatus.multiplier;
        //     messageBus.publish('selfTakeEffect', mindReinforceStatus);
        //     let param = {
        //         duration: 1000,
        //     }
        //     let param2 = {
        //         alpha: 0,
        //         scaleX: 1,
        //         scaleY: 1
        //     }
        //     messageBus.publish('animateTrueDamageNum', gameConsts.halfWidth, globalObjects.player.getY() - 50, "+" + mindReinforceStatus.displayAmt + " DAMAGE", 1 + mindReinforceStatus.displayAmt * 0.15, param, param2);
        //
        // }
    }

    clearSpellMultiplier() {
        if (this.statuses['mindUnload']) {
            this.statuses['mindUnload'].cleanUp(this.statuses);
            this.statuses['mindUnload'] = null;
        }
        globalObjects.magicCircle.setAuraAlpha(0.02);
    }

    clearAttackMultiplier() {
        if (this.statuses['timeEnhance']) {
            this.statuses['timeEnhance'].cleanUp(this.statuses);
            this.statuses['timeEnhance'] = null;
        }
    }

    clearDamageAdder() {
        if (this.statuses['matterEnhance']) {
            this.statuses['matterEnhance'].cleanUp(this.statuses);
            this.statuses['matterEnhance'] = null;
        }
    }

    createHealthBar(x, y) {
        this.healthBarReady = true;
        this.barAssetsGrey = [];
        this.barAssetsLarge = [];
        this.barAssetsSmall = [];
        for (let i = 0; i < 3; i++) {
            let healthBar = this.scene.add.sprite(x, y - 0.5, 'circle', 'healthbar_quarter.png');
            healthBar.setDepth(9997);
            healthBar.rotation = Math.PI * (0.75 - 0.5 * i);
            healthBar.visible = false;
            //healthBar.setScale(0.999, 0.999);
            this.barAssetsGrey.push(healthBar);
        }
        this.healthBarTiny = this.scene.add.sprite(x, y - 0.5, 'circle', 'healthbar_tiny.png').setDepth(9998);
        this.healthBarTiny.setRotation(Math.PI * 0.85).setScale(1);

        for (let i = 0; i < 3; i++) {
            let healthBar = this.scene.add.sprite(x, y - 0.5, 'circle', 'healthbar_quarter.png');
            healthBar.setDepth(9997);
            healthBar.rotation = Math.PI * (1.25 + 0.5 * i) + 0.01;
            //healthBar.setScale(0.999, 0.999);
            this.barAssetsLarge.push(healthBar);
        }

        for (let i = 0; i < 4; i++) {
            let healthBar = this.scene.add.sprite(x, y - 0.5, 'circle', 'healthbar_sixteenth.png').setDepth(9998);
            healthBar.rotation = Math.PI * (0.882 + i * 0.125);
            healthBar.visible = true;
            this.barAssetsSmall.push(healthBar);
        }

        let healthBarEnd = this.scene.add.sprite(x, y - 0.5, 'circle', 'healthbar_end.png').setDepth(9998);

        this.healthBarPeak = this.scene.add.sprite(x, y - 0.5, 'circle', 'healthbar_tip.png');
        this.healthBarPeak.setDepth(9998);
        this.healthBarPeak.rotation = Math.PI * (0.75 + 1.5);
        this.healthBarPeak.setScale(1, 1);
        this.healthBarPeak.visible = true;

        this.healthText = this.scene.add.text(x, y + 38, 'HP ' + this.health + '/' + this.healthMax, {fontFamily: 'Arial', fontSize: isMobile ? 25 : 21, color: '#040404', align: 'left'});
        this.healthText.setAlpha(0.7);
        this.healthText.setFontStyle('bold')
        this.healthText.setTint(0x000000);
        this.healthText.setOrigin(0.5, 0.5);
        this.healthText.setDepth(9998);
    }

    createMisc() {
        this.hurtIndicator = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.height + 40, 'enemies', 'warning.png').setRotation(Math.PI).setScale(100, 1).setAlpha(0).setDepth(-1);
        this.deadBG = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight, 'pixels', 'grey_pixel.png').setDepth(20).setAlpha(0).setScale(500);
    }

    showHurt(dmg, emergency) {
        let emergencyMult = emergency ? 1 : 0;
        let multAmt = 1;
        if (dmg <= 1) {
            multAmt = 0.75;
        }
        if (this.hurtTween) {
            this.hurtTween.stop();
        }
        this.hurtIndicator.setAlpha(multAmt * 0.75 + dmg * 0.006 + emergencyMult * 0.4 + this.hurtIndicator.alpha + 0.04);
        this.hurtIndicator.setScale(100, multAmt * 2 + dmg * 0.03 + emergencyMult + this.hurtIndicator.scaleY + 0.02);
        this.hurtTween = this.scene.tweens.add({
            targets: this.hurtIndicator,
            duration: Math.floor((650 + dmg * 3 + emergencyMult * 300) * multAmt),
            scaleY: 1.5,
            alpha: 0,
        });
        if (emergency && !this.recentlyGasped) {
            this.recentlyGasped = true;
            playSound('emergency');
            setTimeout(() => {
                this.recentlyGasped = false;
            }, 20000);
        }
    }

    refreshHealthBar(overrideHealth) {
        let healthRatio = overrideHealth || this.health / this.healthMax;
        this.healthText.setText('HP ' + this.health + '/' + this.healthMax);
        this.healthBarPeak.rotation = Math.PI * (0.75 + 1.5 * healthRatio);
        if (this.healthBarPeak.rotation < 2.5 && this.healthBarPeak.rotation > 1.8) {
            this.healthBarPeak.rotation = 2.5;
        }
        let drawStartSpot = 0;
        this.healthBarPeak.visible = true;
        if (healthRatio < 0.341) {
            drawStartSpot = 0.334 - healthRatio;
            for (let i = 0; i < 3; i++) {
                let healthBar = this.barAssetsLarge[i];
                healthBar.visible = false;
            }
            for (let i = 0; i < this.barAssetsSmall.length; i++) {
                let healthBarSmall = this.barAssetsSmall[i];
                healthBarSmall.visible = true;
            }
            if (healthRatio < 0.0001) {
                // basically dead
                for (let i = 0; i < this.barAssetsSmall.length; i++) {
                    let healthBarSmall = this.barAssetsSmall[i];
                    healthBarSmall.visible = false;
                }
                this.healthBarTiny.visible = false;
                this.healthBarPeak.visible = false;
            } else if (healthRatio < 0.09) {
                for (let i = 0; i < this.barAssetsSmall.length; i++) {
                    let healthBarSmall = this.barAssetsSmall[i];
                    healthBarSmall.visible = false;
                }
                if (healthRatio > 0.055) {
                    this.healthBarTiny.setRotation(Math.PI * 0.918 - drawStartSpot * 0.35 * Math.PI);
                    this.healthBarTiny.visible = true;
                } else {
                    this.healthBarTiny.visible = false;
                }
            } else if (healthRatio < 0.171) {
                for (let i = 1; i < this.barAssetsSmall.length - 1; i++) {
                    let healthBarSmall = this.barAssetsSmall[i];
                    healthBarSmall.visible = false;
                }
                this.barAssetsSmall[this.barAssetsSmall.length - 1].rotation = Math.PI * (0.882 + 3 * 0.125 - drawStartSpot * 0.5 * Math.PI) - 0.01;
            } else if (healthRatio < 0.256) {
                for (let i = 2; i < this.barAssetsSmall.length - 1; i++) {
                    let healthBarSmall = this.barAssetsSmall[i];
                    healthBarSmall.visible = false;
                }
                this.barAssetsSmall[this.barAssetsSmall.length - 1].rotation = Math.PI * (0.882 + 3 * 0.125 - drawStartSpot * 0.5 * Math.PI) - 0.01;
            } else {
                this.barAssetsSmall[this.barAssetsSmall.length - 1].rotation = Math.PI * (0.882 + 3 * 0.125 - drawStartSpot * 0.5 * Math.PI) - 0.01;
            }

        } else if (healthRatio < 0.671) {
            drawStartSpot = 0.667 - healthRatio;
            for (let i = 1; i < 3; i++) {
                let healthBar = this.barAssetsLarge[i];

                if (i == 1) {
                    healthBar.visible = true;
                    healthBar.rotation = Math.PI * (0.25 - 0.5 * i - drawStartSpot * 0.5 * Math.PI) - 0.01;
                } else {
                    healthBar.visible = false;
                }
            }
        } else if (healthRatio < 1) {
            drawStartSpot = 1 - healthRatio;
            for (let i = 0; i < 3; i++) {
                let healthBar = this.barAssetsLarge[i];
                healthBar.visible = true;
                if (i >= 1) {
                    healthBar.rotation = Math.PI * (0.75 - 0.5 * i - drawStartSpot * 0.5 * Math.PI) - 0.01;
                }
            }
        } else {
            // max health
            for (let i = 0; i < 3; i++) {
                let healthBar = this.barAssetsLarge[i];
                healthBar.visible = true;
                healthBar.rotation = Math.PI * (1.25 + 0.5 * i) + 0.01;
            }
            this.healthBarPeak.visible = false;
        }
    }

    resetStats() {
        this.healthMax = this.trueHealthMax;
        this.health = this.healthMax;
        this.playerCastSpells = 0;
        this.timeExhaustion = 0;
        this.lastInjuryHealth = this.healthMax;
        this.recentlyTakenDamageAmt = 0;
        this.recentlyTakenDelayedDamageAmt = 0;
        this.clearAllEffects();
        if (this.healthBarReady) {
            this.refreshHealthBar();
        }
    }


    update(dt) {
        // let dtTimeAltered = dt * gameVars.timeSlowRatio;
        // for (let statusName in this.statuses) {
        //     let status = this.statuses[statusName]
        //     if (status == null) {
        //         continue;
        //     }
        //     status.duration -= dtTimeAltered;
        //     if (status.duration <= 0) {
        //         if (status.cleanUp) {
        //             status.cleanUp(this.statuses);
        //         }
        //         this.statuses[statusName] = null;
        //     }
        // }
        if (this.blackBalls) {
            for (let i = 0; i < this.blackBalls.length - 3; i++) {
                if (this.blackBalls[i].origX) {
                    let newOffsetX = (Math.random() - 0.5) * 2;
                    let newOffsetY = (Math.random() - 0.5) * 1.88;
                    this.blackBalls[i].x = this.blackBalls[i].origX * 0.05 + this.blackBalls[i].x * 0.95 + newOffsetX;
                    this.blackBalls[i].y = this.blackBalls[i].origY * 0.05 + this.blackBalls[i].y * 0.95 + newOffsetY;
                }
            }
        }
    }

    handleVoidForm(balls) {
        this.blackBalls = balls;
        for (let i = 0; i < this.blackBalls.length; i++) {
            this.blackBalls[i].origX = this.blackBalls[i].x;
            this.blackBalls[i].origY = this.blackBalls[i].y;
        }
    }

    getPlayerCastSpellsCount() {
        return this.playerCastSpells;
    }

    getPlayerTimeExhaustion() {
        return this.timeExhaustion;
    }

    incrementTimeExhaustion() {
        this.timeExhaustion++;
    }

    clearVoidForm() {
        this.blackBalls = null;
    }

    adjustDamageTaken(amt) {
        return amt;
    }

    takeEffect(newEffect) {
        this.statuses[newEffect.name] = newEffect;
    }

    clearSpecificEffect(effect) {
        if (this.statuses[effect]) {
            this.statuses[effect].cleanUp(this.statuses);
        }
    }

    clearAllEffects() {
        for (let effect in this.statuses) {
            if (this.statuses[effect]) {
                this.statuses[effect].cleanUp(this.statuses);
            }
        }
        this.statuses = {};

        messageBus.publish('selfClearStatuses');
    }

    takeEnemyEffect(newEffect) {
        if (this.statuses['voidProtect']) {
            this.statuses['voidProtect'].cleanUp(this.statuses);
            return;
        }
        this.statuses[newEffect.name] = newEffect;
        zoomTemp(1.006);
    }

    enemyMadeAttack(damage) {
        this.canResetRecentDamage = true;
    }

    addRecentlyTakenDamage(amt) {
        this.recentlyTakenDamageAmt += amt;
    }

    addRecentlyTakenDelayedDamage(amt) {
        this.recentlyTakenDelayedDamageAmt += amt;
    }

    getRecentlyTakenDamageAmt() {
        return this.recentlyTakenDamageAmt + this.recentlyTakenDelayedDamageAmt;
    }

    takeDamage(amt, isTime = false) {
        if (globalObjects.currentEnemy.dead) {
            return;
        }
        if (this.blackBalls) {
            return;
        }
        if (amt < 0) {
            amt = 0;
        }
        let actualAmt = this.handleDamageStatuses(amt);
        let origHealth = this.health;
        let damageTaken = this.adjustDamageTaken(actualAmt);
        if (damageTaken >= 1 && !isTime) {
            if (this.canResetRecentDamage) {
                this.canResetRecentDamage = false;
                this.lastInjuryHealth = origHealth;
                this.recentlyTakenDamageAmt = 0;
                this.recentlyTakenDelayedDamageAmt = 0;
            }

            this.recentlyTakenDamageAmt += damageTaken;

            this.bleedObj.alpha = Math.sqrt(damageTaken) * 0.04;
            this.scene.tweens.add({
                targets: this.bleedObj,
                duration: 250,
                alpha: 0,
                ease: 'Quad.easeOut'
            });
        } else if (damageTaken === undefined) {
            return;
        }

        if (globalObjects.currentEnemy.dead) {
            return;
        }
        this.health = Math.max(0, this.health - damageTaken);
        if (damageTaken >= 1) {
            let isEmergency = origHealth > this.healthMax * 0.2 && this.health < this.healthMax * 0.2;
            this.showHurt(damageTaken, isEmergency);
        }
        this.animateHealthChange(-damageTaken);
        this.refreshHealthBar();
        if (this.health <= 0) {
            this.die();
        }
    }

    selfHeal(amt) {
        let overflow = 0;
        let newHealthAmt = this.health + amt;
        if (newHealthAmt > this.healthMax) {
            overflow = newHealthAmt - this.healthMax;
        }
        this.health = Math.min(this.healthMax, newHealthAmt);
        // if (timeOverflow) {
        //     messageBus.publish('playerReduceDelayedDamage', overflow);
        // }
        this.animateHealthChange(amt);
        this.refreshHealthBar();
        return overflow;
    }

    selfHealPercent(percent) {
        let healthToHeal = Math.ceil((this.healthMax - this.health) * percent * 0.01);
        this.selfHeal(healthToHeal);
    }

    selfHealDelayPercent(percent = 0.5) {
        let delayedHealAmt = Math.ceil(percent * globalObjects.magicCircle.delayedDamage);
        messageBus.publish('playerReduceDelayedDamage', delayedHealAmt);
    }

    selfHealRecent(percent = 0.5) {
        let maxHealAmt = this.lastInjuryHealth - this.health;

        let healAmt = Math.ceil(percent * (this.recentlyTakenDamageAmt + this.recentlyTakenDelayedDamageAmt));
        console.log("healAmt Initial: ", healAmt);
        this.recentlyTakenDamageAmt = this.recentlyTakenDamageAmt - healAmt;
        if (this.recentlyTakenDamageAmt < 0) {
            this.recentlyTakenDelayedDamageAmt -= Math.abs(this.recentlyTakenDamageAmt);
            this.recentlyTakenDamageAmt = 0;
        }
        let overflowHeal = 0;
        if (healAmt > maxHealAmt) {
            overflowHeal = healAmt - maxHealAmt;
            // this.recentlyTakenDelayedDamageAmt -= overflowHeal;
            healAmt = maxHealAmt;
        }
        console.log("healAmt actual: ", healAmt);
        this.selfHeal(healAmt, false);
        let delayedDamageRemaining = globalObjects.magicCircle.getDelayedDamage() - overflowHeal;
        let delayedDamageReduced = Math.ceil(delayedDamageRemaining * 0.5);
        overflowHeal += Math.ceil(delayedDamageRemaining * 0.5);
        this.recentlyTakenDelayedDamageAmt -= delayedDamageReduced;

        //let delayedHealAmt = Math.ceil(percent * this.recentlyTakenDelayedDamageAmt);
        //let remainingDelayedHealth = Math.max(0, globalObjects.magicCircle.delayedDamage - delayedHealAmt);
        //recentlyTakenDelayedDamageAmt -= delayedHealAmt;
        //let healableDelayedDamage = globalObjects.magicCircle.delayedDamage - healAmt;

        // let delayedDamageHealed = overflowHeal + Math.max(0, Math.ceil((healableDelayedDamage) * percent))
        if (overflowHeal > 0) {
            console.log("overflow heal: ", overflowHeal);
            messageBus.publish('playerReduceDelayedDamage', overflowHeal);
        }
        setTimeout(() => {
            this.recentlyTakenDamageAmt = 0;
        }, 250)
    }

    takeTrueDamage(amt) {
        this.health = Math.max(0, this.health - amt);
        this.animateHealthChange(-amt);
        this.refreshHealthBar();
        this.showHurt(1, false);
        if (this.health <= 0) {
            this.die();
        }
    }

    handleDamageStatuses(amt) {
        let hurtAmt = amt;

        let playerStatuses = this.getStatuses();
        let shieldObjects = [];

        if (this.statuses['voidReinforce']) {
            hurtAmt = 0;

            let blackBall = this.scene.add.sprite(gameConsts.halfWidth, globalObjects.player.getY() - 190, 'spells', 'blackCircleLarge.png').setDepth(997).setScale(0.3);
            let blackBall2 = this.scene.add.sprite(gameConsts.halfWidth, globalObjects.player.getY() - 190, 'spells', 'blackCircleLarge.png').setDepth(997).setScale(0.3);
            let xShift = (Math.random() - 0.5) * 150;
            let yShift = Math.random() * 100;
            this.scene.tweens.add({
                targets: [blackBall, blackBall2],
                duration: 600,
                scaleX: 0,
                scaleY: 0,
                y: "-=" + yShift,
                x: "+=" + xShift,
                ease: 'Quad.easeOut',
                onComplete: () => {
                    blackBall.destroy();
                    blackBall2.destroy();
                }
            });
        }
        if (this.statuses['matterUnload']) {
            let shieldedDamage = 0;
            if (this.statuses['matterUnload'].health > hurtAmt) {
                this.statuses['matterUnload'].health = this.statuses['matterUnload'].health - hurtAmt;
                shieldedDamage = hurtAmt;
                hurtAmt = 0;
                this.statuses['matterUnload'].animObj[1].setText(this.statuses['matterUnload'].health);
                this.statuses['matterUnload'].animObj[1].setScale(1.3);
                this.scene.tweens.add({
                    targets: this.statuses['matterUnload'].animObj[1],
                    duration: 250,
                    scaleX: 1,
                    scaleY: 1,
                    ease: 'Quad.easeOut'
                });
                this.statuses['matterUnload'].animObj[0].y += 3;
                this.scene.tweens.add({
                    targets: this.statuses['matterUnload'].animObj[0],
                    duration: 250,
                    y: "-=3",
                    ease: 'Cubic.easeOut'
                });
                messageBus.publish('animateBlockNum', gameConsts.halfWidth, gameConsts.halfHeight + 40, 'BLOCKED', 1.2);

            } else {
                hurtAmt = hurtAmt - this.statuses['matterUnload'].health;
                shieldedDamage = this.statuses['matterUnload'].health;
                this.statuses['matterUnload'].health = 0;
                this.statuses['matterUnload'].animObj[1].setScale(1.1);
                this.statuses['matterUnload'].animObj[1].setText(this.statuses['matterUnload'].health);
                this.statuses['matterUnload'].cleanUp(this.statuses);
                messageBus.publish('animateBlockNum', gameConsts.halfWidth, gameConsts.halfHeight + 40, -shieldedDamage, 1.5 + Math.sqrt(shieldedDamage) * 0.125);
            }


        }

        for (let i = 0; i < 10; i++) {
            if (playerStatuses['shield' + i]) {
                shieldObjects.push(playerStatuses['shield' + i]);
            }
        }
        for (let i = 0; i < shieldObjects.length; i++) {
            let shieldObj = shieldObjects[i];
            switch (shieldObj.type) {
                case 'matter':
                    if (hurtAmt > 0 && shieldObj.active) {
                        let blockedDmg = amt;
                        playSound('shield_block', 0.4);
                        if (shieldObj.health > hurtAmt) {
                            shieldObj.health -= hurtAmt;
                            hurtAmt = 0;
                            shieldObj.shakeAmt = 0.05 + hurtAmt * 0.005;
                            shieldObj.impactVisibleTime = 6;
                            shieldObj.animObj[2].rotateOffset = -shieldObj.animObj[0].rotation * 0.92;
                            messageBus.publish('animateBlockNum', shieldObj.animObj[1].x + 1, shieldObj.animObj[1].y - 5, 'BLOCKED', 0.9, {y: "-=5", ease: 'Quart.easeOut'}, {scaleX: 0.85, scaleY: 0.85, alpha: 0, });
                        } else {
                            playSound('shield_break', 0.6);
                            hurtAmt = hurtAmt - shieldObj.health;
                            blockedDmg = shieldObj.health;
                            shieldObj.health = 0;
                            let rockAnim = this.scene.add.sprite(shieldObj.animObj[1].x, shieldObj.animObj[1].y, 'spells', 'rockCircle.png');
                            rockAnim.setScale(0.1);
                            rockAnim.setDepth(999);
                            rockAnim.setAlpha(1.4);
                            this.scene.tweens.add({
                                targets: rockAnim,
                                duration: 150,
                                scaleX: 0.5,
                                scaleY: 0.5,
                                y: "+=20",
                                alpha: 0,
                                ease: 'Quad.easeOut',
                                onComplete: () => {
                                    rockAnim.destroy();
                                }
                            });
                            messageBus.publish('animateBlockNum', shieldObj.animObj[1].x + 1, shieldObj.animObj[1].y + 10, '-BROKE-', 1, {y: "+=10", ease: 'Quart.easeOut'}, {alpha: 0, scaleX: 1, scaleY: 1});
                            shieldObj.cleanUp(this.statuses);
                        }
                        shieldObj.animObj[1].setText(shieldObj.health);
                        shieldObj.animObj[1].setScale(1.3);

                        messageBus.publish('tempPause', 100);
                        this.scene.tweens.add({
                            targets: shieldObj.animObj[1],
                            duration: 250,
                            scaleX: 1,
                            scaleY: 1,
                            ease: 'Quad.easeOut'
                        });
                    }
                    break;
                case 'mind':
                    break;
                case 'time':
                    break;
                case 'void':
                    // completely negates the attack
                    if (hurtAmt > 0 && shieldObj.active) {
                        let blockedDmg = amt;
                        playSound('void_strike_hit');
                        let eyesLeft = shieldObj.animObj[1].length;
                        let eye;
                        if (eyesLeft % 2 == 0) {
                            eye = shieldObj.animObj[1].pop();
                        } else {
                            eye = shieldObj.animObj[1].shift();
                        }
                        eye.setScale(2);
                        this.scene.tweens.add({
                            targets: eye,
                            duration: 300,
                            scaleX: 0,
                            scaleY: 0,
                            ease: 'Quad.easeIn',
                            onComplete: () => {
                                eye.destroy();
                            }
                        });
                        if (shieldObj.animObj[1].length == 0) {
                            shieldObj.cleanUp(this.statuses);
                        } else {
                            shieldObj.jiggleAmt = 1;
                        }
                        messageBus.publish('animateBlockNum', gameConsts.halfWidth, gameConsts.halfHeight + 100, 'NEGATED', 1.2);
                        messageBus.publish('tempPause', 100);
                        hurtAmt = 0;
                    }
                    // this.statuses['voidProtect'].cleanUp(this.statuses);

                    break;
            }
        }


        if (hurtAmt > 0) {
            if (this.statuses['matterReinforce']) {
                for (let i = 0; i < this.statuses['matterReinforce'].animObj.length; i++) {
                    let wallObj = this.statuses['matterReinforce'].animObj[i];
                    wallObj.alpha = 1;
                    if (!this.statuses['matterReinforce'].animObj[i].origScale) {
                        this.statuses['matterReinforce'].animObj[i].origScale = this.statuses['matterReinforce'].animObj[i].scaleX;
                    }
                    if (i == 1) {
                        wallObj.setScale(wallObj.origScale * 1.12);
                        this.scene.tweens.add({
                            targets: wallObj,
                            duration: 250,
                            scaleX: wallObj.origScale,
                            scaleY: wallObj.origScale,
                            alpha: 0.5,
                        });
                    } else {
                        wallObj.setScale(wallObj.origScale * 0.99);
                        this.scene.tweens.add({
                            targets: wallObj,
                            duration: 100,
                            scaleX: wallObj.origScale * 1.06,
                            scaleY: wallObj.origScale * 1.06,
                            ease: 'Cubic.easeIn',
                            alpha: 1,
                            onComplete: () => {
                                this.scene.tweens.add({
                                    targets: wallObj,
                                    duration: 200,
                                    scaleX: wallObj.origScale,
                                    scaleY: wallObj.origScale,
                                    ease: 'Quad.easeOut',
                                    alpha: 0.5,

                                });
                            }
                        });
                    }
                }
                hurtAmt = Math.max(0, hurtAmt - this.statuses['matterReinforce'].protection);
                messageBus.publish('enemyTakeDamage', this.statuses['matterReinforce'].damage, false, 30);
            }

            // handle mind shield which plays after
            for (let i = 0; i < shieldObjects.length; i++) {
                let shieldObj = shieldObjects[i];
                switch (shieldObj.type) {
                    case 'mind':
                        if (hurtAmt > 0 && shieldObj.active) {
                            let blockedDmg = Math.ceil(hurtAmt * 0.49999);
                            if (blockedDmg > Math.floor(hurtAmt * 0.50001) + 0.9) {
                                // we got extra
                                if (shieldObj.soakedExtra) {
                                    shieldObj.soakedExtra = false;
                                } else {
                                    blockedDmg--;
                                    shieldObj.soakedExtra = true;
                                }
                            }
                            hurtAmt = hurtAmt - blockedDmg;
                            shieldObj.impactVisibleTime = 8;
                            shieldObj.storedDamage += blockedDmg * shieldObj.multiplier;
                            shieldObj.textObj.setText(shieldObj.storedDamage);
                            let textObjGoalScale = 0.4 + Math.sqrt(shieldObj.storedDamage) * 0.12
                            shieldObj.textObj.setScale(textObjGoalScale + 0.6);
                            this.scene.tweens.add({
                                targets: shieldObj.textObj,
                                duration: 300,
                                scaleX: textObjGoalScale,
                                scaleY: textObjGoalScale,
                                ease: 'Cubic.easeOut',
                            });
                            playSound('fizzle');
                            messageBus.publish('tempPause', 100);

                            shieldObj.animObj[0].setScale(shieldObj.animObj[0].origScaleX * 2.2, shieldObj.animObj[0].scaleY);
                            this.scene.tweens.add({
                                targets: shieldObj.animObj[0],
                                duration: 300,
                                scaleX: shieldObj.animObj[0].origScaleX,
                                ease: 'Quad.easeOut',
                            });

                            shieldObj.animObj[2].setAlpha(0).setScale(0.9);
                            if (shieldObj.reflectAnim) {
                                shieldObj.reflectAnim.stop();
                            }
                            shieldObj.reflectAnim = this.scene.tweens.add({
                                targets: shieldObj.animObj[2],
                                duration: 1250,
                                scaleX: 2,
                                scaleY: 2,
                                alpha: 1,
                                ease: 'Quad.easeOut',
                                onComplete: () => {
                                    shieldObj.animObj[2].alpha = 0;
                                }
                            });

                            if (shieldObj.eyeBlastAnim) {
                                shieldObj.eyeBlastAnim.stop();
                            }
                            shieldObj.animObj[1].setScale(shieldObj.animObj[1].origScale).setAlpha(0.3);
                            shieldObj.isBlasting = true;
                            shieldObj.eyeBlastAnim = this.scene.tweens.add({
                                targets: [shieldObj.animObj[0], shieldObj.animObj[1]],
                                duration: 1250,
                                alpha: 1.1,
                                onComplete: () => {
                                    if (!globalObjects.player.dead) {
                                        let retalVol = 0.4 + shieldObj.storedDamage * 0.015;
                                        playSound('mind_shield_retaliate', retalVol);
                                        //  + spellMultiplier * 0.2
                                        let startRotOffset = shieldObj.multiplier * 0.03 - 0.03;
                                        for (let i = 0; i < shieldObj.multiplier; i++) {
                                            let laserAnim = this.scene.add.sprite(gameConsts.halfWidth, globalObjects.player.getY(), 'spells', 'blast.png').setScale(1.3, 4);
                                            laserAnim.setDepth(990).setOrigin(0.5, 1.05).setAlpha(0);
                                            laserAnim.origScale = laserAnim.scaleX;
                                            laserAnim.rotation = shieldObj.animObj[0].rotation - startRotOffset + i * 0.06;
                                            laserAnim.scaleX = laserAnim.origScale * (1.2 + Math.sqrt(shieldObj.storedDamage) * 0.095);
                                            this.scene.tweens.add({
                                                delay: i * 85,
                                                targets: laserAnim,
                                                duration: 25,
                                                scaleX: laserAnim.origScale * (0.9 + Math.sqrt(shieldObj.storedDamage) * 0.05),
                                                ease: 'Quint.easeIn',
                                                yoyo: true,
                                                repeat: shieldObj.multiplier > 1.1 ? 5 : 6,
                                                onStart: () => {
                                                    laserAnim.setAlpha(1);
                                                },
                                                onComplete: () => {
                                                    laserAnim.destroy();
                                                }
                                            });
                                        }

                                        let dist = 210;
                                        let xPos = gameConsts.halfWidth + Math.sin(shieldObj.animObj[0].rotation) * dist;
                                        let yPos = globalObjects.player.getY() - Math.cos(shieldObj.animObj[0].rotation) * dist;

                                        let shockEffect = getTempPoolObject('spells', 'shockEffect1.png', 'shockEffect', 1100).play('powerEffect');
                                        let goalScale = 2.4 + shieldObj.storedDamage * 0.05;
                                        shockEffect.setPosition(xPos, yPos).setDepth(989).setScale(goalScale*0.6, goalScale*0.15).setRotation(shieldObj.animObj[0].rotation);
                                        this.scene.tweens.add({
                                            targets: shockEffect,
                                            duration: 1000,
                                            scaleX: goalScale * 1.4,
                                            scaleY: goalScale * 0.35,
                                            ease: 'Quint.easeOut'
                                        });

                                        if (shieldObj.active) {
                                            messageBus.publish('enemyTakeTrueDamage', shieldObj.storedDamage, false, 95, true);
                                            shieldObj.animObj[1].setScale(shieldObj.animObj[1].origScale);
                                            this.scene.tweens.add({
                                                targets: shieldObj.animObj[1],
                                                duration: 25,
                                                scaleX: shieldObj.animObj[1].origScale * 0.95,
                                                scaleY: shieldObj.animObj[1].origScale * 0.95,
                                                ease: 'Quint.easeIn',
                                                yoyo: true,
                                                repeat: 6
                                            });
                                            shieldObj.animObj[1].setAlpha(1); // reticle
                                        } else {
                                            messageBus.publish('animateBlockNum', xPos, yPos, 'MISSED', 0.85);
                                        }
                                    }
                                    shieldObj.isLocked = true;
                                    if (shieldObj.textObj && shieldObj.textObj.active) {
                                        shieldObj.textObj.setText(' ');
                                    }
                                    shieldObj.eyeBlastAnim = this.scene.tweens.add({
                                        targets: shieldObj.animObj[1],
                                        duration: 180,
                                        scaleX: shieldObj.animObj[1].origScale * 1.3,
                                        scaleY: shieldObj.animObj[1].origScale * 1.3,
                                        alpha: 0,
                                        ease: 'Cubic.easeOut',
                                        completeDelay: 200,
                                        onComplete: () => {
                                            shieldObj.isLocked = false;
                                        }
                                    });
                                    shieldObj.storedDamage = 0;
                                    shieldObj.isBlasting = false;
                                    shieldObj.cleanUp(this.statuses);
                                }
                            });
                        }
                        break;
                    case 'time':
                        if (hurtAmt >= 1 && shieldObj.active) {
                            playSound('time_strike_hit');

                            shieldObj.animObj[0].setScale(shieldObj.animObj[0].origScaleX * 1.3, shieldObj.animObj[0].scaleY);
                            shieldObj.animObj[1].setScale(shieldObj.animObj[1].origScaleX * 1.25, shieldObj.animObj[0].scaleY);
                            shieldObj.shakeAmt = 0.05 + hurtAmt * 0.005;
                            shieldObj.animObj[0].alpha = 1;
                            shieldObj.animObj[1].alpha = 1;
                            this.scene.tweens.add({
                                targets: shieldObj.animObj[0],
                                duration: 250,
                                alpha: 0.85,
                                scaleX: shieldObj.animObj[0].origScaleX,
                                ease: 'Cubic.easeIn'
                            });
                            this.scene.tweens.add({
                                targets: shieldObj.animObj[1],
                                duration: 350,
                                alpha: 0.85,
                                scaleX: shieldObj.animObj[1].origScaleX,
                                ease: 'Cubic.easeIn'
                            });


                            let exceedAmt = globalObjects.magicCircle.delayedDamage + hurtAmt - shieldObj.maxAmt;
                            if (exceedAmt <= 0) {
                                messageBus.publish('playerAddDelayedDamage', hurtAmt);
                                hurtAmt = 0;
                                messageBus.publish('animateBlockNum', gameConsts.halfWidth, MAGIC_CIRCLE_HEIGHT - 185, 'DELAYED', 1.2);
                            } else {
                                hurtAmt = exceedAmt;
                                let delayAmt = shieldObj.maxAmt - globalObjects.magicCircle.delayedDamage;
                                messageBus.publish('playerAddDelayedDamage', delayAmt);
                                messageBus.publish('animateBlockNum', gameConsts.halfWidth, MAGIC_CIRCLE_HEIGHT - 185, 'OVERLOADED', 1, {y: "+=10"}, {alpha: 0, scaleX: 1, scaleY: 1});
                                shieldObj.cleanUp(this.statuses);
                            }
                            messageBus.publish('tempPause', 100);
                        }
                        break;
                }
            }
        }

        return hurtAmt;
    }

    die() {
        if (this.dead) {
            return;
        }
        globalObjects.magicCircle.setAuraAlpha(0);
        this.dead = true;
        playSound('you_died');
        this.deadBG.alpha = 0.85;
        this.clearAllEffects();

        if (!this.swirl1) {
            this.swirl2 = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 200, 'backgrounds', 'fog_swirl_glow.png').setDepth(30);
            this.swirl1 = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 200, 'backgrounds', 'fog_swirl.png').setDepth(30);
        }
        this.swirl1.setAlpha(0).setScale(3);
        this.swirl2.setAlpha(0).setScale(3);

        this.scene.tweens.add({
            targets: [this.swirl1, this.swirl2],
            duration: 2500,
            alpha: 0.5,
            scaleX: 1.3,
            scaleY: 1.3,
            ease: 'Cubic.easeInOut',
        });
        this.deadSwirlAnim = this.scene.tweens.add({
            targets: [this.swirl1, this.swirl2],
            duration: 30000,
            rotation: "+=6.283",
            repeat: -1,
        });

        messageBus.publish("playerDied");
        this.deadBGAnim = this.scene.tweens.add({
            targets: this.deadBG,
            duration: 750,
            alpha: 0.5,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                if (globalObjects.floatingDeath) {
                    globalObjects.floatingDeath.visible = false;
                }

                this.deadBGAnim = this.scene.tweens.add({
                    targets: this.deadBG,
                    duration: 1500,
                    alpha: 1,
                    ease: 'Cubic.easeIn',
                    onComplete: () => {
                        let deathMenuButton;
                        let deathRetryButton;
                        let deathTrainingButton;
                        deathMenuButton = new Button({
                            normal: {
                                ref: "menu_btn_normal.png",
                                atlas: 'buttons',
                                x: gameConsts.halfWidth,
                                y: gameConsts.height - 380,
                            },
                            hover: {
                                ref: "menu_btn_hover.png",
                                atlas: 'buttons',
                            },
                            press: {
                                ref: "menu_btn_hover.png",
                                atlas: 'buttons',
                            },
                            disable: {
                                alpha: 0.001
                            },
                            onMouseUp: () => {
                                this.revive();
                                gotoMainMenu();
                                globalObjects.textPopupManager.hideInfoText();
                                globalObjects.bannerTextManager.closeBanner();
                                deathRetryButton.destroy();
                                deathMenuButton.destroy();
                                deathTrainingButton.destroy();
                            }
                        });
                        deathMenuButton.addText('MENU', {fontFamily: 'garamondmax', fontSize: 34, color: '#000000', align: 'center'});
                        deathMenuButton.setDepth(200);

                        deathTrainingButton = new Button({
                            normal: {
                                ref: "menu_btn_normal.png",
                                atlas: 'buttons',
                                x: gameConsts.halfWidth,
                                y: gameConsts.height - 540,
                            },
                            hover: {
                                ref: "menu_btn_hover.png",
                                atlas: 'buttons',
                            },
                            press: {
                                ref: "menu_btn_hover.png",
                                atlas: 'buttons',
                            },
                            disable: {
                                alpha: 0.001
                            },
                            onMouseUp: () => {
                                this.revive();
                                globalObjects.encyclopedia.showButton();
                                globalObjects.options.showButton();
                                if (globalObjects.currentEnemy) {
                                    globalObjects.currentEnemy.destroy();
                                }
                                if (globalObjects.player) {
                                    globalObjects.player.resetStats();
                                }
                                beginLevel(CURRENT_LEVEL * -1 + 1);
                                deathMenuButton.destroy();
                                deathRetryButton.destroy();
                                deathTrainingButton.destroy();
                            }
                        });
                        deathTrainingButton.addText('BACK TO TRAINING', {fontFamily: 'garamondmax', fontSize: 34, color: '#000000', align: 'center'});
                        deathTrainingButton.setDepth(200);

                        deathRetryButton = new Button({
                            normal: {
                                ref: "menu_btn_normal.png",
                                atlas: 'buttons',
                                x: gameConsts.halfWidth,
                                y: gameConsts.height - 540,
                            },
                            hover: {
                                ref: "menu_btn_hover.png",
                                atlas: 'buttons',
                            },
                            press: {
                                ref: "menu_btn_hover.png",
                                atlas: 'buttons',
                            },
                            disable: {
                                alpha: 0.001
                            },
                            onMouseUp: () => {
                                this.revive();
                                globalObjects.encyclopedia.showButton();
                                globalObjects.options.showButton();
                                if (globalObjects.currentEnemy) {
                                    globalObjects.currentEnemy.destroy();
                                }
                                if (globalObjects.player) {
                                    globalObjects.player.resetStats();
                                }
                                createEnemy(CURRENT_LEVEL);
                                deathMenuButton.destroy();
                                deathRetryButton.destroy();
                                deathTrainingButton.destroy();
                            }
                        });
                        deathRetryButton.addText('RETRY', {fontFamily: 'garamondmax', fontSize: 34, color: '#000000', align: 'center'});
                        deathRetryButton.setDepth(200);
                    }
                });
            }
        });
    }

    revive() {
        this.dead = false;
        if (this.deadBGAnim) {
            this.deadSwirlAnim.stop();
            this.deadBGAnim.stop();
            this.scene.tweens.add({
                targets: this.deadBG,
                duration: 500,
                alpha: 0,
                ease: 'Quad.easeOut',
            });
            this.scene.tweens.add({
                targets: [this.swirl1, this.swirl2],
                duration: 1000,
                alpha: 0,
                rotation: "-=1",
                scaleX: 3,
                scaleY: 3,
                ease: 'Cubic.easeIn',
            });
        }

        messageBus.publish("manualResetElements");
        messageBus.publish("manualResetEmbodiments");
        messageBus.publish("playerRevived");
    }

    isDead() {
        return this.dead;
    }

    animateHealthChange(healthChange, isGreyed = false) {
        let textScale = 1;
        if (isGreyed) {

        } else if (healthChange < -1 ) {
            zoomTemp(1.01);
        }
        if (this.health < 20) {
            textScale += 0.2;
        }
        let healthChangeScaleAmt = 0;
        if (healthChange > 12) {
            healthChangeScaleAmt = 12;
        } else {
            healthChangeScaleAmt = healthChange;
        }
        let addAmt = (0.18 * Math.sqrt(Math.abs(healthChangeScaleAmt)) + 0.04 * Math.abs(healthChangeScaleAmt));
        if (Math.abs(healthChange) > 80) {
            addAmt = 0.18 * Math.sqrt(80) + 0.04 * 80;
        }
        textScale += addAmt;
        if (textScale > 1.2) {
            let diffScale = textScale - 1.2;
            textScale = 1 + diffScale * 0.5;
        }

        if (isGreyed) {
            messageBus.publish('animateBlockNum', this.healthText.x - 31 + Math.random() * 60, this.healthText.y - 65 + Math.random() * 50, healthChange, textScale);
        } else if (healthChange > 0) {
            messageBus.publish('animateHealNum', this.healthText.x - 21 + Math.random() * 40, this.healthText.y - 25 + Math.random() * 40, '+' + healthChange, 0.5 + textScale, {duration: 1750, ease: 'Quart.easeOut', scaleX: 0.5 + textScale * 0.9, scaleY: 0.5 + textScale * 0.9});
        } else if (healthChange === 0) {
            // messageBus.publish('animateBlockNum', this.healthText.x - 1, this.healthText.y - 85, healthChange, textScale);
        } else {
            messageBus.publish('animateDamageNum', this.healthText.x - 41 + Math.random() * 80, this.healthText.y - 90 + Math.random() * 130, healthChange, 0.4 + textScale, {duration: 400, completeDelay: 1200, ease: 'Back.easeOut', y: "-=10", scaleX: textScale * 0.9, scaleY: textScale * 0.9});
        }
    }
}
