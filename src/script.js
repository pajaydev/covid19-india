'use strict';
const Stats = require('./stats');
const { transformData, appendColor } = require('./utils');

async function getCovid19Data() {
    console.log("COVIDDDDD");
    const data = await fetch("https://api.covid19india.org/state_district_wise.json");
    return data.text();
};

getCovid19Data().then((data) => {
    if (!data) throw new Error("data is empty kindly check the endpoint");
    const rootStats = new Stats('/');
    const statsJSON = transformData(JSON.parse(data), []);
    statsJSON.forEach((source) => {
        createNode(source, rootStats);
    });
    rootStats.createTile(rootStats, rootStats.data['$area']);
    appendColor(rootStats);
    var event = new CustomEvent('covid-event', { detail: rootStats });

    // Dispatch the event
    window.dispatchEvent(event);
});

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



