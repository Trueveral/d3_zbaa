d3.select("body").append("div").attr("class", "title").style("font-family", "system-ui")
    .style("font-weight", "bold")
    .text("Domestic Commercial Filght From Beijing Capital Intl(PEK).")

d3.select("body").append("div").attr("class", "subtitle").style("font-family", "system-ui")
    .style("color", "rgb(100,100,100)")
    .text("Excluding Beijing Nanyuan Intl(NAY). and Beijing Daxing Intl(PKX).");

d3.select("body").append("div").attr("class", "subtitle").style("font-family", "system-ui")
    .style("color", "rgb(100,100,100)").style("font-size", "10px")
    .text("Please take notice that due to the massive amount of data, the responding time after clicking 'Show all' for the first time may be observably longer. ");

d3.select("body").append("div").attr("class", "subtitle").style("font-family", "system-ui")
    .style("color", "rgb(100,100,100)").style("font-size", "10px")
    .text("Should the animation ever become stuttering, please refresh the page and try again.");

var width = 1000,
    height = 800;
var svg = d3.select(".fxmap")
    .append("svg").attr("height", height).attr("width", width)
    .style("background", "rgb(250,250,250)")
    .on("mouseover", function(d, i) {
        d3.select(this)
            .transition()
            .duration(100)
            .style("background", "white")
    })
    .on("mouseout", function(d, i) {
        d3.select(this)
            .transition()
            .duration(100)
            .style("background", "rgb(250,250,250)")
    });

gmap = svg.append("g")
    .attr("id", "map").attr("stroke", "#1098f7").attr("stroke-width", 1);
mline = svg.append("g")
    .attr("id", "moveto").attr("stroke", "#1098f7").attr("stroke-width", 1.5)
    .attr("fill", "#1098f7");

var projection = d3.geoEquirectangular()
    .center([465, 395])
    .scale(height)
    .translate([width / 2, height / 2]);

var path = d3.geoPath().projection(projection);

marker = svg.append("defs")
    .append("marker")
    .append("marker")
    .attr("id", "pointer")
    .attr("viewBox", "0 0 12 12")
    .attr("markerWidth", "12")
    .attr("markerHeight", "12")
    .attr("orient", "auto")
    .attr("markerUnits", "strokeWidth")
    .attr("refX", "6")
    .attr("refY", "6")

marker.append("circle")
    .attr("class", "markerCircle")
    .attr("cx", "6")
    .attr("cy", "6")
    .attr("r", "3")
    .attr("fill", "#1098f7")

marker.append("circle")
    .attr("id", "markerC")
    .attr("cx", "6")
    .attr("cy", "6")
    .attr("r", "5")
    .attr("fill-opacity", "0")
    .attr("stroke-width", "1")
    .attr("stroke", "#1098f7")


var beijing = projection([115.25, 39.26]);
mapdata = [];
d3.json('china.json', function(error, data) {
    if (error)
        console.log(error);
    mapdata = data.features;
    gmap.selectAll("path")
        .data(mapdata)
        .enter()
        .append("path")
        .attr("d", path);
    gmap.append("circle").attr("id", "beijing")
        .attr("cx", beijing[0])
        .attr("cy", beijing[1])
        .attr("r", "6")
        .attr("fill", "yellow")
    gmap.append("circle").attr("id", "beijingC")
        .attr("cx", beijing[0])
        .attr("cy", beijing[1])
        .attr("r", "10")
        .attr("stroke-width", "2")
        .attr("fill-opacity", "0");
});

var citylist = new Object();


var moveto = function(city, data) {

    var scale = d3.scaleLinear();
    scale.domain([0, 1000, 2000])
        .range([0, 0.7, 0]);
    var start = Date.now();
    d3.timer(function() {
        var s1 = scale((Date.now() - start) % 2000);
        gmap.select("circle#beijingC")
            .attr("stroke-opacity", s1);
        marker.select("circle#markerC")
            .attr("stroke-opacity", s1);
    });

    var pf = {
        x: projection([115.25, 39.26])[0],
        y: projection([115.25, 39.26])[1]
    };
    var pt = {
        x: projection(data)[0],
        y: projection(data)[1]
    };
    var distance = Math.sqrt((pt.x - pf.x) ** 2 + (pt.y - pf.y) ** 2);
    var totalDis = [];
    var midPointX = (pt.x - pf.x) / 2;
    var midPointY = (pt.y - pf.y) / 2;
    var dist = distance * 8.36;

    mline.append("line")
        .attr("x1", pf.x)
        .attr("y1", pf.y)
        .attr("x2", pt.x)
        .attr("y2", pt.y)
        .attr("id", "line")
        .attr("stroke-opacity", "1")
        .attr("marker-end", "url(#pointer)")
        .style("stroke-dasharray", " " + distance + ", " + distance + " ")
        .transition()
        .duration(distance * 30)
        .attr("fill", "ffb4a2")
        .attr("stroke", "ffb4a2")
        .styleTween("stroke-dashoffset", function() {
            return d3.interpolateNumber(distance, 0)
        });
    mline.append("circle")
        .attr("cx", pf.x)
        .attr("cy", pf.y)
        .attr("r", 3)
        .attr("fill-opacity", "1")
        .transition()
        .duration(distance * 30)
        .attr("fill", "ffb4a2")
        .attr("transform", "translate(" + (pt.x - pf.x) + "," + (pt.y - pf.y) + ")");

    d3.select("svg")
        .append("text")
        .attr("x", pt.x + 10)
        .attr("y", pt.y)
        .text(cityname[l])
        .attr("fill", "#1098f7")
        .attr("fill-opacity", "0.4")
        .attr("font-size", 10)
        .attr("font-family", "system-ui")

    .on("mouseover", function(d, i) {
        d3.select(this)
            .transition()
            .duration(500)
            .attr("fill-opacity", "0.76")
            .attr("font-size", 14)
    })

    .on("mouseout", function(d, i) {
        d3.select(this)
            .transition()
            .duration(3000)
            .attr("fill-opacity", "0.4")
            .attr("font-size", 10)
    });

    d3.select("svg")
        .append("text")
        .attr("x", pt.x)
        .attr("y", pt.y + 13)
        .text(dist.toFixed(1) + "km")
        .attr("fill", "#1098f7")
        .attr("fill-opacity", "0.3")
        .style("font-weight", "bold")
        .attr("font-size", 10)
        .attr("font-family", "system-ui")
        .on("mouseover", function(d, i) {
            d3.select(this)
                .transition()
                .duration(500)
                .attr("fill-opacity", "0.76")
                .attr("font-size", 14)
        })
        .on("mouseout", function(d, i) {
            d3.select(this)
                .transition()
                .duration(1000)
                .attr("fill-opacity", "0.3")
                .attr("font-size", 10)
        });


};

var restorecanvas = function() {
    d3.select("#pointer")
        .transition()
        .duration(300)
        .attr("fill-opacity", "1");
    d3.select("#moveto")
        .transition()
        .duration(300)
        .attr("fill-opacity", "1")
        .attr("stroke-opacity", "1");
    d3.selectAll("#moveto circle")
        .attr("fill-opacity", "1");
    d3.selectAll("#moveto line")
        .attr("stroke-opacity", "1");
    d3.selectAll("svg text")
        .transition()
        .duration(300)
        .style("fill-opacity", "0");
};

var cleancanvas = function() {
    d3.select("#pointer")
        .transition()
        .duration(300)
        .attr("fill-opacity", "0");
    d3.select("#moveto")
        .transition()
        .duration(300)
        .attr("fill-opacity", "0.05")
        .attr("stroke-opacity", "0.05");
    d3.selectAll("svg text")
        .transition()
        .duration(300)
        .style("fill-opacity", "0");
    d3.selectAll("#moveto circle")
        .attr("fill-opacity", "0");
    d3.selectAll("#moveto line")
        .attr("stroke-opacity", "0.0");


};

var showDistCity = function(city, data) {
    var scale = d3.scaleLinear();
    scale.domain([0, 1000, 2000])
        .range([0, 0.7, 0]);
    var start = Date.now();
    d3.timer(function() {
        var s1 = scale((Date.now() - start) % 2000);
        gmap.select("circle#beijingC")
            .attr("stroke-opacity", s1);
        marker.select("circle#markerC")
            .attr("stroke-opacity", s1);
    });

    var pf = {
        x: projection([115.25, 39.26])[0],
        y: projection([115.25, 39.26])[1]
    };
    var pt = {
        x: projection(data)[0],
        y: projection(data)[1]
    };
    var distance = Math.sqrt((pt.x - pf.x) ** 2 + (pt.y - pf.y) ** 2);
    var dist = distance * 8.36;

    d3.select("svg")
        .append("text")
        .attr("x", pt.x + 10)
        .attr("y", pt.y)
        .text(cityname[l])
        .style("font-weight", "normal")
        .attr("fill", "#1098f7")
        .attr("fill-opacity", "0.4")
        .attr("font-size", 10)
        .attr("font-family", "system-ui")


    .on("mouseover", function(d, i) {
        d3.select(this)
            .transition()
            .duration(500)
            .attr("fill-opacity", "0.76")
            .attr("font-size", 14)
    })

    .on("mouseout", function(d, i) {
        d3.select(this)
            .transition()
            .duration(3000)
            .attr("fill-opacity", "0.4")
            .attr("font-size", 10)
    });


    d3.select("svg")
        .append("text")
        .attr("x", pt.x)
        .attr("y", pt.y + 13)
        .text(dist.toFixed(1) + "km")
        .attr("fill", "#1098f7")
        .style("font-weight", "normal")
        .attr("fill-opacity", "0.4")
        .attr("font-size", 10)
        .attr("font-family", "system-ui")
        .on("mouseover", function(d, i) {
            d3.select(this)
                .transition()
                .duration(500)
                .attr("fill-opacity", "0.76")
                .attr("font-size", 14)
        })
        .on("mouseout", function(d, i) {
            d3.select(this)
                .transition()
                .duration(1000)
                .attr("fill-opacity", "0.4")
                .attr("font-size", 10)
        });

};


var singlemoveto = function(city, data) {
    var scale = d3.scaleLinear();
    scale.domain([0, 1000, 2000])
        .range([0, 0.10, 0]);
    var start = Date.now();
    d3.timer(function() {
        var s1 = scale((Date.now() - start) % 2000);
        // console.log(s1);
        gmap.select("circle#beijingC")
            .attr("stroke-opacity", s1);
        marker.select("circle#markerC")
            .attr("stroke-opacity", s1);
    });


    var pf = {
        x: projection([115.25, 39.26])[0],
        y: projection([115.25, 39.26])[1]
    };
    var pt = {
        x: projection(data)[0],
        y: projection(data)[1]
    };
    var distance = Math.sqrt((pt.x - pf.x) ** 2 + (pt.y - pf.y) ** 2);
    var totalDis = [];
    var midPointX = (pt.x - pf.x) / 2;
    var midPointY = (pt.y - pf.y) / 2;
    var dist = distance * 8.36;

    mline.append("line")
        .attr("x1", pf.x)
        .attr("y1", pf.y)
        .attr("x2", pt.x)
        .attr("y2", pt.y)
        .attr("id", "line")
        .attr("stroke-opacity", "1")
        .attr("marker-end", "url(#pointer)")
        .style("stroke-dasharray", " " + distance + ", " + distance + " ")
        .transition()
        .duration(distance * 30)
        .attr("fill", "ffb4a2")
        .attr("stroke", "ffb4a2")
        .styleTween("stroke-dashoffset", function() {
            return d3.interpolateNumber(distance, 0)
        });
    mline.append("circle")
        .attr("cx", pf.x)
        .attr("cy", pf.y)
        .attr("r", 3)
        .attr("fill-opacity", "1")
        .transition()
        .duration(distance * 30)
        .attr("fill", "ffb4a2")
        .attr("transform", "translate(" + (pt.x - pf.x) + "," + (pt.y - pf.y) + ")");

    d3.select("svg")
        .append("text")
        .attr("x", pt.x + 10)
        .attr("y", pt.y)
        .text(cityname[l])
        .attr("fill", "#1098f7")
        .attr("fill-opacity", "0.4")
        .style("font-weight", "bold")
        .attr("font-size", 10)
        .attr("font-family", "system-ui")

    .on("mouseover", function(d, i) {
        d3.select(this)
            .transition()
            .duration(500)
            .attr("fill-opacity", "0.76")
            .attr("font-size", 14)
    })

    .on("mouseout", function(d, i) {
        d3.select(this)
            .transition()
            .duration(3000)
            .attr("fill-opacity", "0.4")
            .attr("font-size", 10)
    });

    d3.select("svg")
        .append("text")
        .attr("x", pt.x)
        .attr("y", pt.y + 13)
        .text(dist.toFixed(1) + "km")
        .attr("fill", "#1098f7")
        .attr("fill-opacity", "0.3")
        .style("font-weight", "bold")
        .attr("font-size", 10)
        .attr("font-family", "system-ui")
        .on("mouseover", function(d, i) {
            d3.select(this)
                .transition()
                .duration(500)
                .attr("fill-opacity", "0.76")
                .attr("font-size", 14)
        })
        .on("mouseout", function(d, i) {
            d3.select(this)
                .transition()
                .duration(1000)
                .attr("fill-opacity", "0.3")
                .attr("font-size", 10)
        });


}

var cityname = [];
var clicked = false;

div = d3.select("body").append("div").attr("class", "contentWrapper")
    .style("max-width", "1000px")
    .style("min-width", "1000px");


SA = d3.select(".contentWrapper")
    .append("ul").attr("id", "InstrList").style("list-style", "none").append("li").style("float", "left").attr("id", "Show all")
    .append("text")
    .attr("x", width * 0.87)
    .attr("y", height * 0.81)
    .style("font-weight", "bold")
    .style("font-size", "15px")
    .style("display", "inherit")
    .text("Show all");

SA.on("mouseover", function() {
    cityname.length = 0;
    var total = 0;
    for (var key in cityordinate) {
        cityname[total++] = key;
    };
    return cityname;
})

SA.on("click", function() {
    if (clicked == true) {
        restorecanvas();
        for (l = 0; l < cityname.length; l++) {
            showDistCity(cityname[l], cityordinate[cityname[l]]);
            console.log(cityname[l]);
        }
    } else {
        restorecanvas();
        for (l = 0; l < cityname.length; l++) {
            moveto(cityname[l], cityordinate[cityname[l]]);
            console.log(cityname[l]);
        }
    };
    clicked = true;
    console.log(clicked);
    return clicked;
})
console.log(clicked);


FZA = d3.select("#InstrList")
    .append("li").attr("id", "FZA")
    .append("text")
    .attr("x", width * 0.87)
    .attr("y", height * 0.81)
    .style("font-size", "15px")
    .style("display", "inherit")
    .text("Fu Zhou Airlines");

FZA.on("mouseover", function() {
    cityname.length = 0;
    var total = 0;
    for (var key in FZAord) {
        cityname[total++] = key;
    };
    console.log(cityname);
    return cityname;
})

FZA.on("click", function() {
    cleancanvas();
    for (l = 0; l < cityname.length; l++) {
        singlemoveto(cityname[l], cityordinate[cityname[l]]);
        console.log(cityname[l]);
    }
})


GCA = d3.select("#InstrList")
    .append("li").attr("id", "GCA")
    .append("text")
    .attr("x", width * 0.87)
    .attr("y", height * 0.81)
    .style("font-size", "15px")
    .style("display", "inline-block")
    .style("float", "left")
    .text("Grand China Air");


GCA.on("mouseover", function() {
    cityname.length = 0;
    var total = 0;
    for (var key in GCAord) {
        cityname[total++] = key;
    };
    console.log(cityname);
    return cityname;
})

GCA.on("click", function() {
    cleancanvas();
    for (l = 0; l < cityname.length; l++) {
        singlemoveto(cityname[l], cityordinate[cityname[l]]);
        console.log(cityname[l]);
    }
})

CAIR = d3.select("#InstrList")
    .append("li").attr("id", "CAIR")
    .append("text")
    .style("font-size", "15px")
    .style("display", "inherit")
    .text("Capital Airlines");


CAIR.on("mouseover", function() {
    cityname.length = 0;
    var total = 0;
    for (var key in CAPord) {
        cityname[total++] = key;
    };
    console.log(cityname);
    return cityname;
})

CAIR.on("click", function() {
    cleancanvas();
    for (l = 0; l < cityname.length; l++) {
        singlemoveto(cityname[l], cityordinate[cityname[l]]);
        console.log(cityname[l]);
    }
})

HNA = d3.select("#InstrList")
    .append("li").attr("id", "HNA")
    .append("text")
    .attr("x", width * 0.87)
    .attr("y", height * 0.81)
    .style("font-size", "15px")
    .style("display", "inherit")
    .text("Hainan Airlines");


HNA.on("mouseover", function() {
    cityname.length = 0;
    var total = 0;
    for (var key in HNAord) {
        cityname[total++] = key;
    };
    console.log(cityname);
    return cityname;
})

HNA.on("click", function() {
    cleancanvas();
    for (l = 0; l < cityname.length; l++) {
        singlemoveto(cityname[l], cityordinate[cityname[l]]);
        console.log(cityname[l]);
    }
})


TJA = d3.select("#InstrList")
    .append("li").attr("id", "TJA")
    .append("text")
    .attr("x", width * 0.87)
    .attr("y", height * 0.81)
    .style("font-size", "15px")
    .style("display", "inherit")
    .text("Tianjin Airlines");


TJA.on("mouseover", function() {
    cityname.length = 0;
    var total = 0;
    for (var key in TJAord) {
        cityname[total++] = key;
    };
    console.log(cityname);
    return cityname;
})

TJA.on("click", function() {
    cleancanvas();
    for (l = 0; l < cityname.length; l++) {
        singlemoveto(cityname[l], cityordinate[cityname[l]]);
        console.log(cityname[l]);
    }
})

LKA = d3.select("#InstrList")
    .append("li").attr("id", "LKA")
    .append("text")
    .attr("x", width * 0.87)
    .attr("y", height * 0.81)
    .style("font-size", "15px")
    .style("display", "inherit")
    .text("Lucky Air");


LKA.on("mouseover", function() {
    cityname.length = 0;
    var total = 0;
    for (var key in XPAord) {
        cityname[total++] = key;
    };
    console.log(cityname);
    return cityname;
})

LKA.on("click", function() {
    cleancanvas();
    for (l = 0; l < cityname.length; l++) {
        singlemoveto(cityname[l], cityordinate[cityname[l]]);
        console.log(cityname[l]);
    }
})

HBA = d3.select("#InstrList")
    .append("li").attr("id", "HBA")
    .append("text")
    .attr("x", width * 0.87)
    .attr("y", height * 0.81)
    .style("font-size", "15px")
    .style("display", "inherit")
    .text("Hebei Airlines");


HBA.on("mouseover", function() {
    cityname.length = 0;
    var total = 0;
    for (var key in HBAord) {
        cityname[total++] = key;
    };
    console.log(cityname);
    return cityname;
})

HBA.on("click", function() {
    cleancanvas();
    for (l = 0; l < cityname.length; l++) {
        singlemoveto(cityname[l], cityordinate[cityname[l]]);
        console.log(cityname[l]);
    }
})

SHA = d3.select("#InstrList")
    .append("li").attr("id", "SHA")
    .append("text")
    .attr("x", width * 0.87)
    .attr("y", height * 0.81)
    .style("font-size", "15px")
    .style("display", "inherit")
    .text("Shanghai Airlines");


SHA.on("mouseover", function() {
    cityname.length = 0;
    var total = 0;
    for (var key in SHAord) {
        cityname[total++] = key;
    };
    console.log(cityname);
    return cityname;
})

SHA.on("click", function() {
    cleancanvas();
    for (l = 0; l < cityname.length; l++) {
        singlemoveto(cityname[l], cityordinate[cityname[l]]);
        console.log(cityname[l]);
    }
})

CSN = d3.select("#InstrList")
    .append("li").attr("id", "CSN")
    .append("text")
    .attr("x", width * 0.87)
    .attr("y", height * 0.81)
    .style("font-size", "15px")
    .style("display", "inherit")
    .style("text-indent", "4.25rem")
    .text("China Southern");


CSN.on("mouseover", function() {
    cityname.length = 0;
    var total = 0;
    for (var key in CSNord) {
        cityname[total++] = key;
    };
    console.log(cityname);
    return cityname;
})

CSN.on("click", function() {
    cleancanvas();
    for (l = 0; l < cityname.length; l++) {
        singlemoveto(cityname[l], cityordinate[cityname[l]]);
        console.log(cityname[l]);
    }
})

CQA = d3.select("#InstrList")
    .append("li").attr("id", "CQA")
    .append("text")
    .attr("x", width * 0.87)
    .attr("y", height * 0.81)
    .style("font-size", "15px")
    .style("display", "inherit")
    .text("Chongqing Airlines");


CQA.on("mouseover", function() {
    cityname.length = 0;
    var total = 0;
    for (var key in CQAord) {
        cityname[total++] = key;
    };
    console.log(cityname);
    return cityname;
})

CQA.on("click", function() {
    cleancanvas();
    for (l = 0; l < cityname.length; l++) {
        singlemoveto(cityname[l], cityordinate[cityname[l]]);
        console.log(cityname[l]);
    }
})

MU = d3.select("#InstrList")
    .append("li").attr("id", "MU")
    .append("text")
    .attr("x", width * 0.87)
    .attr("y", height * 0.81)
    .style("font-size", "15px")
    .style("display", "inherit")
    .text("China Eastern");


MU.on("mouseover", function() {
    cityname.length = 0;
    var total = 0;
    for (var key in MUord) {
        cityname[total++] = key;
    };
    console.log(cityname);
    return cityname;
})

MU.on("click", function() {
    cleancanvas();
    for (l = 0; l < cityname.length; l++) {
        singlemoveto(cityname[l], cityordinate[cityname[l]]);
        console.log(cityname[l]);
    }
})

XMA = d3.select("#InstrList")
    .append("li").attr("id", "XMA")
    .append("text")
    .attr("x", width * 0.87)
    .attr("y", height * 0.81)
    .style("font-size", "15px")
    .style("display", "inherit")
    .text("Xiamen Airlines");


XMA.on("mouseover", function() {
    cityname.length = 0;
    var total = 0;
    for (var key in XMAord) {
        cityname[total++] = key;
    };
    console.log(cityname);
    return cityname;
})

XMA.on("click", function() {
    cleancanvas();
    for (l = 0; l < cityname.length; l++) {
        singlemoveto(cityname[l], cityordinate[cityname[l]]);
        console.log(cityname[l]);
    }
})

VET = d3.select("#InstrList")
    .append("li").attr("id", "VET")
    .append("text")
    .attr("x", width * 0.87)
    .attr("y", height * 0.81)
    .style("font-size", "15px")
    .style("display", "inherit")
    .text("Vietnam Airlines");


VET.on("mouseover", function() {
    cityname.length = 0;
    var total = 0;
    for (var key in VETord) {
        cityname[total++] = key;
    };
    console.log(cityname);
    return cityname;
})

VET.on("click", function() {
    cleancanvas();
    for (l = 0; l < cityname.length; l++) {
        singlemoveto(cityname[l], cityordinate[cityname[l]]);
        console.log(cityname[l]);
    }
})

DHA = d3.select("#InstrList")
    .append("li").attr("id", "DHA")
    .append("text")
    .attr("x", width * 0.87)
    .attr("y", height * 0.81)
    .style("font-size", "15px")
    .style("display", "inherit")
    .text("Donghai Airlines");


DHA.on("mouseover", function() {
    cityname.length = 0;
    var total = 0;
    for (var key in DHAord) {
        cityname[total++] = key;
    };
    console.log(cityname);
    return cityname;
})

DHA.on("click", function() {
    cleancanvas();
    for (l = 0; l < cityname.length; l++) {
        singlemoveto(cityname[l], cityordinate[cityname[l]]);
        console.log(cityname[l]);
    }
})

KMA = d3.select("#InstrList")
    .append("li").attr("id", "KMA")
    .append("text")
    .attr("x", width * 0.87)
    .attr("y", height * 0.81)
    .style("font-size", "15px")
    .style("display", "inherit")
    .text("Kunming Airlines");


KMA.on("mouseover", function() {
    cityname.length = 0;
    var total = 0;
    for (var key in KMAord) {
        cityname[total++] = key;
    };
    console.log(cityname);
    return cityname;
})

KMA.on("click", function() {
    cleancanvas();
    for (l = 0; l < cityname.length; l++) {
        singlemoveto(cityname[l], cityordinate[cityname[l]]);
        console.log(cityname[l]);
    }
})

LOA = d3.select("#InstrList")
    .append("li").attr("id", "LOA")
    .append("text")
    .attr("x", width * 0.87)
    .attr("y", height * 0.81)
    .style("font-size", "15px")
    .style("display", "inherit")
    .text("Loong Air");


LOA.on("mouseover", function() {
    cityname.length = 0;
    var total = 0;
    for (var key in ZJAord) {
        cityname[total++] = key;
    };
    console.log(cityname);
    return cityname;
})

LOA.on("click", function() {
    cleancanvas();
    for (l = 0; l < cityname.length; l++) {
        singlemoveto(cityname[l], cityordinate[cityname[l]]);
        console.log(cityname[l]);
    }
})

QDA = d3.select("#InstrList")
    .append("li").attr("id", "QDA")
    .append("text")
    .attr("x", width * 0.87)
    .attr("y", height * 0.81)
    .style("font-size", "15px")
    .style("text-indent", "4.25rem")
    .style("display", "inherit")
    .text("Qingdao Airlines");


QDA.on("mouseover", function() {
    cityname.length = 0;
    var total = 0;
    for (var key in QDAord) {
        cityname[total++] = key;
    };
    console.log(cityname);
    return cityname;
})

QDA.on("click", function() {
    cleancanvas();
    for (l = 0; l < cityname.length; l++) {
        singlemoveto(cityname[l], cityordinate[cityname[l]]);
        console.log(cityname[l]);
    }
})
TBA = d3.select("#InstrList")
    .append("li").attr("id", "TBA")
    .append("text")
    .attr("x", width * 0.87)
    .attr("y", height * 0.81)
    .style("font-size", "15px")
    .style("display", "inherit")
    .text("Tibet Airlines");


TBA.on("mouseover", function() {
    cityname.length = 0;
    var total = 0;
    for (var key in TBAord) {
        cityname[total++] = key;
    };
    console.log(cityname);
    return cityname;
})

TBA.on("click", function() {
    cleancanvas();
    for (l = 0; l < cityname.length; l++) {
        singlemoveto(cityname[l], cityordinate[cityname[l]]);
        console.log(cityname[l]);
    }
})

CAA = d3.select("#InstrList")
    .append("li").attr("id", "CAA")
    .append("text")
    .attr("x", width * 0.87)
    .attr("y", height * 0.81)
    .style("font-size", "15px")
    .style("display", "inherit")
    .text("Air China");


CAA.on("mouseover", function() {
    cityname.length = 0;
    var total = 0;
    for (var key in CAord) {
        cityname[total++] = key;
    };
    console.log(cityname);
    return cityname;
})

CAA.on("click", function() {
    cleancanvas();
    for (l = 0; l < cityname.length; l++) {
        singlemoveto(cityname[l], cityordinate[cityname[l]]);
        console.log(cityname[l]);
    }
})

SDA = d3.select("#InstrList")
    .append("li").attr("id", "SDA")
    .append("text")
    .attr("x", width * 0.87)
    .attr("y", height * 0.81)
    .style("font-size", "15px")
    .style("display", "inherit")
    .text("Shandong Airlines");


SDA.on("mouseover", function() {
    cityname.length = 0;
    var total = 0;
    for (var key in SDAord) {
        cityname[total++] = key;
    };
    console.log(cityname);
    return cityname;
})

SDA.on("click", function() {
    cleancanvas();
    for (l = 0; l < cityname.length; l++) {
        singlemoveto(cityname[l], cityordinate[cityname[l]]);
        console.log(cityname[l]);
    }
})

SCA = d3.select("#InstrList")
    .append("li").attr("id", "SCA")
    .append("text")
    .attr("x", width * 0.87)
    .attr("y", height * 0.81)
    .style("font-size", "15px")
    .style("display", "inherit")
    .text("Sichuan Airlines");


SCA.on("mouseover", function() {
    cityname.length = 0;
    var total = 0;
    for (var key in SCAord) {
        cityname[total++] = key;
    };
    console.log(cityname);
    return cityname;
})

SCA.on("click", function() {
    cleancanvas();
    for (l = 0; l < cityname.length; l++) {
        singlemoveto(cityname[l], cityordinate[cityname[l]]);
        console.log(cityname[l]);
    }
})

SZA = d3.select("#InstrList")
    .append("li").attr("id", "SZA")
    .append("text")
    .attr("x", width * 0.87)
    .attr("y", height * 0.81)
    .style("font-size", "15px")
    .style("display", "inherit")
    .text("Shenzhen Airlines");


SZA.on("mouseover", function() {
    cityname.length = 0;
    var total = 0;
    for (var key in SZAord) {
        cityname[total++] = key;
    };
    console.log(cityname);
    return cityname;
})

SZA.on("click", function() {
    cleancanvas();
    for (l = 0; l < cityname.length; l++) {
        singlemoveto(cityname[l], cityordinate[cityname[l]]);
        console.log(cityname[l]);
    }
})

JYA = d3.select("#InstrList")
    .append("li").attr("id", "JYA")
    .append("text")
    .attr("x", width * 0.87)
    .attr("y", height * 0.81)
    .style("font-size", "15px")
    .style("display", "inherit")
    .text("Juneyao Airlines");


JYA.on("mouseover", function() {
    cityname.length = 0;
    var total = 0;
    for (var key in JYAord) {
        cityname[total++] = key;
    };
    console.log(cityname);
    return cityname;
})

JYA.on("click", function() {
    cleancanvas();
    for (l = 0; l < cityname.length; l++) {
        singlemoveto(cityname[l], cityordinate[cityname[l]]);
        console.log(cityname[l]);
    }
})

DHA = d3.select("#InstrList")
    .append("li").attr("id", "DHA")
    .append("text")
    .attr("x", width * 0.87)
    .attr("y", height * 0.81)
    .style("font-size", "15px")
    .style("display", "inherit")
    .text("Donghai Airlines");


DHA.on("mouseover", function() {
    cityname.length = 0;
    var total = 0;
    for (var key in DHAord) {
        cityname[total++] = key;
    };
    console.log(cityname);
    return cityname;
})

DHA.on("click", function() {
    cleancanvas();
    for (l = 0; l < cityname.length; l++) {
        singlemoveto(cityname[l], cityordinate[cityname[l]]);
        console.log(cityname[l]);
    }
})

HKA = d3.select("#InstrList")
    .append("li").attr("id", "HKA")
    .append("text")
    .attr("x", width * 0.87)
    .attr("y", height * 0.81)
    .style("font-size", "15px")
    .style("text-indent", "4.25rem")
    .style("display", "inherit")
    .text("Hongkong Airlines");


HKA.on("mouseover", function() {
    cityname.length = 0;
    var total = 0;
    for (var key in HKAord) {
        cityname[total++] = key;
    };
    console.log(cityname);
    return cityname;
})

HKA.on("click", function() {
    cleancanvas();
    for (l = 0; l < cityname.length; l++) {
        singlemoveto(cityname[l], cityordinate[cityname[l]]);
        console.log(cityname[l]);
    }
})

CDR = d3.select("#InstrList")
    .append("li").attr("id", "CDR")
    .append("text")
    .attr("x", width * 0.87)
    .attr("y", height * 0.81)
    .style("font-size", "15px")
    .style("display", "inherit")
    .text("Cathay Dragon");


CDR.on("mouseover", function() {
    cityname.length = 0;
    var total = 0;
    for (var key in CDAord) {
        cityname[total++] = key;
    };
    console.log(cityname);
    return cityname;
})

CDR.on("click", function() {
    cleancanvas();
    for (l = 0; l < cityname.length; l++) {
        singlemoveto(cityname[l], cityordinate[cityname[l]]);
        console.log(cityname[l]);
    }
})

CPA = d3.select("#InstrList")
    .append("li").attr("id", "CPA")
    .append("text")
    .attr("x", width * 0.87)
    .attr("y", height * 0.81)
    .style("font-size", "15px")
    .style("display", "inherit")
    .text("Cathay Pacific");


CPA.on("mouseover", function() {
    cityname.length = 0;
    var total = 0;
    for (var key in CPAord) {
        cityname[total++] = key;
    };
    console.log(cityname);
    return cityname;
})

CPA.on("click", function() {
    cleancanvas();
    for (l = 0; l < cityname.length; l++) {
        singlemoveto(cityname[l], cityordinate[cityname[l]]);
        console.log(cityname[l]);
    }
})

MCA = d3.select("#InstrList")
    .append("li").attr("id", "MCA")
    .append("text")
    .attr("x", width * 0.87)
    .attr("y", height * 0.81)
    .style("font-size", "15px")
    .style("display", "inherit")
    .text("Air Macau");


MCA.on("mouseover", function() {
    cityname.length = 0;
    var total = 0;
    for (var key in MCAord) {
        cityname[total++] = key;
    };
    console.log(cityname);
    return cityname;
})

MCA.on("click", function() {
    cleancanvas();
    for (l = 0; l < cityname.length; l++) {
        singlemoveto(cityname[l], cityordinate[cityname[l]]);
        console.log(cityname[l]);
    }
})

CAR = d3.select("#InstrList")
    .append("li").attr("id", "CAR")
    .append("text")
    .attr("x", width * 0.87)
    .attr("y", height * 0.81)
    .style("font-size", "15px")
    .style("display", "inherit")
    .text("China Airlines");


CAR.on("mouseover", function() {
    cityname.length = 0;
    var total = 0;
    for (var key in CARord) {
        cityname[total++] = key;
    };
    console.log(cityname);
    return cityname;
})

CAR.on("click", function() {
    cleancanvas();
    for (l = 0; l < cityname.length; l++) {
        singlemoveto(cityname[l], cityordinate[cityname[l]]);
        console.log(cityname[l]);
    }
})

EVA = d3.select("#InstrList")
    .append("li").attr("id", "EVA")
    .append("text")
    .attr("x", width * 0.87)
    .attr("y", height * 0.81)
    .style("font-size", "15px")
    .style("display", "inherit")
    .text("EVA Air");


EVA.on("mouseover", function() {
    cityname.length = 0;
    var total = 0;
    for (var key in EVAord) {
        cityname[total++] = key;
    };
    console.log(cityname);
    return cityname;
})

EVA.on("click", function() {
    cleancanvas();
    for (l = 0; l < cityname.length; l++) {
        singlemoveto(cityname[l], cityordinate[cityname[l]]);
        console.log(cityname[l]);
    }
})

var cityordinate = {

    //FUJIAN
    'Xiamen': [118.0964355, 24.48540661],


    //GRANDCHINA
    'Dalian': [121.6186220000, 38.9145900000],
    'Guilin': [110.2991210000, 25.2742150000],
    'Harbin': [126.5353190000, 45.8031310000],
    'Nanchang': [115.8579630000, 28.6830160000],
    'Nanning': [108.3663700000, 22.8177460000],
    'Sanya': [109.5082680000, 18.2478720000],

    //CAPITALAIR		
    'Erlianhaut': [111.9779430000, 43.6531700000],
    'Lijiang': [100.2330260000, 26.8721080000],
    'Baotou': [109.8404050000, 40.6581680000],
    'Hailaer': [119.7362790000, 49.2121890000],
    'Jixi': [130.9693330000, 45.2950750000],
    'Huhhot': [111.755508561709, 40.8484229971135],
    'Xiamen': [118.0964355, 24.48540661],
    'Huhhot': [111.755508561709, 40.8484229971135],
    'Haikou': [110.1982860000, 20.0444120000],
    'Sanya': [109.5082680000, 18.2478720000],
    'Qingdao': [120.39629, 36.30744],
    'Nanchang': [115.8579630000, 28.6830160000],
    'Yichang': [111.2925492, 30.69744648],
    'Macau': [113.5556075793, 22.2048369936],

    //HNA
    'Baotou': [109.8404050000, 40.6581680000],
    'Chifeng': [118.8868560000, 42.2578170000],
    'Changzhi': [113.1135560000, 36.1911120000],
    'Chongqing': [116.413384, 39.910925],
    'Chengdu': [104.0647600000, 30.5702000000],
    'Dongying': [118.6647100000, 37.4345640000],
    'Fuzhou': [119.2964700000, 26.0742100000],
    'Guangzhou': [113.2643600000, 23.1290800000],
    'Guiyang': [106.6365768, 26.65332482],
    'Haikou': [110.1982860000, 20.0444120000],
    'Hailaer': [119.7362790000, 49.2121890000],
    'Hangzhou': [120.2099470000, 30.2458530000],
    'Hefei': [117.2273080000, 31.8205700000],
    'Huhhot': [111.755508561709, 40.8484229971135],
    'Jiamusi': [130.327359092573, 46.8056899908578],
    'Kunming': [102.852448365005, 24.873998150044],
    'Lanzhou': [103.840521196336, 36.0672346935456],
    'Manzhouli': [117.38543585768, 49.6040988548661],
    'Mudanjiang': [129.639539778347, 44.5562457089863],
    'Nanning': [108.373450825819, 22.8226066011872],
    'Ningbo': [121.628572494341, 29.8660330458661],
    'Qiqihaer': [123.924570868415, 47.3599771860153],
    'Shanghai': [121.480538860177, 31.235929042252],
    'Shenzhen': [114.064551836588, 22.5484566379842],
    'Taiyuan': [112.556391491672, 37.8769890288478],
    'Urumqi': [87.6244399353605, 43.8307632042905],
    'Wenzhou': [120.706476890356, 28.0010854044722],
    'Wuhai': [106.800391049997, 39.6620063648907],
    'Xian': [108.946465550633, 34.347268816624],
    'Xiamen': [118.096435499767, 24.4854066051763],
    'Yichang': [111.292549210354, 30.6974464844924],
    'Yinchuan': [106.2384935874, 38.4924600555096],
    'Tongren': [109.196438898177, 27.7377864564052],
    'Weifang': [119.168377911428, 36.7126515512675],
    'Hongkong': [114.1720064282, 22.2810079531],
    'Macau': [113.5556075793, 22.2048369936],

    //TJA
    'Chifeng': [118.89552039752, 42.2616861034116],
    'Wulanhot': [122.0997644784, 46.0785493221],
    'Huhhot': [122.099622351983, 46.0786543435819],
    'Weifang': [119.168377911428, 36.7126515512675],
    'Yanan': [109.496581916127, 36.5911110352178],
    'Yulin': [109.741616033814, 38.290883835484],
    'Zhongwei': [105.203570900887, 37.5057014187029],
    'Xian': [108.946465550633, 34.347268816624],

    //YUNNAN XIANGPENG AIRLINES
    'Kunming': [108.946465550633, 34.347268816624],
    'Dehong': [98.5913593561141, 24.4380107027581],
    'Tengchong': [98.4975950354885, 25.0266168603455],
    'Mangshi': [98.5945541796593, 24.439426698602],

    //HEBEI AIRLINES
    'Xiamen': [118.096435499767, 24.4854066051763],
    'Wuyishan': [118.041577150087, 27.7625539102593],
    'Fuzhou': [119.30346983854, 26.0804294206981],
    'Changsha': [112.945473195353, 28.2348893999436],
    'Zhoushan': [122.21355631852, 29.9909116801603],
    'Hailaer': [119.742465370056, 49.2182158],
    'Shanghai': [121.7165123, 31.18370473],
    'Shenzhen': [114.0645518, 22.54845664],
    'Quanzhou': [118.6824463, 24.87995233],
    'Hangzhou': [120.2155118, 30.25308298],

    //SHA AIRLINES
    'Hangzhou': [120.2155118, 30.25308298],
    'Changchun': [125.3306021, 43.8219535],

    //CSN
    'Changsha': [112.945473195353, 28.2348893999436],
    'Dalian': [121.6216315, 38.91895367],
    'Guangzhou': [113.2714313, 23.13533631],
    'Guilin': [110.2035454, 25.24288572],
    'Guiyang': [106.6365768, 26.65332482],
    'Haikou': [110.3255255, 20.04404944],
    'Harbin': [126.5416151, 45.80882583],
    'Mudanjiang': [129.6395398, 44.55624571],
    'Nanning': [108.3734508, 22.8226066],
    'Sanya': [109.5185567, 18.25873629],
    'Shenzhen': [114.0645518, 22.54845664],
    'Jieyang': [116.3785122, 23.55574049],
    'Shenyang': [123.4710966, 41.68383007],
    'Urumqi': [87.62443994, 43.8307632],
    'Wuhan': [114.3115816, 30.59846674],
    'Xian': [108.9464656, 34.34726882],
    'Xining': [101.7844502, 36.6233847],
    'Yanji': [129.5205201, 42.91271701],
    'Yiwu': [120.081581, 29.31114988],
    'Zhangjiajie': [110.4855325, 29.12281556],
    'Zhengzhou': [113.6314192, 34.75343885],
    'Zhuhai': [113.5825548, 22.27656465],
    'Anshan': [123.0013725, 41.1150536],
    'Hailaer': [119.7424654, 49.2182158],
    'Shanghai': [121.6333731, 31.32168375],
    'Shanghai': [121.7165123, 31.18370473],
    'Shenzhen': [114.0645518, 22.54845664],
    'Ganzhou': [114.9405034, 25.8351761],
    'Nanning': [108.3734508, 22.8226066],
    'Chongqing': [106.5584342, 29.56899625],
    'Chengdu': [104.0815335, 30.65582188],
    'Lanzhou': [103.8405212, 36.06723469],
    'Huhhot': [111.7555086, 40.848423],
    'Hongkong': [114.1720064282, 22.2810079531],

    //Chongqing Airlines
    'Chongqing': [106.5584342, 29.56899625],


    //MU
    'Changzhou': [119.9814847, 31.81579565],
    'Chengdu': [104.0815335, 30.65582188],
    'Fuzhou': [119.2964700000, 26.0742100000],
    'Hangzhou': [120.2099470000, 30.2458530000],
    'Hefei': [117.2334427, 31.82657783],
    'Jinan': [117.1263994, 36.6565542],
    'Xishuangbanna': [100.8034468, 22.01360125],
    'Kunming': [102.8524484, 24.87399815],
    'Lanzhou': [103.8405212, 36.06723469],
    'Luoyang': [112.4594213, 34.62426278],
    'Nanchang': [115.8645894, 28.6894553],
    'Nanjing': [118.8024217, 32.06465289],
    'Ningbo': [121.6285725, 29.86603305],
    'Qingdao': [120.3894552, 36.0722275],
    'Shanghai': [121.7165123, 31.18370473],
    'Shanghai': [121.6333731, 31.32168375],
    'Taiyuan': [112.5563915, 37.87698903],
    'Urumqi': [87.62443994, 43.8307632],
    'Weifang': [119.1683779, 36.71265155],
    'Wenzhou': [120.7064769, 28.0010854],
    'Wuhan': [114.3115816, 30.59846674],
    'Xian': [108.9464656, 34.34726882],
    'Yantai': [121.4544154, 37.47003838],
    'Yibing': [104.6494037, 28.75800703],
    'Yinchuan': [106.2384936, 38.49246006],
    'Harbin': [126.5416151, 45.80882583],
    'Shenyang': [123.4710966, 41.68383007],
    'Sanya': [109.5185567, 18.25873629],
    'Xiamen': [118.0964355, 24.48540661],
    'Changchun': [125.3306021, 43.8219535],
    'Lianyungang': [119.2286213, 34.60224953],
    'Guangzhou': [113.2714313, 23.13533631],
    'Chongqing': [106.5584342, 29.56899625],
    'Haikou': [110.3255255, 20.04404944],
    'Huaian': [119.0214837, 33.6162953],
    'Nanchong': [106.1175026, 30.84378251],
    'Luzhou': [105.4485241, 28.8776683],

    //XIAMEN AIRLINES
    'Fuzhou': [119.2964700000, 26.0742100000],
    'Jinjiang': [118.5584305, 24.78782458],
    'Hangzhou': [120.2155118, 30.25308298],
    'Wuyishan': [118.0415772, 27.76255391],
    'Xiamen': [118.0964355, 24.48540661],
    'Dalian': [121.6216315, 38.91895367],
    'Zhangjiajie': [110.4855325, 29.12281556],
    'Changsha': [112.9454732, 28.2348894],
    'Guangzhou': [113.2714313, 23.13533631],
    'Wuhan': [114.3115816, 30.59846674],
    'Guiyang': [106.6365768, 26.65332482],
    'Jieyang': [116.3785122, 23.55574049],
    'Xining': [101.7844502, 36.6233847],
    'Changchun': [125.3306021, 43.8219535],
    'Zhoushan': [122.2135563, 29.99091168],
    'Hailaler': [119.7424654, 49.2182158],
    'Xian': [108.9464656, 34.34726882],
    'Chongqing': [106.5584342, 29.56899625],
    'Zhuhai': [113.5825548, 22.27656465],
    'Shenyang': [123.4710966, 41.68383007],
    'Urumqi': [87.62443994, 43.8307632],
    'Yining': [81.28424241, 43.91529944],
    'Sanya': [109.5185567, 18.25873629],
    'Haikou': [110.3255255, 20.04404944],
    'Nanning': [108.3734508, 22.8226066],
    'Shenzhen': [114.0645518, 22.54845664],
    'Ganzhou': [114.9405034, 25.8351761],
    'Beihai': [109.1265332, 21.4868365],
    'Zunyi': [106.9334277, 27.73170088],
    'Shanghai': [121.7165123, 31.18370473],
    'Harbin': [126.5416151, 45.80882583],
    'Kumming': [102.8524484, 24.87399815],
    'Taiyuan': [112.5563915, 37.87698903],
    'Yanji': [129.5205201, 42.91271701],
    'Daqing': [125.1086576, 46.59363318],
    'Guilin': [110.2035454, 25.24288572],


    //Vietnam Airlines
    'Guangzhou': [113.2714313, 23.13533631],

    //Donghai Airlines
    'Lanzhou': [103.8405212, 36.06723469],

    //Kunming Airlines
    'Nanning': [108.3734508, 22.8226066],
    'Wuxi': [120.3185833, 31.49880973],
    'Shenzhen': [114.0645518, 22.54845664],
    'Zhengzhou': [113.6314192, 34.75343885],
    'Quanzhou': [118.6824463, 24.87995233],
    'Xiangyang': [112.1285372, 32.0147968],
    'Nantong': [120.9015917, 31.98654943],
    'Yichun': [114.4235637, 27.82085642],
    'Chengdu': [104.0815335, 30.65582188],
    'Nanning': [108.3734508, 22.8226066],

    //Zhejiang Changlong Airlines
    'Hangzhou': [120.2099470000, 30.2458530000],

    //Qingdao Airlines
    'Qingdao': [120.3894552, 36.0722275],

    //Tibet Airlines
    'Lhasa': [91.12082392, 29.65004027],
    'Chongqing': [116.413384, 39.910925],
    'Chengdu': [104.0647600000, 30.5702000000],

    //CA
    'Baotou': [109.8465435, 40.66292879],
    'Chifeng': [118.8955204, 42.2616861],
    'Changchun': [125.3306021, 43.8219535],
    'Changde': [111.7054522, 29.03775],
    'Changsha': [112.9454732, 28.2348894],
    'Changzhou': [119.9814847, 31.81579565],
    'Chengdu': [104.0815335, 30.65582188],
    'Chongqing': [106.5584342, 29.56899625],
    'Dazhouheshi': [107.440808, 31.14814585],
    'Dalian': [121.6216315, 38.91895367],
    'Datong': [113.3064363, 40.08246872],
    'Fuzhou': [119.3034698, 26.08042942],
    'Guangzhou': [113.2714313, 23.13533631],
    'Guilin': [110.2035454, 25.24288572],
    'Liuzhou': [109.4344219, 24.33196139],
    'Guiyang': [106.6365768, 26.65332482],
    'Haikou': [110.3255255, 20.04404944],
    'Hailaer': [119.7424654, 49.2182158],
    'Hangzhou': [120.2155118, 30.25308298],
    'Harbin': [126.5416151, 45.80882583],
    'Hefei': [117.2334427, 31.82657783],
    'Huhhot': [111.7555086, 40.848423],
    'Jinggangshan': [114.2955559, 26.75370974],
    'Kunming': [102.8524484, 24.87399815],
    'Lanzhou': [103.8405212, 36.06723469],
    'Lhasa': [91.12082392, 29.65004027],
    'Mianyang': [104.6855619, 31.47366305],
    'Nanchang': [115.8645894, 28.6894553],
    'Nanking': [118.8024217, 32.06465289],
    'Nanning': [108.3734508, 22.8226066],
    'Nantong': [120.9015917, 31.98654943],
    'Ningbo': [121.6285725, 29.86603305],
    'Erdos': [109.7874432, 39.61448231],
    'Qingdao': [120.3894552, 36.0722275],
    'Sanya': [109.5185567, 18.25873629],
    'Shanghai': [121.7165123, 31.18370473],
    'Shanghai': [121.6333731, 31.32168375],
    'Jieyang': [116.3785122, 23.55574049],
    'Shenyang': [123.4710966, 41.68383007],
    'Shenzhen': [114.0645518, 22.54845664],
    'Taiyuan': [112.5563915, 37.87698903],
    'Tongliao': [122.2505218, 43.65798008],
    'Urumqi': [87.62443994, 43.8307632],
    'Weihai': [122.127541, 37.51643055],
    'Wenzhou': [120.7064769, 28.0010854],
    'Wuhan': [114.3115816, 30.59846674],
    'Xiamen': [118.0964355, 24.48540661],
    'Xian': [108.9464656, 34.34726882],
    'Xiangyang': [112.1290646824, 32.0148960372],
    'Xilinhot': [116.0936139, 43.9383338],
    'Xining': [101.7844502, 36.6233847],
    'Xuzhou': [117.2905754, 34.21266655],
    'Yancheng': [120.1675443, 33.35510092],
    'Yanji': [129.5205201, 42.91271701],
    'Yantai': [121.4544154, 37.47003838],
    'Yinchuan': [106.2384936, 38.49246006],
    'Yuncheng': [111.0133895, 35.03270691],
    'Zhangjiajie': [110.4855325, 29.12281556],
    'Zhengzhou': [113.6314192, 34.75343885],
    'Zhuhai': [113.5825548, 22.27656465],
    'Taipei': [121.5737379, 25.04079745],
    'Jiuzhaigou': [104.2495467, 33.25759151],
    'Yushu': [97.01318076, 33.01097959],
    'Guangyuan': [105.8504232, 32.44161631],
    'Hongkong': [114.1720064282, 22.2810079531],


    //Shandong Airlines
    'Jinan': [117.1263994, 36.6565542],
    'Qingdao': [120.3894552, 36.0722275],
    'Yantai': [121.4544154, 37.47003838],
    'Hangzhou': [120.2155118, 30.25308298],
    'Xiamen': [118.0964355, 24.48540661],
    'Rizhao': [119.5334154, 35.422839],
    'Guilin': [110.2035454, 25.24288572],
    'Nanyang': [112.5345013, 32.9965622],

    //Sichuan Airlines
    'Chengdu': [104.0815335, 30.65582188],
    'Chongqing': [106.5584342, 29.56899625],
    'Jiuzhaigou': [104.2495467, 33.25759151],
    'Kunming': [102.8524484, 24.87399815],
    'Xian': [108.9464656, 34.34726882],
    'Xichang': [102.2714838, 27.9005809],
    'Sanya': [109.5185567, 18.25873629],
    'Wanzhou': [108.4155584, 30.81362164],
    'Zhongwei': [105.2035709, 37.50570142],
    'Xishuangbanna': [100.8034468, 22.01360125],
    'Urumqi': [87.62443994, 43.8307632],

    //Shenzhen Airlines
    'Nanning': [108.3734508, 22.8226066],
    'Wuxi': [120.3185833, 31.49880973],
    'Shenzhen': [114.0645518, 22.54845664],
    'Zhengzhou': [113.6314192, 34.75343885],
    'Quanzhou': [118.6824463, 24.87995233],
    'Xiangyang': [112.1285372, 32.0147968],
    'Nantong': [120.9015917, 31.98654943],
    'Yichun': [114.4235637, 27.82085642],
    'Chengdu': [104.0815335, 30.65582188],
    'Nanning': [108.3734508, 22.8226066],

    //Shanghai Juneyao Airlines
    'Shanghai': [121.7165123, 31.18370473],

    //Donghai Airlines
    'Shenzhen': [114.0645518, 22.54845664],
    'Yichang': [111.2925492, 30.69744648],


    //Hongkong Airlines
    'Hongkong': [114.1720064282, 22.2810079531],


    //Cathay Dragon
    'Hongkong': [114.1720064282, 22.2810079531],

    //Cathey Pacific
    'Hongkong': [114.1720064282, 22.2810079531],

    //Air Macau
    'Macau': [113.5556075793, 22.2048369936],

    //China Airlines
    'Taiwan': [121.5304888883, 25.0337797504],

    //EVA Air
    'Taiwan': [121.5304888883, 25.0337797504],

};

var FZAord = {
    'Xiamen': [118.0964355, 24.48540661]
};


//GRANDCHINA
var GCAord = {
    'Dalian': [121.6186220000, 38.9145900000],
    'Guilin': [110.2991210000, 25.2742150000],
    'Harbin': [126.5353190000, 45.8031310000],
    'Nanchang': [115.8579630000, 28.6830160000],
    'Nanning': [108.3663700000, 22.8177460000],
    'Sanya': [109.5082680000, 18.2478720000],
};

//CAPITALAIR		
var CAPord = {
    'Erlianhaut': [111.9779430000, 43.6531700000],
    'Lijiang': [100.2330260000, 26.8721080000],
    'Baotou': [109.8404050000, 40.6581680000],
    'Hailaer': [119.7362790000, 49.2121890000],
    'Jixi': [130.9693330000, 45.2950750000],
    'Huhhot': [111.755508561709, 40.8484229971135],
    'Xiamen': [118.0964355, 24.48540661],
    'Huhhot': [111.755508561709, 40.8484229971135],
    'Haikou': [110.1982860000, 20.0444120000],
    'Sanya': [109.5082680000, 18.2478720000],
    'Qingdao': [120.39629, 36.30744],
    'Nanchang': [115.8579630000, 28.6830160000],
    'Yichang': [111.2925492, 30.69744648],
    'Macau': [22.2048369936, 113.5556075793],
};

//HNA
var HNAord = {
    'Baotou': [109.8404050000, 40.6581680000],
    'Chifeng': [118.8868560000, 42.2578170000],
    'Changzhi': [113.1135560000, 36.1911120000],
    'Chongqing': [116.413384, 39.910925],
    'Chengdu': [104.0647600000, 30.5702000000],
    'Dongying': [118.6647100000, 37.4345640000],
    'Fuzhou': [119.2964700000, 26.0742100000],
    'Guangzhou': [113.2643600000, 23.1290800000],
    'Guiyang': [106.6365768, 26.65332482],
    'Haikou': [110.1982860000, 20.0444120000],
    'Hailaer': [119.7362790000, 49.2121890000],
    'Hangzhou': [120.2099470000, 30.2458530000],
    'Hefei': [117.2273080000, 31.8205700000],
    'Huhhot': [111.755508561709, 40.8484229971135],
    'Jiamusi': [130.327359092573, 46.8056899908578],
    'Kunming': [102.852448365005, 24.873998150044],
    'Lanzhou': [103.840521196336, 36.0672346935456],
    'Manzhouli': [117.38543585768, 49.6040988548661],
    'Mudanjiang': [129.639539778347, 44.5562457089863],
    'Nanning': [108.373450825819, 22.8226066011872],
    'Ningbo': [121.628572494341, 29.8660330458661],
    'Qiqihaer': [123.924570868415, 47.3599771860153],
    'Shanghai': [121.480538860177, 31.235929042252],
    'Shenzhen': [114.064551836588, 22.5484566379842],
    'Taiyuan': [112.556391491672, 37.8769890288478],
    'Urumqi': [87.6244399353605, 43.8307632042905],
    'Wenzhou': [120.706476890356, 28.0010854044722],
    'Wuhai': [106.800391049997, 39.6620063648907],
    'Xian': [108.946465550633, 34.347268816624],
    'Xiamen': [118.096435499767, 24.4854066051763],
    'Yichang': [111.292549210354, 30.6974464844924],
    'Yinchuan': [106.2384935874, 38.4924600555096],
    'Tongren': [109.196438898177, 27.7377864564052],
    'Weifang': [119.168377911428, 36.7126515512675],
    'Hongkong': [22.2810079531, 114.1720064282],
    'Macau': [22.2048369936, 113.5556075793],
};

//TJA
var TJAord = {
    'Chifeng': [118.89552039752, 42.2616861034116],
    'Wulanhot': [122.0997644784, 46.0785493221],
    'Huhhot': [122.099622351983, 46.0786543435819],
    'Weifang': [119.168377911428, 36.7126515512675],
    'Yanan': [109.496581916127, 36.5911110352178],
    'Yulin': [109.741616033814, 38.290883835484],
    'Zhongwei': [105.203570900887, 37.5057014187029],
    'Xian': [108.946465550633, 34.347268816624],
};

//YUNNAN XIANGPENG AIRLINES
var XPAord = {
    'Kunming': [108.946465550633, 34.347268816624],
    'Dehong': [98.5913593561141, 24.4380107027581],
    'Tengchong': [98.4975950354885, 25.0266168603455],
    'Mangshi': [98.5945541796593, 24.439426698602],
};

//HEBEI AIRLINES
var HBAord = {
    'Xiamen': [118.096435499767, 24.4854066051763],
    'Wuyishan': [118.041577150087, 27.7625539102593],
    'Fuzhou': [119.30346983854, 26.0804294206981],
    'Changsha': [112.945473195353, 28.2348893999436],
    'Zhoushan': [122.21355631852, 29.9909116801603],
    'Hailaer': [119.742465370056, 49.2182158],
    'Shanghai': [121.7165123, 31.18370473],
    'Shenzhen': [114.0645518, 22.54845664],
    'Quanzhou': [118.6824463, 24.87995233],
    'Hangzhou': [120.2155118, 30.25308298],
};

//SHA AIRLINES
var SHAord = {
    'Hangzhou': [120.2155118, 30.25308298],
    'Changchun': [125.3306021, 43.8219535],
};

//CSN
var CSNord = {
    'Changsha': [112.945473195353, 28.2348893999436],
    'Dalian': [121.6216315, 38.91895367],
    'Guangzhou': [113.2714313, 23.13533631],
    'Guilin': [110.2035454, 25.24288572],
    'Guiyang': [106.6365768, 26.65332482],
    'Haikou': [110.3255255, 20.04404944],
    'Harbin': [126.5416151, 45.80882583],
    'Mudanjiang': [129.6395398, 44.55624571],
    'Nanning': [108.3734508, 22.8226066],
    'Sanya': [109.5185567, 18.25873629],
    'Shenzhen': [114.0645518, 22.54845664],
    'Jieyang': [116.3785122, 23.55574049],
    'Shenyang': [123.4710966, 41.68383007],
    'Urumqi': [87.62443994, 43.8307632],
    'Wuhan': [114.3115816, 30.59846674],
    'Xian': [108.9464656, 34.34726882],
    'Xining': [101.7844502, 36.6233847],
    'Yanji': [129.5205201, 42.91271701],
    'Yiwu': [120.081581, 29.31114988],
    'Zhangjiajie': [110.4855325, 29.12281556],
    'Zhengzhou': [113.6314192, 34.75343885],
    'Zhuhai': [113.5825548, 22.27656465],
    'Anshan': [123.0013725, 41.1150536],
    'Hailaer': [119.7424654, 49.2182158],
    'Shanghai': [121.6333731, 31.32168375],
    'Shanghai': [121.7165123, 31.18370473],
    'Shenzhen': [114.0645518, 22.54845664],
    'Ganzhou': [114.9405034, 25.8351761],
    'Nanning': [108.3734508, 22.8226066],
    'Chongqing': [106.5584342, 29.56899625],
    'Chengdu': [104.0815335, 30.65582188],
    'Lanzhou': [103.8405212, 36.06723469],
    'Huhhot': [111.7555086, 40.848423],
    'Hongkong': [22.2810079531, 114.1720064282],
};

//Chongqing Airlines
var CQAord = {
    'Chongqing': [106.5584342, 29.56899625],
};


//MU
var MUord = {
    'Changzhou': [119.9814847, 31.81579565],
    'Chengdu': [104.0815335, 30.65582188],
    'Fuzhou': [119.2964700000, 26.0742100000],
    'Hangzhou': [120.2099470000, 30.2458530000],
    'Hefei': [117.2334427, 31.82657783],
    'Jinan': [117.1263994, 36.6565542],
    'Xishuangbanna': [100.8034468, 22.01360125],
    'Kunming': [102.8524484, 24.87399815],
    'Lanzhou': [103.8405212, 36.06723469],
    'Luoyang': [112.4594213, 34.62426278],
    'Nanchang': [115.8645894, 28.6894553],
    'Nanjing': [118.8024217, 32.06465289],
    'Ningbo': [121.6285725, 29.86603305],
    'Qingdao': [120.3894552, 36.0722275],
    'Shanghai': [121.7165123, 31.18370473],
    'Shanghai': [121.6333731, 31.32168375],
    'Taiyuan': [112.5563915, 37.87698903],
    'Urumqi': [87.62443994, 43.8307632],
    'Weifang': [119.1683779, 36.71265155],
    'Wenzhou': [120.7064769, 28.0010854],
    'Wuhan': [114.3115816, 30.59846674],
    'Xian': [108.9464656, 34.34726882],
    'Yantai': [121.4544154, 37.47003838],
    'Yibing': [104.6494037, 28.75800703],
    'Yinchuan': [106.2384936, 38.49246006],
    'Harbin': [126.5416151, 45.80882583],
    'Shenyang': [123.4710966, 41.68383007],
    'Sanya': [109.5185567, 18.25873629],
    'Xiamen': [118.0964355, 24.48540661],
    'Changchun': [125.3306021, 43.8219535],
    'Lianyungang': [119.2286213, 34.60224953],
    'Guangzhou': [113.2714313, 23.13533631],
    'Chongqing': [106.5584342, 29.56899625],
    'Haikou': [110.3255255, 20.04404944],
    'Huaian': [119.0214837, 33.6162953],
    'Nanchong': [106.1175026, 30.84378251],
    'Luzhou': [105.4485241, 28.8776683],
};

//XIAMEN AIRLINES
var XMAord = {
    'Fuzhou': [119.2964700000, 26.0742100000],
    'Jinjiang': [118.5584305, 24.78782458],
    'Hangzhou': [120.2155118, 30.25308298],
    'Wuyishan': [118.0415772, 27.76255391],
    'Xiamen': [118.0964355, 24.48540661],
    'Dalian': [121.6216315, 38.91895367],
    'Zhangjiajie': [110.4855325, 29.12281556],
    'Changsha': [112.9454732, 28.2348894],
    'Guangzhou': [113.2714313, 23.13533631],
    'Wuhan': [114.3115816, 30.59846674],
    'Guiyang': [106.6365768, 26.65332482],
    'Jieyang': [116.3785122, 23.55574049],
    'Xining': [101.7844502, 36.6233847],
    'Changchun': [125.3306021, 43.8219535],
    'Zhoushan': [122.2135563, 29.99091168],
    'Hailaler': [119.7424654, 49.2182158],
    'Xian': [108.9464656, 34.34726882],
    'Chongqing': [106.5584342, 29.56899625],
    'Zhuhai': [113.5825548, 22.27656465],
    'Shenyang': [123.4710966, 41.68383007],
    'Urumqi': [87.62443994, 43.8307632],
    'Yining': [81.28424241, 43.91529944],
    'Sanya': [109.5185567, 18.25873629],
    'Haikou': [110.3255255, 20.04404944],
    'Nanning': [108.3734508, 22.8226066],
    'Shenzhen': [114.0645518, 22.54845664],
    'Ganzhou': [114.9405034, 25.8351761],
    'Beihai': [109.1265332, 21.4868365],
    'Zunyi': [106.9334277, 27.73170088],
    'Shanghai': [121.7165123, 31.18370473],
    'Harbin': [126.5416151, 45.80882583],
    'Kumming': [102.8524484, 24.87399815],
    'Taiyuan': [112.5563915, 37.87698903],
    'Yanji': [129.5205201, 42.91271701],
    'Daqing': [125.1086576, 46.59363318],
    'Guilin': [110.2035454, 25.24288572],
};


//Vietnam Airlines
var VETord = {
    'Guangzhou': [113.2714313, 23.13533631],
};

//Donghai Airlines
var DHAord = {
    'Lanzhou': [103.8405212, 36.06723469],
};

//Kunming Airlines
var KMAord = {
    'Nanning': [108.3734508, 22.8226066],
    'Wuxi': [120.3185833, 31.49880973],
    'Shenzhen': [114.0645518, 22.54845664],
    'Zhengzhou': [113.6314192, 34.75343885],
    'Quanzhou': [118.6824463, 24.87995233],
    'Xiangyang': [112.1285372, 32.0147968],
    'Nantong': [120.9015917, 31.98654943],
    'Yichun': [114.4235637, 27.82085642],
    'Chengdu': [104.0815335, 30.65582188],
    'Nanning': [108.3734508, 22.8226066],
};

//Zhejiang Changlong Airlines
var ZJAord = {
    'Hangzhou': [120.2099470000, 30.2458530000],
};

//Qingdao Airlines
var QDAord = {
    'Qingdao': [120.3894552, 36.0722275],
};

//Tibet Airlines
var TBAord = {
    'Lhasa': [91.12082392, 29.65004027],
    'Chongqing': [116.413384, 39.910925],
    'Chengdu': [104.0647600000, 30.5702000000],
};

//CA
var CAord = {
    'Baotou': [109.8465435, 40.66292879],
    'Chifeng': [118.8955204, 42.2616861],
    'Changchun': [125.3306021, 43.8219535],
    'Changde': [111.7054522, 29.03775],
    'Changsha': [112.9454732, 28.2348894],
    'Changzhou': [119.9814847, 31.81579565],
    'Chengdu': [104.0815335, 30.65582188],
    'Chongqing': [106.5584342, 29.56899625],
    'Dazhouheshi': [107.440808, 31.14814585],
    'Dalian': [121.6216315, 38.91895367],
    'Datong': [113.3064363, 40.08246872],
    'Fuzhou': [119.3034698, 26.08042942],
    'Guangzhou': [113.2714313, 23.13533631],
    'Guilin': [110.2035454, 25.24288572],
    'Liuzhou': [109.4344219, 24.33196139],
    'Guiyang': [106.6365768, 26.65332482],
    'Haikou': [110.3255255, 20.04404944],
    'Hailaer': [119.7424654, 49.2182158],
    'Hangzhou': [120.2155118, 30.25308298],
    'Harbin': [126.5416151, 45.80882583],
    'Hefei': [117.2334427, 31.82657783],
    'Huhhot': [111.7555086, 40.848423],
    'Jinggangshan': [114.2955559, 26.75370974],
    'Kunming': [102.8524484, 24.87399815],
    'Lanzhou': [103.8405212, 36.06723469],
    'Lhasa': [91.12082392, 29.65004027],
    'Mianyang': [104.6855619, 31.47366305],
    'Nanchang': [115.8645894, 28.6894553],
    'Nanking': [118.8024217, 32.06465289],
    'Nanning': [108.3734508, 22.8226066],
    'Nantong': [120.9015917, 31.98654943],
    'Ningbo': [121.6285725, 29.86603305],
    'Erdos': [109.7874432, 39.61448231],
    'Qingdao': [120.3894552, 36.0722275],
    'Sanya': [109.5185567, 18.25873629],
    'Shanghai': [121.7165123, 31.18370473],
    'Shanghai': [121.6333731, 31.32168375],
    'Jieyang': [116.3785122, 23.55574049],
    'Shenyang': [123.4710966, 41.68383007],
    'Shenzhen': [114.0645518, 22.54845664],
    'Taiyuan': [112.5563915, 37.87698903],
    'Tongliao': [122.2505218, 43.65798008],
    'Urumqi': [87.62443994, 43.8307632],
    'Weihai': [122.127541, 37.51643055],
    'Wenzhou': [120.7064769, 28.0010854],
    'Wuhan': [114.3115816, 30.59846674],
    'Xiamen': [118.0964355, 24.48540661],
    'Xian': [108.9464656, 34.34726882],
    'Xiangyang': [112.1290646824, 32.0148960372],
    'Xilinhot': [116.0936139, 43.9383338],
    'Xining': [101.7844502, 36.6233847],
    'Xuzhou': [117.2905754, 34.21266655],
    'Yancheng': [120.1675443, 33.35510092],
    'Yanji': [129.5205201, 42.91271701],
    'Yantai': [121.4544154, 37.47003838],
    'Yinchuan': [106.2384936, 38.49246006],
    'Yuncheng': [111.0133895, 35.03270691],
    'Zhangjiajie': [110.4855325, 29.12281556],
    'Zhengzhou': [113.6314192, 34.75343885],
    'Zhuhai': [113.5825548, 22.27656465],
    'Taipei': [121.5737379, 25.04079745],
    'Jiuzhaigou': [104.2495467, 33.25759151],
    'Yushu': [97.01318076, 33.01097959],
    'Guangyuan': [105.8504232, 32.44161631],
    'Hongkong': [22.2810079531, 114.1720064282],
};


//Shandong Airlines
var SDAord = {
    'Jinan': [117.1263994, 36.6565542],
    'Qingdao': [120.3894552, 36.0722275],
    'Yantai': [121.4544154, 37.47003838],
    'Hangzhou': [120.2155118, 30.25308298],
    'Xiamen': [118.0964355, 24.48540661],
    'Rizhao': [119.5334154, 35.422839],
    'Guilin': [110.2035454, 25.24288572],
    'Nanyang': [112.5345013, 32.9965622],
};

//Sichuan Airlines
var SCAord = {
    'Chengdu': [104.0815335, 30.65582188],
    'Chongqing': [106.5584342, 29.56899625],
    'Jiuzhaigou': [104.2495467, 33.25759151],
    'Kunming': [102.8524484, 24.87399815],
    'Xian': [108.9464656, 34.34726882],
    'Xichang': [102.2714838, 27.9005809],
    'Sanya': [109.5185567, 18.25873629],
    'Wanzhou': [108.4155584, 30.81362164],
    'Zhongwei': [105.2035709, 37.50570142],
    'Xishuangbanna': [100.8034468, 22.01360125],
    'Urumqi': [87.62443994, 43.8307632],
};

//Shenzhen Airlines
var SZAord = {
    'Nanning': [108.3734508, 22.8226066],
    'Wuxi': [120.3185833, 31.49880973],
    'Shenzhen': [114.0645518, 22.54845664],
    'Zhengzhou': [113.6314192, 34.75343885],
    'Quanzhou': [118.6824463, 24.87995233],
    'Xiangyang': [112.1285372, 32.0147968],
    'Nantong': [120.9015917, 31.98654943],
    'Yichun': [114.4235637, 27.82085642],
    'Chengdu': [104.0815335, 30.65582188],
    'Nanning': [108.3734508, 22.8226066],
};

//Shanghai Juneyao Airlines
var JYAord = {
    'Shanghai': [121.7165123, 31.18370473],
};

//Donghai Airlines
var DHAord = {
    'Shenzhen': [114.0645518, 22.54845664],
    'Yichang': [111.2925492, 30.69744648],
};


//Hongkong Airlines
var HKAord = {
    'Hongkong': [114.1720064282, 22.2810079531],
};


//Cathay Dragon
var CDAord = {
    'Hongkong': [114.1720064282, 22.2810079531],
};

//Cathey Pacific
var CPAord = {
    'Hongkong': [114.1720064282, 22.2810079531],
};

//Air Macau
var MCAord = {
    'Macau': [113.5556075793, 22.2048369936],
};

//China Airlines
var CARord = {
    'Taiwan': [121.5304888883, 25.0337797504],
};

//EVA Air
var EVAord = {
    'Taiwan': [121.5304888883, 25.0337797504],
};