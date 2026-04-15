import { BarChart, Grid, ListOrdered, PlusCircle, ShoppingBag, ShoppingBasket, ShoppingCart } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import CreateProductForm from '../Components/CreateProductForm'
import ProductList from '../Components/ProductList'
import AnalyticsTab from '../Components/AnalyticsTab'
import { useInventoryStore } from '../stores/useInventoryStore'
import CategoriesTab from '../Components/CategoriesTab'
import CreateCategoryForm from './createCategoryForm'

const tabs = [
    { id: "create", label: "Create Category", icon: PlusCircle },
    { id: "categories", label: "Categories", icon: Grid },
]

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('create')
    const {fetchAllProducts} = useInventoryStore()

    useEffect(()=>{
        fetchAllProducts()
    },[fetchAllProducts])
    
    return (
        <div className='min-h-screen relative overflow-hidden'>
            <div className='relative z-10 container mx-auto px-4 py-16'>
                <motion.p className='text-4xl font-bold mb-8 text-emerald-400 text-center'
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}>Categories</motion.p>
                <div className='flex justify-center mb-8'>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 ${activeTab === tab.id
                                    ? "bg-emerald-600 text-white"
                                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                }`}
                        >
                            <tab.icon className='mr-2 h-5 w-5' />
                            {tab.label}
                        </button>
                    ))}
                </div>
                {activeTab === "create" && <CreateCategoryForm/>}
                {activeTab === "products" && <ProductList/>}
                {activeTab === "analytics" && <AnalyticsTab/>}
                {activeTab === "categories" && <CategoriesTab/>}
            </div>
        </div>
    )
}

export default AdminPage