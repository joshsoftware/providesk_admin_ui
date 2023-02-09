export interface IreateCategoryPayload {
  category: {
    name: string;
    priority: number;
    department_id: number;
    sla_unit: string;
    sla_unit_type: string;
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
  errors?: string;
}
