package jp.co.infonic.hfexplorer.action.handler;

import java.io.File;

import jp.co.infonic.hfexplorer.action.ActionHandler;
import jp.co.infonic.hfexplorer.bean.json.JSON;
import jp.co.infonic.hfexplorer.bean.json.JsonArray;
import jp.co.infonic.hfexplorer.bean.json.JsonBoolan;
import jp.co.infonic.hfexplorer.bean.json.JsonMap;
import jp.co.infonic.hfexplorer.bean.json.JsonString;
import jp.co.infonic.hfexplorer.exception.ValidateException;
import jp.co.infonic.hfexplorer.utility.PathConverter;

public class DeleteHandler extends ActionHandler {

	protected void validate() throws ValidateException {
		
		String target = getParameter("TARGET_PATH");
		if (target == null || !target.equals("/")) {
			File parent = PathConverter.getFile(target);
			if (!parent.exists()) {
				JsonMap json = new JsonMap();
				json.put("lost_target", target);
				throw new ValidateException("現在のフォルダが削除された可能性があります。", json);
			}
		}
		
		String files = getParameter("FILES");
		if (files == null || files.length() == 0) {
			throw new ValidateException("削除するファイルリストが取得できませんでした。");
		}

	}

	protected JSON execute() {

		String target = getParameter("TARGET_PATH");
		
		File parent = PathConverter.getFile(target);
		
		String[] targetFiles = getParameter("FILES").split(",");
		
		JsonArray notFound = new JsonArray();
		JsonArray failure = new JsonArray();
		for (int i = 0; i < targetFiles.length; i++) {
			
			File file = new File(parent.getPath() + "/" + targetFiles[i]);
			if (!file.exists()) {
				notFound.push(new JsonString(file.getName()));
			} else if (!delete(file)) {
				failure.push(new JsonString(file.getName()));
			}
		}
		
		JsonMap result = new JsonMap();
		if (notFound.length() > 0) {
			result.put("files", notFound);
			result.put("error_msg", "ファイルが見つかりません。既に削除または移動された可能性があります。");
			result.put("failure", new JsonBoolan(true));
		}
		
		if (failure.length() > 0) {
			result.put("files", failure);
			result.put("error_msg", "ファイルの削除に失敗しました。");
			result.put("failure", new JsonBoolan(true));
		}
		
		return result;
	}

	
	private boolean delete(File file) {
		if (!file.isDirectory()) {
			return file.delete();
		}
		boolean result = true;

		File[] fileList = file.listFiles();
		for (int i = 0; i < fileList.length; i++) {
			delete(fileList[i]);
		}
		if (!file.delete()) {
			result = false;
		}

		return result;
	}
}
