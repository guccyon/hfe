package jp.co.infonic.hfexplorer.manage;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jp.co.infonic.hfexplorer.db.Query;
import jp.co.infonic.hfexplorer.utility.ScriptTag;

public class ManagePublicDirectory extends ManageCommon {

	private Map[] directories;

	public void execute(HttpServletRequest request) throws Exception{

		List list = new Query("GetPublicDirectories").getResult();

		directories = (Map[]) list.toArray(new Map[0]);

	}

	public String getResponseStr() {
		StringBuffer sb = new StringBuffer();
		sb.append(readFile(HTML_COMMON_HEADER));
		
		sb.append("<p class='sub'>公開ディレクトリの編集</p>");
		sb.append("<div>公開したいディレクトリをフルパスで記述してください。");
		sb.append("<span>更新ボタンで登録を行います。</span>");
		sb.append("</div>");
		
		sb.append("<form method='post' action='update_public_directory'>");
		
		sb.append("<ul id='public_directory_form'>");
		for (Map record: directories) {
			sb.append("<li>");
			sb.append(getInputTag(record));
			sb.append("<input type='button' class='remove_btn' value='削除'>");
			sb.append("</li>");
		}
		sb.append("</ul>");
		
		sb.append("<input type='button' onclick='add_new_directory()' value='追加'>");		
		sb.append("<input type='submit' value='更新' id='public_submit'>");
		sb.append("</form>");
		
		sb.append(new ScriptTag(){
			public String contentStr() {
				StringBuilder sb = new StringBuilder();
				sb.append("Event.observe(window, 'load', init_public_directory)");
				return sb.toString();
			}
		}.contents());
		
		sb.append(readFile(HTML_COMMON_FOOTER));
		return  sb.toString();
	}

	public void setResponseHeader(HttpServletResponse response) {
		response.setHeader("Cache-Control", "no-cache");
		response.setContentType("text/html;charset=UTF-8");
	}
	
	private String getInputTag(Map record) {
		StringBuffer sb = new StringBuffer();
		sb.append("<input class='directory' type='text' name='directory'");
		sb.append(" value='").append(record.get("FULL_PATH")).append("'>");
		return sb.toString(); 
	}

}
