import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MoveRight, Smartphone, CreditCard, ArrowLeft, Loader, CheckCircle, XCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../stores/useCartStore'

const OrderSummary = () => {
	const [phone, setPhone] = useState('')
	const [query, setQuery] = useState("")
	const [results, setResults] = useState([])

	const searchLocation = async (value) => {
		setQuery(value);

		if (!value) {
			setResults([]);
			return;
		}

		try {
			const response = await fetch(
				`https://photon.komoot.io/api/?q=${value}`
			);
			const data = await response.json();
			setResults(data.features || []);
		} catch (error) {
			console.log(error);
		}
	}

	//console.log(results);
	const {
		total,
		subTotal,
		coupon,
		isCouponApplied,
		discountAmount,
		checkoutStep,
		paymentError,
		initiateCheckout,
		selectMpesa,
		initiateMpesaPayment,
		cancelCheckout,
		backToSelection,
	} = useCartStore()
	
	
	const formattedSubtotal = subTotal.toFixed(2)
	const formattedTotal = total.toFixed(2)
	const savings = subTotal - total

	const handleMpesaPayment = () => {
		initiateMpesaPayment({ phone, query })
	}
	const navigate = useNavigate()
	useEffect(()=>{
		if(checkoutStep === 'success'){
			navigate('/checkout/success')
		}
	},[checkoutStep])

	return (
		<motion.div
			className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<p className='text-xl font-semibold text-emerald-400'>Order summary</p>

			{/* order totals — always visible */}
			<div className='space-y-2'>
				<dl className='flex items-center justify-between gap-4'>
					<dt className='text-base font-normal text-gray-300'>Original price</dt>
					<dd className='text-base font-medium text-white'>Ksh {formattedSubtotal}</dd>
				</dl>

				{savings > 0 && (
					<dl className='flex items-center justify-between gap-4'>
						<dt className='text-base font-normal text-gray-300'>Savings</dt>
						<dd className='text-base font-medium text-emerald-400'>-Ksh {savings.toFixed(2)}</dd>
					</dl>
				)}

				{coupon && isCouponApplied && (
					<dl className='flex items-center justify-between gap-4'>
						<dt className='text-base font-normal text-gray-300'>
							Coupon ({coupon.code})
						</dt>
						<dd className='text-base font-medium text-emerald-400'>
							-{coupon.discountType === 'fixed' ? `Kes ${coupon.discountValue}` : `${coupon.discountPercentage}%`}
						</dd>
					</dl>
				)}

				<dl className='flex items-center justify-between gap-4 border-t border-gray-600 pt-2'>
					<dt className='text-base font-bold text-white'>Total</dt>
					<dd className='text-base font-bold text-emerald-400'>Ksh {formattedTotal}</dd>
				</dl>
			</div>

			{/* ── CHECKOUT STEPS ── */}
			<AnimatePresence mode='wait'>
				{/* step 1 — idle: proceed to checkout button */}
				{checkoutStep === 'idle' && (
					<motion.div
						key='idle'
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className='space-y-3'
					>
						<motion.button
							className='flex w-full items-center justify-center rounded-lg
                            bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white
                            hover:bg-emerald-700 focus:outline-none focus:ring-4
                            focus:ring-emerald-300'
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={initiateCheckout}
						>
							Proceed to Checkout
						</motion.button>

						<div className='flex items-center justify-center gap-2'>
							<span className='text-sm font-normal text-gray-400'>or</span>
							<Link
								to='/'
								className='inline-flex items-center gap-2 text-sm font-medium
                                text-emerald-400 underline hover:text-emerald-300 hover:no-underline'
							>
								Continue Shopping
								<MoveRight size={16} />
							</Link>
						</div>
					</motion.div>
				)}

				{/* step 2 — selecting: payment method selection */}
				{checkoutStep === 'selecting' && (
					<motion.div
						key='selecting'
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className='space-y-3'
					>
						<p className='text-sm font-medium text-gray-300 text-center'>
							Select payment method
						</p>

						<div className='grid grid-cols-2 gap-3'>
							{/* mpesa option */}
							<motion.button
								className='flex flex-col items-center justify-center gap-2
                                rounded-lg border border-gray-600 bg-gray-700 p-4
                                hover:border-emerald-500 hover:bg-gray-600 transition-colors'
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={selectMpesa}
							>
								<Smartphone className='h-8 w-8 text-emerald-400' />
								<span className='text-sm font-medium text-white'>MPesa</span>
								<span className='text-xs text-gray-400'>STK Push</span>
							</motion.button>

							{/* stripe option — disabled for now */}
							<motion.button
								className='flex flex-col items-center justify-center gap-2
                                rounded-lg border border-gray-600 bg-gray-700 p-4
                                opacity-50 cursor-not-allowed'
								disabled
							>
								<CreditCard className='h-8 w-8 text-blue-400' />
								<span className='text-sm font-medium text-white'>Card</span>
								<span className='text-xs text-gray-400'>Coming soon</span>
							</motion.button>
						</div>

						<button
							onClick={cancelCheckout}
							className='flex items-center gap-1 text-sm text-gray-400
                            hover:text-gray-300 transition-colors mx-auto'
						>
							<ArrowLeft className='h-4 w-4' />
							Back to cart
						</button>
					</motion.div>
				)}

				{/* step 3 — mpesa: phone number input */}
				{checkoutStep === 'mpesa' && (
					<motion.div
						key='mpesa'
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className='space-y-3'
					>
						<div className='flex items-center gap-2'>
							<Smartphone className='h-5 w-5 text-emerald-400 flex-shrink-0' />
							<p className='text-sm font-medium text-gray-300'>
								Enter your Safaricom number
							</p>
						</div>

						<input
							type='tel'
							className='block w-full rounded-lg border border-gray-600
                            bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400
                            focus:border-emerald-500 focus:ring-emerald-500'
							placeholder='07XX XXX XXX'
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							maxLength={12}
						/>

						<input
							type="text"
							placeholder="Enter shipping address"
							value={query}
							onChange={(e) => searchLocation(e.target.value)}
							className="block w-full rounded-lg border border-gray-600
				bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400
				focus:border-emerald-500 focus:ring-emerald-500"
						/>
						{results.length > 0 && (
							<div className="absolute z-10 mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 max-h-60 overflow-y-auto">
								{results.map((place, index) => (
									<div
										key={index}
										onClick={() => {
											const completedAddress = place.properties.city ?
												`${place.properties.name}, ${place.properties.city}, ${place.properties.country}` :
												`${place.properties.name}, ${place.properties.country}`
											setQuery(completedAddress || "");

											setResults([]);

											// console.log({
											// 	address: place.properties.name,
											// 	city: place.properties.city,
											// 	country: place.properties.country,
											// 	lon: place.geometry.coordinates[0],
											// 	lat: place.geometry.coordinates[1],
											// });
										}}
										className="cursor-pointer p-3 text-sm text-white hover:bg-gray-700"
									>
										{place.properties.name}
										{place.properties.city && `, ${place.properties.city}`}
										{place.properties.country && `, ${place.properties.country}`}
									</div>
								))}
							</div>
						)}
						<p className='text-xs text-gray-500'>
							You will receive an STK push on your phone to confirm
							payment of <span className='text-emerald-400 font-medium'>
								Ksh {formattedTotal}
							</span>
						</p>

						<motion.button
							className='flex w-full items-center justify-center gap-2
                            rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium
                            text-white hover:bg-emerald-700 focus:outline-none focus:ring-4
                            focus:ring-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed'
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={handleMpesaPayment}
							disabled={!phone.trim()}
						>
							<Smartphone className='h-4 w-4' />
							Pay Ksh {formattedTotal} via MPesa
						</motion.button>

						<button
							onClick={backToSelection}
							className='flex items-center gap-1 text-sm text-gray-400
                            hover:text-gray-300 transition-colors mx-auto'
						>
							<ArrowLeft className='h-4 w-4' />
							Back to payment methods
						</button>
					</motion.div>
				)}

				{/* step 4 — processing: waiting for mpesa confirmation */}
				{checkoutStep === 'processing' && (
					<motion.div
						key='processing'
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className='space-y-4 text-center'
					>
						<div className='flex flex-col items-center gap-3 py-4'>
							<div className='relative'>
								<Smartphone className='h-12 w-12 text-emerald-400' />
								<Loader className='h-5 w-5 text-emerald-300 animate-spin
                                absolute -top-1 -right-1' />
							</div>

							<div>
								<p className='text-sm font-medium text-white'>
									Waiting for MPesa confirmation
								</p>
								<p className='text-xs text-gray-400 mt-1'>
									Check your phone for the MPesa prompt and
									enter your PIN to complete payment
								</p>
							</div>

							<div className='flex items-center gap-2 text-xs text-gray-500'>
								<Loader className='h-3 w-3 animate-spin' />
								<span>Checking payment status...</span>
							</div>
						</div>

						<button
							onClick={cancelCheckout}
							className='text-sm text-red-400 hover:text-red-300
                            transition-colors'
						>
							Cancel payment
						</button>
					</motion.div>
				)}

				{/* step 5 — success */}
				{/* {checkoutStep === 'success' && (
					<motion.div
						key='success'
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0 }}
						className='space-y-4 text-center py-4'
					>
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ type: 'spring', stiffness: 200, damping: 15 }}
							className='flex justify-center'
						>
							<CheckCircle className='h-16 w-16 text-emerald-400' />
						</motion.div>

						<div>
							<p className='text-lg font-semibold text-white'>
								Payment confirmed!
							</p>
							<p className='text-sm text-gray-400 mt-1'>
								Your order has been placed successfully
							</p>
						</div>

						<Link
							to='/'
							className='flex w-full items-center justify-center gap-2
                            rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium
                            text-white hover:bg-emerald-700'
						>
							Continue Shopping
							<MoveRight size={16} />
						</Link>
					</motion.div>
				)} */}

				{/* step 6 — failed */}
				{checkoutStep === 'failed' && (
					<motion.div
						key='failed'
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
						className='space-y-4'
					>
						<div className='flex flex-col items-center gap-3 py-2 text-center'>
							<XCircle className='h-12 w-12 text-red-400' />
							<div>
								<p className='text-sm font-medium text-white'>
									Payment failed
								</p>
								{paymentError && (
									<p className='text-xs text-red-400 mt-1'>
										{paymentError}
									</p>
								)}
							</div>
						</div>

						<div className='grid grid-cols-2 gap-3'>
							<button
								onClick={backToSelection}
								className='flex items-center justify-center gap-1
                                rounded-lg border border-gray-600 px-4 py-2.5 text-sm
                                font-medium text-gray-300 hover:bg-gray-700 transition-colors'
							>
								Try again
							</button>
							<button
								onClick={cancelCheckout}
								className='flex items-center justify-center gap-1
                                rounded-lg border border-red-800 px-4 py-2.5 text-sm
                                font-medium text-red-400 hover:bg-red-900 hover:bg-opacity-30
                                transition-colors'
							>
								Cancel
							</button>
						</div>
					</motion.div>
				)}

			</AnimatePresence>
		</motion.div>
	)
}

export default OrderSummary