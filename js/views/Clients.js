app.ClientsView = Backbone.View.extend({
    template: 'clients',
    initialize: function(){
        app.tools.closeView(this);
        var that = this;
        that.type = "name";
        that.MapBoxModel = new app.MapBoxModel();
        app.tools.checkAuth(function(){
            that.render();
        });
    },
    events: {
        "click .choice-filter": "changeTri",
        "click .card-result-link-container":"displayClient"
    },
    render: function(){
        var that = this;
        var token = app.userProModel.attributes.token;
        that.MapBoxModel.getClientsDataWithLoader(token, function(data){
            that.clients = data;
            app.tools.renderTemplate(that, null, false, function(){
                    that.displayByName();
                    $('nav a').removeClass('selected-nav');
                    $('nav a[href="#clients"]').addClass('selected-nav');
            });
        });

        return this;
    },


    changeTri: function(e){
        var type = $(e.currentTarget).data("id");
        if(type == 'name')this.displayByName();
        else this.displayByCity();
        $('.choice-filter').removeClass('filtre-selected');
        $('.choice-filter[data-id="'+type+'"]').addClass('filtre-selected');

    },
    displayClient:function(e){
        app.tools.displayClient(e);
    },
    displayByName:function(){
        var that = this;
        function sortByFirstname(key1, key2){
            return key1.firstname > key2.firstname;
        }
        that.clients.sort(sortByFirstname);
        var output =  '';
        for(var i = 0; i < that.clients.length; i++ ){
            if(that.clients[i].picture){
                var img = "style=\"background-image: url('"+urlApi+"userclient/load/"+that.clients[i].id+"/"+app.userProModel.attributes.token+"');\"";
            }else{
                //prod : var img = "style=\"background-image: url('../assets/img/default.jpg');\"";
                //devAntoine : var img = "style=\"background-image: url('../app/assets/img/default.jpg');\"";
                var img = "style=\"background-image: url('../assets/img/default.jpg');\"";
            }
            var name = that.clients[i].firstname+' '+that.clients[i].lastname;
            output += '<div class="col-md-4 card-pool">';
            output += '<div class="card-result-filtre"'+img+'>';
            output += '<div class="card-result-link-container" data-id="'+that.clients[i].id+'">';
            output += '<a href="#" data-id="'+that.clients[i].id+'" class="card-result-button button">Voir la fiche</a>';
            output += '</div>';
            output += "</div>";
            output += '<div class="card-result-name">';
            output += '<p>' + that.clients[i].firstname+' '+ that.clients[i].lastname +'</p>';
            output += '<small>' + that.clients[i].ownSwimmingpool[0].water_volume+'m³</small>';
            output += '</div>';
            output += '</div>';
            output += '</div>';
            output += '</div>';
        }
        output += '</div>';
        $('#resultsList').html(output);
    },


    displayByCity: function(){
        function sortByVille(key1, key2){
            return key1.ownUser[0].city > key2.ownUser[0].city;
        }
        this.clients.sort(sortByVille);
        var listVilles = [];
        var listClientByVille = [];
        for(var r = 0; r < this.clients.length; r++){
            listClientByVille.push(this.clients[r].ownUser[0].city);
        }
        var listClientByVilleUnique = listClientByVille.filter(function(itm,i,listClientByVille){
            return i==listClientByVille.indexOf(itm);
        });
        for(var k = 0; k < listClientByVilleUnique.length; k++){
            listVilles[listClientByVilleUnique[k]] = [];
        }

        for(ville in listVilles){
            var calc = 0;
            for(var i = 0; i < this.clients.length; i++){
                if(ville == this.clients[i].ownUser[0].city){
                    listVilles[ville][calc] = (this.clients[i]);
                    calc++;
                }
            }
        }
        var output =  '';
        for(var ville in listVilles){
            var numberObject = 0;
            for (var item in listVilles[ville]) {
                    numberObject += 1;
            }
            output += '<h3 style="clear : both;">'+ville+'</h3>';
            for(var l =0; l < numberObject; l++){
                if(listVilles[ville][l].picture){
                    var img = "style=\"background-image: url('"+urlApi+"userclient/load/"+listVilles[ville][l].id+"/"+app.userProModel.attributes.token+"');\"";
                }else{
                    //prod : var img = "style=\"background-image: url('../assets/img/default.jpg');\"";
                    //devAntoine : var img = "style=\"background-image: url('../app/assets/img/default.jpg');\"";
                    var img = "style=\"background-image: url('../assets/img/default.jpg');\"";
                }
                var name = listVilles[ville][l].firstname+' '+listVilles[ville][l].lastname;
                output += '<div class="col-md-4 card-pool">';
                output += '<div class="card-result-filtre"'+img+'>';
                output += '<div class="card-result-link-container" data-id="'+listVilles[ville][l].id+'">';
                output += '<a href="#" data-id="'+listVilles[ville][l].id+'" class="card-result-button button">Voir la fiche</a>';
                output += '</div>';
                output += "</div>";
                output += '<div class="card-result-name">';
                output += '<p>' + listVilles[ville][l].firstname+' '+ listVilles[ville][l].lastname +'</p>';
                output += '<small>' + listVilles[ville][l].ownSwimmingpool[0].water_volume+'m³</small>';
                output += '</div>';
                output += '</div>';
                output += '</div>';
                output += '</div>';
            }
            output += '</div></div>';
        }
        $('#resultsList').html(output);
    }
});