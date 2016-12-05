$ = function (query) {
    return new OfekQuery(query);
};

var OfekQuery = function (query) {
    this.elements = [];
    if (query === undefined) return;
    var queryParts = query.split(" ");
    if (queryParts[0].charAt(0) !== "#" && queryParts[0].charAt(0) !== ".") {
        if (queryParts.length > 1) {
            this.elements = document.querySelectorAll(queryParts[0] + queryParts[1]);
        }
        else
            this.elements = document.getElementsByTagName(queryParts[0]);
    }
    else if (queryParts[0].charAt(0) === "#") {
        this.elements = document.getElementById(queryParts[0].substr(1, queryParts[0].length));
    }

    else if (queryParts[0].charAt(0) === ".") {
        this.elements = document.getElementsByClassName(queryParts[0].substr(1, queryParts[0].length));
    }

    this.addClass = function (classToAdd) {
        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].className += " " + classToAdd;
        }
    };

    this.removeClass = function (classToRemove) {
        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].classList.remove(classToRemove);
        }
    };

    this.each = function (fn) {
        for (var i = 0; i < this.elements.length; i++) {
            fn(this.elements[i]);
        }
    };

    this.map = function (fn) {
        var mappedElements = [];
        for (var i = 0; i < this.elements.length; i++) {
            mappedElements.push(fn(this.elements[i]));
        }

        return mappedElements;
    };

    this.any = function () {
        var args = Array.prototype.slice.call(arguments);

        for (var i = 0; i < args.length; i++) {
            var passed = true;
            for (var j = 0; j < this.elements.length; j++) {
                if (!args[i](this.elements[j])) {
                    passed = false;
                }
            }
            if (passed) return true;
        }

        return false;
    };

    this.all = function () {
        var args = Array.prototype.slice.call(arguments);

        for (var i = 0; i < args.length; i++) {
            for (var j = 0; j < this.elements.length; j++) {
                if (!args[i](this.elements[j])) {
                    return false;
                }
            }
        }

        return true;
    };

    this.filter = function () {
        var args = Array.prototype.slice.call(arguments);
        var newOfekQuery = new OfekQuery(query);
        newOfekQuery.elements = [];

        for (var i = 0; i < args.length; i++) {
            for (var j = 0; j < this.elements.length; j++) {
                if (args[i](this.elements[j])) {
                    newOfekQuery.elements.push(this.elements[j]);
                }
            }
        }

        return newOfekQuery;
    };

    this.css = function (property, value) {
        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].style.cssText += (property + ": " + value);
        }
    };

    this.count = function () {
        return this.elements.length;
    };

    this.appendChild = function (childElement) {
        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].appendChild(document.createElement(childElement));
        }
    };

    this.getAttribute = function (attributeName) {
        var elementsAttributes = [];
        for (var i = 0; i < this.elements.length; i++) {
            elementsAttributes.push(this.elements[i].getAttribute(attributeName));
        }

        return elementsAttributes;
    };

    this.setAttribute = function (attributeName, attributeValue) {
        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].setAttribute(attributeName, attributeValue);
        }
    };

    this.get = function (index) {
        return this.elements[index];
    };
};
