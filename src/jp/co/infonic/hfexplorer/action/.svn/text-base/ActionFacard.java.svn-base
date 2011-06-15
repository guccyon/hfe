package jp.co.infonic.hfexplorer.action;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import jp.co.infonic.hfexplorer.bean.json.JSON;
import jp.co.infonic.hfexplorer.bean.json.JsonBoolan;
import jp.co.infonic.hfexplorer.bean.json.JsonMap;
import jp.co.infonic.hfexplorer.exception.ValidateException;

public class ActionFacard {
	
	private Logger logger = Logger.getLogger(this.getClass());
	
	private static final String HANDLER_PKG = "jp.co.infonic.hfexplorer.action.handler";
	
	private HttpServletRequest request;
	private HttpServletResponse response;
	
	private static int action_sequence = 0;
	
	public ActionFacard(HttpServletRequest request, HttpServletResponse response) {
		this.request = request;
		this.response = response;
	}
	
	private synchronized int getActionSequence() {
		int result = action_sequence++;
		if (result > 100000) {
			action_sequence = 0;
		}
		return result;
	}
	
	public void execute(String actionPath) {
		int action_id = getActionSequence();
		logger.debug("<Action> [id:" + action_id +"] start");

		while(actionPath.startsWith("/")) {
			actionPath = actionPath.substring(1);
		}
		
		ActionHandler action = getActionHandler(actionPath, action_id);
		if (action == null) {
			logger.warn("<Action> [id:" + action_id +"] Unknown action!!");
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return;
		}
		logger.warn("<Action> [id:" + action_id +"] Action Class:" + action.getClass().getName());
		
		try {
			if (actionPath.indexOf("/") != -1) {
				action.setParameter("TARGET_PATH", actionPath.substring(actionPath.indexOf("/")));
			}
			//setCommonParameter(request, action);
			action.setParameters(request.getParameterMap());
			
			// 入力チェック
			action.validate();
		
			// 処理実行
			JSON result = action.execute();
			
			handleResponse(response, result,action_id);
			
		} catch (ValidateException unvalid) {
			logger.warn("<Action> [id:" + action_id +"] Valid Error");
			JsonMap error = new JsonMap();
			error.put("failure", new JsonBoolan(true));
			
			if (unvalid.getJson() != null) {
				error.put("error_msg", unvalid.getJson());
			}
			if (unvalid.getParam() != null) {
				error.put("error_param", unvalid.getParam());
			}
			handleResponse(response, error,action_id);
		}
	}
	
	private ActionHandler getActionHandler(String actionPath, int action_id) {
		try {
			
			String actionName = actionPath;
			if (actionPath.indexOf("/") != -1) {
				actionName = actionPath.substring(0, actionPath.indexOf("/"));
			}
			Class cla = Class.forName(HANDLER_PKG + "." + camelize(actionName) + "Handler");
			Object obj = cla.newInstance();
			logger.debug("<Action> [id:" + action_id +"] ActionClass --> " + actionName);
			return (ActionHandler) obj;
			
		} catch (Exception e) {
			return null;
		}
	}
	
	private String camelize(String value) {
		String[] token = value.split("_");
		if (token.length == 1) return token[0];
		
		String result = "";
		for (int i = 0; i < token.length; i++) {
			if (token[i].length() > 1) {
				result += token[i].toUpperCase() + token[i].substring(1);
			} else {
				result += token[i];
			}
		}
		
		return result;
	}
	
	private void setCommonParameter(HttpServletRequest request, ActionHandler action) {

		String uri = request.getRequestURI();
		String url  = request.getRequestURL().toString();
		String servPath = request.getServletPath();
		String reAdd = request.getRemoteAddr();
		String pathinfo = request.getPathInfo();
		String transpath = request.getPathTranslated();
	}
	
	private void handleResponse(HttpServletResponse response, JSON json, int action_id) {

		logger.debug("<Action> [id:" + action_id +"] response");
		try {
			responseJson(response, json);
			
			
		} catch (IOException ioe) {
			
			JsonMap error = new JsonMap();
			error.put("server_error", "システムエラーが発生しました。");
			try {
				responseJson(response, error);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	private void responseJson(HttpServletResponse response, JSON json) throws IOException {
		
			response.setHeader("Cache-Control", "no-cache");
			response.setContentType("text/javascript;charset=UTF-8");
			
			PrintWriter pw = response.getWriter();
			pw.write(json.toJSON());
			
	}
}
