import { router } from "@inertiajs/react";
import { useRef, useState, useEffect } from "react";
import axios from 'axios'
import api from "@/lib/axios";

interface UseLiveSearchInterface {
    url:string,
    initialValue?:string,
    paramName?:string,
    delay?:number,
    only?:string[],
    extraParams?:Record<string, string | number | undefined>
    type?:'inertia' | 'axios'
}

export function useLiveSearch({
    url,
    initialValue = '',
    paramName = 'search',
    delay = 400,
    only,
    extraParams = {},
    type = 'inertia'
}:UseLiveSearchInterface){
    const [results, setResults] = useState<any>([]);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState<string>(initialValue ?? '');
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const isFirstRender = useRef(true);

    useEffect(() => {
        // Lewati eksekusi saat komponen pertama kali dimuat agar tidak double request
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // Controller untuk membatalkan request Axios yang masih berjalan
        const controller = new AbortController();

        const timer = setTimeout(async () => {
            setIsSearching(true);

            // Susun parameter query, hapus key jika kosong agar URL tetap bersih
            const query: Record<string, string | number> = {};
            
            Object.entries(extraParams).forEach(([key, val]) => {
                if (val !== undefined && val !== '') {
                    query[key] = val;
                }
            });

            if (search.trim() !== '') {
                query[paramName] = search.trim();
            }

            if(type === 'axios'){
                try {
                    const response = await api.get(url, {
                        params: query, // Otomatis menjadi ?q=kataKunci
                        signal: controller.signal,
                    });

                    // Sesuaikan path data dengan struktur respons API Anda
                    setResults(response.data.data || []);
                } catch (err) {
                    // Abaikan error jika penyebabnya adalah pembatalan request
                    if (!axios.isCancel(err)) {
                        setError('Gagal memuat data.');
                        console.error(err);
                    }
                } finally {
                    setIsSearching(false);
                }
            }else{
                router.get(url, query, {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    only,
                    onFinish: () => setIsSearching(false),
                });
            }

        }, delay);

        return () => clearTimeout(timer);
    }, [search, url, paramName, delay]);

    const clearSearch = () => setSearch('');

    return {
        results,
        error,
        search,
        setSearch,
        clearSearch,
        isSearching,
    };
}