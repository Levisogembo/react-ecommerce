import { useState } from 'react'
import { X, Edit, Save, Upload } from 'lucide-react'
import { useInventoryStore } from '../stores/useInventoryStore'
import dayjs from 'dayjs'
import { useCartStore } from '../stores/useCartStore'

const EditCouponModal = ({ coupon, onClose }) => {
    const [formData, setFormData] = useState({
        code: coupon.code || '',
        discountType: coupon.discountType || '',
        discountValue: coupon.discountValue || '',
        expirationDate: coupon.expirationDate || '',
        maxUses: coupon.maxUses || '',
        minOrderAmount: coupon.minOrderAmount || '',
    })
    const couponMap = [
        { id: 1, key: 'Percentage', value: 'percentage' },
        { id: 2, key: 'Fixed', value: 'fixed' },
    ]
    const { editCoupon } = useCartStore()
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        editCoupon(coupon.couponId,formData)
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
                            <p className='text-sm font-medium text-white'>Edit Coupon</p>
                            <p className='text-xs text-gray-400'>Update coupon details</p>
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
                                <label className='block text-xs text-gray-400 mb-1'>Coupon Code</label>
                                <input
                                    name='code'
                                    value={formData.code}
                                    onChange={handleChange}
                                    className='w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500'
                                />
                            </div>
                            <div>
                                <label className='block text-xs text-gray-400 mb-1'>Discount Type</label>
                                <select
                                    name='discountType'
                                    value={formData.discountType}
                                    //readOnly
                                    onChange={handleChange}
                                    className='w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500'
                                >
                                    <option value=''>Select discount type</option>
                                    {couponMap.map((status) => (
                                        <option key={status.id} value={status.value}>
                                            {status.key}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className='block text-xs text-gray-400 mb-1'>Discount Value</label>
                                <input
                                    type='number'
                                    name='discountValue'
                                    value={formData.discountValue || '-'}
                                    //readOnly
                                    onChange={handleChange}
                                    className='w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500'
                                />
                            </div>
                            <div>
                                <label className='block text-xs text-gray-400 mb-1'>Expiration Date</label>
                                <input
                                    type='date'
                                    name='expirationDate'
                                    value={`${dayjs(formData.expirationDate).format('YYYY-MM-DD') }`}
                                    //readOnly
                                    onChange={handleChange}
                                    className='w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500'
                                />
                            </div>
                            <div>
                                <label className='block text-xs text-gray-400 mb-1'>Max Uses</label>
                                <input
                                    type='number'
                                    name='maxUses'
                                    value={formData.maxUses}
                                    //readOnly
                                    onChange={handleChange}
                                    className='w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500'
                                />
                            </div>
                            <div>
                                <label className='block text-xs text-gray-400 mb-1'>Minimum Order Amount</label>
                                <input
                                    type='number'
                                    name='minOrderAmount'
                                    value={formData.minOrderAmount}
                                    //readOnly
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
                            type="submit"
                            //disabled={formData.isRefunded || formData.status !== 'COMPLETED'}
                            className={`px-4 py-2 text-sm font-medium text-white rounded-md flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700`
                            }
                        >
                            <Save className="h-4 w-4" />
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditCouponModal