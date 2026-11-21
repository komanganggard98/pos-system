import { PageProps, PaginatedData } from ".";

export type Role = 'admin' | 'cashier';

export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    role:Role;
};

export type Auth = {
    user: User;
};

// Tipe khusus untuk Form Create (membuang field otomatis dari database)
export type UserFormData = Omit<User, 'id' | 'created_at' | 'updated_at'>;

// (Opsional) Jika satu komponen form dipakai untuk Create DAN Edit
export type UserUpsertForm = Partial<Pick<User, 'id'>> & UserFormData;

export type IndexUserProps = PageProps<{
    users: PaginatedData<User>;
    filter?:string
}>;

export type UserFormType = {
    method: "post" | "put";
    user?: UserUpsertForm;
    roles:Role[]
    cancelHref?: string;
}