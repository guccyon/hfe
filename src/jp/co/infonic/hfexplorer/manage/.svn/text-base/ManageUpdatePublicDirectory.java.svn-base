package jp.co.infonic.hfexplorer.manage;

import java.io.File;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jp.co.infonic.hfexplorer.db.DBControllUtil;
import jp.co.infonic.hfexplorer.db.SqlManager;
import jp.co.infonic.hfexplorer.db.SqlObj;
import jp.co.infonic.hfexplorer.sql.SqlAccessor;

public class ManageUpdatePublicDirectory extends ManageCommon{

	public void execute(HttpServletRequest request) throws Exception {
		
		String[] dirs = request.getParameterValues("directory");
		dirs = changeProperData(dirs);

		Connection conn = null;
		try {
			conn = DBControllUtil.getConnection();
			conn.setAutoCommit(false);
			
			SqlObj sql = SqlManager.getSql(SqlAccessor.class, "DeletePublicDirectories");
			PreparedStatement pstmt = conn.prepareStatement(sql.getSqlString());

			int result = pstmt.executeUpdate();
			pstmt.close();
			
			sql = SqlManager.getSql(SqlAccessor.class, "InsertPublicDirectory");
			pstmt = conn.prepareStatement(sql.getSqlString());
			
			insertPublicDirectories(dirs, pstmt);

			pstmt.close();
			
			conn.commit();
		} catch (SQLException sqe) {
			if (conn != null) {
				conn.rollback();
			}
			throw sqe;
		} finally {
			if (conn != null) {
				try {
					conn.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
	}
	
	// 同じディレクトリの重複を省く
	private String[] changeProperData(String[] dirs) {
		
		Set directorySet = new HashSet();
		
		for (int i = 0; dirs != null && i < dirs.length; i++) {
			dirs[i] = dirs[i].replaceAll("\\\\", "/");
			
			while (dirs[i].matches("//")) {
				dirs[i].replaceAll("//", "/");
			}
			
			directorySet.add(dirs[i]);
		}
		
		return (String[]) directorySet.toArray(new String[0]);
	}
	
	private List failedDirectories = new LinkedList();
	
	private List successDirectories = new LinkedList();
	
	private void insertPublicDirectories(String[] dirs, PreparedStatement pstmt) throws SQLException {
		
		for (int i = 0; i < dirs.length; i++) {
			File file = new File(dirs[i]);
			if (file.exists()) {
				pstmt.setString(1, dirs[i]);

				pstmt.setString(2, file.getName());
				
				int result = pstmt.executeUpdate();
				if (result == 1) {
					successDirectories.add(file.getPath());
					
				} else {
					failedDirectories.add(file.getPath());
				}
				
			} else {
				failedDirectories.add(file.getPath());
			}
		}
	}

	public String getResponseStr() {
		String successMsg = successDirectories.size() + " 件のディレクトリを登録しました。";
		String errorMsg = "";
		if (failedDirectories.size() > 0) {
			errorMsg = "以下のディレクトリについて登録に失敗しました。対象のディレクトリがあるか確認してください<br>";
		}
		
		for (int i = 0; i < failedDirectories.size(); i++) {
			errorMsg += failedDirectories.get(i) + "<br>";
		}
		
		
		
		return readFile(HTML_COMMON_HEADER) + successMsg + errorMsg + readFile(HTML_COMMON_FOOTER);
	}

	public void setResponseHeader(HttpServletResponse response) {
		response.setHeader("Cache-Control", "no-cache");
		response.setContentType("text/html;charset=UTF-8");
	}

}
