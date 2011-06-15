package jp.co.infonic.hfexplorer.manage;

import java.sql.SQLException;
import java.util.Map;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;

import jp.co.infonic.hfexplorer.db.Query;
import jp.co.infonic.hfexplorer.property.HFESystemProperty;

import org.apache.log4j.Logger;


public class ManageCheckAuth {

	private Logger logger = Logger.getLogger(this.getClass());

	// 権限の有無チェックを行う。
	// 初期アクセス時は特定パラメータの有無で判断し、
	// 二度目以降はセッション内パラメータの有無で判断する。
	public boolean check(HttpServletRequest request, String commandPath) {

		try {
			checkHost(request);

			checkParameter(request);

		} catch (AuthCheckException e) {
			logger.debug(e.getMessage());
			return false;
		} catch (SQLException sqe) {
			logger.debug(sqe);
			return false;
		}

		return true;
	}

	// クライアントＩＰアドレスチェック
	private void checkHost(HttpServletRequest request) throws AuthCheckException, SQLException {

		String host = request.getRemoteAddr();
		logger.debug(host + " からのアクセス");
		
		Map deny = new Query("GetSystemProperty", new Object[] { "HOST.DENY" }).getResultOne();
		Map allow = new Query("GetSystemProperty", new Object[] { "HOST.ALLOW" }).getResultOne();
		
		if (deny != null) {
			String value = deny.get("VALUE").toString();
			String[] hosts = value.split(",");
			for (int i = 0; i < hosts.length; i++) {
				if (hosts[i].equals("all") && !isAllow(host, allow)) {
					throw new AuthCheckException("接続が許可されていません。");
					
				} else if(hosts[i].equals(host)) {
					throw new AuthCheckException("接続が許可されていません。");
					
				} else {
					Pattern pat = Pattern.compile("([\\d](1,3).)(3)");
				}
			}
		}

		if (false) {
			throw new AuthCheckException("接続できないホストからのアクセスです。");
		}
	}
	
	// アクセスを許すアドレス
	private boolean isAllow(String host, Map allow) throws SQLException {

		if (allow != null) {
			String value = allow.get("VALUE").toString();
			String[] hosts = value.split(",");
			for (int i = 0; i < hosts.length; i++) {
				if (hosts[i].equals(host)) {
					return true;
				}
			}
		}
		return false;
	}

	// パラメータチェック
	private void checkParameter(HttpServletRequest request) throws AuthCheckException {

		Object auth = request.getSession().getAttribute("HFE.AUTHED");
		if (auth == null) {
			String paramPass = request.getParameter(HFESystemProperty.getProperty("manage.auth.key"));
			String password = HFESystemProperty.getProperty("manage.auth.value");
			if (password != null && password.equals(paramPass)) {
				request.getSession().setAttribute("HFE.AUTHED", new Boolean(true));
			} else {
				throw new AuthCheckException("パラメータが間違っています。");
			}
		}
	}
}

class AuthCheckException extends Exception {
	AuthCheckException(String msg) {
		super(msg);
	}
}
