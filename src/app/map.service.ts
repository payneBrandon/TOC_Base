import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Constants } from './constants';
import { loadModules } from 'esri-loader';

@Injectable()
export class MapService {
  //#region Esri components
  Map;
  ArcGISDynamicMapServiceLayer;
  ArcGISTiledMapServiceLayer;
  LayerInfo;
  //#endregion

  //#region Map Components
  map;
  streetMap;
  aerialMap;
  topoMap;
  landfills;
  wind;
  turbines;
  nps;
  //#endregion

  public mapLoadPromise = new Promise<boolean>((resolve, reject) => { }); // : Promise<boolean>;

  constructor(private http: Http, private constants: Constants) { }

  loadMapComponents(): Promise<boolean> {
    this.mapLoadPromise = new Promise((resolve, reject) => {
      loadModules([
        'esri/map',
        'esri/layers/ArcGISDynamicMapServiceLayer',
        'esri/layers/ArcGISTiledMapServiceLayer',
        'esri/layers/LayerInfo',
        'esri/dijit/LayerList',
        'dijit/layout/BorderContainer',
        'dijit/layout/ContentPane',
        'dojo/parser',
        'dojo/domReady!'
      ],
        { url: this.constants.esriUrl }
      ).then(([
        Map,
        ArcGISDynamicMapServiceLayer1,
        ArcGISTiledMapServiceLayer,
        LayerInfo1,
        LayerList
      ]) => {
        this.Map = Map;
        this.ArcGISDynamicMapServiceLayer = ArcGISDynamicMapServiceLayer1;
        this.ArcGISTiledMapServiceLayer = ArcGISTiledMapServiceLayer;
        this.LayerInfo = LayerInfo1;
        // create the map at the DOM element in this component
        this.map = new Map(document.getElementById('map'), {
          sliderPosition: 'bottom-right',
          center: [-107.673158, 43.191612],
          zoom: 7
        });

        const myWidget = new LayerList({
          map: this.map,
          layers: [],
          showLegend: true,
          showSubLayers: true,
          showOpacitySlider: true,
        }, document.getElementById('layerList'));
        myWidget.startup();

        this.loadBaseLayers();
        resolve(true);
      });
    });
    return this.mapLoadPromise;
  }

  loadBaseLayers() {
    this.streetMap = new this.ArcGISTiledMapServiceLayer(this.constants.StreetMapEndpoint,
      { visible: true, id: 'base_street_layer' });
    this.aerialMap = new this.ArcGISTiledMapServiceLayer(this.constants.AerialMapEndpoint,
      { visible: false, id: 'base_aerial_layer' });
    this.topoMap = new this.ArcGISTiledMapServiceLayer(this.constants.TopoMapEndpoint,
      { visible: false, id: 'base_topo_layer' });

    this.landfills = new this.ArcGISDynamicMapServiceLayer(this.constants.landfillsEndpoint,
      { id: 'wdeq_landfills_layer' });

    this.wind = new this.ArcGISDynamicMapServiceLayer(this.constants.windPotentialEndpoint,
      { id: 'wind_potential_layer' });

    this.turbines = new this.ArcGISDynamicMapServiceLayer(this.constants.turbineLocEndpont,
      { id: 'turbine_location_layer' });

    this.nps = new this.ArcGISDynamicMapServiceLayer(this.constants.npsEndpoint,
      { id: 'nps_layer' });

    this.map.addLayers([
      this.aerialMap,
      this.topoMap,
      this.streetMap,
      this.wind,
      this.nps,
      this.landfills,
      this.turbines
    ]);
  }

}
