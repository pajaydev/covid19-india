'use strict';
const Stats = require('./stats');
const { transformData, appendColor, extractData, formatNumbers } = require('./utils');

async function getCovid19Data() {
    const data = await fetch("https://api.covid19india.org/state_district_wise.json");
    const stateData = await fetch("https://api.rootnet.in/covid19-in/unofficial/covid19india.org/statewise");
    return await Promise.all([data.text(), stateData.text()]);
};

getCovid19Data().then((data) => {
    if (!data || !data.length) throw new Error("data is empty kindly check the endpoint");
    const districtWiseData = JSON.parse(data[0]);
    const stateWiseData = JSON.parse(data[1] || []);
    const rootStats = new Stats('/');
    const statsJSON = transformData(districtWiseData, []);
    const stateJSON = extractData(stateWiseData, []);
    statsJSON.forEach((source) => {
        createNode(source, rootStats);
    });
    rootStats.createTile(rootStats, rootStats.data['$area']);
    appendColor(rootStats);
    const event = new CustomEvent('covid-event', { detail: { 'districtWise': rootStats, 'stateWise': stateJSON } });
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



