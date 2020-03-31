'use strict';
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
}
module.exports = Stats;