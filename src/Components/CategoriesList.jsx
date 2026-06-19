import React, { useEffect, useState } from 'react'
import { useInventoryStore } from '../stores/useInventoryStore'
import { motion } from 'framer-motion'
import { Edit, Star, Trash, ChevronLeft, ChevronRight } from 'lucide-react'
import EditProductModal from '../Modals/EditProductModal'
import DeleteProductModal from '../Modals/DeleteProductModal'
import DeleteCategoryModal from '../Modals/DeleteCategoryModal'
import EditCategoryModal from '../Modals/EditCategoryModal'

const CategoriesList = () => {
    const { deleteCategory, categoryPage, categoryLimit, categoryTotal, fetchCategories, categoryLoading, categories } = useInventoryStore()
    //console.log(products[0]);
    const [editingCategory, setEditingCategory] = useState(null)
    const [deletingCategory, setDeletingCategory] = useState(null)

    useEffect(() => {
        fetchCategories(categoryPage,categoryLimit)
    }, [])
    const totalPages = Math.ceil(categoryTotal / categoryLimit)
    const handlePreviousPage = async () => {
        if (categoryPage > 1) {
            await fetchCategories(categoryPage - 1, categoryLimit)
        }
    }

    const handleNextPage = async () => {
        if (categoryPage < totalPages) {
            await fetchCategories(categoryPage + 1, categoryLimit)
        }
    }

    const handlePageClick = async (page) => {
        await fetchCategories(page, categoryLimit)
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
            <table className='min-w-full divide-y divide-gray-700'>
                <thead className='bg-gray-700'>
                    <tr>
                        <th
                            scope='col'
                            className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
                        >
                            Category
                        </th>
                        <th
                            scope='col'
                            className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
                        >
                            Description
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
                    {categories?.map((category) => (
                        <tr key={category.categoryId} className='hover:bg-gray-700'>
                            <td className='px-6 py-4 whitespace-nowrap'>
                                <div className='text-sm text-gray-300'>{category.name}</div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                                <div className='text-sm text-gray-300'>{category.description}</div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                <div className='flex items-center gap-3'>
                                    <button
                                        onClick={() => setDeletingCategory(category)}
                                        className='text-red-400 hover:text-red-300'
                                    >
                                        <Trash className='h-5 w-5' />
                                    </button>

                                    <button
                                        onClick={() => setEditingCategory(category)}
                                        className='text-green-300 hover:text-green-400'
                                    >
                                        <Edit className='h-5 w-5' />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {editingCategory && <EditCategoryModal category={editingCategory} onClose={() => setEditingCategory(null)} />}
            {deletingCategory && <DeleteCategoryModal category={deletingCategory} onClose={() => setDeletingCategory(null)} onConfirm={() => {
                deleteCategory(deletingCategory.categoryId)
                setDeletingCategory(null)
            }} />}
            {/* pagination controls */}
            <div className='flex items-center justify-between px-6 py-4 border-t border-gray-700'>

                {/* info */}
                <div className='text-sm text-gray-400'>
                    Page {categoryPage} of {totalPages || 1}
                </div>

                {/* controls */}
                <div className='flex items-center gap-2'>
                    {/* prev button */}
                    <button
                        onClick={handlePreviousPage}
                        disabled={categoryPage === 1 || categoryLoading}
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
                    {getPaginationRange(categoryPage, totalPages).map((pages, index) => (
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
            ${categoryPage === pages
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
                        disabled={categoryPage === totalPages || categoryLoading}
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

export default CategoriesList