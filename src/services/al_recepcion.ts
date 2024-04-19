export class al_recepcion{
    constructor(public id: number,
                public proyecto: string,
                public numproy: string,
                public numorden: number,
                public numrecepcion: number,
                public num_acuse: number,
                public num_proveedor: number,
                public nombre_proveedor: string,
                public fecha_recepcion: string,
                public monto: number,
                public notas: string,
                public errores: string
        ){

    }
}