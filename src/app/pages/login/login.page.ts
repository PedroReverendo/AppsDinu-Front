import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../app.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(
    private appService: AppService,
    private router: Router,
    private alertController: AlertController
  ) {}

  async onLogin() {
    try {
      const response = await this.appService.loginUser(this.email, this.password).toPromise();
      
      if (response.success) {
        // Guardar datos del usuario en localStorage
        localStorage.setItem('userData', JSON.stringify(response.user)); // Asegúrate de que 'user' esté en la respuesta
        this.router.navigate(['/home']);
      } else {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Correo o contraseña incorrectos',
          buttons: ['OK']
        });
        await alert.present();
      }
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Hubo un problema con el servidor. Inténtelo nuevamente más tarde.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}
