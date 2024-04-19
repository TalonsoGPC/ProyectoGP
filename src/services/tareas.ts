export class Tareas{
    constructor(
        public id: number,
        public tema: number,
        public descripcion: string,
        public ocultar: number,
        public campo_monto: number,
        public campo_razonsocial: number,
        public campo_semana: number,
        public campo_moneda: number,
        public costo: number,
        public tipo_empresa: number
                ){}
}