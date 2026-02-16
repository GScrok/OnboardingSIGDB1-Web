export interface Employee {
  id?: number | string | null;
  name: string;
  cpf: string;
  hiringDate: string;

  companyId?: number;
  companyName?: string;
  lastRole?: string;
}
