import { PageProps, User } from "@/types";
import { index } from "@/routes/users";
import { Head } from "@inertiajs/react";
import FormUser from "@/components/user/form-user";

export default function Edit({user, roles}: PageProps<{ user: User, roles:[] }>) {
    return(
        <>
            <Head title="Edit Product" />
            <div className="h-full overflow-x-auto rounded-xl p-4">
                <FormUser 
                    user={user}
                    roles={roles}
                    method="put"
                />
            </div>
        </>
    )
}

Edit.layout = {
    breadcrumbs: [
        {
            title: 'Users',
            href: index().url,
        },
        {
            title: 'Edit User',
        },
    ],
};