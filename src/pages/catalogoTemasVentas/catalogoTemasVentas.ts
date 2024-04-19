import  { Component } from "@angular/core";
import { NavParams } from "ionic-angular";
import { TemasVentas } from "../../services/temasVentas";
import { ConstructorService } from "../../services/serviciosConstructor";
//import { CatalogoTemasVentasDetallePage } from "../catalogoTemasVentasDetalle/catalogoTemasVentasDetalle";
import { DatosAPP } from "../../services/datosApp";
        

@Component({
    selector: "catalogoTemasVentas-page",
    templateUrl: "catalogoTemasVentas.html"
})

export class CatalogoTemasVentasPage{
    listaTemas: TemasVentas[];
    listaCheck: any[]=[];
    db: string;
    DatosUsuario: DatosAPP;

    constructor(private navparams: NavParams, private servicio: ConstructorService){
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;

        this.cargarTemas();

        
    }

    ionViewWillEnter() {
         
         this.cargarTemas();
    }

    cargarTemas(){
        this.servicio.getDatos("temasVentas/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaTemas = rs;
        }, (er)=>console.log(er));
    }


    nuevoTema(){
        //this.navCtlr.push(CatalogoTemasVentasDetallePage, {DatosUsuario: this.DatosUsuario});
    }

    verTema(tema){
        /*this.navCtlr.push(CatalogoTemasVentasDetallePage, {
            tema: tema,
            DatosUsuario: this.DatosUsuario
        });*/
    }

    habilitarTema(object, tema: TemasVentas){
        if(tema.ocultar == null || tema.ocultar == 1){
            tema.ocultar = 0;
            
        }else{
            tema.ocultar = 1;
        }

        this.servicio.putRegistro("temasVentas/"+this.db+"/", tema, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            //console.log(rs)
        }, (er)=>console.log(er));
    }

}