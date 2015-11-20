app.NavView = Backbone.View.extend({
    template: 'nav',
    initialize: function(){
      app.tools.closeView(this);
      this.render();
      $('.close-mail').click(function(event) {
          var pageMail = document.querySelector('.page-mail');
          pageMail.classList.remove('page-mail-open');
        });
    },
    events: {
        'click .button-search' : 'displaySearch',
        'click .display-drop-down' : 'toggleDisplay',
        'click .button-mail' : 'displayMail',
        'mouseleave .menu-user-drop-down' : 'hideDropDown'
    },
    render: function(){
        app.tools.renderTemplate(this, {urlLogo: urlApi+'userpro/load/logo/'+app.userProModel.attributes.token, dataUser: app.userProModel.toJSON()}, true);
        return this;
    },
    toggleDisplay: function(e){
      e.preventDefault();
      var page = $('.'+$(e.currentTarget).data('target'));
      page.css('display', page.css('display') === 'block' ? 'none' : 'block');
    },
    hideDropDown:function(){
      $('.menu-user-drop-down').css('display', 'none');
    },
    displaySearch:function(e){
      e.preventDefault();
      var pageSearch = document.querySelector('.page-search');
      if(pageSearch != null){
        pageSearch.classList.remove('page-search-open');
        setTimeout(function(){
          document.getElementById('search-mail').innerHTML = null;
        }, 200);
      }
      else{
        app.searchView = new app.SearchView({el : $('#search-mail')});
      }
    },
    displayMail:function(e, client){
        if(client == undefined)client = "";
        if (e != false) e.preventDefault();
        if(document.querySelector('.page-search') != null) document.querySelector('.page-search').classList.remove('page-search-open');
          app.mailView = new app.MailView({el : $('#search-mail'), client:client});
    }
});