import { BarChart, Edit, Grid, ListOrdered, PlusCircle, ShoppingBag, ShoppingBasket, ShoppingCart, User } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInventoryStore } from '../stores/useInventoryStore'
import EditProfile from '../Components/EditProfile'
import ViewProfile from '../Components/ViewProfile'
import MyOrders from '../Components/MyOrders'

const tabs = [
    { id: "create", label: "Edit Profile", icon: Edit },
    { id: "profile", label: "View Profile", icon: User },
    { id: "orders", label: "My Orders", icon: ShoppingCart },
]

const CustomerPage = () => {
    const [activeTab, setActiveTab] = useState('create')
    
    return (
        <div className='min-h-screen relative overflow-hidden'>
            <div className='relative z-10 container mx-auto px-4 py-16'>
                <motion.h1 className='text-4xl font-bold mb-8 text-emerald-400 text-center'
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}>Customer Dashboard</motion.h1>
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
                {activeTab === "create" && <EditProfile/>}
                {activeTab === "profile" && <ViewProfile/>}
                {activeTab === "orders" && <MyOrders/>}
            </div>
        </div>
    )
}

export default CustomerPage