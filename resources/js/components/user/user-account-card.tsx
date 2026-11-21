import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { UserUpsertForm } from '@/types';

interface Props {
    user?: UserUpsertForm;
    isEdit?: boolean;
    errors?: Record<string, string>;
}

export default function UserAccountCard({
    user,
    isEdit = false,
    errors = {},
}: Props) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-5 flex items-center gap-2 border-b border-gray-100 pb-3 dark:border-neutral-800">
                <User className="h-5 w-5 text-primary" />
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    Account Information
                </h2>
            </div>

            <div className="space-y-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                    <Label htmlFor="name">
                        Full Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                        <User className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            autoFocus
                            defaultValue={user?.name ?? ''}
                            placeholder="e.g., John Doe"
                            className="pl-9"
                        />
                    </div>
                    <InputError message={errors?.name} />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                    <Label htmlFor="email">
                        Email Address <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                        <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            defaultValue={user?.email ?? ''}
                            placeholder="e.g., cashier@pos-system.com"
                            className="pl-9"
                        />
                    </div>
                    <InputError message={errors?.email} />
                </div>

                {/* Password & Confirmation Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {/* Password */}
                    <div className="space-y-1.5">
                        <Label htmlFor="password">
                            Password {!isEdit && <span className="text-red-500">*</span>}
                        </Label>
                        <div className="relative">
                            <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                required={!isEdit}
                                placeholder={isEdit ? 'Leave blank to keep current' : 'Min. 8 characters'}
                                className="pr-10 pl-9"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        <InputError message={errors?.password} />
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                        <Label htmlFor="password_confirmation">
                            Confirm Password {!isEdit && <span className="text-red-500">*</span>}
                        </Label>
                        <div className="relative">
                            <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                id="password_confirmation"
                                name="password_confirmation"
                                type={showPassword ? 'text' : 'password'}
                                required={!isEdit}
                                placeholder="Re-enter password"
                                className="pl-9"
                            />
                        </div>
                        <InputError message={errors?.password_confirmation} />
                    </div>
                </div>
            </div>
        </div>
    );
}
