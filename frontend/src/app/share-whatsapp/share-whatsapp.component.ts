import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-share-whatsapp',
  templateUrl: './share-whatsapp.component.html',
  styleUrls: ['./share-whatsapp.component.css'],
})
export class ShareWhatsappComponent {

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/']);
  }
}
