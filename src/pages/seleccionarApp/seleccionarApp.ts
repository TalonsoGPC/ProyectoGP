import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { MenuBossPage } from "../menuBoss/menuBoss";
import { MenuControlObraPage } from "../menucontrolobra/menucontrolobra";
import { MenuVentasPage } from "../menuVentas/menuVentas";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ConstructorService } from "../../services/serviciosConstructor";
import { DatosAPP } from "../../services/datosApp";

@Component({
    selector: "seleccionarApp-page",
    templateUrl: "seleccionarApp.html"
})

export class SeleccionarAppPage{
    form: FormGroup;
    cveusuario: string;
    idUsuario: number;
    menuBoss : boolean;
    menuProyectos: boolean;
    menuVentas: boolean;
    menuInmuebles: boolean;
    administrador: boolean;
    parametro: number;
    db: string;
    DatosUsuario: DatosAPP;

    constructor(public navCtrl: NavController, public navparams: NavParams, public fb: FormBuilder, public servicio: ConstructorService){
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;
        
        this.cveusuario =  "";
        this.idUsuario = 0;
        this.parametro = 0;

        

        this.cveusuario = this.navparams.get("cveusuario");
        this.idUsuario = this.navparams.get("idusuario");
        this.parametro = this.navparams.get("parametro");
        

        if(this.parametro == null || this.parametro == undefined){
            this.parametro = 0;
        }

        this.menuBoss = false;
        this.menuProyectos = false;
        this.menuVentas = false;
        this.menuInmuebles = false;
        this.administrador = false;

        this.crearForma();

    }

    crearForma(){
        this.form = this.fb.group({
            id: [this.DatosUsuario.id_usuario],
            cveusuario: [this.DatosUsuario.usuario],
            boss: [null],
            proyectos: [null],
            ventas: [null],
            inmuebles: [null],
            admin: [null]
        });
    }
    
    onMenu(){

       if(this.menuBoss){
           this.form.controls["boss"].patchValue(1);
       } else{
            this.form.controls["boss"].patchValue(0);
       }

       if(this.menuProyectos){
           this.form.controls["proyectos"].patchValue(1);
       }else{
           this.form.controls["proyectos"].patchValue(0);
       }

       if(this.menuVentas){
           this.form.controls["ventas"].patchValue(1);
       }else{
           this.form.controls["ventas"].patchValue(0);
       }

       if(this.menuInmuebles){
           this.form.controls["inmuebles"].patchValue(1);
       } else{
            this.form.controls["inmuebles"].patchValue(0);
       }

       if(this.administrador){
         this.form.controls["admin"].patchValue(1);
         this.DatosUsuario.admin = 1;
        } else{
         this.form.controls["admin"].patchValue(0);
         this.DatosUsuario.admin = 0;
        }

       this.servicio.putRegistro("usuarios/"+this.db, this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
            console.log(rs);
       }, err=>console.log(err));

       if(this.menuBoss){
            this.navCtrl.push(MenuBossPage, {
                menuProyectos: this.menuProyectos,
                menuVentas: this.menuVentas,
                menuInmuebles: this.menuInmuebles,
                DatosUsuario: this.DatosUsuario
            });
       }else if(!this.menuBoss && this.menuProyectos && !this.menuVentas){
            this.navCtrl.push(MenuControlObraPage, {DatosUsuario: this.DatosUsuario});
       }else if(!this.menuBoss && !this.menuProyectos && this.menuVentas){
            this.navCtrl.push(MenuVentasPage, {DatosUsuario: this.DatosUsuario});
       }
       
    }

    ionChangeMenuBoss(param){
        if(!this.menuBoss){
            this.menuVentas = false;
            this.menuProyectos = false;
            this.menuInmuebles = false;
        }

    }

    ionChangeMenuProyectos(param){
        if(!this.menuBoss){
            this.menuVentas = false;
        }
        
    }

     ionChangeMenuVentas(param){
        if(!this.menuBoss){
            this.menuProyectos = false;
        }
       
    }

    ionChangeMenuInmuebles(param){
        if(!this.menuBoss){
            this.menuProyectos = false;
        }
       
    }

    ionChangeMenuAdmin(param){
        if(!this.administrador){
            this.administrador = false;
        }
       
    }

    onMenu2(){
        if(this.menuBoss){
           this.form.controls["boss"].patchValue(1);
       } else{
            this.form.controls["boss"].patchValue(0);
       }

       if(this.menuProyectos){
           this.form.controls["proyectos"].patchValue(1);
       }else{
           this.form.controls["proyectos"].patchValue(0);
       }

       if(this.menuVentas){
           this.form.controls["ventas"].patchValue(1);
       }else{
           this.form.controls["ventas"].patchValue(0);
       }

       if(this.menuInmuebles){
           this.form.controls["inmuebles"].patchValue(1);
       } else{
            this.form.controls["inmuebles"].patchValue(0);
       }

       if(this.administrador){
        this.form.controls["admin"].patchValue(1);
       } else{
        this.form.controls["admin"].patchValue(0);
       }

       this.servicio.putRegistro("usuarios/"+this.db, this.form.value, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(rs=>{
            console.log(rs);
       }, err=>console.log(err));

    }
}