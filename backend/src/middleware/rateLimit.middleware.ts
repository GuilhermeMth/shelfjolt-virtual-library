import rateLimit from "express-rate-limit";

/**
 * Rate limiter global para todas as rotas
 * Previne abuso e ataques DDoS
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo de 100 requisições por IP
  message: "Muitas requisições deste IP, tente novamente mais tarde.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Rate limiter específico para visualizações de livros
 * Previne spam de views
 */
export const viewLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 20, // máximo de 20 visualizações por minuto por IP
  message:
    "Você está visualizando livros muito rapidamente. Aguarde um momento.",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // conta todas as requisições
});

/**
 * Rate limiter para operações de autenticação
 * Previne brute force attacks
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo de 5 tentativas de login
  message: "Muitas tentativas de login. Tente novamente em 15 minutos.",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // só conta requisições com falha
});

/**
 * Rate limiter para operações de escrita (POST, PUT, DELETE)
 * Previne spam de criação/edição
 */
export const writeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 10, // máximo de 10 operações de escrita por minuto
  message: "Você está fazendo muitas alterações. Aguarde um momento.",
  standardHeaders: true,
  legacyHeaders: false,
});
