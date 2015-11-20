/**
 * Created by Antoine on 26/02/2015.
 */
app.MapBoxModel = Backbone.Model.extend({
    getClientsData:function(token, callback){
        app.tools.loadJson(urlApi+'userpro/clients/'+token, function (clients)  {
            callback.call(this, clients);
        });
    },

    getClientsDataWithLoader:function(token, callback){
        app.tools.loadJson(urlApi+'userpro/clients/'+token, function (clients)  {
            callback.call(this, clients);
        },'GET', '', true);
    },

    getProData:function(token, callback){
        app.tools.loadJson(urlApi+'userpro/'+token, function (pro)  {
            callback.call(this, pro);
        });
    },

    getLocatePro:function(camera, callback){
        app.tools.loadJson('https://maps.googleapis.com/maps/api/geocode/json?address=' + camera + '&key=AIzaSyClrD_VT4PFkgjAgK5_i1fYBrA3p6UGcBY', function (dataPro)  {
            callback.call(this, dataPro);
        });
    },

    getLocateClient:function(addressReq, callback){
        app.tools.loadJson('https://maps.googleapis.com/maps/api/geocode/json?address=' + addressReq + '&key=AIzaSyClrD_VT4PFkgjAgK5_i1fYBrA3p6UGcBY', function (data)  {
            callback.call(this, data);
        });
    },

    getWeather:function(lng, lat, callback){
        app.tools.loadJson('http://api.openweathermap.org/data/2.5/find?lat='+lat+'&lon='+lng+'&units=metric&appid=95507f0c098fe4bfbe910f1e40870c5c', function (data)  {
            callback.call(this, data);
        });
    }

});
