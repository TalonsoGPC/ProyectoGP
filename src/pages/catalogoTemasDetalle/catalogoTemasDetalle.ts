import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ConstructorService }  from '../../services/serviciosConstructor';
import { AlertController, NavParams, NavController }  from "ionic-angular";
import { Temas }  from '../../services/temas';
import { MenuBossPage  } from "../menuBoss/menuBoss";
import { DatosAPP } from "../../services/datosApp";

@Component({
    selector: "catalogoTemasDetalle-pages",
    templateUrl: "catalogoTemasDetalle.html"
})

export class CatalogoTemasDetallePage{
    form: FormGroup;
    tema: Temas;
    temActual: number
    nuevo: boolean;
    opcionBoton: string;
    opcionBoton2: string;
    color = "#488aff";
    id: number;
    borrar: boolean;
    campo_semana: number;
    campo_razonsocial: number;
    campo_monto: number;
    db: string;
    DatosUsuario: DatosAPP;

    constructor(private navCtlr: NavController, private fb: FormBuilder, private formBuilder: FormBuilder, private servicio: ConstructorService, private alertController: AlertController,
                private navparams: NavParams, ){
        
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;
                    
            
        this.tema = this.navparams.get("tema");

        if(this.tema!=null && this.tema!=undefined){
            this.color = this.tema.color;
            this.temActual = this.tema.id;
            this.campo_semana = this.tema.campo_semana;
            this.campo_razonsocial = this.tema.campo_razonsocial
            this.campo_monto= this.tema.campo_monto;
        }else{
            this.temActual = 20;
            this.campo_semana = 0;
            this.campo_razonsocial = 0;
            this.campo_monto= 0;
        }

        this. crearForma();

    }

    crearForma(){

        if(this.tema==null || this.tema==undefined){
            this.form = this.formBuilder.group({
                nombre: [null, Validators.required],
                descripcion: [null],
                color: ["#000000"],
                imagen: ["plus.png"],
                campo_monto: [0],
                campo_razonsocial: [0],
                campo_semana: [0]
            });
            this.nuevo = true;
            this.opcionBoton = "Guardar";
            this.opcionBoton2 = "Cancelar";   
        }else{
            this.form = this.formBuilder.group({
            id: [this.tema.id],
            nombre: [this.tema.nombre],
            descripcion: [this.tema.nombre],
            color: [this.tema.color],
            imagen: [this.tema.imagen],
            campo_monto: [this.tema.campo_monto],
            campo_razonsocial: [this.tema.campo_razonsocial],
            campo_semana: [this.tema.campo_semana]
        });
            this.form.disable();
            this.nuevo = false;
            this.opcionBoton = "Editar";
            this.opcionBoton2 = "Borrar";  

            if(this.tema.id>=1 && this.tema.id<=19){
                this.form.disable();
            } 
        }
        
    }

    guardarTema(){
        if(this.nuevo){
            this.form.controls["descripcion"].patchValue(this.form.controls["nombre"].value);
            this.servicio.addRegistro("temas/"+this.db+"/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
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
        }else if(this.opcionBoton == "Guardar" && !this.nuevo){
            this.servicio.putRegistro("temas/"+this.db+"/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
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
            this.tema = rs[0];
            //this.form.addControl("id", this.fb.control(1));
            //this.form.controls["id"].patchValue(this.tema.id);
            this.temActual = this.tema.id;
        },
        err=>console.log(err))

        /*this.opcionBoton = "Editar";
        this.opcionBoton2 = "Borrar";
        this.nuevo = false;*/

    }

    borrarTema(){
        if(this.nuevo){
            this.form.reset();
        }else if(this.opcionBoton2 == "Borrar"){
            var id = this.form.controls["id"].value;
            this.servicio.delRegistro(id, "temas/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
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
            title: "Temas",
            subTitle: mensaje,
            buttons: ["Ok"]
        });

        alert.present();
    }

    actualizarDatos(datos, campo, estatus){
        console.log(datos);
        if(campo==1){
            this.form.controls["campo_semana"].patchValue(estatus);
        }else if(campo==2){
            this.form.controls["campo_razonsocial"].patchValue(estatus);
        }else if(campo==3){
            this.form.controls["campo_monto"].patchValue(estatus);
        }

        if(!this.nuevo){
             this.servicio.putRegistro("temas/"+this.db+"/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
                rs=>console.log(rs),
                er=>console.log(er)
            );
        }

    }

    irControlObra(){
        this.navCtlr.push(MenuBossPage, {DatosUsuario: this.DatosUsuario});
    }
}

