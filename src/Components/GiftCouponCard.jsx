import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tag, X, ChevronDown, ChevronUp, Loader } from 'lucide-react'
import { useCartStore } from '../stores/useCartStore'

const GiftCouponCard = ({ cartTotal }) => {
    const [userInputCode, setUserInputCode] = useState('')
    const [showPublicCoupons, setShowPublicCoupons] = useState(false)

    const {
        personalCoupon,
        publicCoupons,
        coupon,
        isCouponApplied,
        discountAmount,
        total,
        subTotal,
        validating,
        validateCoupon,
        removeCoupon,
    } = useCartStore()

    // autofill input if user clicks a coupon badge
    const handleSelectCoupon = (code) => {
        setUserInputCode(code)
        setShowPublicCoupons(false)
    }

    const handleApplyCoupon = () => {
        validateCoupon(userInputCode, cartTotal)
    }

    const handleRemoveCoupon = () => {
        removeCoupon()
        setUserInputCode('')
    }

    const formatDiscount = (discountType, discountValue) => {
        if (discountType === 'percentage') return `${discountValue}% off`
        return `Ksh ${discountValue} off`
    }

    const formatExpiry = (date) => {
        return new Date(date).toLocaleDateString('en-KE', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    return (
        <div className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4'>

            {/* title */}
            <div className='flex items-center gap-2'>
                <Tag className='h-5 w-5 text-emerald-400' />
                <h3 className='text-sm font-medium text-gray-300'>
                    Do you have a voucher or gift card?
                </h3>
            </div>

            {/* input + apply button */}
            <div className='flex gap-2'>
                <input
                    type='text'
                    className='block w-full rounded-lg border border-gray-600 bg-gray-700
                    p-2.5 text-sm text-white placeholder-gray-400 focus:border-emerald-500
                    focus:ring-emerald-500 uppercase'
                    placeholder='Enter code here'
                    value={userInputCode}
                    onChange={(e) => setUserInputCode(e.target.value.toUpperCase())}
                    disabled={isCouponApplied}
                />
                <motion.button
                    type='button'
                    className='flex items-center justify-center rounded-lg bg-emerald-600
                    px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700
                    focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:opacity-50
                    disabled:cursor-not-allowed whitespace-nowrap'
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleApplyCoupon}
                    disabled={isCouponApplied || validating}
                >
                    {validating ? (
                        <Loader className='h-4 w-4 animate-spin' />
                    ) : (
                        'Apply Code'
                    )}
                </motion.button>
            </div>

            {/* applied coupon display */}
            <AnimatePresence>
                {isCouponApplied && coupon && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className='rounded-lg border border-emerald-700 bg-emerald-900 bg-opacity-30 p-3'
                    >
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-sm font-medium text-emerald-400'>
                                    ✓ {coupon.code} applied
                                </p>
                                <p className='text-xs text-gray-400 mt-0.5'>
                                    {formatDiscount(coupon.discountType, coupon.discountValue)} — 
                                    You save Ksh {discountAmount}
                                </p>
                            </div>
                            <button
                                onClick={handleRemoveCoupon}
                                className='text-gray-400 hover:text-red-400 transition-colors'
                            >
                                <X className='h-4 w-4' />
                            </button>
                        </div>

                        {/* totals breakdown */}
                        <div className='mt-2 space-y-1 border-t border-emerald-700 pt-2'>
                            <div className='flex justify-between text-xs text-gray-400'>
                                <span>Subtotal</span>
                                <span>Ksh {subTotal}</span>
                            </div>
                            <div className='flex justify-between text-xs text-emerald-400'>
                                <span>Discount</span>
                                <span>- Ksh {discountAmount}</span>
                            </div>
                            <div className='flex justify-between text-sm font-medium text-white'>
                                <span>Total</span>
                                <span>Ksh {total}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* personal coupon */}
            {personalCoupon && !isCouponApplied && (
                <div className='rounded-lg border border-gray-600 bg-gray-700 p-3'>
                    <p className='text-xs text-gray-400 mb-2'>Your personal coupon:</p>
                    <button
                        onClick={() => handleSelectCoupon(personalCoupon.code)}
                        className='w-full flex items-center justify-between rounded-md
                        border border-emerald-700 bg-emerald-900 bg-opacity-30 px-3 py-2
                        hover:bg-opacity-50 transition-colors'
                    >
                        <div className='text-left'>
                            <p className='text-sm font-medium text-emerald-400'>
                                {personalCoupon.code}
                            </p>
                            <p className='text-xs text-gray-400'>
                                {formatDiscount(personalCoupon.discountType, personalCoupon.discountValue)}
                                {personalCoupon.minOrderAmount && (
                                    <span> · Min order Ksh {personalCoupon.minOrderAmount}</span>
                                )}
                            </p>
                        </div>
                        <div className='text-right'>
                            <p className='text-xs text-gray-500'>
                                Expires {formatExpiry(personalCoupon.expirationDate)}
                            </p>
                            <p className='text-xs text-emerald-500 mt-0.5'>
                                Click to apply →
                            </p>
                        </div>
                    </button>
                </div>
            )}

            {/* public coupons */}
            {publicCoupons.length > 0 && !isCouponApplied && (
                <div>
                    <button
                        onClick={() => setShowPublicCoupons(!showPublicCoupons)}
                        className='flex w-full items-center justify-between text-sm
                        text-gray-400 hover:text-gray-300 transition-colors'
                    >
                        <span>Available coupons ({publicCoupons.length})</span>
                        {showPublicCoupons ? (
                            <ChevronUp className='h-4 w-4' />
                        ) : (
                            <ChevronDown className='h-4 w-4' />
                        )}
                    </button>

                    <AnimatePresence>
                        {showPublicCoupons && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className='mt-2 space-y-2 max-h-48 overflow-y-auto pr-1'
                            >
                                {publicCoupons.map((pc) => (
                                    <button
                                        key={pc.couponId}
                                        onClick={() => handleSelectCoupon(pc.code)}
                                        className='w-full flex items-center justify-between
                                        rounded-md border border-gray-600 bg-gray-700 px-3 py-2
                                        hover:border-emerald-600 hover:bg-gray-600 transition-colors'
                                    >
                                        <div className='text-left'>
                                            <p className='text-sm font-medium text-white'>
                                                {pc.code}
                                            </p>
                                            <p className='text-xs text-gray-400'>
                                                {formatDiscount(pc.discountType, pc.discountValue)}
                                                {pc.minOrderAmount && (
                                                    <span> · Min order Ksh {pc.minOrderAmount}</span>
                                                )}
                                            </p>
                                        </div>
                                        <div className='text-right'>
                                            <p className='text-xs text-gray-500'>
                                                Expires {formatExpiry(pc.expirationDate)}
                                            </p>
                                            {pc.maxUses && (
                                                <p className='text-xs text-gray-500 mt-0.5'>
                                                    {pc.maxUses - pc.currentUses} uses left
                                                </p>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    )
}

export default GiftCouponCard

