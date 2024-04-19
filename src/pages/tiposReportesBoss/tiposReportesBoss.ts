import  { Component } from "@angular/core";
import { NavController, NavParams  } from "ionic-angular";
import { TiposReportesBoss } from "../../services/tiposReportes";
import { ConstructorService } from "../../services/serviciosConstructor";
import { ReportesProyectosPage  } from "../reportesProyectos/reportesProyectos";
import { ReportesBossDetallePage  } from "../reportesBossDetalle/reportesBossDetalle";
import { DatosAPP } from "../../services/datosApp";


@Component({
    selector: "tiposReportesBoss-page",
    templateUrl: "tiposReportesBoss.html"
})

export class TiposReportesBossPage{
    listaTiposReporte: TiposReportesBoss[];
    db: string;
    DatosUsuario: DatosAPP;

    constructor(private navparams: NavParams, private navCtlr: NavController, private servicio: ConstructorService){
        
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.db = this.DatosUsuario.db;
        this.cargarListaTiposReporte();
    }

    cargarListaTiposReporte(){
        this.servicio.getDatos("tipoReportesBoss/"+this.db, this.DatosUsuario.direccion_remota, this.DatosUsuario.puerto).subscribe(
            rs => {
                this.listaTiposReporte = rs
            },
            err=>console.log(err)
        )
    }

    irReportesProyectos(tipoReporte){
        this.navCtlr.push(ReportesProyectosPage, {
            tipoReporte: tipoReporte.id,
            DatosUsuario: this.DatosUsuario
        });
    }

    getFiltro(){
        this.navCtlr.push(ReportesBossDetallePage, {DatosUsuario: this.DatosUsuario});
    }
}