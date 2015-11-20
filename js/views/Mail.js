app.MailView = Backbone.View.extend({
    template: 'mail',
    initialize: function(options){
        var that = this;
        that.options = options;
        app.tools.checkAuth(function(){
            that.model = new app.MailModel;
            that.render();
        });
    },
    events: {
        'click .mail-pop-in span':'displayMail',
        'click .mail-button' : 'sendMailForm',
        'click .close-mail':'hideMail'
    },
    render: function(formParams, reload){
        if(reload == undefined) var reload = false;
        if(reload == false) app.tools.closeView(this);
        var that = this;
        that.formParams = formParams;
        this.token = app.userProModel.attributes.token;
        if(that.options.client.data){
            var clients = [that.options.client.data];
            if(that.formParams == undefined){
                that.formParams = {constructForms : that.model.toJSON(), clients: clients};
                that.formParams.constructForms.formMail.idUserClient.name = "none";
            }
        else{
                that.formParams.clients = clients;
                that.formParams.reload = true;
            }
            that.renderView(reload);
        }else{
            this.model.getClientsData(that.token, function (clients){
                if(that.formParams == undefined) that.formParams = {constructForms : that.model.toJSON(), clients: clients};
                else{
                    that.formParams.clients = clients;
                    that.formParams.reload = true;
                }
                that.renderView(reload);
            });
        }

        return this;
    },

    renderView: function(reload){
        var that = this;
        app.tools.renderTemplate(that, that.formParams, true, function(){
            if(reload == false){
                setTimeout(function(){
                    document.querySelector('.page-mail').classList.add('page-mail-open');
                    that.formParams.constructForms.formMail.idUserClient.name = "Nom du client";
                }, 100);
            }
            document.querySelector('.close-mail').addEventListener("click", function(){that.hideMail()});
            document.querySelector('.send-mail').addEventListener("click", function(e){that.sendMailForm(e)});
        });
    },

    displayMail:function(e){
        app.navView.displayMail(e);
    },

    hideMail:function(){
        var pageMail = document.querySelector('.page-mail');
        if(pageMail != null){
            pageMail.classList.remove('page-mail-open');
            pageMail.classList.add('page-mail-close');
            setTimeout(function(){
                document.getElementById('search-mail').innerHTML = null;
            }, 200);
        }
    },
    sendMailForm: function(e){
      e.preventDefault();
      var that = this;
      var dataFetchForm = app.tools.fetchDataForm('form-pro-mail');
      var dataForm = dataFetchForm['formData'];

      app.tools.sendForm(dataForm, 'mailClient/'+this.token, function(data){
          if(data.state == 'error'){
            that.render({constructForms: that.model.attributes, dataFormMail: dataFetchForm['list'], errorsMail: app.tools.getErrorMessage(data.data)}, true);
            toastr.error('Veuillez vérifier vos informations.', 'Erreur !');
            $('[data-toggle="tooltip"]').tooltip();
          } 
          else{
            that.render({constructForms: that.model.attributes}, true);
            toastr.success('Votre client va recevoir l\'e-mail', 'Mail envoyé !');
          } 
        });
    }

});