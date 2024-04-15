let language = 'en_us';

const textData = {
    matter_strike_desc: {en_us: 'DEAL 12 DAMAGE', fr_FR: ''},
    matter_strike_plus_desc: {en_us: 'DEAL 14 DAMAGE', fr_FR: ''},
    matter_enhance_desc: {en_us: 'NEXT ATTACK\nDEALS +6\nEXTRA DAMAGE', fr_FR: ''},
    matter_protect_desc: {en_us: 'CREATES A SHIELD\nTHAT BLOCKS 14\nDAMAGE', fr_FR: ''},
    matter_reinforce_desc: {en_us: 'WHEN ATTACKED,\nREDUCE INCOMING\nDAMAGE BY 2 AND\nRETURN 3 DAMAGE', fr_FR: ''},
    matter_unload_desc: {en_us: 'DEAL 20 DAMAGE.\nBLOCK 20 DAMAGE\nFOR THE NEXT\n5 SECONDS', fr_FR: ''},

    time_strike_desc: {en_us: 'DEAL 6 DAMAGE, THEN\nDEAL HALF THAT DAMAGE\nA SECOND TIME', fr_FR: ''},
    time_enhance_desc: {en_us: 'NEXT ATTACK\nIS CAST AN\nEXTRA TIME', fr_FR: ''},
    time_protect_desc: {en_us: 'CREATES A SHIELD\nTHAT DELAYS UP TO\n50 DAMAGE', fr_FR: ''},
    time_reinforce_desc: {en_us: 'HEAL HALF OF\nTHE DAMAGE YOU\nTOOK FROM THE\nLAST ATTACK', fr_FR: ''},
    time_unload_desc: {en_us: 'FREEZE TIME FOR\nTHE NEXT 6 SPELLS\nBUT LOSES POWER\nWITH REPEAT USE', fr_FR: ''},

    void_strike_desc: {en_us: 'DEAL 1.5% OF ENEMY\nCURRENT HEALTH IN\nDAMAGE, THEN DEAL\nTHAT DAMAGE 2 MORE\nTIMES AFTER A DELAY', fr_FR: ''},
    void_enhance_desc: {en_us: 'NEXT ATTACK\nCURSES THE ENEMY\nTO TAKE +1 DAMAGE\nFROM ALL SOURCES', fr_FR: ''},
    void_protect_desc: {en_us: 'CREATES A SHIELD\nTHAT FULLY NEGATES\nONE ATTACK', fr_FR: ''},
    void_reinforce_desc: {en_us: 'HEAL TO FULL, BUT\nAT THE COST OF\n20% MAX HEALTH', fr_FR: ''},
    void_unload_desc: {en_us: 'DAMAGE 15% OF ENEMY\nCURRENT HEALTH AND\nDISRUPT THEIR CURRENT\nACTION BY 66%', fr_FR: ''},

    mind_strike_desc: {en_us: 'DEAL 1 DAMAGE.\nENEMY TAKES DOUBLE\nDAMAGE FROM NEXT\nATTACK HIT', fr_FR: ''},
    mind_enhance_desc: {en_us: 'NEXT ATTACK BURNS\nENEMY FOR 3 DMG/S\nFOR 4 SECONDS.\n(DOES NOT STACK)', fr_FR: ''},
    mind_enhance_plus_desc: {en_us: 'NEXT ATTACK BURNS\nENEMY FOR 3 DMG/S\nFOR 5 SECONDS', fr_FR: ''},
    mind_protect_desc: {en_us: 'REFLECT HALF THE\nDAMAGE YOU TAKE\nFROM ATTACKS BACK\nAT THE ENEMY', fr_FR: ''},
    mind_reinforce_desc: {en_us: 'ATTACKS DEAL +2\nDAMAGE. THIS BONUS\nGOES UP EACH TIME\nTHE WHEEL RELOADS.', fr_FR: ''},
    mind_unload_desc: {en_us: 'NEXT NON-ATTACK\nSPELL HAS +200%\nEFFECTIVENESS', fr_FR: ''},
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
