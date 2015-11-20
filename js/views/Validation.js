app.ValidationView = Backbone.View.extend({
    template: 'validation',
    initialize: function(options){
      var that = this;
      app.tools.closeView(this);
      this.model = new app.ValidationModel;
      this.model.sendValidationRequest(options.token, options.mail,function(data){
        if(data.state == 'registered') var text = 'Votre compte a bien été validé.';
        else var text = 'Request error.';
        that.render({text: text});
      });
      
    },
    render: function(params){
        app.tools.renderTemplate(this, params, true);
        return this;
    }
});