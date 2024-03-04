var listcart = localStorage.getItem("cartstore");
async function addCart(id, numbers){
    var url = 'http://localhost:8080/api/public/productByID?id='+id;
    const response = await fetch(url, {
        method: 'GET'
    });
    var data = await response.json();
    if(numbers == "" || numbers < 1){return;}
    if(Number(numbers) < Number(1) ){
        toastr.warning("số lượng sản phẩm phải lớn hơn hoặc bằng 1!");
        return;
    }
    if(Number(numbers) > Number(data.quantity)){
        toastr.warning("số lượng sản phẩm không được quá: "+data.quantity);
        return;
    }
    var product = {
		"id": data.id,
		"name":data.name,
		"image":data.imageBanner,
		"price": data.price,
		"quantity": numbers
	};
    if (localStorage.getItem("cartstore") === null) {
    	var listproduct = [];
    	listproduct.push(product);
    	window.localStorage.setItem('cartstore', JSON.stringify(listproduct));
	}
    else{
        var list = JSON.parse(localStorage.getItem("cartstore"));
        var check = 0;
		for(i=0; i<list.length; i++){
			if(list[i].id === data.id){
				list[i].quantity = Number(numbers)+Number(list[i].quantity);
				check = 1;
			}
		}
		if(check === 0){
			list.push(product);
		}
		window.localStorage.setItem('cartstore', JSON.stringify(list));
    }

    if(response.status < 300){
        toastr.success("Thêm giỏ hàng thành công!");
    }
}


function showAllCart(){
    if(localStorage.getItem("cartstore") == null){
        return;
    }
	var list = JSON.parse(localStorage.getItem("cartstore"));
	var main = '';
    var tongtien = 0;
    var tongsl = 0;
	for(i=0; i<list.length; i++){
		tongtien += list[i].price*list[i].quantity;
		main += 
        `<tr>
            <td>
                <a href="detail?id=${list[i].id}"><img class="imgprocart" src="${list[i].image}"></a>
                <div class="divnamecart">
                    <a href="detail?id=${list[i].id}" class="nameprocart">${list[i].name}</a>
                </div>
            </td>
            <td><p class="boldcart">${formatmoney(list[i].price)}</p></td>
            <td>
                <div class="clusinp"><button onclick="updateQuantity(${list[i].id}, -1)" class="cartbtn"> - </button>
                <input value="${list[i].quantity}" class="inputslcart">
                <button onclick="updateQuantity(${list[i].id}, 1)" class="cartbtn"> + </button></div>
            </td>
            <td>
                <div class="tdpricecart">
                    <p class="boldcart">${list[i].quantity * list[i].price}</p>
                    <p onclick="removeCart(${list[i].id})" class="delcart"><i class="fa fa-trash-o facartde"></i></p>
                </div>
            </td>
        </tr>`
	}

	document.getElementById("listcartDes").innerHTML = main;
    document.getElementById("tonggiatien").innerText = formatmoney(tongtien)
}


async function updateQuantity(id, sl){
    var list = JSON.parse(localStorage.getItem("cartstore"));
    var url = 'http://localhost:8080/api/public/productByID?id='+id;
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
        })
    });
    var data = await response.json();
    var numbers = 0;
    for(i=0; i<list.length; i++){
        if(list[i].id == id){
            numbers = list[i].quantity + sl
        }
    }
    if(numbers == -1){
        removeCart(id);
        return;
    }
    if(Number(numbers) > Number(data.quantity)){
        swal({title: "Thông báo", text: "số lượng sản phẩm không được quá: "+data.quantity, type: "error"},
        function(){  });return;
    }
    for(i=0; i<list.length; i++){
        if(list[i].id == id){
            list[i].quantity = Number(list[i].quantity) + sl
        }
        if(Number(list[i].quantity) < Number(1)){
            var remainingArr = list.filter(data => data.id != list[i].id);
	        window.localStorage.setItem('cartstore', JSON.stringify(remainingArr));
        }
        else{
            window.localStorage.setItem('cartstore', JSON.stringify(list));
        }
    }
    showAllCart();
    loadCartMenu();
}

function removeCart(id){
	var list = JSON.parse(localStorage.getItem("cartstore"));
	var remainingArr = list.filter(data => data.id != id);
	window.localStorage.setItem('cartstore', JSON.stringify(remainingArr));
    toastr.success("Đã xóa sản phẩm khỏi giỏ hàng!")
    showAllCart();
}