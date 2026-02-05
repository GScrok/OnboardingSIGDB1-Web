export interface Employee {
  id: number;
  name: string;
  cpf: string;
  hiringDate: string;
  
  companyId?: number;
  companyName?: string;
  lastRole?: string;
}