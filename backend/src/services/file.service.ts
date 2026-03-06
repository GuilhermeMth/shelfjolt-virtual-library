import { promises as fs } from "fs";
import path from "path";

export class FileService {
  private uploadsDir = path.join(process.cwd(), "uploads", "covers");

  /**
   * Get the cover URL path for a filename
   */
  getCoverUrl(filename: string): string {
    return `/uploads/covers/${filename}`;
  }

  /**
   * Get the full file path for a filename
   */
  private getFilePath(filename: string): string {
    return path.join(this.uploadsDir, filename);
  }

  /**
   * Delete a cover image file
   */
  async deleteCoverFile(filename: string | null): Promise<void> {
    if (!filename) return;

    try {
      const filePath = this.getFilePath(filename);
      await fs.unlink(filePath);
    } catch (error) {
      // File might not exist, log and continue
      console.error(`Failed to delete file ${filename}:`, error);
    }
  }

  /**
   * Extract filename from URL
   */
  extractFilenameFromUrl(url: string): string {
    return path.basename(url);
  }

  /**
   * Validate that uploaded file exists
   */
  async validateFileExists(filename: string): Promise<boolean> {
    try {
      const filePath = this.getFilePath(filename);
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

export const fileService = new FileService();
