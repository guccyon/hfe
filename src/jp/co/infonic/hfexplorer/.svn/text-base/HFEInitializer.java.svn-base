package jp.co.infonic.hfexplorer;

import java.io.File;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Enumeration;
import java.util.ResourceBundle;
import java.util.regex.Pattern;

import javax.servlet.ServletContextEvent;

import jp.co.infonic.hfexplorer.db.DBControllUtil;
import jp.co.infonic.hfexplorer.db.SqlManager;
import jp.co.infonic.hfexplorer.db.SqlObj;
import jp.co.infonic.hfexplorer.property.HFESystemProperty;
import jp.co.infonic.hfexplorer.sql.SqlAccessor;

import org.apache.log4j.Logger;

public class HFEInitializer {

	private static Logger logger = Logger.getLogger(HFEInitializer.class);

	public static void initialize(ServletContextEvent event) {
		System.out.println("[HttpFileExplorer] <Init> start");
		try {

			// プロパティファイルより設定値を読み込み
			readSystemConfig();

			// システム設定値の検証
			validateSystemConfig();

			// データベースの初期化（初回起動時のみ）
			initDataBase();
			
		} catch (RuntimeException e) {
			logger.error(e);
			throw e;
		}
		System.out.println("[HttpFileExplorer] <Init> end");
	}

	/*
	 * プロパティファイルの読み込み
	 */
	private static void readSystemConfig() {
		//ResourceBundle rb = ResourceBundle.getBundle("jp.co.infonic.hfexplorer.property.HttpFileExplorer");
		ResourceBundle rb = ResourceBundle.getBundle("HttpFileExplorer");
		Enumeration enume = rb.getKeys();
		while (enume.hasMoreElements()) {
			String key = enume.nextElement().toString();
			HFESystemProperty.setProperty(key, rb.getString(key));
		}
		logger.info("[HttpFileExplorer] <Init> systemProperty read finish");
	}

	/*
	 * 設定値の検証
	 */
	private static void validateSystemConfig() {
		String value = HFESystemProperty.getProperty("database.store");
		if (value == null) {
			throw new RuntimeException("[HttpFileExplorer] <Init> not found database.store property");
		}
		File file = new File(value);
		if (!file.exists() || !file.isDirectory() || !file.canWrite()) {
			throw new RuntimeException(
					"[HttpFileExplorer] <Init> database.store directory is not available ⇒"
							+ file.getPath());
		}

		Pattern pat = Pattern.compile("[a-zA-Z]+");
		value = HFESystemProperty.getProperty("manage.auth.key");
		if (value == null) {
			throw new RuntimeException("[HttpFileExplorer] <Init> not found manage.auth.key property");
		} else if (!pat.matcher(value).matches()) {
			throw new IllegalArgumentException(
					"[HttpFileExplorer] <Init> [HttpFileExplorer] <Init> manage.auth.key value is Illegal");
		}

		value = HFESystemProperty.getProperty("manage.auth.value");
		if (value == null) {
			throw new RuntimeException("not found manage.auth.value property");
		} else if (!pat.matcher(value).matches()) {
			throw new IllegalArgumentException(
					"[HttpFileExplorer] <Init> manage.auth.value value is Illegal");
		}
		logger.debug("[HttpFileExplorer] <Init> systemProperty validate success");
	}

	/*
	 * H2DBの初期化
	 */
	private static void initDataBase() {
		
		logger.debug("[HttpFileExplorer] <Init> テーブルの初期化");
		
		SqlObj[] tables = SqlManager.getSqls(SqlAccessor.class, "DDL");

		Connection conn = null;
		try {
			conn = DBControllUtil.getConnection();
			Statement stmt = conn.createStatement();

			for (int i = 0; i < tables.length; i++) {
				String sql = tables[i].getSqlString();
				stmt.execute(sql);
			}
		} catch (SQLException sqe) {
			throw new RuntimeException(sqe);

		} finally {
			if (conn != null) {
				try {
					conn.close();
				} catch (SQLException e) {
					throw new RuntimeException(e);
				}
			}
		}
	}
}
