export class DatosAPP{
    constructor(
        public db: string,
        public asset: string,
        public usuario: string,
        public empresa: string,
        public id_usuario: number,
        public nombre: string,
        public so: string,
        public temp_path: string,
        public path: string,
        public admin: number,
        public direccion_remota: string,
        public direccion_local: string,
        public puerto: string,
        public url: string,
        public boss: number, 
        public proyectos: number, 
        public ventas:number, 
        public inmuebles: number
    ){}
}