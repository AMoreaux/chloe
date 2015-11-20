app.ChartView = Backbone.View.extend({
    template: 'singleclient',
    initialize: function(options){
        app.tools.closeView(this);
        this.first = true;
        this.options = options;
        this.model = new app.ChartModel;
    },

    render: function(type, time){
        var that = this;
        var token = app.tools.getCookie('tokenChloeApp');
        if(that.first == true){
            this.model.getData(token, time, that.options.id.idClient, function(data){
                that.choiceTypeGraph(data, type);
                that.first = false;
            });
        }else{
            this.model.getDataGraph(token, time, that.options.id.idClient, function(data){
                that.choiceTypeGraph(data, type);
            });
        }
        return this;
    },

    choiceTypeGraph: function(data, type){
        var that = this;
        var dataClient = data.data;
        if(document.getElementById('myChart')!= undefined)document.getElementById('myChart').remove();
        var canvas = document.createElement('canvas');
        canvas.width  = 960;
        canvas.height = 411;
        canvas.id = 'myChart';
        document.getElementById('blocChart').appendChild(canvas);
        var ctx = $('#myChart').get(0).getContext("2d");
        that.chart = new Chart(ctx);
        if(type == 'ph')that.createGraphPh(dataClient, function(response){
            $('#nameData').html('PH de l\'eau');
            return that.chart.Line(response['data'], response['options']);
        });
        if(type == 'chlore')that.createGraphChlore(dataClient, function(response){
            $('#nameData').html('Niveau de chlore');
            return that.chart.Line(response['data'], response['options']);
        });
        if(type == 'temperature')that.createGraphTemperature(dataClient, function(response){
            $('#nameData').html('Température de l\'eau');
            return that.chart.Line(response['data'], response['options']);
        });
    },

    createGraphPh:function(dataClient, callback){
        var type = dataClient.ownPh;
        this.date(dataClient, type, function(req){
            var data = {
                labels: req['dates'],
                datasets: [
                    {
                        label: "ph",
                        fillColor: "rgba(229,105,92,0.1)",
                        strokeColor: "rgba(229,105,92,1)",
                        pointColor: "#fff",
                        pointStrokeColor: "rgba(229,105,92,1)",
                        pointHighlightFill: "rgba(229,105,92,1)",
                        pointHighlightStroke: "rgba(229,105,92,1)",
                        data: req['values']
                    }
                ]
            };
            var options = {
                responsive: true,
                scaleOverride: true,
                scaleShowLabels: true,
                scaleStepWidth: 0.2,
                scaleSteps: 10,
                scaleStartValue: 6,
                scaleFontColor: "#AEB6C1",
                scaleFontFamily: "'Source Sans Pro'",
                scaleFontSize: 14,
                animationEasing:"linear",
                animationSteps: 20,
                animation: false,
                scaleFontStyle: "normal",
                pointDotRadius : 6,
                pointDotStrokeWidth : 2,
                pointHitDetectionRadius : 3,
                bezierCurve : false,
                scaleLabel: "<%=value%>",
                showTooltips: true,
                tooltipTemplate: "<%= value %>"

            };
            var response = [];
            response['data'] = data;
            response['options'] = options;
            callback.call(this,response);

        })
    },

    createGraphTemperature: function(dataClient, callback){
        var type = dataClient.ownTemperature;
        this.date(dataClient, type, function(req) {
            var data = {
                labels: req['dates'],
                datasets: [
                    {
                        label: "temperature",
                        fillColor: "rgba(229,105,92,0.1)",
                        strokeColor: "rgba(229,105,92,1)",
                        pointColor: "#fff",
                        pointStrokeColor: "rgba(229,105,92,1)",
                        pointHighlightFill: "rgba(229,105,92,1)",
                        pointHighlightStroke: "rgba(229,105,92,1)",
                        data: req['values']
                    }
                ]
            };
            var options = {
                responsive: true,
                scaleOverride: true,
                scaleShowLabels: true,
                scaleFontColor: "#AEB6C1",
                scaleFontFamily: "'Source Sans Pro'",
                scaleFontSize: 14,
                scaleFontStyle: "normal",
                scaleStepWidth: 5,
                scaleSteps: 7,
                animation: false,
                animationEasing:"linear",
                animationSteps: 20,
                scaleStartValue: 0,
                pointHitDetectionRadius : 3,
                pointDotRadius : 6,
                pointDotStrokeWidth : 3,
                bezierCurve : false,
                scaleLabel: "<%=value%>C°",
                showTooltips: true,
                tooltipTemplate: "<%= value %>C°"
            };
            var response = [];
            response['data'] = data;
            response['options'] = options;
            callback.call(this,response);
        })
    },

    createGraphChlore:function(dataClient, callback){
        var type = dataClient.ownChlore;
        this.date(dataClient, type, function(req) {
            var data = {
                labels: req['dates'],
                datasets: [
                    {
                        label: 'chlore',
                        fillColor: "rgba(229,105,92,0.1)",
                        strokeColor: "rgba(229,105,92,1)",
                        pointColor: "#fff",
                        pointStrokeColor: "rgba(229,105,92,1)",
                        pointHighlightFill: "rgba(229,105,92,1)",
                        pointHighlightStroke: "rgba(229,105,92,1)",
                        data: req['values']
                    }]
            };
            var options = {
                responsive: true,
                scaleOverride: true,
                scaleShowLabels: true,
                scaleStepWidth: 0.2,
                scaleSteps: 10,
                scaleStartValue: 1,
                pointDotRadius : 6,
                scaleFontColor: "#AEB6C1",
                scaleFontFamily: "'Source Sans Pro'",
                scaleFontSize: 14,
                scaleFontStyle: "normal",
                pointDotStrokeWidth : 2,
                animationEasing:"linear",
                animationSteps: 20,
                animation: false,
                pointHitDetectionRadius : 3,
                bezierCurve: false,
                scaleLabel: "<%=value%> mg/l",
                showTooltips: true,
                tooltipTemplate: "<%= value %> mg/l"
            };
            var response = [];
            response['data'] = data;
            response['options'] = options;
            callback.call(this, response);

        })
    },




    date:function(dataClient, type, callback){
        var dates = [];
        var values = [];
        if(type.length > 43){
            this.sanitizeYear(dataClient,type, function(req){
                callback.call(this,req);
            });
        }else{
            for(var i = 0; i < type.length; i++){
                var dateItem = new Date(type[i].date*1000);
                var dateMonth = dateItem.getMonth()+1;
                if(dateMonth.toString().length == 1)dateMonth = "0"+dateMonth;
                var dateDay = dateItem.getDate();
                if(dateDay.toString().length == 1)dateDay = "0"+dateDay;
                var date = dateDay+'/'+dateMonth;
                dates.push(date);
                values.push(type[i].value);
            }
            var req = [];
            req['dates'] = dates;
            req['values'] = values;
            callback.call(this,req);
        }
    },

    sanitizeYear: function(dataClient,type, callback){
        var list = [];
        var dates = [];
        var values = [];
        var req = [];
        var json = this.model.attributes.month;
        for(var i = 0; i < type.length; i++) {
            var dateItem = new Date(type[i].date * 1000);
            var item = {
                value :type[i].value,
                month: dateItem.getMonth()+1
            };
            list.push(item);
        }
        var listMonth = [];
        for(var p = 0; p < list.length; p++){
            listMonth.push(list[p].month);
        }
        var listMonthUnique = listMonth.filter(function(itm,i,listMonth){
            return i==listMonth.indexOf(itm);
        });
        var t = 0;
        for(var n = 0; n < listMonthUnique.length-1; n++){
            var monthToTri = listMonthUnique[t];
            var itemForTri = [];
            for(var j = 0; j < list.length; j++){
                if(monthToTri == list[j].month){
                    itemForTri.push(list[j]);
                }
            }
            var valueMoy = 0;
            for(var k = 0; k < itemForTri.length; k++){
                valueMoy += parseInt(itemForTri[k].value);
            }
            valueMoy = valueMoy/itemForTri.length;
            for (var key in json) {
                if (key == monthToTri){
                    dates.push(json[key]);
                }
            }
            values.push(Math.round(valueMoy*100)/100);
            t++;
        }
        req['dates'] = dates;
        req['values'] = values;
        callback.call(this,req);
    }
});
