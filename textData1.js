let language = 'en_us';

const textData = {
    matter_strike_desc: {en_us: 'DEAL 12 DAMAGE.', fr_FR: ''},
    matter_enhance_desc: {en_us: 'NEXT ATTACK\nDEALS +8\nEXTRA DAMAGE.', fr_FR: ''},
    matter_protect_desc: {en_us: 'CREATES A SHIELD\nTHAT BLOCKS 12\nDAMAGE.', fr_FR: ''},
    matter_reinforce_desc: {en_us: 'WHEN ATTACKED,\nREDUCE INCOMING\nDAMAGE BY 2 AND\nRETURN 4 DAMAGE.', fr_FR: ''},
    matter_unload_desc: {en_us: 'DEAL 20 DAMAGE.\nBLOCK 20 DAMAGE\nFOR THE NEXT\n5 SECONDS', fr_FR: ''},

    time_strike_desc: {en_us: 'DEAL 10 DAMAGE.\nCONVERT DAMAGE YOU\nDEAL OVER THE NEXT\n6 SECONDS INTO A\nSINGLE POWERFUL HIT.', fr_FR: ''},
    time_enhance_desc: {en_us: 'NEXT ATTACK\nIS CAST AN\nEXTRA TIME.', fr_FR: ''},
    time_protect_desc: {en_us: 'CREATES A SHIELD\nTHAT DELAYS ALL\nDAMAGE.', fr_FR: ''},
    time_reinforce_desc: {en_us: 'HEAL HALF OF\nTHE DAMAGE YOU\nTOOK FROM THE\nLAST ATTACK.', fr_FR: ''},
    time_unload_desc: {en_us: 'FREEZE TIME FOR\nTHE NEXT 6 SPELLS', fr_FR: ''},

    void_strike_desc: {en_us: 'DEAL 4% OF ENEMY\'s\nTOTAL HEALTH OVER\n4 SECONDS.', fr_FR: ''},
    void_enhance_desc: {en_us: 'CURSE THE ENEMY.\nNEXT ATTACK THEY\NMAKE WILL HURT THEM\NFOR 12% CURRENT HP.', fr_FR: ''},
    void_protect_desc: {en_us: 'CREATES A SHIELD\nTHAT FULLY NEGATES\nONE ATTACK.', fr_FR: ''},
    void_reinforce_desc: {en_us: 'BECOME INTANGIBLE\nFOR 7 SECONDS.\nLOSE 7 HEALTH.', fr_FR: ''},
    void_unload_desc: {en_us: 'DEAL DAMAGE EQUAL TO\n15% OF THE ENEMY\'s\nCURRENT HEALTH.', fr_FR: ''},

    mind_strike_desc: {en_us: 'DEAL 8 DAMAGE.\nENEMY TAKES 50%\nMORE DAMAGE FROM\nNEXT ATTACK.', fr_FR: ''},
    mind_enhance_desc: {en_us: 'NEXT ATTACK SETS\nENEMY ON FIRE\nDEALING 4 DAMAGE/S\nFOR 4 SECONDS.', fr_FR: ''},
    mind_protect_desc: {en_us: 'HALVE THE DAMAGE\nFROM ATTACKS AND INFLICT\nIT ONTO THE ENEMY\nX2', fr_FR: ''},
    mind_reinforce_desc: {en_us: 'ATTACKS DEAL +2\nDAMAGE.', fr_FR: ''},
    mind_unload_desc: {en_us: 'NEXT NON-ATTACK\nSPELL HAS X3\nEFFECTIVENESS.', fr_FR: ''},
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
