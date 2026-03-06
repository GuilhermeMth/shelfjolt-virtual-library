/**
 * Serviço para converter URLs de arquivos compartilhados em URLs de preview/embed
 * Suporta: Google Drive, Dropbox, OneDrive, Box
 */

export interface PreviewConfig {
  type: string;
  embedUrl: string;
  isSupported: boolean;
}

export class FilePreviewService {
  /**
   * Converte uma URL de compartilhamento em URL de embed
   */
  static convertToPreviewUrl(fileUrl: string): PreviewConfig {
    if (!fileUrl) {
      return {
        type: "unknown",
        embedUrl: "",
        isSupported: false,
      };
    }

    const url = fileUrl.trim();

    // Google Drive
    if (url.includes("drive.google.com") || url.includes("docs.google.com")) {
      return this.handleGoogleDrive(url);
    }

    // Dropbox
    if (url.includes("dropbox.com")) {
      return this.handleDropbox(url);
    }

    // OneDrive/Microsoft
    if (url.includes("1drv.ms") || url.includes("onedrive.live.com")) {
      return this.handleOneDrive(url);
    }

    // Box
    if (url.includes("box.com")) {
      return this.handleBox(url);
    }

    // Se não for nenhum formato suportado, retorna URL original
    return {
      type: "unknown",
      embedUrl: url,
      isSupported: false,
    };
  }

  /**
   * Google Drive - converte view para preview
   * https://drive.google.com/file/d/FILE_ID/view -> https://drive.google.com/file/d/FILE_ID/preview
   */
  private static handleGoogleDrive(url: string): PreviewConfig {
    const sanitizedUrl = url.trim();

    // Formato clássico: /file/d/<id>/view (ou /edit)
    const fileIdMatch = sanitizedUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
    if (fileIdMatch?.[1]) {
      const fileId = fileIdMatch[1];
      return {
        type: "google-drive",
        embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
        isSupported: true,
      };
    }

    // Formato alternativo: /open?id=<id> ou query ?id=<id>
    const idMatch = sanitizedUrl.match(/[?&]id=([a-zA-Z0-9-_]+)/);
    if (idMatch?.[1]) {
      const fileId = idMatch[1];
      return {
        type: "google-drive",
        embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
        isSupported: true,
      };
    }

    // Fallback: se já for URL de file com /view ou /edit, força /preview
    if (sanitizedUrl.includes("drive.google.com/file/d/")) {
      const embedUrl = sanitizedUrl.replace(
        /\/(view|edit)(\?.*)?$/i,
        "/preview",
      );

      return {
        type: "google-drive",
        embedUrl,
        isSupported: true,
      };
    }

    return {
      type: "google-drive",
      embedUrl: sanitizedUrl,
      isSupported: false,
    };
  }

  /**
   * Dropbox - converte dl=0 para dl=1
   * https://www.dropbox.com/s/xxxxx/file.pdf?dl=0 -> https://www.dropbox.com/s/xxxxx/file.pdf?dl=1
   */
  private static handleDropbox(url: string): PreviewConfig {
    // Remove parâmetros e adiciona dl=1 para preview
    const baseUrl = url.split("?")[0];
    const embedUrl = `${baseUrl}?dl=0&raw=1`;

    return {
      type: "dropbox",
      embedUrl,
      isSupported: true,
    };
  }

  /**
   * OneDrive - extrai ID e cria URL de embed
   */
  private static handleOneDrive(url: string): PreviewConfig {
    // Para links 1drv.ms, podemos usar diretamente
    if (url.includes("1drv.ms")) {
      // Adiciona ?download=1 para forçar visualização
      const embedUrl = url.includes("?")
        ? `${url}&download=1`
        : `${url}?download=1`;
      return {
        type: "onedrive",
        embedUrl,
        isSupported: true,
      };
    }

    return {
      type: "onedrive",
      embedUrl: url,
      isSupported: false,
    };
  }

  /**
   * Box - converte para URL de embed
   */
  private static handleBox(url: string): PreviewConfig {
    // Box URLs geralmente já suportam embed
    // https://app.box.com/s/xxxxx -> pode usar em iframe

    const baseUrl = (url.split("?")[0] || url) as string;

    return {
      type: "box",
      embedUrl: baseUrl,
      isSupported: true,
    };
  }

  /**
   * Retorna HTML/script para embed dependendo do tipo
   */
  static getEmbedHtml(fileUrl: string): string {
    const config = this.convertToPreviewUrl(fileUrl);

    switch (config.type) {
      case "google-drive":
        return this.getGoogleDriveEmbed(config.embedUrl);
      case "dropbox":
        return this.getDropboxEmbed(config.embedUrl);
      case "onedrive":
        return this.getOneDriveEmbed(config.embedUrl);
      case "box":
        return this.getBoxEmbed(config.embedUrl);
      default:
        return this.getGenericEmbed(config.embedUrl);
    }
  }

  private static getGoogleDriveEmbed(embedUrl: string): string {
    return `
      <iframe
        src="${embedUrl}"
        width="100%"
        height="600px"
        allowFullScreen
        allow="autoplay"
        style="border: none; border-radius: 8px;"
      ></iframe>
    `;
  }

  private static getDropboxEmbed(embedUrl: string): string {
    // Dropbox não suporta embed direto, mas podemos usar um link
    return `
      <div style="text-align: center; padding: 40px;">
        <p>Arquivo hospedado no Dropbox</p>
        <a href="${embedUrl}" target="_blank" rel="noopener noreferrer"
           style="padding: 12px 24px; background: #0061ff; color: white; 
                  text-decoration: none; border-radius: 4px; display: inline-block;">
          Abrir Arquivo
        </a>
      </div>
    `;
  }

  private static getOneDriveEmbed(embedUrl: string): string {
    // OneDrive permite embed em alguns casos
    return `
      <iframe
        src="https://onedrive.live.com/embed?resid=${this.extractOneDriveId(embedUrl)}"
        width="100%"
        height="600px"
        frameBorder="0"
        scrolling="no"
        style="border: none; border-radius: 8px;"
      ></iframe>
    `;
  }

  private static getBoxEmbed(embedUrl: string): string {
    return `
      <iframe
        src="${embedUrl}"
        width="100%"
        height="600px"
        frameBorder="0"
        allowFullScreen
        style="border: none; border-radius: 8px;"
      ></iframe>
    `;
  }

  private static getGenericEmbed(fileUrl: string): string {
    // Para URLs genéricas, oferece link de download
    return `
      <div style="text-align: center; padding: 40px;">
        <p>Arquivo externo</p>
        <a href="${fileUrl}" target="_blank" rel="noopener noreferrer"
           style="padding: 12px 24px; background: #007bff; color: white; 
                  text-decoration: none; border-radius: 4px; display: inline-block;">
          Abrir em Nova Aba
        </a>
      </div>
    `;
  }

  private static extractOneDriveId(url: string): string {
    // Extrai o ID do OneDrive da URL
    const match = url.match(/resid=([^&]+)/);
    return match?.[1] ?? "";
  }

  /**
   * Valida se a URL é de um provedor suportado
   */
  static isSupportedProvider(fileUrl: string): boolean {
    const config = this.convertToPreviewUrl(fileUrl);
    return config.isSupported;
  }
}
