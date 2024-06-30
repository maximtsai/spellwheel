let language = 'en_us';

let textData = {
    matter_strike_desc: {en_us: 'Deal 12 damage',
        fr: '',
        zh_tw: '造成 12 點傷害',
        zh_cn: '造成 12 点伤害',
        ru: '',
        es: '',
        jp: ''
    },
    matter_strike_plus_desc: {en_us: 'Deal 14 damage',
        fr: '',
        zh_tw: '造成 14 點傷害',
        zh_cn: '造成 14 点伤害',
        ru: '',
        es: '',
        jp: ''
    },
    matter_enhance_desc: {en_us: 'Next attack\ngains +6\ndamage',
        fr: '',
        zh_tw: '下個攻擊造成\n+6 點傷害',
        zh_cn: '下个攻击造成\n+6 点伤害',
        ru: '',
        es: '',
        jp: ''
    },
    matter_protect_desc: {en_us: 'Create a shield\nthat blocks 12\ndamage',
        fr: '',
        zh_tw: '創建一個阻擋\n12 點傷害的護盾',
        zh_cn: '创建一个阻挡\n12 点伤害的护盾',
        ru: '',
        es: '',
        jp: ''
    },
    matter_protect_plus_desc: {en_us: 'Create a shield\nthat blocks 14\ndamage',
        fr: '',
        zh_tw: '創建一個阻擋\n14 點傷害的護盾',
        zh_cn: '创建一个阻挡\n14 点伤害的护盾',
        ru: '',
        es: '',
        jp: ''
    },
    matter_reinforce_desc: {en_us: 'Gain thorns that\nprotect you and\nreflect 1 damage',
        fr: '',
        zh_tw: '獲得荊棘來保護你\n並反射 1 點傷害',
        zh_cn: '获得荆棘来保护你\n并反射 1 点伤害',
        ru: '',
        es: '',
        jp: ''
    },
    matter_unload_desc: {en_us: 'Deal 24 damage.\nGain 24 temporary\nprotection',
        fr: '',
        zh_tw: '造成 24 點傷害。\n' +
            '獲得 24 點臨時保護',
        zh_cn: '造成 24 点伤害。\n获得 24 点临时保护',
        ru: '',
        es: '',
        jp: ''
    },

    time_strike_desc: {en_us: 'Attack twice.\nFirst attack deals\n6 damage, second\nattack deals 50%\nof first.',
        fr: '',
        zh_tw: '',
        zh_cn: '攻击两次。\n' +
            '第一次攻击造成\n6 点伤害，第二次\n攻击造成第一次\n攻击的 50%',
        ru: '',
        es: '',
        jp: ''
    },
    time_enhance_desc: {en_us: 'Create an extra\ncopy of your\nnext attack',
        fr: '',
        zh_tw: '',
        zh_cn: '为你的下一次攻击\n创建一份额外的副本',
        ru: '',
        es: '',
        jp: ''
    },
    time_protect_desc: {en_us: 'Create a shield\nthat delays up\nto 60 damage',
        fr: '',
        zh_tw: '',
        zh_cn: '创建一个可延迟\n60 点伤害的护盾',
        ru: '',
        es: '',
        jp: ''
    },
    time_reinforce_desc: {en_us: 'Heal 50% of your\nlast injury and\n50% of your\ndelayed damage',
        fr: '',
        zh_tw: '',
        zh_cn: '恢复上次伤害的\n50% 和延迟伤害\n的 50%',
        ru: '',
        es: '',
        jp: ''
    },
    time_unload_desc: {en_us: 'Freeze time for\nthe next 7 spells.\nGets weaker\nwith repeat use.',
        fr: '',
        zh_tw: '',
        zh_cn: '冻结接下来 7 个\n法术的时间。重复\n使用会变弱',
        ru: '',
        es: '',
        jp: ''
    },

    void_strike_desc: {en_us: 'Attack 3 times\nafter a delay,\neach attack\ndeals 2% enemy\ncurrent HP',
        fr: '',
        zh_tw: '',
        zh_cn: '延迟后攻击3次，\n每次攻击造成敌人\n当前生命值的2%',
        ru: '',
        es: '',
        jp: ''
    },
    void_enhance_desc: {en_us: 'Next attack curses\nthe enemy\nto take +1 damage\nfrom all sources',
        fr: '',
        zh_tw: '',
        zh_cn: '下一次攻击诅咒\n敌人受到来自所有\n来源的 +1 伤害',
        ru: '',
        es: '',
        jp: ''
    },
    void_protect_desc: {en_us: 'Create a shield\nthat completely\nnegates one\nattack',
        fr: '',
        zh_tw: '',
        zh_cn: '创建一个可以完全\n抵挡一次攻击的\n盾牌',
        ru: '',
        es: '',
        jp: ''
    },
    void_reinforce_desc: {en_us: 'Heal to full,\nbut lose 15%\nmax hp',
        fr: '',
        zh_tw: '',
        zh_cn: '恢复至满血，\n但损失 15%\n总生命值',
        ru: '',
        es: '',
        jp: ''
    },
    void_unload_desc: {en_us: 'Damage 10% of\nenemy current HP\nand disrupt their\naction',
        fr: '',
        zh_tw: '',
        zh_cn: '伤害敌人当前生命\n值的 10% 并打断\n其当前行动',
        ru: '',
        es: '',
        jp: ''
    },

    mind_strike_desc: {en_us: 'Deal 1 damage.\nEnemy takes x2\ndamage from\nyour next attack',
        fr: '',
        zh_tw: '',
        zh_cn: '造成 1 点伤害。\n敌人将在你的下\n一次攻击中受到\n2 倍伤害',
        ru: '',
        es: '',
        jp: ''
    },
    mind_enhance_desc: {en_us: 'Next attack burns\nenemy for 10\nTrue damage\nover 5 seconds',
        fr: '',
        zh_tw: '',
        zh_cn: '下一次攻击在 5\n秒内造成 10 点\n真实伤害',
        ru: '',
        es: '',
        jp: ''
    },
    mind_enhance_plus_desc: {en_us: 'Next attack burns\nenemy for 15\nTrue damage\nover 5 seconds',
        fr: '',
        zh_tw: '',
        zh_cn: '下一次攻击在 5\n秒内造成 15 点\n真实伤害',
        ru: '',
        es: '',
        jp: ''
    },
    mind_protect_desc: {en_us: 'Create a shield\nthat absorbs 50%\ndamage then\nblasts it back',
        fr: '',
        zh_tw: '',
        zh_cn: '创建一个吸收 50%\n伤害的盾牌，吸收\n后将伤害反射回去',
        ru: '',
        es: '',
        jp: ''
    },
    mind_reinforce_desc: {en_us: 'Attacks gain\n+2 damage',
        fr: '',
        zh_tw: '',
        zh_cn: '攻击造成 +2 伤害',
        ru: '',
        es: '',
        jp: ''
    },
    mind_unload_desc: {en_us: 'Next non-attack\nspell has +200%\neffectiveness',
        fr: '',
        zh_tw: '',
        zh_cn: '下一个非攻击性\n法术效果增加\n+200%',
        ru: '',
        es: '',
        jp: ''
    },

    // ================== Tutorial ================
    matter_tut_desc: {en_us: 'The Matter rune grants\ncontrol over the physical.\nMatter spells are good at dealing direct damage\nand providing reliable protection.',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    matter_plus_tut_desc: {en_us: 'Your mastery over the\nMatter element strengthens\nsome of your existing Matter spells.',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    matter_tut_strike_desc: {en_us: 'Conjure a ball of rock\nthat deals solid damage.\nSimple but effective.',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    matter_tut_enhance_desc: {en_us: 'Makes your next attack\ndeal extra damage.\nAlso makes the attack a\nlittle bit bigger.',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    matter_tut_protect_desc: {en_us: 'Creates a shield that blocks\na flat amount of damage.',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    matter_tut_reinforce_desc: {en_us: 'Defensive buff that protects\nyou with spiky skin.\nGreat against large quantities\nof weaker attacks.',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    matter_tut_unload_desc: {en_us: 'Conjures a great deal of matter\nto simultaneously crush your\nenemies while keeping yourself\nprotected.',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    mind_tut_desc: {en_us: 'The Energy rune grants\ncontrol over raw energy.\nEnergy spells have powerful supportive\neffects and can deal True damage that\nbypasses enemy defenses.',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    mind_plus_tut_desc: {en_us: 'Your mastery over the element strengthens\nsome of your existing Energy spells.',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    mind_tut_strike_desc: {en_us: 'Fires a bolt of energy that\ndeals little damage by itself,\nbut amplifies your next\nattack for double (x2) damage.',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    mind_tut_enhance_desc: {en_us: 'Your next attack sets the\nenemy on fire, which deals\nTrue damage over time that\nignores defenses.',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    mind_tut_protect_desc: {en_us: 'Creates a shield that blocks\nhalf of all damage, while\nstoring up and retaliating with\nthe damage you do take.',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    mind_tut_reinforce_desc: {en_us: 'Offensive buff that electrifies\nyourself to boost your\nattacks with extra damage.',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    mind_tut_unload_desc: {en_us: 'Multiplies the effectiveness\nof your next non-attack spell.\nThose clever enough to cast\nthis spell twice in a row\ncan attain breathtaking\nspell-amplifying power.',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},

    time_tut_desc: {en_us: 'The Time rune grants \ncontrol over the temporal.\nTime spells let you attack multiple\ntimes, delay injuries, or even slow\nyour enemies to a stand-still.',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    time_tut_strike_desc: {en_us: 'An attack that deals modest\ndamage but also strikes a\nsecond time at 50% power.\nParticularly strong when\ncombined with +damage\nenhancements.',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    time_tut_enhance_desc: {en_us: 'Your next attack is duplicated\nallowing you to fire multiple\nattacks at the same time.',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    time_tut_protect_desc: {en_us: 'Creates a shield that delays\nthe damage you take to a\nslow trickle, up to a limit.',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    time_tut_reinforce_desc: {en_us: 'Heals you by partially\nundoing your most recent\ninjury.',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    time_tut_unload_desc: {en_us: 'Slows down time to a near\nstand-still for several easy\nand stress-free spell casts.',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},

    void_tut_desc: {en_us: 'The Void rune grants \ncontrol over the power of empty\nspace. Void spells can deal\npercentage health damage,\nnegate enemy attacks, or even\nfully heal you at a cost.',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    void_tut_strike_desc: {en_us: 'An attack that deals percentage\nhealth damage and strikes an\nadditional 2 more times after\na delay.',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    void_tut_enhance_desc: {en_us: 'Curses an enemy, causing them\nto take more damage from\neverything. Works well with\nother spells that deal damage\nmultiple times.',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    void_tut_protect_desc: {en_us: 'Creates a shield that negates\nall damage from a single\nenemy attack hit, no matter\nhow strong.',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    void_tut_reinforce_desc: {en_us: 'Become briefly invulnerable\nand heal to full, but at\nthe cost of some max health.',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    void_tut_unload_desc: {en_us: 'Creates a vortex that deals\nheavy percent health damage\nwhile disrupting any action\nthe enemy is trying to make.',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},


    protect_tut_desc: {en_us: 'The Shield rune creates\nbarriers that protect you as\nlong as they are positioned\nbetween you and the enemy.',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    reinforce_tut_desc: {en_us: 'The Body rune grants effects\nthat persist until you cast\na new body spell.\nSome Body+Rune combos can even heal you.',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    unload_tut_desc: {en_us: 'The Ultimate rune grants you\nsome of the most powerful\nspells in your arsenal.\nUse this rune wisely.',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    no_improve_tut_desc: {en_us: 'You see no more need to\nimprove. You are certain that\nyou are strong enough to take\non any challenge.',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},





    desc1: {en_us: '',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    desc2: {en_us: '',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    desc3: {en_us: '',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    desc4: {en_us: '',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    desc5: {en_us: '',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    desc6: {en_us: '',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    desc7: {en_us: '',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    desc8: {en_us: '',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    desc9: {en_us: '',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    desc10: {en_us: '',
        fr: '',
        zh_tw: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},


};

function setLanguage(lang) {
    language = lang;
}

function getLangText(textName) {
    if (!textData[textName]) {
        console.error("Missing text name ", textName);
        return "MISSING TEXT";
    }
    return textData[textName][language];
}
