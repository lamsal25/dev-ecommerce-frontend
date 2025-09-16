"use client";

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import React from "react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MdDeleteOutline } from "react-icons/md";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, LucideFilePenLine, MoreHorizontal } from "lucide-react";

function truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

interface ProductDataTableProps {
    data: any[];
    onEdit: (product: any) => void;
    onDelete: (id: number) => Promise<void>;
    isDeleting: boolean;
}

export function ProductDataTable({ data, onEdit, onDelete, isDeleting }: ProductDataTableProps) {
    // Flatten the data to make nested properties accessible
    const flattenedData = React.useMemo(() =>
        data.map((item) => ({
            ...item,
            categoryName: typeof item.category === 'object' ? item.category?.name : item.category || "Uncategorized",
            displayPrice: item.discountPercentage > 0
                ? `$${item.discountedPrice.toFixed(2)}`
                : `$${item.originalPrice.toFixed(2)}`,
            isDiscounted: item.discountedPrice > 0
        })),
        [data]
    );

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Product Name
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Avatar className="h-9 w-9 border">
                            <AvatarImage src={item.image} alt={item.name} />
                            <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-medium">{truncateText(item.name, 30)}</span>
                            {item.isDiscounted && (
                                <span className="text-xs text-muted-foreground line-through">
                                    ${item.originalPrice.toFixed(2)}
                                </span>
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "displayPrice",
            header: "Price",
            cell: ({ row }) => {
                const isDiscounted = row.original.isDiscounted;
                return (
                    <span className={isDiscounted ? " font-medium text-primary" : ""}>
                        {row.getValue("displayPrice")}
                    </span>
                );
            },
        },
        {
            accessorKey: "categoryName",
            header: "Category",
            cell: ({ row }) => (
                <Badge variant="outline" className="capitalize">
                    {row.getValue("categoryName")}
                </Badge>
            ),
        },
        {
            accessorKey: "totalStock",
            header: "Stock",
            cell: ({ row }) => {
                const stock = row.getValue("totalStock");
                return (
                    <span className={stock <= 0 ? "text-red-500" : ""}>
                        {stock}
                    </span>
                );
            },
        },
        {
            accessorKey: "isAvailable",
            header: "Status",
            cell: ({ row }) => {
                const isAvailable = row.getValue("isAvailable");
                return (
                    <Badge
                        variant={isAvailable ? "default" : "destructive"}
                        className={isAvailable ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                        {isAvailable ? "Available" : "Out of Stock"}
                    </Badge>
                );
            }
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel className="font-bold text-left">Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => onEdit(item)}>
                                <span className="flex items-center gap-2 pl-4 mb-2 hover:cursor-pointer">
                                    <LucideFilePenLine className="h-4 w-4" />
                                    Edit
                                </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem

                                onClick={() => onDelete(item.id)}
                                className="text-red-600"
                            >
                                <span className="flex items-center gap-2 pl-4  hover:cursor-pointer">
                                    <MdDeleteOutline className="h-4 w-4" />
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const table = useReactTable({
        data: flattenedData,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="rounded-md border">
            {/* Filters */}
            <div className="flex items-center gap-4 p-4">
                {/* Category Filter */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Category</span>
                    <Input
                        placeholder="Filter by category..."
                        value={(table.getColumn("categoryName")?.getFilterValue() as string) ?? ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            table.getColumn("categoryName")?.setFilterValue(value.trim());
                        }}
                        className="max-w-sm"
                    />
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Status</span>
                    <Select
                        value={
                            table.getColumn("isAvailable")?.getFilterValue() === undefined
                                ? "all"
                                : table.getColumn("isAvailable")?.getFilterValue() === true
                                    ? "true"
                                    : "false"
                        }
                        onValueChange={(value) => {
                            if (value === "all") {
                                table.getColumn("isAvailable")?.setFilterValue(undefined);
                            } else {
                                table.getColumn("isAvailable")?.setFilterValue(value === "true");
                            }
                        }}
                    >
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="true">Available</SelectItem>
                            <SelectItem value="false">Out of Stock</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="py-3">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No products found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between p-4">
                <div></div>

                <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Rows per page</p>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => table.setPageSize(Number(value))}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={table.getState().pagination.pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[6, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to previous page</span>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                            Page {table.getState().pagination.pageIndex + 1} of{" "}
                            {table.getPageCount()}
                        </div>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to next page</span>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}