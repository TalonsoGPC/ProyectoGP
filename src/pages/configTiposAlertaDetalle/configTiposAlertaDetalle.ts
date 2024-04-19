import { Component } from "@angular/core";
import { TiposAlertas } from "../../services/tiposalertas";
import { Temas } from "../../services/temas";
import { ConstructorService } from "../../services/serviciosConstructor";
import { AlertController, NavParams, NavController } from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { MenuBossPage  } from "../menuBoss/menuBoss";
import { DatosAPP } from "../../services/datosApp";


@Component({
    selector: "configTiposAlertaDetalle-page",
    templateUrl: "configTiposAlertaDetalle.html"
})

export class ConfigTiposAlertaDetallePage{
    tipo: any;
    tipoAlerta: TiposAlertas;
    listaTemas: Temas[];
    form: FormGroup;
    nuevoRegistro: boolean;
    color = "#f53d3d";
    opcionBoton: string;
    opcionBoton2: string;
    tareaActual: number
    id: number;
    borrar: boolean;
    db: string;
    DatosUsuario: DatosAPP;

    constructor(private navCtlr: NavController, private fb: FormBuilder, private formBuilder: FormBuilder, private servicio: ConstructorService, private alertController: AlertController,
                private navparams: NavParams, ){
        
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;
                    
        this.tipo = this.navparams.get("tipoalerta");

        if(this.tipo == null || this.tipo == undefined){
            this.nuevoRegistro = true;
        }

        this.cargarTemas();
        this.crearForm();

    }

    cargarTemas(){
        this.servicio.getDatos("temas/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaTemas = rs;
        },(er)=>console.log(er));
    }
    
    crearForm(){
        if(this.nuevoRegistro){
            this.form = this.formBuilder.group({
                tema: [null, Validators.required],
                tipo: [null],
                descripcion: [null, Validators.required],
                por_fecha: [null],
                por_monto: [null],
                por_estatus: [null],
                estatus: [null],
                alerta: [null]
            });
            
            this.nuevoRegistro = true;
            this.opcionBoton = "Guardar";
            this.opcionBoton2 = "Cancelar";     
        }else{
             this.form = this.formBuilder.group({
                tema: [this.tipo.tema],
                tipo: [this.tipo.tipo],
                descripcion: [this.tipo.descripcion, Validators.required],
                por_fecha: [this.tipo.tema.por_fecha],
                por_monto: [this.tipo.por_monto],
                por_estatus: [this.tipo.por_estatus],
                estatus: [this.tipo.estatus],
                alerta: [this.tipo.alerta]
            });
            this.form.disable();
            this.nuevoRegistro = false;
            this.opcionBoton = "Editar";
            this.opcionBoton2 = "Borrar"; 


        }
        
    }

guardarTipoAlerta(){
        
        if(this.nuevoRegistro){
            this.servicio.addRegistro("tiposalertas/"+this.db+"/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
            .subscribe(  
                rs=>{
                    this.showAlert();
                    //this.id = rs.insertId;
                    //this.actualizarForm(this.id);
                    },          
                er => console.log(er)
            );
            this.form.reset();
            this.nuevoRegistro = true;
            this.opcionBoton = "Guardar";
            this.opcionBoton2 = "Cancelar";
        }else if(this.opcionBoton == "Guardar" && !this.nuevoRegistro){
            this.servicio.putRegistro("tiposalertas/"+this.db+"/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
                rs=>this.showAlert(),
                er=>console.log(er)
            );
            this.nuevoRegistro = false;
            this.form.disable();
            this.opcionBoton = "Editar";
            this.opcionBoton2 = "Borrar"; 
        }else{
            this.nuevoRegistro = false;
            this.form.enable();
            this.opcionBoton = "Guardar";
            this.opcionBoton2 = "Cancelar";   
        }

    }
    
    actualizarForm(id: number){
        let peticion = "tiposalertas/"+this.db+"/"+id.toString()+"/";
        this.servicio.getDatos(peticion, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
            this.tipo = rs[0];
            //this.form.addControl("tipo", this.fb.control(1));
            //this.form.controls["tipo"].patchValue(this.tipo.tipo);
            this.tareaActual = this.tipo.id;
        },
        err=>console.log(err))

        /*this.opcionBoton = "Editar";
        this.opcionBoton2 = "Borrar";
        this.nuevo = false;*/

    }

    borrarTipoAlerta(){
        if(this.nuevoRegistro){
            this.form.reset();
        }else if(this.opcionBoton2 == "Borrar"){
            var id = this.form.controls["tipo"].value;
            var tema = this.form.controls["tema"].value;
            this.servicio.delRegistro(id, "tiposalertas/"+this.db+"/"+tema.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
                rs=>{
                    this.borrar = true;
                    this.showAlert();
                    this.form.reset();
                    this.opcionBoton = "Guardar";
                    this.opcionBoton2 = "Cancelar";
                    this.nuevoRegistro = true;
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
            title: "Tipos Alertas",
            subTitle: mensaje,
            buttons: ["Ok"]
        });

        alert.present();
    }

    obtenerConsecTipo(event){
        this.servicio.getDatos("tiposalertas/consec/"+this.db+"/"+event.toString()+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.form.controls["tipo"].patchValue(rs[0].tipo);
        }, err=>console.log(err));
    }

    irControlObra(){
        this.navCtlr.push(MenuBossPage, {DatosUsuario: this.DatosUsuario});
    }
}

