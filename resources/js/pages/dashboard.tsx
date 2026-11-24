import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Banknote,
    Calendar as CalendarIcon,
    Filter,
    LucideShieldAlert,
    RotateCcw,
    ShoppingBag,
    Tag,
} from 'lucide-react';
import ReactMultiDatePicker, { DateObject } from 'react-multi-date-picker';
import { Button } from '@/components/ui/button';
import { formatRupiah } from '@/lib/utils';
import OrderTable from '@/components/order/order-table';
import { dashboard } from '@/routes';
import { DashboardProps } from '@/types/dashboard';
const DatePicker =
    (ReactMultiDatePicker as unknown as { default?: typeof ReactMultiDatePicker }).default ??
    ReactMultiDatePicker;


export default function Dashboard({
    stats,
    orders,
    cashiers,
    filters,
}: DashboardProps) {
    const visitPage = (page: number) => {
        router.get(dashboard(), { page }, { preserveState: true, replace: true });
    }
    const [values, setValues] = useState({
        cashiers_id: filters.cashiers_id ? String(filters.cashiers_id) : '',
        status: filters.status ?? '',
        start_date: filters.start_date ?? '',
        end_date: filters.end_date ?? '',
    });

    const [dateRange, setDateRange] = useState<DateObject[]>(() => {
        const initial: DateObject[] = [];
        if (filters.start_date) {
            initial.push(new DateObject({ date: filters.start_date, format: 'YYYY-MM-DD' }));
        }
        if (filters.end_date) {
            initial.push(new DateObject({ date: filters.end_date, format: 'YYYY-MM-DD' }));
        }
        return initial;
    });


    const handleDateRangeChange = (dates: DateObject | DateObject[] | null) => {
        const rangeArray = Array.isArray(dates) ? dates : dates ? [dates] : [];
        setDateRange(rangeArray);

        const startDate = rangeArray[0] ? rangeArray[0].format('YYYY-MM-DD') : '';
        const endDate = rangeArray[1] ? rangeArray[1].format('YYYY-MM-DD') : '';

        setValues((prev) => ({
            ...prev,
            start_date: startDate,
            end_date: endDate,
        }));
    };

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/dashboard', values, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleResetFilter = () => {
        const cleared = {
            cashiers_id: '',
            status: '',
            start_date: '',
            end_date: '',
        };
        setValues(cleared);
        setDateRange([]);

        router.get('/dashboard', cleared, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <>
            <Head title="Admin Dashboard - POS System" />

            <div className="min-h-screen p-4 sm:p-6">
                <div className="mx-auto max-w-7xl space-y-6">
                    {/* Header */}
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Admin Dashboard
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Sales Summary, Cashier Performance & Order History
                            </p>
                        </div>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl border dark:bg-neutral-800 p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-muted-foreground">Total Omzet</span>
                                <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 p-2 text-emerald-600">
                                    <Banknote className="h-4 w-4" />
                                </div>
                            </div>
                            <p className="mt-2 text-xl font-bold">
                                {formatRupiah(stats.total_revenue)}
                            </p>
                        </div>

                        <div className="rounded-xl border dark:bg-neutral-800 p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-muted-foreground">Total Order</span>
                                <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-2 text-blue-600">
                                    <ShoppingBag className="h-4 w-4" />
                                </div>
                            </div>
                            <p className="mt-2 text-xl font-bold">
                                {stats.total_orders}
                            </p>
                        </div>

                        <div className="rounded-xl border dark:bg-neutral-800 p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-muted-foreground">Total Diskon</span>
                                <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30  p-2 text-amber-600">
                                    <Tag className="h-4 w-4" />
                                </div>
                            </div>
                            <p className="mt-2 text-xl font-bold">
                                {formatRupiah(stats.total_discount)}
                            </p>
                        </div>

                        <div className="rounded-xl border dark:bg-neutral-800 p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-muted-foreground">Stok Menipis (&le;10)</span>
                                <div className="rounded-lg bg-rose-50 dark:bg-rose-950/30 p-2 text-rose-600">
                                    <LucideShieldAlert className="h-4 w-4" />
                                </div>
                            </div>
                            <p className="mt-2 text-xl font-bold">
                                {stats.low_stock_count} Produk
                            </p>
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <form
                        onSubmit={handleFilterSubmit}
                        className="grid grid-cols-1 gap-3 rounded-xl border p-4 sm:grid-cols-6 sm:items-end"
                    >
                        <div className="sm:col-span-1">
                            <label className="mb-1 block text-xs font-medium">
                                Cashier
                            </label>
                            <select
                                value={values.cashiers_id}
                                onChange={(e) =>
                                    setValues((prev) => ({ ...prev, cashiers_id: e.target.value }))
                                }
                                className="h-9 w-full rounded-md border dark:bg-neutral-800 px-2.5 text-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus:outline-none"
                            >
                                <option value="">All Cashiers</option>
                                {cashiers.map((cashier) => (
                                    <option key={cashier.id} value={cashier.id}>
                                        {cashier.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="sm:col-span-1">
                            <label className="mb-1 block text-xs font-medium ">
                                Status
                            </label>
                            <select
                                value={values.status}
                                onChange={(e) =>
                                    setValues((prev) => ({ ...prev, status: e.target.value }))
                                }
                                className="h-9 w-full rounded-md border dark:bg-neutral-800 px-2.5 text-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus:outline-none"
                            >
                                <option value="">All Status</option>
                                <option value="paid">Paid</option>
                                <option value="pending">Pending</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="mb-1 block text-xs font-medium ">
                                Date Range (Start - End)
                            </label>
                            <div className="relative flex items-center">
                                <CalendarIcon className="pointer-events-none absolute left-2.5 z-10 h-3.5 w-3.5" />
                                <DatePicker
                                    range
                                    rangeHover
                                    value={dateRange}
                                    onChange={handleDateRangeChange}
                                    format="YYYY-MM-DD"
                                    placeholder="Select start & end date..."
                                    containerClassName="w-full"
                                    inputClass="h-9 w-full rounded-md border dark:bg-neutral-800 pl-8 pr-3 text-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:col-span-2">
                            <Button type="submit" size="sm" className="h-9 gap-1.5 text-xs">
                                <Filter className="h-3.5 w-3.5" />
                                Filter
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleResetFilter}
                                className="h-9 gap-1.5 text-xs"
                            >
                                <RotateCcw className="h-3.5 w-3.5" />
                                Reset
                            </Button>
                        </div>
                    </form>

                    {/* Orders Table */}
                    <OrderTable 
                        visitPage={visitPage}
                        orders={orders}
                    />

                    {/* Pagination Links */}
                    {orders.links?.length > 3 && (
                        <div className="flex flex-wrap items-center justify-end gap-1.5">
                            {orders.links.map((link, idx) =>
                                link.url ? (
                                    <Link
                                        key={idx}
                                        href={link.url}
                                        preserveScroll
                                        className={`rounded-md border px-3 py-1.5 text-xs font-medium ${
                                            link.active
                                                ? 'border-blue-600 bg-blue-600 text-white'
                                                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={idx}
                                        className="rounded-md border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs text-slate-400"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>

        </>
    );
}