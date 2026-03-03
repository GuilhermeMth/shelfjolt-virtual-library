// Database model
export interface Book {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  fileUrl: string;
  coverPath?: string | null;
  language: string;
  viewCount: number;
  authorId: number;
  published: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Related entities
export interface BookAuthor {
  id: number;
  name: string;
  email: string;
}

export interface BookCategory {
  id: number;
  name: string;
}

// DTOs - only user-provided fields
export interface BookCreateDTO {
  title: string;
  slug: string;
  description?: string | null;
  fileUrl: string;
  coverPath?: string | null;
  language: string;
  authorId: number;
  categoryIds: number[];
}

export interface BookUpdateDTO {
  title?: string;
  slug?: string;
  description?: string | null;
  fileUrl?: string;
  coverPath?: string | null;
  language?: string;
  categoryIds?: number[];
}

// API Response - clean, no redundant fields
export interface BookResponse {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  fileUrl: string;
  coverPath?: string | null;
  language: string;
  viewCount: number;
  published: Date;
  createdAt: Date;
  updatedAt: Date;
  author: BookAuthor;
  categories: BookCategory[];
}
