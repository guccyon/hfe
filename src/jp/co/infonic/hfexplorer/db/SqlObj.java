package jp.co.infonic.hfexplorer.db;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

/**
 * 
 * 概要：SQLファイルオブジェクト<br>
 * 詳細：SQLファイルと１対１でマッピングされます。<br>
 *<pre>
 * [変更履歴]
 * 日付        連番   名前      内容
 * --------------------------------------------------
 * 2006/03/17  VL000  樋口      新規
 *</pre>
 * @author higuchit
 */
public class SqlObj {
	
	// ファイルより取得したＳＱＬ文
	private StringBuffer content;
	
	// 当ファイルのＩＤ
	private String sqlId;
	
	// ファイルの文字コード
	private String encode;
	
	// クエリの種類
	private int queryType = TYPE_UNKNOWN;
	
	/** クエリ種別：不明 */
	public static final int TYPE_UNKNOWN = 0;
	
	/** クエリ種別：検索 */
	public static final int TYPE_SELECT = 1;
	
	/** クエリ種別：登録 */
	public static final int TYPE_INSERT = 2;
	
	/** クエリ種別：更新  */
	public static final int TYPE_UPDATE = 3;
	
	/** クエリ種別：削除  */
	public static final int TYPE_DELETE = 4;
	
	/**
	 * コンストラクタ
	 * @param sqlin
	 * @param id
	 * @param encode
	 */
	SqlObj(InputStream sqlin, String id, String encode) {
		this.encode = encode;
		this.sqlId = id;
		content = new StringBuffer();
		getContent(sqlin);
		setQueryType();
	}
	
	/**
	 * コンストラクタ
	 * @param sqlFile
	 * @param encode
	 * @throws FileNotFoundException
	 */
	SqlObj(File sqlFile, String encode) throws FileNotFoundException {
		this(new FileInputStream(sqlFile), sqlFile.getName(), encode);
	}
	
	/**
	 * コンストラクタ
	 * @param query SQL文字列
	 */
	SqlObj(String query) {
		content = new StringBuffer(query);
		sqlId = "";
		setQueryType();
	}
	
	/**
	 * 
	 * 概要: ＳＱＬ文を返します。<br>
	 * 詳細: ＳＱＬ文を返します。<br>
	 * 備考: なし<br>
	 *
	 * @return
	 */
	public String getSqlString() {
		return content.toString();
	}
	
	/**
	 * 
	 * 概要: ＳＱＬ文中の {n} を置換文字列に置換したＳＱＬ文を返します。<br>
	 * 詳細: ＳＱＬ文中の {n} を置換文字列に置換したＳＱＬ文を返します。<br>
	 * 備考: なし<br>
	 *
	 * @param replace
	 * @return
	 */
	public String getSqlString(String[] replace) {

		return replace(content.toString(), replace);
	}
	
	/**
	 * 
	 * 概要: ＩＤを返します。<br>
	 * 詳細: ＩＤを返します。<br>
	 * 備考: なし<br>
	 *
	 * @return
	 */
	public String getId() {
		return sqlId;
	}
	
	/**
	 * クエリの種類を取得する。
	 * @return
	 */
    int getQueryType() {
    	return queryType;
    }

    /**
     * SQL文の処理種別をセットします。
     *
     */
    private void setQueryType() {
    	int firstIndex = 0;
    	for (; firstIndex < content.length(); firstIndex++) {
    		if (content.charAt(firstIndex) != ' ') {
    			break;
    		}
    	}
    	
    	// 読込んだコンテンツがクエリ判定文字列以上の長さか判定
    	// StringIndexOutOfBoundsException回避の為
    	if (content.length() >= firstIndex + 6) {
        	String query = content.substring(firstIndex, firstIndex + 6);
        	if (query.equals("SELECT")) {
        		queryType = TYPE_SELECT;
        	} else if (query.equals("INSERT")) {
        		queryType = TYPE_INSERT;
        	} else if (query.equals("UPDATE")) {
        		queryType = TYPE_UPDATE;
        	} else if (query.equals("DELETE")) {
        		queryType = TYPE_DELETE;
        	}
    	}
    }
	
	/**
	 * 
	 * 概要: 初期化時にＳＱＬ文を読み込みます。<br>
	 * 詳細: 初期化時にＳＱＬ文を読み込みます。<br>
	 * 備考: なし<br>
	 *
	 * @param in
	 */
	private void getContent(InputStream in) {
		BufferedReader br = null;
		try {
			br = new BufferedReader(new InputStreamReader(in, encode));
			
			while (br.ready()) {
				String line = br.readLine();
				
				StringBuffer sb = parseLineSql(line);
				content.append(sb);
				
				if (sb.length() != 0 && content.charAt(content.length() - 1) != ' ') {
					content.append(' ');
				}
			}
		} catch (IOException ioe) {
			ioe.printStackTrace();
		} finally {
			if (br != null) {
				try {
					br.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}
	
	/**
	 * 
	 * 概要: １行分のデータを解析する。<br>
	 * 詳細: １行分のデータを解析する。<br>
	 *       ファイルの先頭文字が#の場合、その行はコメントとみなします。<br>
	 *       タブ文字は全て半角スペースに置き換えます。<br>
	 *       一行の// 以降はコメントみなします。<br>
	 *       半角スペースが２個以上続く場合は、１個分に省略します。（リテラル以外）<br>
	 *       <br>
	 * 備考: なし<br>
	 *
	 * @param lineStr
	 * @return
	 */
	private StringBuffer parseLineSql(String lineStr) {

		StringBuffer sb = new StringBuffer();
		if (lineStr.startsWith("#")) {
			return sb;
		}
		
		// タブは半角スペースに置きかえ ,トリムを行う
		lineStr = lineStr.replace('\t', ' ').trim();
		
		char before = '!';  // 一文字目はダミー文字で初期化
		boolean squotLiteral = false;
		boolean wquotLiteral = false;
		for (int i =0; i < lineStr.length(); i++) {
			char tmpc = lineStr.charAt(i);
			
			if (tmpc == '\'') {
				// リテラル定数ではない場合は定数開始
				if (!squotLiteral && !wquotLiteral) {
					squotLiteral = true;
				} else if (squotLiteral) {
					squotLiteral = false;
				}
			} else if (tmpc == '"') {
				if (!squotLiteral && !wquotLiteral) {
					wquotLiteral = true;
				} else if (wquotLiteral) {
					wquotLiteral = false;
				}
			} else if (tmpc == ' ' && before == ' ' && !squotLiteral && !wquotLiteral ) {
				// リテラル以外でスペースが２度続く場合は省略
				continue;
			} else if (tmpc == '-') {
				if (before == tmpc) {
					break;
				}

				// コメント開始文字の一旦保留する
				before = tmpc;
				continue;
			}
			
			if (before == '-') {
				sb.append(before);
			}
			
			sb.append(tmpc);
			before = tmpc;
		}
		
		return sb;
	}
	
	/**
	 * 
	 * 概要: 第２引数の置換文字列をSQL文中の{0},{1},({0} -> [0])の文字列とそれぞれ置換する。<br>
	 * 詳細: 第２引数の置換文字列をSQL文中の{0},{1},({0} -> [0])の文字列とそれぞれ置換する。<br>
	 * 備考: なし<br>
	 *
	 * @param targetStr 対象文字列
	 * @param replaceStr 置換文字列
	 * @return 置換後の文字列
	 */
    private String replace(String targetStr, String[] replaceStr) {
    	
    	if (replaceStr == null || targetStr == null) {
    		throw new IllegalArgumentException("引数がnullです。 arg1 :" + targetStr + " // arg2 :" + replaceStr);
    	}
    	
        for (int i = 0; i < replaceStr.length; i++) {
            String replace = "{" + (i) + "}";
            int index;
            while ((index = targetStr.indexOf(replace)) != -1) {
                String before = targetStr.substring(0, index);
                String left = targetStr.substring(index + replace.length());
                targetStr = before + replaceStr[i] + left;
            }
        }
        return targetStr;
    }
	
	public String toString() {
		return content.toString();
	}
}
