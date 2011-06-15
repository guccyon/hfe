package jp.co.infonic.hfexplorer.exception;

import jp.co.infonic.hfexplorer.bean.json.JSON;
import jp.co.infonic.hfexplorer.bean.json.JsonString;

public class ValidateException extends Exception {
	
	private JSON message;
	private JSON param;
	
	public ValidateException() {
		
	}
	
	public ValidateException(String message) {
		this.message = new JsonString(message);
	}
	
	public ValidateException(JSON param) {
		this.param = param;
	}
	
	public ValidateException(String message, JSON param) {
		this(message);
		this.param = param;
	}

	public void setMessage(String message) {
		this.message = new JsonString(message);
	}
	
	public JSON getJson() {
		return message;
	}
	
	public JSON getParam() {
		return param;
	}
}
