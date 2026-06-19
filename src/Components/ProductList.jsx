import React, { useEffect, useState } from "react";
import { useInventoryStore } from "../stores/useInventoryStore";
import { motion } from "framer-motion";
import { Edit, Star, Trash, ChevronLeft, ChevronRight } from "lucide-react";
import EditProductModal from "../Modals/EditProductModal";
import DeleteProductModal from "../Modals/DeleteProductModal";

const ProductList = () => {
  const {
    deleteProduct,
    toggleFeaturedProduct,
    products,
    page,
    limit,
    total,
    fetchAllProducts,
    loading,
    categories,
    categoryOptions
  } = useInventoryStore();
  //console.log(products[0]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [searchOptions, setsearchOptions] = useState({
    productName: "",
    categoryName: "",
  });
  console.log(products);
  
  const totalPages = Math.ceil(total / limit);
  const handlePreviousPage = async () => {
    if (page > 1) {
      await fetchAllProducts(page - 1, limit);
    }
  };

  const handleNextPage = async () => {
    if (page < totalPages) {
      await fetchAllProducts(page + 1, limit);
    }
  };

  const handlePageClick = async (page) => {
    await fetchAllProducts(page, limit);
  };

  const getPaginationRange = (currentPage, totalPages) => {
    const delta = 2; // pages to show on each side of current page

    const range = [];
    const rangeWithDots = [];

    // always show first and last page
    // build range around current page
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    // add first page
    rangeWithDots.push(1);

    // add dots after first page if needed
    if (range[0] > 2) {
      rangeWithDots.push("...");
    }

    // add range around current page
    rangeWithDots.push(...range);

    // add dots before last page if needed
    if (range[range.length - 1] < totalPages - 1) {
      rangeWithDots.push("...");
    }

    // add last page
    if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAllProducts(1, limit, searchOptions);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchOptions, page, limit]);
  //console.log(categoryOptions);
  
  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="px-6 py-4 border-b border-gray-700">
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products..."
              name="productName"
              value={searchOptions.productName}
              onChange={(e) =>
                setsearchOptions((prev) => ({
                  ...prev,
                  productName: e.target.value,
                }))
              }
              className="
                    w-full rounded-lg
                    bg-gray-700
                    border border-gray-600
                    px-4 py-2 pl-10
                    text-sm text-white
                    placeholder-gray-400
                    focus:outline-none
                    focus:border-emerald-500
                    focus:ring-1
                    focus:ring-emerald-500
                "
            />

            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 6 6a7.5 7.5 0 0 0 10.65 10.65Z"
              />
            </svg>
          </div>

          {/* Category filter */}
          <select
            name="categoryName"
            value={searchOptions.categoryName}
            onChange={(e) =>
              setsearchOptions((prev) => ({
                ...prev,
                categoryName: e.target.value,
              }))
            }
            className="
                rounded-lg
                bg-gray-700
                border border-gray-600
                px-4 py-2
                text-sm text-white
                focus:outline-none
                focus:border-emerald-500
            "
          >
            <option value="">All Categories</option>

            {categoryOptions?.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>

          <button
            className="
                rounded-lg
                bg-emerald-600
                px-4 py-2
                text-sm
                font-medium
                text-white
                hover:bg-emerald-700
                transition
            "
          >
            Filter
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Product
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Price
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Category
              </th>

              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Total Stock
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Available Stock
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Sold Stock
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Featured
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {products?.map((product) => (
              //console.log(`${import.meta.env.VITE_API_BASE_URL}/images/${product.images[0].fileName}`),

              <tr key={product.productId} className="hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {product.images?.length > 0 ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={`${import.meta.env.VITE_API_BASE_URL}/images/${product.images[0].fileName}`}
                          alt={product.name}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                          <span className="text-xs text-gray-400">N/A</span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">
                        {product.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    Ksh {product.price}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {product.category?.name ?? "Uncategorized"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {product.quantity}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {product.quantity - product.reservedQuantity}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {product.soldQuantity}
                  </div>
                </td>
                {
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleFeaturedProduct(product.productId)}
                      className={`p-1 rounded-full ${
                        product.isFeatured
                          ? "bg-yellow-400 text-gray-900"
                          : "bg-gray-600 text-gray-300"
                      } hover:bg-yellow-500 transition-colors duration-200`}
                    >
                      <Star className="h-5 w-5" />
                    </button>
                  </td>
                }
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setDeletingProduct(product)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash className="h-5 w-5" />
                    </button>

                    <button
                      onClick={() => setEditingProduct(product)}
                      className="text-green-300 hover:text-green-400"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          categories={categories}
          onClose={() => setEditingProduct(null)}
        />
      )}
      {deletingProduct && (
        <DeleteProductModal
          product={deletingProduct}
          onClose={() => setDeletingProduct(null)}
          onConfirm={() => {
            deleteProduct(deletingProduct.productId);
            setDeletingProduct(null);
          }}
        />
      )}
      {/* pagination controls */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-700">
        {/* info */}
        <div className="text-sm text-gray-400">
          Page {page} of {totalPages || 1}
        </div>

        {/* controls */}
        <div className="flex items-center gap-2">
          {/* prev button */}
          <button
            onClick={handlePreviousPage}
            disabled={page === 1 || loading}
            className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 
        disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* page numbers */}
          {/* {Array.from({ length: totalPages }, (_, i) => i + 1).map((pages) => (
            <button
              key={pages}
              onClick={() => handlePageClick(pages)}
              className={`px-3 py-1 rounded-md text-sm 
            ${page === pages
                  ? 'bg-emerald-600 text-white'           // active page
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'  // inactive
                }`}
            >
              {pages}
            </button>
          ))} */}
          {getPaginationRange(page, totalPages).map((pages, index) =>
            pages === "..." ? (
              // render dots — not clickable
              <span
                key={`dots-${index}`}
                className="px-3 py-1 text-sm text-gray-400"
              >
                ...
              </span>
            ) : (
              // render page button
              <button
                key={pages}
                onClick={() => handlePageClick(pages)}
                className={`px-3 py-1 rounded-md text-sm 
            ${
              page === pages
                ? "bg-emerald-600 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
              >
                {pages}
              </button>
            ),
          )}

          {/* next button */}
          <button
            onClick={handleNextPage}
            disabled={page === totalPages || loading}
            className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 
        disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductList;
