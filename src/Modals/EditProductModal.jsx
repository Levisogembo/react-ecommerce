import { useState } from 'react'
import { X, Edit, Save, Upload } from 'lucide-react'
import { useInventoryStore } from '../stores/useInventoryStore'

const EditProductModal = ({ product, onClose, categories }) => {
    //console.log(categories);
    
    const [formData, setFormData] = useState({
        name: product.name || '',
        description: product.description || '',
        brand: product.brand || '',
        price: product.price || '',
        quantity: product.quantity || '',
        category: product.category?.categoryId || '',
        file: null
    })
    const { updateProduct } = useInventoryStore()
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        await updateProduct(product.productId, formData)
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
                            <p className='text-sm font-medium text-white'>Edit product</p>
                            <p className='text-xs text-gray-400'>Update product details</p>
                        </div>
                    </div>
                    <button onClick={onClose} className='text-gray-400 hover:text-white'>
                        <X className='h-5 w-5' />
                    </button>
                </div>

                {/* form */}
                <form onSubmit={handleSubmit}>
                    <div className='p-5 flex flex-col gap-4'>

                        {/* image upload */}
                        <div className='border border-dashed border-gray-600 rounded-lg p-3 flex items-center gap-3 bg-gray-900 cursor-pointer'>
                            <div className='w-12 h-12 rounded-lg bg-emerald-900 flex items-center justify-center flex-shrink-0'>
                                {formData.file ? (
                                    <img
                                        src={URL.createObjectURL(formData.file)}
                                        className='w-12 h-12 rounded-lg object-cover'
                                    />
                                ) : (
                                    <Upload className='h-5 w-5 text-emerald-400' />
                                )}
                            </div>
                            <div>
                                <p className='text-xs font-medium text-emerald-300'>
                                    {formData.file ? formData.file.name : 'Replace image'}
                                </p>
                                <p className='text-xs text-gray-500'>PNG, JPG up to 5MB</p>
                            </div>
                            <input
                                type='file'
                                accept='image/*'
                                className='hidden'
                                id='edit-product-file'
                                onChange={(e) => {
                                    e.preventDefault();
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        console.log('File selected:', file.name); // Debug log
                                        setFormData(prev => ({
                                            ...prev,
                                            file: file
                                        }));
                                    }
                                }}
                                onClick={()=>console.log('buttion clicked')
                                }
                            />  
                            <label htmlFor='edit-product-file' className='ml-auto text-xs text-emerald-400 cursor-pointer hover:text-emerald-300'>
                                Browse
                            </label>
                        </div>

                        {/* name + brand */}
                        <div className='grid grid-cols-2 gap-3'>
                            <div>
                                <label className='block text-xs text-gray-400 mb-1'>Product name</label>
                                <input
                                    name='name'
                                    value={formData.name}
                                    onChange={handleChange}
                                    className='w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500'
                                />
                            </div>
                            <div>
                                <label className='block text-xs text-gray-400 mb-1'>Brand</label>
                                <input
                                    name='brand'
                                    value={formData.brand}
                                    onChange={handleChange}
                                    className='w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500'
                                />
                            </div>
                        </div>

                        {/* description */}
                        <div>
                            <label className='block text-xs text-gray-400 mb-1'>Description</label>
                            <textarea
                                name='description'
                                value={formData.description}
                                onChange={handleChange}
                                rows={2}
                                className='w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none'
                            />
                        </div>

                        {/* price + quantity */}
                        <div className='grid grid-cols-2 gap-3'>
                            <div>
                                <label className='block text-xs text-gray-400 mb-1'>Price (Ksh)</label>
                                <input
                                    name='price'
                                    type='number'
                                    value={formData.price}
                                    onChange={handleChange}
                                    className='w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500'
                                />
                            </div>
                            <div>
                                <label className='block text-xs text-gray-400 mb-1'>Quantity</label>
                                <input
                                    name='quantity'
                                    type='number'
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    className='w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500'
                                />
                            </div>
                        </div>

                        {/* category */}
                        <div>
                            <label className='block text-xs text-gray-400 mb-1'>Category</label>
                            <select
                                name='category'
                                value={formData.category}
                                onChange={handleChange}
                                className='w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500'
                            >
                                <option value=''>Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat.categoryId} value={cat.categoryId}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
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

export default EditProductModal