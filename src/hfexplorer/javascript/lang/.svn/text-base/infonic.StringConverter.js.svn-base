var StringConverter = {
	tableList: {},
	addrule: function(type, convertTable) {
		var reverseTable = {};
		for(var i in convertTable) {
			reverseTable[convertTable[i]] = i;
		}
		this.tableList[type] = [convertTable, reverseTable];
	},
	convert: function(value, type, reverse) {
		result = "";
		var hash = this.tableList[type][reverse ? 1 : 0];
		value.each(function(cha) {
			if (hash[cha]) result += hash[cha];
			else result += cha;
		});
		return result;
	}
};
StringConverter.addrule('number', {
	'0': '０',
	'1': '１',
	'2': '２',
	'3': '３',
	'4': '４',
	'5': '５',
	'6': '６',
	'7': '７',
	'8': '８',
	'9': '９'
});
StringConverter.addrule('alpha', {
	"a":"ａ",	"b":"ｂ",	"c":"ｃ",	"d":"ｄ",	"e":"ｅ",
	"f":"ｆ",	"g":"ｇ",	"h":"ｈ",	"i":"ｉ",	"j":"ｊ",
	"k":"ｋ",	"l":"ｌ",	"m":"ｍ",	"n":"ｎ",	"o":"ｏ",
	"p":"ｐ",	"q":"ｑ",	"r":"ｒ",	"s":"ｓ",	"t":"ｔ",
	"u":"ｕ",	"v":"ｖ",	"w":"ｗ",	"x":"ｘ",	"y":"ｙ",
	"z":"ｚ",	"A":"Ａ",	"B":"Ｂ",	"C":"Ｃ",	"D":"Ｄ",
	"E":"Ｅ",	"F":"Ｆ",	"G":"Ｇ",	"H":"Ｈ",	"I":"Ｉ",
	"J":"Ｊ",	"K":"Ｋ",	"L":"Ｌ",	"M":"Ｍ",	"N":"Ｎ",
	"O":"Ｏ",	"P":"Ｐ",	"Q":"Ｑ",	"R":"Ｒ",	"S":"Ｓ",
	"T":"Ｔ",	"U":"Ｕ",	"V":"Ｖ",	"W":"Ｗ",	"X":"Ｘ",
	"Y":"Ｙ",	"Z":"Ｚ",
});
StringConverter.addrule('kana', {
	'ヲ':'ｦ',	'ァ':'ｧ',	'ィ':'ｨ',	'ゥ':'ｩ',	'ェ':'ｪ',
	'ォ':'ｫ',	'ャ':'ｬ',	'ュ':'ｭ',	'ョ':'ｮ',	'ッ':'ｯ',
	'ー':'ｰ',	'ア':'ｱ',	'イ':'ｲ',	'ウ':'ｳ',	'エ':'ｴ',
	'オ':'ｵ',	'カ':'ｶ',	'キ':'ｷ',	'ク':'ｸ',	'ケ':'ｹ',
	'コ':'ｺ',	'ガ':'ｶﾞ',	'ギ':'ｷﾞ',	'グ':'ｸﾞ',	'ゲ':'ｹﾞ',
	'ゴ':'ｺﾞ',	'サ':'ｻ',	'シ':'ｼ',	'ス':'ｽ',	'セ':'ｾ',
	'ソ':'ｿ',	'ザ':'ｻﾞ',	'ジ':'ｼﾞ',	'ズ':'ｽﾞ',	'ゼ':'ｾﾞ',
	'ゾ':'ｿﾞ',	'タ':'ﾀ',	'チ':'ﾁ',	'ツ':'ﾂ',	'テ':'ﾃ',
	'ト':'ﾄ',	'ダ':'ﾀﾞ',	'ヂ':'ﾁﾞ',	'ヅ':'ﾂﾞ',	'デ':'ﾃﾞ',
	'ド':'ﾄﾞ',	'ナ':'ﾅ',	'ニ':'ﾆ',	'ヌ':'ﾇ',	'ネ':'ﾈ',
	'ノ':'ﾉ',	'ハ':'ﾊ',	'ヒ':'ﾋ',	'フ':'ﾌ',	'ヘ':'ﾍ',
	'ホ':'ﾎ',	'バ':'ﾊﾞ',	'ビ':'ﾋﾞ',	'ブ':'ﾌﾞ',	'ベ':'ﾍﾞ',
	'ボ':'ﾎﾞ',	'パ':'ﾊﾟ',	'ピ':'ﾋﾟ',	'プ':'ﾌﾟ',	'ペ':'ﾍﾟ',
	'ポ':'ﾎﾟ',	'マ':'ﾏ',	'ミ':'ﾐ',	'ム':'ﾑ',	'メ':'ﾒ',
	'モ':'ﾓ',	'ヤ':'ﾔ',	'ユ':'ﾕ',	'ヨ':'ﾖ',	'ラ':'ﾗ',
	'リ':'ﾘ',	'ル':'ﾙ',	'レ':'ﾚ',	'ロ':'ﾛ',	'ワ':'ﾜ',
	'ン':'ﾝ',	'ヴ':'ｳﾞ',	'゛':'ﾞ',	'゜':'ﾟ',
//	'ヰ':'ｲ',	'ヱ':'ｴ',	'ヮ':'ﾜ',	'ヵ':'ｶ',	'ヶ':'ｹ',
	'。':'｡',	'、':'､'
});
StringConverter.addrule('symbol', {
	' ':'　',	'!':'！',	'#':'＃',	'$':'＄',
	'%':'％',	'&':'＆',	"'":"’",	'(':'（',
	')':'）',	'*':'＊',	'+':'＋',	',':'，',
	'-':'－',	'.':'．',	'/':'／',	':':'：',
	';':'；',	'<':'＜',	'=':'＝',	'>':'＞',
	'?':'？',	'@':'＠',	'[':'［',	'{':'｛',
	'|':'｜',	'}':'｝',	'~':'～',	'`':'‘',
	'`':'’',	'"':'“',	'"':'”',	"・":"･",
	"「":"｢"	,	"」":"｣",	'\\':'￥',
});

Object.extend(String.prototype, {
	// true で右から左　false　で左から右へ　コンバート
	toHanNum: function() {return StringConverter.convert(this,'number', true)},
	toZenNum: function() {return StringConverter.convert(this,'number', false)},
	toHanAlpha: function() {return StringConverter.convert(this,'alpha', true)},
	toZenAlpha: function() {return StringConverter.convert(this,'alpha', false)},
	toZenKana: function() {return StringConverter.convert(this, 'kana', true)},
	toHanKana: function() {return StringConverter.convert(this, 'kana', false)},
});