package jp.co.infonic.hfexplorer.utility;

abstract public class ScriptTag extends HtmlTag {

	@Override
	public String contents() {
		StringBuilder sb = new StringBuilder();
		sb.append("<script type='text/javascript'>");
		sb.append(contentStr());
		sb.append("</script>");
		return sb.toString();
	}
	
	abstract public String contentStr();
}
