app.ValidationModel = Backbone.Model.extend({
	sendValidationRequest:function(token, mail, callback){
    	app.tools.loadJson(urlApi+'validation/'+token+'/'+mail, function(data){
			callback.call(this, data);
		});
	}
});