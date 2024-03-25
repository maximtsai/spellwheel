class SpellManager {
    constructor(scene) {
        this.scene = scene;
        this.particlesRock = [];
        messageBus.subscribe('castSpell', this.handleSpell.bind(this));
        this.initializePoolStuff();
    }
    initializePoolStuff() {
        let rockObj = this.scene.add.sprite(0, 0, 'spells', 'rock.png');
        poolManager.returnItemToPool(rockObj, 'rock');


    }

    handleSpell(elem, embodi, shieldID, rotation = 0) {
        switch (elem.runeName) {
            case RUNE_MATTER:
                switch (embodi.runeName) {
                    case RUNE_STRIKE:
                        this.castMatterStrike();
                        break;
                    case RUNE_REINFORCE:
                        this.castMatterReinforce();
                        break;
                    case RUNE_ENHANCE:
                        this.castMatterEnhance();
                        break;
                    case RUNE_PROTECT:
                        this.castMatterProtect(shieldID, rotation);
                        break;
                    case RUNE_UNLOAD:
                        this.castMatterUnload();
                        break;
                }
                break;
            case RUNE_TIME:
                switch (embodi.runeName) {
                    case RUNE_STRIKE:
                        this.castTimeStrike();
                        break;
                    case RUNE_REINFORCE:
                        this.castTimeReinforce();
                        break;
                    case RUNE_ENHANCE:
                        this.castTimeEnhance();
                        break;
                    case RUNE_PROTECT:
                        this.castTimeProtect(shieldID, rotation);
                        break;
                    case RUNE_UNLOAD:
                        this.castTimeUnload();
                        break;
                }
                break;
            case RUNE_MIND:
                switch (embodi.runeName) {
                    case RUNE_STRIKE:
                        this.castMindStrike();
                        break;
                    case RUNE_REINFORCE:
                        this.castMindReinforce();
                        break;
                    case RUNE_ENHANCE:
                        this.castMindEnhance();
                        break;
                    case RUNE_PROTECT:
                        this.castMindProtect(shieldID, rotation);
                        break;
                    case RUNE_UNLOAD:
                        this.castMindUnload();
                        break;
                }
                break;
            case RUNE_VOID:
                switch (embodi.runeName) {
                    case RUNE_STRIKE:
                        this.castVoidStrike();
                        break;
                    case RUNE_REINFORCE:
                        this.castVoidReinforce(elem, embodi);
                        break;
                    case RUNE_ENHANCE:
                        this.castVoidEnhance();
                        break;
                    case RUNE_PROTECT:
                        this.castVoidProtect(shieldID, rotation);
                        break;
                    case RUNE_UNLOAD:
                        this.castVoidUnload();
                        break;
                }
                break;
        }
    }

    createDamageEffect(x, y, depth, sprite = null, customTween = {}, isAnim) {
        let dmgEffect;
        let extraDur = 0;
        if (sprite === null) {
            dmgEffect = this.scene.add.sprite(x, y, 'spells').play('damageEffect');
            extraDur = 100;
        } else if (isAnim) {
            dmgEffect = this.scene.add.sprite(x, y, 'spells').play(sprite);
            extraDur = 150;
        } else {
            dmgEffect = this.scene.add.sprite(x, y, 'spells', sprite);
        }

        dmgEffect.setDepth(depth);
        let defaultTweenObj = {
            targets: dmgEffect,
            scaleY: 1.005,
            duration: 150 + extraDur,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                dmgEffect.destroy();
            }
        }
        let actualTweenObj = Object.assign({}, defaultTweenObj, customTween);
        this.scene.tweens.add(actualTweenObj);
        return dmgEffect;
    }

    // man farm potatoes with son(happy), police take potatoes (sad), man wake up realize it was dream (okay), man sad because son actually dead (lmao)
    // Man brings back bread to family (happy), family actually gone (sad), man thinks more bread for self (okay), man sad because bread has worm (lmao)
    // Man wife announces is pregant (happy), but wife has miscarriage (sad), it's okay still have loving wife (okay), wife says don't be sad it wasn't your baby anyways (lmao)

    castMatterStrike() {
        const spellID = 'matterStrike';
        let rockObjects = [];
        let numAdditionalAttacks = globalObjects.player.attackEnhanceMultiplier();
        let additionalDamage = globalObjects.player.attackDamageAdder();

        let pebbles = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.height - 360, 'spells', 'rockCircle.png');
        pebbles.setDepth(100).setAlpha(0).setScale(0.7 + additionalDamage * 0.015).setRotation(Math.random() * 3)
        this.scene.tweens.add({
            targets: pebbles,
            duration: 300,
            scaleX: 0,
            scaleY: 0,
        });
        this.scene.tweens.add({
            targets: pebbles,
            duration: 300,
            alpha: 1,
            ease: 'Cubic.easeOut'
        });

        for (let i = 0; i < numAdditionalAttacks; i++) {
            let xPos = gameConsts.halfWidth + (numAdditionalAttacks - 1) * -25 + 50 * i;
            let halfwayIdx = (numAdditionalAttacks - 1) * 0.5;
            let yPos = gameConsts.height - 360 + Math.abs(halfwayIdx - i) * 10;
            let rockObj = poolManager.getItemFromPool('rock')
            if (!rockObj) {
                rockObj = this.scene.add.sprite(xPos, yPos, 'spells', 'rock.png');
            }
            rockObj.setPosition(xPos, yPos);
            rockObj.setDepth(11);
            rockObj.rotation = Math.random() - 0.5;
            rockObjects.push(rockObj);
            rockObj.setScale(0.0);
            this.scene.tweens.add({
                targets: rockObj,
                delay: 150,
                duration: 400 + additionalDamage * 2,
                scaleX: 0.5 + additionalDamage * 0.01,
                scaleY: 0.5 + additionalDamage * 0.01,
                ease: 'Back.easeOut'
            });
            this.scene.tweens.add({
                targets: rockObj,
                delay: 150,
                duration: 450 + additionalDamage * 2,
                rotation: (Math.random() - 0.5) * 3,
                ease: 'Quart.easeOut'
            });
        }

        for (let i = 0; i < rockObjects.length; i++) {
            let rockObj = rockObjects[i];
            this.scene.tweens.add({
                targets: rockObj,
                delay: 600 + i * (220 - i * 12) + additionalDamage * 2,
                x: gameConsts.halfWidth + (Math.random() - 0.5) * 20,
                y: 140 + (Math.random() - 0.5) * 20 - Math.floor(Math.sqrt(additionalDamage) * 2),
                duration: 500 + additionalDamage * 5,
                scaleX: 0.25 + additionalDamage * 0.006,
                scaleY: 0.25 + additionalDamage * 0.006,
                rotation: (Math.random() - 0.5) * 2,
                ease: 'Quad.easeIn',
                onComplete: () => {
                    this.createDamageEffect(rockObj.x, rockObj.y, rockObj.depth);
                    messageBus.publish('enemyTakeDamage', 12 + additionalDamage);
                    poolManager.returnItemToPool(rockObj, 'rock');
                }
            });
        }

        let spellName = 'MATTER STRIKE';
        if (numAdditionalAttacks > 1) {
            spellName += " X" + numAdditionalAttacks;
        }
        if (additionalDamage >= 60) {
            spellName = "MASSIVE " + spellName;
        } else if (additionalDamage >= 30) {
            spellName = "GREAT " + spellName;
        } else if (additionalDamage > 1) {
            spellName = "HEAVY " + spellName;
        }
        this.postAttackCast(spellID, 0, spellName);
    }
    castMatterReinforce() {
        const spellID = 'matterReinforce';
        let brickObj;
        let brickObj2;
        let existingBuff = globalObjects.player.getStatuses()[spellID];
        let statusObj;
        if (existingBuff) {
            // already got a buff in place
            brickObj = existingBuff.animObj[0];
            brickObj2 = existingBuff.animObj[1];
            statusObj = existingBuff.statusObj;
        } else {
            this.cleanseForms();
            brickObj = this.scene.add.sprite(gameConsts.halfWidth, globalObjects.player.getY(), 'spells', 'brickPattern1.png');
            brickObj2 = this.scene.add.sprite(gameConsts.halfWidth, globalObjects.player.getY(), 'spells', 'brickPattern2.png');
        }

        let spellMult = globalObjects.player.spellMultiplier();
        brickObj.rotation = -1 - 0.75 * spellMult;
        brickObj.setDepth(10);
        brickObj2.setDepth(10);
        brickObj.setOrigin(0.5, 0.5);
        brickObj2.setOrigin(0.5, 0.5);
        brickObj.alpha = 0.02;
        brickObj2.alpha = 0.02;
        brickObj.setScale(0.8);
        brickObj2.setScale(0.8);
        let protectionAmt = 2;
        let damageAmt = 2;
        this.scene.tweens.add({
            targets: brickObj,
            duration: 400 + 50 * spellMult,
            scaleX: 1.01 + 0.015 * spellMult,
            scaleY: 1.01 + 0.015 * spellMult,
            alpha: 0.8,
            rotation: 0,
            ease: 'Cubic.easeIn',
            onComplete: () => {
                brickObj.alpha = 1;
                this.scene.tweens.add({
                    targets: brickObj,
                    delay: 500,
                    duration: 1000,
                    alpha: 0.5,
                    ease: 'Quad.easeOut'
                });
                let scaleAmt = 0.994 + 0.006 * Math.sqrt(spellMult);
                brickObj.origScale = scaleAmt;
                this.scene.tweens.add({
                    targets: brickObj,
                    scaleX: scaleAmt,
                    scaleY: scaleAmt,
                    duration: 500,
                    ease: 'Cubic.easeOut'
                });
            }
        });

        this.scene.tweens.add({
            targets: brickObj2,
            delay: 200,
            duration: 400,
            scaleX: 1.04,
            scaleY: 1.04,
            alpha: 0.7,
            ease: 'Quart.easeIn',
            onComplete: () => {
                brickObj2.alpha = 1;
                this.scene.tweens.add({
                    targets: brickObj2,
                    delay: 500,
                    duration: 1000,
                    alpha: 0.5,
                    ease: 'Quad.easeOut'
                });
                let scaleAmt = 0.925 + 0.085 * Math.sqrt(spellMult);
                brickObj2.origScale = scaleAmt;
                this.scene.tweens.add({
                    targets: brickObj2,
                    scaleX: scaleAmt,
                    scaleY: scaleAmt,
                    duration: 500,
                    ease: 'Cubic.easeOut'
                });
            }
        });
        let totalProtection = spellMult * protectionAmt;
        messageBus.publish('selfTakeEffect', {
            name: spellID,
            spellID: spellID,
            animObj: [brickObj, brickObj2],
            protection: totalProtection,
            damage: spellMult * damageAmt,
            spriteSrc1: 'rune_reinforce_glow.png',
            spriteSrc2: 'rune_matter_glow.png',
            displayAmt: totalProtection,
            statusObj: statusObj,
            cleanUp: (statuses) => {
                if (statuses[spellID] && !statuses[spellID].currentAnim) {
                    statuses[spellID].currentAnim = this.scene.tweens.add({
                        targets: statuses[spellID].animObj,
                        duration: 300,
                        scaleX: 0.5,
                        scaleY: 0.5,
                        alpha: 0,
                        ease: 'Back.easeIn',
                        onComplete: () => {
                            while (statuses[spellID] && statuses[spellID].animObj.length > 0) {
                                let item = statuses[spellID].animObj.pop()
                                item.destroy();
                                if (statuses[spellID].animObj.length == 0) {
                                    statuses[spellID] = null;
                                }
                            }
                        }
                    });
                }
            }
        });

        let spellName = "THORN FORM";
        if (spellMult >= 6) {
            spellName = "THORN FORM x6"
        } else if (spellMult >= 3) {
            spellName = "THORN FORM x3";
        }
        this.postNonAttackCast(spellID, spellName)
    }
    castMatterEnhance() {
        let newSpike;
        const spellID = 'matterEnhance';

        let itemsToTween = [];
        let multiplier = 0;
        let statusObj;
        let existingBuff = globalObjects.player.getStatuses()[spellID];
        if (existingBuff) {
            statusObj = existingBuff.statusObj;
            // already got a buff in place
            multiplier = existingBuff.multiplier;
            itemsToTween = existingBuff.animObj;
        }
        let itemsToAnimate = [];
        for (let i = 0; i < globalObjects.player.spellMultiplier(); i++) {
            newSpike = this.scene.add.sprite(gameConsts.halfWidth, globalObjects.player.getY(), 'spells', 'matter_boost.png');
            let thisSpikeIndex = multiplier + i;
            if (thisSpikeIndex % 2 == 0) {
                newSpike.rotation = -0.7 - thisSpikeIndex * 0.1;
                newSpike.setScale(1, 0.75);
            } else {
                newSpike.rotation = 0.6 + thisSpikeIndex * 0.1;
                newSpike.setScale(-1, 0.75);
            }
            itemsToAnimate.push(newSpike);
            itemsToTween.push(newSpike);
        }

        for (let i = 0; i < itemsToAnimate.length; i++) {
            this.scene.tweens.add({
                targets: itemsToAnimate[i],
                delay: itemsToAnimate.length * Math.random() * 50,
                duration: 325 + Math.random() * 200,
                ease: 'Back.easeOut',
                scaleY: 0.95 + Math.random() * 0.1
            });
        }

        messageBus.publish("selfTakeEffect", {
            ignoreBuff: true,
            name: spellID,
            spellID: spellID,
            animObj: itemsToTween,
            multiplier: itemsToTween.length,
            statusObj: statusObj,
            cleanUp: (statuses) => {
                if (statuses[spellID] && !statuses[spellID].currentAnim) {
                    let objectsToCleanup = statuses[spellID].animObj;
                    statuses[spellID].currentAnim = this.scene.tweens.add({
                        targets: objectsToCleanup,
                        duration: 350 + objectsToCleanup.length * 50,
                        rotation: 0,
                        ease: 'Cubic.easeInOut',
                        onComplete: () => {
                            for (let i = 0; i < objectsToCleanup.length; i++) {
                                objectsToCleanup[i].destroy();
                            }
                        }
                    });
                    statuses[spellID].currentAnim = this.scene.tweens.add({
                        targets: statuses[spellID].animObj,
                        duration: 350 + statuses[spellID].animObj.length * 50,
                        scaleX: 0.6,
                        scaleY: 0.6,
                        ease: 'Cubic.easeIn'
                    });
                }
            }
        });
        let spellName = "ADD STRONGER ATTACK";
        if (itemsToAnimate.length > 1) {
            spellName += " X" + itemsToAnimate.length;
        }

        this.postNonAttackCast(spellID, spellName);
    }

    castMatterProtect(shieldID, rotation) {
        const spellID = 'matterProtect';
        this.cleanUpExistingShield(shieldID);
        let spellMultiplier = globalObjects.player.spellMultiplier();

        let animation2 = this.scene.add.sprite(gameConsts.halfWidth, MAGIC_CIRCLE_HEIGHT - 225, 'spells', 'impact.png');
        animation2.startX = animation2.x;
        animation2.startY = animation2.y;
        animation2.setDepth(1);
        animation2.setOrigin(0.5, 1);
        animation2.rotation = 0;
        animation2.visible = false;
        animation2.rotateOffset = 0;

        let animation1 = this.scene.add.sprite(gameConsts.halfWidth, MAGIC_CIRCLE_HEIGHT, 'spells', 'stoneShield.png');
        animation1.setDepth(1);
        animation1.setOrigin(0.5, 1);
        animation1.setScale(0.75);
        animation1.origScaleX = 0.95 + spellMultiplier * 0.06;
        animation1.rotation = 0;

        let textHealth = this.scene.add.bitmapText(gameConsts.halfWidth, MAGIC_CIRCLE_HEIGHT - 222, 'block', '0', 32, 1);
        textHealth.startX = textHealth.x;
        textHealth.startY = textHealth.y;
        textHealth.setOrigin(0.5, 0.5);
        textHealth.setDepth(120);
        textHealth.setScale(0);

        for (let i = 0; i < spellMultiplier; i++) {
            let rockAnim =  this.scene.add.sprite(gameConsts.halfWidth, MAGIC_CIRCLE_HEIGHT - 200, 'spells', 'rockCircle.png');
            rockAnim.setDepth(120);
            rockAnim.setScale(0.75 + i * 0.3);
            rockAnim.setAlpha(0);
            rockAnim.rotation = Math.random() * 6.28;
            this.scene.tweens.add({
                delay: i * 150 - 150,
                targets: rockAnim,
                duration: 250,
                scaleX: 0,
                scaleY: 0,
                y: "-=30",
                alpha: 1,
                onComplete: () => {
                    rockAnim.destroy();
                }
            });
        }

        let shieldHealth = 12 * spellMultiplier;
        textHealth.setText(shieldHealth);
        messageBus.publish('setTempRotObjs', [animation1], rotation);

        this.scene.tweens.add({
            targets: textHealth,
            delay: 200,
            duration: 400,
            scaleX: 1,
            scaleY: 1,
            ease: 'Cubic.easeOut',
        });

        if (animation1.currAnim) {
            animation1.currAnim.stop();
        }
        this.scene.tweens.add({
            targets: animation1,
            duration: 300,
            scaleX: 1.1,
            scaleY: 1.1,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                animation2.setDepth(117);
                animation1.setDepth(117);
                animation1.currAnim = this.scene.tweens.add({
                    targets: animation1,
                    duration: 350,
                    scaleX: 1,
                    scaleY: 1,
                    ease: 'Cubic.easeIn',
                    onComplete: () => {
                        animation1.currAnim = null;
                    }
                });
                messageBus.publish("selfTakeEffect", {
                    name: shieldID,
                    spellID: shieldID,
                    type: 'matter',
                    animObj: [animation1, textHealth, animation2],
                    spriteSrc1: 'rune_protect_glow.png',
                    spriteSrc2: 'rune_matter_glow.png',
                    shakeAmt: 0,
                    impactVisibleTime: 0,
                    multiplier: spellMultiplier,
                    health: shieldHealth,
                    displayAmt: shieldHealth,
                    lockRotation: rotation,
                    active: true,
                    ignoreBuff: true,
                    cleanUp: (statuses) => {
                        if (statuses[shieldID] && !statuses[shieldID].currentAnim) {
                            animation2.setDepth(1);
                            animation1.setDepth(1);
                            statuses[shieldID].currentAnim = this.scene.tweens.add({
                                targets: animation1,
                                duration: 175,
                                scaleX: "-=0.2",
                                scaleY: "-=0.2",
                                alpha: 0,
                                ease: 'Quad.easeIn',
                                onComplete: () => {
                                    animation1.destroy();
                                    animation2.destroy();
                                    textHealth.destroy();
                                }
                            });
                            messageBus.publish('selfClearEffect', shieldID, true);
                            statuses[shieldID] = null;
                        }
                    }
                });
            }
        });

        let spellName = "SHIELD OF STONE";
        let bonusSize = 0;
        if (spellMultiplier >= 3) {
            spellName = "SHIELD OF STONE X" + spellMultiplier;
            bonusSize = 0.1;
        }
        this.postNonAttackCast(spellID, spellName, bonusSize);
    }

    castMatterUnload() {
        const spellID = 'matterUnload';
        let attackObjects = [];
        let numAdditionalAttacks = globalObjects.player.attackEnhanceMultiplier();
        let additionalDamage = globalObjects.player.attackDamageAdder();
        let multiplier = globalObjects.player.spellMultiplier();

        let separationAmtX = Math.max(5, 30 - numAdditionalAttacks);
        let bonusScaleX = additionalDamage * 0.007;
        let bonusScaleY = additionalDamage * 0.0025;

        for (let i = 0; i < numAdditionalAttacks; i++) {
            let xPos = gameConsts.halfWidth + (numAdditionalAttacks - 1) * -separationAmtX + separationAmtX * 2 * i;
            let halfwayIdx = (numAdditionalAttacks - 1) * 0.5;
            let yPos = gameConsts.height - 330 + Math.abs(halfwayIdx - i) * 10;
            let rockObj = this.scene.add.sprite(xPos, yPos, 'spells', 'stalagmite.png');
            rockObj.setDepth(9);
            rockObj.setOrigin(0.5, 0.98);
            rockObj.rotation = 0;
            attackObjects.push(rockObj);
            rockObj.setScale(0.8 + bonusScaleX, 0);
        }

        let delayInterval = Math.max(5, 15 - numAdditionalAttacks);
        let existingBuff = globalObjects.player.getStatuses()[spellID];
        let stoneCircle;
        let textHealth;

        let statusObj;
        if (existingBuff) {
            // already got a buff in place
            stoneCircle = existingBuff.animObj[0];
            textHealth = existingBuff.animObj[1];
            statusObj = existingBuff.statusObj;
            this.scene.tweens.add({
                targets: stoneCircle,
                alpha: 0.5,
                scaleX: 0.61,
                scaleY: 0.61,
                duration: 200
            });
        } else {
            stoneCircle = this.scene.add.sprite(gameConsts.halfWidth, globalObjects.player.getY(), 'spells', 'stoneCircle.png');
            stoneCircle.setAlpha(0.5).setScale(0.605).setRotation(-0.3);

            textHealth = this.scene.add.bitmapText(gameConsts.halfWidth, globalObjects.player.getY() - 44, 'block', '0', 48, 1);
            textHealth.startX = textHealth.x;
            textHealth.startY = textHealth.y;
        }
        textHealth.setDepth(120).setOrigin(0.5, 0.5).setScale(0);
        stoneCircle.setDepth(10);
        let shieldHealth = 18 * multiplier;
        this.scene.tweens.add({
            targets: stoneCircle,
            delay: 250,
            scaleX: 0.72,
            scaleY: 0.72,
            alpha: 1,
            rotation: 0,
            duration: 300,
            ease: 'Cubic.easeOut',
            onStart: () => {
                stoneCircle.setAlpha(0.5);
                textHealth.setText(shieldHealth);
                this.scene.tweens.add({
                    targets: textHealth,
                    duration: 350,
                    scaleX: 1,
                    scaleY: 1,
                    ease: 'Cubic.easeOut',
                });
            },
            onComplete: () => {
                stoneCircle.setDepth(118);
                this.scene.tweens.add({
                    targets: stoneCircle,
                    scaleX: 0.7,
                    scaleY: 0.7,
                    duration: 300,
                    ease: 'Cubic.easeIn',
                });
            }
        });

        messageBus.publish("selfTakeEffect", {
            name: spellID,
            spellID: spellID,
            type: 'matter',
            animObj: [stoneCircle, textHealth],
            spriteSrc1: 'rune_unload_glow.png',
            spriteSrc2: 'rune_matter_glow.png',
            multiplier: multiplier,
            health: shieldHealth,
            displayAmt: shieldHealth,
            statusObj: statusObj,
            shakeAmt: 0,
            impactVisibleTime: 0,
            duration: 6,
            active: true,
            cleanUp: (statuses) => {
                if (statuses[spellID] && !statuses[spellID].currentAnim) {
                    stoneCircle.setDepth(0);
                    statuses[spellID].currentAnim = this.scene.tweens.add({
                        targets: [stoneCircle, textHealth],
                        duration: 240,
                        y: "+=10",
                        scaleX: "-=0.24",
                        scaleY: "-=0.24",
                        ease: 'Quad.easeIn',
                        onComplete: () => {
                            stoneCircle.destroy();
                            textHealth.destroy();
                        }
                    });
                    this.scene.tweens.add({
                        targets: [stoneCircle, textHealth],
                        duration: 240,
                        alpha: 0,
                        ease: 'Quad.easeOut',
                    });
                    messageBus.publish('selfClearEffect', spellID, true);
                    statuses[spellID] = null;
                }
            }
        });

        for (let i = 0; i < attackObjects.length; i++) {
            let rockObj = attackObjects[i];
            this.scene.tweens.add({
                targets: rockObj,
                delay: 300 + i * (200 - i * delayInterval),
                scaleY: 0.68 + bonusScaleY,
                scaleX: 0.85 + bonusScaleX,
                duration: 200,
                ease: 'Cubic.easeIn',
                onStart: () => {
                    setTimeout(() => {
                        for (let i = 0; i < 6; i++) {
                            let velX = (Math.random() - 0.5) * 1;
                            let velY = -0.05 -Math.random() * 0.2;
                            let duration = 250 + Math.random() * 500;
                            this.createRockParticle(rockObj.x + (Math.random() - 0.5) * 25, rockObj.y - Math.random() * 5, velX, velY, duration)
                        }
                    }, 50);
                },
                onComplete: () => {
                    messageBus.publish('enemyTakeDamage', 18 + additionalDamage);
                    zoomTemp(1.01 + additionalDamage * 0.00025);
                    this.createDamageEffect(gameConsts.halfWidth, 140, rockObj.depth);
                    this.scene.tweens.add({
                        targets: rockObj,
                        scaleY: 0.7 + bonusScaleY,
                        scaleX: 0.9 + bonusScaleX,
                        duration: 250,
                        ease: 'Cubic.easeOut',
                        onComplete: () => {
                            this.scene.tweens.add({
                                targets: rockObj,
                                delay: 450,
                                scaleY: 0,
                                duration: 400,
                                alpha: 0,
                                ease: 'Cubic.easeIn',
                                onComplete: () => {
                                    rockObj.destroy();
                                }
                            });
                        }
                    });
                }
            });
        }

        let spellName = "EARTH FORCE";
        if (numAdditionalAttacks > 1) {
            spellName += " X" + numAdditionalAttacks;
        }
        if (additionalDamage >= 60) {
            spellName = "MASSIVE " + spellName;
        } else if (additionalDamage >= 30) {
            spellName = "GREAT " + spellName;
        } else if (additionalDamage > 1) {
            spellName = "HEAVY " + spellName;
        }
        this.postAttackCast(spellID, 300, spellName);

    }

    castTimeStrike() {
        const spellID = 'timeStrike';
        let numAdditionalAttacks = globalObjects.player.attackEnhanceMultiplier();
        let strikeObjects = [];
        for (let i = 0; i < numAdditionalAttacks; i++) {
            let xPos = gameConsts.halfWidth + (numAdditionalAttacks - 1) * -25 + 50 * i;
            let halfwayIdx = (numAdditionalAttacks - 1) * 0.5;
            let yPos = gameConsts.height - 350 + Math.abs(halfwayIdx - i) * 10;
            let strikeObj = this.scene.add.sprite(xPos, yPos, 'spells', 'clock.png');
            strikeObj.setDepth(10);
            strikeObj.rotation = Math.random() - 0.5;
            strikeObj.setScale(1);
            strikeObjects.push(strikeObj);
            this.scene.tweens.add({
                targets: strikeObj,
                duration: 600,
                delay: i * 40,
                scaleX: 0.9,
                scaleY: 0.9,
                ease: 'Cubic.easeOut'
            });
        }

        let additionalDamage = globalObjects.player.attackDamageAdder();
        let goalScale = 0.6 + additionalDamage * 0.02;
        let spellDamage = 10 + additionalDamage;
        for (let i in strikeObjects) {
            let strikeObject = strikeObjects[i];
            let delayAmt = i * 150;
            this.scene.tweens.add({
                delay: delayAmt,
                targets: strikeObject,
                duration: 550,
                rotation: (Math.random() - 0.5) * 10,
                ease: 'Quad.easeOut',
            });

            this.scene.tweens.add({
                delay: delayAmt,
                targets: strikeObject,
                y: 120 + (Math.random()) - 0.5 * 5,
                duration: 550,
                scaleX: goalScale,
                scaleY: goalScale,
                ease: 'Back.easeOut',
                easeParams: [0.25],
                onComplete: () => {
                    this.scene.tweens.add({
                        targets: strikeObject,
                        duration: 200,
                        scaleX: goalScale + 0.4,
                        scaleY: goalScale + 0.4,
                        alpha: 0,
                        onComplete: () => {
                            strikeObject.destroy();
                        }
                    });

                    messageBus.publish('enemyStartDamageCountdown');
                    messageBus.publish('enemyTakeDamage', spellDamage);
                }
            });
            let offsetX = (Math.random() - 0.5) * 150;
            let offsetGoal = gameConsts.halfWidth + offsetX;
            this.scene.tweens.add({
                delay: delayAmt,
                targets: strikeObject,
                x: offsetGoal,
                duration: 200,
                ease: 'Quad.easeOut',
                onComplete: () => {
                    this.scene.tweens.add({
                        targets: strikeObject,
                        x: gameConsts.halfWidth * 0.8 + offsetGoal * 0.2,
                        duration: 200,
                        ease: 'Quad.easeIn',
                        onComplete: () => {
                            this.scene.tweens.add({
                                targets: strikeObject,
                                x: gameConsts.halfWidth + (Math.random()) - 0.5 * 5,
                                duration: 150,
                                easeParams: [0.5],
                                ease: 'Back.easeOut'
                            });
                        }
                    });
                }
            });
        }

        let spellName = "TIME STRIKE";
        if (numAdditionalAttacks > 1) {
            spellName += " X"+numAdditionalAttacks;
        }
        if (additionalDamage > 1) {
            spellName = "DAMAGING " + spellName;
        }
        this.postAttackCast(spellID, 300, spellName);
    }
    castTimeReinforce() {
        const spellID = 'timeReinforce';
        let multiplier = globalObjects.player.spellMultiplier();
        let healthRewoundPercent = 1 - 0.5 ** multiplier;
        let bigClock = this.scene.add.sprite(gameConsts.halfWidth, globalObjects.player.getY(), 'spells', 'clock_back_large.png');
        bigClock.setDepth(120);
        bigClock.setScale(0.72);
        bigClock.alpha = 0;
        let clockArm = this.scene.add.sprite(gameConsts.halfWidth, globalObjects.player.getY(), 'spells', 'clock_arm_large.png');
        clockArm.setDepth(120);
        clockArm.setOrigin(0.01, 0.5);
        clockArm.setScale(0.72);
        clockArm.alpha = 0;
        clockArm.rotation = -Math.PI * 0.5;

        this.scene.tweens.add({
            targets: [bigClock, clockArm],
            duration: 300,
            alpha: 0.4 + multiplier * 0.1,
            scaleX: 0.67,
            scaleY: 0.67,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                messageBus.publish('selfHealRecent', healthRewoundPercent);
            }
        });

        this.scene.tweens.add({
            targets: [clockArm],
            duration: 1200,
            rotation: -Math.PI * 0.5 - (Math.PI * 2 * healthRewoundPercent),
            ease: 'Cubic.easeInOut'

        });

        this.scene.tweens.add({
            targets: [bigClock],
            duration: 1200,
            rotation: 0.05,
            ease: 'Cubic.easeInOut'
        });

        this.scene.tweens.add({
            targets: [bigClock, clockArm],
            delay: 900,
            duration: 500,
            scaleX: 0.75,
            scaleY: 0.75,
            alpha: 0
        });

        let spellName = "UNDO WOUNDS";
        if (multiplier > 1) {
            spellName += " X" + multiplier;
        }

        this.postNonAttackCast(spellID, spellName);
    }
    castTimeEnhance() {
        // Slows down opponent drastically for brief moment
        const spellID = 'timeEnhance';
        let existingBuff = globalObjects.player.getStatuses()[spellID];
        let timeObj;
        let multiplier = globalObjects.player.spellMultiplier();
        if (existingBuff) {
            multiplier += existingBuff.multiplier;
            let newScale = 1 + multiplier * 0.5;
            timeObj = existingBuff.animObj;
            this.scene.tweens.add({
                targets: timeObj,
                duration: 300,
                ease: 'back.easeOut',
                scaleX: newScale,
                scaleY: newScale,
            });
        } else {
            timeObj = this.scene.add.sprite(gameConsts.halfWidth + 195, gameConsts.height - 285, 'spells', 'clock.png');
            timeObj.setScale(0);
            timeObj.setDepth(10);
            let newScale = 0.66 + multiplier * 0.33;
            this.scene.tweens.add({
                targets: timeObj,
                duration: 250,
                ease: 'back.easeOut',
                scaleX: newScale,
                scaleY: newScale,
            });
            this.scene.tweens.add({
                targets: timeObj,
                duration: 12000,
                rotation: 6.283,
                repeat: -1
            });
        }

        messageBus.publish("selfTakeEffect", {
            ignoreBuff: true,
            name: spellID,
            spellID: spellID,
            animObj: timeObj,
            multiplier: multiplier,
            cleanUp: (statuses) => {
                if (statuses[spellID] && !statuses[spellID].currentAnim) {
                    timeObj.setScale(timeObj.scaleX * 1.3);
                    statuses[spellID].currentAnim = this.scene.tweens.add({
                        targets: timeObj,
                        duration: 150,
                        alpha: 0,
                        ease: 'Quad.easeOut',
                        onComplete: () => {
                            statuses[spellID] = null;
                            timeObj.destroy();
                        }
                    });
                }
            }
        });


        let spellName = "ADD PAUSING ATTACK";
        if (multiplier > 1) {
            spellName += " X" + multiplier;
        }
        this.postNonAttackCast(spellID, spellName);
    }
    castTimeProtect(shieldID, rotation) {
        const spellID = 'timeProtect';
        this.cleanUpExistingShield(shieldID);

        let statusObj;
        let existingBuff = globalObjects.player.getStatuses()[spellID];
        if (existingBuff) {
            // already got a buff in place
            statusObj = existingBuff.statusObj;
        }

        let animation1 = this.scene.add.sprite(gameConsts.halfWidth, MAGIC_CIRCLE_HEIGHT, 'spells', 'clockShield.png');
        animation1.setDepth(118);
        animation1.setOrigin(0.5, 1);
        animation1.setScale(0.75);
        animation1.origScaleX = 0.95;
        animation1.rotation = rotation;

        messageBus.publish('setTempRotObjs', [animation1], rotation);

        let multiplier = globalObjects.player.spellMultiplier();

        // TODO Remove timeshield

        this.scene.tweens.add({
            targets: animation1,
            duration: 400,
            ease: 'Cubic.easeOut',
            scaleX: 0.95,
            scaleY: 0.965,
            onStart: () => {
                messageBus.publish("selfTakeEffect", {
                    name: shieldID,
                    spellID: shieldID,
                    type: 'time',
                    animObj: [animation1],
                    lockRotation: rotation,
                    duration: 30 * multiplier,
                    spriteSrc1: 'rune_protect_glow.png',
                    spriteSrc2: 'rune_time_glow.png',
                    displayAmt: 0,
                    active: true,
                    multiplier: multiplier,
                    statusObj: statusObj,
                    cleanUp: (statuses) => {
                        if (statuses[shieldID] && !statuses[shieldID].currentAnim) {
                            statuses[shieldID].currentAnim = this.scene.tweens.add({
                                targets: animation1,
                                duration: 250,
                                scaleX: 0.55,
                                scaleY: 0.55,
                                alpha: 0,
                                ease: 'Quad.easeOut',
                                onComplete: () => {
                                    animation1.destroy();
                                }
                            });
                            messageBus.publish('selfClearEffect', shieldID, true);
                            statuses[shieldID] = null;
                        }
                    }
                });
            },
        });

        let boost = 0;
        let spellName = "SHIELD OF DELAY";
        this.postNonAttackCast(spellID, spellName, boost);
    }
    castTimeUnload() {
        const spellID = 'timeUnload';

        let multiplier = globalObjects.player.spellMultiplier();
        this.cleanseForms();

        messageBus.publish('manualSetTimeSlowRatio', 0.1, multiplier);
        let spellName = "ACCELERATED FORM";
        let boost = 0;
        if (multiplier > 3) {
            spellName = "A SINGLE MOMENT\nOF FOREVER";
            boost = 0.2;
        } else if (multiplier > 1) {
            spellName = "ACCELERATED FORM x" + multiplier;
            boost = 0.1;
        }

        this.postNonAttackCast(spellID, spellName);
    }

    castMindStrike() {
        const spellID = 'mindStrike';

        let attackObjects = [];
        let numAdditionalAttacks = globalObjects.player.attackEnhanceMultiplier();
        let additionalDamage = globalObjects.player.attackDamageAdder();

        for (let i = 0; i < numAdditionalAttacks; i++) {
            let xPos = gameConsts.halfWidth + (numAdditionalAttacks - 1) * -25 + 50 * i;
            let halfwayIdx = (numAdditionalAttacks - 1) * 0.5;
            let yPos = gameConsts.height - 360 + Math.abs(halfwayIdx - i) * 10 + additionalDamage;
            let attackObj = this.scene.add.sprite(xPos, yPos, 'spells', 'lightningBolt.png');
            attackObj.setDepth(10);
            attackObj.rotation = Math.random() - 0.5;
            attackObjects.push(attackObj);
            attackObj.setScale(0);
            attackObj.setOrigin(0.5, 0.1);
        }

        let yPos = 200;
        for (let i = 0; i < attackObjects.length; i++) {
            let attackObj = attackObjects[i];
            let delayAmt = 50 + i * (190 - attackObjects.length * 6);
            this.scene.tweens.add({
                targets: attackObj,
                delay: delayAmt,
                duration: 200,
                scaleX: 0.45 + additionalDamage * 0.004,
                scaleY: 0.45 + additionalDamage * 0.004,
                rotation: (-Math.atan2(yPos, gameConsts.halfWidth - attackObj.x) + 1.57),
                ease: 'Cubic.easeOut'
            });
            this.scene.tweens.add({
                targets: attackObj,
                delay: delayAmt,
                x: gameConsts.halfWidth,
                y: yPos,
                ease: 'Quad.easeIn',
                duration: 400 + additionalDamage * 3,
                onComplete: () => {
                    let dmgEffect = this.scene.add.sprite(attackObj.x, attackObj.y, 'spells').play('shockEffect').setDepth(attackObj.depth).setScale(0.5).setRotation(Math.random() * 6);
                    let randScale = 1.15 + 0.1 * Math.random();
                    this.scene.tweens.add({
                        targets: dmgEffect,
                        scaleX: randScale,
                        scaleY: randScale,
                        duration: 300,
                        ease: 'Cubic.easeOut',
                        onComplete: () => {
                            dmgEffect.destroy();
                        }
                    });

                    messageBus.publish('enemyTakeDamage', 6 + additionalDamage);
                    if (globalObjects.currentEnemy && !globalObjects.currentEnemy.dead) {
                        let animation1 = this.scene.add.sprite(attackObj.x - 55, attackObj.y, 'spells').play('weaken');
                        animation1.setDepth(10);
                        animation1.rotation = -1.58;
                        animation1.setOrigin(0.5, 1);
                        let animation2 = this.scene.add.sprite(attackObj.x + 55, attackObj.y, 'spells').play('weaken');
                        animation2.setDepth(10);
                        animation2.rotation = 1.58;
                        animation2.setOrigin(0.5, 1);
                        messageBus.publish('enemyTakeEffect', {
                            name: spellID,
                            cleanUp: (statuses) => {
                                if (statuses[spellID] && !statuses[spellID].currentAnim) {
                                    statuses[spellID].currentAnim = this.scene.tweens.add({
                                        targets: [animation1,animation2],
                                        duration: 300,
                                        scaleX: 1.4,
                                        scaleY: 1.4,
                                        alpha: 0,
                                        ease: 'Quad.easeOut',
                                        onComplete: () => {
                                            animation1.destroy();
                                            animation2.destroy();
                                        }
                                    });
                                    statuses[spellID] = null;
                                }
                            }
                        });
                    }

                    this.scene.tweens.add({
                        targets: attackObj,
                        alpha: 0,
                        scaleX: "+= 0.2",
                        duration: 150,
                        onComplete: () => {
                            attackObj.destroy();
                        }
                    });
                }
            });
        }

        let spellName = "MIND STRIKE";

        if (numAdditionalAttacks > 1) {
            spellName += " X" + numAdditionalAttacks;
        }
        if (additionalDamage >= 60) {
            spellName = "DEVASTATING " + spellName;
        } else if (additionalDamage >= 30) {
            spellName = "DESTRUCTIVE " + spellName;
        } else if (additionalDamage > 1) {
            spellName = "DEADLY " + spellName;
        }
        this.postAttackCast(spellID, 0, spellName);

    }
    castMindReinforce() {
        const spellID = 'mindReinforce';
        let multiplier = globalObjects.player.spellMultiplier();
        let existingBuff = globalObjects.player.getStatuses()[spellID];
        let statusObj;
        if (existingBuff) {
            // already got a buff in place
            statusObj = existingBuff.statusObj;
        } else {
            this.cleanseForms();
        }
        let electricCircle = this.scene.add.sprite(gameConsts.halfWidth, globalObjects.player.getY(), 'spells').play('powerEffect').setScale(3.4).setDepth(117);
        let repeatCircle = this.scene.add.sprite(gameConsts.halfWidth, globalObjects.player.getY(), 'spells').play('powerEffectRepeat').setScale(1.5).setDepth(117);


        this.scene.tweens.add({
            targets: repeatCircle,
            duration: 400,
            scaleX: 1.9,
            scaleY: 1.9,
            alpha: 0.8,
            ease: 'Cubic.easeOut',
            completeDelay: 250,
            onComplete: () => {
                repeatCircle.setScale(1.6);
            }
        });

        //shockEffect
        this.scene.tweens.add({
            targets: electricCircle,
            duration: 500,
            scaleX: 3.55,
            scaleY: 3.55,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                electricCircle.destroy();
            }
        });

        let buffAmt = 2;
        if (multiplier > 1) {
            buffAmt = 2 * multiplier;
        }
        messageBus.publish('selfTakeEffect', {
            name: spellID,
            spellID: spellID,
            animObj: [repeatCircle],
            multiplier: multiplier,
            spriteSrc1: 'rune_reinforce_glow.png',
            spriteSrc2: 'rune_mind_glow.png',
            displayAmt: buffAmt,
            statusObj: statusObj,
            cleanUp: (statuses) => {
                if (statuses[spellID] && !statuses[spellID].currentAnim) {
                    statuses[spellID].currentAnim = this.scene.tweens.add({
                        targets: statuses[spellID].animObj,
                        duration: 300,
                        scaleX: 0.55,
                        scaleY: 0.55,
                        alpha: 0,
                        ease: 'Cubic.easeOut',
                        onComplete: () => {
                            while (statuses[spellID] && statuses[spellID].animObj.length > 0) {
                                let item = statuses[spellID].animObj.pop()
                                item.destroy();
                                if (statuses[spellID].animObj.length == 0) {
                                    statuses[spellID] = null;
                                }
                            }
                        }
                    });
                }
            }
        });


        let spellName = "POWER FORM";
        if (multiplier >= 3) {
            spellName = "SUPER POWER FORM";
            if (multiplier >= 6) {
                spellName = "ULTRA POWER FORM";
            }
            if (multiplier >= 2) {
                spellName += " X" + multiplier;
            }
        }
        this.postNonAttackCast(spellID, spellName);
    }
    castMindEnhance() {
        const spellID = 'mindEnhance';
        // next attack hits +1 time
        let existingBuff = globalObjects.player.getStatuses()[spellID];
        let mindObjects = [];
        if (existingBuff) {
            mindObjects = existingBuff.animObj;
        }

        let numAdditionalAttacks = globalObjects.player.spellMultiplier();
        let addedActualAttacks = numAdditionalAttacks;
        let numTotalAttacks = numAdditionalAttacks + mindObjects.length;

        if (mindObjects.length > 0) {
            // shift to the left the existing mind objects
            for (let i = 0; i < mindObjects.length; i++) {
                let xPos = gameConsts.halfWidth + (numTotalAttacks - 1) * -25 + 50 * i;
                let halfwayIdx = (numTotalAttacks - 1) * 0.5;
                let yPos = gameConsts.height - 360 + Math.abs(halfwayIdx - i) * 10;
                this.scene.tweens.add({
                    targets: mindObjects[i],
                    duration: 300,
                    x: xPos,
                    y: yPos,
                    ease: 'Cubic.easeOut',
                    onComplete: () => {
                    }
                });
            }
        } else {
            numAdditionalAttacks++;
            numTotalAttacks = numAdditionalAttacks + mindObjects.length;
        }
        let mindObjectsLength = mindObjects.length;
        for (let i = mindObjects.length; i < mindObjectsLength + numAdditionalAttacks; i++) {
            // set up new ones
            let xPos = gameConsts.halfWidth + (numTotalAttacks - 1) * -25 + 50 * i;
            let halfwayIdx = (numTotalAttacks - 1) * 0.5;
            let yPos = gameConsts.height - 360 + Math.abs(halfwayIdx - i) * 10;
            let mindObj = this.scene.add.sprite(xPos, yPos, 'spells', 'mindEffect.png');
            mindObj.setDepth(10);
            mindObj.rotation = Math.random() - 0.5;
            mindObjects.push(mindObj);
            mindObj.setScale(0);
            this.scene.tweens.add({
                targets: mindObj,
                duration: 300,
                scaleX: 1,
                scaleY: 1,
                ease: 'Cubic.easeOut'
            });

            this.scene.tweens.add({
                targets: mindObj,
                duration: 4200 / (gameVars.timeSlowRatio * 0.5 + 0.5),
                rotation: "+=6.283",
                repeat: -1
            });
        }
        this.scene.tweens.add({
            targets: mindObjects[0],
            duration: 300,
            alpha: 0.99,
            onComplete: () => {
                messageBus.publish("selfTakeEffect", {
                    name: spellID,
                    spellID: spellID,
                    animObj: mindObjects,
                    multiplier: mindObjects.length,
                    ignoreBuff: true,
                    cleanUp: (statuses) => {
                        // do we even need multiplier?
                        if (statuses[spellID] && !statuses[spellID].currentAnim) {
                            statuses[spellID].currentAnim = this.scene.tweens.add({
                                targets: mindObjects,
                                duration: 150,
                                scaleX: 0,
                                scaleY: 0,
                                ease: 'Quad.easeOut',
                                onComplete: () => {
                                    for (let i = 0; i < mindObjects.length; i++) {
                                        mindObjects[i].destroy();
                                    }
                                    statuses[spellID] = null;
                                }
                            });
                        }
                    }
                });
            }
        });

        let spellName = "ADD EXTRA ATTACK +"+addedActualAttacks;
        this.postNonAttackCast(spellID, spellName);

    }
    castMindProtect(shieldID, rotation) {
        const spellID = 'mindProtect';
        this.cleanUpExistingShield(shieldID);
        let spellMultiplier = globalObjects.player.spellMultiplier();
        let animation1 = this.scene.add.sprite(gameConsts.halfWidth, MAGIC_CIRCLE_HEIGHT, 'spells', 'eyeShield.png');

        animation1.setDepth(999);
        animation1.setOrigin(0.5, 1);
        animation1.setScale(0.75);
        animation1.origScaleX =  0.95 + spellMultiplier * 0.05;
        animation1.rotation = 0;
        animation1.alpha = 0;

        let animation2 =  this.scene.add.sprite(gameConsts.halfWidth, MAGIC_CIRCLE_HEIGHT, 'spells', 'laserCore.png');
        animation2.setDepth(999);
        animation2.setOrigin(0.5, 1.328);
        animation2.setScale(1 + spellMultiplier * 0.5, 3);
        animation2.origScaleX = animation2.scaleX;
        animation2.rotation = 0;
        animation2.visible = false;
        messageBus.publish('setTempRotObjs', [animation1, animation2], rotation);

        this.scene.tweens.add({
            targets: animation1,
            duration: 350,
            scaleX: 1,
            scaleY: 1,
            alpha: 0.5,
            ease: 'Cubic.easeIn',
            onComplete: () => {
                messageBus.publish("selfTakeEffect", {
                    name: shieldID,
                    spellID: shieldID,
                    type: 'mind',
                    animObj: [animation1, animation2],
                    multiplier: spellMultiplier,
                    spriteSrc1: 'rune_protect_glow.png',
                    spriteSrc2: 'rune_mind_glow.png',
                    duration: 30,
                    cooldown: 0,
                    cooldownMax: 55,
                    rechargeCooldown: 0,
                    warmup: 0,
                    lockRotation: rotation,
                    firing: false,
                    cleanUp: (statuses) => {
                        if (statuses[shieldID] && !statuses[shieldID].currentAnim) {
                            statuses[shieldID].currentAnim = this.scene.tweens.add({
                                targets: [animation1, animation2],
                                duration: 150,
                                scaleX: "+=0.25",
                                alpha: 0,
                                ease: 'Quad.easeOut',
                                onComplete: () => {
                                    animation1.destroy();
                                    animation2.destroy();
                                }
                            });
                            messageBus.publish('selfClearEffect', shieldID, true);
                            statuses[shieldID] = null;
                        }
                    }
                });
            }
        });

        let spellName = "GAZE OF PAIN";
        let bonusSize = 0;
        if (spellMultiplier >= 6) {
            spellName = "GAZE OF DEATH";
            bonusSize = 0.2;
        } else if (spellMultiplier >= 3) {
            spellName = "GAZE OF FIRE";
            bonusSize = 0.1;
        }
        this.postNonAttackCast(spellID, spellName, bonusSize);
    }
    castMindUnload() {
        const spellID = 'mindUnload';
        let existingBuff = globalObjects.player.getStatuses()[spellID];
        let existingMultiplier = 1;
        let magicObjects = [];
        if (existingBuff) {
            existingMultiplier = existingBuff.multiplier;
            magicObjects = existingBuff.animObj;
        }
        let magicObj;
        let newMultiplier = 3;
        if (existingMultiplier > 1) {
            newMultiplier = existingMultiplier + 3;
            magicObj = this.scene.add.sprite(gameConsts.halfWidth, globalObjects.player.getY(), 'spells', 'mind_boost_2.png');
            PhaserScene.tweens.add({
                targets: PhaserScene.cameras.main,
                zoom: 0.95,
                ease: "Cubic.easeOut",
                duration: 850,
                onComplete: () => {
                    PhaserScene.tweens.add({
                        targets: PhaserScene.cameras.main,
                        zoom: 1,
                        ease: "Quart.easeIn",
                        duration: 450
                    });
                }
            });
        } else {
            magicObj = this.scene.add.sprite(gameConsts.halfWidth, globalObjects.player.getY(), 'spells', 'mind_boost.png');
            PhaserScene.tweens.add({
                targets: PhaserScene.cameras.main,
                zoom: 0.988,
                ease: "Cubic.easeOut",
                duration: 550,
                onComplete: () => {
                    PhaserScene.tweens.add({
                        targets: PhaserScene.cameras.main,
                        zoom: 1,
                        ease: "Cubic.easeIn",
                        duration: 200
                    });
                }
            });
        }

        magicObj.setDepth(0);
        magicObj.setScale(0.75);
        magicObj.setAlpha(0.25);
        magicObjects.push(magicObj);

        globalObjects.magicCircle.setAuraAlpha(0.4 + 0.05 * newMultiplier)

        this.scene.tweens.add({
            targets: magicObj,
            duration: 500,
            alpha: 0.75,
            ease: 'Cubic.easeOut',
            scaleX: 0.96,
            scaleY: 0.96,
            onStart: () => {
                messageBus.publish("selfTakeEffect", {
                    ignoreBuff: true,
                    name: spellID,
                    spellID: spellID,
                    animObj: magicObjects,
                    multiplier: newMultiplier,
                    cleanUp: (statuses) => {
                        if (statuses[spellID] && !statuses[spellID].currentAnim) {
                            statuses[spellID].currentAnim = this.scene.tweens.add({
                                targets: magicObjects,
                                duration: 150,
                                alpha: 0,
                                ease: 'Quad.easeOut',
                                onComplete: () => {
                                    statuses[spellID] = null;
                                    for (let i = 0; i < magicObjects.length; i++) {
                                        magicObjects[i].destroy();
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
        this.scene.tweens.add({
            targets: magicObj,
            duration: 35000,
            rotation: "+=3.14",
            repeat: -1
        });

        let spellName = "TRIPLIFY MAGIC";
        let bonusSize = 0.15;
        if (newMultiplier > 6) {
            spellName = "MULTI TRIPLIFY MAGIC";
            bonusSize = 0.25;
        } else if (newMultiplier > 3) {
            spellName = "DOUBLE TRIPLIFY MAGIC";
            bonusSize = 0.25;
        }
        messageBus.publish('recordSpell', spellID, spellName, bonusSize);
    }


    castVoidStrike() {
        const spellID = 'voidStrike';
        let numAdditionalAttacks = globalObjects.player.attackEnhanceMultiplier();
        let additionalDamage = globalObjects.player.attackDamageAdder();
        let fifthSplitAdditionalDamage = Math.round(additionalDamage * 0.2);
        let allStrikeObjects = [];
        let isNormalDir = Math.random() < 0.6 ? 0 : 1;

        // First build the strike objects
        for (let i = 0; i < numAdditionalAttacks; i++) {
            let isLeftStrike = i % 2 == isNormalDir;
            let xPos = gameConsts.halfWidth + (isLeftStrike ? -10 : 10);
            let yPos = gameConsts.height - 265;

            let strikeObj = this.scene.add.sprite(xPos, yPos, 'spells', 'dark_tentacle.png');
            strikeObj.setOrigin(0.15, 1)
            strikeObj.setDepth(10);
            strikeObj.setScale(0);
            strikeObj.setRotation(isLeftStrike ? -2 : 2 + (Math.random() - 0.5) * 0.1);
            allStrikeObjects.push(strikeObj)
        }

        let yOffset = Math.floor(additionalDamage * 0.25);

        for (let i = 0; i < allStrikeObjects.length; i++) {
            let currStrikeObj = allStrikeObjects[i];
            let isLeftStrike = i % 2 == isNormalDir;
            let scaleXMult = isLeftStrike ? 1 : -1;
            this.scene.tweens.add({
                delay: i * 165,
                y: "+=" + yOffset,
                targets: currStrikeObj,
                rotation: currStrikeObj.rotation * 0.9,
                duration: 500,
                ease: 'Cubic.easeOut'
            });
            this.scene.tweens.add({
                delay: i * 165,
                targets: currStrikeObj,
                scaleX: (0.75 + additionalDamage * 0.002) * scaleXMult,
                scaleY: (0.75 + additionalDamage * 0.002),
                duration: 600,
                ease: 'Back.easeOut',
                onComplete: () => {
                    this.scene.tweens.add({
                        targets: currStrikeObj,
                        rotation: isLeftStrike ? 0.13 : -0.13,
                        scaleX: (0.95 + additionalDamage * 0.01) * scaleXMult,
                        scaleY: 1.05 + additionalDamage * 0.01,
                        duration: 700 + additionalDamage,
                        ease: 'Cubic.easeIn',
                        onComplete: () => {
                            messageBus.publish('enemyTakeDamagePercentTotal', 0.5, additionalDamage, false);
                            messageBus.publish('inflictVoidBurn', 0, 5);
                            currStrikeObj.setScale(currStrikeObj.scaleX * 1.04, currStrikeObj.scaleY * 1.04);
                            this.scene.tweens.add({
                                targets: currStrikeObj,
                                rotation: isLeftStrike ? 2.2 : -2.2,
                                scaleX: 0,
                                scaleY: 0,
                                duration: 550 + additionalDamage,
                                ease: 'Cubic.easeOut',
                                onComplete: () => {
                                    currStrikeObj.destroy();
                                }
                            });
                            this.scene.tweens.add({
                                targets: currStrikeObj,
                                scaleX: 0,
                                scaleY: 0,
                                duration: 600,
                                ease: 'Quad.easeOut',
                            });
                        }
                    });
                }
            });
        }


        let spellName = 'VOID STRIKE';
        if (numAdditionalAttacks > 1) {
            spellName += " X" + numAdditionalAttacks;
        }
        if (additionalDamage >= 60) {
            spellName = "DEMOLISHING " + spellName;
        } else if (additionalDamage >= 30) {
            spellName = "DESTRUCTIVE " + spellName;
        } else if (additionalDamage > 1) {
            spellName = "DAMAGING " + spellName;
        }

        this.postAttackCast(spellID, 0, spellName);
    }

    castVoidReinforce(elem, embodi) {
        const spellID = 'voidReinforce';
        let multiplier = globalObjects.player.spellMultiplier();
        this.cleanseForms();

        let shieldObj = this.scene.add.sprite(gameConsts.halfWidth, globalObjects.player.getY(), 'spells', 'blackHoleBig.png');
        shieldObj.setDepth(10);
        shieldObj.setScale(2.2);

        messageBus.publish("selfClearEffect");
        this.scene.tweens.add({
            targets: shieldObj,
            duration: 1000,
            scaleX: 3,
            scaleY: 3,
            alpha: 0,
            onComplete: () => {
                shieldObj.destroy();
            }
        });
        let whiteFade = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight, 'whitePixel').setDepth(99).setScale(500, 500);
        whiteFade.setAlpha(0);
        this.scene.tweens.add({
            targets: whiteFade,
            duration: 1200,
            alpha: 0.25,
        });
        let blackBalls = [];
        for (let i = 0; i < 9; i++) {
            setTimeout(() => {
                let randAngle = (Math.random() - 0.5) * 4.5;
                let dist = 235 + Math.random() * 80;
                let randX = gameConsts.halfWidth + Math.sin(randAngle) * dist;
                let randY = globalObjects.player.getY() - Math.cos(randAngle) * dist;
                let blackBall = this.scene.add.sprite(randX, randY, 'spells', 'blackCircleLarge.png').setDepth(998).setScale(0,0);
                blackBall.setRotation(Math.random() * 6);

                this.scene.tweens.add({
                    targets: blackBall,
                    duration: 530,
                    scaleX: 1.42 + i * 0.03,
                    scaleY: 1.42 + i * 0.03,
                    ease: 'Quint.easeIn',
                });
                this.scene.tweens.add({
                    targets: blackBall,
                    duration: 540,
                    x: gameConsts.halfWidth,
                    y: globalObjects.player.getY(),
                    ease: 'Cubic.easeIn',
                    onComplete: () => {
                        blackBalls.push(blackBall);
                        let fades = [];
                        if (i == 2) {
                            let startTime = 7 * multiplier;
                            let timeText = this.scene.add.bitmapText(gameConsts.halfWidth, globalObjects.player.getY() - 20, 'block', startTime, 48).setDepth(999).setOrigin(0.5, 0.5);
                            let whiteBall = this.scene.add.sprite(gameConsts.halfWidth, globalObjects.player.getY(), 'spells', 'whiteCircle.png').setDepth(99).setScale(6,6).setAlpha(0.6);
                            let blackFade = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setDepth(99).setScale(500, 500).setAlpha(0);
                            fades.push(whiteBall);
                            fades.push(blackFade);
                            fades.push(whiteFade);
                            this.scene.tweens.add({
                                targets: whiteBall,
                                duration: 250,
                                scaleX: 40,
                                scaleY: 40
                            });
                            this.scene.tweens.add({
                                targets: fades,
                                duration: 300,
                                ease: 'Cubic.easeIn',
                                alpha: 0.43
                            });
                            messageBus.publish("startVoidForm", blackBalls);
                            let effectObj = {
                                name: spellID,
                                spellID: spellID,
                                duration: startTime,
                                multiplier: multiplier,
                                cleanUp: (statuses) => {
                                    if (statuses[spellID] && !statuses[spellID].currentAnim) {
                                        for (let i = 0; i < blackBalls.length; i++) {
                                            let ball = blackBalls[i];
                                            let randDir = (Math.random() - 0.5) * 4;
                                            let randDist = 270 + Math.random() * 70;
                                            let randX = ball.x + Math.sin(randDir) * randDist;
                                            let randY = ball.y - Math.cos(randDir) * randDist;
                                            this.scene.tweens.add({
                                                targets: ball,
                                                duration: 450,
                                                ease: 'Cubic.easeOut',
                                                x: randX,
                                                y: randY,
                                            });
                                            this.scene.tweens.add({
                                                targets: ball,
                                                duration: 450 + Math.random() * 100,
                                                ease: 'Quad.easeOut',
                                                scaleX: 0,
                                                scaleY: 0,
                                            });
                                        }

                                        statuses[spellID].currentAnim = this.scene.tweens.add({
                                            targets: fades,
                                            duration: 25,
                                            alpha: 0,
                                            ease: 'Quad.easeIn',
                                            onComplete: () => {
                                                messageBus.publish("stopVoidForm");
                                                statuses[spellID] = null;
                                                for (let i = 0; i < fades.length; i++) {
                                                    fades[i].destroy();
                                                }
                                            }
                                        });
                                    }
                                    timeText.destroy();
                                },
                                onUpdate: () => {
                                    messageBus.publish("selfTakeTrueDamage", 1);
                                    if (effectObj) {
                                        if (fades && fades[1]) {
                                            fades[1].setAlpha(0.42 + 0.02 * (8 - effectObj.duration))
                                        }
                                        timeText.setText(effectObj.duration.toString());
                                    }
                                }
                            };
                            messageBus.publish("selfTakeEffect", effectObj);
                        } else if (i == 8) {
                            for (let j = 0; j < 8; j++) {
                                blackBalls[j].setScale(blackBalls[8].scaleX + 0.08);
                            }
                            this.scene.tweens.add({
                                targets: blackBalls,
                                duration: 250,
                                ease: 'Quad.easeOut',
                                scaleX: blackBalls[8].scaleX,
                                scaleY: blackBalls[8].scaleX,
                            });
                        }
                    }
                });
            }, i * 20);
        }


        let spellName = "VOID FORM";
        if (multiplier >= 3) {
            spellName += " X"+multiplier;
        }
        this.postNonAttackCast(spellID, spellName);
    }
    castVoidEnhance() {
        const spellID = 'voidEnhance';
        let existingBuff = globalObjects.player.getStatuses()[spellID];
        let voidObj;
        let multiplier = globalObjects.player.spellMultiplier();
        if (existingBuff) {
            multiplier += existingBuff.multiplier;
            let newScale = 1 + multiplier * 0.5;
            voidObj = existingBuff.animObj;
            this.scene.tweens.add({
                targets: voidObj,
                duration: 300,
                ease: 'back.easeOut',
                scaleX: newScale,
                scaleY: newScale,
            });
        } else {
            voidObj = this.scene.add.sprite(gameConsts.halfWidth - 195, gameConsts.height - 285, 'spells', 'blackHoleSmall.png');
            voidObj.setScale(0);
            voidObj.setDepth(10);
            let newScale = 1 + multiplier * 0.5;
            this.scene.tweens.add({
                targets: voidObj,
                duration: 250,
                ease: 'back.easeOut',
                scaleX: newScale,
                scaleY: newScale,
            });
            this.scene.tweens.add({
                targets: voidObj,
                duration: 12000,
                rotation: 6.283,
                repeat: -1
            });
        }

        messageBus.publish("selfTakeEffect", {
            ignoreBuff: true,
            name: spellID,
            spellID: spellID,
            animObj: voidObj,
            multiplier: multiplier,
            cleanUp: (statuses) => {
                if (statuses[spellID] && !statuses[spellID].currentAnim) {
                    statuses[spellID].currentAnim = this.scene.tweens.add({
                        targets: voidObj,
                        duration: 150,
                        alpha: 0,
                        scaleX: voidObj.scaleX * 1.25,
                        scaleY: voidObj.scaleY * 1.25,
                        ease: 'Quad.easeOut',
                        onComplete: () => {
                            statuses[spellID] = null;
                            voidObj.destroy();
                        }
                    });
                }
            }
        });

        let spellName = "ADD DISRUPTIVE ATTACK";
        if (multiplier > 1) {
            spellName += " X" + multiplier;
        }
        this.postNonAttackCast(spellID, spellName);
    }
    castVoidProtect(shieldID, rotation) {
        const spellID = 'voidProtect';
        this.cleanUpExistingShield(shieldID);
        let spellMultiplier = globalObjects.player.spellMultiplier();
        let voidAnimations = [];
        let voidEyes = [];

        for (let i = 0; i < 9 + spellMultiplier; i++) {
            let blackCircle = poolManager.getItemFromPool('blackCircle');
            if (!blackCircle) {
                blackCircle = this.scene.add.sprite(gameConsts.halfWidth, MAGIC_CIRCLE_HEIGHT - 200, 'spells', 'blackCircle.png');
            }
            blackCircle.setPosition(gameConsts.halfWidth, MAGIC_CIRCLE_HEIGHT - 200);
            blackCircle.setDepth(120);
            let xOffset = (Math.random() - 0.5) * 400 + spellMultiplier * 20;
            let yOffset = (Math.random() - 0.25) * 150 + spellMultiplier * 20;
            if (Math.abs(xOffset) + Math.abs(yOffset) < 120) {
                xOffset *= 2;
                yOffset *= 2;
                if (Math.abs(xOffset) + Math.abs(yOffset) < 120) {
                    xOffset *= 2;
                    yOffset *= 2;
                }
            }
            blackCircle.x += xOffset;
            blackCircle.y -= yOffset;
            blackCircle.setScale(0);
            blackCircle.setRotation(Math.atan2(-yOffset, xOffset));
            let randSize = 0.25 + Math.random() * 0.75 + 0.07 * spellMultiplier;
            let delayAmt = Math.random() * 200;
            this.scene.tweens.add({
                targets: blackCircle,
                delay: delayAmt,
                duration: 100,
                scaleX: randSize * 1.5,
                scaleY: randSize,
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    this.scene.tweens.add({
                        targets: blackCircle,
                        duration: 150 + Math.floor(randSize * 100),
                        scaleX: randSize * 0.3,
                        scaleY: randSize * 0.25,
                        ease: 'Cubic.easeIn',
                        onComplete: () => {
                            poolManager.returnItemToPool(blackCircle, 'blackCircle');
                        }
                    });
                }
            });
            this.scene.tweens.add({
                targets: blackCircle,
                delay: delayAmt,
                duration: 280 + Math.floor(randSize * 90),
                x: gameConsts.halfWidth,
                y: MAGIC_CIRCLE_HEIGHT - 200,
                ease: 'Cubic.easeIn',
            });
        }

        let shieldArray = [];
        let numCircleParticles = 9;
        let startDist = 145;
        for (let i = 0; i < numCircleParticles; i++) {
            let rotationPos = (i - ((numCircleParticles - 1) / 2)) * 0.12;
            let blackShieldPiece = poolManager.getItemFromPool('blackCircle');
            if (!blackShieldPiece) {
                blackShieldPiece = this.scene.add.sprite(gameConsts.halfWidth, MAGIC_CIRCLE_HEIGHT, 'spells', 'blackCirclePlain.png');
            }
            blackShieldPiece.startX = gameConsts.halfWidth; blackShieldPiece.startY = MAGIC_CIRCLE_HEIGHT;
            let xPos = gameConsts.halfWidth + startDist * Math.sin(rotationPos);
            let yPos = MAGIC_CIRCLE_HEIGHT - 30 - startDist * Math.cos(rotationPos);
            blackShieldPiece.setPosition(xPos, yPos);
            blackShieldPiece.setDepth(11);
            blackShieldPiece.scaleVel = (Math.random() - 0.45) * 0.2;
            blackShieldPiece.setScale(0);
            blackShieldPiece.rotationOffset = rotationPos;
            shieldArray.push(blackShieldPiece);
        }

        // Create the eyes
        for (let i = 0; i < spellMultiplier; i++) {
            let rotationPos = (i - ((spellMultiplier - 1) / 2)) * 0.088;
            let eyeAnim = this.scene.add.sprite(gameConsts.halfWidth, MAGIC_CIRCLE_HEIGHT, 'spells', 'voidParticle.png');
            eyeAnim.startX = eyeAnim.x; eyeAnim.startY = eyeAnim.y;
            eyeAnim.rotation = Math.random() * 1;
            let xPos = gameConsts.halfWidth + startDist * Math.sin(rotationPos);
            let yPos = MAGIC_CIRCLE_HEIGHT - 33 - startDist * Math.cos(rotationPos);
            eyeAnim.rotationOffset = rotationPos;
            eyeAnim.rotVel = 0;
            eyeAnim.setPosition(xPos, yPos);
            eyeAnim.setDepth(12);
            eyeAnim.setScale(1, 0);
            voidEyes.push(eyeAnim);
        }

        messageBus.publish('setTempRotObjs', voidAnimations, rotation);


        for (let i = voidEyes.length - 1; i >= 0; i--) {
            let voidObj = voidEyes[i];
            this.scene.tweens.add({
                targets: voidObj,
                delay: 500 + i * 100,
                duration: 400,
                scaleX: 1,
                scaleY: 1,
                rotation: Math.random() * 6,
                ease: 'Back.easeOut'
            });
        }

        let shieldHealth = spellMultiplier;

        messageBus.publish("selfTakeEffect", {
            name: shieldID,
            spellID: shieldID,
            type: 'void',
            animObj: [shieldArray, voidEyes],
            spriteSrc1: 'rune_protect_glow.png',
            spriteSrc2: 'rune_void_glow.png',
            spreadAmt: 0.9,
            jiggleAmt: 0,
            multiplier: spellMultiplier,
            health: shieldHealth,
            displayAmt: shieldHealth,
            lockRotation: rotation,
            ignoreBuff: true,
            active: true,
            cleanUp: (statuses) => {
                if (statuses[shieldID] && !statuses[shieldID].currentAnim) {
                    for (let i in voidEyes) {
                        voidEyes[i].destroy();
                    }

                    for (let i in shieldArray) {
                        let shieldObjDarkBall = shieldArray[i];
                        let randX = (Math.random() - 0.5) * 250;
                        let randY = (Math.random() - 0.2) * 200;
                        this.scene.tweens.add({
                            targets: shieldObjDarkBall,
                            duration: 500,
                            x: "-=" + randX,
                            y: "-=" + randY,
                            ease: 'Quart.easeOut',
                            onComplete: () => {
                                poolManager.returnItemToPool(shieldObjDarkBall, 'blackCircle');
                            }
                        });
                        this.scene.tweens.add({
                            targets: shieldObjDarkBall,
                            duration: 499,
                            scaleX: 0,
                            scaleY: 0
                        });
                    }

                    messageBus.publish('selfClearEffect', shieldID, true);
                    statuses[shieldID] = null;
                }
            }
        });


        let spellName = "SHIELD OF NEGATION";
        let bonusSize = spellMultiplier * 0.04;
        if (spellMultiplier > 1) {
            spellName += " +" + spellMultiplier;
        }
        this.postNonAttackCast(spellID, spellName, bonusSize);
    }
    castVoidUnload() {
        const spellID = 'voidUnload';
        let numTotalAttacks = globalObjects.player.attackEnhanceMultiplier();
        let additionalDamage = globalObjects.player.attackDamageAdder();

        let numBlackHolePre = 1;
        if (numTotalAttacks >= 7) {
            numBlackHolePre = 4;
        } else if (numTotalAttacks >= 4) {
            numBlackHolePre = 3;
        } else if (numTotalAttacks >= 2) {
            numBlackHolePre = 2;
        }
        for (let i = 0; i < numBlackHolePre; i++) {
            let voidObjPre = this.scene.add.sprite(gameConsts.halfWidth, 250, 'spells', 'blackHolePre.png');
            voidObjPre.rotation = Math.random() * 6.28;
            voidObjPre.setAlpha(0.05);
            voidObjPre.setScale(1 + 0.25 * i);
            voidObjPre.setDepth(10);
            this.scene.tweens.add({
                targets: voidObjPre,
                delay: i * 50,
                duration: 600,
                rotation: (i % 2 == 0) ? voidObjPre.rotation + 5 - i : voidObjPre.rotation - 5 + i,
                scaleX: "+=0.2",
                scaleY: "+=0.2",
                ease: 'Quad.easeInOut'
            });
            this.scene.tweens.add({
                targets: voidObjPre,
                delay: i * 50,
                duration: 200,
                alpha: 0.8 - i * 0.1,
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    this.scene.tweens.add({
                        targets: voidObjPre,
                        duration: 350,
                        alpha: 0,
                        ease: 'Cubic.easeIn'
                    });
                }
            });
        }

        let voidObj = this.scene.add.sprite(gameConsts.halfWidth, 250, 'spells', 'blackHoleBig.png');
        voidObj.setDepth(10);
        voidObj.rotation = Math.random() * 0.1;
        voidObj.setScale(1 + numTotalAttacks * 0.15);
        voidObj.setAlpha(0);

        let initialDelay = 200 + numTotalAttacks * 10 + additionalDamage;
        let voidDuration = 1500 + numTotalAttacks * 200 + additionalDamage * 3;
        let voidScale = 0.88 + numTotalAttacks * 0.12 + additionalDamage * 0.016;
        messageBus.publish('enableVoidArm', initialDelay, voidDuration, 0.6 + voidScale * 0.4);
        this.scene.tweens.add({
            targets: voidObj,
            delay: initialDelay,
            duration: 300,
            alpha: 1,
            scaleX: voidScale,
            scaleY: voidScale,
            ease: 'Cubic.easeOut',
            onStart: () => {
                zoomTemp(1.005);
            }
        });
        this.scene.tweens.add({
            targets: voidObj,
            delay: initialDelay,
            duration: voidDuration,
            rotation: 5 + numTotalAttacks,
            ease: 'Cubic.easeInOut',
            onComplete: () => {
                voidObj.destroy();
            }
        });
        this.scene.tweens.add({
            targets: voidObj,
            delay: initialDelay + voidDuration - 500,
            scaleY: voidScale * 1.5,
            scaleX: voidScale * 1.5,
            duration: 500,
            ease: 'Cubic.easeOut',
            alpha: 0
        });

        for (let i = 0; i < numTotalAttacks; i++) {
            let thisDurationDelay = voidDuration - voidDuration * (i / numTotalAttacks);
            if (numTotalAttacks == 1) {
                thisDurationDelay = voidDuration * 0.75;
            }
            PhaserScene.time.delayedCall(Math.max(0, initialDelay * 0.1 + thisDurationDelay * 0.85 - 280), () => {
                PhaserScene.time.delayedCall(200, () => {
                    zoomTemp(1.005 + numTotalAttacks * 0.002);
                    messageBus.publish('enemyTakeDamagePercent', 15, additionalDamage);
                });
                if (additionalDamage > 1) {
                    let rockObj = this.scene.add.sprite(gameConsts.halfWidth, 250, 'spells', 'stoneCircle.png');
                    rockObj.alpha = 0;
                    rockObj.rotation = Math.random() * Math.PI * 2;
                    rockObj.setScale(1 + additionalDamage * 0.005);
                    this.scene.tweens.add({
                        targets: rockObj,
                        scaleY: 0,
                        scaleX: 0,
                        duration: 380,
                        ease: 'Quad.easeIn',
                        alpha: 1.25,
                        rotation: '+=1'
                    });
                }
            });
        }

        let spellName = "UN-MAKE";
        this.postAttackCast(spellID, 220, spellName);
    }

    createRockParticle(x, y, velX, velY, duration) {
        let particle = this.particlesRock.pop();
        if (!particle) {
            particle = this.scene.add.sprite(x, y, 'spells', 'rock_chip.png');
            particle.setDepth(11);
        }
        particle.setScale(1.25);
        particle.visible = true;
        particle.rotation = Math.random() * 3.14;
        let travelAmtX = velX * duration;
        let direction = "+=";
        let travelString = direction+travelAmtX;
        let travelAmtY = velY * duration;
        this.scene.tweens.add({
            targets: particle,
            x: travelString,
            y: "+="+travelAmtY,
            duration: duration,
            rotation: (Math.random() - 0.5) * 10
        });
        // fake gravity
        this.scene.tweens.add({
            targets: particle,
            y: "+="+travelAmtY,
            duration: duration,
            easeParams: [4],
            ease: 'Back.easeOut',
        });

        this.scene.tweens.add({
            targets: particle,
            ease: 'Cubic.easeIn',
            scaleX: 0,
            scaleY: 0,
            duration: duration - 150,
            completeDelay: 150,
            onComplete: () => {
                this.recycleRockParticle(particle);
            }
        });
    }

    recycleRockParticle(particle) {
        particle.visible = false;
        this.particlesRock.push(particle);
    }

    postAttackCast(spellID, delayAmt = 0, spellName = "UNNAMED ATTACK") {
        PhaserScene.time.delayedCall(delayAmt, () => {
            messageBus.publish('attackLaunched', spellID);

            let timeAttackBuff = globalObjects.player.getStatuses()['timeEnhance'];
            if (timeAttackBuff) {
                let animObj = timeAttackBuff.animObj;
                this.scene.tweens.add({
                    targets: animObj,
                    y: 140,
                    duration: 500,
                    rotation: "-=3",
                    onComplete: () => {
                        messageBus.publish('setSlowMult', 0.1, 30 + 60 * timeAttackBuff.multiplier);
                        timeAttackBuff.cleanUp(globalObjects.player.getStatuses());
                    }
                });
                this.scene.tweens.add({
                    targets: animObj,
                    ease: 'Cubic.easeIn',
                    x: gameConsts.halfWidth,
                    duration: 500,
                });
            }

            let voidAttackBuff = globalObjects.player.getStatuses()['voidEnhance'];
            if (voidAttackBuff) {
                let animObj = voidAttackBuff.animObj;
                this.scene.tweens.add({
                    targets: animObj,
                    y: 140,
                    duration: 200,
                    rotation: "+=3",
                    onComplete: () => {
                        messageBus.publish('disruptOpponentAttack', 150 * voidAttackBuff.multiplier);
                        voidAttackBuff.cleanUp(globalObjects.player.getStatuses());
                    }
                });
                this.scene.tweens.add({
                    targets: animObj,
                    ease: 'Quad.easeIn',
                    x: gameConsts.halfWidth,
                    duration: 200,
                });
            }
            messageBus.publish('fireLaserEyes');
        });
        messageBus.publish('recordSpellAttack', spellID, spellName);
        messageBus.publish('clearAttackMultiplier');
        messageBus.publish('clearDamageAdder');
    }

    postNonAttackCast(spellID, spellName = "UNNAMED SPELL") {
        messageBus.publish('recordSpell', spellID, spellName);
        messageBus.publish('clearSpellMultiplier');
    }

    cleanUpExistingShield(shieldID) {
        let existingBuff = globalObjects.player.getStatuses()[shieldID];
        console.log(existingBuff);
        if (existingBuff) {
            // already got a shield in place
            console.log("possibly unneeded");
            messageBus.publish('selfClearEffect', shieldID);
        }
    }

    cleanseForms() {
        let existingBuff1 = globalObjects.player.getStatuses()['mindReinforce'];
        let existingBuff2 = globalObjects.player.getStatuses()['timeReinforce'];
        let existingBuff3 = globalObjects.player.getStatuses()['matterReinforce'];
        if (existingBuff1) {
            messageBus.publish('selfClearEffect', 'mindReinforce');
        }
        if (existingBuff2) {
            messageBus.publish('selfClearEffect', 'timeReinforce');
        }
        if (existingBuff3) {
            messageBus.publish('selfClearEffect', 'matterReinforce');
        }
    }
}
