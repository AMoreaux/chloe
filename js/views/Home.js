app.HomeView = Backbone.View.extend({
    template: 'home',
    initialize: function(){
      app.tools.closeView(this);
      this.model = new app.HomeModel;
      this.render({constructForms : this.model.toJSON()});
    },
    events: {
        'submit .form-pro-connect' : 'sendConnectForm',
        'submit .form-pro-register' : 'sendRegisterForm'
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
            app.userProModel = new app.UserProModel({'token':data.token});
            document.cookie="tokenChloeApp="+data.token;
            app.userProModel.fetchDataUserPro(data.token,function(dataUser){
              app.userProModel.set(dataUser);
              appRouter.navigate('pro', {trigger: true});
            });
          }
        });
    },
    sendRegisterForm: function(e){
      e.preventDefault();
      var that = this;
      var dataFetchForm = app.tools.fetchDataForm('form-pro-register');
      var dataForm = dataFetchForm['formData'];

      app.tools.sendForm(dataForm, 'createUser', function(data){
          if(data.state == 'error'){
            that.render({constructForms: that.model.attributes, dataFormRegister: dataFetchForm['list'], errorsRegister: app.tools.getErrorMessage(data.data)});
            toastr.error('Veuillez vérifier vos informations.', 'Erreur !');
            $('[data-toggle="tooltip"]').tooltip();
          } 
          else{
            that.render({constructForms: that.model.attributes});
            toastr.success('Veuillez vérifier vos e-mails.', 'Inscription réussie !');
          } 
        });
    }
});