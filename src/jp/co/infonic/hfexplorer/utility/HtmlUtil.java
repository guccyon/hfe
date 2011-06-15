package jp.co.infonic.hfexplorer.utility;


public class HtmlUtil {

	/** HTMLエンコードが必要な文字 * */
	static char[] htmlEncChar = { '&', '"', '<', '>' };

	/** HTMLエンコードした文字列 * */
	static String[] htmlEncStr = { "&amp;", "&quot;", "&lt;", "&gt;" };

	public static String htmlEncode(String inputValue) {

		if (inputValue == null) {
			return (null);
		}

		StringBuffer strOut = new StringBuffer(inputValue);
		for (int i = 0; i < htmlEncChar.length; i++) {
			
			// エンコードが必要な文字の検索
			int idx = strOut.toString().indexOf(htmlEncChar[i]);

			while (idx != -1) {
				// エンコードが必要な文字の置換
				strOut.setCharAt(idx, htmlEncStr[i].charAt(0));
				strOut.insert(idx + 1, htmlEncStr[i].substring(1));

				// 次のエンコードが必要な文字の検索
				idx = idx + htmlEncStr[i].length();
				idx = strOut.toString().indexOf(htmlEncChar[i], idx);
			}
		}
		return (strOut.toString());

	}
    
    /**
     * 
     * 概要: ツールチップの改行に対応していないブラウザは改行を半角空白に置き換える<br>
     * 詳細: ツールチップの改行に対応していないブラウザは改行を半角空白に置き換える<br>
     * 備考: なし<br>
     *
     * @param fdlist
     */
    public static String changeDescription(UserAgent ua, String text) {

		if (ua != UserAgent.MSIE) {
			return text.replaceAll("\n", " ");
		}
		
		return text;
    	
    }
    
    /**
     * 
     * 概要: ブラウザ毎に改行コードをエンコードして返す。<br>
     * 詳細: ブラウザ毎に改行コードをエンコードして返す。<br>
     * 備考: なし<br>
     *
     * @param session
     * @param fd
     * @return
     */
    public static String encodeReturnCd(UserAgent ua, String text) {
    	if (ua == UserAgent.MSIE) {
    		return text.replaceAll("\n", "\r\n");
    	} else if (ua == UserAgent.FIREFOX) {
			return text.replaceAll("\r\n", "\n");
    	} else {
    		return text.replaceAll("\n", "\r\n");
    	}
    }
}
