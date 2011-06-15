package jp.co.infonic.hfexplorer;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

public class ResponseProxy {
	
	public static String RESPONSE_TEXT_ENCODING = "UTF-8";
	
	protected HttpServletResponse response;
	
	protected Logger logger = Logger.getLogger(this.getClass());
	
	protected ResponseProxy(HttpServletResponse response) {
		this.response = response;
	}
	
	protected int responseContent(InputStream is) throws IOException {

		if (is == null) {
            // ファイルが存在しない場合は404をセット
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return -1;
		}
		
		BufferedInputStream bis = null;
		
		int sum = 0;
		try {
			bis = new BufferedInputStream(is);
			BufferedOutputStream bos = new BufferedOutputStream(response.getOutputStream());
			
			byte[] buffer = new byte[256];
			int length = 0;
			while((length = bis.read(buffer)) != -1) {
				bos.write(buffer, 0, length);
				sum += length;
			}
			
            response.setContentLength(sum);
            
            bos.flush();
            
            try { bos.close(); } catch(IOException e){}
		} finally {
			if (bis != null) {
				bis.close();
			}
		}
		
		return sum;
	}
	
	protected void responseContent(String value) throws IOException {

		if (value == null) {
            // ファイルが存在しない場合は404をセット
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
		}
		
		response.setContentLength(value.getBytes("UTF-8").length);
		PrintWriter pw = response.getWriter();
		pw.print(value);
		
		pw.flush();
	}
 }
