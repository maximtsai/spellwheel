let language = 'en_us';

const textData = {
    matter_strike_desc: {en_us: 'Deal 12 damage', fr: '', zh_cn: '造成 12 点伤害', ru: '', es: '', jp: ''},
    matter_strike_plus_desc: {en_us: 'Deal 14 damage', fr: '', zh_cn: '造成 14 点伤害', ru: '', es: '', jp: ''},
    matter_enhance_desc: {en_us: 'Next attack\nDeals +6\ndamage', fr: '', zh_cn: '下个攻击造成\n+6 点伤害', ru: '', es: '', jp: ''},
    matter_protect_desc: {en_us: 'Create a shield\nthat blocks 14\ndamage', fr: '', zh_cn: '创建一个阻挡\n14 点伤害的护盾', ru: '', es: '', jp: ''},
    matter_reinforce_desc: {en_us: 'When attacked,\nreduce damage\ntaken by 2 and\nreturn 2 damage', fr: '', zh_cn: '', ru: '', es: '', jp: ''},
    matter_unload_desc: {en_us: 'Deal 20 damage.\nBlock 20 damage\nfor the next\n5 seconds', fr: '', zh_cn: '', ru: '', es: '', jp: ''},

    time_strike_desc: {en_us: 'Deal 6 damage,\nthen deal half\nthat damage\na second time', fr: '', zh_cn: '', ru: '', es: '', jp: ''},
    time_enhance_desc: {en_us: 'Next attack\nis cast an\nextra time', fr: '', zh_cn: '', ru: '', es: '', jp: ''},
    time_protect_desc: {en_us: 'Create a shield\nthat delays up to\n50 damage', fr: '', zh_cn: '', ru: '', es: '', jp: ''},
    time_reinforce_desc: {en_us: 'Heal half of\nthe damage you\ntook from the\nlast attack', fr: '', zh_cn: '', ru: '', es: '', jp: ''},
    time_unload_desc: {en_us: 'Freeze time for\nthe next 6 spells.\nLoses power\nwith repeat use.', fr: '', zh_cn: '', ru: '', es: '', jp: ''},

    void_strike_desc: {en_us: 'Damage 1.5%\nenemy current\nHP. Deal that\ndamage 2 more\ntimes after a\ndelay.', fr: '', zh_cn: '', ru: '', es: '', jp: ''},
    void_enhance_desc: {en_us: 'Next attack\ncurses the enemy\nto take +1 damage\nfrom all sources', fr: '', zh_cn: '', ru: '', es: '', jp: ''},
    void_protect_desc: {en_us: 'Create a shield\nthat completely\nnegates one\nattack', fr: '', zh_cn: '', ru: '', es: '', jp: ''},
    void_reinforce_desc: {en_us: 'Heal to full, but\nat the cost of\n20% max hp', fr: '', zh_cn: '', ru: '', es: '', jp: ''},
    void_unload_desc: {en_us: 'Damage 12.5% of\nenemy current HP\nand disrupt their\naction', fr: '', zh_cn: '', ru: '', es: '', jp: ''},

    mind_strike_desc: {en_us: 'Deal 1 damage.\nEnemy takes X2\ndamage from\nnext attack hit', fr: '', zh_cn: '', ru: '', es: '', jp: ''},
    mind_enhance_desc: {en_us: 'Next attack deals\n3 DMG/s for\n4 seconds.\n(Non-stacking)', fr: '', zh_cn: '', ru: '', es: '', jp: ''},
    mind_enhance_plus_desc: {en_us: 'Next attack deals\n3 DMG/s for\n5 seconds', fr: '', zh_cn: '', ru: '', es: '', jp: ''},
    mind_protect_desc: {en_us: 'Create a shield\nthat reflects\nhalf the damage\nyou take', fr: '', zh_cn: '', ru: '', es: '', jp: ''},
    mind_reinforce_desc: {en_us: 'Attacks deal\n+2 damage', fr: '', zh_cn: '', ru: '', es: '', jp: ''},
    mind_unload_desc: {en_us: 'Next non-attack\nspell has +200%\neffectiveness', fr: '', zh_cn: '', ru: '', es: '', jp: ''},


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
