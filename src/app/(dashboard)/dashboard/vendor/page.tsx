
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  ChartNoAxesCombined,
  Settings,
  Search,
  Bell,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Store,
  ChevronDown,
  Menu,
  Wallet,
  Clock3,
  CheckCircle2,
  Truck,
  Star,
} from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "৳ 1,84,500",
    change: "+12.8%",
    positive: true,
    icon: Wallet,
    color: "bg-violet-100 text-violet-600",
  },
  {
    title: "Total Orders",
    value: "1,248",
    change: "+8.2%",
    positive: true,
    icon: ShoppingCart,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Total Products",
    value: "156",
    change: "+4 new",
    positive: true,
    icon: Package,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Pending Orders",
    value: "24",
    change: "-3.5%",
    positive: false,
    icon: Clock3,
    color: "bg-rose-100 text-rose-600",
  },
];

const orders = [
  {
    id: "#ORD-2048",
    customer: "Rahim Ahmed",
    product: "Premium Wireless Headphone",
    date: "Nov 20, 2026",
    amount: "৳ 3,450",
    status: "Processing",
  },
  {
    id: "#ORD-2047",
    customer: "Nusrat Jahan",
    product: "Smart Watch Series 8",
    date: "Nov 20, 2026",
    amount: "৳ 5,200",
    status: "Delivered",
  },
  {
    id: "#ORD-2046",
    customer: "Tanvir Hasan",
    product: "Leather Casual Backpack",
    date: "Nov 19, 2026",
    amount: "৳ 2,850",
    status: "Shipped",
  },
  {
    id: "#ORD-2045",
    customer: "Sadia Islam",
    product: "Wireless Earbuds Pro",
    date: "Nov 19, 2026",
    amount: "৳ 1,990",
    status: "Pending",
  },
  {
    id: "#ORD-2044",
    customer: "Mahmud Karim",
    product: "Mechanical Keyboard",
    date: "Nov 18, 2026",
    amount: "৳ 4,800",
    status: "Delivered",
  },
];

const products = [
  {
    name: "Wireless Headphone",
    category: "Electronics",
    sales: 124,
    price: "৳ 3,450",
    stock: 28,
    image: "🎧",
  },
  {
    name: "Smart Watch Series 8",
    category: "Accessories",
    sales: 98,
    price: "৳ 5,200",
    stock: 15,
    image: "⌚",
  },
  {
    name: "Casual Backpack",
    category: "Fashion",
    sales: 76,
    price: "৳ 2,850",
    stock: 8,
    image: "🎒",
  },
];

const chartData = [32, 48, 40, 68, 54, 85, 72, 92, 65, 80, 56, 96];

const navigation = [
  { name: "Overview", href: "/dashboard/vendor", icon: LayoutDashboard },
  { name: "Products", href: "/dashboard/vendor/products", icon: Package },
  { name: "Orders", href: "/dashboard/vendor/orders", icon: ShoppingCart },
  { name: "Customers", href: "/dashboard/vendor/customers", icon: Users },
  {
    name: "Analytics",
    href: "/dashboard/vendor/analytics",
    icon: ChartNoAxesCombined,
  },
  { name: "Settings", href: "/dashboard/vendor/settings", icon: Settings },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Processing: "bg-amber-50 text-amber-700 ring-amber-200",
    Delivered: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Shipped: "bg-blue-50 text-blue-700 ring-blue-200",
    Pending: "bg-gray-100 text-gray-600 ring-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
        styles[status] || styles.Pending
      }`}
    >
      {status}
    </span>
  );
}

function SalesChart() {
  const points = chartData
    .map((value, index) => {
      const x = 40 + index * 58;
      const y = 190 - value * 1.55;
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `40,190 ${points} 678,190`;

  return (
    <div className="mt-6">
      <div className="flex justify-between text-xs text-gray-400">
        <span>৳ 100k</span>
        <span>৳ 75k</span>
        <span>৳ 50k</span>
        <span>৳ 25k</span>
        <span>৳ 0</span>
      </div>

      <div className="relative mt-2">
        <svg
          viewBox="0 0 700 220"
          className="w-full overflow-visible"
          preserveAspectRatio="none"
        >
          {[35, 75, 115, 155, 190].map((y) => (
            <line
              key={y}
              x1="40"
              y1={y}
              x2="678"
              y2={y}
              stroke="#f0f0f0"
              strokeDasharray="4 5"
            />
          ))}

          <polygon points={areaPoints} fill="url(#salesGradient)" />

          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          <polyline
            points={points}
            fill="none"
            stroke="#7c3aed"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {chartData.map((value, index) => (
            <circle
              key={index}
              cx={40 + index * 58}
              cy={190 - value * 1.55}
              r="3.5"
              fill="#7c3aed"
              stroke="white"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>

      <div className="mt-3 flex justify-between text-xs text-gray-400">
        {["01", "03", "05", "07", "09", "11", "13", "15", "17", "19", "21", "23"].map(
          (day) => (
            <span key={day}>{day}</span>
          )
        )}
      </div>
    </div>
  );
}

export default function VendorDashboard() {
  return (
    <div className="min-h-screen bg-[#f8f9fc] text-gray-800">
      <div className="flex min-h-screen">
        {/* Main Content */}
        <main className="min-w-0 flex-1">

          {/* Page Content */}
          <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
            {/* Heading */}
            <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                  Overview
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Track your store performance and manage your business.
                </p>
              </div>

              <Link
                href="/dashboard/vendor/products/new"
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-violet-200 transition hover:bg-violet-700"
              >
                <Plus size={17} />
                Add Product
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.title}
                    className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">{stat.title}</p>
                      <div className={`rounded-xl p-2.5 ${stat.color}`}>
                        <Icon size={19} />
                      </div>
                    </div>

                    <h3 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
                      {stat.value}
                    </h3>

                    <div className="mt-3 flex items-center gap-1 text-xs">
                      {stat.positive ? (
                        <ArrowUpRight size={14} className="text-emerald-500" />
                      ) : (
                        <ArrowDownRight size={14} className="text-rose-500" />
                      )}
                      <span
                        className={
                          stat.positive
                            ? "font-medium text-emerald-600"
                            : "font-medium text-rose-500"
                        }
                      >
                        {stat.change}
                      </span>
                      <span className="text-gray-400">vs last month</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chart & Side Cards */}
            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
              {/* Revenue Chart */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Revenue Overview
                    </h3>
                    <p className="mt-1 text-xs text-gray-400">
                      Sales performance during this month
                    </p>
                  </div>

                  <select className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs outline-none focus:border-violet-400">
                    <option>This Month</option>
                    <option>This Week</option>
                    <option>This Year</option>
                  </select>
                </div>

                <div className="mt-5 flex items-end gap-3">
                  <h2 className="text-3xl font-bold text-gray-900">
                    ৳ 84,250
                  </h2>
                  <span className="mb-1 flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-600">
                    <ArrowUpRight size={13} /> 12.8%
                  </span>
                </div>

                <SalesChart />
              </div>

              {/* Order summary */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Order Summary</h3>
                  <MoreHorizontal size={19} className="text-gray-400" />
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  Order status overview
                </p>

                <div className="mt-6 space-y-5">
                  {[
                    {
                      label: "Completed",
                      value: 68,
                      count: 845,
                      color: "bg-emerald-500",
                    },
                    {
                      label: "Processing",
                      value: 18,
                      count: 224,
                      color: "bg-violet-500",
                    },
                    {
                      label: "Shipped",
                      value: 10,
                      count: 124,
                      color: "bg-blue-500",
                    },
                    {
                      label: "Pending",
                      value: 4,
                      count: 55,
                      color: "bg-amber-400",
                    },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="mb-2 flex justify-between text-xs">
                        <span className="font-medium text-gray-600">
                          {item.label}
                        </span>
                        <span className="text-gray-400">{item.count}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full ${item.color}`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/dashboard/vendor/orders"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  View all orders <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6">
                <div>
                  <h3 className="font-semibold text-gray-900">Recent Orders</h3>
                  <p className="mt-1 text-xs text-gray-400">
                    Keep track of your latest orders
                  </p>
                </div>
                <Link
                  href="/dashboard/vendor/orders"
                  className="text-xs font-semibold text-violet-600 hover:text-violet-700"
                >
                  View all →
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left">
                  <thead className="border-y border-gray-100 bg-gray-50/70">
                    <tr className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                      <th className="px-6 py-3">Order ID</th>
                      <th className="px-6 py-3">Customer</th>
                      <th className="px-6 py-3">Product</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Amount</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-50">
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="transition hover:bg-gray-50/70"
                      >
                        <td className="px-6 py-4 text-xs font-semibold text-violet-600">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-gray-700">
                          {order.customer}
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500">
                          {order.product}
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-400">
                          {order.date}
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-gray-700">
                          {order.amount}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={order.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Products */}
            <div className="mt-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="flex items-center justify-between p-5 sm:p-6">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Top Selling Products
                  </h3>
                  <p className="mt-1 text-xs text-gray-400">
                    Your best performing products
                  </p>
                </div>
                <Link
                  href="/dashboard/vendor/products"
                  className="text-xs font-semibold text-violet-600 hover:text-violet-700"
                >
                  All products →
                </Link>
              </div>

              <div className="grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {products.map((product) => (
                  <div key={product.name} className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gray-50 text-2xl">
                        {product.image}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-800">
                          {product.name}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {product.category}
                        </p>
                        <p className="mt-2 text-sm font-bold text-gray-900">
                          {product.price}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between border-t border-gray-100 pt-3 text-xs">
                      <span className="text-gray-400">
                        {product.sales} sold
                      </span>
                      <span
                        className={
                          product.stock <= 10
                            ? "font-medium text-rose-500"
                            : "text-gray-500"
                        }
                      >
                        {product.stock} in stock
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 pb-4 text-xs text-gray-400">
              <p>© 2026 MarketHub. Vendor Dashboard.</p>
              <div className="flex gap-4">
                <Link href="#" className="hover:text-gray-600">
                  Help Center
                </Link>
                <Link href="#" className="hover:text-gray-600">
                  Support
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
