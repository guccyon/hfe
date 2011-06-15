package jp.co.infonic.hfexplorer.utility;

import java.io.File;

import jp.co.infonic.hfexplorer.property.HFESystemProperty;

public class ZipFileCompressor {
	
	private File directory;

	public ZipFileCompressor(File directory) {
		this.directory = directory;
	}
	
	public File toZip() {
		String workDirStr = HFESystemProperty.getWorkDirectory();
		if (workDirStr == null) {
			throw new RuntimeException("作業ディレクトリが取得できません。");
		}

		File work = new File(workDirStr);
		if (!work.exists() || !work.canWrite()) {
			throw new RuntimeException("作業ディレクトリが取得できません。");
		}

		ZipArchiver zip = new ZipArchiver();
		String zipName = zip.getDirToZip(work.getPath(), directory);
		return new File(zipName);
	}
}
