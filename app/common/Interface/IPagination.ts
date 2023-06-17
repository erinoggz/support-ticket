import { SortOrder } from 'mongoose';

export interface Pagination<T> {
  data: T[];
  meta: {
    pages: number;
    prev: boolean;
    next: boolean;
    total: number;
    page: number;
    limit: number;
  };
  status: string;
}

export interface PaginationOptions extends Object {
  page?: number;
  limit?: number;
  srch?: string;
  query?: object | Record<string, object>;
  modelName?: string;
  projections?: object; //Record<string, unknown>,
  sort?:
    | string
    | { [key: string]: SortOrder | { $meta: 'textScore' } }
    | undefined
    | null
    | any;
  populate?: string | string[] | any | { path: string | string[]; select: object }[]; 
}
