import { Component } from '@angular/core';
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent {

}
