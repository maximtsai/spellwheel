class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.initStats(x, y);
        this.resetStats();
        this.createHealthBar(x, y + 0.5);
        this.subscriptions = [
            messageBus.subscribe("selfTakeEffect", this.takeEffect.bind(this)),
            messageBus.subscribe("selfTakeEnemyEffect", this.takeEnemyEffect.bind(this)),
            messageBus.subscribe("selfTakeDamage", this.takeDamage.bind(this)),
            messageBus.subscribe("selfHeal", this.selfHeal.bind(this)),
            messageBus.subscribe("selfHealPercent", this.selfHealPercent.bind(this)),
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
        this.health = 80;
        this.trueHealthMax = 80;
        this.healthMax = 80;
        this.recentlyTakenDamageAmt = 0;
        this.recentlyTakenTimeDamageAmt = 0;
        this.playerCastSpells = 0;
        this.initStatsCustom();
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
        this.health = amt;
    }

    setHealthMaxTemp(amt = 80) {
        this.healthMax = amt;
        this.refreshHealthBar();
    }

    incrementSpellsCast() {
        this.playerCastSpells++;
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
        const flatDamage = 8;
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

    initStatsCustom() {

    }

    createHealthBar(x, y) {
        this.barAssetsGrey = [];
        this.barAssetsLarge = [];
        this.barAssetsSmall = [];
        for (let i = 0; i < 3; i++) {
            let healthBar = this.scene.add.sprite(x, y - 0.5, 'circle', 'healthbar_quarter.png');
            healthBar.setDepth(99998);
            healthBar.rotation = Math.PI * (0.75 - 0.5 * i);
            healthBar.visible = false;
            //healthBar.setScale(0.999, 0.999);
            this.barAssetsGrey.push(healthBar);
        }

        for (let i = 0; i < 3; i++) {
            let healthBar = this.scene.add.sprite(x, y - 0.5, 'circle', 'healthbar_quarter.png');
            healthBar.setDepth(99999);
            healthBar.rotation = Math.PI * (1.25 + 0.5 * i) + 0.01;
            //healthBar.setScale(0.999, 0.999);
            this.barAssetsLarge.push(healthBar);
        }

        for (let i = 0; i < 1; i++) {
            let healthBar = this.scene.add.sprite(x, y - 0.5, 'circle', 'healthbar_sixteenth.png');
            healthBar.setDepth(99999);
            healthBar.rotation = 0;
            healthBar.visible = false;
            healthBar.setScale(1, 1);
            this.barAssetsSmall.push(healthBar);
        }
        let healthBarEnd = this.scene.add.sprite(x, y - 0.5, 'circle', 'healthbar_end.png').setDepth(99999);

        this.healthBarPeak = this.scene.add.sprite(x, y - 0.5, 'circle', 'healthbar_tip.png');
        this.healthBarPeak.setDepth(99999);
        this.healthBarPeak.rotation = Math.PI * (0.75 + 1.5);
        this.healthBarPeak.setScale(1, 1);
        this.healthBarPeak.visible = true;

        this.healthText = this.scene.add.text(x, y + 38, 'HP ' + this.health + '/' + this.healthMax, {fontFamily: 'Arial', fontSize: 19, color: '#040404', align: 'left'});
        this.healthText.setAlpha(0.7);
        this.healthText.setFontStyle('bold')
        this.healthText.setTint(0x000000);
        this.healthText.setOrigin(0.5, 0.5);
        this.healthText.setDepth(99999);
    }

    refreshHealthBar(overrideHealth) {
        this.health = 25;
        let healthRatio = overrideHealth || this.health / this.healthMax;
        this.healthText.setText('HP ' + this.health + '/' + this.healthMax);
        this.healthBarPeak.rotation = Math.PI * (0.75 + 1.5 * healthRatio);
        let drawStartSpot = 0;
        this.healthBarPeak.visible = true;
        if (healthRatio < 0.341) {
            drawStartSpot = 0.334 - healthRatio;
            for (let i = 1; i < 3; i++) {
                let healthBar = this.barAssetsLarge[i];
                healthBar.visible = false;
            }
            if (healthRatio > 0.08) {
                this.barAssetsLarge[0].rotation = Math.PI * (1.25 - drawStartSpot * 0.5 * Math.PI) - 0.01;
            } else if (healthRatio < 0.0001) {
                this.barAssetsLarge[0].visible = false;
                this.barAssetsSmall[0].visible = false;
                this.healthBarPeak.visible = false;
            } else {
                this.barAssetsLarge[0].visible = false;
                this.barAssetsSmall[0].visible = true;
                this.barAssetsSmall[0].rotation = Math.PI * (0.75 - drawStartSpot * 0.5 * Math.PI) - 0.01;
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
            drawStartSpot = 0;
            // max health
            for (let i = 0; i < 3; i++) {
                let healthBar = this.barAssetsLarge[i];
                healthBar.visible = true;
                healthBar.rotation = Math.PI * (1.25 - 0.5 * i) + 0.01;
            }
            this.healthBarPeak.visible = false;
        }
    }

    resetStats() {
        this.healthMax = this.trueHealthMax;
        this.health = this.healthMax;
        this.playerCastSpells = 0;
        this.clearAllEffects();
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

    enemyMadeAttack() {
        this.recentlyTakenDamageAmt = 0;
        this.recentlyTakenTimeDamageAmt = 0;
    }

    getrecentlyTakenDamageAmt() {
        return this.recentlyTakenDamageAmt + this.recentlyTakenTimeDamageAmt;
    }

    takeDamage(amt) {
        if (amt < 0) {
            amt = 0;
        }
        let actualAmt = this.handleDamageStatuses(amt);
        let origHealth = this.health;
        let damageTaken = this.adjustDamageTaken(actualAmt);
        if (damageTaken > 1) {
            this.recentlyTakenDamageAmt += damageTaken;

            this.bleedObj.alpha = Math.sqrt(damageTaken - 1) * 0.04;
            this.scene.tweens.add({
                targets: this.bleedObj,
                duration: 100,
                alpha: 0,
                ease: 'Quad.easeOut'
            });
        } else if (damageTaken === undefined) {
            return;
        }

        this.health = Math.max(0, this.health - damageTaken);
        this.animateHealthChange(-damageTaken);
        this.refreshHealthBar();
        if (this.health <= 0) {
            this.die();
        }
    }

    selfHeal(amt, timeOverflow = false) {
        let overflow = 0;
        let newHealthAmt = this.health + amt;
        if (newHealthAmt > this.healthMax) {
            overflow = newHealthAmt - this.healthMax;
        }
        this.health = Math.min(this.healthMax, newHealthAmt);
        if (timeOverflow) {
            messageBus.publish('playerReduceDelayedDamage', overflow);
        }
        this.animateHealthChange(amt);
        this.refreshHealthBar();
    }

    selfHealPercent(percent) {
        let healthToHeal = Math.ceil((this.healthMax - this.health) * percent * 0.01);
        this.selfHeal(healthToHeal);
    }

    selfHealRecent(amount = 0.1) {
        let healAmt = Math.ceil(amount * this.recentlyTakenDamageAmt);
        this.selfHeal(healAmt);
        this.recentlyTakenDamageAmt -= healAmt;

        let timeHealAmt = Math.ceil(amount * this.recentlyTakenTimeDamageAmt);
        this.selfHeal(timeHealAmt, true);
        this.recentlyTakenTimeDamageAmt -= timeHealAmt;
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
            } else {
                hurtAmt = hurtAmt - this.statuses['matterUnload'].health;
                shieldedDamage = this.statuses['matterUnload'].health;
                this.statuses['matterUnload'].health = 0;
                this.statuses['matterUnload'].animObj[1].setScale(1.1);
                this.statuses['matterUnload'].animObj[1].setText(this.statuses['matterUnload'].health);
                this.statuses['matterUnload'].cleanUp(this.statuses);
            }
            messageBus.publish('animateBlockNum', gameConsts.halfWidth, gameConsts.halfHeight + 40, -shieldedDamage, 0.5 + Math.sqrt(shieldedDamage) * 0.125);


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
                    if (hurtAmt > 1 && shieldObj.active) {
                        messageBus.publish('playerAddDelayedDamage', hurtAmt);

                        shieldObj.shakeAmt = 0.05 + hurtAmt * 0.005;
                        shieldObj.alpha = 1;
                        this.scene.tweens.add({
                            targets: shieldObj,
                            duration: 300,
                            alpha: 0.85,
                            ease: 'Quad.easeIn'
                        });
                        messageBus.publish('animateBlockNum', gameConsts.halfWidth, MAGIC_CIRCLE_HEIGHT - 200, hurtAmt, 0.5 + Math.sqrt(hurtAmt) * 0.125);
                        hurtAmt = 0;
                    }
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
                // TODO: HURT SELF
                messageBus.publish('selfImplode');
            }
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
