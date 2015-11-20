app.MailModel = Backbone.Model.extend({
	defaults : {
		formMail : {
			'idUserClient' : {type: 'select', name: 'Nom du client'},
			'subject' : {type: 'text', name: 'Object du message'},
			'message' : {type: 'textarea', name: 'Contenu du message'}
		}
	},
	getClientsData:function(token, callback){
        app.tools.loadJson(urlApi+'userpro/clients/'+token, function (clients)  {
            callback.call(this, clients);
        });
    }
});