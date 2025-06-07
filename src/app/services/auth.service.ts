import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode for decoding JWT tokens

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private _router: Router = inject(Router); // Inject the Router

    private tokenKey = 'authToken'; // Key for storing the token in localStorage



    loginWithToken(token: string): void {
        localStorage.setItem(this.tokenKey, token); // Store the token in localStorage
    }

    logoutWithToken(): void {
        localStorage.removeItem(this.tokenKey); // Remove the token from localStorage
        this._router.navigate(['/login']); // Redirect to the login page
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem(this.tokenKey); // Check if the token exists in localStorage
    }
    getToken(): string | null {
        return localStorage.getItem(this.tokenKey); // Retrieve the token from localStorage
    }

    getUsername(): string | null {
        const token = this.getToken();
        if (!token) return null; // If no token, return null

        try {
            const decodedToken: any = jwtDecode(token); // Decode the token
            return decodedToken ['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']; // Extract the username from the decoded token
        } catch (error) {
            console.error('Error decoding token', error);
             return null; // If there's an error decoding the token, return null
        }
    }

    getRole(): string {
    const token = this.getToken();
    if (!token) return '';

    try {
        const decodedToken: any = jwtDecode(token);
        const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 
                    decodedToken['role'] || 
                    'employee'; // Asegúrate que coincida con el backend
        
        // Normaliza el caso del rol
        return role.toLowerCase() === 'admin' ? 'admin' : 'employee';
    } catch (error) {
        console.error('Error decoding token', error);
        return 'employee'; // Valor por defecto
    }
}

isAdmin(): boolean {
    return this.getRole() === 'admin'; // Ahora en minúsculas
}

isEmployee(): boolean {
    return this.getRole() === 'employee'; // Ahora en minúsculas
}
}
