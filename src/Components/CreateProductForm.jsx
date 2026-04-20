import React, { useEffect } from 'react'
import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useInventoryStore } from '../stores/useInventoryStore';
import toast from 'react-hot-toast';

//const categories = ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"];

const CreateProductForm = () => {

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    brand: "",
    price: "",
    quantity: "",
    category: "",
    file: null,
  })

  const { loading, categoryOptions, fetchCategoryOptions, createProduct } = useInventoryStore()
  useEffect(() => {
    if (categoryOptions.length === 0) {
      fetchCategoryOptions()
    }
  }, [])
  //console.log(categoryOptions);

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newProduct.file) {
      toast.error('Please upload an image for the product')
      return
    }
    await createProduct(newProduct)
    setNewProduct({
      name: "",
      description: "",
      brand: "",
      price: "",
      quantity: "",
      category: "",
      file: null,
    })

  }
  return (
    <motion.div
      className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className='text-2xl font-semibold mb-6 text-emerald-300'>Create New Product</h2>
      <form onSubmit={handleSubmit} className='space-y-4' >
        <div>
          <label htmlFor='name' className='block text-sm font-medium text-gray-300'>
            Product Name
          </label>
          <input
            type='text'
            id='name'
            name='name'
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500'
            required
          />
        </div>

        <div>
          <label htmlFor='brand' className='block text-sm font-medium text-gray-300'>
            Brand
          </label>
          <input
            type='text'
            id='brand'
            name='brand'
            value={newProduct.brand}
            onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
            className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500'
            required
          />
        </div>

        <div>
          <label htmlFor='description' className='block text-sm font-medium text-gray-300'>
            Description
          </label>
          <textarea
            id='description'
            name='description'
            rows='3'
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
						 py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 
						 focus:border-emerald-500'
            required
          />
        </div>

        <div>
          <label htmlFor='price' className='block text-sm font-medium text-gray-300'>
            Price
          </label>
          <input
            type='number'
            id='price'
            name='price'
            step='0.01'
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
						py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
						 focus:border-emerald-500'
            required
          />
        </div>

        <div>
          <label htmlFor='quantity' className='block text-sm font-medium text-gray-300'>
            Quantity
          </label>
          <input
            type='number'
            id='quantity'
            name='quantity'
            step='0.01'
            value={newProduct.quantity}
            onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
            className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
						py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
						 focus:border-emerald-500'
            required
          />
        </div>

        <div>
          <label htmlFor='category' className='block text-sm font-medium text-gray-300'>
            Category
          </label>
          <select
            id='category'
            name='category'
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
						 shadow-sm py-2 px-3 text-white focus:outline-none 
						 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
            required
          >
            <option value=''>Select a category</option>
            {loading ? <option disabled>Loading...</option> : categoryOptions.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className='mt-1 flex items-center'>
          <input type='file' id='file' className='sr-only' accept='image/*' onChange={(e) => setNewProduct({ ...newProduct, file: e.target.files[0] })} />
          <label
            htmlFor='file'
            className='cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
          >
            <Upload className='h-5 w-5 inline-block mr-2' />
            Upload Image
          </label>
          {newProduct.file && <span className='ml-3 text-sm text-gray-400'>{newProduct.file.name}</span>}
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
              Create Product
            </>
          )}
        </button>
      </form>
    </motion.div>
  )
}

export default CreateProductForm