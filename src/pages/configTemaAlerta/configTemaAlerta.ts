import { Component } from "@angular/core";
import { ConstructorService } from "../../services/serviciosConstructor";
import { Temas } from "../../services/temas"
import { DatosAPP } from "../../services/datosApp";
import  { NavParams } from "ionic-angular";

@Component({
    selector: "configTemaAlerta-page",
    templateUrl: "configTemaAlerta.html"
})

export class ConfigTemaAlertaPage{
    listaTemas: Temas[];
    db: string;
    DatosUsuario: DatosAPP;

    constructor(private navparams: NavParams, private servicio: ConstructorService){
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;
        this.cargarTemas();
    }

    cargarTemas(){
        this.servicio.getDatos("temas/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaTemas = rs;
            this.listaTemas.sort((a,b)=>a.id - b.id);
        },(er)=>console.log(er))
    }
}