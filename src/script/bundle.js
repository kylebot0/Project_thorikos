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
const selectSVG = d3
  .select(map.getCanvasContainer())
  .append("svg")
  .attr("class", "map");
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
  let cleanData = nestData(rawData);

  let SHAPE_OBJECT = d3
    .nest()
    .key(d => {
      d.SHAPE_OBJECT = d.SHAPE_OBJECT.toLowerCase();
      return d.SHAPE_OBJECT;
    })
    .entries(rawData);

  let SHAPE_DETAILS = d3
    .nest()
    .key(d => {
      d.SHAPE_DETAILS = d.SHAPE_DETAILS.toLowerCase();
      return d.SHAPE_DETAILS;
    })
    .entries(rawData);

  let WARE = d3
    .nest()
    .key(d => {
      d.WARE = d.WARE.toLowerCase();
      return d.WARE;
    })
    .entries(rawData);

  let PRODUCTION_PLACE = d3
    .nest()
    .key(d => {
      d.PRODUCTION_PLACE = d.PRODUCTION_PLACE.toLowerCase();
      return d.PRODUCTION_PLACE;
    })
    .entries(rawData);

  let CONSERVATION = d3
    .nest()
    .key(d => {
      d.CONSERVATION = d.CONSERVATION.toLowerCase();
      return d.CONSERVATION;
    })
    .entries(rawData);

  let CHRONOLOGY = d3
    .nest()
    .key(d => {
      d.CHRONOLOGY = d.CHRONOLOGY.toLowerCase();
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

  let filterCategory = [
    "chronology",
    "object",
    "details",
    "ware",
    "conservation",
    "place"
  ];

  filters.forEach(function(item, i) {
    item.sort(function(a, b) {
      let textA = a.key.toUpperCase();
      let textB = b.key.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
  });

  filterCategory.forEach(function(category, i) {
    appendFilters(filters[i], category);
  });
  openMenu();
  lowerCase(rawData);

  //New rawdata for filters to add
  let newRawData = [...rawData];

  filter(gridData, filters, rawData, newRawData);
  filterCategory.forEach(function(category, i) {
    makeBars(filters, category, i);
  });
  updateBars(filters);
}

function makeBars(filters, category, i) {
  console.log(filters[i]);
  let barChart = d3
    .select(`.filter-chart-container-${category}`)
    .append("svg")
    .attr("class", "bar-chart")
    .attr("width", "100%")
    .attr("height", "100%")
    .append("g");
  let width = 50;

  d3.selectAll(".filter-container").attr("class", "filter-container show");
  d3.selectAll(`.filter-container-${category}`).attr(
    "class",
    `filter-container-${category} show`
  );

  let height = d3
    .select(`.filter-chart-container-${category}`)
    .node()
    .getBoundingClientRect().height;

  d3.selectAll(".filter-container").attr("class", "filter-container");
  d3.selectAll(`.filter-container-${category}`).attr(
    "class",
    `filter-container-${category}`
  );

  var maximumY = d3.max(filters[0], function(d) {
    return d.values.length;
  });

  var y = d3
    .scaleBand()
    .range([0, height])
    .padding(0);

  var x = d3.scaleLinear().range([0, width]);

  x.domain([
    -(maximumY * 0.03),
    d3.max(filters[i], function(d) {
      return d.values.length;
    }) / 2
  ]);
  y.domain(
    filters[i].map(function(d) {
      return d.key;
    })
  );

  let bars = barChart
    .selectAll(".bar")
    .data(filters[i])
    .enter()
    .append("g");

  bars
    .append("rect")
    .attr("class", "bar")
    .attr("id", function(d) {
      return d.key;
    })
    .attr("width", function(d) {
      return x(d.values.length);
    })
    .attr("y", function(d) {
      return y(d.key);
    })
    .attr("height", "12")
    .style("fill", "lightgrey");

  bars
    .append("text")
    .attr("class", "label")
    .attr("y", function(d) {
      return y(d.key) + 10;
    })
    .attr("x", function(d) {
      return 120;
    })
    .text(function(d) {
      return d.values.length;
    });
}

function appendFilters(filter, category) {
  d3.selectAll(`.filter-container-${category}`)
    .selectAll("label")
    .data(filter)
    .enter()
    .append("label")
    .attr("class", "filter-option")
    .html(function(d) {
      let key = d.key;
      key = key.replace(/[/]/g, "_");
      key = key.replace(/[ ]/g, "-");
      key = key.replace(/[+]/g, "p");
      key = key.replace(/[?]/g, "q");
      return (
        `<input id="${key}" class="filter" type="checkbox" checked="checked">
        <span class="checkmark"></span>  ` +
        d.key
      );
    });
}

function openMenu() {
  d3.selectAll(".menu").on("click", function() {
    let element = this.nextElementSibling;
    let childElement = this.nextElementSibling.children[0];
    if (element.classList.contains("show")) {
      d3.select(this).text("+");
      element.classList.toggle("show");
      childElement.classList.toggle("show");
    } else {
      d3.select(this).text("-");
      element.classList.toggle("show");
      childElement.classList.toggle("show");
    }
  });
}

function filter(gridData, filters, data, cleanData) {
  d3.selectAll(".fast-filter").on("click", function() {
    if (this.id == "fast-filter-all") {
      data = cleanData;
      d3.select("#fast-filter-none").property("checked", false);
      d3.select(this).property("checked", true);
      d3.selectAll(".filter").property("checked", true);
      let nestedArray = nestData(cleanData);
      filteredArray = nestedArray;
      updateBars(filters)
      makeGrid(gridData, filteredArray);
    } else if (this.id == "fast-filter-none") {
      data = [];
      d3.select("#fast-filter-all").property("checked", false);
      d3.select(this).property("checked", true);
      d3.selectAll(".filter").property("checked", false);
      updateBars(filters)
      makeGrid(gridData, data);
    }
  });

  filters = filters.flat();
  d3.selectAll(".filter").on("click", function() {
    let filterButton = this;
    let category = this.id;
    category = category.replace(/[_]/g, "/");
    category = category.replace(/[-]/g, " ");
    category = category.replace(/[p]/g, "p");
    category = category.replace(/[?]/g, "q");
    let filteredArray = [];
    if (this.checked) {
      cleanData.forEach(function(item, i) {
        if (category === item.CHRONOLOGY) {
          data.push(item);
        } else if (category === item.SHAPE_OBJECT) {
          data.push(item);
        } else if (category === item.SHAPE_DETAILS) {
          data.push(item);
        } else if (category === item.WARE) {
          data.push(item);
        } else if (category === item.CONSERVATION) {
          data.push(item);
        } else if (category === item.PRODUCTION_PLACE) {
          data.push(item);
        } else {
          return;
        }
      });
      let nestedArray = nestData(data);
      filteredArray = nestedArray;

      updateBars(filters, category, filterButton, data);
      makeGrid(gridData, filteredArray);
    } else if (!this.checked) {
      // console.log(this)
      data = data.filter(function(item) {
        if (category === item.CHRONOLOGY) {
          return false;
        } else if (category === item.SHAPE_OBJECT) {
          return false;
        } else if (category === item.SHAPE_DETAILS) {
          return false;
        } else if (category === item.WARE) {
          return false;
        } else if (category === item.CONSERVATION) {
          return false;
        } else if (category === item.PRODUCTION_PLACE) {
          return false;
        } else {
          return true;
        }
      });
      // console.log(data);
      let nestedArray = nestData(data);
      filteredArray = nestedArray;
    } else {
      return;
    }
    updateBars(filters, category, filterButton), data;
    makeGrid(gridData, filteredArray);
  });
}

function updateBars(filters, category, filterButton, data) {
  // console.log(category)
  d3.selectAll(".bar")
    .transition()
    .duration(500)
    .style("fill", function() {
      // console.log(filters)
      let bar = this;
      let fill = ""
      filters = filters.flat()
      filters.forEach(function(item, i) {
          let category = item.key
              category = category.replace(/[/]/g, "_");
              category = category.replace(/[ ]/g, "-");
              category = category.replace(/[+]/g, "p");
              category = category.replace(/[?]/g, "q");
          if (d3.select(bar).property("id") == item.key) {
            // console.log(category);
            let inputChecked = d3.select(`#${category}`);
            if (inputChecked.property("checked") == false) {
              fill = "lightgrey";
            } else if (inputChecked.property("checked") == true) {
              fill = "#D95236";
            }
          } else {
          }
        });
        return fill;
    });
}

function lowerCase(data) {
  data.forEach(function(item, i) {
    item.CHRONOLOGY = item.CHRONOLOGY.toLowerCase();
  });
}

function makeGrid(gridData, data) {
  render(true);
  function render(render) {
    const totalItems = totalFound(data);
    const maxValue = d3.max(data, function(d) {
      return d.values.length;
    });
    const pivotArray = makePivotArray(maxValue);

    d3Projection = getD3();
    const path = d3.geoPath();

    if (render == true) {
      //Deleting everything on re-render
      d3.select(".legend")
        .remove()
        .exit();
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
    if (data.length == 0) {
      console.log("test");
      d3.selectAll(".legend")
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
          .style("opacity", 1);

        tooltip
          .html(function() {
            return makeTooltip(d, data);
          })
          .style("left", d3.event.pageX - 120 + "px")
          .style("top", d3.event.pageY - 300 + "px");
      })
      .on("mouseout", d => {
        tooltip
          .transition()
          .duration(200)
          .style("opacity", 0);
      })
      .style("fill", d => {
        return matchContextToPath(data, d, pivotArray, maxValue);
      })
      .style("fill-opacity", function() {
        let fill = d3.select(this).style("fill");
        if (fill == "white") {
          return 0.6;
        } else {
          return 1;
        }
      })
      .style("stroke", "#fff")
      .style("stroke-width", "1")
      .style("stroke-opacity", "0.3");

    // Total finds for filters
    d3.select(".nav-bottom")
      .select("h2")
      .text(function() {
        return totalItems + " finds";
      });

    //Make legend
    makeLegend(data, pivotArray, maxValue);
    d3.select("#loading").remove().exit()
  } 
  let download = false;
  d3.select(".button-download").on("click", function(){
    download = !download;
    if(download == true){
      d3.select(".container-share").style("display", "block")
    } else {
      d3.select(".container-share").style("display", "none");
    }
  })
  map.on("viewreset", function() {
    render(true);
  });
  map.on("move", function() {
    render(true);
  });
}

function matchContextToPath(data, d, pivotArray, maxValue) {
  const color = d3
    .scaleLinear()
    .range([
      "#fff",
      "#FCF9D0",
      "#FBE2A3",
      "#F7C687",
      "#F2AB6D",
      "#EB9052",
      "#E3723C",
      "#D95236"
    ])
    .domain([
      0,
      pivotArray[6],
      pivotArray[5],
      pivotArray[4],
      pivotArray[3],
      pivotArray[2],
      pivotArray[1],
      pivotArray[0],
      maxValue
    ]);

  let context = "T12-" + d.properties.context + "-" + d.properties.mesoindex;
  if (d.properties.context === undefined) {
    return "white";
  } else if (data.length == 0) {
    return "white";
  } else {
    let fill = "";
    let boolean = false;
    data.forEach(function(item, i) {
      if (context === item.key) {
        boolean = true;
        fill = color(item.values.length);
      } else if (boolean == false) {
        fill = "white";
      } else {
        return;
      }
    });
    return fill;
  }
}

function makeTooltip(d, data) {
  if (d.properties.context == undefined) {
    return (
      "<h2>A-" +
      d.properties.mesoindex +
      "</h2><div class='tooltip-container'><h3>0" +
      "</h3>" +
      "<p>FOUND OBJECTS*</p>" +
      "</div><div class='tooltip-container'>" 
      +"</div>"
    );
  } else {
    let contextNr = "T12-" + d.properties.context + "-" + d.properties.mesoindex;
    let objectsFound = 0;

    data.forEach(function (item, i) {
      if (contextNr === item.key) {
        boolean = true;
        objectsFound = item.values.length;
      } else {
        return;
      }
    });
    return (
      "<h2>" +
      contextNr +
      "</h2><div class='tooltip-container'><h3>" +
      objectsFound +
      "</h3>" +
      "<p>FOUND OBJECTS*</p>" +
      "</div><div class='tooltip-container'>" 
      +"</div>"
    );
  }
}

function makePivotArray(maxValue) {
  let pivotArray = [maxValue];
  let pivotNumber = maxValue;

  for (let i = 0; i < 7; i++) {
    pivotNumber = Math.round(pivot(pivotNumber));
    pivotArray.push(pivotNumber);
  }
  return pivotArray;
}

function makeLegend(data, pivotArray, maxValue) {
  const color = d3
    .scaleLinear()
    .range([
      "#fff",
      "#FCF9D0",
      "#FBE2A3",
      "#F7C687",
      "#F2AB6D",
      "#EB9052",
      "#E3723C",
      "#D95236"
    ])
    .domain([
      0,
      pivotArray[6],
      pivotArray[5],
      pivotArray[4],
      pivotArray[3],
      pivotArray[2],
      pivotArray[1],
      pivotArray[0],
      maxValue
    ]);
  pivotArray = pivotArray.reverse(pivotArray.push(0));
  let width = 30;
  let height = 20;
  let x = 0;

  let legend = d3
    .select(".legend-container")
    .append("svg")
    .attr("class", "legend")
    .attr("height", "12vh")
    .attr("width", "300");

  legend
    .selectAll("rect")
    .data(pivotArray)
    .enter()
    .append("rect")
    .attr("height", height)
    .attr("width", width)
    .attr("x", function() {
      x = x + width;
      return x;
    })
    .attr("y", "30")
    .style("fill", function(d) {
      return color(d);
    });

  x = 10;

  legend
    .selectAll("text")
    .data(pivotArray)
    .enter()
    .append("text")
    .attr("class", "legend-label")
    .attr("x", function() {
      x = x + width;
      return x;
    })
    .attr("y", "65")
    .text(function(d) {
      console.log(d);
      if (isNaN(d)) {
        return "";
      } else {
        return d;
      }
    });
}

function pivot(val) {
  val = val * 0.75;
  return val;
}

function totalFound(data) {
  let total = 0;
  data.forEach(function(item, i) {
    total = total + item.values.length;
  });
  console.log("total finds: " + total);
  return total;
}
