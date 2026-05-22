import { BadgePercent, BarChart, Grid, ListOrdered, PlusCircle, ShoppingBag, ShoppingBasket, ShoppingCart, Ticket } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import CreateProductForm from '../Components/CreateProductForm'
import ProductList from '../Components/ProductList'
import AnalyticsTab from '../Components/AnalyticsTab'
import { useInventoryStore } from '../stores/useInventoryStore'
import CategoriesTab from '../Components/CategoriesTab'
import CreateCategoryForm from './createCategoryForm'
import CategoriesList from './CategoriesList'
import CreateCouponForm from './CreateCouponForm'

const tabs = [
    { id: "create", label: "Create Category", icon: PlusCircle },
    { id: "list", label: "Categories", icon: Grid },
    { id: "coupon", label: "Create Coupons", icon: Ticket },
    { id: "viewCoupon", label: "View Coupons", icon: BadgePercent },
]

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('create')
    const {categories} = useInventoryStore()
   
    // useEffect(()=>{
    //     fetchAllProducts()
    // },[fetchAllProducts])
    
    return (
        <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-3 bg-gray-800 rounded-xl p-4">
          <p className="text-emerald-400 font-semibold mb-4">Manage Categories</p>
      
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-3 py-2 rounded-md mb-2 transition ${
                activeTab === tab.id
                  ? "bg-emerald-600 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </div>
            </button>
          ))}
        </div>
      
        {/* Content */}
        <div className="col-span-9 bg-gray-900 rounded-xl p-6">
          {activeTab === "create" && <CreateCategoryForm />}
          {activeTab === "list" && <CategoriesList />}
          {activeTab === "coupon" && <CreateCouponForm />}
          {activeTab === "list" && <CategoriesList />}
        </div>
      </div>
    )
}

export default AdminPage