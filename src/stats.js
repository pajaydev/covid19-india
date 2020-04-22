'use strict';
const { formatNumber } = require('./utils');
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
        this.state = stateName
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
        node.name += ' • ' + `${formatNumber(size)} confirmed cases` + ' • ' + percentage.toFixed(1) + '%';
        node.children.forEach((eachNode) => {
            this.createTile(eachNode, totalSize)
        });
    };
}
module.exports = Stats;