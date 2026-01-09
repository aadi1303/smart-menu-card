import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api';

@Component({
  standalone: true,
  selector: 'app-menu-generator',
  templateUrl: './menu-generator.component.html',
  styleUrls: ['./menu-generator.component.css'],
  imports: [CommonModule, FormsModule]
})
export class MenuGeneratorComponent {
  // Signals for form state
  itemName = signal('');
  imageFile: File | null = null;
  imagePreviewUrl = signal<string | null>(null);
  imageType = signal<'ai' | 'upload'>('ai');

  // Signals for UI state
  isSubmitting = signal(false);
  progress = signal(0);
  message = signal('');
  backendStatus = signal('');

  constructor(private router: Router, private api: ApiService) {}

  // Navigation
  goBack() {
    this.router.navigate(['/menu']);
  }

  // --- Image Handling ---
  selectImageType(type: 'ai' | 'upload') {
    this.imageType.set(type);
    if (type === 'ai') {
      this.imageFile = null;
      this.imagePreviewUrl.set(null);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
      // Create a preview URL for the selected file
      this.imagePreviewUrl.set(URL.createObjectURL(this.imageFile));
      this.imageType.set('upload');
    }
  }

  // --- Backend & Submission ---
  checkBackend() {
    this.api.getMenuItems().subscribe({ // A simple GET request is a good health check
      next: () => this.backendStatus.set('Backend is reachable!'),
      error: (err: HttpErrorResponse) => this.backendStatus.set(`Error: Cannot reach backend (${err.status})`)
    });
  }

  createMenuItem() {
    if (!this.itemName().trim()) {
      this.message.set('Please enter a description for your dish.');
      return;
    }

    this.isSubmitting.set(true);
    this.message.set('');
    this.progress.set(0);

    const formData = new FormData();
    formData.append('text', this.itemName());
    formData.append('imageType', this.imageType());

    if (this.imageType() === 'upload' && this.imageFile) {
      formData.append('image', this.imageFile);
    }

    this.api.createMenuItem(formData).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.progress.set(Math.round((100 * event.loaded) / event.total));
        } else if (event.type === HttpEventType.Response) {
          this.message.set('Item created successfully!');
          // Navigate back to the dashboard after a short delay
          setTimeout(() => {
            this.router.navigate(['/menu']);
          }, 1000);
        }
      },
      error: (err) => {
        console.error(err);
        this.message.set('Error creating item. Please try again.');
        this.isSubmitting.set(false);
      },
      complete: () => {
        this.isSubmitting.set(false);
        this.progress.set(0);
      }
    });
  }
}