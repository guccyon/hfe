package jp.co.infonic.hfexplorer.manage;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

public abstract class ManageCommon {
	
	protected static final String HTML_COMMON_HEADER = "common_header.html";
	protected static final String HTML_COMMON_FOOTER = "common_footer.html";
	
	protected Logger logger = Logger.getLogger(this.getClass());
	
	protected String readFile(String path) {
		path = "manage/" + path;
		ClassLoader cl = this.getClass().getClassLoader();
		
		BufferedReader br = null;
		try {
			br = new BufferedReader(new InputStreamReader(cl.getResourceAsStream(path), "UTF-8"));
			StringBuffer sb = new StringBuffer();
			String line;

			while((line=br.readLine()) != null) {
				sb.append(line);
			}
			
			return sb.toString();
			
		} catch (IOException e) {
			logger.error(e);
		} finally {
			if (br != null) {
				try {
					br.close();
				} catch (IOException e) {}
			}
		}
		
		return "";
	}
	
	abstract public void execute(HttpServletRequest request) throws Exception;
	abstract public void setResponseHeader(HttpServletResponse response);
	abstract public String getResponseStr();
}
