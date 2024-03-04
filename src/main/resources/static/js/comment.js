async function loadComment(idpro){
    if (token == null) {
        document.getElementById("mycomment").innerHTML = ''
    }
    var url = 'http://localhost:8080/api/public/commentsByProduct?id='+idpro;
    const res = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var list = await res.json();
    console.log(list);
    var main = ''
    for(i=0;i<list.length; i++){
        main += `<div class="singlectlct">
                    <div class="row">
                        <div class="col-11">
                            <div class="d-flex nguoidangctl">
                                <img class="avtuserdangctl" src="image/avatar.webp">
                                <span class="usernamedangctl">${list[i].user.fullname == null?"Người dùng":list[i].user.fullname}</span>
                                <span class="ngaytraloi">${list[i].createdDate}</span>
                                ${list[i].myComment==true?`<i onclick="deleteComment(${list[i].id})" class="fa fa-trash pointer ngaytraloi"></i>`:''}
                            </div>
                            <div class="contentctlct">${list[i].content}</div>
                        </div>
                    </div>
                </div>`
    }
    document.getElementById("listcautlct").innerHTML = main
}

async function saveComment() {
    var id = window.location.search.split('=')[1];
    var url = 'http://localhost:8080/api/user/saveCommnet';
    var noidungbl = document.getElementById("noidungbl").value

    if(noidungbl == ""){
        alert("bạn chưa nhập nội dung")
        return;
    }
    var comment = {
        "content": noidungbl,
        "product":{
            "id":id
        }
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(comment)
    });
    if (response.status < 300) {
        toastr.success("đã đăng bình luận của bạn!");
        document.getElementById("noidungbl").value = "";
        loadComment(id);
    }
    else {
        swal({title: "Thông báo", text: "không thể bình luận!",type: "error"},
        function(){ });
    }
}

async function deleteComment(id){
    var url = 'http://localhost:8080/api/user/deletcomments?id='+id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("đã xóa bình luận của bạn!");
        var uls = new URL(document.URL)
        var idpro = uls.searchParams.get("id");
        loadComment(idpro);
    }
    else {
        toastr.error("Có lỗi xảy ra!");
    }
}