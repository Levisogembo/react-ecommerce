import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit, Star, Trash, ChevronLeft, ChevronRight } from 'lucide-react'
import EditProductModal from '../Modals/EditProductModal'
import DeleteProductModal from '../Modals/DeleteProductModal'
import { useCategoryStore } from '../stores/useCategoryStore'

const Orders = () => {
    const { getAllOrders, orders, page, limit, total, loading } = useCategoryStore()
    //console.log(products[0]);
    const [editingProduct, setEditingProduct] = useState(null)
    const [deletingProduct, setDeletingProduct] = useState(null)

    const totalPages = Math.ceil(total / limit)
    const handlePreviousPage = async () => {
        if (page > 1) {
            await getAllOrders(page - 1, limit)
        }
    }

    const handleNextPage = async () => {
        if (page < totalPages) {
            await getAllOrders(page + 1, limit)
        }
    }

    const handlePageClick = async (page) => {
        await getAllOrders(page, limit)
    }

    const getPaginationRange = (currentPage, totalPages) => {
        const delta = 2  // pages to show on each side of current page

        const range = []
        const rangeWithDots = []

        // always show first and last page
        // build range around current page
        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i)
        }

        // add first page
        rangeWithDots.push(1)

        // add dots after first page if needed
        if (range[0] > 2) {
            rangeWithDots.push('...')
        }

        // add range around current page
        rangeWithDots.push(...range)

        // add dots before last page if needed
        if (range[range.length - 1] < totalPages - 1) {
            rangeWithDots.push('...')
        }

        // add last page
        if (totalPages > 1) {
            rangeWithDots.push(totalPages)
        }

        return rangeWithDots
    }

    return (
        <motion.div className='bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}>

            <div className='overflow-x-auto rounded-lg border border-gray-700'>
                <table className='min-w-full divide-y divide-gray-700'>
                    <thead className='bg-gray-700'>
                        <tr>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap'>
                                Order Id
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap'>
                                Created At
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap'>
                                Status
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap'>
                                Payment Method
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap'>
                                Paid At
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap'>
                                Total
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap'>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className='bg-gray-800 divide-y divide-gray-700'>
                        {orders?.map((order) => (
                            <tr key={order.orderId} className='hover:bg-gray-700'>

                                {/* truncate long order ID */}
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-300 font-mono'>
                                        {order.orderNumber ? order.orderNumber : `${order.orderId.substring(0, 8)}...`}
                                    </div>
                                </td>

                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-300'>
                                        {new Date(order.createdAt).toLocaleDateString('en-KE', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </div>
                                </td>

                                {/* status badge */}
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${order.status === 'COMPLETED'
                                            ? 'bg-emerald-900 text-emerald-300'
                                            : order.status === 'PENDING_PAYMENT'
                                                ? 'bg-yellow-900 text-yellow-300'
                                                : order.status === 'PAYMENT_FAILED'
                                                    ? 'bg-red-900 text-red-300'
                                                    : order.status === 'PROCESSING'
                                                        ? 'bg-blue-900 text-blue-300'
                                                        : 'bg-gray-700 text-gray-300'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>

                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-300'>
                                        {order.paymentMethod}
                                    </div>
                                </td>

                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-300'>
                                        {order.paidAt
                                            ? new Date(order.paidAt).toLocaleDateString('en-KE', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })
                                            : '—'
                                        }
                                    </div>
                                </td>

                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-300'>
                                        Ksh {order.total?.toLocaleString()}
                                    </div>
                                </td>

                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                    <div className='flex items-center gap-3'>
                                        <button className='text-emerald-400 hover:text-emerald-300 text-xs'>
                                            View
                                        </button>
                                    </div>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {editingProduct && <EditProductModal product={editingProduct} categories={categories} onClose={() => setEditingProduct(null)} />}
            {deletingProduct && <DeleteProductModal product={deletingProduct} onClose={() => setDeletingProduct(null)} onConfirm={() => {
                deleteProduct(deletingProduct.productId)
                setDeletingProduct(null)
            }} />}
            {/* pagination controls */}
            <div className='flex items-center justify-between px-6 py-4 border-t border-gray-700'>

                {/* info */}
                <div className='text-sm text-gray-400'>
                    Page {page} of {totalPages || 1}
                </div>

                {/* controls */}
                <div className='flex items-center gap-2'>
                    {/* prev button */}
                    <button
                        onClick={handlePreviousPage}
                        disabled={page === 1 || loading}
                        className='p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 
        disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        <ChevronLeft className='h-5 w-5' />
                    </button>

                    {/* page numbers */}
                    {/* {Array.from({ length: totalPages }, (_, i) => i + 1).map((pages) => (
            <button
              key={pages}
              onClick={() => handlePageClick(pages)}
              className={`px-3 py-1 rounded-md text-sm 
            ${page === pages
                  ? 'bg-emerald-600 text-white'           // active page
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'  // inactive
                }`}
            >
              {pages}
            </button>
          ))} */}
                    {getPaginationRange(page, totalPages).map((pages, index) => (
                        pages === '...' ? (
                            // render dots — not clickable
                            <span
                                key={`dots-${index}`}
                                className='px-3 py-1 text-sm text-gray-400'
                            >
                                ...
                            </span>
                        ) : (
                            // render page button
                            <button
                                key={pages}
                                onClick={() => handlePageClick(pages)}
                                className={`px-3 py-1 rounded-md text-sm 
            ${page === pages
                                        ? 'bg-emerald-600 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                    }`}
                            >
                                {pages}
                            </button>
                        )
                    ))}

                    {/* next button */}
                    <button
                        onClick={handleNextPage}
                        disabled={page === totalPages || loading}
                        className='p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 
        disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        <ChevronRight className='h-5 w-5' />
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

export default Orders