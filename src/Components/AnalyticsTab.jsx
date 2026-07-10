import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { restInstance } from '../lib/axios'
import LoadingSpinner from './loadingSpinner'

const normalizeDailySales = (rawData) => {
  if (!Array.isArray(rawData)) return []

  return rawData.map((item) => {
    const parsedDate = new Date(item.name)
    const isValidDate = !Number.isNaN(parsedDate.getTime())

    return {
      name: isValidDate
        ? parsedDate.toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })
        : String(item.name ?? ''),
      sales: Number(item.sales) || 0,
      revenue: Number(item.revenue) || 0,
    }
  })
}

const formatCurrency = (value) => `Kes ${Number(value).toLocaleString()}`

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-gray-600 bg-gray-900 px-3 py-2 text-sm shadow-lg">
      <p className="mb-2 font-medium text-gray-200">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} style={{ color: entry.color }} className="text-gray-300">
          {entry.name}:{' '}
          {entry.dataKey === 'revenue'
            ? formatCurrency(entry.value)
            : Number(entry.value).toLocaleString()}
        </p>
      ))}
    </div>
  )
}

const AnalyticsTab = () => {
  const [analyticsData, setAnalyticsData] = useState({
    users: 0,
    products: 0,
    totalSales: 0,
    totalRevenue: 0
  })
  const [isLoading, setLoading] = useState(true)
  const [dailySales, setDailySales] = useState([])

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await restInstance.get('/analytics')
        const data = res.data
        setAnalyticsData({
          users: data.users,
          products: data.products,
          totalSales: data.totalSales,
          totalRevenue: data.totalRevenue
        })
        const response = await restInstance.get('/analytics/monthly')
        setDailySales(normalizeDailySales(response.data))        
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  const hasChartActivity = useMemo(
    () => dailySales.some((day) => day.sales > 0 || day.revenue > 0),
    [dailySales],
  )

  const maxSales = useMemo(
    () => Math.max(...dailySales.map((day) => day.sales), 0),
    [dailySales],
  )

  const maxRevenue = useMemo(
    () => Math.max(...dailySales.map((day) => day.revenue), 0),
    [dailySales],
  )

  if (isLoading) return <LoadingSpinner/>
  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <AnalyticsCard
          title='Total Users'
          value={analyticsData.users.toLocaleString()}
          icon={Users}
          color='from-emerald-500 to-teal-700'
        />
        <AnalyticsCard
          title='Total Products'
          value={analyticsData.products.toLocaleString()}
          icon={Package}
          color='from-emerald-500 to-teal-700'
        />
        <AnalyticsCard
          title='Total Sales'
          value={analyticsData.totalSales.toLocaleString()}
          icon={ShoppingCart}
          color='from-emerald-500 to-teal-700'
        />
        <AnalyticsCard
          title='Total Revenue'
          value={`Kes ${analyticsData.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color='from-emerald-500 to-teal-700'
        />
      </div>

      <motion.div
        className='bg-gray-800/60 rounded-lg p-6 shadow-lg'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <ResponsiveContainer width='100%' height={400}>
          <LineChart data={dailySales} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
            <XAxis
              dataKey='name'
              stroke='#D1D5DB'
              tick={{ fontSize: 12 }}
              minTickGap={24}
              interval='preserveStartEnd'
            />
            <YAxis
              yAxisId='left'
              stroke='#10B981'
              tick={{ fontSize: 12 }}
              allowDecimals={false}
              domain={[0, maxSales === 0 ? 1 : Math.ceil(maxSales * 1.2)]}
              tickFormatter={(value) => Number(value).toLocaleString()}
            />
            <YAxis
              yAxisId='right'
              orientation='right'
              stroke='#3B82F6'
              tick={{ fontSize: 12 }}
              domain={[0, maxRevenue === 0 ? 1 : Math.ceil(maxRevenue * 1.2)]}
              tickFormatter={(value) => Number(value).toLocaleString()}
            />
            <Tooltip content={<ChartTooltip />} />
            <Legend />
            <Line
              yAxisId='left'
              type='linear'
              dataKey='sales'
              stroke='#10B981'
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
              name='Sales'
              connectNulls
            />
            <Line
              yAxisId='right'
              type='linear'
              dataKey='revenue'
              stroke='#3B82F6'
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
              name='Revenue'
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
        {!hasChartActivity && (
          <p className="mt-4 text-center text-sm text-gray-400">
            No completed orders in the last 30 days. The chart only includes orders with status COMPLETED.
          </p>
        )}
      </motion.div>
    </div>
  )
}

export default AnalyticsTab

const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
  <motion.div
    className={`bg-gray-800 rounded-lg p-6 shadow-lg overflow-hidden relative ${color}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className='flex justify-between items-center'>
      <div className='z-10'>
        <p className='text-emerald-300 text-sm mb-1 font-semibold'>{title}</p>
        <h3 className='text-white text-3xl font-bold'>{value}</h3>
      </div>
    </div>
    <div className='absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-900 opacity-30' />
    <div className='absolute -bottom-4 -right-4 text-emerald-800 opacity-50'>
      <Icon className='h-32 w-32' />
    </div>
  </motion.div>
);