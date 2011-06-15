package jp.co.infonic.hfexplorer.utility;

import jp.co.infonic.hfexplorer.bean.json.JsonString;
import jp.co.infonic.hfexplorer.exception.ValidateException;


public class FileNameValidater {

	// ファイル名として利用できない記号、特殊文字
	public static final String CANNOT_USE_CHAR = "/\\:;,*?\"<>|";
    
    /**
     * 
     * 概要: ファイル名の妥当性のチェックを行う<br>
     * 詳細: エラー時 falseを返す。
     * 備考: なし<br>
     *
     * @param fileName
     * @return
     * @throws ValidateException 
     */
    public static void validateFileName(String fileName) throws ValidateException {

        // ファイル名の長さをチェック
        if (fileName.getBytes().length > 126) {
        	throw new ValidateException(new JsonString("ファイル名が長すぎます。126バイト以内で指定してください。"));
        }

    	// 禁止文字チェック
        for (int i = 0; i < CANNOT_USE_CHAR.length(); i++) {
            if (fileName.indexOf(CANNOT_USE_CHAR.charAt(i)) != -1) {
            	throw new ValidateException(new JsonString("ファイル名に使えない文字が含まれています。"));
            }
        }
    }
}
