package jp.co.infonic.hfexplorer;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jp.co.infonic.hfexplorer.bean.FileDataFactory;
import jp.co.infonic.hfexplorer.bean.json.JsonArray;
import jp.co.infonic.hfexplorer.bean.json.JsonMap;
import jp.co.infonic.hfexplorer.bean.json.JsonString;
import jp.co.infonic.hfexplorer.upload.FileUploadParser;
import jp.co.infonic.hfexplorer.upload.UploadParam;
import jp.co.infonic.hfexplorer.upload.UploadResult;
import jp.co.infonic.hfexplorer.utility.PathConverter;


class UploadHandler extends ResponseProxy {

	UploadHandler(ServletContext context, HttpServletResponse response) {
		super(response);
	}
	
	// アクション起動パス
	public static final String ACTION_PATH = "/upload/";

	void response(HttpServletRequest request, String actionPath) throws IOException {
		
		JsonMap result = new JsonMap();
		try {

			String absolutePath = actionPath.substring(actionPath.indexOf(ACTION_PATH) + ACTION_PATH.length());
			logger.debug("<FileUpload> --target-- " + absolutePath);
			
			File target = PathConverter.getFile(absolutePath);
			if (target.exists() && publicCheck(absolutePath, result)) {
				FileUploadParser parser = new FileUploadParser();
				Map parameter = parser.parse(request);
				List list = (List) parameter.get(FileUploadParser.KEY_FILE_LIST);
				List errorList = new LinkedList();
				
				JsonArray success = new JsonArray();
				JsonArray error = new JsonArray();
				
				Iterator iter = list.iterator();
				while(iter.hasNext()) {
					UploadParam param = (UploadParam) iter.next();
					boolean result_flg = false;
	
					if (validate(target, param)) {
						result_flg = save(target, param);
					}
					
					
					if (result_flg) {
						File file = new File(target.getPath() + File.separator + param.getFileName());
						success.push(FileDataFactory.createFileData(file));
					} else {
						error.push(new JsonString(param.getFileName()));
						errorList.add(param);
					}
				}
				result.put("success", success);
			}
		} catch (Exception e) {
			logger.error(e);
			result.put("error", "エラーが発生しました。管理者に連絡してください。");
		}


		StringBuffer sb = new StringBuffer();
		sb.append("window.parent.iFrameReceiver.file_upload(");
		sb.append(result.toJSON());
		sb.append(")");
		IFrameResponse iframe = new IFrameResponse(response);
		iframe.responseContent(sb.toString());
		
		response.setHeader("Cache-Control", "no-cache");
		response.setCharacterEncoding("UTF-8");
		response.getOutputStream().println(new UploadResult().toHtml(result));
	}
	
	private boolean validate(File parentDirectory, UploadParam param) {
		if (!FileUploadParser.validateFileName(param.getFileName())) {
			return false;
		}
		
		return true;
	}
	
	public boolean save(File parentDirectory, UploadParam param) throws IOException {

		File newFile = new File(parentDirectory.getPath() + File.separator + param.getFileName());
		
		int seq = 1;
		
		String basename = parentDirectory.getPath() + "/" + param.getFileName();
		while(newFile.exists()) {
			newFile = new File(basename + "(" + (seq++) + ")");
		}
		param.setName(newFile.getName());
		
		// 一時領域に保存されたファイルを対象ディレクトリにリネーム
		if (!param.getFile().renameTo(newFile)) {

			// リネームできない時は直接ファイルをコピー
			logger.info("<FileUpload> --copy-- 'File' Class method 'renameto' was not available. carry out copy");
			return moveToFile(param.getFile(), newFile);
		}
		
		return true;
	}
	
	/**
	 * 
	 * 概要: Fileをコピーする<br>
	 * 詳細: Fileをコピーする<br>
	 * 備考: なし<br>
	 *
	 * @param from
	 * @param to
	 * @return 成功ならtrue 失敗ならfalse
	 * @throws IOException 
	 */
	private boolean moveToFile(File from, File to) throws IOException {
		BufferedInputStream bis = null;
		BufferedOutputStream bos = null;
		if (!from.exists()) {
			return false;
		}
		try {
			bis = new BufferedInputStream(new FileInputStream(from));
			bos = new BufferedOutputStream(new FileOutputStream(to));
			byte[] buffer = new byte[5120];
			int length = 0;
			while((length = bis.read(buffer)) != -1) {
				bos.write(buffer, 0, length);
			}
			
		} finally {
			if (bis != null) {
				try {
					bis.close();
				} catch (IOException ioe) {
					logger.error("<FileUpload> --error-- failed close", ioe);
				}
			}
			if (bos != null) {
				try {
					bos.close();
				} catch (IOException ioe) {
					logger.error("<FileUpload> -error failed close", ioe);
				}
			}
		}
		
		return to.exists();
		
	}
	
	private boolean publicCheck(String target, JsonMap result) {
		int num = count(new File(target.replaceAll("/.*$", "")));
		logger.debug("現在のファイル数:" + num);
		if (num < 100) {
			return true;
		} else {
			result.put("error", "これ以上アップロードできません。");
			return false;
		}
	}
	
	private int count(File f) {
		if (f.isDirectory()) {
			int num = 0;
			for(File c:f.listFiles()) num += count(c);
			return num;
		} else {
			return 1;
		}
	}

}
