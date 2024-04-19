export class MensajesUsuario{
    constructor(
                public id: number,
                public tarea: number,
                public numproy: number,
                public tema: number,
                public numdocumento: number,
                public cliente: number,
                public semana: number,
                public responsable: number,
                public fecha_elab: string,
                public moneda: string,
                public tipo_cambio: number,
                public monto: number,
                public estatus: number,
                public autorizado_por: number,
                public fecha_aut: string,
                public acumulado: number,
                public nota: string,
                public soporte: string,
                public archivos: number,
                public fecha: string,
                public gp: number,
                public estatus_gp: number
                ){

    }
}