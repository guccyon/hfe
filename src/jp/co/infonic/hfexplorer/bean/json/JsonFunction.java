package jp.co.infonic.hfexplorer.bean.json;

public class JsonFunction implements JSON {
	
	private String script;
	
	public JsonFunction(String script) {
		this.script = script;
	}

	public String toJSON() {
		return "function(){" + script + "}";
	}
}
