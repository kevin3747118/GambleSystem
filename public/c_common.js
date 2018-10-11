const alzk_c_reader_url = "https://127.0.0.1:8001/mp100";
const alzk_admin_version = "V 1.1.4.2";

function logout() {
    localStorage.clear();
    $.get("/logout", {}, function(data, status) {
        window.location.href = "/login.html";
    });            
}

function setAjaxError() {
    $(document).ajaxError((event, xhr, options) => {
        if (xhr.status == "404") {
            showAlert(options.url+" Service not available ! Inform PAMEX please.");
        } else {
            alert("Server error code="+xhr.status + " : " + xhr.statusText + " => Please login to retry or contact PAMEX.");
            logout();
        }
    });
}

function initLogin(fname) {
    const login = JSON.parse(localStorage.getItem('login'));
    var p = login.userPref;
    $("#navbar").load("/alzkNav.html", function() {
        if (!fname) {
            $("#navbar ul.nav > li.active").removeClass("active");
            $("#navbar ul.nav > li:first").addClass("active");
        } else
            $("#functionName").html(fname);
        $("#loginStatus").html(`
        <li><a href="/adm/sysAlert">
          <span id="infoCount"></span>
        </a></li>
        <li><a href="/adm/sysAlert">
          <span id="alertCount"></span>
        </a></li>
        <li><a><b>Login time :</b>    ${dateToDbStr(new Date())}</a></li>            
        <li><a><span class="glyphicon glyphicon-user"></span>  ${login.name}</a></li>
        <li class="dropdown">
            <a href="#" data-toggle="dropdown">
                <span class="glyphicon glyphicon-menu-hamburger"></span>
            </a>
            <ul class="dropdown-menu">
                <li><a href="#" onclick="$('#passwordModal').modal('show')">Change Password</a></li>
                <li><a href="#" onclick="$('#aboutMeModal').modal('show')">About Me</a></li>
                <li><a href="#" onclick="$('#preferenceModal').modal('show')">Preference</a></li>
            </ul>
        </li>
        <li><a href="#" onclick='logout()'><span class="glyphicon glyphicon-log-out"></span> Logout</a></li>`)
        $(".navbar-brand").attr("version", alzk_admin_version);
    });

    $("body").append(`
        <div class="modal fade" id="passwordModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title" id="myModalLabel">
                            Change Password
                        </h3>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-danger">
                            <span>Old Password : </span><span><input id="tPassword0" type="password" maxlength="20"></span><br><br>
                            <span>New Password : </span><span><input id="tPassword1" type="password" maxlength="20"></span><br><br>
                            <span>New Password Again : </span><span><input id="tPassword2" type="password" maxlength="20"></span>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default"
                                data-dismiss="modal">
                            Cancel
                        </button>
                        <button type="button" class="btn btn-default" onclick="changePassword()">
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="aboutMeModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title" id="myModalLabel">
                            About Me
                        </h3>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-primary">
                            Name : ${login.name}<br>
                            E-Mail : ${login.email}<br>
                            Phone : ${login.phone}<br>
                            Position : ${login.position}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default"
                                data-dismiss="modal">
                            OK
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="preferenceModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title" id="myModalLabel">
                            Preference
                        </h3>
                    </div>
                    <div class="modal-body">
                        <table class="table table-striped"><tbody>
                            <tr>
                                <th>Parameter</th>
                                <th>Value</th>
                            </tr>
                            <tr>
                                <td>Tree Display Width : </td>
                                <td>
                                    <select id="AREATREE_WIDTH" onchange="setAreaTreeWidth()">
                                        <option ${p.AREATREE_WIDTH == 4? "selected":""}>4</option>
                                        <option ${p.AREATREE_WIDTH == 6? "selected":""}>6</option>
                                        <option ${p.AREATREE_WIDTH == 8? "selected":""}>8</option>
                                        <option ${p.AREATREE_WIDTH == 10? "selected":""}>10</option>
                                        <option ${p.AREATREE_WIDTH == 12? "selected":""}>12</option>
                                        <option ${p.AREATREE_WIDTH == 14? "selected":""}>14</option>
                                        <option ${p.AREATREE_WIDTH == 16? "selected":""}>16</option>
                                        <option ${p.AREATREE_WIDTH == 18? "selected":""}>18</option>
                                        <option ${p.AREATREE_WIDTH == 20? "selected":""}>20</option>
                                    </select>
                                </td>
                            </tr>
                        </tbody></table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default"
                                data-dismiss="modal">
                            Cancel
                        </button>
                        <button type="button" class="btn btn-default"
                                data-dismiss="modal" onclick="saveUserPref()">
                            OK
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `);

    $.get("/api/getUnreadAlertCounts",{},function(data, status){
        if (status == "success") {
            if (data.status == "ok") {
                if (data.infoCount > 0) {
                    $("#loginStatus #infoCount").html('<i class="material-icons" style="color:yellow">info</i>'+data.infoCount);
                    $("#loginStatus #infoCount").closest("li").show();
                } else
                    $("#loginStatus #infoCount").closest("li").hide();

                if (data.alertCount > 0) {
                    $("#loginStatus #alertCount").html('<i class="material-icons" style="color:red">warning</i>'+data.alertCount);
                    $("#loginStatus #alertCount").closest("li").show();
                } else
                    $("#loginStatus #alertCount").closest("li").hide();
            }
        }
    })
}

function changePassword() {
    const login = JSON.parse(localStorage.getItem('login'));
    if ($("#passwordModal #tPassword1").val() != $("#passwordModal #tPassword2").val()) {
        showAlert("Passwords not match !", "red");
        $("#passwordModal #tPassword1").val("");        
        $("#passwordModal #tPassword2").val("");        
        $("#passwordModal #tPassword1").focus();
        return;
    }
    $.post('/api/changePassword',
        { 
            _id: login._id, 
            oldPassword: $("#passwordModal #tPassword0").val(),
            newPassword: $("#passwordModal #tPassword1").val()
        },
        function(data, status, xhr){
            if (status == "success") {
                if (data.status == "wrong") {
                    showAlert("Old password incorrect !", "red");
                    $("#password-div #tPassword0").focus();
                } else if (data.status == "ok") {
                    showAlert("Password Changed ! Use new password to login next time.");
                    $("#passwordModal").modal("hide");        
                } else
                    showAlert("Server Error:"+data.errorText+". Inform PAMEX please !", "red");
            } else
                showAlert("Server Error:"+status+":"+xhr.statusText+". Inform PAMEX please !", "red");
        }            
    )
}

function initDeleteModal(action, bodyMsg, headMsg, okMsg) {
    if (!bodyMsg) bodyMsg = "DELETE can not be recovered.";
    if (!headMsg) headMsg = "Delete Alert";
    if (!okMsg) okMsg = "Delete";
    if ($("#deleteModal")[0] == undefined) {
        $("body").append(`
    <div class="modal fade" id="deleteModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title" id="dModalHead">
                        ${headMsg}
                    </h3>
                </div>
                <div class="modal-body">
                    <div class="alert alert-warning">
                        <p><h4 id='dModalBody'>${bodyMsg}</h4></p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default"
                            data-dismiss="modal">
                        Cancel
                    </button>
                    <button id="dModalOK" type="button" class="btn btn-primary"
                            data-dismiss="modal">
                        ${okMsg}
                    </button>
                </div>
            </div>
        </div>
    </div>`);
    } else {
        $("#dModalHead").html(headMsg);
        $("#dModalBody").html(bodyMsg);
        $("#dModalOK").html(okMsg);
    }
    $("#deleteModal #dModalOK").attr("onclick",action);
}

function genHexId(n, deli) {
    var id='';
    for (var i=0;i<n;++i)
        id += ('00'+Math.floor(Math.random() * 255).toString(16)).substr(-2) + deli
    if (deli == "") 
        return(id.toUpperCase());
    else
        return(id.slice(0,-1).toUpperCase());
}

function showAlert(msg, bgColor, textColor, howLong) {
    if ( $("body > #alzkAlert").length == 0)
        $("body").append(`
            <div id="alzkAlert" class="alzk-alert">
                <table style="background-color:inherit;color:inherit"><tr>
                    <td style="padding:5px 5px 0 0"><i class="material-icons" >warning</i></td>
                    <td></td>
                </tr></table>
            </div>
        `);

    if (!bgColor) bgColor = "green";
    if (!textColor) textColor = "white";
    if (!howLong) howLong = 3000;
    $("#alzkAlert td:last").html(msg);
    $("#alzkAlert").css('background-color',bgColor);
    $("#alzkAlert").css('color',textColor);
    $("#alzkAlert").slideDown('slow');
    setTimeout(function() { $("#alzkAlert").slideUp("slow"); }, howLong);
}

function dateToDbStr(d) {
    return String('0000'+d.getFullYear()).slice(-4)+"/"+
    String('00'+(d.getMonth()+1)).slice(-2)+"/"+
    String('00'+d.getDate()).slice(-2)+" "+
    String('00'+d.getHours()).slice(-2)+":"+
    String('00'+d.getMinutes()).slice(-2)+":"+
    String('00'+d.getSeconds()).slice(-2);
}

function validateUserPref() {
}

function saveUserPref() {
    const login = JSON.parse(localStorage.getItem('login'));
    login.userPref.AREATREE_WIDTH = parseInt($("#preferenceModal option:selected").val());
    $.get("/api/saveUserPref",{ loginId: login._id, data: login.userPref},
        function(data, status) {
            if (status == "success") {
                if (data.status == "ok") {
                    localStorage.setItem('login',JSON.stringify(login));
                    showAlert("User Preference Saved !");
                } else
                    showAlert("Server Error:"+data.errorText+". Inform PAMEX please !", "red");
            };
        }
    );
}

jQuery(function ($) {
    $(document).ajaxStart(function () {
        $(`<div class="blockUI"><div class="alzk_ajaxRunner"></div></div>`).appendTo("body").show()
    }).ajaxStop(function() {
        $(".blockUI").remove()
    });
});  


// jQuery.fn.filterByText = function(textbox, callback) {
//     return this.each( function() {
//         var select = this;
//         var options = [];
//         $(select).find('option:gt(0)').each(function() {
//         options.push({value: $(this).val(), text: $(this).text()});
//         });
//         $(select).data('options', options);
//         $(textbox).bind('change keyup', function() {
//             var options = $(select).empty().scrollTop(0).data('options');
//             var search = $.trim($(this).val());
//             var regex = new RegExp(search,'gi');
        
//             $.each(options, function(i) {
//                 var option = options[i];
//                 if(option.text.match(regex) !== null) {
//                 $(select).append(
//                     $('<option>').text(option.text).val(option.value)
//                 );
//                 }
//             });
//             $(select).prepend('<option value="" selected>-- None --</option>');
//             if ($(select).children().length > 1)
//                 $(select).children().get(1).selected = true;
//         });
//     });
// };

