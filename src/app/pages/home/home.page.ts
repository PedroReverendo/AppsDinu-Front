import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { AlertController, LoadingController } from '@ionic/angular';

interface Materia {
  id: number;
  nombreMateria: string;
  descripcionMateria: string;
  profesor: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  materias: Materia[] = [];
  userId: number = 1; // Consider getting this from user authentication
  isLoading: boolean = false;

  constructor(
    private appService: AppService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.loadMaterias();
  }

  async loadMaterias() {
    const loading = await this.loadingController.create({
      message: 'Cargando materias...',
    });
    await loading.present();

    try {
      const response = await this.appService.getMaterias().toPromise();
      this.materias = response;
    } catch (error) {
      console.error('Error al cargar materias:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudieron cargar las materias. Por favor, intenta de nuevo.',
        buttons: ['OK'],
      });
      await alert.present();
    } finally {
      loading.dismiss();
    }
  }

  async inscribir(materiaId: number) {
    if (this.isLoading) return; // Prevent multiple clicks
    this.isLoading = true;

    const loading = await this.loadingController.create({
      message: 'Procesando inscripción...',
    });
    await loading.present();

    try {
      await this.appService.inscribirMateria(this.userId, materiaId).toPromise();
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Te has inscrito correctamente en la materia.',
        buttons: ['OK'],
      });
      await alert.present();
    } catch (error: any) {
      console.error('Error detallado al inscribir:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: error.error?.message || 'Hubo un problema al inscribirte. Por favor, intenta de nuevo.',
        buttons: ['OK'],
      });
      await alert.present();
    } finally {
      this.isLoading = false;
      loading.dismiss();
    }
  }
}
