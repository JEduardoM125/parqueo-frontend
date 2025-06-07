import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-parqueo',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-parqueo.component.html',
  styleUrl: './editar-parqueo.component.css'
})
export class EditarParqueoComponent implements OnInit {

  private _apiService = inject(ApiService);
  private _router = inject(Router);
  private _formBuilder = inject(FormBuilder);

  private _route = inject(ActivatedRoute); //a través de parámetros en la URL SE OBTIENE EL ID
  private parqueoId!: number; // guardamos el id
 
  form!: FormGroup;

  ngOnInit(): void {
    this.parqueoId = Number(this._route.snapshot.paramMap.get('id'));

    this.form = this._formBuilder.group({
      nombre: ['', Validators.required],
      cantidadMaximaVehiculos: [null, Validators.required],
      horaApertura: [this.getCurrentTime(), Validators.required],
      horaCierre: [this.getCurrentTime(), Validators.required],
      tarifaPorHora: [null, Validators.required],
      tarifaPorMediaHora: [null, Validators.required],
    });

    this._apiService.getParqueoById(this.parqueoId).subscribe({
      next: (parqueo) => this.form.patchValue(parqueo),
      error: (err) => console.error('Error al cargar el parqueo:', err)
    });
  }

  private getCurrentTime(): string {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private ensureFullTimeFormat(time: string): string {
    return time.length === 5 ? `${time}:00` : time; // ej: "06:00" → "06:00:00"
  }

  editarParqueo(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = {
      ...this.form.value,
      horaApertura: this.ensureFullTimeFormat(this.form.value.horaApertura),
      horaCierre: this.ensureFullTimeFormat(this.form.value.horaCierre)
    };

    this._apiService.updateParqueo(this.parqueoId, formData).subscribe({
      next: () => this._router.navigate(['/dashboard/parqueos']),
      error: (err) => {
        console.error('Error al actualizar parqueo:', err);
        alert('Error al actualizar parqueo');
      }
    });
  }

  hasErrors(field: string, typeError: string): boolean {
    return !!this.form.get(field)?.hasError(typeError) && !!this.form.get(field)?.touched;
  }

  goTo(): void {
    this._router.navigate(['/dashboard/parqueos']);
  }
}
