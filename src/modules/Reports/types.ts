export interface OverdueReponce {
  data: {
    Overdue: Ticket[];
    Overduein2days: Ticket[];
    Overdueaftertwodays: Ticket[];
  };
}
export interface Ticket {
  id: number;
  title: string;
  requester: string;
  description: string;
  ticket_number?: string | number;
  status: string;
  priority: string;
  department?: string;
  ticket_type: 'Request' | 'Complaint';
  resolved_at: null | string | Date;
  created_at: string | Date;
  category_id: string | number;
  department_id: string | number;
  resolver_id: string | number;
  requester_id: number;
  asset_url?: string[];
  eta?: string;
  asked_for_update_at?: string | null;
  updated_at?: string | null;
  organization_id: null | number;
  reason_for_update: null | string;
  resolver?: string;
}
