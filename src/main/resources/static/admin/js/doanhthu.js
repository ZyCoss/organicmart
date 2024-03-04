var token = localStorage.getItem("token");
async function revenueYear(nam) {
    if (nam < 2000) {
        nam = new Date().getFullYear()
    }
    var url = 'http://localhost:8080/api/admin/revenue-year?year=' + nam;
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var list = await response.json();
    console.log(list)
    var main = '';
    for (i = 0; i < list.length; i++) {
        if (list[i] == null) {
            list[i] = 0
        }
    }


    var lb = 'doanh thu năm ' + nam;
    const ctx = document.getElementById("chart").getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["tháng 1", "tháng 2", "tháng 3", "tháng 4",
                "tháng 5", "tháng 6", "tháng 7", "tháng 8", "tháng 9", "tháng 10", "tháng 11", "tháng 12"
            ],
            datasets: [{
                label: lb,
                backgroundColor: 'rgba(161, 198, 247, 1)',
                borderColor: 'rgb(47, 128, 237)',
                data: list,
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        callback: function(value) {
                            return formatmoney(value);
                        }
                    }
                }]
            }
        },
    });
}

function loadByNam() {
    var nam = document.getElementById("nams").value;
    revenueYear(nam);
}

const VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
});

function formatmoney(money) {
    return VND.format(money);
}


async function loadLichSuNap() {
    $('#example').DataTable().destroy();
    var start = document.getElementById("start").value
    var end = document.getElementById("end").value
    var url = 'http://localhost:8080/api/admin/all-history-pay';
    if (start != "" && end != "") {
        url = 'http://localhost:8080/api/admin/all-history-pay?start=' + start + '&end=' + end;
    }
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
                    <td>${list[i].createdTime}<br>${list[i].createdDate}</td>
                    <td>${list[i].orderId}</td>
                    <td>MOMO</td>
                    <td>${list[i].orderId}</td>
                    <td>${list[i].totalAmount}</td>
                    <td>Đã nhận</td>
                    <td>${list[i].user.username}</td>
                </tr>`
    }
    document.getElementById("listichsu").innerHTML = main
    $('#example').DataTable();
}