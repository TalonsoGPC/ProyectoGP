export class Notificaciones{
    constructor(
        public id: number,
        public tipo: number,
        public id_proceso: number,
        public tema: number,
        public tarea: number,
        public proyecto: number,
        public estatus: number,
        public monto: number,
        public enviadoA: string,
        public enviadoAId: number,
        public responsable: string,
        public responsableId: number,
        public vendedor: number,
        public archivo: number,
        public notificado: number,
        public fecha: string,
        public gp: number
    ){}

    public static obtenerFechaActual(){
        var fecha_actual = new Date(Date.now());
        return fecha_actual.getFullYear()+"-"+(fecha_actual.getMonth() + 1 )+"-"+fecha_actual.getDate()+" "+fecha_actual.getHours()+":"+fecha_actual.getMinutes()+":"+fecha_actual.getSeconds();
    }
}