export interface ITiquete {
    id: number;
    placaVehiculo: string;
    horaEntrada: string; //en pantalla con date pipe transformarlo
    horaSalida: string; 
    costo: number | null; //puede venir null desde la api
    parqueoId: number;
    cerrado: boolean;
    clienteId: number;
}