$ = function (query) {
    return new OfekQuery(query);
};

const OfekQuery = function (query) {
    let collection;
    if (query === undefined) return;

    this.elements = [document];
    const queryParts = query.split(" ");
    for (let currQueryPart of queryParts) {
        let token = currQueryPart.charAt(0);
        let newElements = [];

        if (token === "#") {
            newElements = [document.getElementById(currQueryPart.substring(1))];
        }
        else {
            for (let currObject of this.elements) {
                if (token === ".") {
                    collection = currObject.getElementsByClassName(currQueryPart.substring(1));
                }
                else {
                    collection = currObject.getElementsByTagName(currQueryPart);
                }
                newElements = AddCollection(newElements, collection);
            }
        }

        this.elements = newElements;
    }

    function AddCollection(collection, classes) {
        for (let currClass of classes) {
            collection.push(currClass);
        }

        return collection;
    }

    this.addClass = function (classToAdd) {
        for (let currElement of this.elements) {
            currElement.className += " " + classToAdd;
        }
    };

    this.removeClass = function (classToRemove) {
        for (let currElement of this.elements) {
            currElement.classList.remove(classToRemove);
        }
    };

    this.each = function (fn) {
        for (let currElement of this.elements) {
            fn(currElement);
        }
    };

    this.map = function (fn) {
        let mappedElements = [];
        for (let currElement of this.elements) {
            mappedElements.push(fn(currElement));
        }

        return mappedElements;
    };

    this.any = function () {
        let args = Array.prototype.slice.call(arguments);

        for (let i = 0; i < args.length; i++) {
            let passed = true;
            for (let currElement of this.elements) {
                if (!args[i](currElement)) {
                    passed = false;
                }
            }
            if (passed) return true;
        }

        return false;
    };

    this.all = function () {
        let args = Array.prototype.slice.call(arguments);

        for (let i = 0; i < args.length; i++) {
            for (let currElement of this.elements) {
                if (!args[i](currElement)) {
                    return false;
                }
            }
        }

        return true;
    };

    this.filter = function () {
        let args = Array.prototype.slice.call(arguments);
        let newOfekQuery = new OfekQuery(query);
        newOfekQuery.elements = [];

        for (let i = 0; i < args.length; i++) {
            for (let currElement of this.elements) {
                if (args[i](currElement)) {
                    newOfekQuery.elements.push(currElement);
                }
            }
        }

        return newOfekQuery;
    };

    this.css = function (property, value) {
        for (let currElement of this.elements) {
            currElement.style.cssText += (property + ": " + value);
        }
    };

    this.count = function () {
        return this.elements.length;
    };

    this.appendChild = function (childElement) {
        for (let currElement of this.elements) {
            currElement.appendChild(document.createElement(childElement));
        }
    };

    this.getAttribute = function (attributeName) {
        let elementsAttributes = [];
        for (let currElement of this.elements) {
            elementsAttributes.push(currElement.getAttribute(attributeName));
        }

        return elementsAttributes;
    };

    this.setAttribute = function (attributeName, attributeValue) {
        for (let currElement of this.elements) {
            currElement.setAttribute(attributeName, attributeValue);
        }
    };

    this.get = function (index) {
        return this.elements[index];
    };
};
