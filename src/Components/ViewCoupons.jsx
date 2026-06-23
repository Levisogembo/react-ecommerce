import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit, Star, Trash, ChevronLeft, ChevronRight } from 'lucide-react'
import EditProductModal from '../Modals/EditProductModal'
import DeleteProductModal from '../Modals/DeleteProductModal'
import { useCartStore } from '../stores/useCartStore'
import EditCouponModal from '../Modals/EditCouponModal'
import DeleteCouponModal from '../Modals/DeleteCouponModal'

const ViewCoupons = () => {
    const { deleteCoupon, toggleActiveCoupon, allCoupons, page, limit, total, loading, subtotal } = useCartStore()
    //console.log(products[0]);
    const [editingCoupon, setEditingCoupon] = useState(null)
    const [deletingCoupon, setDeletingCoupon] = useState(null)
    
    const totalPages = Math.ceil(total / limit)
    const handlePreviousPage = async () => {
        if (page > 1) {
            await getAllCoupons(page - 1, limit)
        }
    }

    const handleNextPage = async () => {
        if (page < totalPages) {
            await getAllCoupons(page + 1, limit)
        }
    }

    const handlePageClick = async (page) => {
        await getAllCoupons(page, limit)
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
            <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-700'>
                    <thead className='bg-gray-700'>
                        <tr>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
                            >
                                Coupon
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
                            >
                                Discount Type
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
                            >
                                Discount Value
                            </th>

                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
                            >
                                Expiration Date
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
                            >
                                Maximum Uses
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
                            >
                                Current Uses
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
                            >
                                Minimum Order Amount
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
                            >
                                Is Active
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className='bg-gray-800 divide-y divide-gray-700'>
                        {allCoupons.length > 0 ? (allCoupons?.map((coupon) => (
                            //console.log(`${import.meta.env.VITE_API_BASE_URL}/images/${product.images[0].fileName}`),

                            <tr key={coupon.couponId} className='hover:bg-gray-700'>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-300'>{coupon.code}</div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-300'>{coupon.discountType}</div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-300'>{coupon.discountType === 'fixed' ?
                                        `Kes ${coupon.discountValue}` : `%${coupon.discountValue}`}</div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-300'>{new Date(coupon.expirationDate).toLocaleDateString('en-KE', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    })}</div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-300'>{coupon.maxUses || '-'}</div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-300'>{coupon.currentUses || '-'}</div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-300'>{coupon.minOrderAmount && `Kes ${coupon.minOrderAmount}` || '-'}</div>
                                </td>
                                {<td className='px-6 py-4 whitespace-nowrap'>
                                    <button
                                        onClick={() => toggleActiveCoupon(coupon.couponId)}
                                        className={`p-1 rounded-full ${coupon.isActive ? "bg-yellow-400 text-gray-900" : "bg-gray-600 text-gray-300"
                                            } hover:bg-yellow-500 transition-colors duration-200`}
                                    >
                                        <Star className='h-5 w-5' />
                                    </button>
                                </td>}
                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                    <div className='flex items-center gap-3'>
                                        <button
                                            onClick={() => setDeletingCoupon(coupon)}
                                            className='text-red-400 hover:text-red-300'
                                        >
                                            <Trash className='h-5 w-5' />
                                        </button>

                                        <button
                                            onClick={() => setEditingCoupon(coupon)}
                                            className='text-green-300 hover:text-green-400'
                                        >
                                            <Edit className='h-5 w-5' />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))): (
                            <tr>
                              <td colSpan={7} className="px-6 py-12 text-center">
                                <div className="text-gray-400 text-sm">No coupons found</div>
                              </td>
                            </tr>
                          )}
                    </tbody>
                </table>
            </div>
            {editingCoupon && <EditCouponModal coupon={editingCoupon} onClose={() => setEditingCoupon(null)} />}
            {deletingCoupon && <DeleteCouponModal coupon={deletingCoupon} onClose={() => setDeletingCoupon(null)} onConfirm={() => {
                deleteCoupon(deletingCoupon.couponId)
                setDeletingCoupon(null)
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

export default ViewCoupons