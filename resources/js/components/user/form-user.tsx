import { Form } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {index, store, update} from "@/routes/users";
import { Role, UserFormType } from '@/types';
import UserAccountCard from './user-account-card';
import UserRoleCard from './user-role-card';

export default function FormUser({
    method = 'post',
    user,
    roles,
    cancelHref = index().url,
}: UserFormType) {
   
    return (
        <Form
            {...(method === 'put' && user?.id) ? {...update.form(user?.id)} : {...store.form()}}
            encType="multipart/form-data"
            className="mx-auto w-full"
        >
            {({processing, errors}) => (
                <>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                        <div className="lg:col-span-7">
                            <UserAccountCard errors={errors} user={user} isEdit={method === 'put' ? true : false}/>
                        </div>

                        <div className="lg:col-span-5">
                            <UserRoleCard roles={roles} defaultSelectedRole={user?.role} errors={errors} />
                        </div>
                    </div>


                    {/* Bottom Action Bar */}
                    <div className="mt-6 flex flex-col-reverse items-center justify-end gap-3 border-t border-gray-200 pt-5 sm:flex-row dark:border-neutral-800">
                        <a href={cancelHref} className="w-full sm:w-auto">
                            <Button type="button" variant={`outline`} className="w-full sm:w-auto">
                                Cancel
                            </Button>
                        </a>
                        <Button
                            type="submit"
                            className="w-full sm:w-auto"
                            disabled={processing}
                        >
                            {user?.id ? 'Save Changes' : 'Create User'}
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}

