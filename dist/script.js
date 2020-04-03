(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}((function () { 'use strict';

    class Stats {
        constructor(name) {
            this.name = name;
            this.state = '';
            this.district = '';
            this.cases = 0;
            this.path = '';
            this.data = {
                '$area': 0
            };
            this.children = [];
            this.className = '';
        }

        setState(stateName) {
            this.state = stateName;
        }

        getState() {
            return this.state;
        }

        setPath(pathName) {
            this.path = pathName;
        }

        getPath() {
            return this.path;
        }

        setCases(cases) {
            this.cases = cases;
        }

        getCases() {
            return this.cases;
        }

        setName(name) {
            this.name = name;
        }

        getName() {
            return this.name;
        }

        setClassName(className) {
            this.className = className;
        }

        getClassName() {
            return this.className;
        }

        createTile(node, totalSize) {
            const size = node.data['$area'];
            const percentage = 100.0 * size / totalSize;
            node.name += ' • ' + `${size} confirmed cases` + ' • ' + percentage.toFixed(1) + '%';
            node.children.forEach((eachNode) => {
                this.createTile(eachNode, totalSize);
            });
        };
    }
    var stats = Stats;

    const getRandomColor = () => {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    var utils = {
        getRandomColor
    };

    const { getRandomColor: getRandomColor$1 } = utils;
    const UNKNOWN_TEXT = "Unknown";

    async function getCovid19Data() {
        console.log("COVIDDDDD");
        const data = await fetch("https://api.covid19india.org/state_district_wise.json");
        return data.text();
    }
    getCovid19Data().then((data) => {
        if (!data) throw new Error("data is empty kindly check the endpoint");
        const rootStats = new stats('/');
        const statsJSON = transformData(JSON.parse(data), []);
        console.log(statsJSON);
        statsJSON.forEach((source) => {
            createNode(source, rootStats);
        });
        rootStats.createTile(rootStats, rootStats.data['$area']);
        console.log(rootStats);
        var event = new CustomEvent('covid-event', { detail: rootStats });

        // Dispatch the event
        window.dispatchEvent(event);
    });

    const transformData = (covidData, statsArray, path, colorCode) => {
        const pathPrefix = path ? `${path}/` : `India/`;
        for (let data in covidData) {
            if (covidData.hasOwnProperty(data)) {
                let color = colorCode || getRandomColor$1();
                let eachData = covidData[data];
                // skip any unknown data
                if (data === UNKNOWN_TEXT && eachData.districtData) continue;
                let stats$1 = new stats();
                stats$1.setClassName(color);
                stats$1.setName(data);
                if (eachData.confirmed) stats$1.setCases(eachData.confirmed);
                stats$1.setPath(`${pathPrefix}${data}`);
                statsArray.push(stats$1);
                if (eachData.districtData) transformData(eachData.districtData, statsArray, `${stats$1.getPath()}`, color);
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
                child = new stats(part);
                child.setClassName(source.getClassName());
                node.children.push(child);
            }
            node = child;
            if (source.cases) node.data['$area'] += source.cases;
        });
    }

})));
