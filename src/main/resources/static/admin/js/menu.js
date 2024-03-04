const exceptionCode = 417;
var token = localStorage.getItem("token");
$(document).ready(function() {
    checkroleAdmin();
    loadmenu();

    function loadmenu() {
        var content =
            `<a class="nav-link" href="index">
                <div class="sb-nav-link-icon"><i class="fa fa-database iconmenu"></i></div>
                Tổng quan
            </a>
            <a class="nav-link" href="taikhoan">
                <div class="sb-nav-link-icon"><i class="fas fa-user-alt iconmenu"></i></div>
                Tài khoản
            </a>
            <a class="nav-link" href="danhmuc">
                <div class="sb-nav-link-icon"><i class="fas fa-table iconmenu"></i></div>
                Danh mục
            </a>
            <a class="nav-link" href="product">
                <div class="sb-nav-link-icon"><i class="fas fa-tree iconmenu"></i></div>
                Sản phẩm
            </a>
            <a class="nav-link" href="invoice">
                <div class="sb-nav-link-icon"><i class="fa fa-shopping-cart iconmenu"></i></div>
                Đơn hàng
            </a>
            <a class="nav-link" href="importproduct">
                <div class="sb-nav-link-icon"><i class="fas fa-file iconmenu"></i></div>
                Nhập hàng
            </a>
            <a class="nav-link" href="instruct">
                <div class="sb-nav-link-icon"><i class="fas fa-newspaper iconmenu"></i></div>
                Bài viết
            </a>
            <a class="nav-link" href="doanhthu">
                <div class="sb-nav-link-icon"><i class="fas fa-chart-bar iconmenu"></i></div>
                Doanh thu
            </a>
            <a onclick="dangXuat()" class="nav-link" href="#">
                <div class="sb-nav-link-icon"><i class="fas fa-sign-out-alt iconmenu"></i></div>
                Đăng xuất
            </a>
           `

        var menu =
            `<nav class="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
        <div class="sb-sidenav-menu">
            <div class="nav">
                ${content}
            </div>
        </div>
    </nav>`
        document.getElementById("layoutSidenav_nav").innerHTML = menu
    }
    loadtop()

    function loadtop() {
        var top =
            `<a class="navbar-brand ps-3" href="index">Quản trị hệ thống</a>
        <button class="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!"><i class="fas fa-bars"></i></button>
        <form class="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0"></form>
        <ul id="menuleft" class="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
        </ul>`
        document.getElementById("top").innerHTML = top
    }
    var sidebarToggle = document.getElementById("sidebarToggle");
    sidebarToggle.onclick = function() {
        document.body.classList.toggle('sb-sidenav-toggled');
        localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
    }
});

async function dangXuat() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace('../logout')
}


function formatmoney(money) {
    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return VND.format(money);
}

async function checkroleAdmin() {
    var token = localStorage.getItem("token");
    var url = 'http://localhost:8080/api/admin/check-role-admin';
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status > 300) {
        window.location.replace('../login')
    }
}