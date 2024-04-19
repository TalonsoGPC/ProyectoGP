import  { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { TiposEmpresa } from "../../services/tiposEmpresa";
import { ConstructorService } from "../../services/serviciosConstructor";
import { CatalogoTipoEmpresaDetallePage } from "../catalogoTipoEmpresaDetalle/catalogoTipoEmpresaDetalle";
import { MenuBossPage  } from "../menuBoss/menuBoss";
import { DatosAPP } from "../../services/datosApp";
        

@Component({
    selector: "catalogoTipoEmpresa-page",
    templateUrl: "catalogoTipoEmpresa.html"
})

export class CatalogoTipoEmpresaPage{
    listaTiposEmpresa: TiposEmpresa[];
    db: string;
    DatosUsuario: DatosAPP;

    constructor(private navparams: NavParams, private navCtlr: NavController, private servicio: ConstructorService, ){
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;
        this.cargarTiposEmpresa();

      
    }

    ionViewWillEnter() {
         
         this.cargarTiposEmpresa();
    }

    cargarTiposEmpresa(){
        this.servicio.getDatos("tiposempresa/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaTiposEmpresa = rs;
        }, (er)=>console.log(er));
    }


    nuevoTipoEmpresa(){
        this.navCtlr.push(CatalogoTipoEmpresaDetallePage, {DatosUsuario: this.DatosUsuario});
    }

    verTipoEmpresa(tipoempresa){
        this.navCtlr.push(CatalogoTipoEmpresaDetallePage, {
            tipoempresa: tipoempresa,
            DatosUsuario: this.DatosUsuario
        });
    }
    
    irBoss(){
        this.navCtlr.push(MenuBossPage, {DatosUsuario: this.DatosUsuario});
    }
}