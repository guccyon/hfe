package jp.co.infonic.hfexplorer.bean;

import java.text.SimpleDateFormat;
import java.util.Date;

import jp.co.infonic.hfexplorer.bean.json.JSON;
import jp.co.infonic.hfexplorer.bean.json.JsonBoolan;
import jp.co.infonic.hfexplorer.bean.json.JsonMap;
import jp.co.infonic.hfexplorer.bean.json.JsonNumber;
import jp.co.infonic.hfexplorer.bean.json.JsonString;


public class FileData implements JSON{
	
	private JsonMap map;
	
	public FileData() {
		map = new JsonMap();
		
	}
	
	public void setFileName(String fileName) {
		map.put("name", new JsonString(fileName));
	}
	
	public void setSize(long size) {
		map.put("size", new JsonNumber(size));
	}
	
	public void setCreateDate(long lastModified) {
		SimpleDateFormat sdf = new SimpleDateFormat();
		map.put("create_date", sdf.format(new Date(lastModified)));
	}
	
	private static String[] AUTH_TYPE = {"read", "write", "delete"};
	
	public void setAuth(boolean read, boolean write, boolean delete) {
		JsonMap auth = (JsonMap) map.get("auth");
		if (auth == null) {
			auth = new JsonMap();
			map.put("auth", auth);
		}
		
		boolean[] arg = {read, write, delete};
		
		for (int i = 0; i < AUTH_TYPE.length; i++) {
			JsonBoolan bol = (JsonBoolan) auth.get(AUTH_TYPE[i]);
			if (bol == null) {
				bol = new JsonBoolan(arg[i]);
			} else {
				bol = new JsonBoolan(bol.getValue() || arg[i]);
			}
			auth.put(AUTH_TYPE[i], bol);
		}
	}
	
	public void setType(String str) {
		map.put("type", str);
	}

	public String toJSON() {
		return map.toJSON();
	}
}
