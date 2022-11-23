export interface IreateCategoryPayload {
  categories: {
    name: string;
    priority: number;
    department_id: number;
  };
}

export interface ICreateCategoryError {
  message: string;
  errors?: string;
}

export type PriorityType = {
  id: number;
  value: string;
};

export interface ICreateCategoryError {
  message: string;
  errors: string;
}
