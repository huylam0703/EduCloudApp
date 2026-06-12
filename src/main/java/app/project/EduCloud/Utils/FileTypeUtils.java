package app.project.EduCloud.Utils;

import app.project.EduCloud.enums.FileType;
import org.apache.commons.io.FilenameUtils;

public final class FileTypeUtils {
    private FileTypeUtils() {}

    public static FileType getFileType(String fileName) {

        String extension =
                FilenameUtils.getExtension(fileName).toLowerCase();

        return switch (extension) {
            case "pdf" -> FileType.PDF;

            case "doc", "docx" -> FileType.DOCX;

            case "ppt", "pptx" -> FileType.PPTX;

            case "xls", "xlsx" -> FileType.XLSX;

            case "zip", "rar", "7z" -> FileType.ZIP;

            case "png", "jpg", "jpeg", "gif", "webp" -> FileType.IMAGE;

            default -> FileType.OTHER;
        };
    }

    public static String normalizeFileName(String fileName) {
        String normalized = java.text.Normalizer.normalize(fileName, java.text.Normalizer.Form.NFD);

        return normalized
                .replaceAll("\\p{M}", "")
                .replaceAll("đ", "d")
                .replaceAll("Đ", "D")
                .replaceAll("[\\\\/:*?\"<>|]", "_")
                .replaceAll("\\s+", "_");
    }

    public static boolean isPreviewSupported(String contentType) {
        return contentType.equalsIgnoreCase("application/pdf")
                || contentType.startsWith("image/")
                || contentType.startsWith("text/")
                || contentType.startsWith("video/")
                || contentType.startsWith("audio/");
    }
}
