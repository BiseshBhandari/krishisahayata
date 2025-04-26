import React, { useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useAdminStore } from '../../Store/adminStore';
import '../../Styles/AdminDash.css';

function AdminDash() {
    const { metrics, pendingItems, postTrends, productStatus, loading, error, fetchDashboardData, approvePost, deletePost, approveProduct, deleteProduct } = useAdminStore();
    const adminId = JSON.parse(localStorage.getItem('user'))?.user_id || 1; // Replace with actual admin ID from auth

    useEffect(() => {
        fetchDashboardData(adminId);
    }, [adminId, fetchDashboardData]);

    // Bar Chart Options and Series for Post Approval Status
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

    // Pie Chart Options and Series for Product Status
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

                        {/* Pending Items */}
                        <div className="pending-card">
                            <h2 className="pending-title">Pending Approval</h2>
                            <div className="pending-sections">
                                <div className="pending-section">
                                    <h3 className="pending-subtitle">Pending Posts</h3>
                                    {pendingItems.posts?.length > 0 ? (
                                        <ul className="pending-list">
                                            {pendingItems.posts.map(post => (
                                                <li key={post.post_id} className="pending-item">
                                                    <div className="pending-details">
                                                        <p>
                                                            <strong>{post.User?.name || 'Unknown'}</strong>: {post.content?.substring(0, 50)}...
                                                        </p>
                                                        <p className="pending-timestamp">{new Date(post.created_at).toLocaleString()}</p>
                                                        {post.image_url && (
                                                            <img
                                                                src={`http://localhost:3000${post.image_url}`}
                                                                alt="Post"
                                                                className="pending-image"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="pending-actions">
                                                        <button
                                                            onClick={() => approvePost(post.post_id, adminId, 'approved')}
                                                            className="btn btn-approve"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => approvePost(post.post_id, adminId, 'rejected')}
                                                            className="btn btn-reject"
                                                        >
                                                            Reject
                                                        </button>
                                                        <button
                                                            onClick={() => deletePost(post.post_id, adminId)}
                                                            className="btn btn-delete"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="pending-empty">No pending posts.</p>
                                    )}
                                </div>
                                <div className="pending-section">
                                    <h3 className="pending-subtitle">Pending Products</h3>
                                    {pendingItems.products?.length > 0 ? (
                                        <ul className="pending-list">
                                            {pendingItems.products.map(product => (
                                                <li key={product.productId} className="pending-item">
                                                    <div className="pending-details">
                                                        <p>
                                                            <strong>{product.User?.name || 'Unknown'}</strong>: {product.name?.substring(0, 50)}...
                                                        </p>
                                                        <p className="pending-timestamp">{new Date(product.created_at).toLocaleString()}</p>
                                                        {product.imageUrl && (
                                                            <img
                                                                src={`http://localhost:3000${product.imageUrl}`}
                                                                alt="Product"
                                                                className="pending-image"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="pending-actions">
                                                        <button
                                                            onClick={() => approveProduct(product.productId, adminId, 'approved')}
                                                            className="btn btn-approve"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => approveProduct(product.productId, adminId, 'rejected')}
                                                            className="btn btn-reject"
                                                        >
                                                            Reject
                                                        </button>
                                                        <button
                                                            onClick={() => deleteProduct(product.productId, adminId)}
                                                            className="btn btn-delete"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="pending-empty">No pending products.</p>
                                    )}
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