package jp.co.infonic.hfexplorer.action;

import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;

import jp.co.infonic.hfexplorer.bean.json.JSON;
import jp.co.infonic.hfexplorer.exception.ValidateException;

public abstract class ActionHandler {
	
	private Map parameters = new HashMap();
	
	protected Logger logger = Logger.getLogger(this.getClass());
	
	void setParameter(String key, String value) {
		parameters.put(key, new String[]{value});
	}
	void setParameters(Map map) {
		parameters.putAll(map);
	}
	
	protected String getParameter(String key) {
		String[] params = getParameters(key);
		if (params != null && params.length > 0) {
			return params[0];
		}
		return null;
	}
	
	protected String[] getParameters(String key) {
		return (String[]) parameters.get(key);
	}
	
	abstract protected void validate() throws ValidateException ;

	abstract protected JSON execute();
}
