export type EmployeeStatus = "active" | "busy" | "offline";

export interface AIEmployee {
  id: string;
  name: string;
  title: string;

  model: string;
  status: EmployeeStatus;

  capabilities: string[];
  permissions: string[];
}