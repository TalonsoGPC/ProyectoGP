import {  Component }  from "@angular/core";
import {  NavController, NavParams }  from "ionic-angular";
import { FormGroup, FormControl } from '@angular/forms';
import { RegistroCuentaPage } from "../registroCuenta/registroCuenta";
import { DatosAPP } from "../../services/datosApp";
import { Usuarios } from "../../services/usuarios";

@Component({
    selector: "registroActividad-page",
    templateUrl: "registroActividad.html"
})

export class RegistroActividadPage{
    actividad;
    actividadForm;
    parametro: any;
    perfil: string;
    DatosUsuario: DatosAPP;
    usuario: Usuarios = { id: 0, empresa: 0, cveusuario: "", nombre: "", correo: "", password: "", boss: 0,
    proyectos: 0, ventas: 0, inmuebles: 0, admin: 0}

    constructor(private navCtlr: NavController, private navparams: NavParams ){
         this.DatosUsuario = this.navparams.get("DatosUsuario");
         this.actividadForm = new FormGroup({ "actividad": new FormControl({value: 'constructora', disabled: false})});
         this.parametro = this.navparams.get("perfil");
         this.perfil = this.parametro.perfil
    }


    cambiarActividad(event) {
        event.preventDefault();
    }

    registroCuenta(){
        this.navCtlr.push(RegistroCuentaPage, {
            perfil: this.perfil,
            actividad: this.actividadForm.value,
            DatosUsuario: this.DatosUsuario,
            usuarioRegistrado: this.usuario
        });
    }

} 