export interface ChartData {
  name: string;
  value: number;
}

export interface AnalyticalReportType {
  status_wise_organization_tickets: {
    total: number;
    assigned: number;
    inprogress: number;
    for_approval: number;
    resolved: number;
    closed: number;
    rejected: number;
    on_hold: number;
  };
  status_wise_department_tickets: {
    // total: number;
    [key: string]: {
      assigned: number;
      inprogress: number;
      for_approval: number;
      resolved: number;
      closed: number;
      rejected: number;
      on_hold: number;
    };
  };
  month_and_status_wise_tickets: {
    // total: number;
    [key: string]: {
      assigned: number;
      inprogress: number;
      for_approval: number;
      resolved: number;
      closed: number;
      rejected: number;
      on_hold: number;
    };
  };
}
