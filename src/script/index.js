const grid = [
  197,
  200,
  202,
  203,
  204,
  206,
  207,
  151,
  152,
  156,
  159,
  169,
  168,
  167,
  166,
  198,
  199,
  201,
  209,
  208,
  205,
  177,
  150,
  153,
  154,
  155,
  158,
  160,
  161,
  162,
  163,
  103,
  105,
  106,
  107,
  108,
  109,
  110,
  111,
  112,
  113,
  114,
  115,
  116,
  117,
  118,
  119,
  0,
  253,
  184,
  183,
  182,
  129,
  130,
  131,
  132,
  133,
  134,
  135,
  137,
  138,
  139,
  0,
  191,
  187,
  185,
  186,
  181,
  121,
  123,
  145,
  144,
  142,
  140,
  136,
  127,
  128,
  0,
  0,
  190,
  188,
  178,
  179,
  180,
  120,
  122,
  147,
  146,
  143,
  141,
  124,
  125,
  0,
  0,
  0,
  0,
  189,
  0,
  0,
  172,
  171,
  173,
  174,
  175,
  176,
  170,
  126,
  0,
  0,
  0,
  0
];
console.log(grid);
mapboxgl.accessToken =
  "pk.eyJ1Ijoia3lsZS1ib3QiLCJhIjoiY2szNGQxeHVpMDA2eTNucG42dXRlbGN2OSJ9.xRLcc1Ki130PB1uaL9dKMQ";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/satellite-streets-v11",
  center: [24.0530, 37.7385],
  // bearing: 5,
  zoom: 15.5
});

map.scrollZoom.disable()
map.addControl(new mapboxgl.NavigationControl());

const container = map.getCanvasContainer();
const svg = d3.select(container).append("svg");
const selectSVG = d3.select(map.getCanvasContainer()).append('svg')
const tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)
  .style('z-index', '200000');
// const latDif = 0.0000218158352;
// const longDif = 0.0005681686864;
// const grid = [
//   {
//     ID: "53",
//     row: "1",
//     lat: "37.7406400186936",
//         long: "24.0493969266434"
//   },
//   {
//     ID: "52",
//     row: "2",
//       lat: "37.7401188247967",
//       long: "24.0493931461869"
//   },
//   {
//     ID: "51",
//     row: "3",
//       lat: "37.7396672272274",
//       long: "24.0493656766066"
//   },
//   {
//     ID: "1",
//     row: "4",
//       lat: "37.7392167047904",
//       long: "24.0493495418934"
//   },
//   {
//     ID: "2",
//     row: "5",
//       lat: "37.738765502845",
//       long: "24.0493220725487"
//   },
//   {
//     ID: "3",
//     row: "6",
//       lat: "37.7383143008771",
//       long: "24.0492946033563"
//   },
//   {
//     ID: "4",
//     row: "7",
//       lat: "37.7378939074782",
//       long: "24.0492676351279"
//   }
// ];

function getD3() {
  const bbox = document.body.getBoundingClientRect();
  const center = map.getCenter();
  const zoom = map.getZoom();
  const scale = ((512 * 0.5) / Math.PI) * Math.pow(2, zoom);
  const d3projection = d3
    .geoMercator()
    .center([center.lng, center.lat])
    .translate([bbox.width / 2, bbox.height / 2])
    // .rotate([50 / 50 / 0])
    .scale(scale);
  return d3projection;
}
let d3Projection = getD3();

makeSVG();

async function makeSVG() {
  let data = await fetch("gridfeatures.json").then(data => data.json());
  makeGrid(data);
}

function makeGrid(data) {
  function render(render) {
    d3Projection = getD3();
    const path = d3.geoPath();
    if (render == true) {
      selectSVG
        .selectAll("path")
        .remove()
        .exit();
      selectSVG
        .selectAll("g")
        .remove()
        .exit();
      selectSVG
        .selectAll("circle")
        .remove()
        .exit();
      selectSVG
        .selectAll("text")
        .remove()
        .exit();
    }
    const pathprojection = path.projection(getD3());
    selectSVG
      .insert("g")
      .selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
      .attr("d", pathprojection)
      .attr("data-tile", d => {
        return d.properties.name;
      })
      .on("click", d => {
        tooltip
          .transition()
          .duration(200)
          .style("opacity", 0.9);

        tooltip
          .html("<p>Macrosquare: " + d.properties.name + "</p>")
          .style("left", d3.event.pageX - 60 + "px")
          .style("top", d3.event.pageY - 64 + "px");
      })
      .on("mouseout", d => {
        tooltip
          .transition()
          .duration(200)
          .style("opacity", 0);
      })

      .style("fill", "white")
      .style("fill-opacity", "0.6")
      .style("stroke", "#fff")
      .style("stroke-width", "1")
      .style("stroke-opacity", "0.3");
  }

  map.on("viewreset", function() {
    render(true);
  });
  map.on("move", function() {
    render(true);
  });

  render();
}
