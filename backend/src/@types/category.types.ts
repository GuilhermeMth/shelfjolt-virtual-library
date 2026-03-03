export interface Category {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryCreateDTO {
  name: string;
}

export interface CategoryUpdateDTO {
  name: string;
}

export interface CategoryResponse {
  id: number;
  name: string;
}
