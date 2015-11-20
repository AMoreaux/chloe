app.RegisterView = Backbone.View.extend({
    template: 'register',
    initialize: function(){
      app.tools.closeView(this);
      this.model = new app.HomeModel;
      this.render({constructForms : this.model.toJSON()});

      setTimeout(function(){
        Dropzone.autoDiscover = false;
         var myDropzone = new Dropzone("#form-pro-register", { paramName: 'logo', 
            uploadMultiple: false });

          $('#form-pro-register').removeClass('dz-clickable');
          $('.dz-default span').empty();
          $('.dz-default').prependTo('.filesZone');
          $('.filesZone p').prependTo('.dz-default');
          $('.filesZone .ion-upload').prependTo('.dz-default');
          myDropzone.on("addedfile", function(file) {
            $('.dz-preview').prependTo('.filesZone');
            $('.dz-hidden-input').prependTo('.filesZone');
            $('.dz-hidden-input').attr('name', 'logo');
            $('.dz-error-mark').remove();
            $('.dz-success-mark').remove();
            $('.dz-size').remove();
            $('.dz-filename').remove();
            $('.filesZone .ion-upload').remove();
            $('.filesZone p').remove();
            });
       }, 1000);
    },
    events: {
        'submit .form-pro-register' : 'sendRegisterForm'
    },
    render: function(params){
        app.tools.renderTemplate(this, params, true);
        return this;
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