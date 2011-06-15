package jp.co.infonic.hfexplorer.utility;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.zip.CRC32;

import org.apache.tools.zip.ZipEntry;
import org.apache.tools.zip.ZipOutputStream;

/**
 * 
 * 概要：<br>
 * 詳細：<br>
 *<pre>
 * [変更履歴]
 * 日付        連番   内容
 * --------------------------------------------------
 * 2006/03/11  VL000  新規
 *</pre>
 * @author 樋口
 * @since 2006/03/11
 */
public class ZipArchiver {

    /**
     * 
     * 概要: <br>
     * 詳細: <br>
     * 備考: なし<br>
     * @param tmpDir
     * @param target
     * @return
     * @since 2006/03/11
     */
	public String getDirToZip(String tmpDir, File target) {

		if (!target.exists() || !target.isDirectory()) {
			return null;
		}

		Calendar cal = Calendar.getInstance();
		String zipName = tmpDir + File.separator + target.getName() + cal.getTimeInMillis();
		BufferedOutputStream bos = null;
		try {
			List nameList = new ArrayList();
			getTargetFileNameList(null, target, nameList);

			bos = new BufferedOutputStream(new FileOutputStream(zipName));
			ZipOutputStream zos = new ZipOutputStream(bos);
			zos.setEncoding("Windows-31J");
			for (int i = 0; i < nameList.size(); i++) {
				String pathName = (String) nameList.get(i);
				putFile(target, pathName, zos);
			}

			zos.flush();
			zos.finish();

		} catch (Exception ioe) {
			ioe.printStackTrace();

		} finally {
			if (bos != null) {
				try {
					bos.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return zipName;
	}

	/**
	 * 対象ディレクトリ内のファイルへの相対パスを再帰的に取得する。
	 * 
	 * @param absolutePath
	 *            対象ディレクトリからの相対パス
	 * @param parent
	 * @param targetArray
	 */
	private void getTargetFileNameList(String absolutePath, File parent,
			List targetArray) {

		File[] children = parent.listFiles();
		String parentPath = "";
		if (absolutePath != null) {
			parentPath = absolutePath + File.separator;
		}
		for (int i = 0; i < children.length; i++) {
			String childAbsolute = parentPath + children[i].getName();

			if (children[i].isDirectory()) {
				getTargetFileNameList(childAbsolute, children[i], targetArray);
			} else {
				targetArray.add(childAbsolute);
			}
		}
	}

    /**
     * 
     * 概要: <br>
     * 詳細: <br>
     * 備考: なし<br>
     * @param parent
     * @param pathName
     * @param zos
     * @throws IOException
     * @since 2006/03/11
     */
	private void putFile(File parent, String pathName, ZipOutputStream zos)
			throws IOException {

		File file = new File(parent.getPath() + File.separator + pathName);
		BufferedInputStream bis = null;
		try {
			CRC32 crc = new CRC32();
			ZipEntry entry = new ZipEntry(pathName.replaceAll("\\\\", "/"));

			entry.setMethod(ZipEntry.DEFLATED); // 圧縮メソッド設定。
			zos.setMethod(ZipOutputStream.DEFLATED);
			entry.setSize(file.length());
			zos.putNextEntry(entry);

			bis = new BufferedInputStream(new FileInputStream(file));

			int size;
			byte[] buf = new byte[1024];
			while ((size = bis.read(buf, 0, buf.length)) != -1) {
				crc.update(buf, 0, size);
				zos.write(buf, 0, size);
			}

			zos.closeEntry();

		} finally {
			if (bis != null) {
				try {
					bis.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}

	}

}
