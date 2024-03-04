var size = 15;
async function loadProductIndex(page) {
    var url = 'http://localhost:8080/api/public/product-by-param?page=' + page + '&size=' + size;
    const response = await fetch(url, {
        method: 'GET'
    });
    var result = await response.json();
    console.log(result)
    var list = result.content;
    var totalPage = result.totalPages;

    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<div class="col-lg-20p col-md-4 col-sm-3 col-6 singleproduct">
        <div class="zoom-img"><a href="detail?id=${list[i].id}"><img class="imgproduct" src="${list[i].imageBanner}"></a></div>
        <a class="proname" href="detail?id=${list[i].id}">${list[i].name}</a>
        <span class="pricepro">Giá: ${formatmoney(list[i].price)}</span>
        <span onclick="addCart(${list[i].id},1)" class="btncartpro"><i class="fa fa-shopping-bag"></i> Giỏ hàng</span>
    </div>`;
    }
    document.getElementById("listproductindex").innerHTML = main
    var mainpage = ''
    for (i = 1; i <= totalPage; i++) {
        mainpage += `<li onclick="loadProductIndex(${(Number(i) - 1)})" class="page-item"><a class="page-link" href="#listproductindex">${i}</a></li>`
    }
    document.getElementById("pageable").innerHTML = mainpage
}

async function productBestSell() {
    var url = 'http://localhost:8080/api/public/product-best-sell';
    const response = await fetch(url, {
        method: 'GET'
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<div class="singleproduct">
                    <div class="zoom-img"><a href="detail?id=${list[i].id}"><img class="imgproduct" src="${list[i].imageBanner}"></a></div>
                    <a class="proname" href="detail?id=${list[i].id}">${list[i].name}</a>
                    <span class="pricepro">Giá: ${formatmoney(list[i].price)}</span>
                    <span onclick="addCart(${list[i].id},1)" class="btncartpro"><i class="fa fa-shopping-bag"></i> Giỏ hàng</span>
                </div>`;
    }
    document.getElementById("listspbanchayright").innerHTML = main
}

async function loadAproduct(){
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    var url = 'http://localhost:8080/api/public/productByID?id='+id;
    const response = await fetch(url, {
        method: 'GET'
    });
    var result = await response.json();
    document.getElementById("detailnamepro").innerHTML = result.name
    document.getElementById("codepro").innerHTML = result.code
    document.getElementById("quansale").innerHTML = "Đã bán: "+result.quantitySold;
    document.getElementById("pricedetail").innerHTML = formatmoney(result.price)
    document.getElementById("imgdetailpro").src = result.imageBanner
    document.getElementById("descriptiondetail").innerHTML = result.description
    document.getElementById("btnaddcart").onclick = function(){
        addCart(result.id, document.getElementById("inputslcart").value);
    }
    document.getElementById("muangay").onclick = function(){
        addCart(result.id,1);
        window.location.href = 'cart';
    }
    
    var main = ''
    for(i=0; i<result.productImages.length; i++){
        main += `<div class="col-lg-20p col-md-3 col-sm-4 col-4 singdimg">
        <img onclick="clickImgdetail(this)" src="${result.productImages[i].linkImage}" class="imgldetail">
    </div>`
    }
    document.getElementById("listimgdetail").innerHTML = main

    var url = 'http://localhost:8080/api/public/allproduct?idCategory='+result.category.id;
    const res = await fetch(url, {
        method: 'GET'
    });
    var list = await res.json();
    var main = ''
    for(i=0;i<list.length; i++){
       if(list[i].id != result.id){
        main += `<div class="col-lg-20p col-md-4 col-sm-3 col-6 singleproduct">
            <div class="zoom-img"><a href="detail?id=${list[i].id}"><img class="imgproduct" src="${list[i].imageBanner}"></a></div>
            <a class="proname" href="detail?id=${list[i].id}">${list[i].name}</a>
            <span class="pricepro">Giá: ${formatmoney(list[i].price)}</span>
            <span onclick="addCart(${list[i].id},1)" class="btncartpro"><i class="fa fa-shopping-bag"></i> Giỏ hàng</span>
        </div>`
       }
    }
    document.getElementById("listproductlq").innerHTML = main
    loadComment(result.id);
}


async function clickImgdetail(e) {
    var img = document.getElementsByClassName("imgldetail");
    for (i = 0; i < img.length; i++) {
        document.getElementsByClassName("imgldetail")[i].classList.remove('imgactive');
    }
    e.classList.add('imgactive')
    document.getElementById("imgdetailpro").src = e.src
}

async function loadProductSearch(){
    var uls = new URL(document.URL)
    var search = uls.searchParams.get("search");
    var category = uls.searchParams.get("category");
    if(search != null){
        loadProductByParam(0,search);
    }
    else if(category != null){
        loadProductByCategory(0,category);
    }
    else{
        loadProductIndex(0); 
    }
}

async function loadProductByCategory(page,category){
    var cate = category;
    var url = 'http://localhost:8080/api/public/product-by-category-id?page=' + page + '&size=' + size+'&id='+cate;
    const response = await fetch(url, {
        method: 'GET'
    });
    var result = await response.json();
    var list = result.content;
    var totalPage = result.totalPages;

    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<div class="col-lg-20p col-md-4 col-sm-3 col-6 singleproduct">
        <div class="zoom-img"><a href="detail?id=${list[i].id}"><img class="imgproduct" src="${list[i].imageBanner}"></a></div>
        <a class="proname" href="detail?id=${list[i].id}">${list[i].name}</a>
        <span class="pricepro">Giá: ${formatmoney(list[i].price)}</span>
        <span onclick="addCart(${list[i].id},1)" class="btncartpro"><i class="fa fa-shopping-bag"></i> Giỏ hàng</span>
    </div>`;
    }
    document.getElementById("listproductindex").innerHTML = main
    var mainpage = ''
    for (i = 1; i <= totalPage; i++) {
        mainpage += `<li onclick="loadProductByCategory(${(Number(i) - 1)},${cate})" class="page-item"><a class="page-link">${i}</a></li>`
    }
    document.getElementById("pageable").innerHTML = mainpage
}

async function loadProductByParam(page,search){
    var param = search;
    var url = 'http://localhost:8080/api/public/product-by-param?page=' + page + '&size=' + size+'&search='+param;
    const response = await fetch(url, {
        method: 'GET'
    });
    var result = await response.json();
    var list = result.content;
    var totalPage = result.totalPages;

    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<div class="col-lg-20p col-md-4 col-sm-3 col-6 singleproduct">
        <div class="zoom-img"><a href="detail?id=${list[i].id}"><img class="imgproduct" src="${list[i].imageBanner}"></a></div>
        <a class="proname" href="detail?id=${list[i].id}">${list[i].name}</a>
        <span class="pricepro">Giá: ${formatmoney(list[i].price)}</span>
        <span onclick="addCart(${list[i].id},1)" class="btncartpro"><i class="fa fa-shopping-bag"></i> Giỏ hàng</span>
    </div>`;
    }
    document.getElementById("listproductindex").innerHTML = main
    var mainpage = ''
    for (i = 1; i <= totalPage; i++) {
        mainpage += `<li onclick="loadProductByParam(${(Number(i) - 1)},'${param}')" class="page-item"><a class="page-link">${i}</a></li>`
    }
    document.getElementById("pageable").innerHTML = mainpage
}

async function loadFullProduct(page, check){
    if(check == false){
        setVisible('#loadingpage', true);
    }
    var min_price = document.getElementById("min_price").value;
    var max_price = document.getElementById("max_price").value;
    var listCa = document.getElementById("listsearchCategory").getElementsByClassName("inputcheck");
    var listcate = [];
    for (i = 0; i < listCa.length; i++) {
        if (listCa[i].checked == true) {
            listcate.push(listCa[i].value);
        }
    }
    var obj = {
        "smallPrice":min_price,
        "largePrice":max_price,
        "listIdCategory":listcate
    }
    var url = 'http://localhost:8080/api/public/search-full-product?page=' + page + '&size=' + size;
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(obj)
    });
    var result = await response.json();
    var list = result.content;
    var totalPage = result.totalPages;
    console.log(result);
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<div class="col-lg-20p col-md-4 col-sm-3 col-6 singleproduct">
        <div class="zoom-img"><a href="detail?id=${list[i].id}"><img class="imgproduct" src="${list[i].imageBanner}"></a></div>
        <a class="proname" href="detail?id=${list[i].id}">${list[i].name}</a>
        <span class="pricepro">Giá: ${formatmoney(list[i].price)}</span>
        <span onclick="addCart(${list[i].id},1)" class="btncartpro"><i class="fa fa-shopping-bag"></i> Giỏ hàng</span>
    </div>`;
    }
    document.getElementById("listproductindex").innerHTML = main
    var mainpage = ''
    for (i = 1; i <= totalPage; i++) {
        mainpage += `<li onclick="loadFullProduct(${(Number(i) - 1)},true)" class="page-item"><a class="page-link">${i}</a></li>`
    }
    document.getElementById("pageable").innerHTML = mainpage
    await new Promise(r => setTimeout(r, 500));
    setVisible('#loadingpage', false);
}

function onReady(callback) {
    var intervalId = window.setInterval(function() {
      if (document.getElementsByTagName('body')[0] !== undefined) {
        window.clearInterval(intervalId);
        callback.call(this);
      }
    }, 1000);
}

function setVisible(selector, visible) {
document.querySelector(selector).style.display = visible ? 'block' : 'none';
}
