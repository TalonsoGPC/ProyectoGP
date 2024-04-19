export class Temas {
    constructor(
        public id:number,
        public nombre:string,
        public descripcion:string,
        public usuario:string,
        public color: string,
        public imagen: string,
        public orden: number,
        public notificacion: number,
        public ocultar: number,
        public tipoempresa: number,
        public campo_monto: number,
        public campo_razonsocial: number,
        public campo_semana: number,
        public campo_moneda: number
    ){}
}
