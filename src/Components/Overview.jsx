import { DollarSign, Package, ShoppingCart, Tag, Users } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { motion } from "framer-motion";
import { useCustomerStore } from "../stores/useCustomerStore";
import { useEffect } from "react";
import LoadingSpinner from "./loadingSpinner";

const OverviewDashboard = () => {
  const { userProfile } = useUserStore();
  const paidStatuses = ["COMPLETED", "SHIPPED", "DELIVERED"];
  const {
    getDashboardData,
    loading,
    totalOrders,
    completedOrders,
    completed,
    totalRevenue,
    couponCount,
    orders,
    coupons,
    getCoupons,
    page,
    limit,
    getOrders
  } = useCustomerStore();
  //console.log(coupons);
  
  useEffect(() => {
    getDashboardData();
    getCoupons(page,limit)
    getOrders(page,limit)
  }, [getDashboardData]);

  const latestPurchases = completed
    ?.filter((order) => order.status === "COMPLETED")
    .flatMap((order) =>
      order.orderItems.map((item) => ({
        orderItemId: item.orderItemId,
        productName: item.Product.name,
        quantity: item.quantity,
        createdAt: order.createdAt,
        orderNumber: order.orderNumber,
        total: order.total,
      })),
    )
    .slice(0, 5);
  //console.log(coupons);

  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : (
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
          {/* <div
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
        </div> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <AnalyticsCard
              title="Total Orders"
              value={totalOrders.toLocaleString()}
              icon={ShoppingCart}
              color="from-emerald-500 to-teal-700"
            />
            <AnalyticsCard
              title="Total Spent"
              value={`Kes ${totalRevenue}`}
              icon={DollarSign}
              color="from-emerald-500 to-teal-700"
            />
            <AnalyticsCard
              title="Available Coupons"
              value={couponCount.toLocaleString()}
              icon={Tag}
              color="from-emerald-500 to-teal-700"
            />
            <AnalyticsCard
              title="Completed Orders"
              value={completedOrders}
              icon={ShoppingCart}
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
            {orders && orders?.length > 0 ? (
              orders.map((item) => {
                return (
                  <div className="divide-y divide-gray-700" key={item.orderId}>
                    <div
                      className="
                flex
                justify-between
                px-5
                py-4
            "
                    >
                      <div>
                        <p className="text-white">#{item.orderNumber}</p>

                        <p className="text-xs text-gray-400">
                          {new Date(item.createdAt).toLocaleDateString(
                            "en-KE",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>

                      <div className="text-right">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                            item.status === "COMPLETED"
                              ? "bg-emerald-900 text-emerald-300"
                              : item.status === "PENDING_PAYMENT"
                                ? "bg-yellow-900 text-yellow-300"
                                : item.status === "PAYMENT_FAILED"
                                  ? "bg-red-900 text-red-300"
                                  : item.status === "PROCESSING"
                                    ? "bg-blue-900 text-blue-300"
                                    : item.status === "SHIPPED"
                                      ? "bg-indigo-900 text-indigo-300"
                                      : item.status === "DELIVERED"
                                        ? "bg-purple-900 text-purple-300"
                                        : "bg-gray-700 text-gray-300"
                          }`}
                        >
                          {item.status.replace(/_/g, " ")}
                        </span>

                        {paidStatuses.includes(item.status) ? (
                          <p className="mt-2 text-sm font-semibold text-white">
                            Ksh {item.total.toLocaleString()}
                          </p>
                        ) : (
                          <p className="mt-2 text-xs text-gray-500">
                            {item.status === "PENDING_PAYMENT"
                              ? "Awaiting payment"
                              : item.status === "PROCESSING"
                                ? "Payment confirmed"
                                : item.status === "PAYMENT_FAILED"
                                  ? "Payment unsuccessful"
                                  : "No payment"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-6 text-center">
                    <p className="text-sm text-gray-400">
                      No recent orders at the moment.
                    </p>
                  </div>
            )}
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
              <h2 className="text-white font-semibold mb-4">
                Latest Purchases
              </h2>

              <div className="space-y-3">
                {latestPurchases && latestPurchases?.length > 0 ? (
                  latestPurchases.map((purchase) => (
                    <div
                      key={purchase.orderItemId}
                      className="
            flex
            items-center
            justify-between
            border-b
            border-gray-700
            pb-3
            last:border-0
            last:pb-0
          "
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-200">
                          {purchase.productName}
                        </p>

                        <p className="text-xs text-gray-500">
                          {new Date(purchase.createdAt).toLocaleDateString(
                            "en-KE",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>

                      <span
                        className="
              rounded-full
              bg-emerald-900
              px-2.5
              py-1
              text-xs
              font-medium
              text-emerald-300
            "
                      >
                        ×{purchase.quantity}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center">
                    <p className="text-sm text-gray-400">
                      No recent purchases at the moment.
                    </p>
                  </div>
                )}
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

              {coupons && coupons.length > 0 ? (
                <div>
                  <p className="text-emerald-400 text-lg font-bold">{coupons[0]?.code}</p>

                  <p className="text-gray-300 mt-1">{coupons[0]?.discountType === "percentage" ? `${coupons[0]?.discountValue}% discount` : `kes ${coupons[0]?.discountValue} discount`}</p>

                  <p className="text-xs text-gray-500 mt-2">
                  Expires {new Date(coupons[0]?.expirationDate).toLocaleDateString(
                            "en-KE",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                  </p>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-sm text-gray-400">
                    No coupons at the moment.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewDashboard;

const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
  <motion.div
    className={`bg-gray-800 rounded-lg p-5 shadow-lg overflow-hidden relative ${color}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex justify-between items-center">
      <div className="z-10">
        <p className="text-emerald-300 text-sm mb-1 font-semibold">{title}</p>
        <h3 className="text-white text-3xl font-bold">{value}</h3>
      </div>
    </div>
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-900 opacity-30" />
    <div className="absolute -bottom-4 -right-4 text-emerald-800 opacity-50">
      <Icon className="h-32 w-32" />
    </div>
  </motion.div>
);
