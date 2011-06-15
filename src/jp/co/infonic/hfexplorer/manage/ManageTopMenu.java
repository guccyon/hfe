package jp.co.infonic.hfexplorer.manage;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class ManageTopMenu extends ManageCommon {
	
	private static final String HTML_SRC = "index.html";

	public void execute(HttpServletRequest request) {
		
	}

	public String getResponseStr() {
		return readFile(HTML_SRC);
	}

	public void setResponseHeader(HttpServletResponse response) {
		response.setHeader("Cache-Control", "no-cache");
		response.setContentType("text/html;charset=UTF-8");
	}

}
