if ($('.formlogin')) $('.formlogin').hide()
if ($(".last")) $(".last").hide()
if ($(".wrapinputs")) $(".wrapinputs").show()

if ($('footer')) $('footer').hide()

var back_button= $('<input class="btn btn-secondary" style="float:right;margin-top:1em;" onclick="history.back();" type="button" value="Back"/>');
var refresh_button= $('<input class="btn btn-primary" style="float:right;margin-top:1em;margin-right:1em;" onclick="location.reload();" type="button" value="Refresh"/>');

// Abyssinia4

if ($('#searchResults')){
    $('#searchResults').append(back_button);
    $('#searchResults').append(refresh_button);
}

if ($(".logout")){
    $(".logout").bind('click', function(){
        // Fire logout Event
        window.top.postMessage('log-out', '*')
    })
}

// if ($('#ico')){
//     $('#ico a').each(function(index, el){
//         console.log(el)
//         // console.log($(el).attr('data-tooltip-message'))
//         if ($(el).attr('data-tooltip-message').trim() == 'Itinerary'){
//             $(el).on('click', function(){
//                 window.top.postMessage('new-window-open', '*')
//                 console.log('new window is opened')
//             })
//         }
//     })
// }