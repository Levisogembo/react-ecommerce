import React, { useEffect } from "react";
import { useCategoryStore } from "../stores/useCategoryStore";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../Components/ProductCard";
import { Loader } from "lucide-react";
import LoadingSpinner from "../Components/loadingSpinner";

const CategoryPage = () => {
  const { loading, categoryProducts, getProductsByCategory, categoryLoading } =
    useCategoryStore();
  const { category } = useParams();

  useEffect(() => {
    getProductsByCategory(category);
  }, [getProductsByCategory, category]);

  return (
    <div className="min-h-screen">
      {categoryLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="relative z-10 max-w-screen-x1 mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.h1
            className="text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </motion.h1>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {categoryProducts && categoryProducts.length === 0 && (
              <h2 className="text-3xl font-semibold text-gray-300 text-center col-span-full">
                No products found
              </h2>
            )}
            {categoryProducts &&
              categoryProducts.length > 0 &&
              categoryProducts.map((product) => {
                return (
                  <ProductCard key={product.productId} product={product} />
                );
              })}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
