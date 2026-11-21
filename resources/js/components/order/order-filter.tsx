import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Calendar as CalendarIcon, Filter, RotateCcw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMultiDatePicker, { DateObject } from 'react-multi-date-picker';
import { ActiveFilters, OrderFilterProps } from '@/types/order';
const DatePicker =
    (ReactMultiDatePicker as unknown as { default?: typeof ReactMultiDatePicker }).default ??
    ReactMultiDatePicker;

export default function OrderFilter({ cashiers, filters }: OrderFilterProps) {
    const [values, setValues] = useState<ActiveFilters>({
        cashiers_id: filters.cashiers_id ?? '',
        status: filters.status ?? '',
        start_date: filters.start_date ?? '',
        end_date: filters.end_date ?? '',
    });

    // Initialize DatePicker range state from existing URL filters
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

    const handleChange = (key: keyof ActiveFilters, value: string) => {
        setValues((prev) => ({ ...prev, [key]: value }));
    };

    const handleDateRangeChange = (dates: DateObject | DateObject[] | null) => {
        const rangeArray = Array.isArray(dates) ? dates : dates ? [dates] : [];
        setDateRange(rangeArray);

        const startDate = rangeArray[0] ? rangeArray[0].format('YYYY-MM-DD') : '';
        const endDate = rangeArray[1] ? rangeArray[1].format('YYYY-MM-DD') : startDate;

        setValues((prev) => ({
            ...prev,
            start_date: startDate,
            end_date: endDate,
        }));
    };

    const handleApplyFilter = (e: React.FormEvent) => {
        e.preventDefault();
        const cleanParams = Object.fromEntries(
            Object.entries(values).filter(([_, v]) => v !== '')
        );

        router.get('/orders', cleanParams, {
            preserveState: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setDateRange([]);
        setValues({
            cashiers_id: '',
            status: '',
            start_date: '',
            end_date: '',
        });
        router.get('/orders', {}, { preserveState: true, replace: true });
    };



    return (
        <form
            onSubmit={handleApplyFilter}
            className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
        >
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                <Filter className="h-4 w-4 text-primary" />
                <span>Filter Transactions</span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
                {/* Filter Status */}
                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                        Status
                    </label>
                    <select
                        value={values.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                        className="h-9 w-full rounded-md border border-gray-200 bg-white px-2.5 text-xs dark:border-neutral-700 dark:bg-neutral-800"
                    >
                        <option value="">All Status</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                {/* Filter Cashier */}
                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                        Cashier
                    </label>
                    <select
                        value={values.cashiers_id}
                        onChange={(e) => handleChange('cashiers_id', e.target.value)}
                        className="h-9 w-full rounded-md border border-gray-200 bg-white px-2.5 text-xs dark:border-neutral-700 dark:bg-neutral-800"
                    >
                        <option value="">All Cashiers</option>
                        {cashiers.map((u:any) => (
                            <option key={u.id} value={u.id}>
                                {u.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date Range Picker (Takes 2 columns on desktop) */}
                <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                        Date Range (Start - End)
                    </label>
                    <div className="relative flex items-center">
                        <CalendarIcon className="pointer-events-none absolute left-2.5 z-10 h-3.5 w-3.5 text-gray-400" />
                        <DatePicker
                            range
                            rangeHover
                            value={dateRange}
                            onChange={handleDateRangeChange}
                            format="YYYY-MM-DD"
                            placeholder="Select start & end date..."
                            containerClassName="w-full"
                            inputClass="h-9 w-full rounded-md border border-gray-200 bg-white pl-8 pr-3 text-xs text-gray-700 focus:border-primary focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-200"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-3 dark:border-neutral-800">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                >
                    <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                    Reset
                </Button>
                <Button type="submit" size="sm">
                    <Search className="mr-1.5 h-3.5 w-3.5" />
                    Apply Filter
                </Button>
            </div>
        </form>
    );
}
