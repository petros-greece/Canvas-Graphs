# Canvas-Graphs
A lightweight javascript library to create graphs with the canvas API.

1. Include the Graph.js file to your project.
2. Create an html canvas:
```html
<canvas id="myCanvas" width="800" height="500"></canvas>
```
3. Configure options<br/>
```javascript
var options = {
  "data": [data],        //an array of similar json objects
  "axisX": "age",        //the property of the objects for the x-axis
  "axisY": "name",       //the property of the objects for the y-axis
  "type": "standard",    //"standart", "column"
  "steps": 3,            //how many axis dividers will be escped
  "sortType": false,     //"asc", "desc", false
  "palette": {
    "background": "rgba(150,210,225,1)",  //canvas background color
    "axisDividers": "rgba(0,0,0,1)",      //axis dividers color
    "fontColor": "purple",                //font color
    "axisLines": "black",                 //axi lines color
    "graphStroke": "rgba(251,253,254,1)", //graph stroke color
    "graphFill": "rgba(211,238,245,1)",   //graph fill color
    "fontSize": 10,                       //font size
    "fontWeight": 100,                    //font weight (100-900)
    "fontFamily": "Times New Roman",      //"Arial", "Verdana", "serif", "sans-serif", "Times New Roman"
    "axisDividersWidth": 1,               //axis dividers width
    "axisWidth": 1,                       //axis width
    "graphWidth": 1,                      //graph width
    "axisLineCap": "round",               //"butt", "square", "round"
    "axisDividersLineCap": "round",       //"butt", "square", "round"
    "graphLineCap": "round",              //"butt", "square", "round"
    "columnFontColor": "black"            //works for options.type="column"
  }
};
var graph = new Graph('myCanvas', options);
graph.show();
```
