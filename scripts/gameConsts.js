const RUNE_TIME = 'rune_time';
const RUNE_MIND = 'rune_mind';
const RUNE_MATTER = 'rune_matter';
const RUNE_VOID = 'rune_void';
const RUNE_ENHANCE = 'rune_enhance';
const RUNE_PROTECT = 'rune_protect';
const RUNE_REINFORCE = 'rune_reinforce';
const RUNE_STRIKE = 'rune_strike';
const RUNE_UNLOAD = 'rune_unload';

let ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MIND, RUNE_TIME, RUNE_VOID, RUNE_MATTER, RUNE_MIND, RUNE_TIME];
ELEMENT_ARRAY = [RUNE_MATTER, RUNE_MIND, RUNE_MATTER, null, null, null , RUNE_MIND];
let EMBODIMENT_ARRAY = [RUNE_STRIKE, RUNE_STRIKE, RUNE_PROTECT, RUNE_ENHANCE, RUNE_UNLOAD, RUNE_STRIKE, RUNE_REINFORCE, RUNE_ENHANCE, RUNE_PROTECT, RUNE_STRIKE];
EMBODIMENT_ARRAY = [RUNE_STRIKE, RUNE_STRIKE, RUNE_ENHANCE, null, null, null, null, null, RUNE_ENHANCE, RUNE_STRIKE];
