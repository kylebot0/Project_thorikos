mapboxgl.accessToken =
  "pk.eyJ1Ijoia3lsZS1ib3QiLCJhIjoiY2szNGQxeHVpMDA2eTNucG42dXRlbGN2OSJ9.xRLcc1Ki130PB1uaL9dKMQ";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/satellite-streets-v11",
  center: [24.053, 37.7385],
  // bearing: 5,
  zoom: 15.5
});

map.scrollZoom.disable();
map.addControl(new mapboxgl.NavigationControl());

const container = map.getCanvasContainer();
const svg = d3.select(container).append("svg");
const selectSVG = d3.select(map.getCanvasContainer()).append("svg");
const tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)
  .style("z-index", "200000");

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
  let rawData = await d3.csv("finds.csv").then(data => data);
  let cleanData = await nestData(rawData);
  let gridData = await fetch("gridFinal.json").then(data => data.json());
  makeFilters(rawData);
  makeGrid(gridData, cleanData);
}

function nestData(rawData) {
  let nestedArray = d3
    .nest()
    .key(d => {
      return d.Context_Survey_Homogenized;
    })
    .entries(rawData);
  console.log(nestedArray);
  return nestedArray;
}

function makeFilters(rawData) {
  let SHAPE_OBJECT = d3
    .nest()
    .key(d => {
      return d.SHAPE_OBJECT;
    })
    .entries(rawData);

  let SHAPE_DETAILS = d3
    .nest()
    .key(d => {
      return d.SHAPE_DETAILS;
    })
    .entries(rawData);

  let WARE = d3
    .nest()
    .key(d => {
      return d.WARE;
    })
    .entries(rawData);

  let PRODUCTION_PLACE = d3
    .nest()
    .key(d => {
      return d.PRODUCTION_PLACE;
    })
    .entries(rawData);

  let CONSERVATION = d3
    .nest()
    .key(d => {
      return d.CONSERVATION;
    })
    .entries(rawData);

  let CHRONOLOGY = d3
    .nest()
    .key(d => {
      return d.CHRONOLOGY;
    })
    .entries(rawData);

  let filters = [
    SHAPE_OBJECT,
    SHAPE_DETAILS,
    WARE,
    PRODUCTION_PLACE,
    CONSERVATION,
    CHRONOLOGY
  ];

  filters.forEach(function(item, i) {
    d3.select("body")
      .data(item)
      .enter()
      .select(".filter-container")
      .append("label")
      .html(function(d) {
        console.log(i);
        return "<input type='radio'> " + d.key;
      });
  });

  console.log(filters);
}

function makeGrid(gridData, data) {
  function render(render) {
    const totalItems = totalFound(data)
    const maxValue = d3.max(data, function (d) {
      return d.values.length;
    });
    const color = d3
      .scaleLinear()
      .range(["#fff","#fd8d3c"])
      .domain([0, maxValue]);

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

    // Making the grid
    const pathprojection = path.projection(getD3());
    selectSVG
      .insert("g")
      .selectAll("path")
      .data(gridData.features)
      .enter()
      .append("path")
      .attr("d", pathprojection)
      .attr("data-tile", d => {
        let contextNr =
          "T12-" + d.properties.context + "-" + d.properties.mesoindex;
        return contextNr;
      })
      .on("click", d => {
        tooltip
          .transition()
          .duration(200)
          .style("opacity", 0.9);

        tooltip
          .html(function(){
            if(d.properties.context == undefined) {
              
               return ("<p>" +
                d.properties.name +
                d.properties.row +
                "-" +
                d.properties.mesoindex +
                "</p>")
              
            } else {
            return ("<p>T12-" +
              d.properties.context +
              "-" +
              d.properties.mesoindex +
              "</p>")
            }
          })
          .style("left", d3.event.pageX - 60 + "px")
          .style("top", d3.event.pageY - 64 + "px");
      })
      .on("mouseout", d => {
        tooltip
          .transition()
          .duration(200)
          .style("opacity", 0);
      })
      .style("fill", d => {
        let contextNr =
          "T12-" + d.properties.context + "-" + d.properties.mesoindex;
        if (d.properties.context === undefined) {
          return "white";
        } else {
          let fill = '';
        data.forEach(function(item, i) {
          if (contextNr === item.key) {
            // console.log(contextNr);
            fill = color(item.values.length);
          } else {
            return;
          }
        });
        return fill
      }
      })
      .style("fill-opacity", "0.9")
      .style("stroke", "#fff")
      .style("stroke-width", "1")
      .style("stroke-opacity", "0.3");

      // Total finds for filters
      d3.select(".nav-left-title").select('p').text(function(){
        return totalItems + ' finds';
      })
  }

  map.on("viewreset", function() {
    render(true);
  });
  map.on("move", function() {
    render(true);
  });

  render();
}

function totalFound(data) {
  let total = 0;
  data.forEach(function(item, i) {
    total = total + item.values.length;
  })
  console.log(total)
  return total;
}