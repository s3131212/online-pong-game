module.exports = {
    beforeConnect: function(client){

    },
    onConnect : function(client, done) {
        client.emit('register');
        var latest_event1 = {};
        var latest_event2 = {};
        if(Math.floor(Math.random()*1000000) % 3 == 0){
            latest_event1 = {
                type: 'keydown',
                which: 'left',
                player: 'player1'
            };
            latest_event2 = {
                type: 'keyup',
                which: 'left',
                player: 'player1'
            };
        }else{
            latest_event1 = {
                type: 'keydown',
                which: 'right',
                player: 'player1'
            };
            latest_event2 = {
                type: 'keyup',
                which: 'right',
                player: 'player1'
            };
        }

        client.emit('control', latest_event1);
        setTimeout(function(){
            client.emit('control', latest_event2);
        }, 4000);
        done();
    },
    sendMessage : function(client, done) {
        
        done();
    }
};