package jp.co.infonic.hfexplorer.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import jp.co.infonic.hfexplorer.property.HFESystemProperty;

public class DBControllUtil {
	
	public static Connection getConnection() {

		try {
			Class.forName("org.h2.Driver");
			String url = "jdbc:h2:file:" + HFESystemProperty.getDatabaseStore() + "/hfe";
			String user = HFESystemProperty.getProperty("database.user", "sa");
			String pass = HFESystemProperty.getProperty("database.pass", "");
			
			Connection conn = DriverManager.getConnection(url, user, pass);
			
			return conn;
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return null;
	}
}
