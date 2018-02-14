import { Component, OnInit, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MapService } from '../map.service';

@Component({
  selector: 'app-esri-map',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent implements OnInit {
  // @ViewChild('map') mapEl: ElementRef;
  // @ViewChild('layerList') lyrLst: ElementRef;
  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.mapService.loadMapComponents(); // this.mapEl.nativeElement);
  }

}
