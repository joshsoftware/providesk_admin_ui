export interface IEditTicketProps {
  ticket: ITicket;
  id: number;
  setOpenEdit: (value: React.SetStateAction<boolean>) => void;
}

export interface IReopenTicketProps {
  id: number;
  setOpenEdit: (value: React.SetStateAction<boolean>) => void;
}

export interface ITicketDetails {
  ticket: ITicket;
  activites: [
    {
      id: number;
      ticket_id: number;
      assigned_from: string;
      assigned_to: string;
      description: string;
      current_ticket_status: ticketStatusType;
      asset_url: null;
    }
  ];
}

export interface ITicket {
  id: number;
  title: string;
  description: string;
  ticket_number: null;
  status: ticketStatusType;
  priority: string;
  ticket_type: 'Request' | 'Complaint';
  resolved_at: null | string | Date;
  created_at: string | Date;
  category: string;
  category_id: string;
  department: string;
  department_id: string;
  resolver: string;
  resolver_id: string;
  requester: string;
  requester_id: number;
  permited_transitions: ticketStatusType[];
}

export interface IEditTicketPayload {
  category_id: string;
  department_id: string;
  resolver_id: string;
  description?: string;
  status: ticketStatusType;
}

export interface IReopenTicketPayload {
  is_customer_satisfied: boolean;
  rating: number | '';
  state_action: 'reopen';
  started_reason: string;
}

export type ticketStatusType =
  | 'open'
  | 'for_approval'
  | 'assigned'
  | 'inprogress'
  | 'resolved'
  | 'closed'
  | 'rejected'
  | 'reopen';

export type permittedEventsType =
  | 'assigned'
  | 'approve'
  | 'reject'
  | 'resolve'
  | 'close'
  | 'reopen';
