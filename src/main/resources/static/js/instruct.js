var size = 15;

async function lastInstruct() {
    var url = 'http://localhost:8080/api/public/lastInstruct';
    const response = await fetch(url, {
        method: 'GET'
    });
    var result = await response.json();
    var main = 
    `<div class="zoom-img"><a href="instruction-detail?id=${result.id}"><img class="imgproduct" src="${result.imageBanner}"></a></div>
    <a href="instruction-detail?id=${result.id}" class="blognamespe">${result.title}</a>
    <span class="descriptionblog">${result.description}</span>`;
    document.getElementById("instructmain").innerHTML = main;
}

async function loadInstructIndex() {
    var url = 'http://localhost:8080/api/public/instructIndex';
    const response = await fetch(url, {
        method: 'GET'
    });
    var list = await response.json();
    var main = '';
    for(i=0;i<list.length; i++){
        main += `<div class="row single-blogindex">
        <div class="col-3">
            <div class="zoom-img"><a href="instruction-detail?id=${list[i].id}"><img class="imgproduct" src="${list[i].imageBanner}"></a></div>
        </div>
        <div class="col-9">
            <a href="instruction-detail?id=${list[i].id}" class="tille-single-blogindex">${list[i].title}</a>
            <span class="desblogindex">${list[i].description}</span>
        </div>
        <div class="col-12"><hr></div>
    </div>`
    }
    document.getElementById("listinstructindex").innerHTML = main;
}

async function loadAInstruct(){
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    var url = 'http://localhost:8080/api/public/instructById?id='+id;
    const response = await fetch(url, {
        method: 'GET'
    });
    var result = await response.json();
    document.getElementById("titlebg").innerHTML = result.title
    document.getElementById("contentblg").innerHTML = result.content
}

async function loadAllInstruct(page) {
    var search = document.getElementById("searchblg").value
    var url = 'http://localhost:8080/api/public/find-all-instruct-page?page=' + page + '&size=' + size+'&search='+search+'&sort=id,desc';
    const response = await fetch(url, {
        method: 'GET'
    });
    var result = await response.json();
    console.log(result)
    var list = result.content;
    var totalPage = result.totalPages;

    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<div class="singlebg">
        <a href="instruction-detail?id=${list[i].id}" class="titlebg">${list[i].title}</a>
        <div class="inforblg">
            <span class="inforct"><i class="fa fa-user"></i></span>
            <span class="inforct"> Đăng bởi: admin</span>
            <span class="iconblg inforct"><i class="fa fa-eye"></i></span>
            <span class="inforct"> ${list[i].numView} Views</span>
            <span class="iconblg inforct"><i class="fa fa-calendar"></i></span>
            <span class="inforct"> ${list[i].createdDate}</span>
        </div>
        <div class="row infbg">
            <div class="col-lg-3 col-md-4 col-sm-4 col-4">
                <a href="instruction-detail?id=${list[i].id}"><img src="${list[i].imageBanner}" class="imgbgsingle"></a>
            </div>
            <div class="col-lg-9 col-md-8 col-sm-8 col-8">
                <div class="contentblgs">
                ${list[i].description}
                </div>
                <a class="btnreadmore" href="instruction-detail?id=${list[i].id}">Xem thêm</a>
             </div>
        </div>
    </div>`;
    }
    document.getElementById("listinstr").innerHTML = main
    var mainpage = ''
    for (i = 1; i <= totalPage; i++) {
        mainpage += `<li onclick="loadAllInstruct(${(Number(i) - 1)})" class="page-item"><a class="page-link" href="#listproductindex">${i}</a></li>`
    }
    document.getElementById("pageable").innerHTML = mainpage
}