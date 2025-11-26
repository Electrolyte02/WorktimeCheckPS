import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  imports: [],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent implements OnInit{
  userRole:string | null = "";
  
  ngOnInit(): void {
    this.userRole = localStorage.getItem('role');
  }
}
