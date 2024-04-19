import { Component } from "@angular/core";
import { NavParams, NavController } from "ionic-angular";
import { DocumentacionDetallePage } from "../documentacionDetalle/documentacionDetalle";
import { ConstructorService }  from "../../services/serviciosConstructor";
import { DatosAPP } from "../../services/datosApp";

@Component({
    selector: "filtroDocumentosTipos-page",
    templateUrl: "filtroDocumentosTipo.html"
})

export class FiltroDocumentosTiposPage{
    proyecto: number;
    tema: number;
    listaTipos: any[]=[];
    db: string;
    DatosUsuario: DatosAPP;

    constructor(private navCtlr: NavController, private navparams: NavParams, private servicio: ConstructorService){
        
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;

        this.proyecto = this.navparams.get("proyecto");
        this.tema = this.navparams.get("tema");
        this.cargarTiposFormato();
    
    }

    cargarTiposFormato(){

        if((this.proyecto!=null && this.proyecto!=undefined) && (this.tema!=null && this.tema!=undefined)){
            this.servicio.getDatos("tiposDocto/"+this.db+"/"+this.proyecto.toString()+"/"+this.tema.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
                this.listaTipos = rs;
            }, (er)=>console.log(er));
        }else if((this.proyecto!=null && this.proyecto!=undefined) && (this.tema==null || this.tema==undefined)){
            this.servicio.getDatos("tiposDoctoProyecto/"+this.db+"/"+this.proyecto.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
                this.listaTipos = rs;
            }, (er)=>console.log(er));
        }else if((this.proyecto==null || this.proyecto==undefined) && (this.tema!=null && this.tema!=undefined)){
            this.servicio.getDatos("tiposDoctoTema/"+this.db+"/"+this.tema.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
                this.listaTipos = rs;
            }, (er)=>console.log(er));
        }else{
             this.servicio.getDatos("tiposDoctoTodo/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
                this.listaTipos = rs;
            }, (er)=>console.log(er));
        }

    }

    verDocumentos(formato: string){
        this.navCtlr.push(DocumentacionDetallePage,{
            proyecto: this.proyecto,
            tema: this.tema,
            tipoArchivo: formato,
            DatosUsuario: this.DatosUsuario
        });
    }
}