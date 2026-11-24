import { Head, router } from '@inertiajs/react';
import { IndexUserProps } from '@/types';
import { index, create, edit } from '@/routes/users';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CustomPagination } from '@/components/custom-pagination';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLiveSearch } from '@/hooks/use-live-search';

export default function Index({users, status, filter}: IndexUserProps) {
    const {search, setSearch} = useLiveSearch({
        initialValue:filter,
        url:index.url(),
        only:['users'],
    })

    const { current_page, last_page, from, to, total, data } = users;
    const visitPage = (page: number) => {
        router.get(index(), { page }, { preserveState: true, replace: true });
    }

    return (
        <>
            <Head title="users" />
            <div className="h-full overflow-x-auto rounded-xl p-4">
                <div className={`mb-4 flex md:flex-row flex-col md:items-center md:justify-between gap-2`}>
                    <div>
                        <a href={create().url}>
                            <Button type="button">
                                Create user
                            </Button>
                        </a>
                    </div>
                    <div className={`relative mb-5 md:w-80`}>
                        <div className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3`}>
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
            
                        <Input
                            type="text"
                            placeholder="Search products..."
                            className="pl-10"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className={`overflow-x-auto`}>
                    <Table className={`border min-w-full`}>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length > 0 ? (
                                data.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell >
                                            <p className="font-medium">{user.name}</p>
                                        </TableCell>
                                        <TableCell>
                                            {user.email}
                                        </TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell>
                                            <div className={`flex justify-end items-center gap-2`}>
                                                <a href={edit(user.id).url}>
                                                    <Button type="button">
                                                        Edit user
                                                    </Button>
                                                </a>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {last_page > 1 && (
                        <CustomPagination 
                            current_page={current_page}
                            last_page={last_page}
                            from={from}
                            to={to}
                            total={total}
                            visitPage={visitPage}
                        />
                    )}
                </div>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'users',
            href: index().url,
        },
    ],
};

                                    