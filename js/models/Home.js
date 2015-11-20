app.HomeModel = Backbone.Model.extend({
	defaults : {
		formRegister : {
			'mail' : {type: 'email', name: 'Adresse e-mail'},
			'name' : {type: 'text', name: 'Nom de l\'entreprise ou du gérant'},
			'password' : {type: 'password', name: 'Mot de passe'},
			'retype_password' : {type: 'password', name: 'Retapez votre mot de passe'}, 
			'address' : {type: 'text', name: 'Adresse postale'}, 
			'city' : {type: 'text', name: 'Ville'},
			'codePostal' : {type: 'text', name: 'Code Postal'},
			'tel' : {type: 'text', name: 'Numéro de téléphone'},
			'siren' : {type: 'text', name: 'Numéro Siren'},
			'logo' : {type: 'file', name: 'Logo de l\'entreprise'}
		},
		formAuth : {
			'mail' : {type: 'email', name: 'Adresse e-mail'},
			'password' : {type: 'password', name: 'Mot de passe'}
		}
	}
});