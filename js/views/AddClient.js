app.AddClientView = Backbone.View.extend({
    template: 'addclient',
    initialize: function(){
        var that = this;
        app.tools.closeView(this);
        app.tools.checkAuth(function(){
            that.model = new app.AddClientModel;
            that.token = app.userProModel.attributes.token;
            that.model.fetchDataCreation(that.token, function(dataCreation){
                that.dataCreation = dataCreation;
                that.render({dataCreation : dataCreation, constructForms : that.model.toJSON()});

                setTimeout(function(){
                  Dropzone.autoDiscover = false;
                   var myDropzone = new Dropzone("#form-pro-add", { paramName: 'picture', 
                      uploadMultiple: false });

                    $('#form-pro-add').removeClass('dz-clickable');
                    $('.dz-default span').empty();
                    $('.dz-default').prependTo('.filesZone');
                    $('.filesZone p').prependTo('.dz-default');
                    $('.filesZone .ion-upload').prependTo('.dz-default');
                    myDropzone.on("addedfile", function(file) {
                      $('.dz-preview').prependTo('.filesZone');
                      $('.dz-hidden-input').prependTo('.filesZone');
                      $('.dz-hidden-input').attr('name', 'picture');
                      $('.dz-error-mark').remove();
                      $('.dz-success-mark').remove();
                      $('.dz-size').remove();
                      $('.dz-filename').remove();
                      $('.filesZone .ion-upload').remove();
                      $('.filesZone p').remove();
                      });
                 }, 1000);
            })
        });
    },
    events: {
        'submit .form-pro-add' : 'sendAddForm',
        'drop body':'dropZone'
    },
    render: function(params){
        app.tools.renderTemplate(this, params, false);
        $('nav a').removeClass('selected-nav');
        $('nav a[href="#add-client"]').addClass('selected-nav');
        return this;
    },
    dropZone:function(e){
      e.preventDefault();
    },
    sendAddForm: function(e){
      e.preventDefault();
      var that = this;
      var dataFetchForm = app.tools.fetchDataForm('form-pro-add');
      var dataForm = dataFetchForm['formData'];

      this.model.sendForm(dataForm, 'createUserClient', this.token, function(data){
          if(data.state == 'error'){
            that.render({dataCreation : that.dataCreation, constructForms: that.model.attributes, dataFormAdd: dataFetchForm['list'], errorsAdd: app.tools.getErrorMessage(data.data)});
            toastr.error('Veuillez vérifier les informations.', 'Erreur !');
            $('[data-toggle="tooltip"]').tooltip();
          } 
          else{
            that.render({dataCreation : that.dataCreation, constructForms: that.model.attributes});
            toastr.success('Votre client va recevoir un e-mail.', 'Client enregistré !');
          } 
        });
    }
});