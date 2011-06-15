package jp.co.infonic.hfexplorer.utility;

import java.io.File;

import jp.co.infonic.hfexplorer.db.PublicDirectory;

public class PathConverter {
	
	/**
	 * 与えられた相対パスをフルパスに置き換える
	 * 引数に指定するパスはルートディレクトリを含めた
	 * 相対パスを指定する。先頭にセパレータは付けない。
	 * root/1/2/target.xls
	 */
	public static File getFile(String absolutePath) {

		while(absolutePath.startsWith("/")) {
			absolutePath = absolutePath.substring(1);
		}
		
		String rootName = absolutePath;
		String targetPath = "";
		if (absolutePath.indexOf("/") != -1) {
			rootName = absolutePath.substring(0, absolutePath.indexOf("/"));
			targetPath = absolutePath.substring(absolutePath.indexOf("/"));
		}
		
		
		return new File(PublicDirectory.getPublicDirectory(rootName) + targetPath);
	}
}
