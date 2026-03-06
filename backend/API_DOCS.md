# ShelfJolt Backend API

## Base URL

- Local: `http://localhost:3000/api`

## Autenticação

### 1) JWT (usuário autenticado)

Use no header:

- `Authorization: Bearer <token>`

### 2) Chave administrativa (rotas de usuários)

Use no header:

- `x-admin-key: <ADMIN_API_KEY>`

> A chave vem da variável `ADMIN_API_KEY` no ambiente.

---

## Health e teste de autenticação

### GET /status

Retorna status da API.

**Resposta 200**

```json
{
  "status": "ok",
  "timestamp": "2026-03-06T12:00:00.000Z"
}
```

### GET /protected

Rota protegida por JWT para validar token.

**Auth:** Bearer Token

**Resposta 200**

```json
{
  "message": "Acesso autorizado!",
  "user": {
    "id": 1,
    "name": "Nome",
    "email": "email@dominio.com"
  }
}
```

---

## Auth

### POST /auth/register

Cria conta local.

**Body**

```json
{
  "name": "Usuário",
  "email": "usuario@email.com",
  "password": "123456"
}
```

**Resposta 201**

```json
{
  "access_token": "jwt",
  "user": {
    "id": 1,
    "name": "Usuário",
    "email": "usuario@email.com",
    "google_id": null,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### POST /auth/login

Login local.

**Body**

```json
{
  "email": "usuario@email.com",
  "password": "123456"
}
```

**Resposta 200**
Mesmo formato de `/auth/register`.

### POST /auth/login/firebase

Login/cadastro com token Firebase.

**Body**

```json
{
  "firebaseToken": "token_firebase"
}
```

**Resposta 200**
Mesmo formato de `/auth/register`.

---

## Books

## GET /books

Lista livros com paginação.

**Query params**

- `page` (default: `1`)
- `limit` (default: `20`, max: `100`)

**Resposta 200**

```json
{
  "books": [],
  "total": 0,
  "page": 1,
  "totalPages": 0
}
```

### GET /books/catalog

Catálogo com filtros + paginação.

**Query params**

- `search` (busca em título, descrição, autor)
- `categories` (ex.: `1,2,3`)
- `language` (ex.: `pt-BR`)
- `sortBy` (`recent` | `popular` | `title` | `author`)
- `page` (default: `1`)
- `limit` (default: `20`, max: `100`)

**Resposta 200**
Mesmo formato de `/books`.

### GET /books/:id

Detalhe de livro.

- Incrementa visualização de forma controlada por sessão/IP (backend).

**Resposta 200**

```json
{
  "id": 1,
  "title": "Livro",
  "slug": "livro-exemplo",
  "description": "...",
  "fileUrl": "https://...",
  "coverPath": "/uploads/covers/arquivo.webp",
  "language": "pt-BR",
  "viewCount": 10,
  "published": "...",
  "createdAt": "...",
  "updatedAt": "...",
  "author": { "id": 1, "name": "Autor", "email": "autor@email.com" },
  "categories": [{ "id": 1, "name": "Ficção" }]
}
```

### GET /books/:id/preview-url

Retorna somente os dados de preview para o front-end renderizar (sem HTML pronto).

- Converte automaticamente links suportados (ex.: Google Drive) para URL de embed.
- Incrementa visualização com o mesmo controle por sessão/IP.

**Resposta 200**

```json
{
  "bookId": 18,
  "fileUrl": "https://drive.google.com/file/d/1DwXg8ABWJwYaBgmLxuFGyQjo7c2c9adm/view",
  "embedUrl": "https://drive.google.com/file/d/1DwXg8ABWJwYaBgmLxuFGyQjo7c2c9adm/preview",
  "provider": "google-drive",
  "isSupported": true
}
```

### GET /books/:id/preview

Renderiza preview do livro em HTML (embed interno).

> Útil para fallback. Para SPA/front-end custom, prefira `GET /books/:id/preview-url`.

**Resposta 200**

- `Content-Type: text/html`

### POST /books

Cria livro.

**Auth:** Bearer Token

Aceita dois formatos:

- `application/json` (com `coverUrl`/`coverPath` opcional)
- `multipart/form-data` (com arquivo `cover` opcional)

**Body**

```json
{
  "title": "Meu Livro",
  "slug": "Meu Livro 2026",
  "description": "Descrição opcional",
  "fileUrl": "https://...",
  "coverUrl": "https://...",
  "language": "pt-BR",
  "categoryIds": [1, 2]
}
```

**Multipart (exemplo)**

- `title`: `Meu Livro`
- `slug`: `Meu Livro 2026`
- `description`: `Descrição opcional`
- `fileUrl`: `https://...`
- `language`: `pt-BR`
- `categoryIds`: `1,2` (ou `[1,2]`)
- `cover`: (arquivo de imagem opcional)

**Observação sobre `fileUrl`**

- Para links do Google Drive, a API remove parâmetros de compartilhamento no final (ex.: `?usp=sharing`) ao salvar.

**Regra do slug:**

- O backend normaliza automaticamente para formato URL:
  - minúsculas
  - espaços/underscore viram `-`
  - remove acentos/caracteres inválidos

Exemplo: `"Meu Livro 2026"` → `"meu-livro-2026"`.

### PUT /books/me/:id

Atualiza livro do usuário autenticado.

**Auth:** Bearer Token

**Body (parcial)**

```json
{
  "title": "Novo título",
  "slug": "novo-slug",
  "description": "...",
  "fileUrl": "https://...",
  "coverPath": "https://...",
  "language": "pt-BR",
  "categoryIds": [1]
}
```

### DELETE /books/me/:id

Remove livro do usuário autenticado.

**Auth:** Bearer Token

**Resposta 200**

```json
{
  "message": "Livro deletado com sucesso",
  "book": { "...": "..." }
}
```

### POST /books/me/:id/cover

Upload de capa do livro.

**Auth:** Bearer Token

**Content-Type:** `multipart/form-data`

**Campo arquivo:**

- `cover` (imagem)

**Regras upload:**

- formatos permitidos: JPEG, PNG, WebP, GIF
- limite: 5MB

### PUT /books/me/:id/cover

Atualiza a capa do livro.

**Auth:** Bearer Token

**Content-Type:** `multipart/form-data`

**Campo arquivo:**

- `cover`

---

## Save Books (estante do usuário)

### GET /books/saved

Lista livros salvos do usuário com filtros.

**Auth:** Bearer Token

**Query params**

- `search`
- `categories` (ex.: `1,2`)
- `language`
- `sortBy` (`savedAt` | `recent` | `popular` | `title` | `author`)
- `page` (default: `1`)
- `limit` (default: `20`, max: `100`)

**Resposta 200**
Mesmo formato de listagem paginada.

### POST /books/:id/save

Salva livro na estante.

**Auth:** Bearer Token

**Resposta 201**

```json
{ "message": "Livro salvo com sucesso" }
```

### DELETE /books/:id/save

Remove livro da estante.

**Auth:** Bearer Token

**Resposta 200**

```json
{ "message": "Livro removido da estante" }
```

### GET /books/:id/saved

Verifica se livro está salvo pelo usuário.

**Auth:** Bearer Token

**Resposta 200**

```json
{ "isSaved": true }
```

---

## Categories

### GET /categories

Lista categorias.

### POST /categories

Cria categoria.

**Auth:** Bearer Token

**Body**

```json
{ "name": "Fantasia" }
```

### PUT /categories/:id

Atualiza categoria.

**Auth:** Bearer Token

**Body**

```json
{ "name": "Fantasia épica" }
```

### DELETE /categories/:id

Remove categoria.

**Auth:** Bearer Token

---

## Users (Administrativo)

> Estas rotas usam **somente** `x-admin-key`.

### GET /users

Lista usuários (paginação + busca).

**Admin Header:** `x-admin-key`

**Query params**

- `page` (default: `1`)
- `limit` (default: `20`, max: `100`)
- `search` (nome ou email)

**Resposta 200**

```json
{
  "users": [
    {
      "id": 1,
      "name": "Usuário",
      "email": "usuario@email.com",
      "google_id": null,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "total": 1,
  "page": 1,
  "totalPages": 1
}
```

### GET /users/:id

Busca usuário por ID.

**Admin Header:** `x-admin-key`

### POST /users

Cria usuário via rota administrativa.

**Admin Header:** `x-admin-key`

**Body**

```json
{
  "name": "Admin Created",
  "email": "novo@email.com",
  "password": "123456",
  "google_id": "opcional"
}
```

### PUT /users/:id

Atualiza usuário.

**Admin Header:** `x-admin-key`

**Body (parcial)**

```json
{
  "name": "Novo nome",
  "email": "novo@email.com",
  "password": "nova_senha_123",
  "google_id": null
}
```

### DELETE /users/:id

Deleta usuário.

**Admin Header:** `x-admin-key`

**Resposta 200**

```json
{ "message": "Usuário deletado com sucesso" }
```

---

## Arquivos estáticos

### GET /uploads/\*

Serve arquivos estáticos de upload (ex.: capas).

Exemplo:

- `/uploads/covers/nome-do-arquivo.webp`

---

## Rate Limiting (resumo)

- Global: `100 req / 15 min / IP`
- Auth: `5 tentativas / 15 min / IP`
- Visualização de livro: `20 req / min / IP`
- Escrita (POST/PUT/DELETE protegidos): `10 req / min / IP`

Quando exceder limite, retorna `429 Too Many Requests`.

---

## Erros comuns

- `400` dados inválidos
- `401` não autenticado / token inválido / header admin ausente
- `403` sem permissão
- `404` recurso não encontrado
- `409` conflito (ex.: e-mail já cadastrado, slug duplicado)
- `429` limite de requisições excedido
- `500` erro interno do servidor
