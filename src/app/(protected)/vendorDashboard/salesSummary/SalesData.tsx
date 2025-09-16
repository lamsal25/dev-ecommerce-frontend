"use client";

import { useEffect, useState } from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    getPaginationRowModel,
    SortingState,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarIcon, X } from "lucide-react";
import API from "@/lib/api";
import { TableSkeleton } from "@/components/skeletons";
import { format, subDays, subMonths } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

type SalesData = {
    total_sales: number;
    total_orders: number;
    products: {
        id: number;
        name: string;
        quantity: number;
        price: number;
    }[];
};

type ProductSale = {
    id: number;
    name: string;
    quantity: number;
    price: number;
    total: number;
};

export default function SalesPage() {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: subDays(new Date(), 7),
        to: new Date(),
    });
    const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>(dateRange);
    const [data, setData] = useState<SalesData | null>(null);
    const [loading, setLoading] = useState(true);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const fetchSales = async (startDate: Date, endDate: Date) => {
        try {
            setLoading(true);
            const response = await API.get(`/vendors/salesReport/`, {
                params: {
                    start_date: format(startDate, "yyyy-MM-dd"),
                    end_date: format(endDate, "yyyy-MM-dd")
                },
            });
            setData(response.data);
        } catch (error) {
            console.error("Error fetching sales:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (dateRange?.from && dateRange?.to) {
            fetchSales(dateRange.from, dateRange.to);
        }
    }, [dateRange]);

    // Validate date range (1 day to 3 months)
    const validateDateRange = (from: Date, to: Date): boolean => {
        const diffTime = Math.abs(to.getTime() - from.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const maxDays = 90; // 3 months

        return diffDays >= 1 && diffDays <= maxDays;
    };

    const handleCalendarSelect = (range: DateRange | undefined) => {
        setTempDateRange(range);
    };

    const handleApplyDateRange = () => {
        if (tempDateRange?.from && tempDateRange?.to) {
            if (validateDateRange(tempDateRange.from, tempDateRange.to)) {
                setDateRange(tempDateRange);
                setIsCalendarOpen(false);
            } else {
                alert("Please select a date range between 1 day and 3 months");
            }
        }
    };

    const handleClearDateRange = () => {
        const defaultRange = { from: subDays(new Date(), 7), to: new Date() };
        setDateRange(defaultRange);
        setTempDateRange(defaultRange);
        setIsCalendarOpen(false);

    };

    const handleQuickSelect = (from: Date, to: Date) => {
        const newRange = { from, to };
        setDateRange(newRange);
        setTempDateRange(newRange);
        setIsCalendarOpen(false);
    };

    // Quick select options
    const quickSelectOptions = [
        { label: "Last 7 days", from: subDays(new Date(), 7), to: new Date() },
        { label: "Last 30 days", from: subDays(new Date(), 30), to: new Date() },
        { label: "Last 90 days", from: subDays(new Date(), 90), to: new Date() },
        { label: "This month", from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), to: new Date() },
    ];

    // Format currency for Nepal (Nepalese Rupees)
    const formatNPR = (amount: number) => {
        return new Intl.NumberFormat("ne-NP", {
            style: "currency",
            currency: "NPR",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    // Transform products data for table
    const productSales: ProductSale[] = data?.products
        ? data.products.map((product) => ({
            ...product,
            total: product.quantity * product.price,
        }))
        : [];

    const pageCount = Math.ceil(productSales.length / pagination.pageSize);
    const paginatedProducts = productSales.slice(
        pagination.pageIndex * pagination.pageSize,
        (pagination.pageIndex + 1) * pagination.pageSize
    );

    const columns: ColumnDef<ProductSale>[] = [
        {
            accessorKey: "name",
            header: "Product Name",
            cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
        },
        {
            accessorKey: "quantity",
            header: "Quantity Sold",
            cell: ({ row }) => <div>{row.getValue("quantity")}</div>,
        },
        {
            accessorKey: "price",
            header: "Price",
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("price"));
                return <div>{formatNPR(amount)}</div>;
            },
        },
        {
            accessorKey: "total",
            header: "Total Sales",
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("total"));
                return <div className="font-semibold">{formatNPR(amount)}</div>;
            },
        },
    ];

    const table = useReactTable({
        data: paginatedProducts,
        columns,
        state: { sorting, pagination },
        manualPagination: true,
        pageCount,
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    // Calculate total sales for current page
    const pageTotal = paginatedProducts.reduce((sum, product) => sum + product.total, 0);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl text-primary my-6 font-medium">
                    Sales <span className="text-secondary">Overview</span>
                </h2>
                {/* Date Range Picker */}
                <div className="flex items-center gap-2">
                    {/* Quick select buttons */}
                    <div className="hidden md:flex items-center gap-2">
                        {quickSelectOptions.map((option, index) => (
                            <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuickSelect(option.from, option.to)}
                                className="text-xs"
                            >
                                {option.label}
                            </Button>
                        ))}
                    </div>

                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[280px] justify-start text-left font-normal",
                                    !dateRange && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateRange?.from ? (
                                    dateRange.to ? (
                                        <>
                                            {format(dateRange.from, "MMM dd, yyyy")} -{" "}
                                            {format(dateRange.to, "MMM dd, yyyy")}
                                        </>
                                    ) : (
                                        format(dateRange.from, "MMM dd, yyyy")
                                    )
                                ) : (
                                    <span>Pick a date range</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-4" align="end" onInteractOutside={(e) => e.preventDefault()}>
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <Label>Select Date Range</Label>
                                    <Button variant="ghost" size="sm" onClick={handleClearDateRange}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>

                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={tempDateRange?.from}
                                    selected={tempDateRange}
                                    onSelect={handleCalendarSelect}
                                    numberOfMonths={2}
                                    disabled={(date) =>
                                        date > new Date() || date < subMonths(new Date(), 6)
                                    }
                                />

                                <div className="flex flex-col gap-2">
                                    <div className="text-sm font-medium text-orange-600">Quick Select</div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {quickSelectOptions.map((option, index) => (
                                            <Button
                                                key={index}
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleQuickSelect(option.from, option.to)}
                                                className="text-xs h-8"
                                            >
                                                {option.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                {tempDateRange?.from && tempDateRange.to && (
                                    <Button onClick={handleApplyDateRange} className="mt-2">
                                        Apply
                                    </Button>
                                )}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            {loading ? (
                <TableSkeleton />
            ) : data ? (
                <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-xl border p-4 bg-white shadow-sm">
                            <h2 className="text-lg font-medium text-primary">Total Sales</h2>
                            <p className="text-2xl font-bold text-secondary">
                                {formatNPR(data.total_sales)}
                            </p>
                        </div>
                        <div className="rounded-xl border p-4 bg-white shadow-sm">
                            <h2 className="text-lg font-medium text-primary">Total Orders</h2>
                            <p className="text-2xl font-bold text-secondary">{data.total_orders}</p>
                        </div>
                    </div>

                    {/* Products Table */}
                    <div className="rounded-md border overflow-hidden bg-white shadow-sm">
                        <Table>
                            <TableHeader className="bg-gray-100">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id} className="font-semibold text-blue-800">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id} className="hover:bg-gray-50">
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            No sales data available for the selected period.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination and Total */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        {/* Page Total */}
                        <div className="mb-4 md:mb-0">
                            <span className="text-lg font-semibold text-secondary">
                                Page Total:{" "}
                                <span className="text-primary">
                                    {formatNPR(pageTotal)}
                                </span>
                            </span>
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm">
                                Page {pagination.pageIndex + 1} of {pageCount}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="rounded-md border p-8 text-center">
                    <p className="text-gray-500">No sales data available.</p>
                </div>
            )}
        </div>
    );
}