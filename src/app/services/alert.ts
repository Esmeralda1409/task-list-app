import { Injectable, inject } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class Alert {
  private alertController = inject(AlertController);

  // Alerta simple
  async alertMessage(header: string, message: string, buttonText: string = 'OK') {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [buttonText],
    });
    await alert.present();
  }

  // AGREGAMOS ESTE MÉTODO QUE FALTABA
  async confirmAlert(
    header: string,
    message: string,
    onConfirm: () => void,
    confirmText: string = 'Aceptar',
    cancelText: string = 'Cancelar'
  ) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: cancelText,
          role: 'cancel',
        },
        {
          text: confirmText,
          handler: () => {
            onConfirm();
          },
        },
      ],
    });

    await alert.present();
  }
}