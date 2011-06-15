package jp.co.infonic.hfexplorer.manage;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class ManageAuthError extends ManageCommon {
	
	private static final String HTML_SRC = "/auth_error.html";
	
	public void setResponseHeader(HttpServletResponse response) {
		response.setHeader("Cache-Control", "no-cache");
		response.setContentType("text/html;charset=UTF-8");
	}

	public String getResponseStr() {

		return readFile(HTML_SRC);
	}

	public void execute(HttpServletRequest request) {}
}
