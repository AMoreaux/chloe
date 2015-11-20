app.UserProModel = Backbone.Model.extend({
	set:function(obj){
		for(var i in obj){
			this.attributes[i] = obj[i];
		}
	},
    fetchDataUserPro:function(token, callback){
    	app.tools.loadJson(urlApi+'userpro/'+token, function(data){
			callback.call(this, data);
		});
	},
	logout:function(token, callback){
		app.tools.loadJson(urlApi+'logout/'+token, function(data){
			callback.call(this, data);
		});
	},
	fetchPriorityList:function(token, callback){
        app.tools.loadJson(urlApi+'controls/'+token, function(data){
            callback.call(this, data);
        }, 'GET', '', true);
    },
    fetchAlert:function(token, callback){
        app.tools.loadJson(urlApi+'controls/'+token, function(data){
            callback.call(this, data);
        });
    },
    checked:function(token, id){
        app.tools.loadJson(urlApi+'checkview/'+id+'/'+token, function(data){

        });
    }
});