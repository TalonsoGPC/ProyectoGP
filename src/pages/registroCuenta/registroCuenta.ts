import { Component }from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {  NavController, NavParams, ToastController } from "ionic-angular";
import { ConstructorService }  from "../../services/serviciosConstructor";
import { Usuarios } from "../../services/usuarios";
import { AccesoUsuariosPage } from "../accesoUsuarios/accesoUsuarios";
import { DatosAPP } from "../../services/datosApp";
import { ProjectGPValidator } from "../../services/projectgp.validators"; 
import { isPresent } from "ionic-angular/util/util";

@Component({
    selector: "registroCuenta-page",
    templateUrl: "registroCuenta.html"
})

export class RegistroCuentaPage{
    form: FormGroup;
    usuario: Usuarios[];
    mssError: string;
    parametro: any;
    perfil: string;
    actividad: string;
    passConfirmacion: string;
    registrar: boolean = false;
    db: string;
    empresa: string;
    DatosUsuario: DatosAPP;
    usuarioRegistrado: Usuarios;

    constructor(private servicio: ConstructorService, private fb: FormBuilder, private navCtlr: NavController, public navparams: NavParams,
                public toastCtlr: ToastController){
        
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.usuarioRegistrado = this.navparams.get("usuarioRegistrado");
        this.db = this.DatosUsuario.db;

        this.registrar = false;
        //this.parametro = this.navParams.get("actividad");
        this.perfil = this.navparams.get("perfil");
        //this.actividad = this.parametro.actividad;
        this.mssError = "";
        this.crearForma();

    }

    actualizarEmpresa(data){
        this.obtenerDatos("datosEmpresa/projectgp/"+data+"/").then(data=>{
            if(data != null && data !== undefined){
                this.DatosUsuario.db = data[0].db_name;
            }
        }, err=>{console.log("Error")}).catch(error=>{
            console.log(error);
        });
        
    }

    crearForma(){

        let empresa: string = "";

        if (this.usuarioRegistrado.cveusuario == ""){

            if ( this.DatosUsuario == null ){
                empresa = null;
            }else{
                empresa = this.DatosUsuario.empresa;
            }

            this.form = this.fb.group({
                empresa: [empresa, Validators.required, ProjectGPValidator.validarEmpresa(this.servicio, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)],
                cveusuario: [null, Validators.required],
                nombre: [null, Validators.required],
                correo: [null, Validators.required],
                password: [null, Validators.required]
            });        
        }else{
            this.form = this.fb.group({
                empresa: [this.DatosUsuario.empresa, Validators.required, ProjectGPValidator.validarEmpresa(this.servicio, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)],
                cveusuario: [this.usuarioRegistrado.cveusuario, Validators.required],
                nombre: [this.usuarioRegistrado.nombre, Validators.required],
                correo: [this.usuarioRegistrado.correo, Validators.required],
                password: [this.usuarioRegistrado.password, Validators.required]
            });       
        }


    }

    terminarRegistro(){
        this.navCtlr.setRoot(AccesoUsuariosPage);
    }

    validarClaveUsuario(clave){
        this.servicio.getDatos("validarUsuarioClave/"+this.DatosUsuario.db+"/"+clave+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.usuario = rs;
            if(this.usuario.length>0){
                this.mssError = "La clave de usuario ya existe.";
                this.registrar = false;
                //this.form.controls["cveusuario"].patchValue("");
            }else{
                this.registrar = true;
                this.mssError = "";
            }
        }, er=>console.log(er));
    }

    validarPassword(){
        if(this.form.controls["password"].value != this.passConfirmacion){
            this.mssError = "No coincide el password";
            this.registrar = false;
        }else{
            this.mssError = "";
            this.registrar = true;
        }
    }

    validarCorreo(correo){
        this.servicio.getDatos("validarUsuarioCorreo/"+this.DatosUsuario.db+"/"+correo+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.usuario = rs;
            if(this.usuario.length>0){
                this.mssError = "El correo ya existe.";
                this.registrar = false;
                //this.form.controls["correo"].patchValue("");
            }else{
                this.mssError = "";
                this.registrar = true;
            }
        }, er=>console.log(er));
    }

    registrarUsuario(){
        this.DatosUsuario.usuario = this.form.controls["cveusuario"].value;

        if(this.DatosUsuario.db.length<=0 || this.DatosUsuario.db == null){
            this.mssError = "La empresa no existe";
            return;
        }else{
            this.mssError = "";
        }



        this.obtenerDatos("validarUsuarioClave/"+this.DatosUsuario.db+"/"+this.DatosUsuario.usuario+"/").then(data=>{
            
            
            if((data != null && data !== undefined) && this.usuarioRegistrado.cveusuario == ""){
                this.DatosUsuario.usuario = data[0].cveusuario;
                if(this.DatosUsuario.usuario.length > 0){
                    this.mssError = "El usuario ya existe";
                    return;   
                }else{
                    this.mssError = "";
                    this.servicio.addRegistro("usuarios/"+this.DatosUsuario.db+"/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
                        this.presentToast("Se registro el ususario");
                    }, err=>console.log(err))
                }

            }else{
                if(this.usuarioRegistrado != null){
                    if (this.usuarioRegistrado.cveusuario == ""){
                        this.servicio.addRegistro("usuarios/"+this.DatosUsuario.db+"/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
                            this.presentToast("Se registro el ususario");
                        }, err=>console.log(err))
                    }else{
                        this.servicio.putRegistro("usuarios/"+this.DatosUsuario.db+"/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
                            this.presentToast("Se actualizo el ususario");
                        }, err=>console.log(err))
                    }
                }else{
                    this.servicio.putRegistro("usuarios/"+this.DatosUsuario.db+"/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
                        this.presentToast("Se actualizo el ususario");
                    }, err=>console.log(err))
                }

                /*this.mssError = "";
                this.servicio.addRegistro("usuarios/"+this.DatosUsuario.db+"/", this.form.value).subscribe(rs=>{
                    this.presentToast("Se registro el ususario");
                }, err=>console.log(err))*/
            }
        }, err=>{console.log("Error")}).catch(error=>{
            console.log(error);
        });


  
    
    }

    private presentToast(text){
        let toast = this.toastCtlr.create({
            message: text,
            duration: 3000,
            position: "middle"
        });
        toast.present();
    }

    validarEmpresa(): boolean{
        
        let lb_return: boolean;
        lb_return = false;

        this.servicio.getDatos("datosEmpresa/projectgp/"+this.empresa, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
            if(rs.length>0){
                 this.db = rs[0].db_name;
                lb_return =  true
            }else{
                this.mssError = "Empresa invalida"
                lb_return =  false
            }
        }, err=>{console.log(err)})

        return lb_return
    }

    obtenerDatos(url){
        return new Promise((resolve, reject)=>{
            this.servicio.getDatos(url, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(data=>{
                if(data.length > 0){
                    resolve(data);
                }else{
                    resolve(null);
                }
            }, err=>{
                resolve(null);
            });
    
        });
      }

      soloLectura(){
        
        var retorno = false;

        if(this.usuarioRegistrado != null){
            if (this.usuarioRegistrado.cveusuario == ""){
                retorno = false
            }else{
                retorno = true
            }
        }else{
            retorno = false
        }

        return retorno;
    }
}