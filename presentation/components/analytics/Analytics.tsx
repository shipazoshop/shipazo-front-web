"use client";
import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  monthlySalesData,
  topProductsData,
  weeklySalesData,
  categoryDistributionData,
  metricsData,
} from "@/shared/constants/analytics";

export default function Analytics() {
  return (
    <div className="analytics-dashboard">
      <div className="mb-4">
        <h3 className="fw-bold mb-2">Sales Analytics Dashboard</h3>
        <p className="text-muted">
          Overview of your sales performance and key metrics
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-sm-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Total Revenue</p>
                  <h4 className="fw-bold mb-0">
                    ${metricsData.totalRevenue.toLocaleString()}
                  </h4>
                </div>
                <div className="bg-primary bg-opacity-10 p-2 rounded">
                  <i className="icon-dollar-sign text-primary fs-24" />
                </div>
              </div>
              <div className="mt-2">
                <span className="badge bg-success bg-opacity-10 text-success">
                  +{metricsData.growthRate}%
                </span>
                <span className="text-muted small ms-2">vs last year</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Total Orders</p>
                  <h4 className="fw-bold mb-0">
                    {metricsData.totalOrders.toLocaleString()}
                  </h4>
                </div>
                <div className="bg-success bg-opacity-10 p-2 rounded">
                  <i className="icon-cart text-success fs-24" />
                </div>
              </div>
              <div className="mt-2">
                <span className="badge bg-info bg-opacity-10 text-info">
                  2,744 orders
                </span>
                <span className="text-muted small ms-2">this year</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Avg Order Value</p>
                  <h4 className="fw-bold mb-0">
                    ${metricsData.averageOrderValue.toFixed(2)}
                  </h4>
                </div>
                <div className="bg-warning bg-opacity-10 p-2 rounded">
                  <i className="icon-trending-up text-warning fs-24" />
                </div>
              </div>
              <div className="mt-2">
                <span className="badge bg-success bg-opacity-10 text-success">
                  +8.2%
                </span>
                <span className="text-muted small ms-2">vs last month</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Total Profit</p>
                  <h4 className="fw-bold mb-0">
                    ${metricsData.totalProfit.toLocaleString()}
                  </h4>
                </div>
                <div className="bg-danger bg-opacity-10 p-2 rounded">
                  <i className="icon-activity text-danger fs-24" />
                </div>
              </div>
              <div className="mt-2">
                <span className="badge bg-success bg-opacity-10 text-success">
                  +12.5%
                </span>
                <span className="text-muted small ms-2">profit margin</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="row g-3 mb-4">
        {/* Monthly Sales Trend */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Monthly Sales Trend</h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlySalesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#4F46E5"
                    strokeWidth={3}
                    dot={{ fill: "#4F46E5", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Sales by Category</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, value }) => `${category}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="row g-3 mb-4">
        {/* Revenue vs Cost */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Revenue vs Cost Analysis</h5>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlySalesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="cost"
                    stackId="2"
                    stroke="#EF4444"
                    fill="#EF4444"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Weekly Sales */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Last 8 Weeks Performance</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklySalesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="sales" fill="#F59E0B" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="row g-3">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Top 10 Best-Selling Products</h5>

              </div>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Rank</th>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th className="text-end">Units Sold</th>
                      <th className="text-end">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProductsData.map((product, index) => (
                      <tr key={index}>
                        <td>
                          <span className="badge bg-primary">{index + 1}</span>
                        </td>
                        <td className="fw-semibold">{product.name}</td>
                        <td>
                          <span className="badge bg-light text-dark">
                            {product.category}
                          </span>
                        </td>
                        <td className="text-end">
                          {product.units.toLocaleString()}
                        </td>
                        <td className="text-end fw-semibold text-success">
                          ${product.revenue.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
