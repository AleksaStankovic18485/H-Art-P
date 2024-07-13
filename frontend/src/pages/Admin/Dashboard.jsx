import React, { useContext,useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import './Dashboard.css';
import { StoreContext } from '../../context/StoreContext';
import {useTranslation} from "react-i18next"

const Dashboard = () => {
    const { data: auctions, error, isLoading } = useContext(StoreContext);

    if (isLoading) {
        return (
            <div className="loader-error-container">
                <div className="loader"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="loader-error-container">
                <h1 className="error">{error?.data?.message || error.error}</h1>
            </div>
        );
    }
    
    const [t] = useTranslation("global");
    const activeAuctions = auctions.filter(auction => auction.active);
    const expiredAuctions = auctions.filter(auction => !auction.active);


    useEffect(() => {
            window.scrollTo(0, 1);
        }, []);
    const getCategoryData = (auctions) => {
        return auctions.reduce((acc, auction) => {
            const category = auction.category;
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {});
    };

    const getPriceData = (auctions) => {
        return auctions.map(auction => ({
            name: auction.name,
            price: auction.price
        }));
    };

    const categoryChartData = (auctions) => {
        const categoryData = getCategoryData(auctions);
        return Object.keys(categoryData).map(category => ({
            name: category,
            value: categoryData[category]
        }));
    };

    const COLORS = [
        '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF',
        '#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#FF3333'
    ];

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">{t("auctions_dashboard")}</h1>

            <div className="dashboard-chart-row">
                <div className="dashboard-chart-container">
                    <h2 className="dashboard-chart-title">{t("active_auctions_categories")}</h2>
                    <PieChart width={400} height={400}>
                        <Pie
                            data={categoryChartData(activeAuctions)}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {categoryChartData(activeAuctions).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </div>

                <div className="dashboard-chart-container">
                    <h2 className="dashboard-chart-title">{t("expired_auctions_categories")}</h2>
                    <PieChart width={400} height={400}>
                        <Pie
                            data={categoryChartData(expiredAuctions)}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {categoryChartData(expiredAuctions).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </div>
            </div>

            <div className="dashboard-chart-row">
                <div className="dashboard-chart-container">
                    <h2 className="dashboard-chart-title">{t("active_auctions_prices")}</h2>
                    <BarChart
                       width={450}
                        height={400}
                        data={getPriceData(activeAuctions)}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="price" fill="#8884d8" />
                    </BarChart>
                </div>

                <div className="dashboard-chart-container">
                    <h2 className="dashboard-chart-title">{t("expired_auctions_prices")}</h2>
                    <BarChart
                        width={450}
                        height={400}
                        data={getPriceData(expiredAuctions)}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="price" fill="#8884d8" />
                    </BarChart>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
