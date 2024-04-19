import {Component, NgZone} from "@angular/core";
import { NavController, NavParams, ToastController, Events } from "ionic-angular";
import { ConstructorService } from "../../services/serviciosConstructor";
import { DatosAPP } from "../../services/datosApp";
import { Usuarios } from "../../services/usuarios";
import { RegistroCuentaPage } from "../registroCuenta/registroCuenta";
import { MenuBossPage  } from "../menuBoss/menuBoss";



@Component({
    selector: "catalogousuarios-page",
    templateUrl: "catalogoUsuarios.html"
})


export class CatalogoUsuariosPage{
    db: string;
    DatosUsuario: DatosAPP;
    listaUsuarios: Usuarios[]
    usuario: Usuarios = { id: 0, empresa: 0, cveusuario: "", nombre: "", correo: "", password: "", boss: 0,
                          proyectos: 0, ventas: 0, inmuebles: 0, admin: 0}
                          
    constructor(private navparams: NavParams, private servicio: ConstructorService, private navCtlr: NavController, private toastCtlr: ToastController,
                private events: Events, private zone: NgZone){
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;
        
        this.events.subscribe('updateScreen', ()=>{
            this.zone.run(()=>{
                this.cargarUsuarios();
            });
        });
        this.cargarUsuarios()
    }


    cargarUsuarios(){
        this.servicio.getDatos("usuarios/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaUsuarios = rs;
        }, (er)=>console.log(er));
    }

    actualizarUsuario(usuario: any){
        this.navCtlr.push(RegistroCuentaPage, {
            usuarioRegistrado: usuario,
            DatosUsuario: this.DatosUsuario
        });
    }    

    nuevoUsuario(){
        this.navCtlr.push(RegistroCuentaPage, {
            usuarioRegistrado: this.usuario,
            DatosUsuario: this.DatosUsuario
        });
    }    

    irBoss(){
        this.navCtlr.push(MenuBossPage, {DatosUsuario: this.DatosUsuario});
    }

    borrarUsuario(usuario:any){
        this.servicio.getDatos("validarUsuarioBorrar/"+this.DatosUsuario.db+"/"+usuario.id+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
                if(rs[0].contador<=0){
                    this.servicio.delRegistro(usuario.id, "usuarios/"+this.DatosUsuario.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
                        this.events.publish("updateScreen");
                        console.log("Se elimino el usuario");
                    }, err=>console.log(err));
                }else{
                    this.mensaje("No se puede eliminar este usuario");
                }
        });
    }

    mensaje(text: string){
        let toast = this.toastCtlr.create({
            message: text,
            duration: 3000,
            position: "middle"
        });

        toast.present();
    }

}