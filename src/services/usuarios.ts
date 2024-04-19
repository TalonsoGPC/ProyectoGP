export class Usuarios{
    constructor(
        public id: number,
        public empresa: number,
        public cveusuario: string,
        public nombre: string,
        public correo: string,
        public password: string,
        public boss: number,
        public proyectos: number,
        public ventas: number,
        public inmuebles: number,
        public admin: number
    ){}
}