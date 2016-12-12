describe('Query selector', function () {
    beforeEach(function () {
        document.body.innerHTML = __html__['index.html'];
    });

    it('Should get all of the elements of the same tag', function () {
        var liAmount = $('li').count();

        expect(liAmount).toBe(14);
    });

    it('should be able find nested elements', function () {
        var eleAmount = $('div li p').count();

        expect(eleAmount).toBe(1);
    });

    it('should add class', function () {
        $('#david-likes').addClass("simple-list");
        var attr = $('#david-likes').getAttribute("class")[0];

        expect(attr).toBe("simple-list");
    });

    it('should remove class', function () {
        $('#davids-div').removeClass("tests");
        let classList = $('#davids-div').getAttribute("class")[0];

        expect(classList).toBe("");
    });

    it('should change run a function on each of the selected elements', function () {
        $('a').each(function (el) {
            return (el.innerHTML = "test");
        });

        let elements = $('a').elements;

        elements.forEach(function (element) {
            expect(element.innerHTML).toBe("test");
        });
    });

    it('should map the elements', function () {
        let elements = $('a').map(function (el) {
            el.innerHTML = "test";
            return el;
        });

        elements.forEach(function (element) {
            expect(element.innerHTML).toBe("test");
        });
    });

    it('should check if any element got exactly 6 childs', function () {
        let result = $('ul').any(function (el) {
            return el.childElementCount === 6;
        });

        expect(result).toBeTruthy();
    });

    it('should check if all element got more then 4 childs', function () {
        let result = $('ul').all(function (el) {
            return el.childElementCount > 4
        });

        expect(result).toBeFalsy();
    });

    it('should return all ul elements that have exactly 2 children elements', function () {
        let elements = $('ul').filter(function (el) {
            return (el.childElementCount === 2);
        }).elements;

        elements.forEach(function (element) {
            expect(element.childElementCount).toBe(2);
        });
    });

    it('should append child', function () {
        $("#osher-div").appendChild("img");
        let bigDiv = $("#osher-div").elements[0];

        expect(bigDiv.lastChild.tagName).toBe("IMG");
    });

    it('should find attribute', function () {
        let attr = $('#davids-div').getAttribute("class")[0];

        expect(attr).toBe("tests");
    });

    it('should set attribute', function () {
        $('#david-likes').setAttribute("class", "simple-list");
        let attr = $('#david-likes').getAttribute("class")[0];

        expect(attr).toBe("simple-list");
    });

    it('should change css', function () {
        $('#david-dislikes').css("color", "black");
        let actualColor = $('#david-dislikes').elements[0].style.color;

        expect(actualColor).toBe("black");
    });
});