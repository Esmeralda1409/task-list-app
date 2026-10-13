import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
//importacion de angular
import { FormsModule } from '@angular/forms';
import { IonContent,
   IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonInput,
    IonButton,
    IonIcon,
    IonList,
    IonLabel,
    IonItemSliding,
  IonItemOptions,
  IonItemOption,

   } from '@ionic/angular';
   import{addIcons} from 'ionicons';
   import { addOutline ,trashOutline} from 'ionicons/icons';
   const STORAGE_KEY = 'tasks';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.page.html',
  styleUrls: ['./task-list.page.scss'],
  imports: [
    IonItem,
    IonInput,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButton,
    IonIcon,
    IonList,
    IonLabel,
    IonItemSliding,
  IonItemOptions,
  IonItemOption,

  ],
})

export class TaskListPage implements OnInit {
  public tasks:string[]=[];
  public task:string ='';

  constructor() {
    addIcons({
      addOutline,
      trashOutline

    });
  }

 ngOnInit() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    this.tasks = JSON.parse(saved);
  }
}

addTask() {
  const text = this.task.trim();
  if (!text) return;
  this.tasks.push(text);
  console.log(this.tasks);   
  localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
  this.task = '';
}

confirmDelete(task: string) {
  console.log('La tarea a eliminar es: ', task);
}

}