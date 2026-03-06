import NodeCache from "node-cache";

/**
 * Cache para rastrear visualizações únicas
 * TTL de 24 horas = uma view por usuário por livro por dia
 */
class ViewTracker {
  private cache: NodeCache;

  constructor() {
    // TTL de 24 horas (86400 segundos)
    this.cache = new NodeCache({ stdTTL: 86400, checkperiod: 3600 });
  }

  /**
   * Verifica se já contou view deste IP para este livro
   */
  hasViewed(ip: string, bookId: number): boolean {
    const key = `${ip}:${bookId}`;
    return this.cache.has(key);
  }

  /**
   * Marca que este IP visualizou este livro
   */
  markAsViewed(ip: string, bookId: number): void {
    const key = `${ip}:${bookId}`;
    this.cache.set(key, true);
  }

  /**
   * Limpa o cache (útil para testes)
   */
  clear(): void {
    this.cache.flushAll();
  }

  /**
   * Retorna estatísticas do cache
   */
  getStats() {
    return this.cache.getStats();
  }
}

export const viewTracker = new ViewTracker();
