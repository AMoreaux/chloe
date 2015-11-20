app.AddClientModel = Backbone.Model.extend({
	defaults : {
		formAdd : {
			'infosClient' : {type:'separator', name : 'Informations pratiques'},
			'lastname' : {type: 'text', name: 'Nom', placeholder:'ex : Dupont'},
			'firstname' : {type: 'text', name: 'Prénom', placeholder:'ex : Mathieu'},
			'mail' : {type: 'email', name: 'Adresse e-mail', placeholder:'ex : mathieu.dupont'},
			'tel' : {type: 'text', name: 'Numéro de téléphone', placeholder:'ex : 06.78.67.45.64'},
			'address' : {type: 'text', name: 'Adresse postale', placeholder:'ex : 26 rue des Rosiers'}, 
			'codePostal' : {type: 'text', name: 'Code Postal', placeholder:'ex : 94300'},
			'city' : {type: 'text', name: 'Ville', placeholder:'ex : Vincennes'},
			'infosPool' : {type:'separator', name : 'Informations sur la piscine'},
			'waterVolume' : {type: 'number', name: 'Volume de la piscine', placeholder:'ex : 35m²'},
			'constructDate' : {type: 'text', name: 'Date de construction', placeholder:'ex : 2005'},
			'picture' : {type: 'file', name: 'Photo de la piscine'},
			'specPool' : {type:'separator', name : 'Matériel de la piscine'},
			'skimmerId' : {type: 'select', name: 'Skimmer', placeholder:'Sélectionnez le modèle de skimmer'},
			'pumpId' : {type: 'select', name: 'Pompe', placeholder:'Sélectionnez le modèle de pompe'},
			'filterId' : {type: 'select', name: 'Filtre', placeholder:'Sélectionnez le modèle de filtre'}
		}
	},
	sendForm:function(data, url, token, callback){
		app.tools.loadJson(urlApi+url+'/'+token, function(data){
			callback.call(this, data);
		}, 'POST', data);
	},
	fetchDataCreation:function(token, callback){
		app.tools.loadJson(urlApi+'dataCreation/'+token, function(data){
			callback.call(this, data);
		});
	}
});