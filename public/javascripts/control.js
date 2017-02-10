var latest_event = {
	type: null,
	which: null,
	team: ''
};
var keys_status = {
	left: null ,
	right: null
};

socket.emit('register');

socket.on('team', function(data){
	latest_event.team = data;
	$('h1').text(latest_event.team);
});
socket.on('winner', function(data){
	if(data == latest_event.team){
	    $('h1').text('You Won!')
	}else{
		$('h1').text('You Lose!')
	}
	setTimeout(function(){
		$('h1').text(latest_event.team);
	}, 2000);
});
socket.on('reset-client', function(){
    $('h1').text('Waiting to restart session...')

    setTimeout(function(){
    	location.reload(); 
    }, 500);
});

function sendupdate(){
	if(latest_event.which != null && latest_event.type != null
		&& keys_status[latest_event.which] != latest_event.type ){
		
		console.log(keys_status[latest_event.which] + latest_event.type);

		socket.emit('control', latest_event);

		keys_status[latest_event.which] = latest_event.type;

		latest_event.type = null;
		latest_event.which = null;
	}
}
$(function(){
	$(document).on("keydown keyup", function(event){

		console.log(event.type + event.which);
		if(keys_status[event.which] != event.type){
			if(event.which == 37 || event.which == 39){
				latest_event.type = event.type;

				if(event.which == 37)
					latest_event.which = 'left';
				else
					latest_event.which = 'right';

				sendupdate();
			}
		}
	});
	$('#left').on('mousedown touchstart', function(){
		latest_event.which = 'left';
		latest_event.type = 'keydown';
		sendupdate();
	});
	$('#left').on('mouseup mouseleave touchend', function(){
		latest_event.which = 'left';
		latest_event.type = 'keyup';
		sendupdate();
	});
	$('#right').on('mousedown touchstart', function(){
		latest_event.which = 'right';
		latest_event.type = 'keydown';
		sendupdate();
	});
	$('#right').on('mouseup mouseleave touchend', function(){
		latest_event.which = 'right';
		latest_event.type = 'keyup';
		sendupdate();
	});
});