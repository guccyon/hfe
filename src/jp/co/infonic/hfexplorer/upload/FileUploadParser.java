package jp.co.infonic.hfexplorer.upload;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import jp.co.infonic.hfexplorer.property.HFESystemProperty;

import org.apache.commons.fileupload.DiskFileUpload;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;

/**
 * 
 * 概要：ファイルアップロード時のリクエスト解析クラス<br>
 * 詳細：ファイルアップロード時のリクエスト解析クラス<br>
 *<pre>
 * [変更履歴]
 * 日付        連番   内容
 * --------------------------------------------------
 * 2006/03/11  VL000  新規
 *</pre>
 * @author 樋口
 * @since 2006/03/11
 */
public class FileUploadParser {
	
	public static final String CHARSET = "UTF-8";

	// ファイル名として利用できない記号、特殊文字
	public static final String CANNOT_USE_CHAR = "/\\:;,*?\"<>|";
	
	public static final String KEY_FILE_LIST = "UPLOAD_FILE_LIST";

    /**
     * 概要: マルチパート形式で送信されたリクエストを解析し、リクエストパラメータを取得する。<br>
     * 詳細: マルチパート形式で送信されたリクエストを解析し、リクエストパラメータを取得する。<br>
     *       対象がファイルの場合、一時作業域にファイルを保存し、そのファイルへのフルパスを<br>
     *       パラメータ値として、戻す。<br>
     * 備考: なし<br>
     * @param request
     * @return
     * @throws Exception 
     * @throws Exception 
     * @throws  
     * @since 2006/03/02
     */
    public Map parse(HttpServletRequest request) {
    	
        String workDirStr = HFESystemProperty.getWorkDirectory();
        if (workDirStr == null) {
			throw new RuntimeException("作業ディレクトリが取得できません。");
        }
        
        DiskFileUpload upload = new DiskFileUpload();
        upload.setHeaderEncoding(CHARSET);

        // アップロード可能なサイズを指定
        upload.setSizeMax(HFESystemProperty.getUploadLimitByte() * 1024 * 1024);

        Map result = new HashMap();
		result.put(KEY_FILE_LIST, new LinkedList());
        
        try {
            // リクエストを解析
            Iterator iter = upload.parseRequest(request).iterator();
            while(iter.hasNext()) {
            	FileItem item = (FileItem)iter.next();
            	if (item.isFormField() && result.containsKey(item.getFieldName())) {
            		result.put(item.getFieldName(), item.getString(CHARSET));
            		
            	} else if(item.isFormField()) {
            		Object value = result.get(item.getFieldName());
            		List list = new LinkedList();
            		if (value  instanceof List) {
						list = (List) value;
					} else if (value instanceof String) {
						list.add(value);
					}
					list.add(item.getString(CHARSET));
					result.put(item.getFieldName(), list);
            		
            	} else {
            		String fileName = item.getName().replaceAll("\\\\|:", "/");
            		String[] path = fileName.split("/");
                    fileName = path[path.length - 1];
                    
                    String tmpFileName = workDirStr + File.separator + TmpFileIdGenerator.createTmpFileId();
                    // 一時ファイルを作成
                    File middleFile = new File(tmpFileName);
                    item.write(middleFile);
                    if (middleFile.exists()) {
                    	UploadParam param = new UploadParam(item.getFieldName(), fileName, middleFile);
                    	((List) result.get(KEY_FILE_LIST)).add(param);
                    }
            	}
            }

        } catch (FileUploadException e) {

            throw new RuntimeException(e);
        } catch (UnsupportedEncodingException e) {

            throw new RuntimeException(e);
        } catch (Exception e) {

            throw new RuntimeException(e);
        }
        
        return result;
    }
    
    /**
     * 
     * 概要: ファイル名の妥当性のチェックを行う<br>
     * 詳細: エラー時 falseを返す。
     * 備考: なし<br>
     *
     * @param fileName
     * @return
     */
    public static boolean validateFileName(String fileName) {

        // ファイル名の長さをチェック
        if (fileName.getBytes().length > 126) {
        	return false;
        }

    	// 禁止文字チェック
        for (int i = 0; i < CANNOT_USE_CHAR.length(); i++) {
            if (fileName.indexOf(CANNOT_USE_CHAR.charAt(i)) != -1) {
            	return false;
            }
        }
        
    	return true;
    }
}