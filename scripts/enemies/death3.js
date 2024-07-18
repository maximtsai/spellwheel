class Death3 extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.initSprite('max_death_3.png', 1, 0, 0, 'deathfinal');
        this.bgtemp = this.addImage(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'waterfall.png').setDepth(-5);
        this.cape = this.addSprite(x - 99, y - 35, 'deathfin', 'frame0000.png').setDepth(-2).play('ladydeathcape');
        this.hood = this.addSprite(x - 99, y - 35, 'deathfin', 'hood0000.png').setDepth(9).play('ladydeathhood');
        this.addTimeout(() => {
            globalObjects.magicCircle.enableMovement();
            globalObjects.encyclopedia.showButton();
            globalObjects.options.showButton();
            // this.setAsleep();
        }, 10)
    }

    initStatsCustom() {
        this.health = 100;
    }

    repeatTweenBreathe(duration = 1500, magnitude = 1) {
        if (this.breatheTween) {
            this.breatheTween.stop();
        }
    }


    setHealth(newHealth) {
        // messageBus.publish('animateBlockNum', gameConsts.halfWidth, this.sprite.y + 50, 'IMMATERIAL', 0.8, {y: "+=5", ease: 'Quart.easeOut'}, {alpha: 0, scaleX: 1.1, scaleY: 1.1});

        super.setHealth(newHealth);
        let currHealthPercent = this.health / this.healthMax;
        if (currHealthPercent == 0) {
            // dead, can't do anything
            return;
        } else {
            let prevHealthPercent = this.prevHealth / this.healthMax;
            if (prevHealthPercent > 0.5 && currHealthPercent <= 0.5 && !this.thornForm) {
                this.thornForm = true;
                this.interruptCurrentAttack();
            }
        }
    }


    initAttacks() {
        this.attacks = [
            [
                {
                    name: "|8x2",
                    chargeAmt: 600,
                    chargeMult: 2,
                    finishDelay: 3000,
                    damage: -1,
                    isBigMove: true,
                    attackStartFunction: () => {

                    },
                    finaleFunction: () => {
                    }
                },

            ]
        ];
    }

    die() {
        fadeAwaySound(this.bgMusic);

    }
}
