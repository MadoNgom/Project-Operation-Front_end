import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChartData, ChartOptions, ChartConfiguration } from 'chart.js';
import { Sidebar } from '../../shared/sidebar/sidebar';

@Component({
  selector: 'app-account',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account {
  lineChartData: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        data: [5000, 12000, 8000, 15000, 14000, 20000, 17000],
        label: 'Balance',
        borderColor: 'rgb(34,197,94)',
        backgroundColor: 'rgba(34,197,94,0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
    },
  };
}
