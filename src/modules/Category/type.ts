export interface ICreateCategoryPayload {
  category: {
    name: string;
    priority: number;
    department_id: number;
    sla_unit: number; 
    sla_duration_type: string; 
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
