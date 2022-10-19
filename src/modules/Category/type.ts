export type createCategoryPayloadType = {
  categories: {
    name: string;
    priority: number;
    department_id: number;
  };
};

export type PriorityType = {
  id: number;
  value: string;
};