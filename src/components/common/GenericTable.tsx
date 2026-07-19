import React from "react";

// Column definition interface using TypeScript Generics
export interface Column<T> {
  header: string | React.ReactNode;
  // custom render function for cells (e.g., badges, images, buttons)
  render?: (item: T, index: number) => React.ReactNode;
  // optional key to extract simple values directly from data
  accessorKey?: keyof T;
  className?: string;
  headerClassName?: string;
}

interface GenericTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: (item: T) => string | number;
  emptyMessage?: string;
  iconNo: React.ReactNode
}

export const GenericTable = <T,>({
  data,
  columns,
  rowKey,
  emptyMessage = "No records found.",
  iconNo
}: GenericTableProps<T>) => {
  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50 text-[12px] font-black tracking-widest text-gray-400">
              {columns.map((column, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-4 ${column.headerClassName || ""}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-700">
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr
                  key={rowKey(item)}
                  className="hover:bg-gray-50/40 transition-colors group"
                >
                  {columns.map((column, colIdx) => (
                    <td
                      key={colIdx}
                      className={`px-6 py-4 ${column.className || ""}`}
                    >
                      {column.render
                        ? column.render(item, index)
                        : column.accessorKey
                        ? String(item[column.accessorKey] ?? "")
                        : null}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-12 text-gray-400 font-bold"
                >
                    {iconNo && <div className="flex justify-center mb-4">{iconNo}</div>}
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};