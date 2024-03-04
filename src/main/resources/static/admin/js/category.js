var token = localStorage.getItem("token");
var size = 10;
async function loadCategory() {
    $('#example').DataTable().destroy();
    var url = 'http://localhost:8080/api/public/allcategory';
    const response = await fetch(url, {
        method: 'GET'
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<tr>
                    <td>${list[i].id}</td>
                    <td>${list[i].name}</td>
                    <td class="sticky-col">
                        <i onclick="deleteCategory(${list[i].id})" class="fa fa-trash-alt iconaction"></i>
                        <a onclick="loadACategory(${list[i].id})" data-bs-toggle="modal" data-bs-target="#themdanhmuc"><i class="fa fa-edit iconaction"></i></a>
                    </td>
                </tr>`
    }
    document.getElementById("listcategory").innerHTML = main;
    $('#example').DataTable();
}

function clearInput(){
    document.getElementById("idcate").value = ''
    document.getElementById("catename").value = ''
}

async function loadACategory(id) {
    var url = 'http://localhost:8080/api/public/categoryById?id='+id;
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
        })
    });
    var obj = await response.json();
    document.getElementById("idcate").value = obj.id
    document.getElementById("catename").value = obj.name
}


async function saveCategory() {
    var idcate = document.getElementById("idcate").value
    var catename = document.getElementById("catename").value

    var url = 'http://localhost:8080/api/admin/addOrUpdateCategory';
    var category = {
        "id": idcate,
        "name": catename
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(category)
    });
    if (response.status < 300) {
        toastr.success("Thành công!");
        loadCategory();
        $("#themdanhmuc").modal('hide');
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}

async function deleteCategory(id) {
    var con = confirm("Bạn chắc chắn muốn xóa danh mục này?");
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/admin/deleteCategory?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("Xóa danh mục thành công!");
        loadCategory();
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}

