// app.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private apiUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la petición:', error);
    
    if (error.error instanceof ErrorEvent) {
      return throwError(() => new Error('Hubo un error en la conexión. Por favor, verifica tu conexión a internet.'));
    } else {
      return throwError(() => error);
    }
  }
    
    loginUser(email: string, password: string): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/login`, { email, password });
    }
    
    getMaterias(): Observable<any> {
      return this.http.get(`${this.apiUrl}/materias`).pipe(
        tap(response => console.log('Materias recibidas:', response)),
        catchError(this.handleError)
      );
    }
  
    inscribirMateria(userId: number, materiaId: number): Observable<any> {
      console.log('Intentando inscribir:', { userId, materiaId });
      
      return this.http.post(`${this.apiUrl}/inscribir`, { userId, materiaId }).pipe(
        tap(response => console.log('Respuesta de inscripción:', response)),
        catchError(this.handleError)
      );
    }

    // Nuevo método para obtener datos del usuario
  getUserProfile(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios/${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  // Nuevo método para obtener materias inscritas
  getUserMaterias(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios/${userId}/materias`).pipe(
      catchError(this.handleError)
    );
  }

  // Nuevo método para dar de baja de una materia
  cancelarInscripcion(userId: number, materiaId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/inscribir/${userId}/${materiaId}`).pipe(
      catchError(this.handleError)
    );
  }
}