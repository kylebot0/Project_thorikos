
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
  makeFilters(gridData, rawData);
  makeGrid(gridData, cleanData);
}

function nestData(rawData) {
  let nestedArray = d3
    .nest()
    .key(d => {
      return d.Context_Survey_Homogenized;
    })
    .entries(rawData);
  return nestedArray;
}

function makeFilters(gridData, rawData) {
  console.log(rawData)
  let cleanData = nestData(rawData);

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
    CHRONOLOGY,
    SHAPE_OBJECT,
    SHAPE_DETAILS,
    WARE,
    CONSERVATION,
    PRODUCTION_PLACE
  ];

  filters.forEach(function(item, i) {
    console.log(item);
    d3.selectAll(".filter-container")
      .selectAll("label")
      .data(item)
      .enter()
      .append("label")
      .attr("class", "filter-option")
      .html(function(d) {
        return `<input id="${d.key}" class="filter" type="checkbox" checked="checked"> ` + d.key;
      });
  });

  d3.selectAll(".fast-filter").on("click", function () {
    this.id
    if(this.id == "fast-filter-all") {
      d3.select("#fast-filter-none").property("checked", false);
      d3.select(this).property("checked", true);
      makeGrid(gridData, cleanData);
    } else if(this.id == "fast-filter-none") {
      let noValues = [...new Set(rawData.Context_Survey_Homogenized)]
      console.log(noValues)
      d3.select("#fast-filter-all").property("checked", false)
      d3.select(this).property("checked", true)
      
      makeGrid(gridData, noValues);
    }
  })
  openMenu()
  filter(gridData, filters)
}

function openMenu() {
  d3.selectAll("button").on("click", function () {
    let element = this.nextElementSibling;
    if (element.classList.contains("show")) {
      d3.select(this).text("+")
      element.classList.toggle("show")
    } else {
      d3.select(this).text("-");
      element.classList.toggle("show");
    }
  })
}
function filter(gridData, filters) {
  filters = filters.flat()
  d3.selectAll(".filter")
  .on("click", function(){
    let category = this.id;
    let filteredArray = []
    filters.forEach(function(item, i){
      if (item.key == category){
        let nestedArray = nestData(item.values)
        filteredArray = nestedArray;
      } else {
        return
      }
    })
    makeGrid(gridData, filteredArray)
  })
}

function makeGrid(gridData, data) {
  render(true)
  function render(render) {
    console.log(data)
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
            let contextNr =
              "T12-" + d.properties.context + "-" + d.properties.mesoindex;
            if(d.properties.context == undefined) {
              
               return ("<p>" +
                d.properties.name +
                d.properties.row +
                "-" +
                d.properties.mesoindex +
                "</p>")
              
            } else {
            return ("<p>" +
            contextNr
              +
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
        let context =
          "T12-" + d.properties.context + "-" + d.properties.mesoindex;
        if (d.properties.context === undefined) {
          return "white";
        } else if(data.length == 0) {
          return "white"
        } else {
          let fill = '';
          let boolean = false;
        data.forEach(function(item, i) {
            if (context === item.key) {
              boolean = true;
              fill = color(item.values.length);
            } else if (boolean == false) {
              fill = "white"
            } else {
              return;
            }
        });
        return fill
      }
      })
      .style("fill-opacity", "0.8")
      .style("stroke", "#fff")
      .style("stroke-width", "1")
      .style("stroke-opacity", "0.3");

      // Total finds for filters
      d3.select(".nav-bottom").select('h2').text(function(){
        return totalItems + ' finds';
      })
  }

  map.on("viewreset", function() {
    render(true);
  });
  map.on("move", function() {
    render(true);
  });
}

function totalFound(data) {
  let total = 0;
  data.forEach(function(item, i) {
    total = total + item.values.length;
  })
  console.log(total)
  return total;
}