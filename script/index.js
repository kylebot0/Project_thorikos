mapboxgl.accessToken =
  "pk.eyJ1Ijoia3lsZS1ib3QiLCJhIjoiY2szNGQxeHVpMDA2eTNucG42dXRlbGN2OSJ9.xRLcc1Ki130PB1uaL9dKMQ";

//Setup mapbox-gl map
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/satellite-streets-v11",
  center: [24.055, 37.74],
  zoom: 15.5
});

// map.scrollZoom.disable()
map.addControl(new mapboxgl.NavigationControl());

// Setup our svg layer that we can manipulate with d3
const container = map.getCanvasContainer()
const svg = d3.select(container).append("svg")
const selectSVG = d3.select('svg')


function getD3() {
    var bbox = document.body.getBoundingClientRect();
    var center = map.getCenter();
    var zoom = map.getZoom();
    var scale = (512) * 0.5 / Math.PI * Math.pow(2, zoom);
    var d3projection = d3.geoMercator()
        .center([center.lng, center.lat])
        .translate([bbox.width / 2, bbox.height / 2])
        .scale(scale);
    return d3projection;
}

// calculate the original d3 projection
var d3Projection = getD3()

function mapboxProjection(lonlat) {
    console.log(lonlat)
    var p = map.project(new mapboxgl.LngLat(lonlat[0], lonlat[1]))
    return [p.x, p.y];
}

makeSVG()

async function makeSVG(){
await d3.csv('./grid.csv').then(function(data) {
    console.log(data);
    selectSVG.append("g").attr("class", "coords");

    selectSVG
    .selectAll('.coords')
    .data(data)
    .enter()
    .append("circle")
        .attr("r", '1')
        .style('fill', "red")
        .style("fill-opacity", '1')
            .style('stroke', "#004d60")
            .style("stroke-width", '1')
        .transition()
        .duration(1000)
        .attr("r", '5');

    function render() {
        d3Projection = getD3();

        selectSVG
            .selectAll('circle')
          .data(data)
          .attr('cx', function(d) {
            console.log(d)
              let x = d3Projection([d.long, d.lat])[0];
              console.log(x)
              return x;
            })
            .attr('cy', function(d) {
            let y = d3Projection([d.long, d.lat])[1];
              return y;
            });
    }

    // re-render our visualization whenever the view changes
    map.on("viewreset", function () {
        render()
    })
    map.on("move", function () {
        render()
    })

    // render our initial visualization
    render()
})
}

