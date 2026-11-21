import { PageProps, Role } from "@/types";
import { index } from "@/routes/users";
import { Head } from "@inertiajs/react";
import FormUser from "@/components/user/form-user";

export default function Create({roles}: PageProps<{roles:Role[]}>) {
    return(
        <>
            <Head title="Create user" />
            <div className="h-full overflow-x-auto rounded-xl p-4">
                <FormUser
                    roles={roles} 
                    method="post"
                />
            </div>
        </>
    )
}

Create.layout = {
    breadcrumbs: [
        {
            title: 'Users',
            href: index().url,
        },
        {
            title: 'Create User',
        },
    ],
};