package jp.co.infonic.hfexplorer.upload;

import jp.co.infonic.hfexplorer.bean.json.JSON;


public class UploadResult {
	
	public String toHtml(JSON json) {
		return getHeader() + getScriptStr(json) + getFooter();
	}
	
	private static String getHeader() {
		StringBuffer sb = new StringBuffer();
		sb.append("<!DOCTYPE html PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\" \"http://www.w3.org/TR/html4/loose.dtd\">");
		sb.append("<html>");
		sb.append("<head>");
		sb.append("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">");
		sb.append("<title>HttpFileExplorer Upload Result</title>");
		sb.append("<script type=\"text/javascript\">");
		
		return sb.toString();
	}
	
	private static String getScriptStr(JSON json) {
		StringBuffer sb = new StringBuffer();
		sb.append("window.parent.iFrameReceiver.file_upload(");
		sb.append(json.toJSON());
		sb.append(")");
		
		return sb.toString();
	}
	
	private static String getFooter() {
		StringBuffer sb = new StringBuffer();
		sb.append("</script>");
		sb.append("</head>");
		sb.append("</html>");
		
		return sb.toString();
	}
}
