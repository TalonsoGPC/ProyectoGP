export class Empresas{
    constructor(
        public id: number,
        public tipo: number,
        public nombre: string,
        public direccion: string,
        public pais: string,
        public estado: string,
        public municipio: string,
        public rfc: string,
        public telefono: string,
        public cp: number,
        public num_beneficiario: number,
        public tipo_beneficiario: number
    ){}
}