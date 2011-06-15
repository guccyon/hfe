package jp.co.infonic.hfexplorer;

import java.io.IOException;
import java.io.OutputStream;
import java.util.regex.Pattern;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jp.co.infonic.hfexplorer.action.ActionFacard;

import org.apache.commons.fileupload.DiskFileUpload;
import org.apache.log4j.Logger;

/**
 * Servlet implementation class for Servlet: HttpFileExplorerServlet
 *
 */
 public class HttpFileExplorerServlet extends javax.servlet.http.HttpServlet implements javax.servlet.Servlet {
	 
	 private Logger logger = Logger.getLogger(this.getClass());
	
	/* (non-Java-doc)
	 * @see javax.servlet.http.HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}
	
	/* (non-Java-doc)
	 * @see javax.servlet.http.HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		request.setCharacterEncoding("UTF-8");
		
		String actionPath = request.getPathInfo();
		if (actionPath == null || actionPath.equals("/")) {
			logger.debug("/index.htmlにリダイレクトします。");
			response.sendRedirect("index.html");
			return;
		}
		// パス中に含まれる日本語を処理
		actionPath = new String(actionPath.getBytes("iso-8859-1"), "UTF-8");
		actionPath = safeDirectoryTravarsal(actionPath);
		// 静的ファイルの転送（javascript, css, html, image）
		if (isMatcheStaticPath(actionPath)) {
			if (actionPath.matches("^/javascript/.*property.js$")) {
				OutputStream os = response.getOutputStream();
				String applicationPath = request.getContextPath() + request.getServletPath();
				String str = "\r\n window.ServletPath='" + applicationPath + "';local_debug = false;";
				os.write(str.getBytes());
	            os.flush(); os.close();
			} else {
				StaticModuleHandler loader = new StaticModuleHandler(getServletContext(), response);
				loader.response(actionPath);
			}
		// ファイルのダウンロード
		} else if(actionPath.matches(DownLoadHandler.ACTION_PATH + ".*")) {
			logger.debug("[ActionPath - Download] " + actionPath);
			DownLoadHandler handler = new DownLoadHandler(getServletContext(), response);
			handler.response(request, actionPath);

		// ファイルのアップロード
		} else if (actionPath.matches(UploadHandler.ACTION_PATH + ".*") && DiskFileUpload.isMultipartContent(request)){
			logger.debug("[ActionPath - Upload] " + actionPath);
			UploadHandler upload = new UploadHandler(getServletContext(), response);
			upload.response(request, actionPath);
			
		// 管理コンソール
		} else if (actionPath.matches(ManagementHandler.ACTION_PATH + ".*")){
			logger.debug("[ActionPath - Management] " + actionPath);
			ManagementHandler manage = new ManagementHandler(getServletContext(), response);
			manage.service(request);
			
		// 通常アクション
		} else {
			logger.debug("[ActionPath] " + actionPath);
			ActionFacard facard = new ActionFacard(request, response);
			facard.execute(actionPath);
		}
	}

	// 上位ディレクトリ相対パス ⇒ ../  , ./
	// ピリオドの後は拡張子のみ認める
	private static String directory_travarsal = "\\.{1,2}[^a-zA-Z.]";
	
	// ディレクトリトラバーサル対策
	public static String safeDirectoryTravarsal(String actionPath) {
		Pattern pat = Pattern.compile(directory_travarsal);
		while(pat.matcher(actionPath).find()) {
			actionPath = actionPath.replaceAll(directory_travarsal, "");
		}
		
		return actionPath;
	}
	
	// js,css,image,htmlの要求パス
	private static String[] staticPathRexp = {
		 "^/image/.*[.gif|.jpg]$"
		,"^/javascript/.*\\.js$"
		,"^/css/.*\\.css$"
		,"^(?!/download/).*\\.html$"
		,"^/javascript/.*\\.jpg$"
		,"^/javascript/.*\\.gif$"};
	
	// js,css,image,htmlの要求パスであるか判断する
	private boolean isMatcheStaticPath(String actionPath) {
		for (int i = 0; i < staticPathRexp.length; i++) {
			if (actionPath.matches(staticPathRexp[i])) {
				return true;
			}
		}
		return false;
	}
}