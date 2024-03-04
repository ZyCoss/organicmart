async function loadCategory() {
    var url = 'http://localhost:8080/api/public/allcategory';
    const response = await fetch(url, {
        method: 'GET'
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<a href="product?category=${list[i].id}" class="category-item"><i class="fa fa-caret-right"></i> ${list[i].name}</a>`
    }
    document.getElementById("listcategory").innerHTML = main;
}


async function loadCategorySelect() {
    var url = 'http://localhost:8080/api/public/allcategory';
    const response = await fetch(url, {
        method: 'GET'
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<div class="singlelistmenu">
        <label class="checkbox-custom cateparent">${list[i].name}</i>
            <input value="${list[i].id}" class="inputcheck" name="catesearch" type="checkbox">
            <span class="checkmark-checkbox"></span>
        </label>
    </div>`
    }
    document.getElementById("listsearchCategory").innerHTML = main;
}
