var app = {};

var urlApi = 'http://api.mychloe.io/';
var urlStrings = ['assets/json/errorStrings.json', 'assets/json/successStrings.json'];

app.tools = {
  getCookie: function(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
  },
  loadJsonFile: function(url, callback, verb, data){
    if(verb == undefined) var verb = 'GET';
    if(data == undefined) var data = '';
    $.ajax({
      type : verb,
      dataType: "json",
      url: url,
      data: data,
      success: function(data){
        callback.call(this, data);
      }
    });
  },
  loadJson: function(url, callback, verb, data, loader){
      if(verb == undefined) var verb = 'GET';
      if(data == undefined) var data = '';
      if(loader == undefined) var loader = false;
      var request = new XMLHttpRequest();
      request.open(verb, url);
      if(loader == true){
        NProgress.start();
      }
      request.addEventListener('readystatechange', function()
      {
        if (request.readyState==4 && request.status==200){     
          var data = request.responseText;
          callback.call(this, JSON.parse(data));
        }

      }, false);
      if(loader == true) {
          request.addEventListener('progress', function (e) {
              if (e.lengthComputable) {
                  var percent = (e.loaded * 100 / e.total);
                  NProgress.set(percent);
              }
          }, false);
      }
      request.send(data);

  },
  sendForm:function(data, url, callback){
    app.tools.loadJson(urlApi+url, function(data){
      callback.call(this, data);
    }, 'POST', data);
  },
  getErrorMessage:function(slugs){
    var messages = [];
    for(var i in slugs){
      messages[i] = app.tools.errorStrings[slugs[i]];
    }
    return messages;
  },
  getSuccessMessage:function(slugs){
    var messages = [];
    for(var i in slugs){
      messages.push(app.tools.successStrings[slugs[i]]);
    }
    return messages;
  },
  fetchDataFormOld:function(id){
    var elements = document.getElementById(id).elements,
        list = {};
    for(var i = 0, size = elements.length; i<size-1;i++){
      var tag = elements[i].tagName.toLowerCase();
      if (tag == 'input' || tag == 'textarea' || tag == 'select') list[elements[i].name] = elements[i].value;
    }

    return list;
  },
  fetchDataForm:function(id){
    var formData = new FormData(),
      list = {}, data = [];
    var elements = document.getElementById(id).elements;
    for(var i = 0, size = elements.length; i<size;i++){

      var tag = elements[i].tagName.toLowerCase();
      if (tag == 'input' || tag == 'textarea' || tag == 'select'){
        formData.append(elements[i].name, elements[i].value);
        list[elements[i].name] = elements[i].value;
      } 
      if (elements[i].type == 'file'){
        formData.append(elements[i].name, elements[i].files[0]);
      }
    }

    data['list'] = list;
    data['formData'] = formData;

    return data;
  },
  checkAuth:function(callback){
      var token = this.getCookie('tokenChloeApp');
      if(token == ''){
        // appRouter.navigate('', {trigger: true});
        app.homeView = new app.HomeView({el : body});
      }
      else if(app.userProModel == undefined || app.userClientModel == undefined){

        app.tools.checkAccountType(token, function(data){
          if(data.state == 'pro'){
            app.userProModel = new app.UserProModel({'token':token});
            app.userProModel.fetchDataUserPro(token,function(dataUser){
              app.userProModel.set(dataUser);
              if(dataUser.state == 'disconnected'){
                document.cookie="tokenChloeApp=";
                appRouter.navigate('', {trigger: true});
              }
              else{
                callback.call(this);
              }
            });
          }
          else{
            app.userClientModel = new app.UserClientModel({'token':token});
            app.userClientModel.fetchDataUserClient(token,function(dataUser){
              app.userClientModel.set(dataUser);
              if(dataUser.state == 'disconnected'){
                document.cookie="tokenChloeApp=";
                appRouter.navigate('', {trigger: true});
              }
              else{
                callback.call(this);
              }
            });
          }
        });

      }
      else{
        callback.call(this);
      }
  },
  checkAccountType:function(token, callback){
    this.loadJson(urlApi+'checkAccountType/'+token, function(data){
      callback.call(this, data);
    });
  },
  renderTemplate:function(that, data, partial, callback){
    if(partial == false) app.navView = new app.NavView({ el : $('#nav')});
    TemplateManager.get(that.template, function(template){
      var tpl = _.template($(template).html());
      that.$el.html(tpl(data));
        if(callback !== undefined)callback();
    });
  },
  displayClient:function(e){
    e.preventDefault();
    var clientId = $('.'+$(e.currentTarget).data('id'));
    clientId = clientId.selector.replace('.', '');
    app.singleClientProView = new app.SingleClientProView({el : $('#single-client'), idClient:clientId});
    var pageClient = document.getElementById('single-client');
    pageClient.classList.remove('fadeOutDownBig');
    pageClient.classList.add('fadeInUpBig');
  },
  closeView: function(self){
      var searchMailOpen = false;
      if($('.page-search').hasClass('page-search-open')){
        $('.page-search').removeClass('page-search-open');
        searchMailOpen = true;
      }
      if($('.page-mail').hasClass('page-mail-open')){
        $('.page-mail').removeClass('page-mail-open'); 
        searchMailOpen = true;
      }
      if(searchMailOpen == true) setTimeout(function(){document.getElementById('search-mail').innerHTML = null;}, 200);
      self.undelegateEvents();
      self.$el.removeData().unbind(); 
      self.$el.empty();
  }
};

for(var i=0;i<3;i++){
  (function (i) {
    app.tools.loadJsonFile(urlStrings[i], function(data){
      app.tools[data.title] = data;
    })
  })(i);
}


TemplateManager = {
  templates: {},
 
  get: function(id, callback){
    var template = this.templates[id];

 
    if (template) {
      callback(template);
 
    } else {
      var that = this;
      $.get("templates/" + id + ".html", function(template){
        var $tmpl = $(template);
        that.templates[id] = $tmpl;
        callback($tmpl);
      });
 
    }
 
  }
 
};