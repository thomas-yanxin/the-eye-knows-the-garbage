"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var view_1 = require("../view");
util_1.assign(view_1.View.prototype, {
    getAllNodes: function () {
        var nodes = [];
        var root = this.root;
        if (root && root.each) {
            // d3-hierarchy
            root.each(function (node) {
                nodes.push(node);
            });
        }
        else if (root && root.eachNode) {
            // @antv/hierarchy
            root.eachNode(function (node) {
                nodes.push(node);
            });
        }
        return nodes;
    },
    getAllLinks: function () {
        var links = [];
        var nodes = [this.root];
        var node;
        while ((node = nodes.pop())) {
            var children = node.children;
            if (children) {
                children.forEach(function (child) {
                    links.push({
                        source: node,
                        target: child,
                    });
                    nodes.push(child);
                });
            }
        }
        return links;
    },
});
util_1.assign(view_1.View.prototype, {
    getAllEdges: view_1.View.prototype.getAllLinks,
});
