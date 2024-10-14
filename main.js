     //Cesium token
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzOTViY2E5OS1jOWUyLTRiMjgtOTY0My0xMjJhYmNkMmZhM2MiLCJpZCI6MjQxNzg1LCJpYXQiOjE3Mjc2OTQ4Njd9.Ku5x0fQnn9ZSOWkjT5HcaMP9SyPeKbIYhGRGvUWm1Ng';

    // Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
const viewer = new Cesium.Viewer('cesiumContainer', {
    scene3DOnly: true,
    baseLayerPicker: false,
    infoBox: false,  
    HomeButton:false, 
    timeline: true,
    animation: true,
  });

  
  // Enable lighting for better extrusion visibility
  viewer.scene.globe.enableLighting = true;
  //storing geojson datasource
  let geoJsonDataSource;
  // Load GeoJSON from Cesium Ion asset
  Cesium.IonResource.fromAssetId(2762931).then(resource => {
    return Cesium.GeoJsonDataSource.load(resource, { clampToGround: false });
  }).then(dataSource => {
    viewer.dataSources.add(dataSource);
    
    // Set extrusions and zoom to data
    dataSource.entities.values.forEach(entity => {
      if (entity.polygon) {
        const height = entity.properties.height?.getValue() || 0;
        const buildingId = entity.properties.building_id?.getValue() || null;
        const additionalHeight = (buildingId === 42) ? 50 : 2.5;  // Increase for Humanities, default for others
        const engheight=(buildingId===9)?30:2.5 ;
        // Apply extrusion and styling
        Object.assign(entity.polygon, {
          extrudedHeight: height + additionalHeight+engheight,
          height: 0,
          material: Cesium.Color.PINK,
          outline: true,
          outlineColor: Cesium.Color.BLACK
        });
      }
    });
  
    // Zoom to the loaded data source
    viewer.flyTo(dataSource);
  }).catch(error => {
    console.error('Error loading GeoJSON:', error);
  });
  
  // Set up click event listener to display building info
  viewer.selectedEntityChanged.addEventListener(entity => {
    const infoBox = document.getElementById('infoBox');
    infoBox.innerHTML = 'Click on a building to view details';
    
    if (Cesium.defined(entity) && Cesium.defined(entity.properties)) {
      const properties = entity.properties;
      infoBox.innerHTML = '<strong>Building Information:</strong><br>' +
        properties.propertyNames.map(name => 
          `<strong>${name}:</strong> ${properties[name].getValue()}<br>`
        ).join('');
    }
  });
  