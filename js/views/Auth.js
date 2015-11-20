app.AuthView = Backbone.View.extend({
    template: 'auth',
    initialize: function(){
      app.tools.closeView(this);
      this.model = new app.HomeModel;
      this.render({constructForms : this.model.toJSON()});
    },
    events: {
        'submit .form-pro-connect' : 'sendConnectForm',
    },
    render: function(params){
        app.tools.renderTemplate(this, params, true);
        return this;
    },
    sendConnectForm: function(e){
        e.preventDefault();
        var that = this;
        var dataFetchForm = app.tools.fetchDataForm('form-pro-connect');
        var dataForm = dataFetchForm['formData'];

        app.tools.sendForm(dataForm, 'login', function(data){
          if(data.state == 'error'){
            that.render({constructForms: that.model.attributes, dataFormAuth: dataFetchForm['list'], errorsAuth: app.tools.getErrorMessage(data.data)});
            toastr.error('Mauvais identifiants.', 'Erreur !');
          } 
          else{
            document.cookie="tokenChloeApp="+data.token;
            if(data.account_type == 'pro'){
              app.userProModel = new app.UserProModel({'token':data.token, 'id':data.id});
              app.userProModel.fetchDataUserPro(data.token,function(dataUser){
                app.userProModel.set(dataUser);
                appRouter.navigate('pro', {trigger: true});
              });
            }
            else{
              app.userClientModel = new app.UserClientModel({'token':data.token, 'id':data.id});
              app.userClientModel.fetchDataUserClient(data.token,function(dataUser){
                app.userClientModel.set(dataUser);
                appRouter.navigate('client', {trigger: true});
              });
            }
          }
        });
    }
});