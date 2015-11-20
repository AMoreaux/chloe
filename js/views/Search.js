app.SearchView = Backbone.View.extend({
    template: 'search',
    initialize: function(){
        app.tools.closeView(this);
        var that = this;
        that.MapBoxModel = new app.MapBoxModel;
        that.clients = "";
        app.tools.checkAuth(function(){
            that.render();
            setTimeout(function(){
                $('#searchForm').focus();
            }, 300);
        });
    },
    events: {
        "keyup #searchForm": "search",
        "document load":"focusForm",
        "click .card-result-link-container":"displayClient"
    },
    render: function(){
        var that = this;
        var token = app.userProModel.attributes.token;
        that.MapBoxModel.getClientsData(token, function(data){
            that.clients = data;
        });
        app.tools.renderTemplate(this, null, true);
        setTimeout(function(){
          document.querySelector('.page-search').classList.add('page-search-open');
        }, 200);
        return this;
    },
    displayClient:function(e){
        app.tools.displayClient(e);
    },
    search:function(){
        var that = this;
        var value = document.getElementById('searchForm').value.toLowerCase();
        var count = 0;
        var output = '';
        if(value.length >= 2){
            for(var i = 0; i < that.clients.length; i++ ){
                if(that.clients[i].picture){
                    var img = "style=\"background-image: url('"+urlApi+"userclient/load/"+that.clients[i].id+"/"+app.userProModel.attributes.token+"');\"";
                }else{
                    //prod : var img = "style=\"background-image: url('../assets/img/default.jpg');\"";
                    //devAntoine : var img = "style=\"background-image: url('../app/assets/img/default.jpg');\"";
                    var img = "style=\"background-image: url('../assets/img/default.jpg');\"";
                }
                var name = that.clients[i].firstname+' '+that.clients[i].lastname;
                if ((that.clients[i].firstname.toLowerCase().search(value) != -1) ||
                    (that.clients[i].lastname.toLowerCase().search(value) != -1) || 
                    (that.clients[i].ownUser[0].city.toLowerCase().search(value) != -1) ||
                    name.toLowerCase().search(value) != -1) {
                    output += '<div class="col-md-4 card-pool">';
                    output += '<div class="card-result-filtre"'+img+'>';
                    output += '<div href="#" data-id="'+that.clients[i].id+'" class="card-result-link-container">';
                    output += '<a href="#" data-id="'+that.clients[i].id+'" class="card-result-button button">Voir la fiche</a>';
                    output += '</div>';
                    output += "</div>";
                    output += '<div class="card-result-name">';
                    output += '<p>' + that.clients[i].firstname+' '+ that.clients[i].lastname +'</p>';
                    output += '<small>' + that.clients[i].ownSwimmingpool[0].water_volume+'m³</small>';
                    output += '</div>';
                    count++;
                }
                output += '</div>';
                $('#results').html(output);
                $('#poolNumber').html(count);
            }
        }else{
            $('#results').empty();
            count = 0;
            $('#poolNumber').html(count);
        }
        if(count < 2){
            $('.plural').empty();
        }else{
            $('.plural').html('s');
        }
    }
});