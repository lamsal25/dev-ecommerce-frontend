'use client'

import { useEffect, useState } from 'react'
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    getPaginationRowModel,
    SortingState,
} from '@tanstack/react-table'
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'react-toastify'
import { getUserOrders } from '../../actions/vendor'
import API from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { TableSkeleton } from '@/components/skeletons'

type OrderedItem = {
    id: number
    order_id: number
    product_name: string
    quantity: number
    price: string
    status: string
    createdAt: string
    delivery_status?: string
    payment_status?: string
    delivery_date?: string | null
}

export default function ReceivedOrders() {
    const [orders, setOrders] = useState<OrderedItem[]>([])
    const [sorting, setSorting] = useState<SortingState>([])
    const [loading, setLoading] = useState(true)
    const [pageCount, setPageCount] = useState(0)
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true)
            try {
                const { data, error } = await getUserOrders(pagination.pageIndex + 1, pagination.pageSize)
                if (error || !data) {
                    toast.error('Error fetching orders')
                } else {
                    setOrders(data.results)
                    setPageCount(Math.ceil(data.count / pagination.pageSize))
                }
            } catch (err) {
                toast.error('Error fetching orders')
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [pagination.pageIndex, pagination.pageSize])


    const handleStatusChange = async (id: number, newStatus: string) => {
        try {
            const deliveryDate = newStatus === "Dispatched" ? new Date().toISOString() : null
            await API.post(`/vendors/orders/${id}/update/`, { status: newStatus, delivery_date: deliveryDate })
            toast.success("Status updated")
            setPagination({ ...pagination }) // re-trigger fetch
        } catch {
            toast.error("Failed to update status")
        }
    }

    const statusBadge = (status: string) => {
        const variantMap = {
            'Pending': 'secondary',
            'Dispatched': 'default',
            'Cancelled': 'destructive',
        } as const
        return <Badge variant={variantMap[status as keyof typeof variantMap] || 'outline'} className='text-white'>{status}</Badge>
    }

    const columns: ColumnDef<OrderedItem>[] = [
        { accessorKey: "order_id", header: "Order ID" },
        { accessorKey: "product_name", header: "Product" },
        { accessorKey: "quantity", header: "Quantity" },
        { accessorKey: "price", header: "Price", cell: ({ row }) => `${row.getValue("price")}` },
        {
            accessorKey: "createdAt", header: "Order Date",
            cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
        },
        {
            accessorKey: "status", header: "Product Status",
            cell: ({ row }) => <div>{statusBadge(row.getValue("status"))}</div>
        },
        {
            accessorKey: "payment_status",
            header: "Payment Status",
            cell: ({ row }) => {
                const status = row.getValue("payment_status")
                return (
                    <Badge
                        className={status === 'Paid' ? "bg-green-600 text-white" : "bg-secondary text-white"}
                    >
                        {String(status)}
                    </Badge>
                )
            }
        },
        {
            accessorKey: "delivery_date",
            header: "Delivery Date",
            cell: ({ row }) => {
                const date = row.getValue("delivery_date")
                return date ? new Date(date as string).toLocaleDateString() : "-"
            }
        },

        {
            accessorKey: "delivery_status",
            header: "Delivery Status",
            cell: ({ row }) => {
                const status = row.getValue("delivery_status")
                return <Badge variant={status === 'Received' ? 'default' : 'secondary'} className='text-white'>{String(status)}</Badge>
            }
        },
        {
            id: "actions", header: "Actions",
            cell: ({ row }) => (
                row.original.status !== 'Dispatched' && (
                    <Button
                        size="sm"
                        onClick={() => handleStatusChange(row.original.id, 'Dispatched')}
                        disabled={loading}
                        className="bg-green-600 text-white hover:bg-green-700"
                    >
                        Mark Dispatched
                    </Button>
                )
            ),
        },
    ]

    const table = useReactTable({
        data: orders,
        columns,
        state: { sorting, pagination },
        manualPagination: true,
        pageCount,
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    // Calculate total sales for current page
    const totalSum = orders.reduce((sum, item) => {
        return sum + (parseFloat(item.price) * item.quantity)
    }, 0)

    if (loading) {
        return (
            <TableSkeleton />
        )
    }

    return (
        <div className="w-full p-4 md:p-6">
            <div className="rounded-md border overflow-x-auto">
                <Table className="min-w-[900px]">
                    <TableHeader className="bg-gray-100">
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableHead key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow key={row.id} className="hover:bg-gray-50">
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    {orders.length === 0 ? "No orders received yet" : "No matching orders found"}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className='mt-4 flex flex-col md:flex-row md:items-center md:justify-between'>

                {/* Total Sales */}
                <div className="flex justify-end mt-4">
                    <span className="text-lg font-semibold text-primary">
                        Total Sales: <span className='text-secondary'>NRS {totalSum.toFixed(2)}</span>
                    </span>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} variant="outline" size="sm">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">Page {pagination.pageIndex + 1} of {pageCount}</span>
                    <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} variant="outline" size="sm">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
