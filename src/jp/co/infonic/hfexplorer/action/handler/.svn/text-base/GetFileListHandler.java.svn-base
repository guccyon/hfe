package jp.co.infonic.hfexplorer.action.handler;

import java.io.File;

import jp.co.infonic.hfexplorer.action.ActionHandler;
import jp.co.infonic.hfexplorer.bean.FileDataFactory;
import jp.co.infonic.hfexplorer.bean.json.JSON;
import jp.co.infonic.hfexplorer.bean.json.JsonArray;
import jp.co.infonic.hfexplorer.db.PublicDirectory;
import jp.co.infonic.hfexplorer.exception.ValidateException;
import jp.co.infonic.hfexplorer.utility.PathConverter;

public class GetFileListHandler extends ActionHandler {

	protected void validate() throws ValidateException {
		
		String target = getParameter("TARGET_PATH");
		if (target == null || !target.equals("/")) {
			File parent = PathConverter.getFile(target);
			if (!parent.exists()) {
				throw new ValidateException("対象のディレクトリが削除された可能性があります。");
			}
		}
	}

	protected JSON execute() {
		JsonArray result = new JsonArray();

		String target = getParameter("TARGET_PATH");
		logger.debug("【GetFileList】 " + target);
		
		File[] children = target.equals("/") ?
				PublicDirectory.getPublicDirectories() : PathConverter.getFile(target).listFiles();
		
		logger.debug("【GetFileList】 found " + children.length + " Files or Directories");
		for(int i = 0; i < children.length; i++) {
			File child = children[i];
			
			result.push(FileDataFactory.createFileData(child));
		}
		
		return result;
	}
}
