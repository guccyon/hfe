package jp.co.infonic.hfexplorer.manage;

import java.io.File;
import java.util.LinkedList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jp.co.infonic.hfexplorer.db.Query;
import jp.co.infonic.hfexplorer.property.HFESystemProperty;

public class ManageUpdateFileUpload extends ManageFileUpload {
	
	private String error;

	public void execute(HttpServletRequest request) throws Exception {
		
		super.tmpdirStr = request.getParameter("tmpdir");
		super.limitStr = request.getParameter("limit");
		
		
		error = checkParam(super.tmpdirStr, super.limitStr);
		
		if (error == null) {
			super.limitStr = Integer.parseInt(super.limitStr) + "";
			
			List params = new LinkedList();
			params.add(ManageFileUpload.KEY_TMP_DIR);
			new Query("DeleteSystemProperty", params);
			params.add(super.tmpdirStr);
			new Query("InsertSystemProperty", params);
			HFESystemProperty.removeProperty(ManageFileUpload.KEY_TMP_DIR);

			params = new LinkedList();
			params.add(ManageFileUpload.KEY_LIMIT_SIZE);
			new Query("DeleteSystemProperty", params);
			params.add(super.limitStr);
			new Query("InsertSystemProperty", params);
			HFESystemProperty.removeProperty(ManageFileUpload.KEY_LIMIT_SIZE);
		}
	}
	
	private String checkParam(String tmpdir, String limit) {
		
		if (tmpdir == null || tmpdir.equals("")) {
			return "一時ディレクトリは必ず指定してください。";
		} else {
			File file = new File(tmpdir);
			if (!file.exists()) {
				return "存在しないディレクトリを一時ディレクトリに指定できません。";
			}
			if (!file.canWrite()) {
				return "書き込めないディレクトリを一時ディレクトリに指定できません。";
			}
		}
		
		if (limit == null || limit.equals("")) {
			return "リミットサイズは必ず指定してください。";
			
		} else {
			try {
				Integer.parseInt(limit);
				
			} catch (NumberFormatException nfe) {
				return "リミットサイズは数値で指定する必要があります。";
			}
			
		}
		
		return null;
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
