package jp.co.infonic.hfexplorer.action.handler;

import java.io.File;

import jp.co.infonic.hfexplorer.action.ActionHandler;
import jp.co.infonic.hfexplorer.bean.FileDataFactory;
import jp.co.infonic.hfexplorer.bean.json.JSON;
import jp.co.infonic.hfexplorer.bean.json.JsonBoolan;
import jp.co.infonic.hfexplorer.bean.json.JsonMap;
import jp.co.infonic.hfexplorer.exception.ValidateException;
import jp.co.infonic.hfexplorer.upload.FileUploadParser;
import jp.co.infonic.hfexplorer.utility.PathConverter;

public class MakeDirectoryHandler extends ActionHandler {

	protected void validate() throws ValidateException {
		
		String newDirectory = getParameter("NEW_DIRECTORY");
		if (newDirectory == null) {
			throw new ValidateException();
		} else if (newDirectory.getBytes().length > 126) {
			throw new ValidateException("ファイル名が長すぎます。126バイト以内で指定してください。");
		} else if (!FileUploadParser.validateFileName(newDirectory)) {
			throw new ValidateException("ファイル名に使えない文字が含まれています。");
		} else if (newDirectory.matches("^[ ]+$")) {
			throw new ValidateException("ファイル名に半角スペースのみを指定する事はできません。");
		}
		
		String target = getParameter("TARGET_PATH");
		if (target == null || !target.equals("/")) {
			File parent = PathConverter.getFile(target);
			if (!parent.exists()) {
				JsonMap json = new JsonMap();
				json.put("lost_target", target);
				throw new ValidateException("現在のディレクトリが削除または移動した可能性があります。", json);
			}
			
			if (new File(parent.getPath() + "/" + newDirectory).exists()) {
				throw new ValidateException("同名のファイルまたはディレクトリが存在する為、作成できません。");
			}
		}
	}

	protected JSON execute() {

		String target = getParameter("TARGET_PATH");
		File parent = PathConverter.getFile(target);
		
		String newDirectory = getParameter("NEW_DIRECTORY");
		File directory = new File(parent.getPath() + "/" + newDirectory);
		
		logger.debug("【MakeDirectory】" + target + "/" + newDirectory + " を作成します。");
		
		JsonMap result = new JsonMap();
		if (directory.mkdir()) {
			result.put("success", FileDataFactory.createFileData(directory));
		} else {
			result.put("failure", new JsonBoolan(true));
			result.put("error_msg", "書き込み権限がない可能性があります。");
		}
		
		return result;
	}

}
