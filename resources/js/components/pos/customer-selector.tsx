import React, { useState, useMemo, useEffect } from 'react';
import { User, Search, UserPlus, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ModalNewCustomer from './modal-new-customer';
import { Customer } from '@/types';
import { list, store } from '@/routes/customers';
import { useLiveSearch } from '@/hooks/use-live-search';
import api from '@/lib/axios';

interface Props {
    selectedCustomerId: string;
    onSelect: (id: string) => void;
}

export default function CustomerSelector({
    selectedCustomerId,
    onSelect,
}: Props) {
    const {search, setSearch, results, isSearching} = useLiveSearch({
        url:list.url(),
        type:'axios'
    })

    const [customers, setCustomers] = useState<Customer[]>([])
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

    // State Form Tambah Cepat
    const [isSaving, setIsSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const selectedCustomer = useMemo(
        () => customers.find((c) => String(c.id) === selectedCustomerId),
        [customers, selectedCustomerId]
    );

    const openQuickAddModal = () => {
        // Jika kasir tadi mengetik angka (nomor HP), otomatis pindahkan ke input phone
        const isNumeric = /^[0-9+]+$/.test(search.trim());
        setErrorMsg(null);
        setIsDropdownOpen(false);
        setIsQuickAddOpen(true);
    };

    const handleQuickCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setErrorMsg(null);

        const formData = new FormData(e.currentTarget as HTMLFormElement);

        try {
            const response = await api.post(store.url(), formData);

            const created: Customer = response.data.data;
            setCustomers((prev:Customer[]) => [...new Set([...prev, created])]);
            onSelect(String(created.id));
            setIsQuickAddOpen(false);
            setSearch('');
        } catch (err: any) {
            setErrorMsg(
                err.response?.data?.message || 'Storing new customer failed'
            );
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        setCustomers((prev:Customer[]) => [...new Set([...prev, ...results])])
    },[results])
    
    useEffect(() => {
        setIsDropdownOpen(search.trim().length > 0)
    },[search])

    return (
        <div className="relative">
            {/* Tampilan Pelanggan Terpilih atau Kotak Pencarian */}
            {selectedCustomer ? (
                <div className="flex items-center justify-between rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-xs">
                    <div className="flex items-center gap-2 truncate">
                        <User className="h-4 w-4 shrink-0 text-primary" />
                        <div className="truncate">
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {selectedCustomer.name}
                            </span>
                            <span className="ml-1.5 text-gray-500">
                                ({selectedCustomer.phone})
                            </span>
                        </div>
                    </div>
                    <Button
                        type="button"
                        onClick={() => onSelect('')}
                        variant={`ghost`}
                        size={`sm`}
                    >
                        <X className="h-3.5 w-3.5" />
                    </Button>
                </div>
            ) : (
                <div className="flex items-center gap-1.5">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                        <Input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                            }}
                            placeholder="Search customer by phone / name ..."
                            className="pl-8"
                        />
                    </div>
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={openQuickAddModal}
                        className="h-9 shrink-0 px-2.5 text-xs"
                    >
                        <UserPlus className="mr-1 h-3.5 w-3.5" />
                    </Button>
                </div>
            )}

            {/* Dropdown Hasil Pencarian */}
            {isDropdownOpen && !selectedCustomer && (
                <div className="absolute z-30 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
                    <div className="max-h-44 overflow-y-auto divide-y divide-gray-100 dark:divide-neutral-800">
                        {(isSearching || results.length === 0) ? (
                            <div className="p-3 text-center text-xs text-gray-500">
                                {isSearching ? 'Searching ...' : !search.trim() ? 'Type something' : `"${search}" Not found`}
                            </div>
                        ) : (
                            results.map((c:Customer) => (
                                <button
                                    key={c.id}
                                    type="button"
                                    onClick={() => {
                                        onSelect(String(c.id));
                                        setIsDropdownOpen(false);
                                        setSearch('');
                                    }}
                                    className="flex w-full items-center justify-between px-3 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-neutral-800"
                                >
                                    <div>
                                        <p className=" text-gray-900 dark:text-white">
                                            {c.phone} {c.email ? ` | ${c.email}` : ''}
                                        </p>
                                        <p className="text-gray-400">{c.name}</p>
                                    </div>
                                    <Check className="h-3.5 w-3.5 text-primary opacity-0 group-hover:opacity-100" />
                                </button>
                            ))
                        )}
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-800/50">
                        <Button
                            type="button"
                            onClick={openQuickAddModal}
                            variant={`link`}
                            size={`sm`}
                        >
                            + Daftarkan Pelanggan Baru
                        </Button>
                        <Button
                            type="button"
                            onClick={() => setIsDropdownOpen(false)}
                            variant={`ghost`}
                            size={`sm`}
                        >
                            Tutup
                        </Button>
                    </div>
                </div>
            )}

            {/* Modal Tambah Cepat Pelanggan di Layar Kasir */}
            <ModalNewCustomer 
                show={isQuickAddOpen}
                handleClose={() => setIsQuickAddOpen(false)}
                errorMessage={errorMsg}
                handleQuickCreate={handleQuickCreate}
                isSaving={isSaving}
            />
        </div>
    )
}