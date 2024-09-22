let language = 'en_us';

let textData = {
    "translate_warn": {
        "en_us": " ",
        "fr": "(Remarque: Certaines traductions\npeuvent être inexactes)",
        "zh_tw": "(註：有些翻譯可能不準確)",
        "zh_cn": "(注：有些翻译可能不准确)",
        "ru": "",
        "es": "",
        "jp": ""
    },

    "matter_strike_desc": {
        "en_us": "Deal 12 damage",
        "fr": "Inflige 12 points de dégâts",
        "zh_tw": "造成12點傷害",
        "zh_cn": "造成 12 点伤害",
        "ru": "Наносит 12 ед. урона",
        "es": "Inflige 12 de daño",
        "jp": "12ダメージを与える"
    },
    "matter_strike_desc_long": {
        "en_us": "Deal 12 damage",
        "fr": "Inflige 12 points de dégâts",
        "zh_tw": "造成12點傷害",
        "zh_cn": "造成 12 点伤害",
        "ru": "Наносит 12 ед. урона",
        "es": "Inflige 12 de daño",
        "jp": "12ダメージを与える"
    },
    "matter_strike_plus_desc": {
        "en_us": "Deal 14 damage",
        "fr": "Inflige 14 points\nde dégâts",
        "zh_tw": "造成14點傷害",
        "zh_cn": "造成 14 点伤害",
        "ru": "Наносит 14 ед. урона",
        "es": "Inflige 14 de daño",
        "jp": "14ダメージを与える"
    },
    "matter_strike_plus_desc_long": {
        "en_us": "Deal 14 damage",
        "fr": "Inflige 14 points de dégâts",
        "zh_tw": "造成14點傷害",
        "zh_cn": "造成 14 点伤害",
        "ru": "Наносит 14 ед. урона",
        "es": "Inflige 14 de daño",
        "jp": "14ダメージを与える"
    },
    "matter_enhance_desc": {
        "en_us": "Your next\nattack gains\n+6 damage",
        "fr": "Votre prochaine\nattaque gagne\n+6 dégâts.",
        "zh_tw": "你的下一次攻擊\n獲得 +6 傷害",
        "zh_cn": "你的下一次攻击\n获得 +6 伤害",
        "ru": "Следующая\nатака дает\n+6 к урону",
        "es": "El siguiente\nataque obtiene\n+6 de daño",
        "jp": "次の通常攻撃は\n+6ダメージを獲得"
    },
    "matter_enhance_desc_long": {
        "en_us": "Your next attack gains +6 damage",
        "fr": "Votre prochaine attaque gagne +6 dégâts.",
        "zh_tw": "你的下一次攻擊獲得 +6 傷害",
        "zh_cn": "你的下一次攻击获得 +6 伤害",
        "ru": "Следующая атака дает +6 к урону",
        "es": "El siguiente ataque obtiene +6 de daño",
        "jp": "次の通常攻撃は+6ダメージを獲得"
    },
    "matter_protect_desc": {
        "en_us": "Create a shield\nthat blocks 12\ndamage",
        "fr": "Crée un bouclier\nqui bloque 12\npoints de dégâts",
        "zh_tw": "創建一個可以阻擋\n12 點傷害的盾牌",
        "zh_cn": "打造一个可以阻挡\n12 点伤害的盾牌",
        "ru": "Создает щит,\nблокирующий\n12 ед. урона.",
        "es": "Crea un escudo\nque bloquea\n12 de daño",
        "jp": "12ダメージをブロ\nックするシール\nドを作成する"
    },
    "matter_protect_desc_long": {
        "en_us": "Create a shield that blocks 12 damage",
        "fr": "Crée un bouclier qui bloque\n12 points de dégâts",
        "zh_tw": "創建一個可以阻擋 12 點傷害的盾牌",
        "zh_cn": "打造一个可以阻挡 12 点伤害的盾牌",
        "ru": "Создает щит, блокирующий\n12 ед. урона.",
        "es": "Crea un escudo que\nbloquea 12 de daño",
        "jp": "12ダメージをブロックす\nるシールドを作成する"
    },
    "matter_protect_plus_desc": {
        "en_us": "Create shield\nthat blocks 14\ndamage",
        "fr": "Crée un bouclier\nqui bloque 14\npoints de dégâts",
        "zh_tw": "創建一個可以阻擋\n14 點傷害的盾牌",
        "zh_cn": "打造一个可以阻挡\n14 点伤害的盾牌",
        "ru": "Создает щит,\nблокирующий\n14 ед. урона.",
        "es": "Crea un escudo\nque bloquea\n14 de daño",
        "jp": "14ダメージをブロ\nックするシール\nドを作成する"
    },
    "matter_protect_plus_desc_long": {
        "en_us": "Create shield that blocks 14 damage",
        "fr": "Crée un bouclier qui bloque\n14 points de dégâts",
        "zh_tw": "創建一個可以阻擋 14 點傷害的盾牌",
        "zh_cn": "打造一个可以阻挡 14 点伤害的盾牌",
        "ru": "Создает щит, блокирующий\n14 ед. урона.",
        "es": "Crea un escudo que\nbloquea 14 de daño",
        "jp": "14ダメージをブロックす\nるシールドを作成する"
    },
    "matter_reinforce_desc": {
        "en_us": "Gain thorns that\nreflect 1 damage\nwhen hit",
        "fr": "Gagne des épines\nqui renvoient 1\ndégât lorsque vous\nêtes touché",
        "zh_tw": "獲得荊棘來保護\n你並反射 1 點傷害",
        "zh_cn": "获得荆棘来保护\n你并反射 1 点伤害",
        "ru": "Получите шипы,\nкоторые защитят\nвас и отразят\n1 урон.",
        "es": "Gana espinas\npara protegerte\ny reflejar 1 daño.",
        "jp": "とげを獲得してあな\nたを守り、1ダメ\nージを反射します"
    },
    "matter_reinforce_desc_long": {
        "en_us": "Gain thorns that\nreflect 1 damage when hit",
        "fr": "Gagne des épines qui renvoient\n1 dégât lorsque vous êtes touché",
        "zh_tw": "獲得荊棘來保護\n你並反射 1 點傷害",
        "zh_cn": "获得荆棘来保护\n你并反射 1 点伤害",
        "ru": "Получите шипы, которые\nзащитят вас и отразят 1 урон.",
        "es": "Gana espinas para protegerte\ny reflejar 1 daño.",
        "jp": "とげを獲得してあなたを守り、1ダメージを反射します"
    },
    "matter_unload_desc": {
        "en_us": "Deal 24 damage\nand gain 24\ntemporary protection.",
        "fr": "Inflige 24 points\nde dégâts et confère\n24 points de\nprotection temporaire",
        "zh_tw": "造成 24 點傷害。\n獲得 24 點臨時保護。",
        "zh_cn": "造成 24 点伤害。\n获得 24 点临时保护。",
        "ru": "Наносит 24 ед.\nурона. Дает 24 ед.\nвременной защиты.",
        "es": "Inflige 24 de\ndaño. Obtén 24 de\nprotección temporal.",
        "jp": "24ダメージを\n与える。24個の一時\n的な保護を得る。"
    },
    "matter_unload_desc_long": {
        "en_us": "Deal 24 damage and gain\n24 temporary protection.",
        "fr": "Inflige 24 points de dégâts et confère\n24 points de protection temporaire",
        "zh_tw": "造成 24 點傷害。\n獲得 24 點臨時保護。",
        "zh_cn": "造成 24 点伤害。\n获得 24 点临时保护。",
        "ru": "Наносит 24 ед. урона.\nДает 24 ед. временной защиты.",
        "es": "Inflige 24 de daño.\nObtén 24 de protección temporal.",
        "jp": "24ダメージを与える。\n24個の一時的な保護を得る。"
    },
    "time_strike_desc": {
        "en_us": "Attack twice.\nFirst attack deals\n6 damage, second\nattack deals 50%\nof first.",
        "fr": "Attaque deux fois.\nLa première attaque\ninflige 6 dégâts,\nla seconde inflige\n50% des dégâts de\nla première.",
        "zh_tw": "攻擊兩次。第一次\n攻擊造成 6 點傷害，\n第二次攻擊造成第一次\n傷害的 50%。",
        "zh_cn": "攻击两次。第一次\n攻击造成 6 点伤害，\n第二次攻击造成第一次\n伤害的 50%。",
        "ru": "Атакуйте дважды.\nПервая атака\nнаносит 6 урона,\nвторая — 50% от\nпервой.",
        "es": "Ataca dos veces.\nEl primer ataque\ninflige 6 de daño,\nel segundo ataque\ninflige el 50%\ndel primero.",
        "jp": "2回攻撃する。最初の\n攻撃は6ダメージを与え、\n2回目の攻撃は最初の\n攻撃の50%を与えます。"
    },
    "time_strike_desc_long": {
        "en_us": "Attack twice. First attack deals 6 damage,\nsecond attack deals 50% of first.",
        "fr": "Attaque deux fois. La première attaque inflige 6 dégâts,\nla seconde inflige 50% des dégâts de la première.",
        "zh_tw": "攻擊兩次。第一次攻擊造成 6 點傷害，\n第二次攻擊造成第一次傷害的 50%。",
        "zh_cn": "攻击两次。第一次攻击造成 6 点伤害，\n第二次攻击造成第一次伤害的 50%。",
        "ru": "Атакуйте дважды. Первая атака\nнаносит 6 урона, вторая — 50% от первой.",
        "es": "Ataca dos veces. El primer ataque inflige 6 de\ndaño, el segundo ataque inflige el 50% del primero.",
        "jp": "2回攻撃する。最初の攻撃は6ダメージを与え、\n2回目の攻撃は最初の攻撃の50%を与えます。"
    },
    "time_enhance_desc": {
        "en_us": "Your next attack\nis fired an\nadditional time",
        "fr": "Votre prochaine\nattaque est lancée\nune fois de plus.",
        "zh_tw": "你的下一次攻擊\n將額外發射一次",
        "zh_cn": "你的下一次攻击\n将多发射一次",
        "ru": "Ваша следующая\nатака произойдет\nеще один раз",
        "es": "Tu próximo\nataque se dispara\nuna vez más",
        "jp": "次の攻撃は追加\nで発射されます"
    },
    "time_enhance_desc_long": {
        "en_us": "Your next attack is fired\nan additional time",
        "fr": "Votre prochaine attaque est\nlancée une fois de plus.",
        "zh_tw": "你的下一次攻擊將額外發射一次",
        "zh_cn": "你的下一次攻击将多发射一次",
        "ru": "Ваша следующая атака\nпроизойдет еще один раз",
        "es": "Tu próximo ataque se\ndispara una vez más",
        "jp": "次の攻撃は追加で発射されます"
    },
    "time_protect_desc": {
        "en_us": "Create a shield\nthat delays up\nto 60 damage",
        "fr": "Crée un bouclier\nqui retarde jusqu’à\n60 points de dégâts",
        "zh_tw": "打造一個能延遲\n多達 60 點傷害的盾牌",
        "zh_cn": "打造一个能延迟\n多达 60 点伤害的盾牌",
        "ru": "Создает щит,\nкоторый задерживает\nдо 60 ед. урона",
        "es": "Crea un escudo\nque retrasa hasta\n60 de daño",
        "jp": "最大60ダメージ\nを遅らせるシール\nドを作成"
    },
    "time_protect_desc_long": {
        "en_us": "Create a shield that\ndelays up to 60 damage",
        "fr": "Crée un bouclier qui retarde\njusqu’à 60 points de dégâts",
        "zh_tw": "打造一個能延遲多達 60 點傷害的盾牌",
        "zh_cn": "打造一个能延迟多达 60 点伤害的盾牌",
        "ru": "Создает щит, который\nзадерживает до 60 ед. урона",
        "es": "Crea un escudo que\nretrasa hasta 60 de daño",
        "jp": "最大60ダメージを遅らせるシールドを作成"
    },
    "time_reinforce_desc": {
        "en_us": "Heal 50% of your\nlast injury and\n50% of your\ndelayed damage",
        "fr": "Soigne 50 % de votre\ndernière blessure\net 50 % de vos\ndégâts retardés.",
        "zh_tw": "治療50%的末次傷害\n和50%的延遲傷害",
        "zh_cn": "治疗50%的末次伤害\n和50%的延迟伤害",
        "ru": "Восстанавливает\n50% от последней\nтравмы и 50% от\nотсроченного урона",
        "es": "Cura el 50% de\ntu última lesión y\nel 50% de tu\ndaño retrasado",
        "jp": "直近の負傷の50%と遅延\nダメージの50%を回復"
    },
    "time_reinforce_desc_long": {
        "en_us": "Heal 50% of your last injury\nand 50% of your delayed damage",
        "fr": "Soigne 50 % de votre dernière blessure\net 50 % de vos dégâts retardés.",
        "zh_tw": "治療50%的末次傷害\n和50%的延遲傷害",
        "zh_cn": "治疗50%的末次伤害\n和50%的延迟伤害",
        "ru": "Восстанавливает 50% от последней травмы\nи 50% от отсроченного урона",
        "es": "Cura el 50% de tu última lesión\ny el 50% de tu daño retrasado",
        "jp": "直近の負傷の50%と\n遅延ダメージの50%を回復"
    },
    "time_unload_desc": {
        "en_us": "Freeze time for\nyour next ",
        "fr": "Gèle le temps pour\nvos ",
        "zh_tw": "為接下來 ",
        "zh_cn": "为接下来 ",
        "ru": "Заморозьте времяна\nследующие ",
        "es": "Congela el tiempo\ndurante los\nsiguientes ",
        "jp": "次の"
    },
    "time_unload_desc_2": {
        "en_us": " spells.\nGets weaker\nwith repeat use.",
        "fr": " prochains\nsorts. Cet effet\ns'affaiblit avec\nl'utilisation répétée.",
        "zh_tw": " 個法術\n凍結時間。重複使用\n會變弱。",
        "zh_cn": " 个法术\n冻结时间。重复使用\n会变弱。",
        "ru": "\nзаклинаний. Слабеет\nпри повторном\nиспользовании.",
        "es": " hechizos.\nSe debilita con\nel uso repetido.",
        "jp": "つの呪文の凍結\n時間。繰り返し使用\nすると弱くなります。"
    },
    "time_unload_desc_long": {
        "en_us": "Freeze time for your next ",
        "fr": "Gèle le temps pour vos ",
        "zh_tw": "為接下來 ",
        "zh_cn": "为接下来 ",
        "ru": "Заморозьте времяна следующие ",
        "es": "Congela el tiempo durante los siguientes\n",
        "jp": "次の"
    },
    "time_unload_desc_2_long": {
        "en_us": " spells.\nGets weaker with repeat use.",
        "fr": " prochains sorts.\nCet effet s'affaiblit avec l'utilisation répétée.",
        "zh_tw": " 個法術\n凍結時間。重複使用會變弱。",
        "zh_cn": " 个法术\n冻结时间。重复使用会变弱。",
        "ru": " заклинаний.\nСлабеет при повторном использовании.",
        "es": " hechizos. Se debilita con el uso repetido.",
        "jp": "つの呪文の凍結時間。\n繰り返し使用すると弱くなります。"
    },
    "time_unload_desc_long_full": {
        "en_us": "Freeze time for your next 7 spells.\nGets weaker with repeat use.",
        "fr": "Gèle le temps pour vos 7 prochains sorts.\nCet effet s'affaiblit avec l'utilisation répétée.",
        "zh_tw": "為接下來 7 個法術\n凍結時間。重複使用會變弱。",
        "zh_cn": "为接下来 7 个法术\n冻结时间。重复使用会变弱。",
        "ru": "Заморозьте времяна следующие 7 заклинаний.\nСлабеет при повторном использовании.",
        "es": "Congela el tiempo durante los siguientes 7 hechizos. Se debilita con el uso repetido.",
        "jp": "次の7つの呪文の凍結時間。\n繰り返し使用すると弱くなります。"
    },
    "void_strike_desc": {
        "en_us": "Attack 3 times\nafter a delay,\neach attack\ndeals 2% enemy\ncurrent HP",
        "fr": "Attaque 3 fois après\nun délai, chaque\nattaque infligeant 2%\ndes PV actuels\nde l’ennemi.",
        "zh_tw": "延遲後攻擊 3 次，\n每次攻擊造成 2%\n敵人當前生命值",
        "zh_cn": "延迟后再攻击 3 次，\n每次攻伤害 2%\n敌人当前生命值",
        "ru": "Атакует 3 раза после\nзадержки, каждая\nатака наносит 2%\nот текущего\nздоровья противника",
        "es": "Ataca 3 veces después\nde un retraso, cada\nataque inflige un\n2% de los PS\nactuales del enemigo",
        "jp": "遅延後に3回攻撃し、\n各攻撃で敵の現在のHP\nの2%にダメージを与える"
    },
    "void_strike_desc_long": {
        "en_us": "Attack 3 times after a delay,\neach attack deals 2% enemy current HP",
        "fr": "Attaque 3 fois après un délai, chaque\nattaque infligeant 2% des PV actuels de l’ennemi.",
        "zh_tw": "延遲後攻擊 3 次，每次攻擊\n造成 2%敵人當前生命值",
        "zh_cn": "延迟后攻击 3 次，每次攻击\n造成 2%敌人当前生命值",
        "ru": "Атакует 3 раза после задержки, каждая атака\nнаносит 2% от текущего здоровья противника",
        "es": "Ataca 3 veces después de un retraso, cada ataque\ninflige un 2% de los PS actuales del enemigo",
        "jp": "遅延後に3回攻撃し、各攻撃で敵の\n現在のHPの2%にダメージを与える"
    },
    "void_enhance_desc": {
        "en_us": "Your attacks\npermanently gain\n+1 damage",
        "fr": "Vos attaques\ngagnent définitivement\n+1 dégâts.",
        "zh_tw": "你的攻擊永久獲得\n+1 傷害",
        "zh_cn": "你的攻击永久获得\n+1 伤害",
        "ru": "Ваша атака\nпостоянно\nусиливает +1 урон",
        "es": "Tu ataque gana\npermanentemente\n+1 daño",
        "jp": "あなたの攻撃力は\n永続的に増加します\n+1ダメージ"
    },
    "void_enhance_desc_long": {
        "en_us": "Your attacks permanently gain +1 damage",
        "fr": "Vos attaques gagnent définitivement +1 dégâts.",
        "zh_tw": "你的攻擊永久獲得 +1 傷害",
        "zh_cn": "你的攻击永久获得 +1 伤害",
        "ru": "Ваша атака постоянно усиливает +1 урон",
        "es": "Tu ataque gana permanentemente +1 daño",
        "jp": "あなたの攻撃力は永続的に増加します+1ダメージ"
    },
    "void_protect_desc": {
        "en_us": "Create a shield\nthat completely\nnegates one attack",
        "fr": "Crée un bouclier\nqui annule\ncomplètement\nune attaque",
        "zh_tw": "創建一個完全抵消\n一次攻擊的盾牌",
        "zh_cn": "打造一个完全抵消\n一次攻击的盾牌",
        "ru": "Создайте щит,\nкоторый полностью\nнейтрализует\nодну атаку",
        "es": "Crea un escudo\nque anula por\ncompleto un ataque",
        "jp": "1回の攻撃を完全\nに無効にするシ\nールドを作る"
    },
    "void_protect_desc_long": {
        "en_us": "Create a shield that\ncompletely negates one attack",
        "fr": "Crée un bouclier qui annule\ncomplètement une attaque",
        "zh_tw": "創建一個完全抵消一次攻擊的盾牌",
        "zh_cn": "打造一个完全抵消一次攻击的盾牌",
        "ru": "Создайте щит, который полностью\nнейтрализует одну атаку",
        "es": "Crea un escudo que anula\npor completo un ataque",
        "jp": "1回の攻撃を完全に無効に\nするシールドを作る"
    },
    "void_reinforce_desc": {
        "en_us": "Heal to full,\nbut lose 10\nmax hp",
        "fr": "Soigne complètement,\nmais réduit vos\nPV maximum de 10",
        "zh_tw": "完全治癒自己，但失去\n10 點總生命值",
        "zh_cn": "完全治愈自己，但失去\n10 点总生命值",
        "ru": "исцеляется\nполностью, но\nтеряет 10 макс\nхп",
        "es": "Se cura por\ncompleto, pero\npierde 10 puntos\nde salud máximos.",
        "jp": "完全に回復するが、\n最大HPの10を失う"
    },
    "void_reinforce_desc_long": {
        "en_us": "Heal to full, but lose 10 max hp",
        "fr": "Soigne complètement, mais\nréduit vos PV maximum de 10",
        "zh_tw": "完全治癒自己，但失去 10 點总生命值",
        "zh_cn": "完全治愈自己，但失去 10 点总生命值",
        "ru": "исцеляется полностью,\nно теряет 10 макс хп",
        "es": "Se cura por completo, pero\npierde 10 puntos de salud máximos.",
        "jp": "完全に回復するが、最大HPの10を失う"
    },
    "void_unload_desc": {
        "en_us": "Deal damage equal\nto 9% of enemy's\ncurrent HP and\ndisrupt their action",
        "fr": "Inflige des dégâts\négaux à 9% des PV\nactuels de l'ennemi\net perturbe son action.",
        "zh_tw": "傷害敵人當前生命\n值 9% 並打断他們\n的行動",
        "zh_cn": "伤害敌人当前生命\n值 9% 并打断他们\n的行动",
        "ru": "Наносит урон 9%\nот текущего здоровья\nпротивника и мешает\nего действиям",
        "es": "Inflige daño al\n9% de los PS\nactuales del enemigo\ne interrumpe su acción",
        "jp": "敵の現在HPの9%にダ\nメージを与え、敵の\n行動を妨害する"
    },
    "void_unload_desc_long": {
        "en_us": "Deal damage equal to 9% of enemy's\ncurrent HP and disrupt their action",
        "fr": "Inflige des dégâts égaux à 9% des PV\nactuels de l'ennemi et perturbe son action.",
        "zh_tw": "傷害敵人當前生命值 9% 並打断他們的行動",
        "zh_cn": "伤害敌人当前生命值 9% 并打断他们的行动",
        "ru": "Наносит урон 9% от текущего здоровья\nпротивника и мешает его действиям",
        "es": "Inflige daño al 9% de los PS actuales\ndel enemigo e interrumpe su acción",
        "jp": "敵の現在HPの9%にダメージを\n与え、敵の行動を妨害する"
    },
    "mind_strike_desc": {
        "en_us": "Deal 1 True\ndamage. Enemy\ntakes x2 damage\nfrom your next\nattack.",
        "fr": "Inflige 1 dégât\nvéritable. L'ennemi\nsubit le double de\ndégâts lors de votre\nprochaine attaque.",
        "zh_tw": "造成 1 點真實傷害。\n敵人將在你下一次\n攻擊中受到 2 倍傷害。",
        "zh_cn": "造成 1 点真实伤害。\n敌人从你下一次\n攻击中受到 2 倍伤害。",
        "ru": "Наносит 1 чистый\nурон. Враг получает\nх2 урона от вашей\nследующей атаки.",
        "es": "Inflige 1 daño\nverdadero. El\nenemigo recibe x2\nde daño de tu\npróximo ataque",
        "jp": "1の真のダメージを\n与える。敵は次の\n攻撃で2倍のダメー\nジを受ける"
    },
    "mind_strike_desc_long": {
        "en_us": "Deal 1 True damage. Enemy takes\nx2 damage from your next attack.",
        "fr": "Inflige 1 dégât véritable. L'ennemi subit le\ndouble de dégâts lors de votre prochaine attaque.",
        "zh_tw": "造成 1 點真實傷害。\n你下一次攻擊造成 2 倍傷害。",
        "zh_cn": "造成 1 点真实伤害。\n你下一次攻击造成 2 倍伤害。",
        "ru": "Наносит 1 чистый урон. Враг получает х2 урона от вашей следующей атаки.",
        "es": "Inflige 1 daño verdadero. El enemigo\nrecibe x2 de daño de tu próximo ataque",
        "jp": "1の真のダメージを与える。敵は次の\n攻撃で2倍のダメージを受ける"
    },
    "mind_enhance_desc": {
        "en_us": "Your next attack\nburns enemy for 2\nTrue damage/sec\nfor 5 seconds",
        "fr": "Votre prochaine attaque\nbrûle l'ennemi pour 2\ndégâts véritables/seconde\npendant 5 secondes.",
        "zh_tw": "你的下一次攻擊對敵人\n造成每秒 2 點真實\n傷害，持續 5 秒",
        "zh_cn": "你的下一次攻击对敌人\n造成每秒 2 点真实\n伤害，持续 5 秒",
        "ru": "Следующая атака\nсжигает противника,\nнанося 10 ед.\nчистого урона в\nтечение 5 сек.",
        "es": "El siguiente ataque\nquema al enemigo\ne inflige 10 de\ndaño verdadero\ndurante 5 segundos",
        "jp": "次の通常攻撃で敵を\n5秒間10確定ダメー\nジで燃やす"
    },
    "mind_enhance_desc_long": {
        "en_us": "Your next attack burns enemy for\n2 True damage/sec for 5 seconds",
        "fr": "Votre prochaine attaque brûle l'ennemi pour\n2 dégâts véritables par seconde pendant 5 secondes.",
        "zh_tw": "你的下一次攻擊在5秒內\n燃燒敵人10點真實傷害",
        "zh_cn": "你的下一次攻击在5秒内\n燃烧敌人10点真实伤害",
        "ru": "Следующая атака сжигает противника,\nнанося 10 ед. чистого урона в течение 5 сек.",
        "es": "El siguiente ataque quema al enemigo e inflige\n10 de daño verdadero durante 5 segundos",
        "jp": "次の通常攻撃で敵を5秒間10確定ダメージで燃やす"
    },
    "mind_enhance_plus_desc": {
        "en_us": "Your next attack burns\nenemy for 3\nTrue damage/sec\nfor 5 seconds",
        "fr": "Votre prochaine attaque\nbrûle l'ennemi pour 3\ndégâts véritables/seconde\npendant 5 secondes.",
        "zh_tw": "你的下一次攻擊在5秒\n內燃燒敵人15點\n真實傷害",
        "zh_cn": "你的下一次攻击在5秒\n内燃烧敌人15点\n真实伤害",
        "ru": "Следующая атака\nсжигает противника,\nнанося 15 ед.\nчистого урона в\nтечение 5 сек.",
        "es": "El siguiente ataque\nquema al enemigo\ne inflige 15 de\ndaño verdadero\ndurante 5 segundos",
        "jp": "次の通常攻撃で敵を\n5秒間15確定ダメー\nジで燃やす"
    },
    "mind_enhance_plus_desc_long": {
        "en_us": "Your next attack burns enemy for\n3 True damage/sec for 5 seconds",
        "fr": "Votre prochaine attaque brûle l'ennemi pour\n2 dégâts véritables/seconde pendant 5 secondes.",
        "zh_tw": "你的下一次攻擊在5秒內\n燃燒敵人15點真實傷害",
        "zh_cn": "你的下一次攻击在5秒内\n燃烧敌人15点真实伤害",
        "ru": "Следующая атака сжигает противника,\nнанося 15 ед. чистого урона в течение 5 сек.",
        "es": "El siguiente ataque quema al enemigo e inflige\n15 de daño verdadero durante 5 segundos",
        "jp": "次の通常攻撃で敵を5秒間15確定ダメージで燃やす"
    },
    "mind_protect_desc": {
        "en_us": "Create a shield\nthat absorbs 50%\nof incoming damage\nand reflects it\nback",
        "fr": "Crée un bouclier\nqui absorbe 50%\ndes dégâts puis\nles renvoie",
        "zh_tw": "打造一个吸收 50%\n伤害并将其反射回去\n的盾牌",
        "zh_cn": "打造一个吸收 50%\n伤害并将其反射回去\n的盾牌",
        "ru": "Создает щит, \nкоторый поглощает\n50 % урона, а\nзатем отбрасывает\nего назад.",
        "es": "Crea un escudo\nque absorbe el 50%\ndel daño entrante\ny luego lo refleja.",
        "jp": "受けるダメージの\n50%を吸収し、反射する\nシールドを作成する"
    },
    "mind_protect_desc_long": {
        "en_us": "Create a shield that absorbs 50%\nof incoming damage and reflects it back",
        "fr": "Crée un bouclier qui absorbe 50% des\ndégâts entrants et les renvoie à l'attaquant.",
        "zh_tw": "打造一个吸收 50% 伤害\n并将其反射回去的盾牌",
        "zh_cn": "打造一个吸收 50% 伤害\n并将其反射回去的盾牌",
        "ru": "Создает щит, который поглощает 50%\nурона, а затем отбрасывает его назад.",
        "es": "Crea un escudo que absorbe el 50%\ndel daño entrante y luego lo refleja.",
        "jp": "受けるダメージの50%を吸収し、\n反射するシールドを作成する"
    },
    "mind_reinforce_desc": {
        "en_us": "All damage you\ndeal is increased\nby +2",
        "fr": "Tous les dégâts\nque vous infligez\nsont augmentés de +2",
        "zh_tw": "你造成的所有傷害\n增加 +2",
        "zh_cn": "你造成的所有伤害\n增加 +2",
        "ru": "Весь наносимый\nвами урон\nувеличивается\nна +2.",
        "es": "Todo el daño\nque infliges\naumenta en +2",
        "jp": "与えるダメージ\nはすべて +2\n増加します"
    },
    "mind_reinforce_desc_long": {
        "en_us": "All damage you deal is increased by +2",
        "fr": "Tous les dégâts que vous\ninfligez sont augmentés de +2",
        "zh_tw": "你造成的所有傷害增加 +2",
        "zh_cn": "你造成的所有伤害增加 +2",
        "ru": "Весь наносимый вами урон увеличивается на +2.",
        "es": "Todo el daño que infliges aumenta en +2",
        "jp": "与えるダメージは\nすべて +2増加します"
    },
    "mind_unload_desc": {
        "en_us": "Your next non-attack\nspell has +200%\neffectiveness",
        "fr": "Votre prochain sort\nnon-offensif a\n+200% d'efficacité.",
        "zh_tw": "下一個非攻擊法術\n有+200%的有效性",
        "zh_cn": "下一个非攻击法术\n有+200%的有效性",
        "ru": "Следующее неатакующее\nзаклинание имеет\n+200% к эффективности",
        "es": "El siguiente\nhechizo que no\nsea de ataque tiene\n+200% de efectividad",
        "jp": "次の非攻撃呪文の\n有効性は+200%です"
    },
    "mind_unload_desc_long": {
        "en_us": "Your next non-attack spell\nhas +200% effectiveness",
        "fr": "Votre prochain sort non-offensif\na +200% d'efficacité.",
        "zh_tw": "下一個非攻擊法術有+200%的有效性",
        "zh_cn": "下一个非攻击法术有+200%的有效性",
        "ru": "Следующее неатакующее заклинание\nимеет +200% к эффективности",
        "es": "El siguiente hechizo que no sea\nde ataque tiene +200% de efectividad",
        "jp": "次の非攻撃呪文の有効性は+200%です"
    },
    "matter_tut_desc": {
        "en_us": "The Matter rune grants\ncontrol over the physical.\nMatter spells are good at dealing direct damage\nand providing reliable protection.",
        "fr": "La rune Matière accorde le contrôle sur le physique. Les sorts de matière sont bons pour infliger des dégâts directs et fournir une protection fiable.",
        "zh_tw": "物質符文授予對物理的控制權。物質法術擅長造成直接傷害並提供可靠的保護。",
        "zh_cn": "物质符文授予对物理的控制权。物质法术擅长造成直接伤害并提供可靠的保护。",
        "ru": "Руна Материи дает контроль над физическим. Заклинания материи хорошо наносят прямой урон и обеспечивают надежную защиту.",
        "es": "La runa de materia otorga control sobre lo físico. Los hechizos de materia son buenos para infligir daño directo y proporcionar una protección fiable.",
        "jp": "物質のルーンは、物理的なものに対するコントロールを与えます。物質呪文は、直接的なダメージを与え、確実な防御力を発揮するのが得意です。"
    },
    "matter_plus_tut_desc": {
        "en_us": "Your mastery over the\nMatter element strengthens\nsome of your existing Matter spells.",
        "fr": "Votre maîtrise de l’élément Matière renforce certains de vos sorts de Matière existants.",
        "zh_tw": "你對物質元素的掌握加強了你現有的一些物質法術。",
        "zh_cn": "你对物质元素的掌握加强了你现有的一些物质法术。",
        "ru": "Ваше мастерство над элементом Материи усиливает некоторые из ваших существующих заклинаний Материи.",
        "es": "Tu maestría sobre el elemento Materia fortalece algunos de tus hechizos de Materia existentes.",
        "jp": "物質元素をマスターすると、既存の物質呪文の一部が強化されます。"
    },
    "matter_tut_strike_desc": {
        "en_us": "Conjure a ball of rock\nthat deals solid damage.\nSimple but effective.",
        "fr": "Invoque une boule de roche qui inflige des dégâts solides. Simple mais efficace.",
        "zh_tw": "召喚出一個造成固體傷害的岩石球。簡單但有效。",
        "zh_cn": "召唤出一个造成固体伤害的岩石球。简单但有效。",
        "ru": "Наколдуйте каменный шар, который наносит солидный урон. Просто, но эффективно.",
        "es": "Conjura una bola de roca que inflige daño sólido. Simple pero efectivo.",
        "jp": "固体ダメージを与える岩の球を召喚する。シンプルだけど効果的。"
    },
    "matter_tut_enhance_desc": {
        "en_us": "Makes your next attack\ndeal extra damage.\nAlso makes the attack a\nlittle bit bigger.",
        "fr": "Fait en sorte que votre prochaine attaque inflige des dégâts supplémentaires. Rend également l’attaque un peu plus grande.",
        "zh_tw": "使你的下一次攻擊造成額外的傷害。也使攻擊更大一點。",
        "zh_cn": "使你的下一次攻击造成额外的伤害。也使攻击更大一点。",
        "ru": "Ваша следующая атака наносит дополнительный урон. Также делает атаку немного больше.",
        "es": "Hace que tu próximo ataque inflija daño extra. También hace que el ataque sea un poco más grande.",
        "jp": "次の通常攻撃が追加ダメージを与えるようになる。また、攻撃を少し大きくします。"
    },
    "matter_tut_protect_desc": {
        "en_us": "Creates a shield that blocks\na flat amount of damage.",
        "fr": "Crée un bouclier qui bloque une quantité fixe de dégâts.",
        "zh_tw": "創建一個盾牌，阻擋一定量的傷害。",
        "zh_cn": "打造一个盾牌，阻挡一定量的伤害。",
        "ru": "Создает щит, который блокирует фиксированное количество урона.",
        "es": "Crea un escudo que bloquea una cantidad fija de daño.",
        "jp": "一定量のダメージをブロックするシールドを作成します。"
    },
    "matter_tut_reinforce_desc": {
        "en_us": "Protect yourself with spiky skin.\nGreat against large quantities of\nweaker attacks.",
        "fr": "Protégez-vous avec une peau hérissée.\n Idéal contre de grandes quantités\nd’attaques plus faibles.",
        "zh_tw": "用帶刺的皮膚保護自己。有效抵禦大量較弱的攻擊。",
        "zh_cn": "用带刺的皮肤保护自己。有效抵御大量较弱的攻击。",
        "ru": "Защитный бафф, защищающий вас с помощью колючей кожи. Отлично справляется с большим количеством слабых атак.",
        "es": "Buff defensivo que te protege con piel puntiaguda. Excelente contra grandes cantidades de ataques más débiles.",
        "jp": "とがった肌で身を守る防御バフ。大量の弱い攻撃に対して最適です。"
    },
    "matter_tut_unload_desc": {
        "en_us": "Conjures a great deal of matter\nto deal heavy damage while keeping\nyourself protected.",
        "fr": "Invoque une grande quantité de\nmatière pour infliger de lourds dégâts\ntout en vous protégeant.",
        "zh_tw": "召喚大量物質來造成重大傷害，\n同時保護自己。",
        "zh_cn": "召唤大量物质来造成重大伤害，\n同时保护自己。",
        "ru": "Создает множество материи, чтобы одновременно сокрушить врагов и защитить себя.",
        "es": "Conjura una gran cantidad de materia para aplastar simultáneamente a tus enemigos mientras te mantienes protegido.",
        "jp": "敵を粉砕すると同時に、自分自身を守るために、多くの物質を召喚します。"
    },
    "mind_tut_desc": {
        "en_us": "The Energy rune controls raw\nenergy. Energy spells have\npowerful utility effects and deal\nTrue damage that bypasses enemy defenses.",
        "fr": "La rune Énergie permet de\ncontrôler l'énergie brute, avec des\nsorts qui offrent un soutien puissant\net infligent des dégâts bruts contournant\nles défenses ennemies.",
        "zh_tw": "能量符文授予對原始能量的\n控制權。能量法術具有強大\n的支援效果，可以造成繞過\n敵人防禦的真實傷害。",
        "zh_cn": "能量符文授予对原始能量的\n控制权。能量法术具有强大\n的支持效果，可以造成绕过\n敌人防御的真实伤害。",
        "ru": "Руна Энергия дает контроль над сырой энергией. Энергетические заклинания обладают мощными вспомогательными эффектами и могут наносить чистый урон, обойдя вражескую оборону.",
        "es": "La runa de energía otorga control sobre la energía bruta. Los hechizos de energía tienen poderosos efectos de apoyo y pueden infligir daño verdadero que supera las defensas enemigas.",
        "jp": "エネルギーのルーンは、生のエネルギーをコントロールすることを可能にします。エネルギー呪文は強力なサポート効果を持ち、敵の防御を迂回するトゥルーダメージを与えることができます。"
    },
    "mind_plus_tut_desc": {
        "en_us": "Your mastery over the element\nstrengthens some of your\nexisting Energy spells.",
        "fr": "Votre maîtrise de l’élément\nrenforce certains de vos sorts\nd’énergie existants.",
        "zh_tw": "你對元素的掌握加強了你現有的\n一些能量法術。",
        "zh_cn": "你对元素的掌握加强了你现有的\n一些能量法术。",
        "ru": "Ваше мастерство над стихией усиливает некоторые из ваших существующих энергетических заклинаний.",
        "es": "Tu dominio sobre el elemento fortalece algunos de tus hechizos de Energía existentes.",
        "jp": "元素をマスターすると、既存のエネルギー呪文の一部が強化されます。"
    },
    "mind_tut_strike_desc": {
        "en_us": "Fires a bolt of energy that\ndeals little damage by itself,\nbut amplifies your next\nattack for double (x2) damage.",
        "fr": "Tire un éclair d’énergie qui\binflige peu de dégâts en soi,\bmais amplifie votre prochaine\battaque pour doubler (x2) de\bdégâts.",
        "zh_tw": "發射一道能量彈，本身造成的傷害很小，\n但會放大你的下一次攻擊，造成雙倍\n（x2）傷害。",
        "zh_cn": "发射一道能量弹，本身造成的伤害很小，\n但会放大你的下一次攻击，造成双倍\n（x2）伤害。",
        "ru": "Выпускает заряд энергии, который сам по себе наносит небольшой урон, но усиливает вашу следующую атаку, нанося двойной (x2) урон.",
        "es": "Dispara un rayo de energía que inflige poco daño por sí solo, pero amplifica tu próximo ataque para infligir el doble (x2) de daño.",
        "jp": "それ自体はほとんどダメージを与えないエネルギーの稲妻を発射しますが、次の攻撃を増幅して2倍(x2)のダメージを与えます。"
    },
    "mind_tut_enhance_desc": {
        "en_us": "Your next attack sets the\nenemy on fire, which deals\nTrue damage over time that\nignores defenses.",
        "fr": "Votre prochaine attaque met\nle feu à l’ennemi, ce qui\nlui inflige des dégâts bruts\nsur la durée qui ignorent les\ndéfenses.",
        "zh_tw": "你的下一次攻擊會讓敵人\n著火，隨著時間的推移會造成\n真正的傷害，而忽略了防禦。",
        "zh_cn": "你的下一次攻击会让敌人\n着火，随着时间的推移会造成\n真正的伤害，而忽略了防御。",
        "ru": "Ваша следующая атака поджигает врага, который наносит периодический чистый урон, игнорируя защиту.",
        "es": "Tu próximo ataque prende fuego al enemigo, lo que inflige daño verdadero con el tiempo que ignora las defensas.",
        "jp": "次の通常攻撃で敵に火をつけ、防御を無視して継続ダメージを与える。"
    },
    "mind_tut_protect_desc": {
        "en_us": "Creates a shield that blocks\nhalf of all damage, while\nstoring up and retaliating with\nthe damage you do take.",
        "fr": "Crée un bouclier qui bloque la\nmoitié de tous les dégâts,\ntout en accumulant et en ripostant\navec les dégâts que vous subissez.",
        "zh_tw": "創建一個盾牌，可以阻擋所有\n傷害的一半，同時儲存並利用你所\n受到的傷害進行報復。",
        "zh_cn": "打造一个盾牌，可以阻挡所有\n伤害的一半，同时储存并利用你所\n受到的伤害进行报复。",
        "ru": "Создает щит, который блокирует половину всего урона, накапливая и нанося ответный урон.",
        "es": "Crea un escudo que bloquea la mitad de todo el daño, mientras acumula y toma represalias con el daño que recibes.",
        "jp": "ダメージの半分をブロックし、受けたダメージを溜め込んで報復するシールドを作成します。"
    },
    "mind_tut_reinforce_desc": {
        "en_us": "Energize yourself to increase all damage you deal.",
        "fr": "Dynamisez-vous pour augmenter tous\nles dégâts que vous infligez.",
        "zh_tw": "增加你造成的所有傷害。",
        "zh_cn": "增加你造成的所有伤害。",
        "ru": "",
        "es": "",
        "jp": ""
    },
    "mind_tut_unload_desc": {
        "en_us": "Multiplies the effectiveness\nof your next non-attack spell.\nThose clever enough to cast\nthis spell twice in a row\ncan attain breathtaking\nspell-amplifying power.",
        "fr": "Multiplie l'efficacité de votre\nprochain sort non offensif.\nLancer ce sort deux fois de suite\npeut donner un incroyable\npouvoir d'amplification des sorts.",
        "zh_tw": "使你的下一個非攻擊法術的效果\n成倍增加。\n連續施放此法術兩次可以獲得驚人\n的法術增強力量。",
        "zh_cn": "使你的下一个非攻击法术的效果\n成倍增加。\n连续施放此法术两次可以获得惊人\n的法术增强力量。",
        "ru": "Умножает эффективность вашего следующего заклинания, не связанного с атакой. Те, кто достаточно умен, чтобы произнести это заклинание два раза подряд, могут достичь захватывающей дух силы, усиливающей заклинания.",
        "es": "Multiplica la efectividad de tu próximo hechizo que no sea de ataque. Aquellos lo suficientemente inteligentes como para lanzar este hechizo dos veces seguidas pueden alcanzar un impresionante poder amplificador de hechizos.",
        "jp": "次の非攻撃呪文の効果を倍増させる。この呪文を2回連続で唱える賢い人は、息を呑むような呪文増幅力を得ることができます。"
    },
    "time_tut_desc": {
        "en_us": "The Time rune grants \ncontrol over the temporal.\nTime spells let you attack multiple\ntimes, delay injuries, or even slow\nyour enemies to a stand-still.",
        "fr": "La rune du temps donne le\ncontrôle sur le temporel.\nLes sorts temporels vous permettent\nd’attaquer plusieurs fois, de retarder\nles blessures ou même de ralentir\nvos ennemis jusqu’à ce qu’ils s’arrêtent.",
        "zh_tw": "時間符文授予對時間的控\n制權。時間法術讓你能多次\n攻擊，延緩受傷時間，甚至\n凍結時間來減慢敵人的行動。",
        "zh_cn": "时间符文授予对时间的控\n制权。时间法术让你能多次\n攻击，延缓受伤时间，甚至\n冻结时间来减慢敌人的行动。",
        "ru": "Руна Время дает контроль над временным. Заклинания времени позволяют атаковать несколько раз, задерживать ранения или даже замедлять врагов.",
        "es": "La runa del tiempo otorga control sobre lo temporal. Los hechizos de tiempo te permiten atacar varias veces, retrasar las lesiones o incluso ralentizar a tus enemigos hasta detenerlos.",
        "jp": "タイムルーンは、時間的なものに対するコントロールを与える。時間呪文を使用すると、複数回攻撃したり、負傷を遅らせたり、敵の動きを鈍らせたりすることができます。"
    },
    "time_tut_strike_desc": {
        "en_us": "An attack that strikes twice.\nEach attack does modest damage\nbut can be powered\nup greatly with +damage\nenhancements.",
        "fr": "Une attaque qui frappe deux\nfois. Chaque attaque inflige des\ndégâts modestes, mais peut être\nconsidérablement renforcée avec\ndes améliorations de +dégâts.",
        "zh_tw": "兩次攻擊。每次攻擊都會造成\n適度的傷害，但可以通過+傷害增強\n來大大增強。",
        "zh_cn": "两次攻击。每次攻击都会造成\n适度的伤害，但可以通过+伤害增强\n来大大增强。",
        "ru": "Атака, которая наносит двойной удар. Каждая атака наносит небольшой урон, но может быть значительно усилена с помощью улучшений +урона.",
        "es": "Un ataque que golpea dos veces. Cada ataque hace un daño modesto, pero se puede potenciar en gran medida con mejoras de +daño.",
        "jp": "2回攻撃する攻撃。各攻撃は中程度のダメージを与えますが、+ダメージ強化で大幅にパワーアップできます。"
    },
    "time_tut_enhance_desc": {
        "en_us": "Your next attack is duplicated\nallowing you to fire multiple\nattacks at the same time.",
        "fr": "Votre prochaine attaque est\ndupliquée, ce qui vous permet\nde lancer plusieurs attaques\nen même temps.",
        "zh_tw": "你的下一次攻擊是重複的，\n允許你同時發射多次攻擊。",
        "zh_cn": "你的下一次攻击是重复的，\n允许你同时发射多次攻击。",
        "ru": "Ваша следующая атака дублируется, что позволяет вам проводить несколько атак одновременно.",
        "es": "Tu próximo ataque se duplica, lo que te permite disparar varios ataques al mismo tiempo.",
        "jp": "次の攻撃は複製され、同時に複数の攻撃を発射することができます。"
    },
    "time_tut_protect_desc": {
        "en_us": "Creates a shield that delays\nthe damage you take to a\nslow trickle, up to a limit.",
        "fr": "Crée un bouclier qui retarde\nles dégâts que vous subissez\nà un filet lent, jusqu’à une\nlimite.",
        "zh_tw": "創建一個盾牌，可以將您\n受到的傷害延遲到緩慢的\n細流。",
        "zh_cn": "打造一个盾牌，可以将您\n受到的伤害延迟到缓慢的\n细流。",
        "ru": "Создает щит, который задерживает получаемый вами урон до медленной струйки, до предела.",
        "es": "Crea un escudo que retrasa el daño que recibes a un goteo lento, hasta un límite.",
        "jp": "受けるダメージを限界までゆっくりと遅らせるシールドを作成します。"
    },
    "time_tut_reinforce_desc": {
        "en_us": "Heals you by partially\nundoing your most recent\ninjury.",
        "fr": "Vous guérit en réparant\npartiellement votre blessure\nla plus récente.",
        "zh_tw": "通過部分消除您最近的傷害\n來治癒您。",
        "zh_cn": "通过部分消除您最近的伤害\n来治愈您。",
        "ru": "Исцеляет вас, частично устраняя вашу последнюю травму.",
        "es": "Te cura deshaciendo parcialmente tu lesión más reciente.",
        "jp": "直近の怪我を部分的に元に戻すことで、あなたを癒します。"
    },
    "time_tut_unload_desc": {
        "en_us": "Slows down time to a near\nstand-still for several easy\nand stress-free spell casts.",
        "fr": "Ralentit le temps jusqu’à ce\nqu’il s’arrête pour plusieurs\nsorts faciles et sans stress.",
        "zh_tw": "將時間減慢到幾乎靜止，\n以進行幾次簡單且無壓力的法術施放。",
        "zh_cn": "将时间减慢到几乎静止，\n以进行几次简单且无压力的法术施放。",
        "ru": "Замедляет время почти до полной остановки для нескольких простых и беззаботных применений заклинаний.",
        "es": "Ralentiza el tiempo hasta casi detenerlo durante varios lanzamientos de hechizos fáciles y sin estrés.",
        "jp": "時間をほぼ停止状態まで遅くし、簡単でストレスのない呪文を何度か唱えます。"
    },
    "void_tut_desc": {
        "en_us": "The Void rune grants \ncontrol over the power of empty\nspace. Void spells can deal\npercentage health damage,\nnegate enemy attacks, or even\nfully heal you at a cost.",
        "fr": "La rune du Vide confère\nle contrôle du pouvoir de l’espace\nvide. Les sorts du Vide peuvent\ninfliger un pourcentage de dégâts\nde santé, annuler les attaques\nennemies ou même vous soigner\ncomplètement à un coût.",
        "zh_tw": "虛空符文賦予了對虛空\n力量的控制權。虛空法術\n可以造成一定比例的生命傷害，\n抵消敵人的攻擊，甚至可以\n付出總生命代價來完全治癒你。",
        "zh_cn": "虚空符文赋予了对虚空\n力量的控制权。虚空法术\n可以造成一定比例的生命伤害，\n抵消敌人的攻击，甚至可以\n付出总生命代价来完全治愈你。",
        "ru": "Руна Пустоты дает контроль над силой пустого пространства. Заклинания Бездны могут наносить процент урона от здоровья, нейтрализовать вражеские атаки или даже полностью исцелять вас за определенную плату.",
        "es": "La runa del Vacío otorga control sobre el poder del espacio vacío. Los hechizos de vacío pueden infligir un porcentaje de daño de salud, negar los ataques enemigos o incluso curarte por completo a un costo.",
        "jp": "ボイドルーンでは、何もない空間の力をコントロールすることができます。ボイド呪文は、一定の割合の体力ダメージを与えたり、敵の攻撃を無効にしたり、コストをかければ完全に回復したりします。"
    },
    "void_tut_strike_desc": {
        "en_us": "An attack that deals percentage\nhealth damage and strikes an\nadditional 2 more times after\na delay.",
        "fr": "Une attaque qui inflige un pourcentage\nde dégâts de santé et frappe 2\nfois de plus après un certain délai.",
        "zh_tw": "造成一定百分比生命傷害並在延遲後\n再攻擊 2 次的攻擊。",
        "zh_cn": "造成一定百分比生命伤害并在延迟后\n再攻击 2 次的攻击。",
        "ru": "Атака, которая наносит процентный урон здоровью и наносит еще 2 удара после задержки.",
        "es": "Un ataque que inflige un porcentaje de daño de vida y golpea 2 veces más después de un retraso.",
        "jp": "一定の割合の体力ダメージを与え、遅延後にさらに2回攻撃する攻撃。"
    },
    "void_tut_enhance_desc": {
        "en_us": "Increases the damage of your\nattacks for the rest of the\nfight. Good for long fights.",
        "fr": "Augmente les dégâts de vos attaques\npour le reste du combat. Idéal\npour les combats de longue durée.",
        "zh_tw": "增加你在接下來的戰鬥中攻擊\n造成的傷害。適合長時間戰鬥。",
        "zh_cn": "增加你在接下来的战斗中攻击\n造成的伤害。适合长时间战斗。",
        "ru": "Проклинает врага, заставляя его получать больше урона от всего. Хорошо работает с другими заклинаниями, которые наносят урон несколько раз.",
        "es": "Maldice a un enemigo, lo que hace que reciba más daño de todo. Funciona bien con otros hechizos que infligen daño varias veces.",
        "jp": "敵を呪い、敵があらゆるものから受けるダメージが増加する。複数回ダメージを与える他の呪文とうまく連携します。"
    },
    "void_tut_protect_desc": {
        "en_us": "Creates a shield that negates\nall damage from a single\nenemy attack hit, no matter\nhow strong.",
        "fr": "Crée un bouclier qui annule tous\nles dégâts infligés par une\nseule attaque ennemie, quelle\nque soit sa force.",
        "zh_tw": "創建一個盾牌，無論強度如何，\n都可以抵消單次敵人攻擊造成的所有傷害。",
        "zh_cn": "打造一个盾牌，无论强度如何，\n都可以抵消单次敌人攻击造成的所有伤害。",
        "ru": "Создает щит, который сводит на нет весь урон от одной вражеской атаки, независимо от того, насколько она сильна.",
        "es": "Crea un escudo que niega todo el daño de un solo golpe de ataque enemigo, sin importar cuán fuerte sea.",
        "jp": "敵の攻撃が1回受けても、どんなに強くてもすべてのダメージを無効化するシールドを生成する。"
    },
    "void_tut_reinforce_desc": {
        "en_us": "Become briefly invulnerable\nand heal to full, but at\nthe cost of some max health.",
        "fr": "Devient brièvement invulnérable\net guérit complètement, mais\nau prix d’une santé maximale.",
        "zh_tw": "變得短暫無敵並完全恢復，\n但以一些总生命值為代價。",
        "zh_cn": "变得短暂无敌并完全恢复，\n但以一些总生命值为代价。",
        "ru": "Ненадолго становится неуязвимым и полностью исцеляется, но ценой некоторого максимального здоровья.",
        "es": "Te vuelves brevemente invulnerable y te curas por completo, pero a costa de algo de salud máxima.",
        "jp": "一時的に無敵状態になり、完全に回復しますが、最大体力がいくらか犠牲になります。"
    },
    "void_tut_unload_desc": {
        "en_us": "Creates a vortex that deals\nheavy percent health damage\nwhile disrupting any action\nthe enemy is trying to make.",
        "fr": "Crée un vortex qui inflige un\npourcentage élevé de dégâts\nde santé tout en perturbant\ntoute action de l’ennemi.",
        "zh_tw": "創造一個漩渦，造成嚴重的生命傷害，\n同時打断敵人的行動。",
        "zh_cn": "创造一个漩涡，造成严重的生命伤害，\n同时打断敌人的行动。",
        "ru": "Создает вихрь, который наносит большой урон в процентах здоровья, прерывая любые действия противника.",
        "es": "Crea un vórtice que inflige un gran porcentaje de daño de salud mientras interrumpe cualquier acción que el enemigo esté tratando de hacer.",
        "jp": "敵が行おうとしている行動を妨害しながら、重い体力パーセントダメージを与える渦を発生させます。"
    },
    "protect_tut_desc": {
        "en_us": "The Shield rune creates\nbarriers that protect you as\nlong as they are positioned\nbetween you and the enemy.",
        "fr": "La rune Bouclier crée des\nbarrières qui vous protègent\ntant qu’elles sont positionnées\nentre vous et l’ennemi.",
        "zh_tw": "盾牌符文會創造盾牌，\n要盾牌位於你和敵人之間，\n就可以保護你。",
        "zh_cn": "盾牌符文会创造盾牌，\n只要盾牌位于你和敌人之间，\n就可以保护你。",
        "ru": "Руна Щит создает барьеры, которые защищают вас, пока они находятся между вами и врагом.",
        "es": "La runa escudo crea barreras que te protegen siempre que estén colocadas entre tú y el enemigo.",
        "jp": "シールドルーンは、あなたと敵の間に配置されている限り、あなたを保護するバリアを作成します。"
    },
    "reinforce_tut_desc": {
        "en_us": "The Body rune grants effects\nthat persist until you cast\na new body spell. Some Body Rune\ncombos can even heal you.",
        "fr": "La Rune Corps confère des effets\nqui persistent jusqu’à ce que\nvous lanciez un nouveau sort corporel.\nCertains combos Rune Corps peuvent même\nvous soigner.",
        "zh_tw": "身體符文賦予的效果會\n一直持續到你施放新的\n體法術。\n某些身體符文組合甚至可以治癒你。",
        "zh_cn": "身体符文赋予的效果会\n一直持续到你施放新的\n身体法术。\n某些身体符文组合甚至可以治愈你。",
        "ru": "Руна Тела дает эффекты, которые сохраняются до тех пор, пока вы не разыграете новое заклинание тела. Некоторые комбинации Тело+Руна могут даже исцелить вас.",
        "es": "La runa Cuerpo otorga efectos que persisten hasta que lanzas un nuevo hechizo de cuerpo. Algunos combos de Cuerpo + Runa pueden incluso curarte.",
        "jp": "身体のルーンは、あなたが新しい身体呪文を唱えるまで持続する効果を付与する。一部のボディ+ルーンコンボはあなたを癒すことさえできます。"
    },
    "unload_tut_desc": {
        "en_us": "The Ultimate rune grants you\nsome of the most powerful\nspells in your arsenal.\nUse this rune wisely.",
        "fr": "La rune ultime vous confère\ncertains des sorts les plus\npuissants de votre arsenal.\nUtilisez cette rune à bon escient.",
        "zh_tw": "究極符文賦予您最強大\n的法術。明智地使用\n這個符文。",
        "zh_cn": "究极符文赋予您最强大\n的法术。明智地使用\n这个符文。",
        "ru": "Руна Ultimate дает вам одни из самых мощных заклинаний в вашем арсенале. Используйте эту руну с умом.",
        "es": "La runa definitiva te otorga algunos de los hechizos más poderosos de tu arsenal. Usa esta runa sabiamente.",
        "jp": "アルティメットルーンは、あなたの武器の中で最も強力な呪文のいくつかをあなたに与えます。このルーンを賢く使いましょう。"
    },
    "no_improve_tut_desc": {
        "en_us": "You see no more need to\nimprove. You are certain that\nyou are strong enough to take\non any challenge.",
        "fr": "Vous ne voyez plus la\nnécessité de vous améliorer.\nVous êtes certain d’être\nassez fort pour relever\nn’importe quel défi.",
        "zh_tw": "你認為沒有必要再改進了。\n你確信你足夠強大，可以\n接受任何挑戰。",
        "zh_cn": "你认为没有必要再改进了。\n你确信你足够强大，可以\n接受任何挑战。",
        "ru": "Вы больше не видите необходимости совершенствоваться. Вы уверены, что достаточно сильны, чтобы принять любой вызов.",
        "es": "Ya no ves la necesidad de mejorar. Estás seguro de que eres lo suficientemente fuerte como para asumir cualquier desafío.",
        "jp": "これ以上改善する必要はないと思います。あなたは、どんな挑戦にも立ち向かうのに十分な強さを持っていると確信しています。"
    }
}

function setLanguage(lang) {
    language = lang;
    localStorage.setItem("language", lang);

    messageBus.publish('language_switch', lang)
}

function getLangText(textName) {
    if (!textData[textName]) {
        console.error("Missing text name ", textName);
        return "MISSING TEXT";
    }
    return textData[textName][language];
}
