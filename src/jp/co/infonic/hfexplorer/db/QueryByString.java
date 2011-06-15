package jp.co.infonic.hfexplorer.db;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

public class QueryByString extends Query {
	
	public QueryByString(String sql) throws SQLException {
		this(sql, new Object[0]);
	}
	
	public QueryByString(String sql, List params) throws SQLException {
		this(sql, (Object[]) params.toArray(new Object[0]));
	}
	
	public QueryByString(String sql, Object[] params) throws SQLException {
		Connection conn = null;
		try {
			conn = DBControllUtil.getConnection();
			PreparedStatement pstmt = conn.prepareStatement(sql);
			
			super.setParameter(pstmt, params);

			pstmt.execute();
			if (sql.startsWith("INSERT") || sql.startsWith("UPDATE")) {
				super.executeUpdate(pstmt);
			} else {
				super.executeQuery(pstmt);
			}
			
			pstmt.close();
			
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

}
