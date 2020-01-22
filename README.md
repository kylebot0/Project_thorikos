# Project_thorikos

![preview](https://github.com/kylebot0/Project_thorikos/blob/master/gh-images/Schermafbeelding%202020-01-22%20om%2019.47.57.png)
## Table of Contents 🗃

- [Live demo](#Live-demo)
- [Description](#Description)
- [Features](#Features)
  - [API request](#API-request)
  - [Timeline features](#Timeline-features)
  - [Upcoming features](#Upcoming-features)
  - [Known Bugs](#Known-Bugs)
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


## Features 🛠️

### Grid

### Heatmap

### Filtering

### Bar chart

### Mapbox implementation

- [x] Dynamically renders data
- [x] request via an api
- [x] Ability to size correctly
- [x] Plot latitude and longitude on a map
- [x] Use an SVG
- [x] Choose the medium
- [x] Update the SVG


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


