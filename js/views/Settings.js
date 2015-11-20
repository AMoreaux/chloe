app.SettingsView = Backbone.View.extend({
    template: 'settings',
    initialize: function(){
        app.tools.closeView(this);
        var that = this;
        app.tools.checkAuth(function(){
            that.model = new app.SettingsModel; 
            that.render({constructForms : that.model.toJSON()});
        });
    },
    events: {
        'click .btn-settings-password':'sendPasswordForm'
    },
    sendPasswordForm: function(e){
      e.preventDefault();
      var that = this;
      var dataFetchForm = app.tools.fetchDataForm('form-password-settings');
      var dataForm = dataFetchForm['formData'];
      var token = app.tools.getCookie('tokenChloeApp');

      app.tools.sendForm(dataForm, 'updatePassword/'+token, function(data){
          if(data.state == 'error'){
            that.render({constructForms: that.model.attributes, dataFormPassword: dataFetchForm['list'], errorsPassword: app.tools.getErrorMessage(data.data)});
            toastr.error('Veuillez vérifier vos informations.', 'Erreur !');
            $('[data-toggle="tooltip"]').tooltip();
          } 
          else{
            that.render({constructForms: that.model.attributes});
            toastr.success('Votre mot de passe a correctement été changé.', 'Modification effectuée !');
          } 
        });
    },
    render: function(params){
        app.tools.renderTemplate(this, params, false);
        return this;
    }
});