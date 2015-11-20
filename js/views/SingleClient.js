app.SingleClientView = Backbone.View.extend({
    initialize: function(){
        app.tools.closeView(this);
        this.MapBoxModel = new app.MapBoxModel;
        this.ChartModel = new app.ChartModel;
        this.time = '30';
        this.type = 'chlore';
    },

    flip: function (e) {
        var jThis = $('.'+$(e.currentTarget).data('target'));
        var flipper = jThis.children(".flipper");
        var widthFront = flipper.children(".front").width();
        var widthBack = flipper.children(".back").width();
        var width = jThis.hasClass("flip") ? widthFront : widthBack;

        flipper.width(width);

        jThis.toggleClass("flip");

        return this;
    },

    createGraphByTime: function(e, ChartView){
        var time = $(e.currentTarget).data("id");
        this.time = time;
        $('.filtre-selected').toggleClass( "filtre-selected", "remove" );
        $('#'+time).addClass('filtre-selected');
        return ChartView.render(this.type, this.time);
    },

    createGraphByType: function(e, ChartView){
        var type = $(e.currentTarget).data("type");
        this.type = type;
        $('.graphType').removeClass('card-selected');
        $('.graphType[data-type="'+type+'"]').addClass('card-selected');
        return ChartView.render(this.type, this.time);
    },
    getWeather: function(lng, lat){
        var that = this;
        this.MapBoxModel.getWeather( lng, lat, function(data){
            var json = that.ChartModel.attributes.weather;
            var temp = Math.round(data.list[0].main.temp);
            var icon = data.list[0].weather[0].icon;
            for (var key in json) {
                if (json.hasOwnProperty(key) && key == icon){
                    $('#iconWeather').addClass(json[key].class)
                }
            }
            $('#weather').html(temp+'°');
        });
    }

});

