app.SettingsModel = Backbone.Model.extend({
	defaults : {
		formPassword : {
			'password' : {type: 'password', name: 'Mot de passe', placeholder: 'Votre mot de passe'},
			'retype_password' : {type: 'password', name: 'Confirmation mot de passe', name: 'Confirmez votre mot de passe'}
		},
		formMail : {
			'mail' : {type: 'email', name: 'Mon email', placeholder: 'Votre nouvel e-mail'}
		}
	}
});