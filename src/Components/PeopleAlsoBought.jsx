import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import { restInstance } from '../lib/axios'
import toast from 'react-hot-toast'
import LoadingSpinner from './loadingSpinner'
import { useCartStore } from '../stores/useCartStore'

const PeopleAlsoBought = () => {
  // const [recommendations, setRecommendations] = useState([])
  // const [isLoading,setLoading] = useState(true)
  const {recommendations, loading} = useCartStore()

  // useEffect(() => {
  //   const getRecommendations = async () => {
  //     const res = await restInstance.get("/cart/recommendations")
  //     if (res.data.errors) {
  //       toast.error(res.data.errors[0].message)
  //       return
  //     }
  //     setRecommendations(res.data)
  //     setLoading(false)
  //   }
  //   getRecommendations()
  // }, [])
  //console.log(recommendations);
  
  if(loading) return <LoadingSpinner/>
  return (
    <div className='mt-8'>
      <h3 className='text-2xl font-semibold text-emerald-400'>People also bought</h3>
      <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg: grid-cols-3'>
        {recommendations.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>
    </div>
  )
}

export default PeopleAlsoBought