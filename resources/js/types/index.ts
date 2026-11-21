import { Auth } from './auth';

export type * from './auth';
export type * from './navigation';
export type * from './ui';
export type * from './product';
export type * from './pos';
export type * from './discount';
export type * from './customer';
export type * from './shopping-cart';
export type * from './order';

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: Auth;
    status?: string;
    errors?: Record<string, string>;
};

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}
