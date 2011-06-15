package jp.co.infonic.hfexplorer.upload;

import java.io.File;


public class UploadParam {

    private String key;

    private File file;
    
    private String fileName;

    UploadParam(String key, String filename, File file) {
        this.key = key;
        this.fileName = filename;
        this.file = file;
    }

	public File getFile() {
		return file;
	}

	public String getFileName() {
		return fileName;
	}

	public String getKey() {
		return key;
	}
	
	public void setName(String name) {
		this.fileName = name;
	}
}