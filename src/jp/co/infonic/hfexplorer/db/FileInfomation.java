package jp.co.infonic.hfexplorer.db;

import java.io.File;
import java.sql.SQLException;
import java.util.LinkedList;
import java.util.List;

public class FileInfomation {
	
	private static final String UPDATE_INFO = "UPDATE HFE_FILE_INFOMATION SET ";
	
	private static final String CONDITION = " WHERE PARENT_PATH=? AND FILE_NAME";

	public static void setOwner(File file, String value) throws SQLException {
		if (existCheck(file)) {
			new QueryByString(UPDATE_INFO + "OWNER=? " + CONDITION, createBindParameter(file, value));
		} else {
			createFileInfo(file, value, null, null);
		}
	}

	public static void setOwnerGroup(File file, String value) throws SQLException {
		if (existCheck(file)) {
			new QueryByString(UPDATE_INFO + "OWNER_GROUP=? " + CONDITION, new Object[]{value});
		} else {
			createFileInfo(file, null, value, null);
		}
	}

	public static void setDescription(File file, String value) throws SQLException {
		if (existCheck(file)) {
			new QueryByString(UPDATE_INFO + "DESCRIPTION=? " + CONDITION, createBindParameter(file, value));
		} else {
			createFileInfo(file, null, null, value);
		}
	}
	
	public static void createFileInfo(File file, String owner, String ownerGroup, String description) throws SQLException {

		List setList = new LinkedList();
		setList.add(new Object[]{"PARENT_PATH", file.getParent()});
		setList.add(new Object[]{"FILE_NAME", file.getName()});
		
		if (owner != null) {
			setList.add(new Object[]{"OWNER", owner});
		}
		
		if (ownerGroup != null) {
			setList.add(new Object[]{"OWNER_GROUP", ownerGroup});
		}
		
		if (description != null) {
			setList.add(new Object[]{"DESCRIPTION", description});
		}
		
		StringBuffer set = new StringBuffer();
		StringBuffer values = new StringBuffer();
		List bindParam = new LinkedList();
		for (int i = 0; i < setList.size(); i++) {
			Object[] obj = (Object[]) setList.get(i);
			if (i != 0) {
				set.append(" ,"); values.append(" ,");
			}
			set.append(obj[0]);	values.append("?");
			bindParam.add(obj[1]);
		}
		
		String sql = "INSERT INTO HFE_FILE_INFOMATION " +
				"(" + set.toString() + ") " +
				"VALUES (" + values.toString() + ")";

		new QueryByString(sql, bindParam);
	}
	
	private static boolean existCheck(File file) throws SQLException {
		Query query = new Query("GetFileUniqueInfo", new Object[]{file.getParent(), file.getName()});
		return query.getResultOne() != null;
	}
	
	private static Object[] createBindParameter(File file, String value) {
		return new Object[]{
				value, file.getParent(), file.getName()
		};
	}
}
