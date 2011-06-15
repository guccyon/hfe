package jp.co.infonic.hfexplorer.manage;

import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jp.co.infonic.hfexplorer.db.Query;
import jp.co.infonic.hfexplorer.property.HFESystemProperty;

public class ManageUpdateSecurity extends ManageSecurity {
	
	private String error;

	public void execute(HttpServletRequest request) throws Exception {
		
		super.denyAddr = request.getParameter("deny");
		super.allowAddr = request.getParameter("allow");
		
		Set denyAry = denyAddr != null ? splitParams(denyAddr) : new HashSet();
		Set allowAry = allowAddr != null ? splitParams(allowAddr) : new HashSet();
		
		allowAry.add(ManageSecurity.DEFAULT_ALLOW_ADDR);
		
		error = checkParam(denyAry, allowAry);
		
		super.denyAddr = aryJoin(denyAry);
		super.allowAddr = aryJoin(allowAry);
		if (error == null) {
			
			List params = new LinkedList();
			params.add(ManageSecurity.KEY_DENY);
			new Query("DeleteSystemProperty", params);
			params.add(super.denyAddr);
			new Query("InsertSystemProperty", params);
			HFESystemProperty.removeProperty(ManageSecurity.KEY_DENY);

			params = new LinkedList();
			params.add(ManageSecurity.KEY_ALLOW);
			new Query("DeleteSystemProperty", params);
			params.add(super.allowAddr);
			new Query("InsertSystemProperty", params);
			HFESystemProperty.removeProperty(ManageSecurity.KEY_ALLOW);
		}
	}
	
	private String checkParam(Set denyAry, Set allowAry) {
		
		
		if (allowAry.size() > 0 && denyAry.size() == 0) {
			return "拒否リストが空の場合、許可リストを設定することはできません。";
		}
		
		if (denyAry.contains("127.0.0.1")) {
			return "拒否リストにローカルアドレスを含める事はできません。";
		}
		
		Pattern pat = Pattern.compile("(\\d{1,3}\\.){3}\\d{1,3}");
		
		Iterator iter = denyAry.iterator();
		while(iter.hasNext()) {
			String addr = iter.next().toString();
			if (!addr.matches("(\\d\\.(1,3))(3)[\\d](1,3)") && !addr.equals("localhost") && !addr.equals("all")) {
				return "アドレスの値が不正です。";
			}
		}
		return null;
	}
	
	private String aryJoin(Set list) {
		Iterator iter = list.iterator();
		String result = "";
		while(iter.hasNext()) {
			result += iter.next().toString();
			if (iter.hasNext()) result += ",";
		}
		return result;
	}
	
	private Set splitParams(String value) {
		String[] values = value.split(",");
		Set result = new HashSet();
		for (int i = 0; i < values.length; i++) {
			result.add(values[i]);
		}
		return result;
	}

	public String getResponseStr() {
		if (error != null) {
			return super.getResponseStr();
			
		} else {
			return readFile(HTML_COMMON_HEADER) + readFile(HTML_COMMON_FOOTER);
		}
	}

	public void setResponseHeader(HttpServletResponse response) {
		response.setHeader("Cache-Control", "no-cache");
		response.setContentType("text/html;charset=UTF-8");
	}
	protected String errorMessage() {
		if (error != null) {
			return "<div class='error_msg'>" + error + "</div>";
		}
		
		return "";
	}

}
