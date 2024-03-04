var token = localStorage.getItem("token");

async function loadInvoice() {
    var start = document.getElementById("start").value
    var end = document.getElementById("end").value
    var type = document.getElementById("type").value
    var trangthai = document.getElementById("trangthai").value
    var url = 'http://localhost:8080/api/admin/all-invoice?s=1';
    if (start != "" && end != "") {
        url += '&from=' + start + '&to=' + end;
    }
    if (type != -1) {
        url += '&isMomo=' + type;
    }
    if (trangthai != -1) {
        url += '&statusId=' + trangthai
    }
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<tr>
                    <td>${list[i].id}</td>
                    <td>${list[i].createdTime}<br>${list[i].createdDate}</td>
                    <td>${list[i].address}</td>
                    <td>${formatmoney(list[i].totalAmount)}</td>
                    <td>${list[i].payType == true?'<span class="dathanhtoan">Đã thanh toán</span>':'<span class="chuathanhtoan">Thanh toán khi nhận hàng(COD)</span>'}</td>
                    <td>${list[i].status.name}</td>
                    <td class="sticky-col">
                        <i onclick="loadDetailInvoice(${list[i].id})" data-bs-toggle="modal" data-bs-target="#modaldeail" class="fa fa-eye iconaction"></i>
                        <i onclick="openStatus(${list[i].id},${list[i].status.id})" data-bs-toggle="modal" data-bs-target="#capnhatdonhang" class="fa fa-edit iconaction"></i><br>
                    </td>
                </tr>`
    }
    document.getElementById("listinvoice").innerHTML = main
}

async function loadDetailInvoice(id) {
    var url = 'http://localhost:8080/api/user/invoiceDetail-by-invoice?id=' + id;
    const res = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var list = await res.json();
    var main = ''
    for (i = 0; i < list.length; i++) {
        main += `<tr>
        <td><img src="${list[i].product.imageBanner}" class="imgdetailacc"></td>
        <td>
            <a href="detail?id=${list[i].product.id}" class="text-decoration-none">${list[i].product.name}</a><br>
            <span>Mã sản phẩm: ${list[i].product.code}</span><br>
            <span class="slmobile">SL: ${list[i].quantity}</span>
        </td>
        <td>${formatmoney(list[i].product.price)}</td>
        <td class="sldetailacc">${list[i].quantity}</td>
        <td class="pricedetailacc yls">${formatmoney(list[i].product.price * list[i].quantity)}</td>
    </tr>`
    }
    document.getElementById("listDetailinvoice").innerHTML = main

    var url = 'http://localhost:8080/api/user/find-invoice-by-id?id='+id;
    const resp = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var result = await resp.json();
    document.getElementById("ngaytaoinvoice").innerHTML = result.createdTime+" "+ result.createdDate
    document.getElementById("trangthaitt").innerHTML = result.payType==true?"<span class='Paid'>Đã thanh toán</span>":"<span class='UnPaid'>Thanh toán khi nhận hàng (COD)</span>"
    document.getElementById("ttvanchuyen").innerHTML = result.status.name
    document.getElementById("addnhan").innerHTML = result.address
    document.getElementById("phonenhan").innerHTML = result.phone
    document.getElementById("ghichunh").innerHTML = result.note
    document.getElementById("loaithanhtoan").innerHTML = result.payType==true?'Thanh toán bằng momo':'Thanh toán khi nhận hàng (COD)'
}

function openStatus(idinvoice, idstatus) {
    document.getElementById("iddonhangupdate").value = idinvoice
    document.getElementById("trangthaiupdate").value = idstatus
}

async function updateStatus() {
    var idtrangthai = document.getElementById("trangthaiupdate").value
    var idinvoice = document.getElementById("iddonhangupdate").value
    var url = 'http://localhost:8080/api/admin/update-status-invoice?invoiceId=' + idinvoice + '&statusId=' + idtrangthai;
    const res = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (res.status < 300) {
        toastr.success("Cập nhật trạng thái đơn hàng thành công!");
        $("#capnhatdonhang").modal("hide")
        loadInvoice();
    }
    if (res.status == exceptionCode) {
        var result = await res.json()
        toastr.warning(result.defaultMessage);
    }
}

async function loadStatusUpdate() {
    var url = 'http://localhost:8080/api/admin/all-status';
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<option value="${list[i].id}">${list[i].name}</option>`
    }
    document.getElementById("trangthaiupdate").innerHTML = main
}

async function loadAllStatus() {
    var url = 'http://localhost:8080/api/admin/all-status';
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    var list = await response.json();
    var main = '<option value="-1">--- Tất cả ---</option>';
    for (i = 0; i < list.length; i++) {
        main += `<option value="${list[i].id}">${list[i].name}</option>`
    }
    document.getElementById("trangthai").innerHTML = main
}