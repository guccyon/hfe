package jp.co.infonic.hfexplorer;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

public class IFrameResponse extends ResponseProxy {
	
	protected IFrameResponse(HttpServletResponse response) {
		super(response);
	}
	
	public void responseContent(String scriptStr) throws IOException{
		
		setHttpHeader();
		
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		
		baos.write(getHeader().getBytes(ResponseProxy.RESPONSE_TEXT_ENCODING));
		
		baos.write(scriptStr.getBytes(ResponseProxy.RESPONSE_TEXT_ENCODING));
		
		baos.write(getFooter().getBytes(ResponseProxy.RESPONSE_TEXT_ENCODING));
		
		ByteArrayInputStream bais = new ByteArrayInputStream(baos.toByteArray());
		
		super.responseContent(bais);
	}
	
	private void setHttpHeader() {

		response.setContentType("text/html");
		response.setHeader("Cache-Control", "no-cache");
		response.setCharacterEncoding("UTF-8");
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
	
	private static String getFooter() {
		StringBuffer sb = new StringBuffer();
		sb.append("</script>");
		sb.append("</head>");
		sb.append("</html>");
		
		return sb.toString();
	}
}
