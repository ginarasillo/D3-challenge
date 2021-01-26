// Create the svg area
// create the responsive function for the page

var dataPath = "/assets/data/data.csv"

function makeResponsive() {

    var svgArea = d3.select("#scatter").select("svg")

    // clear svg if not empty
    if (!svgArea.empty()) {
        svgArea.remove()
    }

    svgWidth = document.getElementById('scatter').clientWidth 
    svgHeight = svgWidth / 1.45

    // Append SVG element
    var svg = d3
        .select("#scatter")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth)

    var margin = {
        top: 50,
        bottom: 50,
        right: 50,
        left: 50
    }

    var chartHeight = svgHeight - margin.top - margin.bottom
    var chartWidth = svgWidth - margin.left - margin.right

    // Append group element
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)

    // Reading the data via d3
    d3.csv(dataPath).then( (healthData) => {

        healthData.forEach((data) => {
            data.healthcare = +data.healthcare
            data.poverty = +data.poverty
        })

        // Creating linear scale for X and Y

        var xScale = d3.scaleLinear()
            .domain([d3.min(healthData, d => d.poverty) / 1.35, d3.max(healthData, d => d.poverty) * 1.15])
            .range([0, chartWidth])

        var yScale = d3.scaleLinear()
            .domain([d3.min(healthData, d => d.healthcare) / 1.35, d3.max(healthData, d => d.healthcare) * 1.15])
            .range([chartHeight, 0])

        // Create the X and Y axes
        var xAxis = d3.axisBottom(xScale).ticks(6)
        var yAxis = d3.axisLeft(yScale).ticks(6)

        // append axes
        chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(xAxis)

        chartGroup.append("g")
            .call(yAxis)

        //setting radius for the circles
        var radius = 10

        var circlesGroup = chartGroup.append("g")
            .selectAll("circle")
            .data(healthData)
            .enter()
            .append("circle")
            .attr("class", "stateCircle")
            .attr("cx", d => xScale(d.poverty))
            .attr("cy", d => yScale(d.healthcare))
            .attr("r", 10)

        //Circles label
        var labels = chartGroup.append("g")
            .attr("text-anchor", "middle")
            .selectAll("text")
            .data(healthData)
            .enter()
            .append("text")
            .attr("class", "stateText")
            .attr("x", d => xScale(d.poverty))
            .attr("y", d => yScale(d.healthcare) * 1.00625)
            .attr("font-size", 10)
            .text(
                d => d.abbr)
            

        // Create y axis label
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 0 - (chartHeight / 2) - 50)
            .attr("y", 0 - margin.left)
            .attr("dy", "1em")
            .attr("class", "axisText")
            .attr("font-weight", "Bold")
            .text("Lacks Healthcare (%)")

        // Create x axis label
        chartGroup.append("text")
            .attr("transform", `translate(${(chartWidth / 2) - 50}, ${chartHeight + margin.top - 10})`)
            .attr("class", "axisText")
            .attr("font-weight", "bold")
            .text("In Poverty (%)")

        // Creating tooltip
        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([80, 50])
            .html(function (d) {
                return (`${d.state}<br>Poverty: ${d.poverty}%
            <br>Healthcare: ${d.healthcare}%`)
            })

        chartGroup.call(toolTip)

        //Create "mouseover" event listener to show tooltip
        circlesGroup.on("mouseover", function(d) {
            toolTip.show(d, this)
        }).on("mouseout",  function(d) {
                toolTip.hide(d)
        })
        labels.on("mouseover", function(d) {
            toolTip.show(d, this)
        }).on("mouseout",  function(d) {
                toolTip.hide(d)
        })
    }).catch( (error) => {
        console.log(error)
    })

}
// Make browser responsive when it is called 
makeResponsive()

d3.select(window).on("resize", makeResponsive)