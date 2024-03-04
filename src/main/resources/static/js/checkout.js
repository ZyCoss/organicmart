var token = localStorage.getItem("token");
var exceptionCode = 417;
async function checkroleUser() {
    var url = 'http://localhost:8080/api/user/check-role-user';
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status > 300) {
        window.location.replace('login')
    }
}

function formatmoneyCheck(money) {
    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return VND.format(money);
}

function loadCartCheckOut() {
    var listcart = localStorage.getItem("cartstore");
    if (listcart == null) {
        alert("Bạn chưa có sản phẩm nào trong giỏ hàng!");
        window.location.replace("cart");
        return;
    }
    var list = JSON.parse(localStorage.getItem("cartstore"));
    if (list.length == 0) {
        alert("Bạn chưa có sản phẩm nào trong giỏ hàng!");
        window.location.replace("cart");
    }
    var main = ''
    var total = 0;
    for (i = 0; i < list.length; i++) {
        total += Number(list[i].quantity * list[i].price);
        main += `<div class="row">
                    <div class="col-lg-2 col-md-3 col-sm-3 col-3 colimgcheck">
                        <img src="${list[i].image}" class="procheckout">
                        <span class="slpro">${list[i].quantity}</span>
                    </div>
                    <div class="col-lg-7 col-md-6 col-sm-6 col-6">
                        <span class="namecheck">${list[i].name}</span>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-3 pricecheck">
                        <span>${formatmoneyCheck(list[i].quantity * list[i].price)}</span>
                    </div>
                </div>`
    }
    document.getElementById("listproductcheck").innerHTML = main;
    document.getElementById("totalAmount").innerHTML = formatmoneyCheck(total);
    document.getElementById("totalfi").innerHTML = formatmoneyCheck(total + 30000);
}

function checkout() {
    var con = confirm("Xác nhận đặt hàng!");
    if (con == false) {
        return;
    }
    var paytype = $('input[name=paytype]:checked').val()
    if (paytype == "momo") {
        requestPayMentMomo()
    }
    if (paytype == "cod") {
        paymentCod();
    }
}

async function requestPayMentMomo() {
    var list = JSON.parse(localStorage.getItem("cartstore"));
    var listpro = [];
    for (i = 0; i < list.length; i++) {
        var obj = {
            "idproduct":list[i].id,
            "quantity":list[i].quantity
        }
        listpro.push(obj);
    }
    var fullname = document.getElementById("fullname").value;
    var phone = document.getElementById("phone").value;
    var address = document.getElementById("address").value;
    var ghichudonhang = document.getElementById("ghichudonhang").value;
    if(fullname==""){toastr.warning("Họ tên không được để trống"); return;}
    if(phone==""){toastr.warning("Số điện thoại không được để trống"); return;}
    if(address==""){toastr.warning("Địa chỉ không được để trống"); return;}

    window.localStorage.setItem('fullname', fullname);
    window.localStorage.setItem('phone', phone);
    window.localStorage.setItem('address', address);
    window.localStorage.setItem('ghichudonhang', ghichudonhang);

    var returnurl = 'http://localhost:8080/payment';
    var urlinit = 'http://localhost:8080/api/urlpayment';
    var paymentDto = {
        "content": "Thanh toán đơn hàng OrganicMart",
        "returnUrl": returnurl,
        "notifyUrl": returnurl,
        "productPayments": listpro
    }
    console.log(paymentDto)
    const res = await fetch(urlinit, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(paymentDto)
    });
    var result = await res.json();
    if (res.status < 300) {
        window.open(result.url, '_blank');
    }
    if (res.status == exceptionCode) {
        toastr.warning(result.defaultMessage);
    }

}

async function paymentMomo() {
    var list = JSON.parse(localStorage.getItem("cartstore"));
    var listpro = [];
    for (i = 0; i < list.length; i++) {
        var obj = {
            "idproduct":list[i].id,
            "quantity":list[i].quantity
        }
        listpro.push(obj);
    }
    var uls = new URL(document.URL)
    var orderId = uls.searchParams.get("orderId");
    var requestId = uls.searchParams.get("requestId");
    var fullname = localStorage.getItem("fullname");
    var phone = localStorage.getItem("phone");
    var address = localStorage.getItem("address");
    var ghichudonhang = localStorage.getItem("ghichudonhang");
    var orderDto = {
        "fullname": fullname,
        "phone":phone,
        "address": address,
        "note": ghichudonhang,
        "isMomo": true,
        "orderId": orderId,
        "requestId": requestId,
        "productPayments": listpro
    }

    var url = 'http://localhost:8080/api/user/create-invoice';
    var token = localStorage.getItem("token");
    const res = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(orderDto)
    });
    var result = await res.json();
    if (res.status < 300) {
        var code = await res.text();
        if(code == 0){
            document.getElementById("thanhcong").style.display = 'block'
        }
        if(code == 1){
            window.location.href = 'account';
        }
        if(code == 2){
            document.getElementById("thatbai").style.display = 'block'
            document.getElementById("thanhcong").style.display = 'none'
        }
    }
    else{
        toastr.error("Đặt hàng thất bại");
    }
 
}



async function paymentCod() {
    var list = JSON.parse(localStorage.getItem("cartstore"));
    var listpro = [];
    for (i = 0; i < list.length; i++) {
        var obj = {
            "idproduct":list[i].id,
            "quantity":list[i].quantity
        }
        listpro.push(obj);
    }
    var fullname = document.getElementById("fullname").value;
    var phone = document.getElementById("phone").value;
    var address = document.getElementById("address").value;
    var ghichudonhang = document.getElementById("ghichudonhang").value;
    var orderDto = {
        "fullname": fullname,
        "phone":phone,
        "address": address,
        "note": ghichudonhang,
        "isMomo": false,
        "productPayments": listpro
    }

    var url = 'http://localhost:8080/api/user/create-invoice';
    var token = localStorage.getItem("token");
    const res = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(orderDto)
    });
    if (res.status < 300) {
        toastr.success("Đặt hàng thành công");
        await new Promise(r => setTimeout(r, 2000));
        window.location.replace('accounts');
    }
    else{
        toastr.error("Đặt hàng thất bại");
    }
}