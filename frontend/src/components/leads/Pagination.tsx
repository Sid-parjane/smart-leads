import { PaginationMeta } from '../../types';
import { Button } from '../ui';

interface Props {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: Props) {
  const { page, totalPages, total, limit } = meta;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing <span className="font-medium">{from}–{to}</span> of <span className="font-medium">{total}</span> leads
      </p>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" disabled={!meta.hasPrevPage} onClick={() => onPageChange(page - 1)}>← Prev</Button>
        <span className="flex items-center px-3 text-sm text-gray-600 dark:text-gray-400">
          {page} / {totalPages}
        </span>
        <Button size="sm" variant="outline" disabled={!meta.hasNextPage} onClick={() => onPageChange(page + 1)}>Next →</Button>
      </div>
    </div>
  );
}
