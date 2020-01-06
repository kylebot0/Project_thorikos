const select = d3.select
const svg = select("svg");
const g = svg.append("g");
const width = screen.width;
const height = screen.height;

  makeSVG();

  async function makeSVG() {
    svg.attr("width", width).attr("height", height);
    makeMacrosquare();
    makeMesosquare();
  }

function makeMacrosquare() {
    let xVal = 0;
    let yVal = 0;

    function reset(){
        xVal = 0;
        yVal = yVal + 50;
    }
     
   function insert(){
    svg.insert("g")
      .append("rect")
      .attr("width", "50")
      .attr("height", "50")
      .attr("x", () => {
        xVal = xVal + 50;
        return xVal;
      })
      .attr("y", () => {
        // yVal = yVal + 25;
        return yVal;
      })
      .style("stroke", "black")
      .style("stroke-width", "2")
      .style('fill', 'white');
    }
    for(let i = 0; i< 21; i++){
        insert()
    }
      reset()
      for (let i = 0; i < 21; i++) {
          insert()
      }
      reset()
      for (let i = 0; i < 21; i++) {
          insert()
      }
      reset()
      for (let i = 0; i < 21; i++) {
          insert()
      }
      reset()
      for (let i = 0; i < 21; i++) {
          insert()
      }
      reset()
      for (let i = 0; i < 21; i++) {
          insert()
      }
      reset()
      for (let i = 0; i < 21; i++) {
          insert()
      }
      reset()
    console.log(xVal, yVal)
  }

function makeMesosquare() {
    let xVal = 25;
    let yVal = 0;

    function reset() {
        xVal = 25;
        yVal = yVal + 25;
    }
    let count = false;

    function insert(a, b) {
        svg.insert("g")
            .append("rect")
            .attr("width", "25")
            .attr("height", "25")
            .attr("x", () => {
                xVal = xVal + 25;
                return xVal;
            })
            .attr("y", () => {
                // yVal = yVal + 25;
                return yVal;
            })
            .attr('id', function(){
                if(count == true){
                    return b;
                } else {
                    return a;
                }
            })
            .style("stroke", "lightgrey")
            .style("stroke-width", "1")
            .style('fill', 'none');
    }
    for (let i = 0; i < 42; i++) {
        insert('1', '2')
        count = !count;
    }
    reset()
    for (let i = 0; i < 42; i++) {
        insert('3', '4')
        count = !count;
    }
    reset()
    for (let i = 0; i < 42; i++) {
        insert("1", "2");
        count = !count;
    }
    reset()
    for (let i = 0; i < 42; i++) {
        insert("3", "4");
        count = !count;
    }
    reset()
    for (let i = 0; i < 42; i++) {
        insert("1", "2");
        count = !count;
    }
    reset()
    for (let i = 0; i < 42; i++) {
        insert("3", "4");
        count = !count;
    }
    reset()
    for (let i = 0; i < 42; i++) {
        insert("1", "2");
        count = !count;
    }
    reset()
    for (let i = 0; i < 42; i++) {
        insert('3', '4');
        count = !count;
    }
    reset();
    for (let i = 0; i < 42; i++) {
        insert('1', '2');
        count = !count;
    }
    reset();
    for (let i = 0; i < 42; i++) {
        insert('3', '4');
        count = !count;
    }
    reset();
    for (let i = 0; i < 42; i++) {
        insert('1', '2');
        count = !count;
    }
    reset();
    for (let i = 0; i < 42; i++) {
        insert('3', '4');
        count = !count;
    }
    reset();
    for (let i = 0; i < 42; i++) {
        insert('1', '2');
        count = !count;
    }
    reset();
    for (let i = 0; i < 42; i++) {
        insert('3', '4');
        count = !count;
    }
    reset();
    console.log(xVal, yVal)
}

  