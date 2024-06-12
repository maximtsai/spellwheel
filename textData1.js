let language = 'en_us';

const textData = {
    matter_strike_desc: {en_us: 'Deal 12 damage',
        fr: '',
        zh_cn: '造成 12 点伤害',
        ru: '',
        es: '',
        jp: ''
    },
    matter_strike_plus_desc: {en_us: 'Deal 14 damage',
        fr: '',
        zh_cn: '造成 14 点伤害',
        ru: '',
        es: '',
        jp: ''
    },
    matter_enhance_desc: {en_us: 'Next attack\ngains +6\ndamage',
        fr: '',
        zh_cn: '下个攻击造成\n+6 点伤害',
        ru: '',
        es: '',
        jp: ''
    },
    matter_protect_desc: {en_us: 'Create a shield\nthat blocks 12\ndamage',
        fr: '',
        zh_cn: '创建一个阻挡\n14 点伤害的护盾',
        ru: '',
        es: '',
        jp: ''
    },
    matter_protect_plus_desc: {en_us: 'Create a shield\nthat blocks 14\ndamage',
        fr: '',
        zh_cn: '创建一个阻挡\n14 点伤害的护盾',
        ru: '',
        es: '',
        jp: ''
    },
    matter_reinforce_desc: {en_us: 'Gain thorns that\nprotect you and\nreflect 1 damage',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''
    },
    matter_unload_desc: {en_us: 'Deal 22 damage.\nGain 22 temporary\nprotection',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''
    },

    time_strike_desc: {en_us: 'Deal 6 damage,\nthen deal 50%\nthat damage\na second time',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''
    },
    time_enhance_desc: {en_us: 'Create an extra\ncopy of your\nnext attack',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''
    },
    time_protect_desc: {en_us: 'Create a shield\nthat delays up\nto 60 damage',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''
    },
    time_reinforce_desc: {en_us: 'Heal 50% of your\nlast injury and\n50% of your\ndelayed damage.',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''
    },
    time_unload_desc: {en_us: 'Freeze time for\nthe next 7 spells.\nGets weaker\nwith repeat use.',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''
    },

    void_strike_desc: {en_us: 'Attack 3 times\nafter a delay,\neach attack\ndeals 2% enemy\ncurrent HP.',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''
    },
    void_enhance_desc: {en_us: 'Next attack\ncurses the enemy\nto take +1 damage\nfrom all sources',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''
    },
    void_protect_desc: {en_us: 'Create a shield\nthat completely\nnegates one\nattack',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''
    },
    void_reinforce_desc: {en_us: 'Heal to full,\nbut lose\n20% max hp',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''
    },
    void_unload_desc: {en_us: 'Damage 10% of\nenemy current HP\nand disrupt their\naction',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''
    },

    mind_strike_desc: {en_us: 'Deal 1 damage.\nEnemy takes true\ndamage equal to\nyour next attack',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''
    },
    mind_enhance_desc: {en_us: 'Next attack burns\nenemy for 10\ntrue damage\nover 5 seconds',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''
    },
    mind_enhance_plus_desc: {en_us: 'Next attack burns\nenemy for 15\ntrue damage\nover 5 seconds',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''
    },
    mind_protect_desc: {en_us: 'Create a shield\nthat absorbs 50%\nincoming damage\nthen blasts it\nback.',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''
    },
    mind_reinforce_desc: {en_us: 'Attacks gain\n+2 damage',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''
    },
    mind_unload_desc: {en_us: 'Next non-attack\nspell has +200%\neffectiveness',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''
    },

    // ================== Tutorial ================
    matter_tut_desc: {en_us: 'The Matter rune grants control\nover the physical.\nMatter spells are good at dealing direct damage\nand providing reliable protection.',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    matter_plus_tut_desc: {en_us: 'The Matter rune grants control\nover the physical.\nYour mastery over the element strengthens\nsome of your existing Matter spells.',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    matter_tut_strike_desc: {en_us: 'Conjure a ball of rock\nthat deals solid damage.\nSimple but effective.',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    matter_tut_enhance_desc: {en_us: 'Makes your next attack\ndeal extra damage.\nAlso makes the attack a\nlittle bit bigger.',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    matter_tut_protect_desc: {en_us: 'Creates a shield that blocks\na flat amount of damage.',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    matter_tut_reinforce_desc: {en_us: 'Defensive buff that protects\nyou with spiky skin.\nGreat against large quantities\nof weaker attacks.',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    matter_tut_unload_desc: {en_us: 'Conjures a great deal of matter\nto simultaneously crush your\nenemies while keeping yourself\nprotected.',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    mind_tut_desc: {en_us: 'The Energy rune grants control\nover raw energy.\nEnergy spells have powerful supportive effects and\ncan deal damage that bypasses enemy shields.',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    mind_plus_tut_desc: {en_us: 'The Energy rune grants control\nover raw energy.\nYour mastery over the element strengthens\nsome of your existing Energy spells.',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    mind_tut_strike_desc: {en_us: 'Fires a bolt of energy that\ndeals little damage by itself,\nbut amplifies your next\nattack for double (x2) damage.',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    mind_tut_enhance_desc: {en_us: 'Your next attack sets the\nenemy on fire, which deals\ntrue damage over time that\nignores defenses.',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    mind_tut_protect_desc: {en_us: 'Creates a shield that blocks\nhalf of all damage, while\nstoring up and retaliating with\nthe damage you do take.',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    mind_tut_reinforce_desc: {en_us: 'Offensive buff that electrifies\nyourself to boost your\nattacks with extra damage.',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    mind_tut_unload_desc: {en_us: 'Multiplies the effectiveness\nof your next non-attack spell.\nThose clever enough to cast\nthis spell twice in a row\ncan attain breathtaking\nspell-amplifying power.',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},

    time_tut_desc: {en_us: 'The Time rune grants control\nover the temporal.\nTime spells let you attack multiple times, delay\ninjuries, or even slow your enemies to a stand-still.',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    time_tut_strike_desc: {en_us: 'An attack that deals modest\ndamage but also strikes a\nsecond time at 50% power.\nParticularly strong when\ncombined with +damage\nenhancements.',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    time_tut_enhance_desc: {en_us: 'Your next attack is duplicated\nallowing you to fire multiple\nattacks at the same time.',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    time_tut_protect_desc: {en_us: 'Creates a shield that delays\nall damage you take to a\nslow trickle, up to a limit.',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    time_tut_reinforce_desc: {en_us: 'Heals you by partially\nundoing your most recent\ninjury.',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    time_tut_unload_desc: {en_us: 'Slows down time to a near\nstand-still for several easy\nand stress-free spell casts.',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},

    void_tut_desc: {en_us: 'The Void rune grants control\nover the power of empty\nspace. Void spells can deal\npercentage health damage,\nnegate enemy attacks, or even\nfully heal you at a cost.',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    void_tut_strike_desc: {en_us: 'An attack that deals percentage\nhealth damage and strikes an\nadditional 2 more times after\na delay.',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    void_tut_enhance_desc: {en_us: 'Curses an enemy, causing them\nto take more damage from\neverything. Works well with\nother spells that deal damage\nmultiple times.',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    void_tut_protect_desc: {en_us: 'Creates a shield that negates\nall damage from a single\nenemy attack hit, no matter\nhow strong.',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    void_tut_reinforce_desc: {en_us: 'Become briefly invulnerable\nand heal to full, but at\nthe cost of some max health.',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    void_tut_unload_desc: {en_us: 'Creates a vortex that deals\nheavy percent health damage\nwhile disrupting any action\nthe enemy is trying to make.',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},


    protect_tut_desc: {en_us: 'The Shield rune lets you create\nbarriers that protect you as long as they\nare positioned between you and the enemy.',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    reinforce_tut_desc: {en_us: 'The Body rune strengthens you\nwith effects that persist until you cast\na new body spell.\nSome Body+Rune combos can even heal you.',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    unload_tut_desc: {en_us: 'The Ultimate rune grants you\nsome of the most powerful\nspells in your arsenal.\nUse this rune wisely.',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    no_improve_tut_desc: {en_us: 'You see no more need to improve.\nYou are certain that you are strong\nenough to take on any challenge.',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},







    desc1: {en_us: '',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    desc2: {en_us: '',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    desc3: {en_us: '',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    desc4: {en_us: '',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    desc5: {en_us: '',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    desc6: {en_us: '',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    desc7: {en_us: '',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    desc8: {en_us: '',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    desc9: {en_us: '',
        fr: '',
        zh_cn: '',
        ru: '',
        es: '',
        jp: ''},
    desc10: {en_us: '',
        fr: '',
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
