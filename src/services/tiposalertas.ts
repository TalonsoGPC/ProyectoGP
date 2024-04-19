export class TiposAlertas{

    constructor(public tema: number,
                public tipo: number,
                public descripcion: string,
                public por_fecha: number,
                public por_monto: number,
                public por_estatus: number,
                public estatus: number,
                public alerta: string,
                public ocultar: number
                ){}

}