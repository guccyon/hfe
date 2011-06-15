package jp.co.infonic.hfexplorer;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jp.co.infonic.hfexplorer.utility.PathConverter;
import jp.co.infonic.hfexplorer.utility.ZipFileCompressor;

class DownLoadHandler extends ResponseProxy{

	private ServletContext context;
	DownLoadHandler(ServletContext context, HttpServletResponse response) {
		super(response);
		this.context = context ;
	}
	
	// アクション起動パス
	public static final String ACTION_PATH = "/download/";
	
	void response(HttpServletRequest request, String actionPath) throws IOException {
		
		String absolutePath = actionPath.substring(actionPath.indexOf(ACTION_PATH) + ACTION_PATH.length());
		
		logger.info("<FileDownLoad> " + absolutePath);
		
		File file = PathConverter.getFile(absolutePath);
		if (file.exists()) {
			boolean compress = false;
			// 対象がディレクトリ又は圧縮ダウンロードモードならZIP圧縮を行う
			if (file.isDirectory()|| request.getParameter("withZip") != null) {
				file = new ZipFileCompressor(file).toZip();
				compress = true;
			}
			
			setHeader(request, file);
			
			if (file.exists()) {
				responseContent(new FileInputStream(file));
			} else {
				logger.info("<FileDownLoad> Not Found File");
				// TODO エラーメッセージ出力
				
			}
			
			if (compress) {
				file.delete();
			}
		} else {
			StringBuffer sb = new StringBuffer();
			sb.append("window.parent.iFrameReceiver.file_download_error(");
			sb.append("'" + absolutePath + "'");
			sb.append(")");
			IFrameResponse iframe = new IFrameResponse(response);
			iframe.responseContent(sb.toString());
		}
	}
	
	private void setHeader(HttpServletRequest request, File file) throws UnsupportedEncodingException {
		
		String contentType = context.getMimeType(file.getName());
		if (contentType == null || contentType.equals("")) {
			contentType = "application/octet-stream;";
		}
		response.setContentType(contentType);
		
		String encFileName = URLEncoder.encode(file.getName(), "UTF-8");
		
		// InternetExplorerの場合
		if (request.getHeader("User-Agent").indexOf("MSIE") != -1) {
			response.setHeader("Content-Disposition", "attachment; filename=" + encFileName);
		} else {
			response.setHeader("Content-Disposition", "attachment; filename*=" + encFileName);
		}
	}
}
