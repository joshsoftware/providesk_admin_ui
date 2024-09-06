export interface IEditUserPayload {
  role: string;
  department_id: number;
}

export interface IUser {
  id: number;
  name: string;
  department_id: number;
  department: string;
  role: 'super_admin' | 'admin' | 'employee' | 'department_head';
}

export interface IEditUserError {
  errors?: string;
  message: string;
}

export interface IEditUserParams {
  id: number;
  payload: IEditUserPayload;
  setOpenEdit: (value: React.SetStateAction<boolean>) => void;
}
