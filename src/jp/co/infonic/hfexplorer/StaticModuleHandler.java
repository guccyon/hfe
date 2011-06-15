package jp.co.infonic.hfexplorer;

import java.io.IOException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletResponse;

class StaticModuleHandler extends ResponseProxy{
	
	private ServletContext context;
	
	StaticModuleHandler(ServletContext context, HttpServletResponse response) {
		super(response);
		this.context = context;
	}
	
	void response(String path) throws IOException {
		ClassLoader cl = this.getClass().getClassLoader();
		path = path.replaceFirst("/", "hfexplorer/");
        
		if (responseContent(cl.getResourceAsStream(path)) != -1) {
	        String contentType = context.getMimeType(path);
	        if (contentType != null) {
	            response.setContentType(contentType);
	        } else {
	        	response.setContentType("text/html");
	        }
		}
	}
}
