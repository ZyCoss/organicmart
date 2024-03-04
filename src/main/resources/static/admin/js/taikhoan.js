var token = localStorage.getItem("token");
var size = 20;
async function loadAllUser() {
    $('#example').DataTable().destroy();
    var url = 'http://localhost:8080/api/admin/get-user-by-role';
    var role = document.getElementById("role").value
    if (role != "") {
        url += '?role=' + role
    }
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var listUser = await response.json();
    var main = '';
    for (i = 0; i < listUser.length; i++) {
        var btn = '';
        if (listUser[i].actived == 0) {
            var btn = `<td class="sticky-col"><button onclick="lockOrUnlock(${listUser[i].id},0)" class="btn btn-danger"><i class="fa fa-unlock"></i> mở khóa</button></td>`
        } else {
            var btn = `<td class="sticky-col"><button onclick="lockOrUnlock(${listUser[i].id},1)" class="btn btn-primary"><i class="fa fa-lock"></i> Khóa</button></td>`
        }
        if (listUser[i].authorities.name == "ROLE_ADMIN") {
            btn = '<td class="sticky-col"></td>'
        }
        main += `<tr>
                    <td>${listUser[i].id}</td>
                    <td>${listUser[i].email}</td>
                    <td>${listUser[i].fullname}</td>
                    <td>${listUser[i].phone}</td>
                    <td>${listUser[i].createdDate}</td>
                    <td>${listUser[i].authorities.name}</td>
                    ${btn}
                </tr>`
    }
    document.getElementById("listuser").innerHTML = main
    $('#example').DataTable();
}


function filteruser() {
    loadAllUser(0, "");
}

function searchTable() {
    var val = document.getElementById("searchtable").value;
    loadAllUser(0, val);
}


async function lockOrUnlock(id, type) {
    var con = confirm("Xác nhận hành động?");
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/admin/lockOrUnlockUser?id=' + id;
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        var mess = '';
        if (type == 1) {
            mess = 'Khóa thành công'
        } else {
            mess = 'Mở khóa thành công'
        }
        swal({
                title: "Thông báo",
                text: mess,
                type: "success"
            },
            function() {
                window.location.reload();
            });
    } else {
        swal({
                title: "Thông báo",
                text: "Hành động thất bại",
                type: "error"
            },
            function() {
                window.location.reload();
            });
    }
}


async function addAdmin() {
    var url = 'http://localhost:8080/api/admin/addaccount'
    var fullname = document.getElementById("fullname").value
    var phone = document.getElementById("phone").value
    var email = document.getElementById("email").value
    var password = document.getElementById("pass").value
    var repassword = document.getElementById("repass").value
    var user = {
        "fullname": fullname,
        "phone": phone,
        "email": email,
        "password": password

    }
    if (password != repassword) {
        alert("Mật khẩu không trùng khớp")
        return;
    }
    const res = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(user)
    });
    var result = await res.json();
    if (res.status < 300) {
        swal({
                title: "Thông báo",
                text: "Tạo tài khoản thành công!",
                type: "success"
            },
            function() {
                window.location.reload();
            });
    }
    if (res.status == exceptionCode) {
        toastr.warning(result.defaultMessage);
    }
}