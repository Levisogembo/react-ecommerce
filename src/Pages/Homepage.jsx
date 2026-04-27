import React from 'react'
import CategoryItem from '../Components/CategoryItem'

const categories = [
  {
    id:1,href: "/jeans", name: "Jeans",
  },
  {
    id:2,href: "/bags", name: "Bags",
  },
  {
    id:3,href: "/tshirts", name: "tshirts",
  },
  {
    id:4,href: "/shoes", name: "Shoes"
  },
  {
    id:5,href: "/jackets", name: "Jackets"
  },
  {
    id:6,href: "/suits", name: "Suits"
  }
]

const Homepage = () => {
  return (
    <div className='relative min-h-screen text-white overflow-hidden'>
      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <h1 className='text-center text-5xl sm:text-6x1 font-bold text-emerald-400 mb-4'>Explore Our Categories</h1>
        <p className='text-center text-xl text-gray-300 mb-12'>Discover latest trends</p>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {
            categories.map((category)=>{
             return <CategoryItem category={category} key={category.id}/>
            })
          }
        </div>
      </div>
    </div>
  )
}

export default Homepage