export class OrdenCompraPorRecibir{
    constructor(public proyecto:string,
                public wbs: string,
                public numorden: number,
                public proyectoId: number,
                public proveedorId: number
                ){}
}