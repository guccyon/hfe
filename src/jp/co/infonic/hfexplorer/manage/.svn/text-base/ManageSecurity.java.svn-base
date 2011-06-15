package jp.co.infonic.hfexplorer.manage;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jp.co.infonic.hfexplorer.db.Query;

public class ManageSecurity extends ManageCommon {
	
	protected static final String DEFAULT_DENY_ADDR = "all";
	
	protected static final String DEFAULT_ALLOW_ADDR = "127.0.0.1";
	
	protected static final String KEY_DENY = "HOST.DENY";
	
	protected static final String KEY_ALLOW = "HOST.ALLOW";
	
	protected String denyAddr;
	
	protected String allowAddr;

	public void execute(HttpServletRequest request) throws Exception  {

		Map deny = new Query("GetSystemProperty", new Object[] { KEY_DENY }).getResultOne();
		Map allow = new Query("GetSystemProperty", new Object[] { KEY_ALLOW }).getResultOne();
		
		if (deny == null) {
			deny = new HashMap();
			deny.put("VALUE", DEFAULT_DENY_ADDR);
		}
		denyAddr = (String)deny.get("VALUE");
		
		if (allow == null) {
			allow = new HashMap();
			allow.put("VALUE", DEFAULT_ALLOW_ADDR);
		}
		allowAddr = (String) allow.get("VALUE");
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

		sb.append("<div>セキュリティ設定の編集</div>");
		sb.append("<div>セキュリティに関する各項目を設定してください。");
		sb.append("<span>更新ボタンで登録を行います。</span>");
		sb.append("</div>");
		
		sb.append("<form method='post' action='update_security'>");
		
		sb.append("<p class='sub'>管理コンソールへのアクセスを拒否するアドレス</p>");
		sb.append("<span class='comment'>(アドレスをカンマ区切りで指定してください。)</span>");
		sb.append("<p><input class='security_addr' type='text' name='deny' value='").append(denyAddr).append("'></p>");
		sb.append("<span class='comment'>【例】192.168.1.15, 172.16.133.0</span>");
		sb.append("<ul>");
		sb.append("<li class='comment'>allを指定すると全てのアドレスからのアクセスを拒否します。</li>");
		sb.append("<li class='comment'>アドレスの４つ目を0にする事でネットワークの範囲で指定できます。</li>");
		sb.append("</ul>");
		
		sb.append("<p class='sub'>管理コンソールへのアクセスを許すアドレス</p>");
		sb.append("<span class='comment'>(アドレスをカンマ区切りで指定してください。)</span>");
		sb.append("<p><input class='security_addr' type='text' name='allow' value='").append(allowAddr).append("'></p>");
		sb.append("<span class='comment'>【例】192.168.1.15, 172.16.133.0</span>");
		sb.append("<ul>");
		sb.append("<li class='comment'>127.0.0.1は必ず含まれます。</li>");
		sb.append("<li class='comment'>アドレスの４つ目を0にする事でネットワークの範囲で指定できます。</li>");
		sb.append("</ul>");
		
		sb.append("<br>");
		sb.append("<br>");
		sb.append("<p><input type='submit' value='更新'></p>");
		sb.append("</form>");
		
		return sb.toString();
	}
	
	protected String errorMessage() {return "";}

}