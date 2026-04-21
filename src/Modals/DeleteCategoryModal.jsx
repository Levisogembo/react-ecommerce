import { Package, Trash } from 'lucide-react'
import React from 'react'

const DeleteCategoryModal = ({ category, onClose, onConfirm }) => {
    //console.log(product);
    
    return (
        <div className='fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4'>
            <div className='bg-gray-800 border border-gray-700 rounded-xl w-full max-w-sm overflow-hidden'>

                {/* body */}
                <div className='p-6 flex flex-col items-center text-center gap-3'>

                    {/* icon */}
                    <div className='w-13 h-13 rounded-full bg-red-950 flex items-center justify-center p-3'>
                        <Trash className='h-6 w-6 text-red-400' />
                    </div>

                    {/* text */}
                    <div>
                        <p className='text-sm font-medium text-white mb-1'>Delete category</p>
                        <p className='text-sm text-gray-400 leading-relaxed'>
                            Are you sure you want to delete{' '}
                            <span className='text-white font-medium'>{category.name}</span>?
                            This action cannot be undone.
                        </p>
                    </div>

                    {/* product preview */}
                    <div className='bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 w-full flex items-center gap-3'>
                        <div className='text-left'>
                            <p className='text-xs font-medium text-emerald-100'>{category.name}</p>
                            <p className='text-xs text-gray-500'>{category.description}</p>
                        </div>
                    </div>
                </div>

                {/* footer */}
                <div className='flex gap-2 px-6 py-4 border-t border-gray-700'>
                    <button
                        onClick={onClose}
                        className='flex-1 py-2 text-sm text-gray-400 border border-gray-600 rounded-md hover:text-white hover:bg-gray-700'
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className='flex-1 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 flex items-center justify-center gap-2'
                    >
                        <Trash className='h-4 w-4' />
                        Yes, delete
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteCategoryModal