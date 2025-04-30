import React, { useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useAdminStore } from '../../Store/adminStore';
import '../../Styles/AdminDash.css';

function AdminDash() {
    const { metrics, postTrends, productStatus, loading, error, fetchDashboardData} = useAdminStore();
    const adminId = JSON.parse(localStorage.getItem('user'))?.user_id || 1;

    useEffect(() => {
        fetchDashboardData(adminId);
    }, [adminId, fetchDashboardData]);

    const postChartOptions = {
        chart: {
            type: 'bar',
            height: 300,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
            },
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories: ['Approved', 'Pending', 'Rejected'],
        },
        colors: ['#36b9cc', '#f6c23e', '#e74a3b'],
        tooltip: {
            y: {
                formatter: val => `${val} posts`,
            },
        },
    };

    const postChartSeries = [{
        name: 'Post Approval Status',
        data: [postTrends.approved || 0, postTrends.pending || 0, postTrends.rejected || 0],
    }];

    const productChartOptions = {
        chart: {
            type: 'pie',
            height: 300,
        },
        labels: ['Approved', 'Pending', 'Rejected'],
        colors: ['#36b9cc', '#f6c23e', '#e74a3b'],
        legend: {
            position: 'bottom',
        },
        tooltip: {
            y: {
                formatter: val => `${val} products`,
            },
        },
    };

    const productChartSeries = [productStatus.approved || 0, productStatus.pending || 0, productStatus.rejected || 0];

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                <h1 className="dashboard-title">Admin Dashboard</h1>

                {loading ? (
                    <div className="loading">Loading...</div>
                ) : error ? (
                    <div className="error">{error}</div>
                ) : (
                    <>
                        {/* Metrics Cards */}
                        <div className="metrics-grid">
                            <div className="metric-card">
                                <h2 className="metric-title">Total Users</h2>
                                <p className="metric-value users">{metrics.users || 0}</p>
                            </div>
                            <div className="metric-card">
                                <h2 className="metric-title">Total Posts</h2>
                                <p className="metric-value posts">{metrics.posts || 0}</p>
                                <p className="metric-subtext">Pending: {metrics.pendingPosts || 0}</p>
                            </div>
                            <div className="metric-card">
                                <h2 className="metric-title">Total Products</h2>
                                <p className="metric-value products">{metrics.products || 0}</p>
                                <p className="metric-subtext">Pending: {metrics.pendingProducts || 0}</p>
                            </div>
                            <div className="metric-card">
                                <h2 className="metric-title">Total Videos</h2>
                                <p className="metric-value videos">{metrics.videos || 0}</p>
                            </div>
                            <div className="metric-card">
                                <h2 className="metric-title">Total Comments</h2>
                                <p className="metric-value comments">{metrics.comments || 0}</p>
                            </div>
                            <div className="metric-card">
                                <h2 className="metric-title">Total Likes</h2>
                                <p className="metric-value likes">{metrics.likes || 0}</p>
                            </div>
                            <div className="metric-card">
                                <h2 className="metric-title">Total Orders</h2>
                                <p className="metric-value orders">{metrics.orders || 0}</p>
                            </div>
                            <div className="metric-card">
                                <h2 className="metric-title">Total Replies</h2>
                                <p className="metric-value replies">{metrics.replies || 0}</p>
                            </div>
                        </div>

                        {/* Charts */}
                        <div className="charts-grid">
                            <div className="chart-card">
                                <h2 className="chart-title">Post Approval Status</h2>
                                <div className="chart-container">
                                    <Chart
                                        options={postChartOptions}
                                        series={postChartSeries}
                                        type="bar"
                                        height={300}
                                    />
                                </div>
                            </div>
                            <div className="chart-card">
                                <h2 className="chart-title">Product Approval Status</h2>
                                <div className="chart-container">
                                    <Chart
                                        options={productChartOptions}
                                        series={productChartSeries}
                                        type="pie"
                                        height={300}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default AdminDash;