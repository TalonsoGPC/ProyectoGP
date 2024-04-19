import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { DocumentacionDetallePage }  from "../documentacionDetalle/documentacionDetalle";
import { DatosAPP } from "../../services/datosApp";

@Component({
    selector: "documentacion-page",
    templateUrl: "documentacion.html"
})

export class DocumentacionPage{
    listaTiposDocumentos: any[]=[];
    DatosUsuario: DatosAPP;

    constructor(private navparams: NavParams, private navCtlr: NavController){
        this.DatosUsuario = this.navparams.get("DatosUsuario");
        this.listaTiposDocumentos.push({
            tipo: 1,
            descripcion: "Fotos",
            formato: "jpg",
            imagen: "fotoIcono.png"
        });
        this.listaTiposDocumentos.push({
            tipo: 2,
            descripcion: "Videos",
            formato: "mp4",
            imagen: "videoIcono.png"
        });
        this.listaTiposDocumentos.push({
            tipo: 3,
            descripcion: "PDF",
            formato: "pdf",
            imagen: "pdfIcono.png"
        });
        this.listaTiposDocumentos.push({
            tipo: 4,
            descripcion: "Excel",
            formato: "xls",
            imagen: "excelIcono.png"
        });
        this.listaTiposDocumentos.push({
            tipo: 5,
            descripcion: "Word",
            formato: "doc",
            imagen: "wordIcono.png"
        });
        this.listaTiposDocumentos.push({
            tipo: 6,
            descripcion: "AutoCad",
            formato: "dwg",
            imagen: "autocadIcono.png"
        });
    }

    verDocumentos(tipoArchivo){
        this.navCtlr.push(DocumentacionDetallePage, {
            tipoArchivo:tipoArchivo,
            DatosUsuario: this.DatosUsuario
        });
    }
}