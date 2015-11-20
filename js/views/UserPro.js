app.UserProView = Backbone.View.extend({
    template: 'userPro',
    initialize: function(options){
      app.tools.closeView(this);
      var that = this;
      that.data = "";
      that.number = "";
      that.type = "degreeRisk";
      app.tools.checkAuth(function(){
        that.model = app.userProModel;
        that.render();
      });
      
    },
    events: {
        'click .line': 'displayClient',
        'click .eyes' : 'checkPriorities',
        'click .filtre' : 'tri'

    },

    render: function(){
      var that = this;
      this.model.fetchPriorityList(this.model.attributes.token,function(dataPriorities){
          var size = 0, key;
          for (key in dataPriorities) {
              if (dataPriorities.hasOwnProperty(key)) size++;
          }
          that.size = size;
          that.data = dataPriorities;
          app.tools.renderTemplate(that, {dataUser: that.model.toJSON(), dataPriorities: dataPriorities, size: size}, false);
          setTimeout(function(){that.tri()}, 100);
      });
      return this;
    },

    displayClient: function(e){
      var clientId =  $(e.currentTarget).data("id");
      app.singleClientProView = new app.SingleClientProView({el : $('#single-client'), idClient:clientId,  dataControls:this.data});
      var pageClient = document.getElementById('single-client');
      pageClient.classList.remove('fadeOutDownBig');
      pageClient.classList.add('fadeInUpBig');
    },

    checkPriorities: function(e){
        var client = $(e.currentTarget).data("eyes");
        var item = document.getElementById(client);
        item.classList.remove('ion-ios-eye');
        item.classList.add('ion-ios-eye-outline');
        var token = app.userProModel.attributes.token;
        this.model.checked(token, client);
    },

    tri: function (e) {
        var that = this;
        if(e != undefined){
            that.type = $(e.currentTarget).data("type");
            $('.filtre').removeClass('filtre-selected');
            document.getElementById(that.type).classList.add('filtre-selected');
        }
        var array = [];
        for(var item in that.data){
            array.push(that.data[item]);
        }
        array.sort(function(a, b){
            return b[that.type] - a[that.type];
        });
        $('.table-priorities tbody').empty();
        that.add(array);

    },

    add:function(array){
        for(var i =0; i < array.length; i++){
            this.risqueAlgue(array[i], function(data){
                var line =  $('.tr-table-priorities tr').clone();
                line.appendTo('.table-priorities tbody');
                line.children('.case').attr('data-id', array[i].userclient_id).html(i+1);
                line.children('.caseName').attr('data-id', array[i].userclient_id).html(array[i].userclient.firstname+' '+array[i].userclient.lastname);
                line.children('.volume').attr('data-id', array[i].userclient_id).html(array[i].userclient.ownSwimmingpool[0].water_volume+' m³');
                line.children('.city').attr('data-id', array[i].userclient_id).html(array[i].city);
                line.children('.icon').attr('data-id', array[i].userclient_id);
                line.children('.icon').children('.ch').attr('data-id', array[i].userclient_id).addClass(array[i].colorPictoChlore+'-indicator indicator');
                line.children('.icon').children('.al').attr('data-id', array[i].userclient_id).addClass(array[i].risqueAlgue+'-indicator indicator');
                line.children('.icon').children('.ph').attr('data-id', array[i].userclient_id).addClass(array[i].colorPictoPh+'-indicator indicator');
                if(array[i].userclient.check_problems != 1){
                    line.children('.eyes').attr('data-eyes', array[i].userclient_id).attr('id', array[i].userclient_id).addClass('ion-ios-eye');
                }else{
                    line.children('.eyes').attr('data-eyes', array[i].userclient_id).addClass('ion-ios-eye-outline');
                }
            });
        }
    },

    risqueAlgue:function(item, callback){
        if(item.risqueAlgue == "red"){
            item['algue'] = 2;
        }else if(item.risqueAlgue == "yellow"){
            item['algue'] = 1;
        }else{
            item['algue'] = 0;
        }
        callback.call(this, item);
    }
});

