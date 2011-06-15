package jp.co.infonic.hfexplorer;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class HFEContextListener implements ServletContextListener {

	public void contextInitialized(ServletContextEvent event) {
		HFEInitializer.initialize(event);
	}

	public void contextDestroyed(ServletContextEvent arg0) {
		// TODO 自動生成されたメソッド・スタブ
		
	}

}
