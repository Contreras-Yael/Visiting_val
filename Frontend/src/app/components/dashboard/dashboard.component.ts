import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart } from 'Chart.js';
import { PassService } from 'src/app/services/pass.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  // 1. Declaración de ViewChilds al inicio
  @ViewChild('barChart') chartCanvas!: ElementRef;
  @ViewChild('pieChart') pieCanvas!: ElementRef;

  // Variables para KPIs
  totalHoy = 0;
  ingresosHoy = 0;

  // Suscripción para recarga automática
  private dataSubscription?: Subscription;
  private chartsReady = false;

  constructor(private passService: PassService) { }

  ngOnInit() {
    this.cargarDatos();
    // Inicia recarga automática cada 30 segundos
    this.dataSubscription = interval(30000).subscribe(() => {
      this.cargarDatos();
    });
  }

  ngAfterViewInit() {
    this.chartsReady = true;
    this.cargarDatos();
  }

  ngOnDestroy() {
    // Limpia la suscripción para evitar memory leaks
    this.dataSubscription?.unsubscribe();
  }

  cargarDatos() {
    if (!this.chartsReady) return;

    // Cargar estadísticas por hora
    this.passService.getHourlyStats().subscribe(stats => {
      this.totalHoy = stats.reduce((acc, item) => acc + item.count, 0);
      this.ingresosHoy = this.totalHoy;
      const fullDayData = new Array(24).fill(0);
      stats.forEach(item => {
        if (item._id >= 0 && item._id < 24) {
          fullDayData[item._id] = item.count;
        }
      });
      if (this.chartCanvas) {
        this.renderChart(fullDayData.slice(8, 20));
      }
    });

    // Cargar estadísticas de estado de pases
    this.passService.getStats().subscribe(data => {
      console.log("Datos de la Dona:", data);
      if (data && data.length > 0) {
        const labels = data.map(d => d._id);
        const values = data.map(d => d.count);
        this.renderPieChart(labels, values);
      }
    }, error => {
      console.error("Error al obtener estadísticas de estado:", error);
    });
  }

  renderChart(dataPoints: number[]) {
    new Chart(this.chartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['8am', '9am', '10am', '11am', '12pm', '13pm', '14pm', '15pm', '16pm', '17pm', '18pm', '19pm'],
        datasets: [{
          label: 'Flujo de visitantes',
          data: dataPoints,
          backgroundColor: [
            'rgba(255, 99, 133, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(255, 205, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)', 'rgba(153, 102, 255, 0.5)', 'rgba(255, 159, 64, 0.5)',
            'rgba(199, 199, 199, 0.5)', 'rgba(83, 102, 255, 0.5)', 'rgba(144, 87, 63, 0.5)',
            'rgba(33, 184, 74, 0.5)', 'rgba(178,34,34, 0.5)', 'rgba(255, 215, 0, 0.5)'
          ],
          borderColor: '#ededed00',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              stepSize: 1,
              precision: 0
            }
          }]
        }
      }
    });
  }

  renderPieChart(labels: string[], dataPoints: number[]) {
    const ctx = this.pieCanvas.nativeElement.getContext('2d');

    // Asignar colores según el estado
    const colors = labels.map(label => {
      switch(label.toUpperCase()) {
        case 'USED':
          return '#2ecc71'; // Verde
        case 'EXPIRED':
          return '#e74c3c'; // Rojo
        case 'PENDING':
          return '#f1c40f'; // Amarillo
        default:
          return '#95a5a6'; // Gris por defecto
      }
    });

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: dataPoints,
          backgroundColor: colors
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true
          }
        },
        animation: {
          animateScale: true,
          animateRotate: true
        }
      }
    });
  }
}
