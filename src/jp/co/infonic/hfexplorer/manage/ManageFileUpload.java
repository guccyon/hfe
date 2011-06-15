package jp.co.infonic.hfexplorer.manage;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jp.co.infonic.hfexplorer.db.Query;

public class ManageFileUpload extends ManageCommon {
	
	protected static final String KEY_TMP_DIR = "fileupload.tmpdir";
	protected static final String KEY_LIMIT_SIZE = "fileupload.limit.size";
	
	private static final String DEFAULT_LIMIT = "128";
	
	protected String tmpdirStr;
	
	protected String limitStr;

	public void execute(HttpServletRequest request) throws Exception {

		Map tmpdir = new Query("GetSystemProperty", new Object[] { KEY_TMP_DIR }).getResultOne();

		if (tmpdir == null) {
			tmpdir = new HashMap();
			tmpdir.put("VALUE", "");
		}
		tmpdirStr = (String)tmpdir.get("VALUE");

		Map limit = new Query("GetSystemProperty", new Object[] { KEY_LIMIT_SIZE }).getResultOne();
		if (limit == null) {
			limit = new HashMap();
			limit.put("VALUE", DEFAULT_LIMIT);
		}
		limitStr = (String) limit.get("VALUE");
	}

	public String getResponseStr() {
		return readFile(HTML_COMMON_HEADER) + errorMessage() + getHtmlTable() + readFile(HTML_COMMON_FOOTER);
	}

	public void setResponseHeader(HttpServletResponse response) {
		response.setHeader("Cache-Control", "no-cache");
		response.setContentType("text/html;charset=UTF-8");
	}
	private String getHtmlTable() {
		StringBuffer sb = new StringBuffer();

		sb.append("<div>ファイルアップロードの設定</div>");
		sb.append("<div>ファイルアップロード関連の設定を編集します。");
		sb.append("<span>更新ボタンで登録を行います。</span>");
		sb.append("</div>");
		
		sb.append("<form method='post' action='update_file_upload'>");
		
		sb.append("<p class='sub'>アップロードファイルの一時ディレクトリ</p>");
		sb.append("<p><input class='file_upload_edit' type='text' name='tmpdir' value='").append(tmpdirStr).append("'></p>");
		sb.append("<ul>");
		sb.append("<li class='comment'>フルパスで指定してください。</li>");
		sb.append("<li class='comment'>一時ファイルは大量に発生する為、容量の多いディスクを指定してください。また定期的にファイルの削除が必要になります。</li>");
		sb.append("</ul>");
		
		sb.append("<p class='sub'>１ファイルあたりのサイズ制限</p>");
		sb.append("<p><input class='fileupload_edit' type='text' name='limit' value='").append(limitStr).append("'></p>");
		sb.append("<ul>");
		sb.append("<li class='comment'>MB単位で数値で指定してください。</li>");
		sb.append("</ul>");
		
		sb.append("<br>");
		sb.append("<br>");
		sb.append("<p><input type='submit' value='更新'></p>");
		sb.append("</form>");
		
		return sb.toString();
	}

	
	protected String errorMessage() {return "";}
}
