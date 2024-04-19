import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ConstructorService }  from '../../services/serviciosConstructor';
import { AlertController, NavParams, NavController }  from "ionic-angular";
import { Temas }  from '../../services/temas';
import { Tareas }  from '../../services/tareas';
import { MenuBossPage  } from "../menuBoss/menuBoss";
import { TiposEmpresa } from "../../services/tiposEmpresa";
import { DatosAPP } from "../../services/datosApp";

@Component({
    selector: "catalogoTareasDetalle-pages",
    templateUrl: "catalogoTareasDetalle.html"
})

export class CatalogoTareasDetallePage{
    form: FormGroup;
    tarea: Tareas;
    listaTemas: Temas[];
    listaTiposEmpresa: TiposEmpresa[];

    tareaActual: number
    nuevo: boolean;
    opcionBoton: string;
    opcionBoton2: string;
    color = "#488aff";
    id: number;
    borrar: boolean;
    campo_semana: number;
    campo_razonsocial: number;
    campo_monto: number;
    costo: number;
    db: string;
    DatosUsuario: DatosAPP;

    constructor(private navCtlr: NavController, private fb: FormBuilder, private formBuilder: FormBuilder, private servicio: ConstructorService, private alertController: AlertController,
                private navparams: NavParams, ){
        
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;
                    
        this.tarea = this.navparams.get("tarea");

        if(this.tarea!=null && this.tarea!=undefined){
            this.tareaActual = this.tarea.id;
            this.campo_monto = this.tarea.campo_monto;
            this.campo_razonsocial = this.tarea.campo_razonsocial;
            this.campo_semana = this.tarea.campo_semana;
            this.costo = this.tarea.costo;
        }else{
            this.campo_monto = 0;
            this.campo_razonsocial = 0;
            this.campo_semana = 0;
            this.costo = 0;
        }

        this.cargarTiposEmpresa();
        this.cargarTemas();
        this. crearForma();

    }

    cargarTiposEmpresa(){
        this.servicio.getDatos("tiposempresa/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaTiposEmpresa = rs;
        }, (er)=>console.log(er));
    }

    cargarTemas(){
        this.servicio.getDatos("temas/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaTemas = rs;
        }, er=>console.log(er))
    }

    crearForma(){
        if(this.tarea==null || this.tarea==undefined){
            this.form = this.formBuilder.group({
                tema: [null, Validators.required],
                descripcion: [null, Validators.required],
                campo_monto: [0],
                campo_razonsocial: [0],
                campo_semana: [0],
                costo: [0],
                tipo_empresa: [null]
            });
            this.nuevo = true;
            this.opcionBoton = "Guardar";
            this.opcionBoton2 = "Cancelar";   
        }else{
            this.form = this.formBuilder.group({
            id: [this.tarea.id],
            tema: [this.tarea.tema, Validators.required],
            descripcion: [this.tarea.descripcion],
            campo_monto: [this.tarea.campo_monto],
            campo_razonsocial: [this.tarea.campo_razonsocial],
            campo_semana: [this.campo_semana],
            costo: [this.costo],
            tipo_empresa: [this.tarea.tipo_empresa]
        });
            this.form.disable();
            this.nuevo = false;
            this.opcionBoton = "Editar";
            this.opcionBoton2 = "Borrar";  
        }
        
    }

    guardarTarea(){
        if(this.nuevo){
            this.servicio.addRegistro("tareas/"+this.db+"/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
            .subscribe(  
                rs=>{
                    this.showAlert();
                    this.id = rs.insertId;
                    this.actualizarForm(this.id);
                    },          
                er => console.log(er)
            );
            this.form.reset();
            this.nuevo = true;
            this.opcionBoton = "Guardar";
            this.opcionBoton2 = "Cancelar";
            this.tarea = null;
            //this.form.removeControl("id");
            this.crearForma();
        }else if(this.opcionBoton == "Guardar" && !this.nuevo){
            this.servicio.putRegistro("tareas/"+this.db+"/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
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
        let peticion = "tareas/"+this.db+"/"+id.toString()+"/";
        this.servicio.getDatos(peticion, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
            this.tarea = rs[0];
            //this.form.addControl("id", this.fb.control(1));
            //this.form.controls["id"].patchValue(this.tarea.id);
            this.tareaActual = this.tarea.id;
        },
        err=>console.log(err))

        /*this.opcionBoton = "Editar";
        this.opcionBoton2 = "Borrar";
        this.nuevo = false;*/

    }

    borrarTarea(){
        if(this.nuevo){
            this.form.reset();
        }else if(this.opcionBoton2 == "Borrar"){
            var id = this.form.controls["id"].value;
            this.servicio.delRegistro(id, "tareas/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
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
        }
            
    }

    showAlert(){
        var mensaje = "Los datos se guadaron correctamente";

        if(this.borrar){
            mensaje = "Se elimino satisfactoriamente";
            this.borrar = false;
        }

        let alert = this.alertController.create({
            title: "Tareas",
            subTitle: mensaje,
            buttons: ["Ok"]
        });

        alert.present();
    }

    actualizarDatos(datos, campo, estatus){

        if(estatus==0 ){
            estatus == 1;
        }else{
            estatus == 0;
        }

        if(campo==1){
            if(estatus == 0 && this.campo_semana == 1){
                estatus = 0;
            }else if(estatus == 0 && this.campo_semana == 0){
                estatus = 1;
            }else if(estatus == 1 && this.campo_semana == 0){
                estatus = 1;
            }else if(estatus == 1 && this.campo_semana == 1){
                estatus = 0;
            }

            this.form.controls["campo_semana"].patchValue(estatus);
            this.campo_semana = estatus;
        }else if(campo==2){
            if(estatus == 0 && this.campo_razonsocial == 1){
                estatus = 0;
            }else if(estatus == 0 && this.campo_razonsocial == 0){
                estatus = 1;
            }else if(estatus == 1 && this.campo_razonsocial == 0){
                estatus = 1;
            }else if(estatus == 1 && this.campo_razonsocial == 1){
                estatus = 0;
            }
            this.form.controls["campo_razonsocial"].patchValue(estatus);
            this.campo_razonsocial = estatus;
        }else if(campo==3){
             if(estatus == 0 && this.campo_monto == 1){
                estatus = 0;
            }else if(estatus == 0 && this.campo_monto == 0){
                estatus = 1;
            }else if(estatus == 1 && this.campo_monto == 0){
                estatus = 1;
            }else if(estatus == 1 && this.campo_monto == 1){
                estatus = 0;
            }
            this.form.controls["campo_monto"].patchValue(estatus);
            this.campo_monto = estatus;
        }else if(campo==99){
             if(estatus == 0 && this.costo == 1){
                estatus = 0;
            }else if(estatus == 0 && this.costo == 0){
                estatus = 1;
            }else if(estatus == 1 && this.costo == 0){
                estatus = 1;
            }else if(estatus == 1 && this.costo == 1){
                estatus = 0;
            }
            this.form.controls["costo"].patchValue(estatus);
            this.costo = estatus;
        }

        if(!this.nuevo){
             this.servicio.putRegistro("tareas/"+this.db+"/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
                rs=>console.log(""),
                er=>console.log(er)
            );
        }

    }

    irControlObra(){
        this.navCtlr.push(MenuBossPage, {DatosUsuario: this.DatosUsuario});
    }

    generarNuevo(){
            this.form.reset();
            this.nuevo = true;
            this.opcionBoton = "Guardar";
            this.opcionBoton2 = "Cancelar";
            this.tarea = null;
            this.campo_monto = 0;
            this.campo_razonsocial = 0;
            this.campo_semana = 0;
            this.costo = 0;
            this.crearForma();
    }
}