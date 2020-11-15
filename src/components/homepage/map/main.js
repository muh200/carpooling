//call the init_map function when the window is loaded
window.onload = init_map;

function init_map() {
    const map = new ol.Map({
        view: new ol.View({
			//we hope to center at New York
            center: [-8226690.098, 4975442.6409],
            zoom: 15,
			//set the maximum zoom level
			maxZoom: 20,
			minZoom: 10,
			rotation: 0.5
        }),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],

        target: 'my_map'
    })
	
	
	// display coordinates by clicking on the console
	map.on('click',function(e){
		console.log(e.coordinate);
	})
}