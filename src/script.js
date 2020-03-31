'use strict';

async function getCOVIDData() {
    console.log("COVIDDDDD");
    const data = await fetch("https://api.covid19india.org/state_district_wise.json");
    return data.text();
};

getCOVIDData().then((data) => {
    if (!data) throw new Error("data is empty kindly check the endpoint");
    const rootStats = new Stats('/');
    const statsJSON = transformData(JSON.parse(data), []);
    console.log(statsJSON);
    statsJSON.forEach((source) => {
        createNode(source, rootStats);
    });
    createTile(rootStats, rootStats.data['$area']);
    console.log(rootStats);
    var event = new CustomEvent('covid-event', { detail: rootStats });

    // Dispatch the event
    window.dispatchEvent(event);
});

const transformData = (covidData, statsArray, path, colorCode) => {
    const pathPrefix = path ? `${path}/` : `India/`;
    for (let data in covidData) {
        if (covidData.hasOwnProperty(data)) {
            let color = colorCode || getRandomColor();
            let eachData = covidData[data];
            if (data === "unknown" && eachData.districtData) continue;
            let stats = new Stats();
            stats.setClassName(color);
            stats.setName(data);
            if (eachData.confirmed) stats.setCases(eachData.confirmed)
            stats.setPath(`${pathPrefix}${data}`);
            statsArray.push(stats);
            if (eachData.districtData) transformData(eachData.districtData, statsArray, `${stats.getPath()}`, color);
        }
    }
    return statsArray;
};


function createNode(source, tree) {
    const parts = source.path.split('/');
    let node = tree;
    node.data['$area'] += source.cases;
    node.setClassName(source.getClassName());
    parts.forEach((part) => {
        let child = node.children.find(function (child) {
            return child.name == part;
        });
        if (!child) {
            child = new Stats(part);
            child.setClassName(source.getClassName());
            node.children.push(child);
        }
        node = child;
        if (source.cases) node.data['$area'] += source.cases;
    });
};

function createTile(node, totalSize) {
    const size = node.data['$area'];
    const percentage = 100.0 * size / totalSize;
    node.name += ' • ' + `${size} confirmed cases` + ' • ' + percentage.toFixed(1) + '%';
    node.children.forEach((eachNode) => {
        this.createTile(eachNode, totalSize)
    });
};


