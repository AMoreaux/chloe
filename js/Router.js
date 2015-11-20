var AppRouter = Backbone.Router.extend({
    routes: {
            "": "home",
            "pro": "userPro",
            "client": "userClient",
            "register": "register",
            "login": "auth",
            "test": "test",
            "chart": "chart",
            "logout": "logout",
            "map": "map",
            "clients": "clients",
            "add-client": "addClient",
            "settings": "settings",
            "validation/:token/:mail": "validation"
    }
});

var body = $('#container');  
    
var appRouter = new AppRouter;
    appRouter.on('route:home', function( id ){
        $('#nav').empty();
        var token = app.tools.getCookie('tokenChloeApp');
        if(token != ''){
            var data = app.tools.checkAccountType(token, function(data){
                if(data.state == 'pro') app.userProView = new app.UserProView({el : body, id:data.userpro_id, token:token});
                else if(data.state == 'client') app.singleClientRead = new app.SingleClientRead({el : body, id:data.userclient_id, token:token});
                else app.homeView = new app.HomeView({el : body});
            });
            
        }
        else app.homeView = new app.HomeView({el : body});
    });
    appRouter.on('route:userPro', function(){
        app.userProView = new app.UserProView({el : body});
    });
    appRouter.on('route:userClient', function(){
        app.singleClientRead = new app.SingleClientRead({el : body});
    });
    appRouter.on('route:test', function(){
        app.testView = new app.TestView({el : body});
    });
    appRouter.on('route:chart', function(){
        app.chartView = new app.ChartView({el : body});
    });
    appRouter.on('route:clients', function(){
        app.clientsView = new app.ClientsView({el : body});
    });
    appRouter.on('route:addClient', function(){
        app.addClientView = new app.AddClientView({el : body});
    });
    appRouter.on('route:settings', function(){
        app.settingsView = new app.SettingsView({el : body});
    });
    appRouter.on('route:map', function(){
        app.mapBoxView = new app.MapBoxView({el : body});
    });
    appRouter.on('route:auth', function(){
        app.authView = new app.AuthView({el : body});
    });
    appRouter.on('route:register', function(){
        app.registerView = new app.RegisterView({el : body});
    });
    appRouter.on('route:logout', function(){
        document.cookie="tokenChloeApp=";
        appRouter.navigate('', {trigger: true});
    });
    appRouter.on('route:validation', function(token, mail){
        app.validationView = new app.ValidationView({el : body, token: token, mail: mail});
    });

Backbone.history.start();