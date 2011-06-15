package jp.co.infonic.hfexplorer.db;

import java.io.File;
import java.sql.SQLException;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

public class PublicDirectory {
	
	private static Logger logger = Logger.getLogger(PublicDirectory.class);

	public static File[] getPublicDirectories() {
		try {
			Query query = new Query("GetPublicDirectories");

			List files = new LinkedList();
			List result = query.getResult();
			Iterator iter = result.iterator();
			while(iter.hasNext()) {
				Map record = (Map)iter.next();
				File file = new File(record.get("FULL_PATH").toString());
				
				if (file.exists()) {
					files.add(file);
				} else {
					logger.debug(file + " は存在しない為、スキップします。");
				}
			}
			
			return (File[])files.toArray(new File[0]);
		} catch (SQLException sqe) {
			
		}
		
		return new File[0];
	}
	
	public static File getPublicDirectory(String name) {
		try {
			Query query = new Query("GetPublicDirectory", new Object[]{ name });

			Map record = query.getResultOne();
			if (record != null) {
				return new File(record.get("FULL_PATH").toString());
			}
			
		} catch (SQLException e) {
			logger.error(e);
		}
		return null;
	}
}
