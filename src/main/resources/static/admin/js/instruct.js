var token = localStorage.getItem("token");
async function loadInstruct() {
    $('#example').DataTable().destroy();
    var url = 'http://localhost:8080/api/public/allInstruct';
    const response = await fetch(url, {
        method: 'GET'
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += ` <tr>
                    <td>${list[i].id}</td>
                    <td><img src="${list[i].imageBanner}" style="width: 100px;"></td>
                    <td>${list[i].createdDate}</td>
                    <td>${list[i].title}</td>
                    <td><span class="descol">${list[i].description}</span></td>
                    <td class="sticky-col">
                        <i onclick="deleteInstruct(${list[i].id})" class="fa fa-trash-alt iconaction"></i>
                        <a href="addinstruct?id=${list[i].id}"><i class="fa fa-edit iconaction"></i></a>
                    </td>
                </tr>`
    }
    document.getElementById("listblog").innerHTML = main;
    $('#example').DataTable();
}

var linkImage = ''
async function saveInstruct() {
    document.getElementById("loading").style.display = 'block'
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    var url = 'http://localhost:8080/api/admin/addOrUpdateInstruct';

    var title = document.getElementById("title").value
    var description = document.getElementById("description").value
    var content = tinyMCE.get('editor').getContent()

    const filePath = document.getElementById('fileimage')
    const formData = new FormData()
    formData.append("file", filePath.files[0])
    var urlUpload = 'http://localhost:8080/api/public/upload-file';
    const res = await fetch(urlUpload, {
        method: 'POST',
        body: formData
    });
    if (res.status < 300) {
        linkImage = await res.text();
    }
    var blog = {
        "id": id,
        "title": title,
        "description": description,
        "content": content,
        "imageBanner": linkImage
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(blog)
    });
    if (response.status < 300) {
        swal({
                title: "Thông báo",
                text: "Thêm/sửa bài viết thành công!",
                type: "success"
            },
            function() {
                window.location.replace('instruct')
            });
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
    document.getElementById("loading").style.display = 'none'
}

async function loadAInstruct() {
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    if (id != null) {
        var url = 'http://localhost:8080/api/public/instructById?id=' + id;
        const response = await fetch(url, {
            method: 'GET'
        });
        var blog = await response.json();
        document.getElementById("title").value = blog.title
        document.getElementById("description").value = blog.description
        document.getElementById("imgpreview").src = blog.imageBanner
        linkImage = blog.imageBanner
        await new Promise(r => setTimeout(r, 500));
        tinyMCE.get('editor').setContent(blog.content)
    }
}


async function deleteInstruct(id) {
    var con = confirm("Xác nhận xóa bài viết này?")
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/admin/deleteInstruct?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("Xóa bài viết thành công!");
        loadInstruct();
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}