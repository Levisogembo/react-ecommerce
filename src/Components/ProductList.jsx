import React from 'react'
import { useInventoryStore } from '../stores/useInventoryStore'
import { motion } from 'framer-motion'
import { Edit, Star, Trash } from 'lucide-react'

const ProductList = () => {
  const { deleteProduct, toggleFeaturedProduct, products } = useInventoryStore()
  //console.log(products[0]);

  return (
    <motion.div className='bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}>
      <table className='min-w-full divide-y divide-gray-700'>
        <thead className='bg-gray-700'>
          <tr>
            <th
              scope='col'
              className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
            >
              Product
            </th>
            <th
              scope='col'
              className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
            >
              Price
            </th>
            <th
              scope='col'
              className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
            >
              Category
            </th>

            <th
              scope='col'
              className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
            >
              Total Stock
            </th>
            <th
              scope='col'
              className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
            >
              Available Stock
            </th>
            <th
              scope='col'
              className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
            >
              Featured
            </th>
            <th
              scope='col'
              className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className='bg-gray-800 divide-y divide-gray-700'>
          {products?.map((product) => (
            <tr key={product.productId} className='hover:bg-gray-700'>
              <td className='px-6 py-4 whitespace-nowrap'>
                <div className='flex items-center'>
                  <div className='flex-shrink-0 h-10 w-10'>
                    {product.images?.length > 0 ? (
                      <img
                        className='h-10 w-10 rounded-full object-cover'
                        src={`${import.meta.env.VITE_API_BASE_URL}/images/${product.images[0].fileName}`}
                        alt={product.name}
                      />
                    ) : (
                      <div className='h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center'>
                        <span className='text-xs text-gray-400'>N/A</span>
                      </div>
                    )}
                  </div>
                  <div className='ml-4'>
                    <div className='text-sm font-medium text-white'>{product.name}</div>
                  </div>
                </div>
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>
                <div className='text-sm text-gray-300'>Ksh {product.price.toFixed(2)}</div>
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>
                <div className='text-sm text-gray-300'>{product.category.name}</div>
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>
                <div className='text-sm text-gray-300'>{product.quantity}</div>
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>
                <div className='text-sm text-gray-300'>{product.quantity - product.reservedQuantity}</div>
              </td>
              {<td className='px-6 py-4 whitespace-nowrap'>
                <button
                  onClick={() => toggleFeaturedProduct(product.productId)}
                  className={`p-1 rounded-full ${product.isFeatured ? "bg-yellow-400 text-gray-900" : "bg-gray-600 text-gray-300"
                    } hover:bg-yellow-500 transition-colors duration-200`}
                >
                  <Star className='h-5 w-5' />
                </button>
              </td>}
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                <div className='flex items-center gap-3'>
                  <button
                    onClick={() => deleteProduct(product.productId)}
                    className='text-red-400 hover:text-red-300'
                  >
                    <Trash className='h-5 w-5' />
                  </button>

                  <button
                    onClick={() => deleteProduct(product.productId)}
                    className='text-green-300 hover:text-green-400'
                  >
                    <Edit className='h-5 w-5' />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  )
}

export default ProductList