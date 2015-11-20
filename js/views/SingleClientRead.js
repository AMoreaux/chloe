app.SingleClientRead = Backbone.View.extend({

    template: 'singleclient',
    initialize: function(options){
        app.tools.closeView(this);
        var that = this;
        this.options = options;
        //this.ChartView = new app.ChartView({id:that.options.idClient});
        //this.singleClientView = new app.SingleClientView();
        this.ChartModel = new app.ChartModel();
        this.model = new app.UserClientModel({'token':options.token, 'id':options.id});
        this.time = "30";
        this.type = "chlore";
        this.dataClient = "";
        //this.model.fetchDataUserClient(options.token, this.time, options.id, function(){
        
        //});
        app.tools.checkAuth(function(){
            that.render();
        });
    },
    events: {
        "click .graphTime": "createGraphByTime",
        "click .graphType": "createGraphByType",
        "click .flip-card": "flip",
        "click .button-mail-cs":"displayMail",
        "click .mail-button":"displayMail"
    },
    createGraphByTime:function(e){
        this.singleClientView.createGraphByType(e);
    },
    createGraphByType:function(e){
        this.singleClientView.createGraphByType(e);
    },
    render: function(){
        var that = this;
        var token = that.model.attributes.token;
        that.ChartModel.getData(token, that.time, that.model['userclient_id'], function(dataClient){
            that.dataClient = dataClient;
            app.tools.renderTemplate(that, {data:that.dataClient.data}, true);
            //setTimeout(function(){
            //    that.ChartView.render("chlore", 30);
            //}, 100);
        });
        return this;
    },
    displayMail:function(e){
        app.navView.displayMail(false);
    }
});