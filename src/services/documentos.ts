export class Documentos{
    constructor(
        public id:  number,
        public nombre: string,
        public formato: string,
        public numproy: number,
        public proyecto: string,
        public tema: number,
        public fecha: string,
        public usuario: string
    ){}
}