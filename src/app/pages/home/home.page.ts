// Importaciones del núcleo de Angular
import { Component, inject,  ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Importación del plugin Preferences de Capacitor para almacenamiento nativo
import { Preferences } from '@capacitor/preferences';

// Importación del servicio personalizado de alertas
import { Alert } from '../../services/alert';

// Importación de componentes de la interfaz de Ionic
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonList,
  IonLabel,
  IonReorderGroup,
  IonReorder,
} from '@ionic/angular';

// Importación de íconos
import { addIcons } from 'ionicons';
import { addOutline, trashOutline, reorderThreeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonIcon,
    IonList,
    IonLabel,
    IonReorderGroup,
    IonReorder,
  ],
})
export class HomePage  {
  // Inyección de dependencias
  private alertservice: Alert = inject(Alert);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  // Variables de estado
  public task: string = '';
  public tasks: string[] = [];

  constructor() {
    // Registro de íconos en el constructor
    addIcons({ addOutline, trashOutline, reorderThreeOutline });
  }

  
  /**
   * Ciclo de vida propio de Ionic: Lee las tareas directamente desde Preferences de forma asíncrona.
   * Sin tipo de retorno.
   */
  async ionViewWillEnter() {
    const { value } = await Preferences.get({ key: 'my_tasks' });
    if (value) {
      this.tasks = JSON.parse(value).filter((t: string) => t.trim() !== '');
      this.cdr.detectChanges();
    }
  }

  /**
   * Agrega una nueva tarea a la lista tras validar que no esté duplicada.
   */
  addTask(): void {
    const cleanTask = this.task.trim();

    if (this.ifExistsTask(cleanTask)) {
      this.alertservice.alertMessage('Error', 'La tarea ya existe', 'OK');
      return;
    }

    this.alertservice.confirmAlert(
      'Agregar Tarea',
      `¿Deseas agregar "${cleanTask}" a tu lista?`,
      async () => {
        this.tasks = [...this.tasks, cleanTask];
        await this.saveTasks();
        this.task = '';
        this.cdr.detectChanges();
      },
      'Agregar',
      'Cancelar'
    );
  }

  /**
   * Verifica si la tarea ya existe sin distinguir mayúsculas de minúsculas.
   */
  private ifExistsTask(task: string): boolean {
    return this.tasks.some(
      (item: string) => task.toUpperCase() === item.toUpperCase()
    );
  }

  /**
   * Elimina la tarea elegida previa confirmación.
   */
  confirmDelete(taskToDelete: string): void {
    this.alertservice.confirmAlert(
      'Eliminar Tarea',
      `¿Estás seguro de que deseas eliminar "${taskToDelete}"?`,
      async () => {
        this.tasks = this.tasks.filter((t) => t !== taskToDelete);
        await this.saveTasks();
        this.cdr.detectChanges();
      },
      'Eliminar',
      'Cancelar'
    );
  }

  /**
   * Reordena los elementos de la lista.
   */
  async handleReorder(ev: any) {
    this.tasks = ev.detail.complete([...this.tasks]);
    await this.saveTasks();
    this.cdr.detectChanges();
  }

  /**
   * Guarda las tareas en Preferences de forma asíncrona.
   */
 saveTasks() {
    Preferences.set({
      key: 'my_tasks',
      value: JSON.stringify(this.tasks),
    });
  }
}