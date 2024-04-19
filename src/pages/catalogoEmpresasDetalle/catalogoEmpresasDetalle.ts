import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ConstructorService }  from '../../services/serviciosConstructor';
import { AlertController, NavParams }  from "ionic-angular";
import { Empresas }  from '../../services/empresas';
import { TiposEmpresa }  from '../../services/tiposempresa';
import { DatosAPP } from "../../services/datosApp";
        

@Component({
    selector: "catalogoEmpresasDetalle-pages",
    templateUrl: "catalogoEmpresasDetalle.html"
})

export class CatalogoEmpresasDetallePage{
    form: FormGroup;
    empresa: Empresas;
    listaTiposEmpresa: TiposEmpresa[];

    empresaActual: number
    nuevo: boolean;
    opcionBoton: string;
    opcionBoton2: string;
    color = "#488aff";
    id: number;
    borrar: boolean;
    db: String;
    asset: string;
    DatosUsuario: DatosAPP;

    constructor(private fb: FormBuilder, private formBuilder: FormBuilder, private servicio: ConstructorService, private alertController: AlertController,
                private navparams: NavParams){
        
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;
        this.asset = this.DatosUsuario.asset;


        this.empresa = this.navparams.get("empresa");

        if(this.empresa!=null && this.empresa!=undefined){

            this.empresaActual = this.empresa.id;
            this.nuevo == false;
        }else{
            this.nuevo==true;
        }

        this.cargarTiposEmpresa();
        this. crearForma();

    }

    cargarTiposEmpresa(){
        this.servicio.getDatos("tiposempresa/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe((rs)=>{
            this.listaTiposEmpresa = rs;
        }, er=>console.log(er))
    }

    crearForma(){
        if(this.empresa==null || this.empresa==undefined){
            this.form = this.formBuilder.group({
                tipo: [null, Validators.required],
                nombre: [null, Validators.required],
                direccion: [null],
                pais: [null],
                estado: [null],
                municipio: [null],
                rfc: [null],
                telefono: [null],
                cp: [null],
                num_beneficiario: [null],
                tipo_beneficiario: [null]
            });
            this.nuevo = true;
            this.opcionBoton = "Guardar";
            this.opcionBoton2 = "Cancelar";   
        }else{
            this.form = this.formBuilder.group({
            id: [this.empresa.id],
            tipo: [this.empresa.tipo],
            nombre: [this.empresa.nombre],
            direccion: [this.empresa.direccion],
            pais: [this.empresa.pais],
            estado: [this.empresa.estado],
            municipio: [this.empresa.municipio],
            rfc: [this.empresa.rfc],
            telefono: [this.empresa.telefono],
            cp: [this.empresa.cp],
            num_beneficiario: [this.empresa.num_beneficiario],
            tipo_beneficiario: [this.empresa.tipo_beneficiario]
        });
            this.form.disable();
            this.nuevo = false;
            this.opcionBoton = "Editar";
            this.opcionBoton2 = "Borrar";  
        }
        
    }

    guardarEmpresa(){
        if(this.nuevo){
            this.servicio.addRegistro("empresas/"+this.db+"/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto)
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
            this.empresa = null;
            //this.form.removeControl("id");
            this.crearForma();
        }else if(this.opcionBoton == "Guardar" && !this.nuevo){
            this.servicio.putRegistro("empresas/"+this.db+"/", this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
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
        let peticion = "empresas/"+this.db+"/"+id.toString()+"/";
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

    borrarEmpresa(){
        if(this.nuevo){
            this.form.reset();
        }else if(this.opcionBoton2 == "Borrar"){
            var id = this.form.controls["id"].value;
            this.servicio.delRegistro(id, "empresas/"+this.db+"/", this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
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
            title: "Empresas",
            subTitle: mensaje,
            buttons: ["Ok"]
        });

        alert.present();
    }
}