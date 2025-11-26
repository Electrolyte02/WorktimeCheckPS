import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet,RouterLink, Router } from '@angular/router';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-navbar',
  imports: [RouterOutlet,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  userRole:string | null = "";
  router: Router = inject(Router);
  
  ngOnInit(): void {
    this.userRole = localStorage.getItem('role');
  }
  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    
    toast.success('Sesión cerrada exitosamente');
    this.router.navigate(['/login']);
  }

  showFaq() {
    this.router.navigate(['/faq']);
  }
}
