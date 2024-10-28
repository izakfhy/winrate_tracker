import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../api';
import styles from './StatsView.module.css';

// Register the required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function StatsView() {
  const [stats, setStats] = useState({
    win_rate: 0,
    net_profit_loss: 0,
    capital_growth: [],
  });

  useEffect(() => {
    api.get('/stats')
      .then(response => setStats(response.data))
      .catch(error => console.error('Error fetching stats:', error));
  }, []);

  const chartData = {
    labels: stats.capital_growth.map((_, index) => `Trade ${index + 1}`),
    datasets: [
      {
        label: 'Capital Growth',
        data: stats.capital_growth,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className={`container ${styles.container}`}>
      <h1 className={styles.title}>Stats Overview</h1>
      <div className={styles.stats}>
        <div><strong>Win Rate:</strong> {stats.win_rate.toFixed(2)}%</div>
        <div><strong>Net Profit/Loss:</strong> ${stats.net_profit_loss.toFixed(2)}</div>
      </div>
      <div className={styles.chart}>
        <Line data={chartData} />
      </div>
    </div>
  );
}

export default StatsView;
