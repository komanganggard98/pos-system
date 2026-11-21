import { Button } from "./ui/button";

export function CustomPagination({ current_page, last_page, from, to, total, visitPage }: { current_page: number; last_page: number; from: number | null; to: number | null; total: number; visitPage: (page: number) => void }) {
    return (
        <div className={`flex flex-col gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between`}>
            <span>
                Showing {from ?? 0} to {to ?? 0} of {total} data
            </span>
            <div className={`flex items-center gap-1`}>
                <Button
                    type={`button`}
                    size={`sm`}
                    variant={`outline`}
                    disabled={current_page === 1}
                    onClick={() => visitPage(current_page - 1)}
                >
                    Previous
                </Button>
                {Array.from({ length: last_page }, (_, index) => index + 1).map((page) => (
                    <Button
                        key={page}
                        type={`button`}
                        size={`sm`}
                        variant={page === current_page ? 'default' : 'outline'}
                        onClick={() => visitPage(page)}
                    >
                        {page}
                    </Button>
                ))}
                <Button
                    type={`button`}
                    size={`sm`}
                    variant={`outline`}
                    disabled={current_page === last_page}
                    onClick={() => visitPage(current_page + 1)}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
