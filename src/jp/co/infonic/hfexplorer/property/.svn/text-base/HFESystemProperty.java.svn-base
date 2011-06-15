package jp.co.infonic.hfexplorer.property;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import jp.co.infonic.hfexplorer.db.Query;

public class HFESystemProperty {
	
	private static Map property = new HashMap();
	
	public static void setProperty(String key, String value) {
		property.put(key, value);
	}

	public static String getProperty(String key) {
		String value = (String) property.get(key);
		if (value == null) {
			try {
				Query query = new Query("GetSystemProperty", new Object[]{key});
				Map record = query.getResultOne();
				if (record != null) {
					property.put(key, record.get("VALUE"));
				}
				value = (String) property.get(key);
			} catch (SQLException e) {	}
		}
		
		return value;
	}
	
	public static String getProperty(String key, String defaultValue) {
		if (property.get(key) != null) return (String) property.get(key);
		
		return defaultValue;
	}
	
	public static String getWorkDirectory() {
		return getProperty("fileupload.tmpdir");
	}
	
	public static long getUploadLimitByte() {
		String limit = getProperty("fileupload.limit.size");
		try {
		return limit != null ? Long.parseLong(limit) : 640L;
		} catch (Exception e) { return  640L;}
	}
	
	public static String getDatabaseStore() {
		return getProperty("database.store");
	}
	
	public static void removeProperty(String key) {
		property.remove(key);
	}
}
