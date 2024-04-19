import {  Component }  from "@angular/core";
import {  NavController, NavParams }  from "ionic-angular";
import { FormGroup, FormControl } from '@angular/forms';
import { RegistroCuentaPage } from "../registroCuenta/registroCuenta";
import { DatosAPP } from "../../services/datosApp";

@Component({
    selector: "registroPerfil-page",
    templateUrl: "registroPerfil.html"
})

export class RegistroPerfilPage{
    perfil;
    perfilForm;
    DatosUsuario: DatosAPP;

    constructor(private navCtlr: NavController, private navparams: NavParams ){
         
        this.DatosUsuario = this.navparams.get("DatosUsuario");
       
         this.perfilForm = new FormGroup({ "perfil": new FormControl({value: 'cliente', disabled: false})});
    }


    cambiarPerfil(event) {
        event.preventDefault();
    }

    RegistroActividadPage(){
        this.navCtlr.push(RegistroCuentaPage, {
            perfil: this.perfilForm.value,
            DatosUsuario: this.DatosUsuario 
        });
    }

} 