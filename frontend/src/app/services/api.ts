import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

// Define the structure of a MenuItem based on your backend schema
export interface MenuItem {
  _id: string;
  title: string;
  description: string;
  price: number;
  originalText: string;
  imageUrl: string | null;
  imageType: 'ai' | 'photo' | null;
  createdAt: string;
  updatedAt: string;
}

// Define the structure of the API response
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number; // For list responses
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = 'http://localhost:5000/api/menu-item';

  constructor(private http: HttpClient) {}

  /**
   * Fetches all menu items from the backend.
   */
  getMenuItems(): Observable<MenuItem[]> {
    return this.http.get<ApiResponse<MenuItem[]>>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }

  /**
   * Deletes a menu item by its ID.
   */
  deleteMenuItem(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /**
   * Creates a new menu item.
   * The FormData will be constructed in the component.
   */
  createMenuItem(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
}