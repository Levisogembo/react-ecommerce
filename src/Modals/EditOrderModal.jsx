import { useState } from 'react'
import { X, Edit, Save, Upload } from 'lucide-react'
import { useInventoryStore } from '../stores/useInventoryStore'

const EditOrderModal = ({ order, onClose }) => {

    const [formData, setFormData] = useState({
        orderNumber: order.orderNumber || '',
        status: order.status || '',
        paymentMethod: order.paymentMethod || '',
        createdAt: order.createdAt || '',
        paidAt: order.paidAt || '',
        status: order.status || '',
        total: order.total || '',
        isRefunded: order.isRefunded || '',
        transactionId: order.transactionId || '',
        billingAddress: order.billingAddress || '',
        firstName: order.user.firstName || '',
        lastName: order.user.lastName || '',
        orderId: order.orderId || '',

    })
    const orderMap = [
        { id: 1, key: 'PENDING', value: 'PENDING' },
        { id: 2, key: 'PROCESSING', value: 'PROCESSING' },
        { id: 3, key: 'COMPLETED', value: 'COMPLETED' },
        { id: 4, key: 'PAYMENT_FAILED', value: 'PAYMENT_FAILED' },
        { id: 5, key: 'CANCELLED', value: 'CANCELLED' },
        { id: 6, key: 'EXPIRED', value: 'EXPIRED' },
        { id: 7, key: 'REFUNDED', value: 'REFUNDED' },
        { id: 8, key: 'PENDING_PAYMENT', value: 'PENDING_PAYMENT' },
        { id: 9, key: 'SHIPPED', value: 'SHIPPED' },
        { id: 10, key: 'DELIVERED', value: 'DELIVERED' }
    ]
    const { updateCategory } = useInventoryStore()
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log('clicked')
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
                            <p className='text-sm font-medium text-white'>Edit Order</p>
                            <p className='text-xs text-gray-400'>Update order details</p>
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
                                <label className='block text-xs text-gray-400 mb-1'>Order Number</label>
                                <input
                                    name='orderNumber'
                                    value={formData.orderNumber || `${formData.orderId.substring(0, 25)}...`}
                                    readOnly
                                    // onChange={handleChange}
                                    className='w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500'
                                />
                            </div>
                            <div>
                                <label className='block text-xs text-gray-400 mb-1'>Payment Method</label>
                                <input
                                    name='paymentMethod'
                                    value={formData.paymentMethod}
                                    readOnly
                                    //onChange={handleChange}
                                    className='w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500'
                                />
                            </div>
                            <div>
                                <label className='block text-xs text-gray-400 mb-1'>Transaction Id</label>
                                <input
                                    name='transactionId'
                                    value={formData.transactionId || '-'}
                                    readOnly
                                    // onChange={handleChange}
                                    className='w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500'
                                />
                            </div>
                            <div>
                                <label className='block text-xs text-gray-400 mb-1'>Total</label>
                                <input
                                    name='Total'
                                    value={`Kes ${formData.total}`}
                                    readOnly
                                    //onChange={handleChange}
                                    className='w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500'
                                />
                            </div>
                            <div>
                                <label className='block text-xs text-gray-400 mb-1'>Customer Name</label>
                                <input
                                    name='orderNumber'
                                    value={`${formData.firstName} ${formData.lastName}`}
                                    readOnly
                                    // onChange={handleChange}
                                    className='w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500'
                                />
                            </div>
                            <div>
                                <label className='block text-xs text-gray-400 mb-1'>Billing Address</label>
                                <input
                                    name='billingAddress'
                                    value={formData.billingAddress}
                                    readOnly
                                    //onChange={handleChange}
                                    className='w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500'
                                />
                            </div>
                            <div>
                                <label className='block text-xs text-gray-400 mb-1'>Order Status</label>
                                <select
                                    name='order'
                                    value={formData.status}
                                    readOnly
                                    // onChange={handleChange}
                                    className='w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500'
                                >
                                    <option value=''>Select status</option>
                                    {orderMap.map((status) => (
                                        <option key={status.id} value={status.value}>
                                            {status.key}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className='block text-xs text-gray-400 mb-1'>Total</label>
                                <input
                                    name='Total'
                                    value={`Kes ${formData.total}`}
                                    readOnly
                                    //onChange={handleChange}
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
                            disabled={formData.isRefunded || formData.status !== 'COMPLETED'}
                            className={`px-4 py-2 text-sm font-medium text-white rounded-md flex items-center gap-2
    ${formData.isRefunded || formData.status !== 'COMPLETED'
                                    ? 'bg-gray-500 cursor-not-allowed opacity-50'
                                    : 'bg-emerald-600 hover:bg-emerald-700'
                                }`
                            }
                        >
                            <Save className="h-4 w-4" />
                            Refund Order
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditOrderModal