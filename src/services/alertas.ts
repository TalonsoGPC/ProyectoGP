export class Alertas{
    constructor(
        public id: number,
        public mensaje: number,
        public tema: number,
        public tipo: number,
        public proyecto: number,
        public asunto: string,
        public fecha_alerta: string,
        public monto: number,
        public dias: number,
        public fecha_documento: string,
        public moneda: string,
        public enviadoA: string,
        public enviadoAId: number,
        public enviadoPor: string,
        public enviadoPorId: number,
        public numdocumento: number,
        public nota: string,
        public alerta: string,
        public archivo: number,
        public notificado: number,
        public fecha: string,
        public gp: number
    ){}
}