import  { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { ConstructorService } from "../../services/serviciosConstructor";
import { DatosAPP } from "../../services/datosApp";
import { Parametros } from "../../services/parametros";
import { MenuBossPage  } from "../menuBoss/menuBoss";

@Component({
    selector: "parametros-page",
    templateUrl: "parametros.html"
})


export class ParametrosPage{

    DatosUsuario: DatosAPP;
    listaParametros: any[];
    constructor(private navparams: NavParams, private navCtlr: NavController, private servicio: ConstructorService){
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.obtenerParametro();
    }


    obtenerParametro(){
        this.servicio.getDatos("parametros/usuario/"+this.DatosUsuario.db+"/"+this.DatosUsuario.id_usuario+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
            this.listaParametros = rs;
        }, err=>console.log(err))
    }


    habilitarParametro(object, objeto: any, index: number){

        if(objeto.valor == null || objeto.valor == "1"){
            objeto.valor = "0";
            
        }else{
            objeto.valor = "1";
        }

        var parametro_usuario: any = { parametro: objeto.parametro, usuario: this.DatosUsuario.id_usuario, valor: objeto.valor};

        console.log(parametro_usuario);

        if (objeto.existe == 0){
            this.servicio.addRegistro("parametros/usuario/"+this.DatosUsuario.db+"/", parametro_usuario, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
               //console.log(rs)
            }, err=>console.log(err))
        }else{
            this.servicio.putRegistro("parametros/usuario/"+this.DatosUsuario.db+"/", parametro_usuario, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
                //console.log(rs)
            }, (er)=>console.log(er));
    
        }

        this.listaParametros[index].existe = 1;
    }


    irBoss(){
        this.navCtlr.push(MenuBossPage, {DatosUsuario: this.DatosUsuario});
    }
    
}