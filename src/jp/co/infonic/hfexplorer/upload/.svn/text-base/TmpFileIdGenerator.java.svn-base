package jp.co.infonic.hfexplorer.upload;

import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;

public class TmpFileIdGenerator {
	
	private static final int MAX_SEQUENCE = 99;
	
	private static int sequence = 0;

	public static String createTmpFileId() {
		
		Calendar cal = Calendar.getInstance();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
		String ymd = sdf.format(cal.getTime());
		sdf.applyPattern("HHmmssSSS");
		String time = sdf.format(cal.getTime());
        
//		String targetDir = workDir + File.separator + ymd;
//		if (!new File(targetDir).exists()) {
//			new File(targetDir).mkdirs();
//		}	
//        String fullpath = targetDir + File.separator + time + getNextval();
		
		return ymd + time + getNextval();
	}

    /**
     * 01～99までの連番文字列を取得する
     * スレッドセーフ
     * @return 連番の文字列表現
     */
    private static synchronized String getNextval() {

        if (sequence > MAX_SEQUENCE) {
        	sequence = 0;
        }

        DecimalFormat df = new DecimalFormat("00");
        return df.format(sequence++);
    }
}
