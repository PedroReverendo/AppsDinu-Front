import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuario: any = {};
  materias: any[] = [];
  userId: number;

  constructor(
    private appService: AppService,
    private alertController: AlertController
  ) {
    // Obtener el ID del usuario del localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    this.userId = userData.id;
  }

  ngOnInit() {
    console.log('Cargando datos del usuario');
    this.loadUserData();
    this.loadUserMaterias();
  }
  
  loadUserData() {
    if (this.userId) {
      console.log('User ID:', this.userId);
      this.appService.getUserProfile(this.userId).subscribe({
        next: (data: any) => {
          console.log('Datos del usuario recibidos:', data);
          this.usuario = data;
        },
        error: (error: any) => {
          console.error('Error al cargar datos del usuario:', error);
        }
      });
    } else {
      console.error('User ID no está definido');
    }
  }

  loadUserMaterias() {
    if (this.userId) {
      this.appService.getUserMaterias(this.userId).subscribe({
        next: (data: any) => {
          this.materias = data;
        },
        error: (error: any) => {
          console.error('Error al cargar materias:', error);
        }
      });
    }
  }

  async confirmarBaja(materiaId: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar baja',
      message: '¿Estás seguro que deseas darte de baja de esta materia?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.darBajaMateria(materiaId);
          }
        }
      ]
    });

    await alert.present();
  }

  darBajaMateria(materiaId: number) {
    this.appService.cancelarInscripcion(this.userId, materiaId).subscribe({
      next: () => {
        // Actualizar la lista de materias
        this.loadUserMaterias();
      },
      error: (error: any) => {
        console.error('Error al dar de baja:', error);
      }
    });
  }
}
