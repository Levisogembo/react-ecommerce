import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { motion } from 'framer-motion'

const OverviewDashboard = () => {
  const { userProfile } = useUserStore();
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {userProfile?.firstName} 👋
        </h1>

        <p className="text-gray-400 mt-1">
          Here's an overview of your account activity
        </p>
      </div>

      {/* Stats */}
      <div
        className="
        grid 
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
        gap-4
    "
      >
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <p className="text-sm text-gray-400">Total Orders</p>

          <p className="text-2xl text-white font-bold mt-2">12</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <p className="text-sm text-gray-400">Total Spent</p>

          <p className="text-2xl text-emerald-400 font-bold mt-2">Ksh 45,000</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <p className="text-sm text-gray-400">Available Coupons</p>

          <p className="text-2xl text-white font-bold mt-2">3</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <p className="text-sm text-gray-400">Completed Orders</p>

          <p className="text-2xl text-white font-bold mt-2">8</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AnalyticsCard
          title="Total Users"
          //value={analyticsData.users.toLocaleString()}
          icon={Users}
          color="from-emerald-500 to-teal-700"
        />
        <AnalyticsCard
          title="Total Products"
          //value={analyticsData.products.toLocaleString()}
          icon={Package}
          color="from-emerald-500 to-teal-700"
        />
        <AnalyticsCard
          title="Total Sales"
          //value={analyticsData.totalSales.toLocaleString()}
          icon={ShoppingCart}
          color="from-emerald-500 to-teal-700"
        />
        <AnalyticsCard
          title="Total Revenue"
          //value={`Kes ${analyticsData.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="from-emerald-500 to-teal-700"
        />
      </div>

      {/* Recent Orders */}
      <div
        className="
        bg-gray-800
        border border-gray-700
        rounded-xl
        overflow-hidden
    "
      >
        <div className="px-5 py-4 border-b border-gray-700">
          <h2 className="text-white font-semibold">Recent Orders</h2>
        </div>

        <div className="divide-y divide-gray-700">
          <div
            className="
                flex
                justify-between
                px-5
                py-4
            "
          >
            <div>
              <p className="text-white">#ORD1023</p>

              <p className="text-xs text-gray-400">30 Jun 2026</p>
            </div>

            <div className="text-right">
              <span
                className="
                        bg-emerald-900
                        text-emerald-300
                        px-2
                        py-1
                        rounded-full
                        text-xs
                    "
              >
                Completed
              </span>

              <p className="text-white mt-1">Ksh 3000</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom cards */}

      <div
        className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-5
    "
      >
        {/* Most bought */}

        <div
          className="
            bg-gray-800
            border border-gray-700
            rounded-xl
            p-5
        "
        >
          <h2 className="text-white font-semibold mb-4">Shopping Summary</h2>

          <div className="space-y-3">
            <div
              className="
                    flex
                    justify-between
                    text-sm
                "
            >
              <span className="text-gray-300">Leather Jacket</span>

              <span className="text-gray-400">x3</span>
            </div>
          </div>
        </div>

        {/* Coupon */}

        <div
          className="
            bg-gray-800
            border border-gray-700
            rounded-xl
            p-5
        "
        >
          <h2 className="text-white font-semibold mb-4">Latest Coupon</h2>

          <div>
            <p className="text-emerald-400 text-lg font-bold">SAVE20</p>

            <p className="text-gray-300 mt-1">20% discount</p>

            <p className="text-xs text-gray-500 mt-2">Expires July 20, 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewDashboard;

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