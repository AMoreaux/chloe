app.UserClientModel = Backbone.Model.extend({
	set:function(obj){
		for(var i in obj){
			this.attributes[i] = obj[i];
		}
	},
    fetchDataUserClient:function(token, time, id, callback){
    	app.tools.loadJson(urlApi+'userclient/'+id+'/'+time+'/'+token, function(data){
			callback.call(this, data);
		});
	},
	logout:function(token, callback){
		app.tools.loadJson(urlApi+'logout/'+token, function(data){
			callback.call(this, data);
		});
	}
});