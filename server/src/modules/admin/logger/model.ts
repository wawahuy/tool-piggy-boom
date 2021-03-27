export interface LoggerQuery {
  date_from: string;
  date_to: string;
  limit: string;
  page: string;
}

export const pageSize = [10, 50, 100, 500];