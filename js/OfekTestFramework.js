function assert(value, name) {
    test_group_list.appendChild(document.createElement("br"));
    var li = document.createElement("li");
    li.className = (value ? "passed" : "failed");
    li.appendChild(document.createTextNode(name));
    test_group_list.appendChild(li);
    if (!value) {
        li.parentNode.parentNode.className = "failed";
    }
}

function test_group(name, test_group_function) {
    var results = document.getElementById("test-results");
    var test_group_div = document.createElement("div");
    test_group_list = document.createElement("ul");
    test_group_list.setAttribute("style", "list-style: none;");
    test_group_div.className = "passed";
    test_group_div.appendChild(document.createTextNode(name));
    test_group_div.appendChild(test_group_list);
    results.appendChild(test_group_div);
    test_group_function();
}