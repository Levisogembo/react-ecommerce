import { useState } from 'react'
import { X, Edit, Save, Upload } from 'lucide-react'
import { useInventoryStore } from '../stores/useInventoryStore'

const EditCategoryModal = ({ category, onClose, categories }) => {
    const [formData, setFormData] = useState({
        name: category.name || '',
        description: category.description || '',
    })
    const { updateCategory } = useInventoryStore()
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()        
        await updateCategory(category.categoryId, formData)
        onClose()
    }

    return (
        <div className='fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4'>
            <div className='bg-gray-800 border border-gray-700 rounded-xl w-full max-w-lg'>

                {/* header */}
                <div className='flex items-center justify-between p-5 border-b border-gray-700'>
                    <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 rounded-lg bg-emerald-900 flex items-center justify-center'>
                            <Edit className='h-4 w-4 text-emerald-400' />
                        </div>
                        <div>
                            <p className='text-sm font-medium text-white'>Edit Category</p>
                            <p className='text-xs text-gray-400'>Update category details</p>
                        </div>
                    </div>
                    <button onClick={onClose} className='text-gray-400 hover:text-white'>
                        <X className='h-5 w-5' />
                    </button>
                </div>

                {/* form */}
                <form onSubmit={handleSubmit}>
                    <div className='p-5 flex flex-col gap-4'>

                        {/* name + description */}
                        <div className='grid grid-cols-2 gap-3'>
                            <div>
                                <label className='block text-xs text-gray-400 mb-1'>Category name</label>
                                <input
                                    name='name'
                                    value={formData.name}
                                    onChange={handleChange}
                                    className='w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500'
                                />
                            </div>
                            <div>
                                <label className='block text-xs text-gray-400 mb-1'>Description</label>
                                <input
                                    name='description'
                                    value={formData.description}
                                    onChange={handleChange}
                                    className='w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500'
                                />
                            </div>
                        </div>

                    </div>

                    {/* footer */}
                    <div className='flex justify-end gap-2 px-5 py-4 border-t border-gray-700'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='px-4 py-2 text-sm text-gray-400 border border-gray-600 rounded-md hover:text-white hover:bg-gray-700'
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            className='px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 flex items-center gap-2'
                        >
                            <Save className='h-4 w-4' />
                            Save changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditCategoryModal