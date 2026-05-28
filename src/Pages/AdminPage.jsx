import { BarChart, Grid, ListOrdered, PlusCircle, ShoppingBag, ShoppingBasket, ShoppingCart } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import CreateProductForm from '../Components/CreateProductForm'
import ProductList from '../Components/ProductList'
import AnalyticsTab from '../Components/AnalyticsTab'
import { useInventoryStore } from '../stores/useInventoryStore'
import CategoriesTab from '../Components/CategoriesTab'
import Orders from '../Components/Orders'
import { useCategoryStore } from '../stores/useCategoryStore'
import { useCartStore } from '../stores/useCartStore'

const tabs = [
    { id: "create", label: "Create Product", icon: PlusCircle },
    { id: "products", label: "Products", icon: ShoppingBasket },
    { id: "categories", label: "Categories and Coupons", icon: Grid },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "analytics", label: "Analytics", icon: BarChart }
]

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('create')
    const {fetchAllProducts, page, limit} = useInventoryStore()
    const {getAllOrders} = useCategoryStore()
    const {getAllCoupons} = useCartStore()

    useEffect(()=>{
        fetchAllProducts(page,limit)
        getAllOrders(page,limit)
        getAllCoupons(page,limit)
    },[fetchAllProducts,getAllOrders,getAllCoupons])
    
    return (
        <div className='min-h-screen relative overflow-hidden'>
            <div className='relative z-10 container mx-auto px-4 py-16'>
                <motion.h1 className='text-4xl font-bold mb-8 text-emerald-400 text-center'
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}>Admin Dashboard</motion.h1>
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
                {activeTab === "create" && <CreateProductForm/>}
                {activeTab === "products" && <ProductList/>}
                {activeTab === "orders" && <Orders/>}
                {activeTab === "analytics" && <AnalyticsTab/>}
                {activeTab === "categories" && <CategoriesTab/>}
            </div>
        </div>
    )
}

export default AdminPage