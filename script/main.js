const { ipcRenderer } = require('electron')

let iframeWin;

$('#pills-tab a').on('click', function (e) {
    e.preventDefault()
    $(this).tab('show')
})

function onFightClick(){
    var email = $('#fight_user_email').val()
    var pwd = $('#fight_user_pwd').val()
    var data = "UserName=" + email + "&Password=" + pwd
    
    $.ajax({
        type: "GET",
        crossDomain: true,
        xhrFields: { withCredentials: true },
        credentials: 'same-origin',
        url: "http://localhost:5000?name=" + email + "&pwd=" + pwd,
        success: function(res, status, xhr){
            console.log("res =>", res)
            // abyssinia1
            if (res.HasErrors == true){
                console.log("Authentication Failed! Please check your credential again.")
            }else{
                // Authentication Success                            
                if (parseInt(res) == 0){
                    
                }else{
                    $("#flight_login").hide()
                    $("#flight_broswer").show()
                    var _data = {
                        cookie_value : res
                    }
                    ipcRenderer.send('add-cookie', _data);                
                    iframeWin.location = "https://consolidatorapp.tts.com/Home/Index"
                }
            }
        },
        error : function(errText){
            console.log(errText)
        }
    })
}

function onUserPortal(){
    var email = $('#portal_user_email').val()
    var pwd = $('#portal_user_pwd').val()

    alert(email + " , " + pwd)
}

window.addEventListener('message', function (event) {
    if (event.data === "log-out") {
        console.log("log out from iframe")
        ipcRenderer.send('delete-cookie');  
        $("#flight_broswer").hide()
        $("#flight_login").show()
    }
});

$(function () {
    $("#webview").on('load', async function () {
        iframeWin = this.contentWindow
        // Inject Code
        var script;

        let promise = await jQuery.get('../script/injection1.js',async function(data) {
            script   = document.createElement("script")
            script.type  = "text/javascript"
            script.text += await data
        })
        console.log(script)
        this.contentWindow.document.body.appendChild(script)
    });

    function convertLogic (time1_id, time2_id, button_id){
        $(time1_id).on('input', function() {
            let _this = $(this)
            let fullTime = _this.val()
            let hr, min, localTime
    
            if (fullTime.includes(':')) {
                [hr, min] = fullTime.split(':')
            } else {
                if (fullTime.length == 3) {
                    hr = fullTime.substring(0, 1)
                    min = fullTime.substring(1, fullTime.length)
                } else if (fullTime.length == 4) {
                    hr = fullTime.substring(0, 2)
                    min = fullTime.substring(2, fullTime.length)
                }
            }
            hr = parseInt(hr)
            localTime = (hr + 6) % 12
            if (min > 59) {
                localTime = 'invalid time!'
            } else if (hr >= 6 && hr <= 11) {
                if (hr == 6) {
                    localTime = 12
                }
                localTime = 'ከጠዋቱ ' + localTime + ':' + min
            } else if (hr >= 12 && hr <= 18) {
                if (hr == 18) {
                    localTime = 12
                }
                localTime = 'ከቀኑ ' + localTime + ':' + min
            } else if (hr >= 19 && hr <= 23) {
                localTime = 'ከምሽቱ ' + localTime + ':' + min
            } else if (hr == 0) {
                localTime = 'ከሌሊቱ 6:' + min
            } else if (hr <= 5 && hr >= 1) {
                localTime = 'ከሌሊቱ ' + localTime + ':' + min
            } else {
                localTime = 'invalid time!'
            }
            $(time2_id).val(localTime) 
            console.log(localTime)
        })
    }
    

    convertLogic('#arrival-full-time','#arrival-local-time','#arrival-clipboard')
    convertLogic('#arrival-full-time1','#arrival-local-time1','#arrival-clipboard4')
    convertLogic('#arrival-full-time2','#arrival-local-time2','#arrival-clipboard4')
    convertLogic('#arrival-full-time3','#arrival-local-time3','#arrival-clipboard4')

}); 

