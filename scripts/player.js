class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.initStats(x, y);
        this.resetStats();
        this.createHealthBar(x + 0.5, y + 0.5);
        this.subscriptions = [
            messageBus.subscribe("selfTakeEffect", this.takeEffect.bind(this)),
            messageBus.subscribe("selfTakeEnemyEffect", this.takeEnemyEffect.bind(this)),
            messageBus.subscribe("selfTakeDamage", this.takeDamage.bind(this)),
            messageBus.subscribe("selfHeal", this.selfHeal.bind(this)),
            messageBus.subscribe("selfHealPercent", this.selfHealPercent.bind(this)),

            messageBus.subscribe("selfTakeTrueDamage", this.takeTrueDamage.bind(this)),
            messageBus.subscribe('clearSpellMultiplier', this.clearSpellMultiplier.bind(this)),
            messageBus.subscribe('clearAttackMultiplier', this.clearAttackMultiplier.bind(this)),
            messageBus.subscribe('clearDamageAdder', this.clearDamageAdder.bind(this))
        ];
        //             messageBus.subscribe("selfClearEffect", this.clearEffects.bind(this)),
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
        this.health = 100;
        this.healthMax = 100;
        this.initStatsCustom();
        this.statuses = {};
    }

    getY() {
        return this.y;
    }

    getStatuses() {
        return this.statuses;
    }

    spellMultiplier() {
        if (this.statuses['mindUnload']) {
            return this.statuses['mindUnload'].multiplier ? this.statuses['mindUnload'].multiplier : 3;
        } else {
            return 1;
        }
    }

    attackEnhanceMultiplier() {
        if (this.statuses['mindEnhance']) {
            return this.statuses['mindEnhance'].multiplier ? this.statuses['mindEnhance'].multiplier : 2;
        } else {
            return 1;
        }
    }

    attackDamageAdder() {
        const flatDamage = 10;
        if (this.statuses['matterEnhance']) {
            let multiplier = this.statuses['matterEnhance'].multiplier ? this.statuses['matterEnhance'].multiplier : 1;
            let damageBoost = multiplier * flatDamage;
            return damageBoost
        } else {
            return 0;
        }
    }

    clearSpellMultiplier() {
        if (this.statuses['mindUnload']) {
            this.statuses['mindUnload'].cleanUp(this.statuses);
            this.statuses['mindUnload'] = null;
        }
        globalObjects.magicCircle.setAuraAlpha(0.02);
    }

    clearAttackMultiplier() {
        if (this.statuses['mindEnhance']) {
            this.statuses['mindEnhance'].cleanUp(this.statuses);
            this.statuses['mindEnhance'] = null;
        }
    }

    clearDamageAdder() {
        if (this.statuses['matterEnhance']) {
            this.statuses['matterEnhance'].cleanUp(this.statuses);
            this.statuses['matterEnhance'] = null;
        }
    }

    initStatsCustom() {

    }

    createHealthBar(x, y) {
        this.barAssetsGrey = [];
        this.barAssetsLarge = [];
        this.barAssetsSmall = [];
        this.barAssetsTiny = [];
        for (let i = 0; i < 3; i++) {
            let healthBar = this.scene.add.sprite(x, y, 'circle', 'healthbar_quarter_grey.png');
            healthBar.setDepth(99998);
            healthBar.rotation = Math.PI * (0.75 - 0.5 * i);
            healthBar.visible = false;
            // healthBar.setScale(0.999, 0.999);
            this.barAssetsGrey.push(healthBar);
        }

        for (let i = 0; i < 3; i++) {
            let healthBar = this.scene.add.sprite(x, y, 'circle', 'healthbar_quarter.png');
            healthBar.setDepth(99999);
            healthBar.rotation = Math.PI * (0.75 - 0.5 * i);
            // healthBar.setScale(0.999, 0.999);
            this.barAssetsLarge.push(healthBar);
        }

        for (let i = 0; i < 1; i++) {
            let healthBar = this.scene.add.sprite(x, y, 'circle', 'healthbar_sixteenth.png');
            healthBar.setDepth(99999);
            healthBar.rotation = 0;
            healthBar.visible = false;
            healthBar.setScale(1, 1);
            this.barAssetsSmall.push(healthBar);
        }

        this.healthBarPeak = this.scene.add.sprite(x, y, 'circle', 'healthbar_tip.png');
        this.healthBarPeak.setDepth(99999);
        this.healthBarPeak.rotation = Math.PI * -(0.25 + 0.01);
        this.healthBarPeak.setScale(1, 1);
        this.healthBarPeak.visible = false;

        this.healthText = this.scene.add.text(x, y + 40, 'HP ' + this.health + '/' + this.healthMax);
        this.healthText.setTint(0x000000);
        this.healthText.setOrigin(0.5, 0.5);
        this.healthText.setDepth(99999);

        this.healthbarCover = this.scene.add.sprite(x - 0.5, y - 1, 'circle', 'healthbar_cover.png');
        this.healthbarCover.setDepth(100000);
        this.healthbarCover.rotation = Math.PI * 1.25;
        this.healthbarCover.scaleX = 1.005;
        this.healthbarCover.scaleY = 1.005;
    }

    refreshHealthBar(overrideHealth) {
        let healthRatio = overrideHealth || this.health / this.healthMax;
        this.healthText.setText('HP ' + this.health + '/' + this.healthMax);
        this.healthBarPeak.rotation = Math.PI * -(0.25 - 1.5 * (1 - healthRatio));
        let drawStartSpot = 0;
        this.healthBarPeak.visible = true;
        if (healthRatio < 0.341) {
            drawStartSpot = 0.334 - healthRatio;
            for (let i = 1; i < 3; i++) {
                let healthBar = this.barAssetsLarge[i];
                healthBar.visible = false;
            }
            if (healthRatio > 0.08) {
                this.barAssetsLarge[0].rotation = Math.PI * (0.75 + drawStartSpot * 0.5 * Math.PI) - 0.01;
            } else {
                this.barAssetsLarge[0].visible = false;
                this.barAssetsSmall[0].visible = true;
                this.barAssetsSmall[0].rotation = Math.PI * (0.75 + drawStartSpot * 0.5 * Math.PI) - 0.01;
            }
        } else if (healthRatio < 0.671) {
            drawStartSpot = 0.667 - healthRatio;
            for (let i = 0; i < 3; i++) {
                let healthBar = this.barAssetsLarge[i];
                if (i < 2) {
                    healthBar.visible = true;
                    healthBar.rotation = Math.PI * (0.75 - 0.5 * i + drawStartSpot * 0.5 * Math.PI) - 0.01;
                } else {
                    healthBar.visible = false;
                }
            }
        } else if (healthRatio < 1) {
            drawStartSpot = 1 - healthRatio;
            for (let i = 0; i < 3; i++) {
                let healthBar = this.barAssetsLarge[i];
                healthBar.visible = true;
                healthBar.rotation = Math.PI * (0.75 - 0.5 * i + drawStartSpot * 0.5 * Math.PI) - 0.01;
            }
        } else {
            drawStartSpot = 0;
            // max health
            for (let i = 0; i < 3; i++) {
                let healthBar = this.barAssetsLarge[i];
                healthBar.visible = true;
                healthBar.rotation = Math.PI * (0.75 - 0.5 * i + drawStartSpot * 0.5 * Math.PI) - 0.01;
            }
            this.healthBarPeak.visible = false;
        }
    }

    resetStats() {
        this.health = this.healthMax;
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
    }

    adjustDamageTaken(amt) {
        return amt;
    }

    takeEffect(newEffect) {
        this.statuses[newEffect.name] = newEffect;
    }

    clearEffects() {
        for (let i in this.statuses) {
            let effect = this.statuses[i];
            if (effect) {
                effect.cleanUp(this.statuses);
            }
        }
        this.statuses = [];
    }

    takeEnemyEffect(newEffect) {
        if (this.statuses['voidProtect']) {
            this.statuses['voidProtect'].cleanUp(this.statuses);
            return;
        }
        this.statuses[newEffect.name] = newEffect;
        zoomTemp(1.006);
    }

    takeDamage(amt) {
        let actualAmt = this.handleDamageStatuses(amt);
        let origHealth = this.health;
        let damageTaken = this.adjustDamageTaken(actualAmt);
        if (damageTaken > 1) {
            this.bleedObj.alpha = Math.sqrt(damageTaken - 1) * 0.04;
            this.scene.tweens.add({
                targets: this.bleedObj,
                duration: 100,
                alpha: 0,
                ease: 'Quad.easeOut'
            });
        }

        this.health = Math.max(0, this.health - damageTaken);
        this.animateHealthChange(-damageTaken);
        this.refreshHealthBar();
        if (this.health <= 0) {
            this.die();
        }
    }

    selfHeal(amt) {
        this.health = Math.min(this.healthMax, this.health + amt);
        this.animateHealthChange(amt);
        this.refreshHealthBar();
    }

    selfHealPercent(percent) {
        let healthToHeal = Math.ceil((this.healthMax - this.health) * percent * 0.01);
        this.selfHeal(healthToHeal);
    }

    takeTrueDamage(amt) {
        this.health = Math.max(0, this.health - amt);
        this.animateHealthChange(-amt);
        this.refreshHealthBar();
        if (this.health <= 0) {
            this.die();
        }
    }

    handleDamageStatuses(amt) {
        let hurtAmt = amt;

        let playerStatuses = this.getStatuses();
        let shieldObjects = [];
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
                        if (shieldObj.health > hurtAmt) {
                            shieldObj.health -= hurtAmt;
                            hurtAmt = 0;
                            shieldObj.shakeAmt = 0.05 + hurtAmt * 0.005;
                            shieldObj.impactVisibleTime = 5;
                            shieldObj.animObj[2].rotateOffset = -shieldObj.animObj[0].rotation * 0.92;
                        } else {
                            hurtAmt = hurtAmt - shieldObj.health;
                            blockedDmg = shieldObj.health;
                            shieldObj.health = 0;
                            let rockAnim =  this.scene.add.sprite(shieldObj.animObj[1].x, shieldObj.animObj[1].y, 'spells', 'rockCircle.png');
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
                            shieldObj.cleanUp(this.statuses);
                        }
                        shieldObj.animObj[1].setText(shieldObj.health);
                        shieldObj.animObj[1].setScale(1.3);
                        messageBus.publish('animateBlockNum', shieldObj.animObj[1].x + 1, shieldObj.animObj[1].y - 15, -blockedDmg, 0.5 + Math.sqrt(blockedDmg) * 0.125);

                        this.scene.tweens.add({
                            targets: shieldObj.animObj[1],
                            duration: 250,
                            scaleX: 1,
                            scaleY: 1,
                            ease: 'Quad.easeOut'
                        });
                    }
                    break;
                case 'time':
                    // TODO
                    break;
                case 'void':
                    // completely negates the attack
                    if (hurtAmt > 0 && shieldObj.active) {
                        let blockedDmg = amt;
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
                        messageBus.publish('animateBlockNum', gameConsts.halfWidth, gameConsts.halfHeight + 100, -blockedDmg, 1.5);
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
                        wallObj.setScale(wallObj.origScale * 1.06);
                    } else {
                        wallObj.setScale(wallObj.origScale * 1.01);
                    }
                    this.scene.tweens.add({
                        targets: wallObj,
                        duration: 250,
                        scaleX: wallObj.origScale,
                        scaleY: wallObj.origScale,
                        alpha: 0.5,
                    });
                }
                hurtAmt = Math.max(0, hurtAmt - this.statuses['matterReinforce'].protection);
                messageBus.publish('enemyTakeDamage', this.statuses['matterReinforce'].damage, false);
            } else if (this.statuses['mindReinforce']) {
                let needleObj = this.statuses['mindReinforce'].animObj[0];
                needleObj.setScale(0.98);
                needleObj.setAlpha(0.8);
                this.scene.tweens.add({
                    targets: needleObj,
                    delay: 20,
                    duration: 380,
                    scaleX: 1.05,
                    scaleY: 1.05,
                    ease: 'Cubic.easeIn',
                    alpha: 0.35,
                });
                hurtAmt = hurtAmt + this.statuses['mindReinforce'].weakness;
            }
        }

        if (hurtAmt > 1 && this.statuses['timeProtect']) {
            messageBus.publish('playerAddDelayedDamage', hurtAmt);
            hurtAmt = 0;
        }

        return hurtAmt;
    }

    die() {
        console.log('todo: has died');
        for (let i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].unsubscribe();
        }
    }

    updateGreyHealth() {
        if (this.statuses['matterProtect'] && this.statuses['matterProtect'].health > 0) {
            let healthShieldRatio = (this.health + this.statuses['matterProtect'].health) / this.healthMax;
            let visibleIndex;
            if (this.statuses['matterProtect'].health <= 25) {
                visibleIndex = 1;
            } else if (this.statuses['matterProtect'].health <= 50) {
                visibleIndex = 2;
            } else {
                visibleIndex = 3;
            }
            let drawStartSpot = 1 - healthShieldRatio;
            for (let i = 0; i < this.barAssetsGrey.length; i++) {
                let healthBar = this.barAssetsGrey[i];
                if (i < visibleIndex) {
                    healthBar.visible = true;
                } else {
                    healthBar.visible = false;
                }
                healthBar.rotation = Math.PI * (-0.25 + 0.5 * i + drawStartSpot * 0.5 * Math.PI - 0.004);
            }

        } else {
            for (let i = 0; i < this.barAssetsGrey.length; i++) {
                let healthBar = this.barAssetsGrey[i];
                healthBar.visible = false;
            }
        }
    }

    animateHealthChange(healthChange, isGreyed = false) {
        let textScale = 0.6;
        if (isGreyed) {

        } else if (healthChange < -1 ) {
            zoomTemp(1.01);
        }
        if (this.health < 20) {
            textScale += 0.2;
        }
        textScale += (0.06 * Math.abs(healthChange));
        if (textScale > 1) {
            let diffScale = textScale - 1;
            textScale = 1 + diffScale * 0.5;
        }

        if (isGreyed) {
            messageBus.publish('animateBlockNum', this.healthText.x - 1, this.healthText.y - 15, healthChange, textScale);
        } else if (healthChange > 0) {
            messageBus.publish('animateHealNum', this.healthText.x - 1, this.healthText.y - 15, '+' + healthChange, textScale);
        } else if (healthChange === 0) {
            messageBus.publish('animateBlockNum', this.healthText.x - 1, this.healthText.y - 15, healthChange, textScale);
        } else {
            messageBus.publish('animateDamageNum', this.healthText.x - 1, this.healthText.y - 15, healthChange, textScale);
        }
    }
}
