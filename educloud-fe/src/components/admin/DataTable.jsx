import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

export default function DataTable({ columns, data, isLoading, renderRow }) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-100 bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key}>{col.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.length ? (
            data.map((row) => (renderRow ? renderRow(row) : (
              <TableRow key={row.id}>
                {columns.map((col) => (
                  <TableCell key={col.key}>{col.render ? col.render(row) : row[col.key]}</TableCell>
                ))}
              </TableRow>
            )))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-8 text-center text-slate-500">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
