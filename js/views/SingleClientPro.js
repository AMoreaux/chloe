app.SingleClientProView = Backbone.View.extend({

    template: 'singleclient',
    initialize: function(options){
        NProgress.start();
        app.tools.closeView(this);
        var that = this;
        that.options = options;
        that.ChartView = new app.ChartView({id:that.options});
        that.singleClientView = new app.SingleClientView();
        that.MapBoxModel = new app.MapBoxModel;
        that.ChartModel = new app.ChartModel();
        that.ModelUserPro = new app.UserProModel();
        that.time = "30";
        that.type = "chlore";
        that.dataClient = "";
        app.tools.checkAuth(function(){
            that.render();
        });
    },
    events: {
        "click .graphTime": "createGraphByTime",
        "click .graphType": "createGraphByType",
        "click .close-single-client":"closeSingleClient",
        "click .flip-card": "flip",
        "click .send":"displayMail"
    },
    createGraphByTime:function(e){
        var time = $(e.currentTarget).data("id");
        this.time = time;
        this.singleClientView.createGraphByTime(e, this.ChartView);
    },
    createGraphByType:function(e){
        var type = $(e.currentTarget).data("type");
        this.type = type;
        this.singleClientView.createGraphByType(e, this.ChartView);
    },
    render: function(){
        var that = this;
        var token = app.userProModel.attributes.token;
        NProgress.set(0.1);

        L.mapbox.accessToken = 'pk.eyJ1IjoiYW50b2luZW1vcmVhdXgiLCJhIjoiTVpscTdxUSJ9.OjBul8yiveD6Xx3tYK9acg';
        that.ChartModel.getData(token, that.time,that.options.idClient, function(dataClient){
            that.dataClient = dataClient;
            app.tools.renderTemplate(that, {data:that.dataClient.data}, true);
            that.MapBoxModel.getClientsData(token, function (clients) {
                NProgress.set(0.3);
                that.MapBoxModel.getProData(token, function (pro) {
                    NProgress.set(0.5);
                    that.ChartView.render("chlore", 30);
                    var reg = /[ ]/g;
                    var clientAddr = dataClient.data.ownUser[0];
                    var camera = clientAddr.address.replace(reg, '+') + ',' + clientAddr.code_postal + '+' + clientAddr.city + '+France';
                    that.MapBoxModel.getLocateClient(camera, function (dataPro) {
                        NProgress.set(0.7);
                        var map = L.mapbox.map('map', 'mapbox.streets', {
                            zoomControl: true,
                            scrollWheelZoom: false

                        });
                        that.marker(map, clients, reg, function () {
                        map.setView([dataPro.results[0].geometry.location.lat, dataPro.results[0].geometry.location.lng], 12);
                        });
                        that.displayAlert();
                    });
                });
            });
        });
        return this;
    },
    displayMail:function(){
        app.navView.displayMail(false, this.dataClient);
    },
    marker: function(map, clients, reg, callback){
        for (var i = 0; i < clients.length; i++) {
            this.createMarker(map, clients[i], reg, function(){
                callback.call(this, map);
            });
        }
    },

    displayAlert:function(){
        var that = this;
        var token = app.userProModel.attributes.token;
        this.ModelUserPro.fetchAlert(token, function(controls){
            for(item in controls){
                if(controls[item].userclient_id == that.dataClient.data.id){
                   var count = 0;
                   if(controls[item].risqueAlgue != 'green'){
                       document.getElementById('alertAlgue').classList.remove('alertAlgue');
                       count++;
                   }
                   if(controls[item].colorPictoPh != 'green'){
                       document.getElementById('alertPh').classList.remove('alert');
                       count++;
                   }
                   if(controls[item].colorPictoChlore != 'green'){
                       document.getElementById('alertChlore').classList.remove('alert');
                       count++;
                   }
                   if(count > 1){
                       $('#count').addClass('button-alert-cs').removeClass('button-mail-cs').html(count+'  nouvelles alertes');
                   }else{
                       $('#count').addClass('button-alert-cs').removeClass('button-mail-cs').html('1 nouvelle alerte');
                   }
               }else{
                    if(count == 0){
                        $('#count').addClass('button button-mail-cs').removeClass('button-mail-cs').html('aperçu de la piscine');
                    }
               }

            }
            NProgress.done();
        });
    },

    createMarker: function(map, client, reg, callback) {
        var that = this;
        var name = client.firstname + ' ' + client.lastname;
        var address = client.ownUser[0].address + ' ' + client.ownUser[0].code_postal + ' ' + client.ownUser[0].city;
        var addressReq = client.ownUser[0].address.replace(reg, '+') + ',' + client.ownUser[0].code_postal + '+' + client.ownUser[0].city + '+France';
        var currentClient =  that.dataClient.data.firstname+' '+that.dataClient.data.lastname;
        if(name == currentClient){
        that.MapBoxModel.getLocateClient(addressReq, function (data) {
            var lat = data.results[0].geometry.location.lat;
            var lng = data.results[0].geometry.location.lng;
                L.mapbox.featureLayer({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [lng, lat]
                    },
                    properties: {
                        title: name,
                        description: address,
                        'marker-size': 'large',
                        //'marker-symbol': 'marker-stroked',
                        'marker-color': '#e55a33'
                    }
                }).addTo(map);
                that.singleClientView.getWeather(lng, lat);
            });
        }else{
            that.MapBoxModel.getLocateClient(addressReq, function (data) {
                var lat = data.results[0].geometry.location.lat;
                var lng = data.results[0].geometry.location.lng;
                L.mapbox.featureLayer({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [lng, lat]
                    },
                    properties: {
                        title: name,
                        description: address,
                        'marker-size': 'large'
                        //'marker-symbol': 'marker-stroked'
                    }
                }).addTo(map);
            })}
        callback.call(this, map);
    },
    closeSingleClient:function(){

        var pageClient = document.getElementById('single-client');
        pageClient.classList.remove('fadeInUpBig');
        pageClient.classList.add('fadeOutDownBig');
        setTimeout(function(){
          pageClient.innerHTML = null;
        }, 200);   
    },

    flip:function(e){
        this.singleClientView.flip(e);
    }
});