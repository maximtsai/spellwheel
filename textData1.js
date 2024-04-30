let language = 'en_us';

const textData = {
    matter_strike_desc: {en_us: 'DEAL 12 DAMAGE', fr: '', zh_cn: '造成 12 点伤害', ru: '', es: '', jp: ''},
    matter_strike_plus_desc: {en_us: 'DEAL 14 DAMAGE', fr: '', zh_cn: '造成 14 点伤害', ru: '', es: '', jp: ''},
    matter_enhance_desc: {en_us: 'NEXT ATTACK\nDEALS +6\nDAMAGE', fr: '', zh_cn: '下个攻击造成\n+6 点伤害', ru: '', es: '', jp: ''},
    matter_protect_desc: {en_us: 'CREATE A SHIELD\nTHAT BLOCKS 14\nDAMAGE', fr: '', zh_cn: '创建一个阻挡\n14 点伤害的护盾', ru: '', es: '', jp: ''},
    matter_reinforce_desc: {en_us: 'WHEN ATTACKED,\nREDUCE INCOMING\nDAMAGE BY 2 AND\nRETURN 2 DAMAGE', fr: '', zh_cn: '', ru: '', es: '', jp: ''},
    matter_unload_desc: {en_us: 'DEAL 20 DAMAGE.\nBLOCK 20 DAMAGE\nFOR THE NEXT\n5 SECONDS', fr: '', zh_cn: '', ru: '', es: '', jp: ''},

    time_strike_desc: {en_us: 'DEAL 6 DAMAGE,\nTHEN DEAL HALF\nTHAT DAMAGE\nA SECOND TIME', fr: '', zh_cn: '', ru: '', es: '', jp: ''},
    time_enhance_desc: {en_us: 'NEXT ATTACK\nIS CAST AN\nEXTRA TIME', fr: '', zh_cn: '', ru: '', es: '', jp: ''},
    time_protect_desc: {en_us: 'CREATE A SHIELD\nTHAT DELAYS UP TO\n50 DAMAGE', fr: '', zh_cn: '', ru: '', es: '', jp: ''},
    time_reinforce_desc: {en_us: 'HEAL HALF OF\nTHE DAMAGE YOU\nTOOK FROM THE\nLAST ATTACK', fr: '', zh_cn: '', ru: '', es: '', jp: ''},
    time_unload_desc: {en_us: 'FREEZE TIME FOR\nTHE NEXT 6 SPELLS\nBUT LOSES POWER\nWITH REPEAT USE', fr: '', zh_cn: '', ru: '', es: '', jp: ''},

    void_strike_desc: {en_us: 'DAMAGE 1.5% OF\nENEMY CURRENT\nHP. DEAL THAT\nDAMAGE 2 MORE\nTIMES AFTER A\nDELAY.', fr: '', zh_cn: '', ru: '', es: '', jp: ''},
    void_enhance_desc: {en_us: 'NEXT ATTACK\nCURSES THE ENEMY\nTO TAKE +1 DAMAGE\nFROM ALL SOURCES', fr: '', zh_cn: '', ru: '', es: '', jp: ''},
    void_protect_desc: {en_us: 'CREATE A SHIELD\nTHAT NEGATES\nONE ATTACK', fr: '', zh_cn: '', ru: '', es: '', jp: ''},
    void_reinforce_desc: {en_us: 'HEAL TO FULL, BUT\nAT THE COST OF\n20% MAX HP', fr: '', zh_cn: '', ru: '', es: '', jp: ''},
    void_unload_desc: {en_us: 'DAMAGE 12.5% OF\nENEMY CURRENT HP\nAND DISRUPT THEIR\nACTION', fr: '', zh_cn: '', ru: '', es: '', jp: ''},

    mind_strike_desc: {en_us: 'DEAL 1 DAMAGE.\nENEMY TAKES X2\nDAMAGE FROM\nNEXT ATTACK HIT', fr: '', zh_cn: '', ru: '', es: '', jp: ''},
    mind_enhance_desc: {en_us: 'NEXT ATTACK BURNS\nENEMY FOR 3 DMG/S\nFOR 4 SECONDS.\n(DOES NOT STACK)', fr: '', zh_cn: '', ru: '', es: '', jp: ''},
    mind_enhance_plus_desc: {en_us: 'NEXT ATTACK BURNS\nENEMY FOR 3 DMG/S\nFOR 5 SECONDS', fr: '', zh_cn: '', ru: '', es: '', jp: ''},
    mind_protect_desc: {en_us: 'CREATE A SHIELD\nTHAT REFLECTS\nHALF THE DAMAGE\nYOU TAKE', fr: '', zh_cn: '', ru: '', es: '', jp: ''},
    mind_reinforce_desc: {en_us: 'ATTACKS DEAL\n+2 DAMAGE', fr: '', zh_cn: '', ru: '', es: '', jp: ''},
    mind_unload_desc: {en_us: 'NEXT NON-ATTACK\nSPELL HAS +200%\nEFFECTIVENESS', fr: '', zh_cn: '', ru: '', es: '', jp: ''},


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
