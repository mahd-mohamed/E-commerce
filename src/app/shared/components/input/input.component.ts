import { Component, Input, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-input',
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class InputComponent {
  // Password visibility states
  flag:boolean = true

 @Input() control:any
 @Input() typeInput!:string
 @Input() idInput!:string
 @Input() labelInput!:string




}
