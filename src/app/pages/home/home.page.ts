// Importaciones del núcleo de Angular para la creación del componente y la detección de cambios
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Importación del plugin Preferences de Capacitor para el almacenamiento nativo en el dispositivo
import { Preferences } from '@capacitor/preferences';

// Importación del servicio personalizado para gestionar la visualización de alertas
import { Alert } from '../../services/alert';

// Importación de los componentes de la interfaz de Ionic necesarios para la vista (Standalone)
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

// Importación de la función para registrar íconos y los vectores específicos que utilizaremos
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
export class HomePage implements OnInit {
  // Inyección del servicio personalizado de alertas
  private alertservice: Alert = inject(Alert);
  // Inyección del detector de cambios para forzar la actualización de la interfaz cuando sea necesario
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  // Variable vinculada al input del formulario para almacenar el texto escrito
  public task: string = '';
  // Arreglo en memoria que contiene el listado de tareas actual
  public tasks: string[] = [];

  constructor() {
    // Registro de los íconos de Ionic en el ciclo de construcción
    addIcons({ addOutline, trashOutline, reorderThreeOutline });

    // Carga de las tareas guardadas al momento de instanciar el componente
    this.loadTasks();
  }


  ngOnInit(): void {
  }

  /**
   * Método para agregar una nueva tarea a la lista.
   * Valida que no esté vacía ni duplicada antes de mostrar la confirmación.
   */
  addTask(): void {
    // Se eliminan espacios en blanco al inicio y al final del texto ingresado
    const cleanTask = this.task.trim();

    // Verificacion de duplicados antes de proceder
    if (this.ifExistsTask(cleanTask)) {
      this.alertservice.alertMessage('Error', 'La tarea ya existe', 'OK');
      return;
    }

    // Muestra la alerta de confirmación; si el usuario acepta, se ejecuta la función de guardado
    this.alertservice.confirmAlert(
      'Agregar Tarea',
      `¿Deseas agregar "${cleanTask}" a tu lista?`,
      () => {
        // Se crea un nuevo arreglo incluyendo la nueva tarea (inmutabilidad)
        this.tasks = [...this.tasks, cleanTask];
        this.saveTasks(); // Persistencia de los cambios en Preferences
        this.task = '';   // Limpieza del campo de texto
        this.cdr.detectChanges(); // Forzado de actualización en la interfaz
      },
      'Agregar',
      'Cancelar'
    );
  }

  /**
   * Verifica si la tarea ingresada ya existe dentro del arreglo (sin diferenciar mayúsculas/minúsculas).
   */
  private ifExistsTask(task: string): boolean {
    return this.tasks.some(
      (item: string) => task.toUpperCase() === item.toUpperCase()
    );
  }

  /**
   * Muestra la alerta de confirmación para eliminar una tarea específica de la lista.
   */
  confirmDelete(taskToDelete: string): void {
    this.alertservice.confirmAlert(
      'Eliminar Tarea',
      `¿Estás seguro de que deseas eliminar "${taskToDelete}"?`,
      () => {
        // Se remueve la tarea seleccionada filtrando el arreglo
        this.tasks = this.tasks.filter((t) => t !== taskToDelete);
        this.saveTasks(); // Persistencia de la lista actualizada
        this.cdr.detectChanges(); // Refresco de la vista
      },
      'Eliminar',
      'Cancelar'
    );
  }

  /**
   * Evento que se ejecuta al finalizar el arrastre de un elemento para reordenar la lista.
   */
  handleReorder(ev: any): void {
    // ev.detail.complete, actualiza el orden interno de los elementos según la posición visual
    this.tasks = ev.detail.complete([...this.tasks]);
    this.saveTasks(); // Guarda el nuevo orden en el dispositivo
    this.cdr.detectChanges(); // Sincroniza la vista
  }

  /**
   * Guarda el arreglo de tareas en el almacenamiento nativo usando Preferences de Capacitor.
   * Se utiliza JSON.stringify porque Preferences solo almacena datos en formato de texto (string).
   */
  private saveTasks(): void {
    Preferences.set({
      key: 'my_tasks',
      value: JSON.stringify(this.tasks),
    });
  }

  /**
   * Recupera las tareas almacenadas desde Preferences utilizando Promesas (.then) en lugar de async/await.
   */
  private loadTasks(): void {
    Preferences.get({ key: 'my_tasks' }).then((result) => {
      if (result.value) {
        // Convierte el texto JSON de vuelta a arreglo y descarta entradas vacías
        this.tasks = JSON.parse(result.value).filter((t: string) => t.trim() !== '');
        this.cdr.detectChanges(); // Notifica a Angular para pintar las tareas en pantalla
      }
    });
  }
}