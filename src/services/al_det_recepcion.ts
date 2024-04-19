export class al_det_recepcion{
    constructor(public id_recepcion: number,
               public numrequisicion: number,
               public numorden: number,
               public numproy: string,
               public cveinsumo: string,
               public nombre: string,
               public unidad: string,
               public cantidad: number,
               public precio: number,
               public descuento: number,
               public imagen: string){

    }
}