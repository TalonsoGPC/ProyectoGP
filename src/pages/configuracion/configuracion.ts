import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { ProyectosPage } from "../proyectos/proyectos";
import { CatalogoTemasPage } from "../catalogoTemas/catalogoTemas";
import { CatalogoTareasPage } from "../catalogoTareas/catalogoTareas";
import { ConfigTiposAlertaPage } from "../configTiposAlerta/configTiposAlerta";
import { CatalogoTipoEmpresaPage } from "../catalogoTipoEmpresa/catalogoTipoEmpresa";
import { CatalogoEmpresasPage } from "../catalogoEmpresas/catalogoEmpresas";
import { MenuBossPage  } from "../menuBoss/menuBoss";
import { CatalogoMonedasPage } from "../catalogoMonedas/catalogoMonedas";
import { CatalogoUsuariosPage } from "../catalogoUsuarios/catalogoUsuarios";
import { SeleccionarAppPage } from "../seleccionarApp/seleccionarApp";
import { DatosAPP } from "../../services/datosApp";

@Component({
    selector: "configuracion-page",
    templateUrl: "configuracion.html"
}) 

export class ConfiguracionPage{
    items = [];
    DatosUsuario: DatosAPP;

    constructor(private navparams: NavParams, public navController:NavController){
        this.DatosUsuario = this.navparams.get("DatosUsuario");
       
        this.items = [
        {
            'title':'Permisos APP',
            'icon':'ios-lock-outline',
            'color':'#000000'
        },
        {
            'title':'Proyectos',
            'icon':'ios-aperture-outline',
            'color':'#488aff'
        },
        {
            'title':'Temas',
            'icon':'ios-apps-outline',
            'color':'#fe9a2e'
        },
        {
            'title':'Tareas',
            'icon':'logo-buffer',
            'color':'#F79F81'
        },
        /*{
            'title':'Estatus',
            'icon':'ios-bulb-outline',
            'color':'#f53d3d'
        },*/
        {
            'title':'Alertas',
            'icon':'ios-warning-outline',
            'color':'#f53d3d'
        },
        /*{
            'title':'Responsables',
            'icon':'ios-person-add-outline',
            'color':'#088a08'
        },
        */{
            'title':'Usuarios',
            'icon':'ios-people-outline',
            'color':'#CE6296'
        },
        {
            'title':'Tipos Empresa',
            'icon':'ios-man-outline',
            'color':'#28b609'
        },
        {
            'title':'Empresas',
            'icon':'ios-contacts-outline',
            'color':'#3c150c'
        },
        {
            'title':'Monedas',
            'icon':'logo-usd',
            'color':'#21610B'
        },
        ]
  }

  listaObjectos(item){
    if(item.title == "Proyectos"){
        this.navController.push(ProyectosPage,{
            objeto: item,
            DatosUsuario: this.DatosUsuario
        });
    }else if(item.title == "Temas"){
        this.navController.push(CatalogoTemasPage,{
            objeto: item,
            DatosUsuario: this.DatosUsuario
        });
    }else if(item.title == "Tareas"){
        this.navController.push(CatalogoTareasPage,{
            objeto: item,
            DatosUsuario: this.DatosUsuario
        });
    }else if(item.title == "Alertas"){
        this.navController.push(ConfigTiposAlertaPage, {
            objeto: item,
            DatosUsuario: this.DatosUsuario
        })
    }else if(item.title == "Tipos Empresa"){
        this.navController.push(CatalogoTipoEmpresaPage, {
            objeto: item,
            DatosUsuario: this.DatosUsuario
        })
    }else if(item.title == "Empresas"){
        this.navController.push(CatalogoEmpresasPage, {
            objeto: item,
            DatosUsuario: this.DatosUsuario
        })
    }else if(item.title == "Monedas"){
        this.navController.push(CatalogoMonedasPage, {
            objeto: item,
            DatosUsuario: this.DatosUsuario
        })
    }else if(item.title == "Permisos APP"){

        this.navController.push(SeleccionarAppPage, {
            parametro: 2,
            DatosUsuario: this.DatosUsuario
        });        

    }else if(item.title == "Usuarios"){
        this.navController.push(CatalogoUsuariosPage, {
            objeto: item,
            DatosUsuario: this.DatosUsuario
        })          
    }
  }

    irControlObra(){
        this.navController.push(MenuBossPage, { DatosUsuario: this.DatosUsuario});
    }

}

