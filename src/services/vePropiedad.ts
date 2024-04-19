export class VePropiedad{
    constructor(
        public id: number,
        public descripcion: number,
        public modelo: string,
        public tipo: number,
        public especificaciones: string,
        public valor: number,
        public avance_construccion: number,
        public proyecto: number
    ){}
}