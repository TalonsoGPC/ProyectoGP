import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ConstructorService }  from '../../services/serviciosConstructor';
import { AlertController, NavParams, NavController }  from "ionic-angular";
import { TiposEmpresa }  from '../../services/tiposEmpresa';
import { MenuBossPage  } from "../menuBoss/menuBoss";
import { DatosAPP } from "../../services/datosApp";

@Component({
    selector: "catalogoTipoEmpresaDetalle-pages",
    templateUrl: "catalogoTipoEmpresaDetalle.html"
})

export class CatalogoTipoEmpresaDetallePage{
    form: FormGroup;
    tipoempresa: TiposEmpresa;
    tipoActual: number;
    nuevo: boolean;
    opcionBoton: string;
    opcionBoton2: string;
    color = "#488aff";
    id: number;
    borrar: boolean;
    db: string;
    DatosUsuario: DatosAPP;

    constructor(private navCtlr: NavController, private fb: FormBuilder, private formBuilder: FormBuilder, private servicio: ConstructorService, private alertController: AlertController,
                private navparams: NavParams, ){
        
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;
        this.tipoempresa = this.navparams.get("tipoempresa");

        if(this.tipoempresa!=null && this.tipoempresa!=undefined){
            this.tipoActual = this.tipoempresa.tipo;
        }
        this. crearForma();
                

       
    }

    crearForma(){

        if(this.tipoempresa==null || this.tipoempresa==undefined){
            this.form = this.formBuilder.group({
                descripcion: [null, Validators.required]
            });
            this.nuevo = true;
            this.opcionBoton = "Guardar";
            this.opcionBoton2 = "Cancelar";   
        }else{
            this.form = this.formBuilder.group({
            tipo: [this.tipoempresa.tipo, Validators.required],
            descripcion: [this.tipoempresa.descripcion, Validators.required]
        });
            this.form.disable();
            this.nuevo = false;
            this.opcionBoton = "Editar";
            this.opcionBoton2 = "Borrar";  

        }
        
    }

    guardarTipoEmpresa(){
        if(this.nuevo){
            this.servicio.addRegistro("tiposempresa/"+ this.db + "/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
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
            this.servicio.putRegistro("tiposempresa/"+ this.db + "/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
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
        let peticion = "tiposempresa/"+ this.db + "/" + id.toString()+"/";
        this.servicio.getDatos(peticion, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
            this.tipoempresa = rs[0];
            //this.form.addControl("id", this.fb.control(1));
            //this.form.controls["id"].patchValue(this.tema.id);
            this.tipoActual = this.tipoempresa.tipo;
        },
        err=>console.log(err))

        /*this.opcionBoton = "Editar";
        this.opcionBoton2 = "Borrar";
        this.nuevo = false;*/

    }

    borrarTipoEmpresa(){
        if(this.nuevo){
            this.form.reset();
        }else if(this.opcionBoton2 == "Borrar"){
            var id = this.form.controls["id"].value;
            this.servicio.delRegistro(id, "temas/"+ this.db + "/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
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
            title: "Tipos Empresa",
            subTitle: mensaje,
            buttons: ["Ok"]
        });

        alert.present();
    }

    irControlObra(){
        this.navCtlr.push(MenuBossPage, {DatosUsuario: this.DatosUsuario});
    }
}

