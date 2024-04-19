import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ConstructorService }  from '../../services/serviciosConstructor';
import { AlertController, NavParams }  from "ionic-angular";
import { Moneda }  from '../../services/moneda';
import { DatosAPP } from "../../services/datosApp";

@Component({
    selector: "catalogoMonedasDetalle-pages",
    templateUrl: "catalogoMonedasDetalle.html"
})

export class CatalogoMonedasDetallePage{
    form: FormGroup;
    moneda: Moneda;

    monedaActual: string;
    nuevo: boolean;
    opcionBoton: string;
    opcionBoton2: string;
    color = "#488aff";
    id: number;
    borrar: boolean;
    db: string;
    DatosUsuario: DatosAPP;

    constructor(private fb: FormBuilder, private formBuilder: FormBuilder, private servicio: ConstructorService, private alertController: AlertController,
                private navparams: NavParams, ){
        
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;
                    
        this.moneda = this.navparams.get("moneda");

        if(this.moneda!=null && this.moneda!=undefined){
            this.monedaActual = this.moneda.id;
            this.nuevo == false;
        }else{
            this.nuevo==true;
        }

        this.crearForma();
        
    }


    crearForma(){
        if(this.moneda==null || this.moneda==undefined){
            this.form = this.formBuilder.group({
                id: [null, Validators.required],
                descripcion: [null, Validators.required],
                simbolo: [null],
                monedaNacional: [null]
            });
            this.nuevo = true;
            this.opcionBoton = "Guardar";
            this.opcionBoton2 = "Cancelar";   
        }else{
            this.form = this.formBuilder.group({
             id: [this.moneda.id],
             descripcion: [this.moneda.descripcion],
             simbolo: [this.moneda.simbolo],
             monedaNacional: [this.moneda.monedaNacional]
        });
            this.form.disable();
            this.nuevo = false;
            this.opcionBoton = "Editar";
            this.opcionBoton2 = "Borrar";  
        }
        
    }

    guardarMoneda(){
        if(this.nuevo){
            this.servicio.addRegistro("moneda/"+this.db+"/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
            .subscribe(  
                rs=>{
                    this.showAlert();
                    //this.id = rs.insertId;
                    this.actualizarForm(0);
                    },          
                er => console.log(er)
            );
            this.form.reset();
            this.nuevo = true;
            this.opcionBoton = "Guardar";
            this.opcionBoton2 = "Cancelar";
            this.moneda = null;
            //this.form.removeControl("id");
            this.crearForma();
        }else if(this.opcionBoton == "Guardar" && !this.nuevo){
            this.servicio.putRegistro("moneda/"+this.db+"/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
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
        let peticion = "moneda/"+this.db+"/"+id.toString()+"/";
        this.servicio.getDatos(peticion, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
            //this.empresa = rs[0];
            //this.form.addControl("id", this.fb.control(1));
            //this.form.controls["id"].patchValue(this.tarea.id);
            //this.empresaActual = this.empresa.id;
        },
        err=>console.log(err))

        /*this.opcionBoton = "Editar";
        this.opcionBoton2 = "Borrar";
        this.nuevo = false;*/

    }

    borrarMoneda(){
        if(this.nuevo){
            this.form.reset();
        }else if(this.opcionBoton2 == "Borrar"){
            var id = this.form.controls["id"].value;
            this.servicio.delRegistro(id, "moneda/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
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
            title: "Moneda",
            subTitle: mensaje,
            buttons: ["Ok"]
        });

        alert.present();
    }
}