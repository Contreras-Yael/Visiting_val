import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js';
import { PassService } from 'src/app/services/pass.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('barChart') chartCanvas!: ElementRef;
  chart: any;
  totalHoy = 0;
  ingresosHoy = 0;
  constructor(private passService: PassService) { }

  ngOnInit(){
    this.passService.getHourlyStats().subscribe(stats => {
      this.totalHoy = stats.reduce((acc, item) => acc + item.count, 0);
      this.ingresosHoy = this.totalHoy;
      const fullDayData = new Array(24).fill(0);
      stats.forEach(item => {
        if(item._id >= 0 && item._id <= 24)
          fullDayData[item._id] = item.count;
      });
      if(this.chartCanvas) {
        this.renderChart(fullDayData.slice(8,20));
      }
    });
  }

  ngAfterViewInit(){
    this.passService.getHourlyStats().subscribe(stats => {
      const fullDayData = new Array(24).fill(0);
      stats.forEach(item => {
        if(item._id >= 0 && item._id <= 24)
          fullDayData[item._id] = item.count;
      });
      this.renderChart(fullDayData.slice(8,20));
    });
  }

  renderChart(dataPoints: number[]) {
    new Chart(this.chartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['8am','9am','10am','11am','12pm','13pm','14pm','15pm','16pm','17pm','18pm','19pm'],
        datasets: [{
          label: 'Flujo de visitantes',
          data: dataPoints,
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          yAxes:[{ ticks: { beginAtZero: true} }]
        }
      }
    });
  }
}
