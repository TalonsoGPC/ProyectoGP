export class Reportes{
    constructor(
        public id: number,
        public descripcion: string,
        public nombre: string,
        public formato: string,
        public tipo_reporte: number,
        public numproy: number,
        public tema: number,
        public fecha: string,
        public gp: number
    ){}
}