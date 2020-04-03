'use strict';
const randomColor = require('randomcolor');
const Stats = require('./stats');
const UNKNOWN_TEXT = "Unknown";

const getRandomColor = () => {
    return randomColor({ hue: 'red', luminosity: 'light' });
};

const transformData = (covidData, statsArray, path, colorCode) => {
    const pathPrefix = path ? `${path}/` : `India/`;
    for (let data in covidData) {
        if (covidData.hasOwnProperty(data)) {
            let color = colorCode || getRandomColor();
            let eachData = covidData[data];
            // skip any unknown data
            if (data === UNKNOWN_TEXT && eachData.districtData) continue;
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


const appendColor = (stats) => {
    if (!stats || !stats.children.length) return;
    const parent = stats.children[0];
    if (parent && (parent.children.length > 0)) {
        parent.children.sort(function (a, b) {
            return b.data['$area'] - a.data['$area'];
        });
        let firstChild = parent.children[0];
        firstChild.setClassName("#f13941");
        firstChild.children.forEach((eachChildren) => {
            eachChildren.setClassName("#f13941");
        })
    }
}

module.exports = {
    getRandomColor,
    transformData,
    appendColor
}