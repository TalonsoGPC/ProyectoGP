import { Component } from "@angular/core";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import { ConstructorService }  from '../../services/serviciosConstructor';
import { AlertController, NavParams, NavController, ToastController }  from "ionic-angular";
import { Proyectos }  from '../../services/proyectos';
import { MenuBossPage  } from "../menuBoss/menuBoss";
import { DatosAPP } from "../../services/datosApp";
import { PermisosUsuarioProyectoPage } from "../permisosUsuarioProyecto/permisosUsuarioProyecto";

@Component({
    selector: "proyectosdetalle-pages",
    templateUrl: "proyectosdetalle.html"
})

export class ProyectosDetallePage{
    form: FormGroup;
    proyecto: Proyectos;
    nuevo: boolean;
    opcionBoton: string;
    opcionBoton2: string;
    color = "#488aff";
    numproy: number;
    borrar: boolean;
    db: string;
    DatosUsuario: DatosAPP;

    constructor(private navCtlr:NavController, private formBuilder: FormBuilder, private servicio: ConstructorService, private alertController: AlertController,
                private navparams: NavParams, private toastCtlr: ToastController){
        
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;
        this.proyecto = this.navparams.get("proyecto");
        this. crearForma();
        
    }

    crearForma(){
        if(this.proyecto==null || this.proyecto==undefined){
            this.form = this.formBuilder.group({
            nombre: [null, Validators.required],
            descripcion: [null],
            direccion: [null],
            numproygp:[null]
            });
            this.nuevo = true;
            this.opcionBoton = "Guardar";
            this.opcionBoton2 = "Cancelar";   
        }else{
            this.form = this.formBuilder.group({
            numproy: [this.proyecto.numproy],
            nombre: [this.proyecto.nombre, Validators.required],
            descripcion: [this.proyecto.descripcion],
            direccion: [this.proyecto.direccion],
            numproygp:[this.proyecto.numproygp]
            });
            this.form.disable();
            this.nuevo = false;
            this.opcionBoton = "Editar";
            this.opcionBoton2 = "Borrar";   
        }
        
    }

    guardarProyecto(){
        if(this.nuevo){
            this.servicio.addRegistro("proyectos/"+this.db+"/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
            .subscribe(  
                rs=>{
                    this.showAlert();
                    this.numproy = rs.insertId;
                    this.actualizarForm(this.numproy);
                    },          
                er => console.log(er)
            );
            this.form.reset();
            this.nuevo = true;
            this.opcionBoton = "Guardar";
            this.opcionBoton2 = "Cancelar"; 
        }else if(this.opcionBoton == "Guardar" && !this.nuevo){
            this.servicio.putRegistro("proyectos/"+this.db+"/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
                rs=>this.showAlert(),
                er=>console.log(er)
            );
            this.nuevo = false;
            this.form.disable();
            this.opcionBoton = "Editar";
            this.opcionBoton2 = "Borrar";   
        }else{
            this.nuevo = false;
            this.form.enable();
            this.opcionBoton = "Guardar";
            this.opcionBoton2 = "Cancelar";   
        }

    }
    
    actualizarForm(id: number){
        let peticion = "proyectos/id/"+this.db+"/"+id.toString()+"/";
        this.servicio.getDatos(peticion, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
            this.proyecto = rs[0];
            //this.form.addControl("numproy", this.fb.control(1));
            //this.form.controls["numproy"].patchValue(this.proyecto.numproy);
        },
        err=>console.log(err))

        this.opcionBoton = "Editar";
        this.opcionBoton2 = "Borrar";
        this.nuevo = false;

    }

    borrarProyecto(){
        if(this.nuevo){
            this.form.reset();
        }else if(this.opcionBoton2 == "Borrar"){
            var id = this.form.controls["numproy"].value;

            this.servicio.getDatos("validarProyectoBorrar/"+this.DatosUsuario.db+"/"+id+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
                
                if (rs[0].contador<=0){
                    this.servicio.delRegistro(id, "proyectos/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
                        rs=>{
                            this.borrar = true;
                            this.showAlert();
                            this.form.reset();
                            this.opcionBoton = "Guardar";
                            this.opcionBoton2 = "Cancelar";
                            this.nuevo = true;
                        },
                        er=>console.log(er)
                    );
                }else{
                    this.presentToast("No se puede eliminar este proyecto");
                }
            }, err=>console.log(err));


        }
            
    }

    showAlert(){
        var mensaje = "Los datos se guadaron correctamente";

        if(this.borrar){
            mensaje = "Se elimino satisfactoriamente";
            this.borrar = false;
        }

        let alert = this.alertController.create({
            title: "Proyectos",
            subTitle: mensaje,
            buttons: ["Ok"]
        });

        alert.present();
    }

    irControlObra(){
        this.navCtlr.push(MenuBossPage, {DatosUsuario: this.DatosUsuario});
    }

    permisosProyecto(){
        this.navCtlr.push(PermisosUsuarioProyectoPage,  {DatosUsuario: this.DatosUsuario, proyectoSeleccionado: this.proyecto})
    }

    private presentToast(text){
        let toast = this.toastCtlr.create({
            message: text,
            duration: 3000,
            position: "middle"
        });
        toast.present();
    }
}
