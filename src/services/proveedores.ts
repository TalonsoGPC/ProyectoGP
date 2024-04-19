export class Proveedores{
    constructor(
        public id: number,
        public nombre: string,
        public direccion: string,
        public pais: string,
        public estado: string,
        public municipio: string,
        public telefono: string,
    ){}
}