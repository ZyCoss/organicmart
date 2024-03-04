async function loadMyInvoice() {
    var url = 'http://localhost:8080/api/user/my-invoice';
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<tr>
        <td onclick="loadInvoiceDetail(${list[i].id})"><a data-bs-toggle="modal" data-bs-target="#modaldeail" class="yls pointer-event">#${list[i].id}</a></td>
        <td class="floatr">${list[i].createdTime} ${list[i].createdDate}</td>
        <td>${list[i].address}</td>
        <td class="floatr"><span class="yls">${formatmoney(list[i].totalAmount)}</span></td>
        <td><span class="span_pending">${list[i].payType == true?"<span class='Paid'>Đã thanh toán</span>":"<span class='UnPaid'>Thanh toán khi nhận hàng (COD)</span>"}</span></td>
        <td class="floatr"><span class="span_">${list[i].status.name}</span></td>
        <td>
        ${(list[i].status.id == 1 || list[i].status.id== 2) && list[i].payType == false?
        `<i onclick="cancelInvoice(${list[i].id})" class="fa fa-trash-o huydon"></i>`:''}
        </td>
    </tr>`
    }
    document.getElementById("listinvoice").innerHTML = main;
    document.getElementById("sldonhang").innerHTML = list.length+" đơn hàng";
}

async function loadInvoiceDetail(id) {
    var url = 'http://localhost:8080/api/user/find-invoice-by-id?id='+id;
    const res = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var result = await res.json();
    document.getElementById("ngaytaoinvoice").innerHTML = result.createdTime+" "+ result.createdDate
    document.getElementById("trangthaitt").innerHTML = result.payType==true?"<span class='Paid'>Đã thanh toán</span>":"<span class='UnPaid'>Thanh toán khi nhận hàng (COD)</span>"
    document.getElementById("ttvanchuyen").innerHTML = result.status.name
    document.getElementById("addnhan").innerHTML = result.address
    document.getElementById("phonenhan").innerHTML = result.phone
    document.getElementById("ghichunh").innerHTML = result.note
    document.getElementById("loaithanhtoan").innerHTML = result.payType==true?'Thanh toán bằng momo':'Thanh toán khi nhận hàng (COD)'

    var url = 'http://localhost:8080/api/user/invoiceDetail-by-invoice?id='+id;
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var list = await response.json();
    var main = '';
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
    document.getElementById("listDetailinvoice").innerHTML = main;
}

async function cancelInvoice(id) {
    var con = confirm("xác nhận hủy đơn hàng này");
    if(con == false){
        return;
    }
    var url = 'http://localhost:8080/api/user/cancel-invoice?id='+id;
    const res = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if(res.status < 300){
        toastr.success("Hủy đơn hàng thành công!");
        loadMyInvoice();
    }
    if (res.status == exceptionCode) {
        var result = await res.json()
        toastr.warning(result.defaultMessage);
    }
}