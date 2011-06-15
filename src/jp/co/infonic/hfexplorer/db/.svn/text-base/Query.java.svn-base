package jp.co.infonic.hfexplorer.db;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import jp.co.infonic.hfexplorer.sql.SqlAccessor;

public class Query {
	
	private List result;
	
	protected Query(){};
	
	public Query(String sqlId) throws SQLException {
		this(sqlId, new Object[0]);
	}
	
	public Query(String sqlId, List params) throws SQLException {
		this(sqlId, (Object[]) params.toArray(new Object[0]));
	}
	
	public Query(String sqlId, Object[] params) throws SQLException {
		Connection conn = null;
		try {
			SqlObj sql = SqlManager.getSql(SqlAccessor.class, sqlId);
			conn = DBControllUtil.getConnection();
			PreparedStatement pstmt = conn.prepareStatement(sql.getSqlString());
			
			setParameter(pstmt, params);
			
			if (sql.getQueryType() == SqlObj.TYPE_SELECT) {
				executeQuery(pstmt);
			} else {
				executeUpdate(pstmt);
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
	
	public List getResult() {
		if (result == null) {
			throw new RuntimeException("Not Exucute SQL SELECT");
		}
		
		return result;
	}
	
	public Map getResultOne() {
		if (result == null) {
			throw new RuntimeException("Not Exucute SQL SELECT");
		}
		
		if (result.size() > 0) {
			return (Map)result.get(0);
		}
		return null;
	}
	
	protected PreparedStatement setParameter(PreparedStatement pstmt, Object[] params) throws SQLException {
		for (int i = 0; i < params.length; i++) {
			pstmt.setObject(i + 1, params[i]);
		}
		
		return pstmt;
	}
	
	protected void executeQuery(PreparedStatement pstmt) throws SQLException {
		
		result = new LinkedList();
		ResultSet rs = null;
		try {
			rs = pstmt.executeQuery();
			ResultSetMetaData rsmd = rs.getMetaData();
			
			while (rs.next()) {
				Map record = new HashMap();
				
				for (int columIndex = 1; columIndex <= rsmd.getColumnCount(); columIndex++) {
					String columnName = rsmd.getColumnName(columIndex);
					record.put(columnName, rs.getObject(columIndex));
				}
				
				result.add(record);
			}
		} finally {
			if (rs != null) {
				rs.close();
			}
		}
	}
	
	protected void executeUpdate(PreparedStatement pstmt) throws SQLException {
		pstmt.executeUpdate();
	}
}
