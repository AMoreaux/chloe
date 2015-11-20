app.TestView = Backbone.View.extend({

    template: 'singleclient',
    initialize: function(){
        app.tools.closeView(this);
        var that = this;
        app.tools.checkAuth(function(){
            that.render();
        });
    },
    events: {

    },
    render: function(){
        app.tools.renderTemplate(this, null, false);
        return this;
    }


});