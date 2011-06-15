package jp.co.infonic.hfexplorer.action.handler;

import java.io.File;

import jp.co.infonic.hfexplorer.action.ActionHandler;
import jp.co.infonic.hfexplorer.bean.FileDataFactory;
import jp.co.infonic.hfexplorer.bean.json.JSON;
import jp.co.infonic.hfexplorer.bean.json.JsonMap;
import jp.co.infonic.hfexplorer.exception.ValidateException;
import jp.co.infonic.hfexplorer.utility.FileNameValidater;
import jp.co.infonic.hfexplorer.utility.PathConverter;

public class RenameHandler extends ActionHandler {

	protected void validate() throws ValidateException {
		String target = getParameter("TARGET_PATH");
		if (target == null || !target.equals("/")) {
			File parent = PathConverter.getFile(target);
			if (!parent.exists()) {
				throw new ValidateException("対象ファイルが既に削除された可能性があります。");
			}
		}
		
		String toName = getParameter("TO_NAME");
		if (toName == null) {
			throw new ValidateException();
		}
		
		FileNameValidater.validateFileName(toName);
	}

	protected JSON execute() {

		String toName = getParameter("TO_NAME");

		String targetPath = getParameter("TARGET_PATH");
		File target = PathConverter.getFile(targetPath);
		
		logger.debug("【Rename】" + targetPath + " > " + toName + " へ変更");
		
		JsonMap result = new JsonMap();
		if (target.renameTo(new File(target.getParent() + "/" + toName))) {
			result.put("success", FileDataFactory.createFileData(target));
		}

		return result;
	}
}
