class SpellManager {
    constructor(scene) {
        this.scene = scene;
        this.particlesRock = [];
        messageBus.subscribe('castSpell', this.handleSpell.bind(this));
        this.initializePoolStuff();
    }
    initializePoolStuff() {
        let rockObj = this.scene.add.image(0, 0, 'spells', 'rock.png');
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
                    case "rune_superprotect":
                        this.castMatterProtect(shieldID, rotation, true);
                        break;
                    case RUNE_UNLOAD:
                        this.castMatterUltimate();
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
                        this.castTimeUltimate();
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
                        this.castMindUltimate();
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
                        this.castVoidUltimate();
                        break;
                }
                break;
        }
    }

    createDamageEffect(x, y, depth, sprite = null, customTween = {}, isAnim) {
        let dmgEffect;
        let extraDur = 0;
        let skipTween = false;
        if (sprite === null) {

            dmgEffect = getTempPoolObject('spells', 'damageEffect3.png', 'damageEffect3', 300);
            dmgEffect.setPosition(x, y).setAlpha(1);

            dmgEffect.play('damageEffect');
            dmgEffect.setRotation((Math.random() - 0.5) * 0.35)

            skipTween = true;
        } else if (isAnim) {
            dmgEffect = this.scene.add.sprite(x, y, 'spells').play(sprite);
            extraDur = 150;
        } else {
            dmgEffect = this.scene.add.sprite(x, y, 'spells', sprite);
        }

        dmgEffect.setDepth(depth);
        if (!skipTween) {
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
        }

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
        let bonusTrueDamage = globalObjects.player.trueDamageAdder();
        let isExtraBuff = additionalDamage >= 6;

        let pebbles = getTempPoolObject('spells', 'rockCircle.png', 'rockCircle', 800);
        pebbles.setPosition(gameConsts.halfWidth, globalObjects.player.getY() - 240);
        let additionalScale = Math.sqrt(additionalDamage) * 0.025;
        let finalAdditionaScale = additionalScale * 5;
        let isPowerful = numAdditionalAttacks * (12 + additionalDamage + bonusTrueDamage) > 77;
        pebbles.setDepth(100).setAlpha(0).setScale(0.7 + additionalScale).setRotation(Math.random() * 3)
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
        let useMainStrike = Math.random() < 0.6;
        let strikeVol = 0.65 + additionalDamage * 0.0013;
        let detuneSqrtMult = Math.floor(Math.sqrt(additionalDamage * 0.75));
        for (let i = 0; i < numAdditionalAttacks; i++) {
            let xPos = gameConsts.halfWidth + (numAdditionalAttacks - 1) * -25 + 50 * i;
            let halfwayIdx = (numAdditionalAttacks - 1) * 0.5;
            let yPos = globalObjects.player.getY() - 240 + Math.abs(halfwayIdx - i) * 10;
            let rockObj = poolManager.getItemFromPool('rock')
            if (!rockObj) {
                rockObj = this.scene.add.image(xPos, yPos, 'spells', 'rock.png');
                rockObj.bg = this.scene.add.image(xPos, yPos, 'spells', 'rock_bg.png');
            }
            if (!rockObj.bg) {
                rockObj.bg = this.scene.add.image(xPos, yPos, 'spells', 'rock_bg.png');
            }
            rockObj.bg.alpha = isMobile ? 0.59 : 0.4;
            rockObj.bg.alpha += Math.min(0.24, numAdditionalAttacks * 0.04);
            rockObj.bg.visible = true;

            rockObj.setPosition(xPos, yPos).setDepth(40);
            rockObj.bg.setPosition(xPos, yPos).setDepth(39);
            rockObj.rotation = Math.random() - 0.5;
            rockObjects.push(rockObj);
            rockObj.setScale(0);
            rockObj.bg.setScale(0);
            let rockObjTargetScale = (isMobile ? 0.56 : 0.5) + additionalScale + (isExtraBuff ? -0.05 : 0)
            this.scene.tweens.add({
                targets: [rockObj, rockObj.bg],
                delay: 150,
                duration: 400 + Math.floor(additionalDamage * 1.5),
                scaleX: rockObjTargetScale,
                scaleY: rockObjTargetScale,
                ease: 'Back.easeOut',
                onStart: () => {
                    let detuneAmt = detuneSqrtMult * (isExtraBuff ? -10 : -30) - 75 + Math.random() * 150;
                    if (numAdditionalAttacks >= 2) {
                        playSound('matter_strike_alt', strikeVol * 0.55).detune = detuneAmt - 150;
                        setTimeout(() => {
                            playSound('matter_strike', strikeVol).detune = detuneAmt + 50;
                        }, 100);
                    } else {
                        let sfx = playSound(useMainStrike ? 'matter_strike' : 'matter_strike_alt', strikeVol);
                        sfx.detune = detuneAmt;
                    }
                },
                onComplete: () => {
                    if (isExtraBuff) {
                        if (i === 0) {
                            let sfx2 = playSound('matter_strike_heavy', strikeVol);
                            if (additionalDamage >= 12) {
                                zoomTempSlow(1.004);
                            }
                            sfx2.detune = detuneSqrtMult * -100;
                        }
                        let rockGlow = getTempPoolObject('spells', 'rockglow.png', 'rockglow', 400);
                        rockGlow.setScale(rockObj.scaleX).setPosition(rockObj.x, rockObj.y).setRotation(rockObj.rotation).setAlpha(0).setDepth(rockObj.depth + 1);

                        this.scene.tweens.add({
                            targets: [rockObj, rockGlow, rockObj.bg],
                            delay: 110,
                            duration: 40,
                            scaleX: 0.65 + finalAdditionaScale,
                            scaleY: 0.65 + finalAdditionaScale,
                            ease: 'Back.easeOut',
                            onStart: () => {
                                this.scene.tweens.add({
                                    targets: rockGlow,
                                    duration: 40,
                                    alpha: Math.min(1, 0.45 + Math.sqrt(additionalDamage) * 0.045),
                                    ease: 'Cubic.easeIn',
                                    onComplete: () => {
                                        this.scene.tweens.add({
                                            targets: rockGlow,
                                            duration: 500,
                                            alpha: 0,
                                            ease: 'Cubic.easeOut',
                                        });
                                    }
                                });
                            },
                            onComplete: () => {
                                this.scene.tweens.add({
                                    targets: [rockObj, rockGlow, rockObj.bg],
                                    duration: 150,
                                    scaleX: 0.5 + finalAdditionaScale,
                                    scaleY: 0.5 + finalAdditionaScale,
                                    ease: 'Cubic.easeOut'
                                });
                            }
                        });
                        pebbles.setAlpha(0.1).setScale(0.8 + finalAdditionaScale).setRotation(Math.random() * 3)
                        this.scene.tweens.add({
                            targets: pebbles,
                            duration: 250,
                            scaleX: 0,
                            scaleY: 0,
                        });
                        this.scene.tweens.add({
                            targets: pebbles,
                            duration: 250,
                            alpha: 1,
                            ease: 'Cubic.easeOut'
                        });
                    }
                }
            });
            this.scene.tweens.add({
                targets: [rockObj, rockObj.bg],
                delay: 150,
                duration: 450 + Math.floor(additionalDamage * 1.5),
                rotation: (Math.random() - 0.5) * 3,
                ease: 'Quart.easeOut'
            });
        }

        for (let i = 0; i < rockObjects.length; i++) {
            let rockObj = rockObjects[i];
            let delayAmt = 600 + i * (220 - i * 12) + additionalDamage * 2 + (isExtraBuff ? 325 : 0);
            let durationAmt = 500 + additionalDamage * 4;
            let rockGoalScale = (isMobile ? 0.37 : 0.35) + additionalScale * 0.68;
            this.scene.tweens.add({
                targets: [rockObj, rockObj.bg],
                delay: delayAmt,
                x: gameConsts.halfWidth + (Math.random() - 0.5) * 20,
                y: 165 + (Math.random() - 0.5) * 15 - Math.floor(Math.sqrt(additionalDamage) * 2),
                duration: durationAmt,
                scaleX: rockGoalScale,
                scaleY: rockGoalScale,
                rotation: (Math.random() - 0.5) * 2,
                ease: 'Quad.easeIn',
                onStart: () => {
                    // PhaserScene.time.delayedCall(durationAmt, () => {
                    //
                    // })
                },
                onComplete: () => {
                    let detuneAmt = Math.floor(Math.sqrt(additionalDamage * 0.65)) * -80;
                    let additionalVol = additionalDamage * 0.005;
                    if (globalObjects.currentEnemy && (globalObjects.currentEnemy.immune || globalObjects.currentEnemy.invincible)) {
                        playSound('swish', 1.4).detune = -600;
                    } else {
                        if (i === 0) {
                            let randNum = Math.random();
                            if (randNum < 0.3) {
                                playSound('matter_strike_hit', 0.8 + additionalVol).detune = detuneAmt;
                            } else if (randNum < 0.6) {
                                playSound('matter_strike_hit_alt', 0.8 + additionalVol).detune = detuneAmt;
                            } else {
                                playSound('matter_strike_hit_alt_2', 0.85 + additionalVol).detune = detuneAmt;
                            }
                        } else if (rockObjects.length > 2 && i === rockObjects.length - 1) {
                            // last hit
                            if (Math.random() < 0.5) {
                                playSound('matter_strike_hit', 0.7 + additionalVol).detune = detuneAmt;
                            } else {
                                playSound('matter_strike_hit_alt', 0.7 + additionalVol).detune = detuneAmt;
                            }
                        } else if (i % 2 === 1) {
                            playSound('matter_strike_hit2', 0.95 + additionalVol).detune = detuneAmt;
                        } else if (i % 2 === 0) {
                            playSound('matter_strike_hit2', 0.6 + additionalVol).detune = detuneAmt;
                        }
                        this.createDamageEffect(rockObj.x, rockObj.y, rockObj.depth);
                    }

                    if (isExtraBuff) {
                        let rockHitEffect = getTempPoolObject('blurry', 'rock_rush.png', 'rockRush', 300);
                        rockHitEffect.setVisible(true).setAlpha(0.9 + additionalDamage * 0.003).setScale(0.25 + additionalDamage * 0.0025).setRotation(Math.random() * 6);
                        rockHitEffect.setDepth(rockObj.depth - 1).setPosition(rockObj.x, rockObj.y);
                        this.scene.tweens.add({
                            targets: rockHitEffect,
                            duration: 250,
                            alpha: 0,
                            scaleX: 0.5 + additionalDamage * 0.008,
                            scaleY: 0.5 + additionalDamage * 0.008,
                        });
                        this.scene.tweens.add({
                            targets: rockHitEffect,
                            duration: 250,
                            y: "+=20",
                            ease: "Cubic.easeIn"
                        });

                        if (isPowerful && i === rockObjects.length - 1) {
                            let powerfulEffect = getTempPoolObject('tutorial', 'rune_matter_large.png', 'specialAttack', 1300);
                            powerfulEffect.setAlpha(0.05).setDepth(999).setScale(5.2).setPosition(rockObj.x, rockObj.y);
                            playSound('rock_crumble');
                            this.scene.tweens.add({
                                targets: powerfulEffect,
                                duration: 110,
                                alpha: 1,
                                onComplete: () => {
                                    zoomTemp(1.06);
                                    screenShake(6);
                                    messageBus.publish('tempPause', 250, 0.05);
                                }
                            });
                            this.scene.tweens.add({
                                targets: powerfulEffect,
                                duration: 125,
                                y: "+=16",
                                scaleX: 3.3,
                                scaleY: 3.3,
                                ease: "Quint.easeIn",
                                onComplete: () => {
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
                                        scaleX: 3.8,
                                        scaleY: 3.8,
                                        ease: 'Cubic.easeIn'
                                    });
                                }
                            });
                        } else if (!isPowerful) {
                            zoomTempSlow(1.003 + additionalDamage * 0.0001);
                            screenShake(0.5 + additionalDamage * 0.001)
                        }
                    }

                    let baseDamage = gameVars.matterPlus ? 14 : 12;
                    messageBus.publish('enemyTakeDamage', baseDamage + additionalDamage, true, undefined, 'matter');
                    messageBus.publish('setPauseDur', isExtraBuff ? 24 : 14);
                    rockObj.bg.visible = false;
                    poolManager.returnItemToPool(rockObj, 'rock');


                }
            });
        }

        let spellName = getBasicText('rune_matter_rune_strike');
        this.postAttackCast(spellID, 0, spellName, additionalDamage, numAdditionalAttacks);
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
            brickObj2 = this.scene.add.image(gameConsts.halfWidth, globalObjects.player.getY(), 'spells', 'brickPattern2.png');
            brickObj = this.scene.add.image(gameConsts.halfWidth, globalObjects.player.getY(), 'spells', 'brickPattern1.png');
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
        brickObj2.setScale(1.25 + Math.sqrt(spellMult) * 0.05);
        brickObj2.origScale = 0.8;

        let protectionAmt = 1;
        let damageAmt = 1;
        let duration = 400 + 50 * spellMult;
        PhaserScene.time.delayedCall( duration - 175, () => {
            playSound('matter_body');
        });
        this.scene.tweens.add({
            targets: brickObj,
            duration: 400 + 50 * spellMult,
            scaleX: 1.075 + 0.016 * spellMult,
            scaleY: 1.075 + 0.016 * spellMult,
            alpha: 0.8,
            rotation: 0,
            ease: 'Cubic.easeIn',
            onComplete: () => {
                brickObj.alpha = 1;
                this.scene.tweens.add({
                    targets: brickObj,
                    delay: 500,
                    duration: 1000,
                    alpha: 0.7,
                    ease: 'Quad.easeOut'
                });
                let scaleAmt = 1.01 + 0.0075 * Math.sqrt(spellMult);
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
            duration: 300,
            scaleX: 0.8,
            scaleY: 0.8,
            alpha: 1.1,
            ease: 'Quart.easeIn',
            onComplete: () => {
                brickObj2.setScale(0.8);
                brickObj2.visible = false;
            }
        });
        let totalProtection = spellMult * protectionAmt;
        let goalScale = 1.15 + totalProtection * 0.05;
        let param = {
            duration: 400,
            ease: 'Quad.easeOut',
            y: "-=1",
            scaleX: goalScale,
            scaleY: goalScale,
        }
        let param2 = {
            alpha: 0,
            duration: 1600,
            scaleX: goalScale * 0.96,
            scaleY: goalScale * 0.96
        }

        messageBus.publish('animateArmorNum', gameConsts.halfWidth, globalObjects.player.getY() - 50, "+" + totalProtection + " THORNS", goalScale, param, param2);

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
                        scaleX: 0.55,
                        scaleY: 0.55,
                        alpha: 0.6,
                        ease: 'Back.easeIn',
                        onComplete: () => {
                            while (statuses[spellID] && statuses[spellID].animObj.length > 0) {
                                let item = statuses[spellID].animObj.pop()
                                item.destroy();
                                if (statuses[spellID].animObj.length === 0) {
                                    statuses[spellID] = null;
                                }
                            }
                        }
                    });
                }
            }
        });

        let spellName = getBasicText('rune_matter_rune_reinforce');
        if (spellMult >= 3) {
            spellName = spellName + " x" + spellMult;
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
            newSpike = this.scene.add.sprite(gameConsts.halfWidth, globalObjects.player.getY(), 'spells', 'matter_boost.png').setDepth(9);
            let thisSpikeIndex = multiplier + i;
            newSpike.rotation = 0.6 + thisSpikeIndex * 0.18;
            newSpike.setScale(-1, 0.75);
            itemsToAnimate.push(newSpike);
            itemsToTween.push(newSpike);
        }

        for (let i = 0; i < itemsToAnimate.length; i++) {
            this.scene.tweens.add({
                targets: itemsToAnimate[i],
                delay: itemsToAnimate.length * Math.random() * 5 + (i * 20),
                duration: 325 + Math.random() * 200,
                ease: 'Back.easeOut',
                scaleY: 0.98 + Math.random() * 0.1,
                onStart: () => {
                    if (i === 0) {
                        let sfx = playSound('matter_enhance', 0.9);
                        if (Math.random() < 0.55) {
                            sfx.detune = -60;
                        } else {
                            sfx.detune = 60;
                        }
                        sfx.detune += Math.floor(Math.random() * 120) - 60;
                    } else if (i === itemsToAnimate.length - 1) {
                        if (itemsToAnimate.length < 4) {
                            PhaserScene.time.delayedCall( 50, () => {
                                let sfx = playSound('matter_enhance_2', 1);
                                if (Math.random() < 0.25) {
                                    sfx.detune = -70;
                                }
                                else {
                                    sfx.detune = 0;
                                }
                            });
                        } else {
                            playSound('matter_enhance_2', 1).detune = 0;
                        }
                    }
                }
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
                    for (let i = 0; i < objectsToCleanup.length; i++) {
                        this.scene.tweens.add({
                            delay: i * 60,
                            targets: objectsToCleanup[i],
                            duration: 300,
                            scaleY: "+=0.14",
                            ease: 'Quart.easeOut',
                            onStart: () => {
                                setTimeout(() => {
                                    objectsToCleanup[i].setFrame('matter_boost_glow.png');
                                }, 100);
                            },
                            onComplete: () => {
                                objectsToCleanup[i].scaleX *= 1.08;
                                this.scene.tweens.add({
                                    targets: objectsToCleanup[i],
                                    duration: 300,
                                    scaleY: 0.6,
                                    ease: 'Quart.easeIn',
                                    onComplete: () => {
                                        objectsToCleanup[i].destroy();
                                    }
                                });
                            }
                        });
                    }

                    // statuses[spellID].currentAnim = this.scene.tweens.add({
                    //     targets: statuses[spellID].animObj,
                    //     duration: 350 + statuses[spellID].animObj.length * 50,
                    //     scaleX: 0.62,
                    //     scaleY: 0.62,
                    //     ease: 'Quart.easeIn'
                    // });
                }
            }
        });
        let spellName = getBasicText('rune_matter_rune_enhance')+"\n+" + globalObjects.player.attackDamageAdder();

        // if (itemsToAnimate.length > 1) {
        //     spellName += " X" + itemsToAnimate.length;
        // }

        this.postNonAttackCast(spellID, spellName);
    }

    castMatterProtect(shieldID, rotation, isSuper) {
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

        let shieldFile = spellMultiplier > 1.1 ? 'stoneShieldTriple.png' : 'stoneShield.png';
        if (isSuper) {
            shieldFile = 'stoneShieldTriple.png';
        }

        let animation1 = this.scene.add.image(gameConsts.halfWidth, MAGIC_CIRCLE_HEIGHT, 'spells', shieldFile);
        animation1.setDepth(1);
        animation1.setOrigin(0.5, 1);
        animation1.setScale(0.75);
        animation1.origScaleX = 0.97 + spellMultiplier * 0.025;
        animation1.rotation = 0;

        let textHealth = this.scene.add.bitmapText(gameConsts.halfWidth, MAGIC_CIRCLE_HEIGHT - 222, 'armor', '0', 32, 1);
        textHealth.startX = textHealth.x;
        textHealth.startY = textHealth.y;
        textHealth.setOrigin(0.5, 0.5);
        textHealth.setDepth(123);
        textHealth.setScale(0);

        for (let i = 0; i < spellMultiplier; i++) {
            let rockAnim =  this.scene.add.image(gameConsts.halfWidth, MAGIC_CIRCLE_HEIGHT - 200, 'spells', 'rockCircle.png');
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
                onStart: () => {
                    if (i === 0) {
                        playSound('matter_shield').detune = 200 - Math.floor(Math.random() * 300);
                    }
                },
                onComplete: () => {
                    rockAnim.destroy();
                }
            });
        }

        let shieldBaseHealth = gameVars.matterPlus ? 14 : 12;

        let shieldHealth = shieldBaseHealth * spellMultiplier;
        if (isSuper) {
            shieldHealth = 80;
        }
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
            duration: 100,
            alpha: 1,
            onComplete: () => {
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
        })
        this.scene.tweens.add({
            targets: animation1,
            duration: 215,
            scaleX: 1.1,
            scaleY: 1.1,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                animation2.setDepth(122);
                animation1.setDepth(122);
                animation1.currAnim = this.scene.tweens.add({
                    targets: animation1,
                    duration: 330,
                    scaleX: 1,
                    scaleY: 1,
                    ease: 'Quart.easeIn',
                    onComplete: () => {
                        animation1.currAnim = null;
                    }
                });
            }
        });

        let spellName = getBasicText('rune_matter_rune_protect');
        let bonusSize = 0;
        if (spellMultiplier >= 3) {
            spellName = spellName + " X" + spellMultiplier;
            bonusSize = 0.1;
        }
        if (isSuper) {
            spellName = "SUPER STONE SHIELD";
            bonusSize = 0.1;
        }
        this.postNonAttackCast(spellID, spellName, bonusSize);
    }

    castMatterUltimate() {
        const spellID = 'matterUnload';
        let multiplier = globalObjects.player.spellMultiplier();

        messageBus.publish("addStalagmites", multiplier)

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
            stoneCircle = this.scene.add.image(gameConsts.halfWidth, globalObjects.player.getY(), 'spells', 'stoneCircle.png');
            stoneCircle.setAlpha(0.5).setScale(0.9).setRotation(-0.3);

            textHealth = this.scene.add.bitmapText(gameConsts.halfWidth, globalObjects.player.getY() - 46, 'armor', '0', 48, 1);
            textHealth.startX = textHealth.x;
            textHealth.startY = textHealth.y;
        }
        // messageBus.publish('setTempRotObjs', [stoneCircle], rotation);

        textHealth.setDepth(125).setOrigin(0.5, 0.5).setScale(0).setPosition(gameConsts.halfWidth, globalObjects.player.getY() - 46);
        stoneCircle.setDepth(10);
        let basePower = 20;
        let shieldHealth = basePower * multiplier;
        this.scene.tweens.add({
            targets: stoneCircle,
            delay: 100,
            scaleX: 1.04,
            scaleY: 1.04,
            alpha: 1,
            rotation: 0,
            duration: 250,
            ease: 'Cubic.easeOut',
            onStart: () => {
                playSound('matter_ultimate', 0.35);
                playSound('matter_shield', 0.95).detune = -250;
                playSound('matter_enhance', 0.35).detune = -1000;
                stoneCircle.setAlpha(0.5);
                textHealth.setText(shieldHealth);
                this.scene.tweens.add({
                    targets: textHealth,
                    duration: 250,
                    scaleX: 1,
                    scaleY: 1,
                    ease: 'Quad.easeIn',
                });
            },
            onComplete: () => {
                stoneCircle.setDepth(118);
                this.scene.tweens.add({
                    targets: stoneCircle,
                    scaleX: 1,
                    scaleY: 1,
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
            duration: 10,
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

        let spellName = getBasicText('rune_matter_rune_unload');
        messageBus.publish('clearSpellMultiplier');
        this.postNonAttackCast(spellID, spellName);
    }



    castMatterUltimatex() {
        const spellID = 'matterUnload';
        let attackObjects = [];
        let numAdditionalAttacks = globalObjects.player.attackEnhanceMultiplier();
        let additionalDamage = globalObjects.player.attackDamageAdder();
        let multiplier = globalObjects.player.spellMultiplier();

        let separationAmtX = Math.max(5, 30 - numAdditionalAttacks);
        let bonusScaleX = additionalDamage * 0.007;
        let bonusScaleY = additionalDamage * 0.0025;

        let isPowerful = numAdditionalAttacks * (24 + additionalDamage) > 74;

        for (let i = 0; i < numAdditionalAttacks; i++) {
            let xPos = gameConsts.halfWidth + (numAdditionalAttacks - 1) * -separationAmtX + separationAmtX * 2 * i;
            let halfwayIdx = (numAdditionalAttacks - 1) * 0.5;
            let yPos = gameConsts.halfHeight + 30 + Math.abs(halfwayIdx - i) * 10;
            let rockObj = this.scene.add.sprite(xPos, yPos, 'spells', 'stalagmite5.png');
            rockObj.setDepth(9);
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
            stoneCircle = this.scene.add.image(gameConsts.halfWidth, globalObjects.player.getY(), 'spells', 'stoneCircle.png');
            stoneCircle.setAlpha(0.5).setScale(0.9).setRotation(-0.3);

            textHealth = this.scene.add.bitmapText(gameConsts.halfWidth, globalObjects.player.getY() - 46, 'armor', '0', 48, 1);
            textHealth.startX = textHealth.x;
            textHealth.startY = textHealth.y;
        }
        // messageBus.publish('setTempRotObjs', [stoneCircle], rotation);

        textHealth.setDepth(125).setOrigin(0.5, 0.5).setScale(0).setPosition(gameConsts.halfWidth, globalObjects.player.getY() - 46);
        stoneCircle.setDepth(10);
        let basePower = 24;
        let shieldHealth = basePower * multiplier;
        this.scene.tweens.add({
            targets: stoneCircle,
            delay: 250,
            scaleX: 1.04,
            scaleY: 1.04,
            alpha: 1,
            rotation: 0,
            duration: 300,
            ease: 'Cubic.easeOut',
            onStart: () => {
                playSound('matter_ultimate', 1.4);
                stoneCircle.setAlpha(0.5);
                textHealth.setText(shieldHealth);
                this.scene.tweens.add({
                    targets: textHealth,
                    duration: 250,
                    scaleX: 1,
                    scaleY: 1,
                    ease: 'Quad.easeIn',
                });
            },
            onComplete: () => {
                stoneCircle.setDepth(118);
                this.scene.tweens.add({
                    targets: stoneCircle,
                    scaleX: 1,
                    scaleY: 1,
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
                delay: 275 + i * (180 - i * delayInterval),
                scaleY: 0.68 + bonusScaleY,
                scaleX: 0.85 + bonusScaleX,
                duration: 200,
                ease: 'Quint.easeIn',
                onStart: () => {
                    PhaserScene.time.delayedCall( 50, () => {
                        for (let i = 0; i < 6; i++) {
                            let velX = (Math.random() - 0.5) * 1;
                            let velY = -0.05 -Math.random() * 0.2;
                            let duration = 250 + Math.random() * 500;
                            this.createRockParticle(rockObj.x + (Math.random() - 0.5) * 25, rockObj.y - Math.random() * 5, velX, velY, duration)
                        }
                    });
                },
                onComplete: () => {
                    messageBus.publish('enemyTakeDamage', basePower + additionalDamage, true, undefined, 'matter');
                    screenShake(5);
                    zoomTemp(1.01 + additionalDamage * 0.00025);
                    this.createDamageEffect(gameConsts.halfWidth, 140, rockObj.depth);

                    if (isPowerful && i === attackObjects.length - 1) {
                        let powerfulEffect = getTempPoolObject('tutorial', 'rune_matter_large.png', 'specialAttack', 1300);
                        powerfulEffect.setAlpha(0.05).setDepth(999).setScale(5.2).setPosition(gameConsts.halfWidth, 190);
                        playSound('rock_crumble');
                        this.scene.tweens.add({
                            targets: powerfulEffect,
                            duration: 110,
                            alpha: 1,
                            onComplete: () => {
                                zoomTemp(1.06);
                                screenShake(7);
                                messageBus.publish('tempPause', 250, 0.05);
                            }
                        });
                        this.scene.tweens.add({
                            targets: powerfulEffect,
                            duration: 125,
                            y: "+=16",
                            scaleX: 3.3,
                            scaleY: 3.3,
                            ease: "Quint.easeIn",
                            onComplete: () => {
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
                                    scaleX: 3.8,
                                    scaleY: 3.8,
                                    ease: 'Cubic.easeIn'
                                });
                            }
                        });
                    } else if (!isPowerful) {
                        zoomTempSlow(1.002 + additionalDamage * 0.0001);
                        screenShake(0.35 + additionalDamage * 0.001)
                    }

                    this.scene.tweens.add({
                        targets: rockObj,
                        scaleY: 0.65 + bonusScaleY,
                        scaleX: 0.8 + bonusScaleX,
                        duration: 250,
                        ease: 'Cubic.easeOut',
                        onComplete: () => {
                            this.scene.tweens.add({
                                targets: rockObj,
                                delay: 300,
                                scaleY: 0,
                                duration: 300,
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

        let spellName = getBasicText('rune_matter_rune_unload');
        messageBus.publish('clearSpellMultiplier');
        this.postAttackCast(spellID, 300, spellName, additionalDamage, numAdditionalAttacks);
    }

    castTimeStrike() {
        const spellID = 'timeStrike';
        let additionalDamage = globalObjects.player.attackDamageAdder();
        let bonusTrueDamage = globalObjects.player.trueDamageAdder();

        let hasFirstBuff = additionalDamage >= 6;
        let hasSecondBuff = additionalDamage >= 14;
        let numAdditionalAttacks = globalObjects.player.attackEnhanceMultiplier();
        let isPowerful = (numAdditionalAttacks * ((6 + additionalDamage + bonusTrueDamage) * 1.5)) > 80;

        let strikeObjects = [];
        let finalStrikeScale = 0.5 + Math.sqrt(additionalDamage) * 0.075 + additionalDamage * 0.02;
        let goalScale = 0.4 + Math.sqrt(additionalDamage) * 0.05 + additionalDamage * 0.015;
        if (!hasSecondBuff) {
            playSound('time_strike_buff', hasFirstBuff ? 0.7 : 0.9).detune = Math.floor(Math.random() * 50) + 375;
        }

        let clockHandsList = [];
        let clockBGAttack = this.scene.add.sprite(gameConsts.halfWidth, gameConsts.halfHeight - 225, 'spells', 'clock_attack_bg.png').setDepth(-1).setAlpha(0).setTint(0xFF4444).setScale(0.5);
        let clockBGAttackFront = this.scene.add.sprite(gameConsts.halfWidth, clockBGAttack.y, 'spells', 'clock_attack_bg.png').setDepth(30).setAlpha(0).setTint(0xDD0000).setScale(0.5);
        for (let i = 0; i < numAdditionalAttacks; i++) {
            let xPos = gameConsts.halfWidth + (numAdditionalAttacks - 1) * -25 + 50 * i;
            let halfwayIdx = (numAdditionalAttacks - 1) * 0.5;
            let yPos = globalObjects.player.getY() - 238 + Math.abs(halfwayIdx - i) * 10;
            // let strikeObj = getTempPoolObject('spells', 'clock.png', 'clock', 000)
            let strikeObj = poolManager.getItemFromPool('clock')
            if (!strikeObj) {
                strikeObj = this.scene.add.sprite(xPos, yPos, 'spells', 'clock.png');
            }
            strikeObj.setDepth(10).setVisible(true).setAlpha(1).setPosition(xPos, yPos).setFrame('clock.png');
            strikeObj.rotation = Math.random() - 0.5;
            strikeObj.setScale(0);
            strikeObjects.push(strikeObj);
            this.scene.tweens.add({
                targets: strikeObj,
                duration: 150,
                scaleX: 0.5,
                scaleY: 0.5,
                rotation: "-=0.8",
                easeParams: [2],
                ease: 'Back.easeOut',
                onComplete: () => {
                    if (!hasFirstBuff) {
                        return;
                    }
                    let randRotAmt = 1.1 + Math.random() * 0.5;
                    if (i === 0 && hasSecondBuff) {
                        playSound('time_strike_buff', 0.7).detune = Math.floor(Math.random() * 50) - 100;
                    }

                    this.scene.tweens.add({
                        delay: 200,
                        targets: strikeObj,
                        duration: 250,
                        rotation: "+=" + randRotAmt,
                        scaleX: 0.65,
                        scaleY: 0.65,
                        easeParams: [3],
                        ease: 'Back.easeOut',
                        onStart: () => {
                            if (i === 0 && !hasSecondBuff) {
                                setTimeout(() => {
                                    playSound('time_strike_buff', 0.9).detune = Math.floor(Math.random() * 50) - 100;
                                }, 100)
                            }
                        },
                        onComplete: () => {
                            if (!hasSecondBuff) {
                                return;
                            }
                            if (i === 0) {
                                zoomTempSlow(1.005);
                                screenShake(0.3 + additionalDamage * 0.0008);
                                playSound('time_strike_buff', 1).detune = -Math.floor(Math.random() * 50) - 375;
                            }
                            let randRotMultiplied = randRotAmt * 1.8;
                            this.scene.tweens.add({
                                delay: 200,
                                targets: strikeObj,
                                duration: 250,
                                rotation: "-=" + randRotMultiplied,
                                scaleX: finalStrikeScale,
                                scaleY: finalStrikeScale,
                                easeParams: [3],
                                ease: 'Back.easeOut',
                                onComplete: () => {
                                    if (i === 0) {
                                        playSound('time_strike_buff', 1.2).detune = -Math.floor(Math.random() * 50) - 775;
                                    }
                                },
                            });
                        }
                    });
                }
            });
        }

        let spellDamage = 6 + additionalDamage;
        let halfSpellDamage = Math.ceil(spellDamage * 0.5);
        let buffDelay = 0;
        if (hasFirstBuff) {
            buffDelay += 470;
            if (hasSecondBuff) {
                buffDelay += 470;
            }
        }
        let delayInterval = 150;

        let detunesList = [];
        for (let i in strikeObjects) {
            let isFirst = i === '0';
            let isLast = i == (strikeObjects.length - 1);
            let strikeObject = strikeObjects[i];
            strikeObject.finalRot = 0.2 - Math.random() * 0.4;
            let delayAmt = 270 + i * delayInterval + buffDelay;
            let offsetX = (Math.random() - 0.5) * 200;

            let randRotation = (offsetX < 0 ? 4 : -4) + (Math.random() - 0.5) * 2 - offsetX * 0.02;

            this.scene.tweens.add({
                delay: delayAmt,
                targets: [strikeObject],
                duration: 550,
                rotation: randRotation,
                onStart: () => {
                    let detuneAmt = Math.floor(Math.random() * 400) - 200;
                    detunesList.push(detuneAmt);
                    playSound('time_strike').detune = detuneAmt;
                }
            });


            let offsetGoal = gameConsts.halfWidth + offsetX;
            let randXGoal = gameConsts.halfWidth + (Math.random()) - 0.5 * 5;
            let randY = 150 + (Math.random() - 0.5) * 10;
            this.scene.tweens.add({
                delay: delayAmt,
                targets: strikeObject,
                y: randY,
                duration: 550,
                scaleX: goalScale,
                scaleY: goalScale,
                ease: 'Back.easeOut',
                easeParams: [0.25],
                onStart: () => {
                    this.scene.tweens.add({
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
                                        x: randXGoal,
                                        duration: 150,
                                        easeParams: [0.5],
                                        ease: 'Back.easeOut'
                                    });
                                }
                            });
                        }
                    });
                },
                onComplete: () => {
                    if (isFirst) {
                        clockBGAttack.setAlpha(0.5);
                        clockBGAttackFront.setAlpha(0.5);
                    }
                    let bgScale = Math.sqrt(0.7 + i * 0.1 + (additionalDamage * 0.014)) - 0.3;
                    clockBGAttack.setScale(bgScale)
                    clockBGAttackFront.setScale(bgScale)
                    let clockHand = poolManager.getItemFromPool('clockhand');
                    if (!clockHand) {
                        clockHand = this.scene.add.sprite(clockBGAttack.x, clockBGAttack.y, 'spells', 'clock_stab.png').setDepth(33);
                    }
                    clockHand.setVisible(true).setAlpha(1.25).setFrame('clock_stab.png').setScale(clockBGAttack.scaleX * 0.9).setOrigin(0.12, 0.5);
                    clockHand.rotation = Math.random() * 2.4 - 1.2;
                    if (Math.random() < 0.5) {
                        clockHand.rotation = -clockHand.rotation;
                    }
                    for (let i = 0; i < clockHandsList.length; i++) {
                        let currHand = clockHandsList[i];
                        if (Math.abs(currHand.rotation - clockHand.rotation) < 0.2) {
                            clockHand.rotation = 0.7 + Math.random() * 1.7;
                            if (Math.random() < 0.5) {
                                clockHand.rotation = -clockHand.rotation;
                            }
                        }
                    }
                    for (let i = 0; i < clockHandsList.length; i++) {
                        let currHand = clockHandsList[i];
                        if (Math.abs(currHand.rotation - clockHand.rotation) < 0.1) {
                            clockHand.rotation = 0.7 + Math.random() * 1.7;
                            if (Math.random() < 0.5) {
                                clockHand.rotation = -clockHand.rotation;
                            }
                        }
                    }
                    this.scene.tweens.add({
                        targets: clockHand,
                        duration: 200,
                        scaleX: clockBGAttack.scaleX * 0.78,
                        scaleY: clockBGAttack.scaleX * 0.78,
                        ease: 'Back.easeOut',
                        alpha: 0.7,
                    });
                    clockHandsList.push(clockHand);

                    strikeObject.rotation = strikeObject.finalRot;
                    this.scene.tweens.add({
                        targets: strikeObject,
                        duration: 200 + additionalDamage * 2,
                        scaleX: goalScale + 0.24,
                        scaleY: goalScale + 0.24,
                        alpha: 0,
                        onComplete: () => {
                            poolManager.returnItemToPool(strikeObject, 'clock');
                            if (isLast) {
                                this.scene.time.delayedCall(delayInterval, () => {
                                    this.scene.tweens.add({
                                        targets: [clockBGAttack, clockBGAttackFront],
                                        alpha: 0.8,
                                        ease: 'Cubic.easeIn',
                                        duration: 150,
                                    })
                                    let listLength = clockHandsList.length;
                                    let detuneIdx = 0;
                                    while (clockHandsList.length > 0) {
                                        let isLastHand = listLength == clockHandsList.length;
                                        let idxNum = listLength - clockHandsList.length;

                                        let fireHand = clockHandsList.pop();
                                        let goalScale = clockBGAttack.scaleX * 1.1 + 0.1;

                                        let delayAmt = clockHandsList.length * delayInterval;
                                        this.scene.tweens.add({
                                            delay: delayAmt,
                                            targets: fireHand,
                                            scaleX: goalScale * 1.12 + 0.28,
                                            scaleY: goalScale * 1.25 + 0.34,
                                            ease: 'Quart.easeIn',
                                            duration: 60,
                                            onStart: () => {
                                                fireHand.setAlpha(1.1)
                                                let flashRed = getTempPoolObject('lowq', 'sharpflashred.webp', 'sharpflashred', 250);
                                                flashRed.setPosition(fireHand.x, fireHand.y).setScale(goalScale * 0.75, goalScale * 2).setDepth(fireHand.depth - 1).setAlpha(0.75);
                                                flashRed.setOrigin(0.5, 0.78);
                                                flashRed.rotation = fireHand.rotation + Math.PI * 0.5;
                                                this.scene.tweens.add({
                                                    targets: flashRed,
                                                    scaleX: goalScale * 5,
                                                    scaleY: goalScale * 12.5,
                                                    ease: 'Quart.easeIn',
                                                    alpha: 1.2,
                                                    duration: 65,
                                                    oncomplete: () => {
                                                        this.scene.tweens.add({
                                                            targets: flashRed,
                                                            scaleX: goalScale * 0.85,
                                                            scaleY: goalScale * 2.25,
                                                            ease: 'Cubic.easeOut',
                                                            duration: 150,
                                                            onComplete: () => {
                                                                flashRed.setOrigin(0.5, 0.5);
                                                            }
                                                        });
                                                        this.scene.tweens.add({
                                                            targets: flashRed,
                                                            ease: 'Quad.easeIn',
                                                            alpha: 0,
                                                            duration: 110,
                                                        });
                                                    }
                                                });

                                            },
                                            onComplete: () => {
                                                let detuneAmt = 0;
                                                if (detunesList.length === 0) {
                                                    detuneAmt = Math.random() * 400 - 200;
                                                } else {
                                                    detuneAmt = detunesList[detuneIdx % detunesList.length];
                                                    detuneIdx++;
                                                }

                                                if (globalObjects.currentEnemy && (globalObjects.currentEnemy.immune || globalObjects.currentEnemy.invincible)) {
                                                    playSound('swish', 1).detune = Math.random() * 250;
                                                } else {
                                                    if (idxNum === 0) {
                                                        playSound('time_strike_hit', 0.92).detune = detuneAmt;
                                                    } else if (strikeObjects.length > 2 && idxNum === strikeObjects.length - 1) {
                                                        // last hit
                                                        playSound('time_strike_hit', 0.85).detune = detuneAmt;
                                                    } else if (idxNum % 2 === 1) {
                                                        playSound('time_strike_hit_2', 1).detune = detuneAmt;
                                                    } else if (idxNum % 2 === 0) {
                                                        playSound('time_strike_hit_2', 0.75).detune = detuneAmt;
                                                    }
                                                }

                                                messageBus.publish('enemyTakeDamage', halfSpellDamage, true, undefined, 'time');
                                                messageBus.publish('setPauseDur', 15);

                                                if (isLastHand && isPowerful) {
                                                    let powerfulEffect = getTempPoolObject('tutorial', 'rune_time_large.png', 'specialAttack', 1300);
                                                    powerfulEffect.setAlpha(0.05).setDepth(999).setScale(5).setPosition(gameConsts.halfWidth, strikeObject.y + 33);
                                                    playSound('time_hard');
                                                    this.scene.tweens.add({
                                                        targets: powerfulEffect,
                                                        duration: 110,
                                                        alpha: 1,
                                                        onComplete: () => {
                                                            zoomTemp(1.06);
                                                            screenShake(6);
                                                            messageBus.publish('tempPause', 250, 0.05);
                                                        }
                                                    });
                                                    this.scene.tweens.add({
                                                        targets: powerfulEffect,
                                                        duration: 125,
                                                        scaleX: 3.15,
                                                        scaleY: 3.15,
                                                        ease: "Quint.easeIn",
                                                        onComplete: () => {
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
                                                                scaleX: 3.8,
                                                                scaleY: 3.8,
                                                                ease: 'Cubic.easeIn'
                                                            });
                                                        }
                                                    });
                                                }

                                                this.scene.tweens.add({
                                                    delay: 20,
                                                    targets: fireHand,
                                                    scaleX: goalScale,
                                                    scaleY: goalScale,
                                                    alpha: 0.85,
                                                    ease: 'Back.easeOut',
                                                    duration: 240,
                                                    completeDelay: 40,
                                                    onComplete: () => {
                                                        this.scene.tweens.add({
                                                            targets: fireHand,
                                                            alpha: 0,
                                                            scaleX: goalScale * 0.95,
                                                            scaleY: goalScale * 0.95,
                                                            ease: 'Quad.easeOut',
                                                            duration: 200,
                                                            onStart: () => {
                                                                if (isLastHand) {
                                                                    this.scene.tweens.add({
                                                                        delay: 100,
                                                                        targets: [clockBGAttack, clockBGAttackFront],
                                                                        alpha: 0,
                                                                        scaleX: clockBGAttack.scaleX + 0.1,
                                                                        scaleY: clockBGAttack.scaleX + 0.1,
                                                                        ease: 'Cubic.easeOut',
                                                                        duration: 300,
                                                                        onComplete: () => {
                                                                            clockBGAttack.destroy();
                                                                            clockBGAttackFront.destroy();
                                                                        }
                                                                    })
                                                                }
                                                            },
                                                            onComplete: () => {
                                                                poolManager.returnItemToPool(fireHand, 'clockhand');

                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }

                                })

                            }
                        }
                    });
                    let idxNum = parseInt(i);

                    if (globalObjects.currentEnemy && (globalObjects.currentEnemy.immune || globalObjects.currentEnemy.invincible)) {
                        playSound('time_strike_buff', 0.5).detune = -500 + Math.random() * 250;
                    } else {
                        if (idxNum === 0) {
                            let detuneHitAmt = Math.floor(Math.random() * 150) - 75;
                            playSound('time_strike_buff', 0.92).detune = detuneHitAmt;
                            playSound('time_strike_hit', 0.54).detune = detuneHitAmt - 250;
                        } else if (strikeObjects.length > 2 && idxNum === strikeObjects.length - 1) {
                            // last hit
                            playSound('time_strike_buff', 0.85);
                            playSound('time_strike_hit_2', 0.45).detune =  -250;
                        } else if (idxNum % 2 === 1) {
                            playSound('time_strike_buff', 1).detune = -200;
                            playSound('time_strike_hit', 0.54).detune = 200;
                        } else if (idxNum % 2 === 0) {
                            playSound('time_strike_buff', 0.75).detune = -200;
                        }
                        zoomTempSlow(1.002 + additionalDamage * 0.0001);
                        screenShake(0.35 + additionalDamage * 0.001)
                    }


                    // messageBus.publish('enemyStartDamageCountdown');
                    messageBus.publish('enemyTakeDamage', spellDamage, true, undefined, 'time');
                    messageBus.publish('setPauseDur', 20);

                }
            });
        }

        let spellName = getBasicText('rune_time_rune_strike');
        this.postAttackCast(spellID, 300, spellName, additionalDamage, numAdditionalAttacks);
    }

    castTimeReinforce() {
        const spellID = 'timeReinforce';
        let multiplier = globalObjects.player.spellMultiplier();
        let healthRewoundPercent = 1 - 0.5 ** multiplier;
        let bigClock = this.scene.add.image(gameConsts.halfWidth, globalObjects.player.getY(), 'spells', 'clock_back_large.png');
        this.cleanseForms();
        playSound('time_body')
        bigClock.setDepth(120).setScale(1.05);
        bigClock.alpha = 0;
        let clockArm = this.scene.add.image(gameConsts.halfWidth, globalObjects.player.getY(), 'spells', 'clock_arm_large.png');
        clockArm.setDepth(120).setScale(1.2);
        clockArm.setOrigin(0.01, 0.5);
        clockArm.alpha = 0;
        clockArm.rotation = -Math.PI * 0.5;

        this.scene.tweens.add({
            targets: [bigClock],
            duration: 300,
            alpha: 0.4 + multiplier * 0.1,
            scaleX: 0.97,
            scaleY: 0.97,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                messageBus.publish('selfHealRecent', healthRewoundPercent);
            }
        });
        this.scene.tweens.add({
            targets: [clockArm],
            duration: 400,
            alpha: 0.55 + multiplier * 0.12,
            scaleX: 0.94,
            scaleY: 0.94,
            ease: 'Cubic.easeOut',
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
            scaleX: 1.12,
            scaleY: 1.12,
            alpha: 0
        });

        let spellName = getBasicText('rune_time_rune_reinforce');
        if (multiplier > 1) {
            spellName += " X" + multiplier;
        }

        this.postNonAttackCast(spellID, spellName);
    }
    castTimeEnhance() {
        // Creates additional instance of attack
        const spellID = 'timeEnhance';

        let existingBuff = globalObjects.player.getStatuses()[spellID];
        let timeObjects = [];
        if (existingBuff) {
            timeObjects = existingBuff.animObj;
        }

        let numAdditionalAttacks = globalObjects.player.spellMultiplier();
        let existingAttacksAmt = Math.round(timeObjects.length * 0.5);
        let addedActualAttacks = numAdditionalAttacks;
        let numTotalAttacks = existingAttacksAmt + numAdditionalAttacks;

        if (timeObjects.length > 0) {
            // shift to the left the existing mind objects
            for (let i = 0; i < timeObjects.length; i += 2) {
                let xPos = gameConsts.halfWidth + (numTotalAttacks - 1) * -25 + 25 * i;
                let halfwayIdx = (numTotalAttacks - 1) * 0.5;
                let yPos = globalObjects.player.getY() - 240 + Math.abs(halfwayIdx - i * 0.5) * 10;
                this.scene.tweens.add({
                    targets: [timeObjects[i], timeObjects[i+1]],
                    duration: 300,
                    x: xPos,
                    y: yPos,
                    ease: 'Cubic.easeOut'
                });
            }
        } else {
            numAdditionalAttacks++;
            numTotalAttacks = existingAttacksAmt + numAdditionalAttacks;
        }

        for (let i = existingAttacksAmt; i < numTotalAttacks; i++) {
            // set up new ones
            let xPos = gameConsts.halfWidth + (numTotalAttacks - 1) * -25 + 50 * i;
            let halfwayIdx = (numTotalAttacks - 1) * 0.5;
            let yPos = globalObjects.player.getY() - 240 + Math.abs(halfwayIdx - i) * 10;
            let mindObj = this.scene.add.image(xPos, yPos, 'spells', 'timeEffect.png');
            let mindObj2 = this.scene.add.image(xPos, yPos, 'spells', 'timeEffect2.png');

            mindObj.setDepth(11);
            mindObj.rotation = Math.random() - 0.5;
            mindObj.setScale(0);

            mindObj2.setDepth(10);
            mindObj2.rotation = (Math.random() - 0.5) * 10;
            mindObj2.setScale(0);

            timeObjects.push(mindObj);
            timeObjects.push(mindObj2);
            this.scene.tweens.add({
                targets: [mindObj, mindObj2],
                duration: 300,
                scaleX: 1,
                scaleY: 1,
                ease: 'Cubic.easeOut'
            });

            this.scene.tweens.add({
                targets: mindObj,
                duration: 5200,
                rotation: "+=6.283",
                repeat: -1
            });
            this.scene.tweens.add({
                targets: mindObj2,
                duration: 5200,
                rotation: "-=3.14",
                repeat: -1
            });
        }
        playSound('time_enhance');
        this.scene.tweens.add({
            targets: timeObjects[0],
            duration: 300,
            alpha: 0.99,
            onComplete: () => {
                messageBus.publish("selfTakeEffect", {
                    name: spellID,
                    spellID: spellID,
                    animObj: timeObjects,
                    multiplier: Math.round(timeObjects.length * 0.5),
                    ignoreBuff: true,
                    cleanUp: (statuses) => {
                        // do we even need multiplier?
                        if (statuses[spellID] && !statuses[spellID].currentAnim) {
                            statuses[spellID].currentAnim = this.scene.tweens.add({
                                targets: timeObjects,
                                delay: 25,
                                duration: 200,
                                scaleX: 0,
                                scaleY: 0,
                                ease: 'Quad.easeOut',
                                onStart: () => {
                                    statuses[spellID] = null;
                                },
                                onComplete: () => {
                                    for (let i = 0; i < timeObjects.length; i++) {
                                        timeObjects[i].destroy();
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });

        let spellName = getBasicText('rune_time_rune_enhance')+" +"+addedActualAttacks;

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
        let multiplier = globalObjects.player.spellMultiplier();
        let shieldName = 'clockShield.png';
        if (multiplier >= 2) {
            shieldName = "clockShieldTriple.png";
        }

        let animation1 = this.scene.add.image(gameConsts.halfWidth, MAGIC_CIRCLE_HEIGHT, 'spells', shieldName);
        animation1.setDepth(118);
        animation1.setOrigin(0.5, 1);
        animation1.setScale(0.75);
        animation1.origScaleX = 0.95;
        animation1.rotation = rotation;

        let shield2Name = 'blank.png';
        if (multiplier >= 2) {
            shield2Name = "clockShieldTripleSatellite.png";
        }
        let animation2 = this.scene.add.image(gameConsts.halfWidth, MAGIC_CIRCLE_HEIGHT, 'spells', shield2Name);
        animation2.setDepth(118);
        animation2.setOrigin(0.5, 1);
        animation2.setScale(0.75);
        animation2.origScaleX = 0.95;
        animation2.rotation = rotation;
        playSound('time_shield');
        messageBus.publish('setTempRotObjs', [animation1, animation2], rotation);


        this.scene.tweens.add({
            targets: [animation1, animation2],
            duration: 400,
            ease: 'Cubic.easeOut',
            scaleX: 0.95,
            scaleY: 0.965,
            onStart: () => {
                messageBus.publish("selfTakeEffect", {
                    ignoreBuff: true,
                    name: shieldID,
                    spellID: shieldID,
                    type: 'time',
                    animObj: [animation1, animation2],
                    lockRotation: rotation,
                    spriteSrc1: 'rune_protect_glow.png',
                    spriteSrc2: 'rune_time_glow.png',
                    displayAmt: 0,
                    active: true,
                    maxAmt: 60 * multiplier,
                    multiplier: multiplier,
                    statusObj: statusObj,
                    cleanUp: (statuses) => {
                        if (statuses[shieldID] && !statuses[shieldID].currentAnim) {
                            statuses[shieldID].currentAnim = this.scene.tweens.add({
                                targets: [animation1, animation2],
                                duration: 250,
                                scaleX: 0.55,
                                scaleY: 0.55,
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
            },
        });

        let boost = 0;
        let spellName = getBasicText('rune_time_rune_protect');
        if (multiplier > 1.1) {
            spellName = spellName + " X"+multiplier;
        }
        this.postNonAttackCast(spellID, spellName, boost);
    }
    castTimeUltimate() {
        this.castTimeStrike();
    }

    castMindStrike() {
        const spellID = 'mindStrike';

        let attackObjects = [];
        let numAdditionalAttacks = globalObjects.player.attackEnhanceMultiplier();
        let additionalDamage = globalObjects.player.attackDamageAdder();
        let bonusTrueDamage = globalObjects.player.trueDamageAdder();

        let isPowerful = numAdditionalAttacks * (1 + (additionalDamage + bonusTrueDamage) * 2) > 70;

        for (let i = 0; i < numAdditionalAttacks; i++) {
            let xPos = gameConsts.halfWidth + (numAdditionalAttacks - 1) * -25 + 50 * i;
            let halfwayIdx = (numAdditionalAttacks - 1) * 0.5;
            let yPos = globalObjects.player.getY() - 225 + Math.abs(halfwayIdx - i) * 10 + additionalDamage;
            let attackObj = this.scene.add.sprite(xPos, yPos, 'spells', 'lightningBolt1.png');
            attackObj.play('lightningbolt');
            attackObj.setDepth(10);
            attackObj.rotation = Math.random() - 0.5;
            attackObjects.push(attackObj);
            attackObj.setScale(0);
            attackObj.setOrigin(0.5, 0.1);
        }

        let yPos = 195;
        for (let i = 0; i < attackObjects.length; i++) {
            let attackObj = attackObjects[i];
            let delayAmt = 50 + i * (190 - attackObjects.length * 6);
            this.scene.tweens.add({
                targets: attackObj,
                delay: delayAmt,
                duration: 200,
                scaleX: 0.7 + additionalDamage * 0.006,
                scaleY: 0.8 + additionalDamage * 0.007,
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
                onStart: () => {
                    playSound('mind_strike');
                },
                onComplete: () => {
                    let dmgBG = getTempPoolObject('spells', 'blackPulse.png', 'blackPulse', 310).setDepth(attackObj.depth).setScale(0.5).setAlpha(0.6).setPosition(attackObj.x, attackObj.y - 12);
                    let dmgEffect = getTempPoolObject('spells', 'shockEffect1.png', 'shockEffect', 310).play('shockEffect').setPosition(attackObj.x, attackObj.y - 12).setDepth(attackObj.depth).setScale(0.5).setRotation(Math.random() * 6);
                    let randScale = 1.3 + 0.1 * Math.random();
                    if (globalObjects.currentEnemy && globalObjects.currentEnemy.invincible) {
                        playSound('clunk', 0.4).detune = Math.random() * 200;
                        playSound('fizzle', 1).detune = Math.random() * 200;
                    } else {
                        playSound('mind_strike_hit');
                    }

                    this.scene.tweens.add({
                        targets: [dmgBG],
                        alpha: 0,
                        duration: 480,
                    });
                    this.scene.tweens.add({
                        targets: [dmgEffect, dmgBG],
                        scaleX: randScale,
                        scaleY: randScale,
                        duration: 460,
                        ease: 'Quart.easeOut',
                    });

                    let damageDealt = 1 + additionalDamage;
                    messageBus.publish('enemyTakeTrueDamage', damageDealt, true, undefined, true, 'mind');

                    if (isPowerful && i === attackObjects.length - 1) {
                        let powerfulEffect = getTempPoolObject('tutorial', 'rune_energy_large.png', 'specialAttack', 1300);
                        powerfulEffect.setAlpha(0.05).setDepth(999).setScale(3.9, 2.5).setPosition(attackObj.x, attackObj.y - 80);
                        playSound('thunder');
                        this.scene.tweens.add({
                            targets: powerfulEffect,
                            duration: 110,
                            alpha: 1,
                            onComplete: () => {
                                zoomTemp(1.06);
                                screenShake(6);
                                messageBus.publish('tempPause', 250, 0.05);
                            }
                        });
                        this.scene.tweens.add({
                            targets: powerfulEffect,
                            duration: 300,
                            y: "+=76",
                            ease: 'Back.easeOut'
                        });
                        this.scene.tweens.add({
                            targets: powerfulEffect,
                            duration: 125,
                            scaleX: 3.5,
                            scaleY: 4.2,
                            ease: "Quint.easeIn",
                            onComplete: () => {
                                messageBus.publish('setSlowMult', 0.25, 15);
                                this.scene.tweens.add({
                                    targets: powerfulEffect,
                                    duration: 100,
                                    scaleY: 3.5,
                                    ease: "Cubic.easeOut"
                                });
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
                    } else if (additionalDamage >= 12) {
                        screenShake(0.25 + additionalDamage * 0.0025)
                    }

                    if (globalObjects.currentEnemy && !globalObjects.currentEnemy.dead && !globalObjects.currentEnemy.invincible && !globalObjects.player.dead) {
                        let animation1 = this.scene.add.sprite(attackObj.x, gameConsts.halfHeight - 215, 'spells', 'energyTarget7.png').play('energyTarget').setAlpha(1).setScale(0.96);
                        animation1.setDepth(30);
                        animation1.setOrigin(0.5, 0.5);
                        this.scene.tweens.add({
                            targets: [animation1],
                            duration: 500,
                            alpha: 0.58,
                            scaleX: 0.9,
                            scaleY: 0.9,
                            ease: 'Quad.easeOut',
                        });
                        messageBus.publish('animateTrueDamageNum', attackObj.x + 12 - Math.random() * 24, attackObj.y - 30 - Math.random() * 5, 'VULNERABLE', isMobile ? 0.82 : 0.75);

                        messageBus.publish('enemyTakeEffect', {
                            name: spellID,
                            x: animation1.x,
                            y: animation1.y,
                            damage: damageDealt,
                            cleanUp: (statuses, damage, explode) => {
                                if (statuses[spellID] && !statuses[spellID].currentAnim) {
                                    if (!globalObjects.currentEnemy.isDestroyed) {
                                        let damageCircle = getTempPoolObject('lowq', 'circle_blue4.png', 'circle_blue', 1800).setDepth(100).setScale(0.65).setAlpha(0.85 + Math.sqrt(damage) * 0.025).setPosition(attackObj.x, attackObj.y - 14);
                                        damageCircle.playReverse('circleBlast');
                                        let newScale = 0.67 + Math.sqrt(damage) * 0.12;
                                        this.scene.tweens.add({
                                            targets: damageCircle,
                                            duration: 500 + damage * 10,
                                            scaleX: newScale,
                                            scaleY: newScale,
                                            ease: 'Cubic.easeOut',
                                        });
                                        this.scene.tweens.add({
                                            targets: damageCircle,
                                            duration: 500 + damage * 10,
                                            alpha: 0,
                                        });
                                        if (explode) {
                                            animation1.setScale(1.2);
                                            animation1.stop();
                                            animation1.alpha = 1;
                                            animation1.play('energyTargetExplode');
                                        }
                                    }
                                    let explodeDur = explode ? 100 : 0;
                                    this.scene.tweens.add({
                                        targets: [animation1],
                                        duration: 200 + explodeDur,
                                        scaleX: explode ? 1.1 : 1.15,
                                        scaleY: explode ? 1.1 : 1.15,
                                        ease: 'Cubic.easeOut',
                                    });
                                    statuses[spellID].currentAnim = this.scene.tweens.add({
                                        targets: [animation1],
                                        duration: 200 + explodeDur,
                                        alpha: 0,
                                        ease: explode ? 'Quad.easeIn' : '',
                                        onComplete: () => {
                                            animation1.destroy();
                                        }
                                    })
                                    statuses[spellID] = null;
                                }
                            }
                        });
                    }

                    this.scene.tweens.add({
                        targets: attackObj,
                        alpha: 0,
                        scaleX: "-=0.2",
                        scaleY: "-=0.1",
                        duration: 120,
                        onComplete: () => {
                            attackObj.destroy();
                        }
                    });
                }
            });
        }

        let spellName = getBasicText('rune_mind_rune_strike');
        this.postAttackCast(spellID, 0, spellName, additionalDamage, numAdditionalAttacks);

    }

    castMindReinforce() {
        const spellID = 'mindReinforce';
        let multiplier = globalObjects.player.spellMultiplier();
        let existingBuff = globalObjects.player.getStatuses()[spellID];
        let statusObj;
        let energyCircle1;
        let energyCircle2;
        let repeatCircle;
        if (existingBuff) {
            // already got a buff in place
            repeatCircle = existingBuff.animObj[0];
            energyCircle1 = existingBuff.animObj[1];
            energyCircle2 = existingBuff.animObj[2];
            statusObj = existingBuff.statusObj;
        } else {
            this.cleanseForms();
            energyCircle1 = this.scene.add.image(gameConsts.halfWidth, globalObjects.player.getY(), 'circle', 'energy_body.png').setScale(0.9).setAlpha(0.75).setDepth(104);
            energyCircle2 = this.scene.add.image(gameConsts.halfWidth, globalObjects.player.getY(), 'circle', 'energy_body.png').setScale(0.8).setAlpha(0.25).setRotation(Math.PI / 8).setDepth(104);
            repeatCircle = this.scene.add.sprite(gameConsts.halfWidth, globalObjects.player.getY(), 'spells').play('powerEffectRepeat').setScale(1.5).setDepth(117);
        }
        let electricCircle = this.scene.add.sprite(gameConsts.halfWidth, globalObjects.player.getY(), 'spells').play('powerEffect').setScale(3.4).setDepth(117);

        let glowCirc = this.scene.add.sprite(gameConsts.halfWidth, globalObjects.player.getY(), 'shields', 'ring_flash0.png').setAlpha(0.5).setDepth(130).setScale(1.2);
        glowCirc.setTint(0x00FFFF);
        glowCirc.playReverse('ring_flash');
        this.scene.tweens.add({
            targets: glowCirc,
            alpha: 1,
            ease: 'Cubic.easeOut',
            duration: 125,
            scaleX: 1.37,
            scaleY: 1.37,
            completeDelay: 300,
            onComplete: () => {
                glowCirc.destroy();
            }
        });

        playSound('power_surge');
        globalObjects.magicCircle.resetElements();

        this.scene.tweens.add({
            targets: energyCircle1,
            duration: 125,
            scaleX: 1.11 + 0.02 * multiplier,
            scaleY: 1.11 + 0.02 * multiplier,
            alpha: 1,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                playSound('mind_shield_retaliate', 0.7 + multiplier * 0.05);
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
            duration: 225,
            scaleX: 1.13 + 0.02 * multiplier,
            scaleY: 1.13 + 0.02 * multiplier,
            alpha: 1,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: energyCircle2,
                    duration: 450,
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

        this.scene.tweens.add({
            targets: repeatCircle,
            duration: 400,
            scaleX: 1.9,
            scaleY: 1.9,
            alpha: 0.8,
            ease: 'Cubic.easeOut',
            completeDelay: 250,
            onComplete: () => {
                repeatCircle.setScale(1.57);
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

        let buffAmt = 3;
        if (multiplier > 1) {
            buffAmt = 3 * multiplier;
        }
        let param = {
            duration: 1650,
        }
        let param2 = {
            alpha: 0,
            scaleX: 1,
            scaleY: 1
        }
        messageBus.publish('animateTrueDamageNum', gameConsts.halfWidth, globalObjects.player.getY() - 25, "+" + buffAmt + " ALL\nDAMAGE", 0.9 + Math.sqrt(buffAmt) * 0.15, param, param2);

        messageBus.publish('selfTakeEffect', {
            name: spellID,
            spellID: spellID,
            animObj: [repeatCircle, energyCircle1, energyCircle2],
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
                        scaleX: 1,
                        scaleY: 1,
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


        let spellName = getBasicText('rune_mind_rune_reinforce');
        if (multiplier >= 2) {
            spellName += " X" + multiplier;
        }
        this.postNonAttackCast(spellID, spellName);
    }
    castMindEnhance() {
        const spellID = 'mindEnhance';
        // next attack hits +1 time
        let existingBuff = globalObjects.player.getStatuses()[spellID];
        let multiplier = globalObjects.player.spellMultiplier();
        let mindObj;
        if (existingBuff) {
            multiplier += existingBuff.multiplier;
            let newScale = 0.25 + multiplier * 0.1;
            mindObj = existingBuff.animObj;
            this.scene.tweens.add({
                targets: mindObj,
                duration: 300,
                ease: 'back.easeOut',
                scaleX: newScale,
                scaleY: newScale,
            });
        } else {
            mindObj = this.scene.add.sprite(gameConsts.halfWidth +205, gameConsts.height - 295, 'spells').play('mindBurnSlow').setDepth(11).setScale(0);
        }
        playSound('mind_enhance');
        let newScale = 0.25 + multiplier * 0.1;
        this.scene.tweens.add({
            targets: mindObj,
            duration: 250,
            ease: 'back.easeOut',
            scaleX: newScale,
            scaleY: newScale,
        });

        messageBus.publish("selfTakeEffect", {
            ignoreBuff: true,
            name: spellID,
            spellID: spellID,
            animObj: mindObj,
            multiplier: multiplier,
            cleanUp: (statuses) => {
                if (statuses[spellID] && !statuses[spellID].currentAnim) {
                    mindObj.setScale(mindObj.scaleX * 1.1);
                    statuses[spellID].currentAnim = this.scene.tweens.add({
                        targets: mindObj,
                        duration: 150,
                        scaleX: mindObj.scaleX * 1.7,
                        scaleY: mindObj.scaleX * 1.7,
                        alpha: 0,
                        ease: 'Quad.easeOut',
                        onComplete: () => {
                            mindObj.destroy();
                        }
                    });
                    statuses[spellID] = null;
                }
            }
        });


        let spellName = getBasicText('rune_mind_rune_enhance');
        if (multiplier > 1) {
            spellName += " X" + multiplier;
        }


        this.postNonAttackCast(spellID, spellName);

    }
    castMindProtect(shieldID, rotation) {
        const spellID = 'mindProtect';
        this.cleanUpExistingShield(shieldID);
        let spellMultiplier = globalObjects.player.spellMultiplier();

        let eyeShieldFile = 'eyeShield.png';
        if (spellMultiplier > 3.1) {
            eyeShieldFile = 'eyeShieldQuint.png';
        } else if (spellMultiplier > 1.1) {
            eyeShieldFile = 'eyeShieldTriple.png';
        }
        let animation1 = this.scene.add.image(gameConsts.halfWidth, MAGIC_CIRCLE_HEIGHT, 'spells', eyeShieldFile);

        animation1.setDepth(110);
        animation1.setOrigin(0.5, 1);
        animation1.setScale(0.85);
        animation1.origScaleX =  0.95 + spellMultiplier * 0.05;
        animation1.rotation = 0;
        animation1.alpha = 0;
        animation1.startY = animation1.y;

        let animation2 =  this.scene.add.sprite(gameConsts.halfWidth, 175, 'spells', 'reticle.png').setScale(0.95);
        animation2.setDepth(110);
        animation2.origScale = animation2.scaleX;
        animation2.alpha = 0.3;
        animation2.visible = false;

        let animation3 = this.scene.add.image(gameConsts.halfWidth, globalObjects.player.getY() - 225, 'spells', 'weakenLines_00.png');
        animation3.startX = animation3.x;
        animation3.startY = animation3.y;
        animation3.setDepth(9999);
        animation3.setOrigin(0.5, 1);
        animation3.rotation = 0;
        animation3.alpha = 0;
        animation3.rotateOffset = 0;

        let textDisplay = this.scene.add.bitmapText(gameConsts.halfWidth, animation2.y, 'bonus', '', 48, 1);
        textDisplay.setOrigin(0.5, 0.5);
        textDisplay.setDepth(animation2.depth);
        textDisplay.setScale(0.5);

        messageBus.publish('setTempRotObjs', [animation1], rotation);
        playSound('mind_shield');

        this.scene.tweens.add({
            targets: animation1,
            duration: 350,
            scaleX: 1,
            scaleY: 1,
            alpha: 0.5,
            ease: 'Cubic.easeIn',
            onComplete: () => {
                messageBus.publish("selfTakeEffect", {
                    ignoreBuff: true,
                    name: shieldID,
                    spellID: shieldID,
                    type: 'mind',
                    animObj: [animation1, animation2, animation3],
                    textObj: textDisplay,
                    storedDamage: 0,
                    multiplier: spellMultiplier,
                    spriteSrc1: 'rune_protect_glow.png',
                    spriteSrc2: 'rune_mind_glow.png',
                    lockRotation: rotation,
                    cleanUp: (statuses) => {
                        if (statuses[shieldID] && !statuses[shieldID].currentAnim) {
                            textDisplay.visible = false;
                            statuses[shieldID].currentAnim = this.scene.tweens.add({
                                delay: 100,
                                targets: [animation1, animation2],
                                duration: 150,
                                alpha: 0,
                                ease: 'Quad.easeIn',
                                onComplete: () => {
                                    animation1.destroy();
                                    animation2.destroy();
                                    animation3.destroy();
                                    textDisplay.destroy();
                                }
                            });
                            if (statuses[shieldID].eyeBlastAnim) {
                                statuses[shieldID].eyeBlastAnim.stop();
                            }
                            messageBus.publish('selfClearEffect', shieldID, true);
                            statuses[shieldID] = null;
                        }
                    }
                });
            }
        });

        let spellName = getBasicText('rune_mind_rune_protect');
        let bonusSize = 0;
        if (spellMultiplier >= 2) {
            spellName = spellName + " X" + spellMultiplier;
            bonusSize = 0.15;
        }
        this.postNonAttackCast(spellID, spellName, bonusSize);
    }
    castMindUltimate() {
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
            playSound('mind_ultimate_2', 0.95);
            newMultiplier = existingMultiplier + 2;
            magicObj = this.scene.add.image(gameConsts.halfWidth, globalObjects.player.getY(), 'spells', 'mind_boost_2.png').setDepth(40);
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
            playSound('mind_ultimate_1', 0.7);

            magicObj = this.scene.add.image(gameConsts.halfWidth, globalObjects.player.getY(), 'spells', 'mind_boost.png').setDepth(40);
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
        magicObj.setScale(0.95);
        magicObj.setAlpha(0.25);
        magicObjects.push(magicObj);

        globalObjects.magicCircle.setAuraAlpha(0.4 + 0.05 * newMultiplier)

        this.scene.tweens.add({
            targets: magicObj,
            duration: 500,
            alpha: 0.75,
            ease: 'Cubic.easeOut',
            scaleX: 1.25,
            scaleY: 1.25,
            onStart: () => {
                // BUGGY WARNING
                if (existingBuff && existingBuff.soundObj) {
                    existingBuff.soundObj.stop();
                }
                let soundObj2 = null;
                let soundObj = playSound('mind_ultimate_loop_1', 0.4, true);
                if (existingMultiplier > 1.01) {
                    soundObj2 = playSound('mind_ultimate_loop_2', 0.8, true);
                }
                messageBus.publish("selfTakeEffect", {
                    ignoreBuff: true,
                    name: spellID,
                    spellID: spellID,
                    animObj: magicObjects,
                    soundObj: soundObj,
                    soundObj2 : soundObj2,
                    multiplier: newMultiplier,
                    cleanUp: (statuses) => {
                        if (statuses[spellID] && !statuses[spellID].currentAnim) {
                            playSound('mind_ultimate_cast');
                            let sound1 = statuses[spellID].soundObj;
                            let sound2 = null;
                            if (statuses[spellID].soundObj2) {
                                sound2 = statuses[spellID].soundObj2;
                            }
                            statuses[spellID].currentAnim = this.scene.tweens.add({
                                targets: magicObjects,
                                duration: 180,
                                alpha: 0,
                                ease: 'Quad.easeOut',
                                onComplete: () => {
                                    fadeAwaySound(sound1);
                                    if (sound2) {
                                        fadeAwaySound(sound2);
                                    }
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
            duration: 70000,
            rotation: "+=6.28318",
            repeat: -1
        });

        let newMultiplierDisplay = newMultiplier - 1;
        let spellName = getBasicText('rune_mind_rune_unload') + " +" + newMultiplierDisplay + "00%";
        let bonusSize = 0.15;
        if (newMultiplier > 4) {
            bonusSize = 0.25;
        } else if (newMultiplier > 2) {
            bonusSize = 0.2;
        }
        messageBus.publish('messageAllSpell', spellID);
        messageBus.publish('recordSpell', spellID, spellName, bonusSize);
    }


    castVoidStrike() {
        this.castMatterStrike();
    }

    castVoidReinforce(elem, embodi) {
        this.castMatterReinforce(elem, embodi);
    }
    castVoidEnhance() {
        const spellID = 'voidEnhance';
        let existingBuff = globalObjects.player.getStatuses()[spellID];
        let multiplier = globalObjects.player.spellMultiplier();
        playSound('void_enhance', 0.55);
        let statusObj;
        let buffAmt = multiplier * 2;
        if (existingBuff) {
            statusObj = existingBuff.statusObj;
            buffAmt += existingBuff.multiplier;
        }

        if (!this.pulseCircle) {
            this.pulseCircle = this.scene.add.image(gameConsts.halfWidth, globalObjects.player.getY(), 'blurry', 'voidcirclelarge.png');
        }
        if (!this.voidSpikeOutButton) {
            this.voidSpikeOutOuter = this.scene.add.image(gameConsts.halfWidth, globalObjects.player.getY(), 'blurry', 'void_spike_out.png');
            this.voidSpikeOutInner = this.scene.add.image(gameConsts.halfWidth, globalObjects.player.getY(), 'blurry', 'void_spike_out.png');
            this.voidSpikeOutButton = this.scene.add.image(gameConsts.halfWidth, globalObjects.player.getY(), 'blurry', 'void_spike_out.png');
        }
        this.pulseCircle.setScale(1.5).setDepth(210).setAlpha(0.05).setPosition(gameConsts.halfWidth, globalObjects.player.getY()).setRotation(Math.random() * 6);

        if (this.voidSpikeOutOuter.currAnim) {
            this.voidSpikeOutOuter.currAnim.stop();
        }
        this.voidSpikeOutOuter.setScale(1.6).setDepth(99).setRotation(Math.random() * 6).setVisible(true);
        this.voidSpikeOutInner.setScale(1.2).setDepth(101).setRotation(this.voidSpikeOutOuter.rotation + 0.15).setVisible(true);
        this.voidSpikeOutButton.setScale(0.6).setDepth(104).setRotation(this.voidSpikeOutOuter.rotation + 0.3).setVisible(true);

        PhaserScene.tweens.add({
            targets: [this.pulseCircle],
            scaleX: 0.5,
            scaleY: 0.5,
            duration: 500,
            ease: 'Cubic.easeInOut',
        });
        PhaserScene.tweens.add({
            targets: [this.pulseCircle],
            duration: 200,
            ease: 'Cubic.easeOut',
            alpha: 1,
            onComplete: () => {
                let healthLost = 3 * multiplier;
                let newMaxHealth = Math.ceil(globalObjects.player.getHealthMax() - healthLost);
                let newHealth = globalObjects.player.getHealth() - healthLost;
                globalObjects.player.setHealth(newHealth);
                globalObjects.player.setHealthMaxTemp(newMaxHealth);

                PhaserScene.tweens.add({
                    targets: [this.pulseCircle],
                    duration: 300,
                    alpha: 0,
                });
                let holdDelay = 200 + Math.floor(Math.sqrt(multiplier) * 20);
                PhaserScene.tweens.add({
                    targets: [this.voidSpikeOutButton],
                    duration: 160,
                    scaleX: 0.95 + multiplier * 0.04,
                    scaleY: 0.95 + multiplier * 0.04,
                    ease: 'Back.easeOut',
                    onComplete: () => {
                        PhaserScene.tweens.add({
                            targets: [this.voidSpikeOutButton],
                            delay: holdDelay,
                            duration: 400,
                            scaleX: 0.6,
                            scaleY: 0.6,
                            ease: 'Quad.easeIn',
                        });
                    }
                });
                PhaserScene.tweens.add({
                    delay: 10,
                    targets: [this.voidSpikeOutInner],
                    duration: 160,
                    scaleX: 1.55 + multiplier * 0.06,
                    scaleY: 1.55 + multiplier * 0.06,
                    ease: 'Back.easeOut',
                    completeDelay: 90,
                    onComplete: () => {
                        PhaserScene.tweens.add({
                            targets: [this.voidSpikeOutInner],
                            delay: holdDelay,
                            duration: 400,
                            scaleX: 1.2,
                            scaleY: 1.2,
                            ease: 'Quad.easeIn',
                        });
                    }
                });
                this.voidSpikeOutOuter.currAnim = PhaserScene.tweens.add({
                    delay: 20,
                    targets: [this.voidSpikeOutOuter],
                    duration: 160,
                    scaleX: 1.95 + multiplier * 0.08,
                    scaleY: 1.95 + multiplier * 0.08,
                    ease: 'Back.easeOut',
                    completeDelay: 180,
                    onComplete: () => {
                        this.voidSpikeOutOuter.curranim = PhaserScene.tweens.add({
                            targets: [this.voidSpikeOutOuter],
                            delay: holdDelay,
                            duration: 400,
                            scaleX: 1.56,
                            scaleY: 1.56,
                            ease: 'Quad.easeIn',
                            onComplete: () => {
                                this.voidSpikeOutOuter.visible = false;
                                this.voidSpikeOutInner.visible = false;
                                this.voidSpikeOutButton.visible = false;

                            }
                        });
                    }
                });
            }
        });


        let param = {
            duration: 1650,
        }
        let param2 = {
            alpha: 0,
            scaleX: 1,
            scaleY: 1
        }
        messageBus.publish('animateVoidNum', gameConsts.halfWidth, globalObjects.player.getY() - 40, "+" + buffAmt + " ATK\nDAMAGE", 1 + Math.sqrt(buffAmt) * 0.18, param, param2);

        messageBus.publish('selfTakeEffect', {
            name: spellID,
            spellID: spellID,
            multiplier: buffAmt,
            statusObj: statusObj,
            spriteSrc1: 'rune_enhance_glow.png',
            spriteSrc2: 'rune_void_glow.png',
            displayAmt: buffAmt,
            cleanUp: (statuses) => {
                statuses[spellID] = null;
            }
        });


        let spellName = getBasicText('rune_void_rune_enhance');
        if (multiplier > 1) {
            spellName += " X" + multiplier;
        }
        this.postNonAttackCast(spellID, spellName);
    }

    castVoidProtect(shieldID, rotation) {
        this.castMatterProtect(shieldID, rotation);
    }
    castVoidUltimate() {
        this.castMindStrike();
    }


    createRockParticle(x, y, velX, velY, duration) {
        let particle = this.particlesRock.pop();
        if (!particle) {
            particle = this.scene.add.image(x, y, 'spells', 'rock_chip.png');
            particle.setDepth(15);
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

    postAttackCast(spellID, delayAmt = 0, spellName = "UNNAMED ATTACK", additionalDamage, numAdditionalAttacks) {
        PhaserScene.time.delayedCall(delayAmt, () => {
            messageBus.publish('attackLaunched', spellID);
            let mindAttackBuff = globalObjects.player.getStatuses()['mindEnhance'];
            if (mindAttackBuff) {
                let animObj = mindAttackBuff.animObj;
                this.scene.tweens.add({
                    targets: animObj,
                    y: 140,
                    duration: 400,
                    onComplete: () => {
                        let mult = 5;
                        messageBus.publish('applyMindBurn', mult, mindAttackBuff.multiplier);
                        mindAttackBuff.cleanUp(globalObjects.player.getStatuses());
                    }
                });
                this.scene.tweens.add({
                    targets: animObj,
                    ease: 'Cubic.easeIn',
                    x: gameConsts.halfWidth - 10,
                    duration: 400,
                });
            }

            /*
            let voidAttackBuff = globalObjects.player.getStatuses()['voidEnhance'];
            if (voidAttackBuff) {
                let animObj = voidAttackBuff.animObj;
                let targetY = 178;
                this.scene.tweens.add({
                    targets: animObj,
                    y: targetY - 10,
                    duration: 260,
                    ease: 'Quad.easeOut',
                    rotation: "+=2",
                    onComplete: () => {
                        messageBus.publish('increaseCurse', voidAttackBuff.multiplier);
                        voidAttackBuff.cleanUp(globalObjects.player.getStatuses());
                        let bigCurse = this.scene.add.sprite(gameConsts.halfWidth, targetY, 'enemies', 'curse_symbol.png');
                        let startScale = 1.2 + 0.22 * Math.sqrt(voidAttackBuff.multiplier);
                        bigCurse.setScale(startScale).setDepth(15);
                        this.scene.tweens.add({
                            targets: bigCurse,
                            ease: 'Quint.easeOut',
                            scaleX: startScale - 0.02,
                            scaleY: startScale - 0.02,
                            alpha: 0.25,
                            duration: 300,
                            completeDelay: 500,
                            onComplete: () => {
                                this.scene.tweens.add({
                                    targets: bigCurse,
                                    ease: 'Cubic.easeIn',
                                    alpha: 0,
                                    duration: 800,
                                    onComplete: () => {
                                        bigCurse.destroy();
                                    }
                                });
                            }
                        });
                    }
                });
                this.scene.tweens.add({
                    targets: animObj,
                    x: gameConsts.halfWidth + 10,
                    duration: 260,
                });
            }

             */
        });
        messageBus.publish('recordSpellAttack', spellID, spellName, undefined, additionalDamage, numAdditionalAttacks);
        messageBus.publish('messageAllSpell', spellID, spellName);
        messageBus.publish('clearAttackMultiplier');
        messageBus.publish('clearDamageAdder');
    }

    postNonAttackCast(spellID, spellName = "UNNAMED SPELL") {
        messageBus.publish('recordSpell', spellID, spellName);
        messageBus.publish('messageAllSpell', spellID, spellName);
        messageBus.publish('clearSpellMultiplier');
    }

    cleanUpExistingShield(shieldID) {
        let existingBuff = globalObjects.player.getStatuses()[shieldID];
        if (existingBuff) {
            // already got a shield in place
            messageBus.publish('selfClearEffect', shieldID);
        }
    }

    cleanseForms() {
        let existingBuff1 = globalObjects.player.getStatuses()['mindReinforce'];
        // let existingBuff2 = globalObjects.player.getStatuses()['timeReinforce'];
        let existingBuff3 = globalObjects.player.getStatuses()['matterReinforce'];
        if (existingBuff1) {
            messageBus.publish('selfClearStatuses', 'mindReinforce');
            let param = {
                duration: 800,
                ease: 'Cubic.easeOut',
                alpha: 0.9,
                y: "+=4",
            }
            let param2 = {
                duration: 1000,
                ease: 'Quad.easeIn',
                alpha: 0,
            }
            messageBus.publish('animateBlockNum', gameConsts.halfWidth, globalObjects.player.getY() + 24, "-DAMAGE", 0.75, param, param2);
        }
        // if (existingBuff2) {
        //     messageBus.publish('selfClearEffect', 'timeReinforce');
        // }
        if (existingBuff3) {
            messageBus.publish('selfClearStatuses', 'matterReinforce');

            let param = {
                duration: 800,
                ease: 'Cubic.easeOut',
                alpha: 0.9,
                y: "+=4",
            }
            let param2 = {
                duration: 1000,
                ease: 'Quad.easeIn',
                alpha: 0,
            }
            messageBus.publish('animateBlockNum', gameConsts.halfWidth, globalObjects.player.getY() + 30, "-THORNS", 0.75, param, param2);
        }
    }
}
