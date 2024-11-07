import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { Bar } from 'react-chartjs-2'; // Import the Bar chart component from react-chartjs-2
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

function Dashboard() {
    const [products, setProducts] = useState([]);

    // Fetch products when the Dashboard component mounts
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5300/products'); // Adjust the endpoint if necessary
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                } else {
                    console.error('Failed to fetch products');
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []); // Empty dependency array ensures this runs only once on mount

    // Prepare the data for the bar chart
    const chartData = {
        labels: products.map(product => product.name), // Product names as the labels
        datasets: [
            {
                label: 'Stock Quantity', // The label for the chart
                data: products.map(product => product.quantity), // Product quantities
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Light color for the bars
                borderColor: 'rgba(75, 192, 192, 1)', // Darker color for the bar borders
                borderWidth: 1,
            },
        ],
    };

    // Chart options for better customization
    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Product Stock Overview',
                font: {
                    size: 20,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true, // Make sure the Y-axis starts from 0
            },
        },
    };

    return (
        <section id="dashboard">
            <div id="stockOverview">
                {/* Render the bar chart */}
                <h2>Stock Overview</h2>
                <Bar data={chartData} options={options} />

                {/* Product table */}
                <table className="stock-table">
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? (
                            products.map(({ id, name, description, category, price, quantity }) => (
                                <tr key={id}>
                                    <td>{name}</td>
                                    <td>{description}</td>
                                    <td>{category}</td>
                                    <td>M{parseFloat(price).toFixed(2)}</td>
                                    <td>{quantity}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No products available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default Dashboard;
