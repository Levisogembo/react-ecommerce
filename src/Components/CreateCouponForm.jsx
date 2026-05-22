import React, { useEffect } from 'react'
import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Loader } from "lucide-react";
import toast from 'react-hot-toast';
import { useCategoryStore } from '../stores/useCategoryStore';

//const categories = ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"];

const CreateCouponForm = () => {

    const [newCoupon, setNewCoupon] = useState({
        code: "",
        discountType: "",
        discountValue: "",
        expirationDate: "",
        maxUses: "",
        minOrderAmount: "",
    })

    const { loading, createCoupon } = useCategoryStore()

    const handleSubmit = async (e) => {
        e.preventDefault()
        await createCoupon(newCoupon)
        setNewCoupon({
            code: "",
            discountType: "",
            discountValue: "",
            expirationDate: "",
            maxUses: "",
            minOrderAmount: "",
        })
    }
    return (
        <motion.div
            className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <h2 className='text-2xl font-semibold mb-6 text-emerald-300'>Create Coupon</h2>
            <form onSubmit={handleSubmit} className='space-y-4' >
                <div>
                    <label htmlFor='code' className='block text-sm font-medium text-gray-300'>
                        Code
                    </label>
                    <input
                        type='text'
                        id='code'
                        name='code'
                        value={newCoupon.code}
                        onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                        className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500'
                        required
                    />
                </div>

                <div>
                    <label htmlFor='discountType' className='block text-sm font-medium text-gray-300'>
                        Discount Type
                    </label>
                    <select
                        id='discountType'
                        name='discountType'
                        value={newCoupon.discountType}
                        onChange={(e) =>
                            setNewCoupon({
                                ...newCoupon,
                                discountType: e.target.value,
                            })
                        }
                        className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
    shadow-sm py-2 px-3 text-white focus:outline-none 
    focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                        required
                    >
                        <option value=''>Select discount type</option>
                        <option value='percentage'>Percentage</option>
                        <option value='fixed'>Fixed</option>
                    </select>
                </div>

                <div>
                    <label htmlFor='discountValue' className='block text-sm font-medium text-gray-300'>
                        Discount Value
                    </label>
                    <input
                        type='number'
                        id='discountValue'
                        name='discountValue'
                        value={newCoupon.discountValue}
                        onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: e.target.value })}
                        className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500'
                        required
                    />
                </div>

                <div>
                    <label htmlFor='expirationDate' className='block text-sm font-medium text-gray-300'>
                        Expiration Date
                    </label>
                    <input
                        type='date'
                        id='expirationDate'
                        name='expirationDate'
                        value={newCoupon.expirationDate}
                        onChange={(e) => setNewCoupon({ ...newCoupon, expirationDate: e.target.value })}
                        className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500'
                        required
                    />
                </div>

                <div>
                    <label htmlFor='maxUses' className='block text-sm font-medium text-gray-300'>
                        Maximum Uses
                    </label>
                    <input
                        type='number'
                        id='maxUses'
                        name='maxUses'
                        value={newCoupon.maxUses}
                        onChange={(e) => setNewCoupon({ ...newCoupon, maxUses: e.target.value })}
                        className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500'
                        required
                    />
                </div>


                <div>
                    <label htmlFor='minOrderAmount' className='block text-sm font-medium text-gray-300'>
                        Minimum Order Amount
                    </label>
                    <input
                        type='number'
                        id='minOrderAmount'
                        name='minOrderAmount'
                        value={newCoupon.minOrderAmount}
                        onChange={(e) => setNewCoupon({ ...newCoupon, minOrderAmount: e.target.value })}
                        className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500'
                        required
                    />
                </div>
                <button
                    type='submit'
                    className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
					shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50'
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
                            Loading...
                        </>
                    ) : (
                        <>
                            <PlusCircle className='mr-2 h-5 w-5' />
                            Create Coupon
                        </>
                    )}
                </button>
            </form>
        </motion.div>
    )
}

export default CreateCouponForm