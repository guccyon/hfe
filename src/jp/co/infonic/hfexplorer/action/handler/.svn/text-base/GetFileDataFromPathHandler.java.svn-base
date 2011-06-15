package jp.co.infonic.hfexplorer.action.handler;

import java.io.File;

import jp.co.infonic.hfexplorer.action.ActionHandler;
import jp.co.infonic.hfexplorer.bean.FileDataFactory;
import jp.co.infonic.hfexplorer.bean.json.JSON;
import jp.co.infonic.hfexplorer.bean.json.JsonArray;
import jp.co.infonic.hfexplorer.bean.json.JsonMap;
import jp.co.infonic.hfexplorer.exception.ValidateException;
import jp.co.infonic.hfexplorer.utility.PathConverter;

public class GetFileDataFromPathHandler extends ActionHandler {

	protected JSON execute() {
		
		JsonArray fileList = new JsonArray();

		String target = getParameter("TARGET_PATH");
		logger.debug("【GetFileDataFromPath】 " + target);
		
		String[] parents = target.split("/");
		
		String tmpPath = "";
		for (int i = 0; i < parents.length; i++) {
			if (!parents[i].equals("")) {

				tmpPath += "/" + parents[i];
				
				File file = PathConverter.getFile(tmpPath);
				
				fileList.push(FileDataFactory.createFileData(file));
			}
		}
		
		JsonMap result = new JsonMap();
		result.put("success", fileList);
		return result;
	}

	protected void validate() throws ValidateException {
		String target = getParameter("TARGET_PATH");
		if (target == null || !target.equals("/")) {
			File parent = PathConverter.getFile(target);
			if (!parent.exists()) {
				throw new ValidateException();
			}
		}
	}

}
