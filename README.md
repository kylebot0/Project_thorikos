<img src="https://github.com/kylebot0/Project_thorikos/blob/master/src/css/icons/Amphitheater.png" width="100" height="100" float="center">

# Project Thorikos

![preview](https://github.com/kylebot0/Project_thorikos/blob/master/gh-images/Schermafbeelding%202020-01-22%20om%2019.47.57.png)
## Table of Contents 🗃

- [Live demo](#Live-demo)
- [Introduction](#Introduction)
- [Different kinds of data](#Different-kinds-of-data)
- [Grid](#Grid)
- [Data](#Data)
- [Features](#Features)
  - [Mapbox](#Mapbox-implementation)
  - [Grid](#Grid)
  - [Filtering](#Filtering)
  - [Heatmap](#Heatmap)
  - [Bar charts](#Bar-chart)
- [Functionality](#Functionality)
- [Installation](#Installation)
  - [Before you clone](#Before-you-clone)
  - [Install the app](#Install-the-app)
  - [Usage](#Usage)
  
## Live demo

[You can find the demo here](https://kylebot0.github.io/Project_thorikos/src/index.html)

## Introduction 📝

Floris van der Eijnde's is a field archaeologist and works in the department of history at
the University of Utrecht. He also works at the Archaeological Fieldwork Project
Thorikos. In this project, the University of Utrecht and Ghent University with
more than ten European partners.
Thorikos is a former city in Greece. Later it became
part of the empire of Athens. Thorikos is located on a mountain, where many shards
and other debris are laying around, ready to be picked up. Between 2012 and 2015, the Thorikos Survey Project was
conducted by the University of Utrecht and Ghent University. They have fully
examined the south side of the mountain, picking up shards and other debris. They use a grid which is 50 x 50 meters. they divide it into a smaller grid which is 25 x 25. Then they let a student walk in that 25 x25 square dividing it yet again in another square that is 12,5 x 12,5 meters for 20 minutes (see picture 2), they need to pick up everything from shards, to debris. With this project, the museum archaeologists and archaeologists learn more
about how people lived in this area. They also find it interesting to
see how their settlements have shifted over time, chronology is also an
interesting factor.
![preview](https://github.com/kylebot0/Project_thorikos/blob/master/gh-images/Schermafbeelding%202020-01-22%20om%2016.17.34.png)

## Different kinds of data


The project has different types of data. This we can distinguish two 
issues. First the field, this is about picking up the pieces and other 
finds in the area. All this information was previously handwritten and 
then been scanned, but now it is completed via the iPad. This information and 
associated images are stored in a FileMaker file. Here you include the 
following information: when is sought, what time, who have picked, how many 
shards each person picked up, how long they have walked, who was the leader during?
There is also the detailled information about the finds. This is all the information by 
being linked to the museum on the material found: date, type of object, 
type of glaze, find details, photos of the piece. All these items are 
described in an Excel file. In our visualization we decided to handle both types of data (you 
can switch between two 'modes'), because they can both give some interesting insights.
The first mode 'field' is about the search when it 
is efficient and who are the best searchers. The second 'finds' gives more information 
about the pieces themselves and how people lived and how their settlements
possibly shifted over time. The information about the finds may result in
more research.

## Grid 

The archeologists are working with a grid, this grid has multiple numbering systems. For each 50 x 50 meter square they use a grid number, that grid number can also contain a context number. But a square can only have a context number if someone has examined that square (or smaller squares). The grid numbers on the x-axis go from C', B', A', A, B, C. etc. Then from the y-axis from top to bottom the numbers go from 53', 52', 51', 1, 2, 3. etc. 
The context numbers are random however and are based on what year each square has been searched through.
![preview](https://github.com/kylebot0/Project_thorikos/blob/master/gh-images/Schermafbeelding%202020-01-22%20om%2016.17.46.png)

## Data 
The data used throughout the application comes from a .csv file. I use the data untouched for checking if context numbers are the same as on the grid. Next to that i nest all my data into 6 different headers for what i wanna filter for. Next i store that in an array and use that array to use for filtering data. Ofcourse my data becomes empty if more filters are turned of, in case i wanna turn them back on i have to add more data. So i make an exact copy so that i can copy and paste data into the original array if needed. 
![preview](https://github.com/kylebot0/Project_thorikos/blob/master/gh-images/data-flow.png)


## Features 🛠️

### Mapbox implementation
Before the grid can get plotted, i'm using a background of a mapbox map. The style that i'm using is a sattelite of only the streets. It's zoomed in to the place of Thorikos and centered perfectly.

```javascript
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/satellite-streets-v11",
  center: [24.053, 37.7385],
  // bearing: 5,
  zoom: 15.5
});

```
### Grid
The grid is made using a .json feature file, with coördinates for each outer point and containing data for each square. The data that's inside is mesoindex number, row number, contextnumber, and name. The coördinates get plotted on a mapbox canvas, using a d3.geoMercator projection. Then a path get's drawn between the points making it a square. 
```json
 "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "name": "c/",
                "row": 53,
                "mesoindex": 1
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            24.049985023339868,
                            37.74100146276254
                        ],
                        [
                            24.050269079944552,
                            37.74099192299907
                        ],
                        [
                            24.050263481754197,
                            37.74076713791649
                        ],
                        [
                            24.04997942591854,
                            37.74077667593752
                        ],
                        [
                            24.049985023339868,
                            37.74100146276254
                        ]
                    ]
                ]
            }
        }
      ]
```

### Heatmap
To make the heatmap i have to use the raw data used throughout the application. First i make sure to nest it on context number. Then i use a matching system to check if the context number created in the grid matches one of the numbers used in the nested data. Then i attach all of the values stored in that nested array of context numbers to a square in the grid. Then i match it to the color scale i created. The domain is that big because i use a different gradient normally, but i just don't want it to fade from white to red, i wanted some different colors between them.
```javascript
onst color = d3
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
```

Next to that is the matching system i use. First i create a context number used in the grid. Then i match it to the key used in the data itself. If it matches i want to use that color scheme from before. The grid can also contain no context numbers, or no values. Then i want to fill it with white.
```javascript
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
```
This is the result
![preview](https://github.com/kylebot0/Project_thorikos/blob/master/gh-images/Schermafbeelding%202020-01-22%20om%2020.15.11.png)

### Filtering
The data used throughout the application comes from a .csv file. I use the data untouched for checking if context numbers are the same as on the grid. Next to that i nest all my data into 6 different headers for what i wanna filter for. Next i store that in an array and use that array to use for filtering data. Ofcourse my data becomes empty if more filters are turned of, in case i wanna turn them back on i have to add more data. So i make an exact copy so that i can copy and paste data into the original array if needed. But to filter it i want to address my data that i want to filter it. If the chosen category is the same as something in my data, i want to delete it.
```javascript
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
```
![preview](https://github.com/kylebot0/Project_thorikos/blob/master/gh-images/Schermafbeelding%202020-01-22%20om%2020.15.36.png)

### Bar chart
Next to the filters i make a couple of bar charts, so that you can easily see how much every filters contains.
Each bar is connected to the filter next to it, so if you click it fills itself with a lightgrey color. This way you can see if it's inactive or not.
![preview](https://github.com/kylebot0/Project_thorikos/blob/master/gh-images/Schermafbeelding%202020-01-22%20om%2020.15.57.png)

### Too long to read
- [x] Mapbox implementation
- [x] Grid
- [x] Heatmap
- [x] Filtering
- [x] Connected bar chart
- [x] Legend


### Known Bugs

- Performance issues when clicking a lot of filters and then moving the map

### Upcoming features

- [ ] Switch modes
- [ ] Switch grid sizes


## Installation 🔍

### Before you clone

- [x] Install a Code Editor
- [x] Start up your CLI

### Install the app
```
git clone https://github.com/kylebot0/Project_thorikos.git
```
Get into the right folder
```
cd Project_thoriko/src
```
Then you can start the application

### Gitignore
My .gitignore contains all of the files and maps you dont want in your application, use this if you're going to commit and push to your own repo.
```
# dependencies
/node_modules
/config
/scripts

# testing
/coverage

# production
/build

# misc
.DS_Store
.env
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

### Usage

Start the application
```
Open it up in your finder / explorer
```

Then it should fire up a localhost in your browser, if that's not the case use this in your address bar.
```
localhost:3000
```

## Credits

A lot of credits towards Damian, he made the final working grid 25x25. Check him out [here.](https://github.com/damian1997)


## License
Find the license [here](https://github.com/kylebot0/Project_thorikos/blob/master/LICENSE)


