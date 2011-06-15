package jp.co.infonic.hfexplorer.bean;

import java.io.File;
import java.sql.SQLException;
import java.util.Map;

import jp.co.infonic.hfexplorer.db.Query;

public class FileDataFactory {
	
	public static FileData createFileData(File file) {
		FileData fd = new FileData();

		fd.setFileName(file.getName());
		fd.setSize(file.length());
		fd.setCreateDate(file.lastModified());
		fd.setAuth(file.canRead(), file.canWrite(), true);
		
		fd.setType(file.isDirectory() ? "d" : "f");
		
		setFileUniqueInfo(file, fd);
		return fd;
	}
	
	private static void setFileUniqueInfo(File file, FileData fd) {
		try {
			Query query = new Query("GetFileUniqueInfo", new Object[]{file.getParent(), file.getName()});
			if (query.getResultOne() != null) {
				Map info = query.getResultOne();
				String owner = (String)info.get("OWNER");
				String owner_g = (String)info.get("OWNER_GROUP");
				String description = (String)info.get("DESCRIPTION");
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
}
