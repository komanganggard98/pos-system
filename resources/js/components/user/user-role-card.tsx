import { useState } from 'react';
import { ShieldCheck, Check } from 'lucide-react';
import InputError from '@/components/input-error';
import { Role, UserUpsertForm } from '@/types';

interface Props {
    roles: Role[];
    defaultSelectedRole?: Role;
    errors?: Record<string, string>;
}

export default function UserRoleCard({
    roles,
    defaultSelectedRole,
    errors,
}: Props) {
    const [selectedRole, setSelectedRole] = useState<Role>(defaultSelectedRole ?? 'cashier');
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <input type="hidden" name="role" value={selectedRole} />

            <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3 dark:border-neutral-800">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    Assign Roles <span className="text-red-500">*</span>
                </h2>
            </div>

            <div className="space-y-2.5">
                {roles.length === 0 ? (
                    <p className="py-4 text-center text-xs text-gray-500">
                        No roles available. Please create roles first.
                    </p>
                ) : (
                    roles.map((role:Role) => {
                        const isChecked = selectedRole === role;
                        return (
                            <div
                                key={role}
                                onClick={() => setSelectedRole(role)}
                                className={`flex cursor-pointer items-center justify-between rounded-lg border p-3.5 transition ${
                                    isChecked
                                        ? 'border-primary bg-primary/5'
                                        : 'border-gray-200 hover:bg-gray-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50'
                                }`}
                            >
                                <div>
                                    <p className="text-sm font-semibold capitalize text-gray-900 dark:text-white">
                                        {role}
                                    </p>
                                </div>

                                <div
                                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                                        isChecked
                                            ? 'border-primary bg-primary text-white'
                                            : 'border-gray-300 bg-white dark:border-neutral-600 dark:bg-neutral-800'
                                    }`}
                                >
                                    {isChecked && <Check className="h-3.5 w-3.5" />}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <InputError message={errors?.role} className="mt-2" />
        </div>
    );
}
