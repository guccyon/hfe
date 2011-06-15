package jp.co.infonic.hfexplorer.bean.json;

import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

public class JsonArray implements JSON {
	private List list;
	
	public JsonArray() {
		list = new LinkedList();
	}
	
	public void push(JSON object) {
		list.add(object);
	}
	
	public void add(JSON object) {
		list.add(object);
	}
	
	public int length() {
		return list.size();
	}

	public String toJSON() {
		Iterator iter = list.iterator();
		StringBuffer result = new StringBuffer();
		while(iter.hasNext()) {
			JSON obj = (JSON)iter.next();
			result.append(obj.toJSON()).append(",");
		}
		if (result.length() > 0) {
			return "[" + result.substring(0, result.length()-1) + "]";
		} else {
			return "[]";
		}
	}
	
	public String toString() {
		return this.toJSON();
	}
}
