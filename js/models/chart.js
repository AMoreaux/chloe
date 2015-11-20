app.ChartModel = Backbone.Model.extend({
    defaults : {
        weather: {
            '01d': {class: 'ion-ios-sunny-outline'},
            '02d': {class: 'ion-ios-partlysunny-outline'},
            '03n': {class: 'ion-ios-cloudy-outline'},
            '03d': {class: 'ion-ios-cloudy-outline'},
            '04d': {class: 'ion-ios-cloudy-outline'},
            '04n': {class: 'ion-ios-cloudy-outline'},
            '09n': {class: 'ion-ios-rainy-outline'},
            '09d': {class: 'ion-ios-rainy-outline'},
            '10n': {class: 'ion-ios-rainy-outline'},
            '10d': {class: 'ion-ios-rainy-outline'},
            '11n': {class: 'ion-ios-thunderstorm-outline'},
            '11d': {class: 'ion-ios-thunderstorm-outline'},
            '13n': {class: 'ion-ios-snowy'},
            '13d': {class: 'ion-ios-snowy'},
            '01n': {class: 'ion-ios-moon-outline'},
            '02n': {class: 'ion-ios-cloudy-night-outline'}
        },
        month: {
            '1': 'Janvier',
            '2': 'Fevrier',
            '3': 'Mars',
            '4': 'Avril',
            '5': 'Mai',
            '6': 'Juin',
            '7': 'Juillet',
            '8': 'Aout',
            '9': 'Septembre',
            '10': 'Octobre',
            '11': 'Novembre',
            '12': 'Decembre'
        }
    },
    getDataGraph:function(token, time, client, callback){
        app.tools.loadJson(urlApi+'userclient/'+client+'/'+time+'/'+token, function (data) {
            callback.call(this, data);
        },'GET', '', true);
    },

    getData:function(token, time, client, callback){
        app.tools.loadJson(urlApi+'userclient/'+client+'/'+time+'/'+token, function (data) {
            callback.call(this, data);
        });
    }
});
