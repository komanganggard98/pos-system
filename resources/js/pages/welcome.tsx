import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login } from '@/routes';
import { register } from '@/routes';
import { LayoutDashboard, Receipt } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function Welcome() {
    const { auth, name } = usePage().props;
    return (
        <>
            <Head title={name} />
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-between gap-4 ">
                        <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
                        
                        <div>
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                    >
                                        Log in
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
                    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
                        {/* Left Column: Headline & CTA */}
                        <div className="space-y-6 lg:col-span-7">

                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                                Fast Checkout &amp; Clear Sales Tracking
                            </h1>

                            <p className="max-w-2xl text-base leading-relaxed text-slate-600">
                                Process transaction smoothly, monitor order statuses,
                                and inspect complete transaction history in one unified POS
                                workspace.
                            </p>

                        </div>

                        {/* Right Column: Operational Overview Card */}
                        <div className="lg:col-span-5">
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                            Operational Modes
                                        </p>
                                        <h2 className="mt-0.5 text-base font-semibold text-slate-900">
                                            Cashier &amp; Admin Flow
                                        </h2>
                                    </div>
                                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                        Ready
                                    </span>
                                </div>

                                <div className="mt-4 space-y-3 text-sm">
                                    <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3.5">
                                        <div className="mt-0.5 rounded-lg bg-blue-100 p-2 text-blue-700">
                                            <Receipt className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800">
                                                POS Terminal (/pos)
                                            </p>
                                            <p className="text-xs text-slate-600">
                                                Add cart items, apply discounts or customer info, and
                                                complete checkout.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3.5">
                                        <div className="mt-0.5 rounded-lg bg-amber-100 p-2 text-amber-700">
                                            <LayoutDashboard className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800">
                                                Admin Dashboard (/dashboard)
                                            </p>
                                            <p className="text-xs text-slate-600">
                                                Filter orders by cashier, status, and date range with
                                                detail modals.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3 Core Highlights */}
                    <section
                        id="pos-workflow"
                        className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3"
                    >
                        <div className="rounded-xl border border-slate-200 bg-white p-5">
                            <p className="text-xs font-semibold uppercase text-blue-600">
                                01. Fast Counter
                            </p>
                            <h3 className="mt-1.5 text-base font-semibold text-slate-900">
                                Guided Checkout
                            </h3>
                            <p className="mt-1.5 text-sm text-slate-600">
                                Validate active items and totals consistently before recording each
                                order.
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-5">
                            <p className="text-xs font-semibold uppercase text-blue-600">
                                02. Order History &amp; Details
                            </p>
                            <h3 className="mt-1.5 text-base font-semibold text-slate-900">
                                Easy Audit Trail
                            </h3>
                            <p className="mt-1.5 text-sm text-slate-600">
                                Inspect invoices, customer info, cashiers, discounts, and payment
                                logs in a detail modal.
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-5">
                            <p className="text-xs font-semibold uppercase text-blue-600">
                                03. Role Routing
                            </p>
                            <h3 className="mt-1.5 text-base font-semibold text-slate-900">
                                Automatic Role Redirects
                            </h3>
                            <p className="mt-1.5 text-sm text-slate-600">
                                Admins head straight to the dashboard while cashiers go directly
                                to the POS screen.
                            </p>
                        </div>
                    </section>
                </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
