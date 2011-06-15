package jp.co.infonic.hfexplorer.utility;

public class UserAgent {
	
	public static final UserAgent MSIE = new UserAgent();
	
	public static final UserAgent FIREFOX = new UserAgent();
	
	public static final UserAgent OPERA = new  UserAgent();
	
	public static final UserAgent UNKNOWN = new UserAgent();

	/**
	 * 
	 * 概要: リクエスト文字列のUserAgentからブラウザ種別を判断します。<br>
	 * 詳細: リクエスト文字列のUserAgentからブラウザ種別を判断します。<br>
	 * 備考: なし<br>
	 *
	 * @param userAgentStr
	 * @return
	 */
	public static UserAgent judgeUserAgent(String userAgentStr) {

		if (userAgentStr == null) {
			return UNKNOWN;
		}else if (userAgentStr.indexOf("MSIE") != -1) {
			return MSIE;
		} else if(userAgentStr.indexOf("Firefox") != -1){
			return FIREFOX;
		} else {
			return UNKNOWN;
		}
	}
}
