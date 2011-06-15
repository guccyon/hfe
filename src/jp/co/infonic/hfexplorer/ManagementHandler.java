package jp.co.infonic.hfexplorer;

import java.io.IOException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jp.co.infonic.hfexplorer.manage.ManageAuthError;
import jp.co.infonic.hfexplorer.manage.ManageCheckAuth;
import jp.co.infonic.hfexplorer.manage.ManageCommon;
import jp.co.infonic.hfexplorer.manage.ManageTopMenu;

public class ManagementHandler extends ResponseProxy {

	// アクション起動パス
	public static final String ACTION_PATH = "/manage";

	ManagementHandler(ServletContext context, HttpServletResponse response) {
		super(response);
	}

	// メイン処理
	void service(HttpServletRequest request) {
		String commandPath = request.getPathInfo().replaceFirst("/manage", "");

		try {

			ManageCommon component;

			if (!new ManageCheckAuth().check(request, commandPath)) {
				component = new ManageAuthError();
			} else if (commandPath.equals("")) {
				
				response.sendRedirect("manage/top_menu");
				return;
			} else {

				component = parseAction(commandPath);

				component.execute(request);
			}

			component.setResponseHeader(response);

			responseContent(component.getResponseStr());
			
		} catch (Exception e) {
			logger.error(e);
			try {
				responseContent("エラーが発生しました。");
			} catch (IOException e1) {
				e1.printStackTrace();
			}
			response.setStatus(HttpServletResponse.SC_SERVICE_UNAVAILABLE);
		}
	}

	private static final String MANAGE_ACTION_PKG = "jp.co.infonic.hfexplorer.manage.Manage";

	// アクションパスを解析
	private ManageCommon parseAction(String commandPath) {
		ManageCommon component = null;

		try {
			String className = camerize(commandPath);
			if (!className.equals("")) {
				Class clazz = Class.forName(MANAGE_ACTION_PKG + className);
				component = (ManageCommon) clazz.newInstance();
			}

		} catch (ClassNotFoundException e) {
			logger.warn(e);
		} catch (InstantiationException e) {
			logger.warn(e);
		} catch (IllegalAccessException e) {
			logger.warn(e);
		}

		if (component == null) {
			component = new ManageTopMenu();
		}

		return component;
	}

	private String camerize(String commandPath) {
		String str = commandPath.replaceFirst("^/", "");
		String[] tmp = commandPath.replaceFirst("^/", "").split("_");

		String result = "";
		for (int i = 0; i < tmp.length; i++) {
			if (tmp[i].length() > 1) {
				result += tmp[i].substring(0, 1).toUpperCase() + tmp[i].substring(1);
			} else {
				result += tmp[i].toUpperCase();
			}
		}
		return result;
	}
}
