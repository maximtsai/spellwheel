let language = 'en_us';

const textData = {
    matter_strike_desc: {en_us: 'DEAL 12 DAMAGE.', fr_FR: ''},
    matter_enhance_desc: {en_us: 'CREATES A SHIELD\nTHAT BLOCKS 12\nDAMAGE.', fr_FR: ''},
    matter_protect_desc: {en_us: '', fr_FR: ''},
    matter_reinforce_desc: {en_us: '', fr_FR: ''},
    matter_unload_desc: {en_us: '', fr_FR: ''},

    time_protect_desc: {en_us: 'CREATES A SHIELD\nTHAT DELAYS ALL\nDAMAGE.', fr_FR: ''},
    time_enhance_desc: {en_us: '', fr_FR: ''},
    time_protect_desc: {en_us: '', fr_FR: ''},
    time_reinforce_desc: {en_us: '', fr_FR: ''},
    time_unload_desc: {en_us: '', fr_FR: ''},

    void_protect_desc: {en_us: 'CREATES A SHIELD\nTHAT FULLY NEGATES\nONE ATTACK.', fr_FR: ''},
    void_enhance_desc: {en_us: '', fr_FR: ''},
    void_protect_desc: {en_us: '', fr_FR: ''},
    void_reinforce_desc: {en_us: '', fr_FR: ''},
    void_unload_desc: {en_us: '', fr_FR: ''},

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
