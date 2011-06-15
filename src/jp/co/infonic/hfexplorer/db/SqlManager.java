package jp.co.infonic.hfexplorer.db;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.MissingResourceException;

/**
 * 
 * 概要：ＳＱＬオブジェクト管理クラス<br>
 * 詳細：ＳＱＬオブジェクト管理クラス<br>
 *       ＳＱＬを発行するクラスと同じパス上に.sqlを<br>
 *       配置することで、拡張子を除いたファイル名をキーに<br>
 *       ＳＱＬファイルを読み込みSqlObjインスタンスを生成し<br>
 *       返します。<br>
 *       ※SQLファイルは文字コードにShift_JISを指定する必要があります。
 *       
 *<pre>
 * [変更履歴]
 * 日付        連番   名前      内容
 * --------------------------------------------------
 * 2006/03/17  VL000  樋口      新規
 *</pre>
 * @author higuchit
 */
public class SqlManager {
	
	// 一度読み込んだSQLはキャッシュする
	private static Map sqlCache = new HashMap();
	
	// 文字コード
	private static String ENCODE = "Shift_JIS";
	
	/**
	 * 
	 * 概要: SQLファイルの文字コードを指定します。<br>
	 * 詳細: SQLファイルの文字コードを指定します。
	 *       ディフォルトではShift_JISになります。<br>
	 * 備考: なし<br>
	 *
	 * @param newEncode
	 * @throws UnsupportedEncodingException
	 */
    public static void setSqlFileEncode(String newEncode) throws UnsupportedEncodingException {
    	"dummy".getBytes(newEncode);
    	
    	ENCODE = newEncode;
    }
	
	/**
	 * 
	 * 概要: ＩＤに対応するＳＱＬオブジェクトを返します。<br>
	 * 詳細: ＩＤに対応するＳＱＬオブジェクトを返します。<br>
	 *       該当SQLファイルは利用クラスと同じパッケージに<br>
	 *       配置する必要があります。<br>
	 * 備考: なし<br>
	 *
	 * @param selfClass
	 * @param sqlId
	 * @return
	 */
	public static SqlObj getSql(Class selfClass, String sqlId) {
		
		String id = selfClass.getPackage().getName() + "." + sqlId;
		
		id = id.replace('.', '/');
		
		SqlObj sql = (SqlObj)sqlCache.get(id);
		
		if (sql == null) {
			InputStream in = selfClass.getClassLoader().getResourceAsStream(id + ".sql");
			if (in == null) {
				throw new MissingResourceException("対象のSQLファイルが見つかりません。 -> " + id, "", "");
			}
			sql = new SqlObj(in, sqlId, ENCODE);
			if (sql != null) {
				sqlCache.put(id, sql);
			}
		}
		
		return sql;
	}
	
	/**
	 * 
	 * 概要: 入力ストリームからＳＱＬオブジェクトを作成します。<br>
	 * 詳細: 入力ストリームからＳＱＬオブジェクトを作成します。<br>
	 *       引数で渡された入力ストリームは内部でクローズされます。<br>
	 *       通常はgetSql(class, sqlId)を利用してください。<br>
	 *       利用した場合、ＳＱＬオブジェクトがキャッシュされるので<br>
	 *       パフォーマンスの向上にもつながります。<br>
	 * 備考: なし<br>
	 * @param in
	 * @return
	 * @since 2006/04/15
	 */
	public static SqlObj getSql(InputStream in) {
		return new SqlObj(in, "", ENCODE);
	}
	
	/**
	 * 
	 * 概要: SQL文字列から直接ＳＱＬオブジェクトを作成します。<br>
	 * 詳細: SQL文字列から直接ＳＱＬオブジェクトを作成します。<br>
	 *       通常はgetSql(class, sqlId)を利用してください。<br>
	 *       利用した場合、ＳＱＬオブジェクトがキャッシュされるので<br>
	 *       パフォーマンスの向上にもつながります。<br>
	 * 備考: なし<br>
	 * @param query
	 * @return
	 * @since 2006/04/15
	 */
	public static SqlObj getSql(String query) {
		return new SqlObj(query);
	}
	
	/**
	 * 
	 * 概要: 入力ストリームからSQLを読み込み、SQLObjインスタンスを生成する。<br>
	 * 詳細: 一つのSQLに複数の命令が記述されている場合に当メソッドを利用します。<br>
	 *       複数の命令の区切り文字は、行の先頭に/(半角スラッシュ)<br>
	 *       または一つの命令文の最後に;(セミコロン)を置く事で、<br>
	 *       命令文の区切り文字と解釈し、区切られた数分のSqlObjインスタンスを作成し<br>
	 *       配列にして返します。<br>
	 * 備考: なし<br>
	 *
	 * @param in
	 * @return
	 */
	public static SqlObj[] getSqls(InputStream in) {

		BufferedReader br = null;
		List list = new ArrayList();
		try {
			String linesep = System.getProperty("line.separator");
			br = new BufferedReader(new InputStreamReader(in, ENCODE));
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			while (br.ready()) {
				String line = br.readLine();
				if (line.startsWith("/")) {
					list.add(new SqlObj(new ByteArrayInputStream(baos.toByteArray()), "", ENCODE));
					baos.reset();
				} else	if (line.endsWith(";")) {
					line = line.substring(0, line.lastIndexOf(";"));
					baos.write((line +linesep).getBytes(ENCODE));
					list.add(new SqlObj(new ByteArrayInputStream(baos.toByteArray()), "", ENCODE));
					baos.reset();
				}  else {
					baos.write((line +linesep).getBytes(ENCODE));
				}
			}
			if (baos.size() > 0) {
				list.add(new SqlObj(new ByteArrayInputStream(baos.toByteArray()), "", ENCODE));
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
		
		return (SqlObj[])list.toArray(new SqlObj[0]);
	}
	
	/**
	 * 
	 * 概要: ＩＤに対応するＳＱＬオブジェクトを返します。<br>
	 * 詳細: ＩＤに対応するＳＱＬオブジェクトを返します。<br>
	 *       該当SQLファイルは利用クラスと同じパッケージに<br>
	 *       配置する必要があります。<br>
	 * 備考: なし<br>
	 *
	 * @param selfClass
	 * @param sqlId
	 * @return
	 */
	public static SqlObj[] getSqls(Class selfClass, String sqlId) {
		
		String id = selfClass.getPackage().getName() + "." + sqlId;
		id = id.replace('.', '/');
		
		InputStream in = selfClass.getClassLoader().getResourceAsStream(id + ".sql");
		if (in == null) {
			throw new MissingResourceException("対象のSQLファイルが見つかりません。 -> " + id, "", "");
		}
		
		return getSqls(in);
	}
}
