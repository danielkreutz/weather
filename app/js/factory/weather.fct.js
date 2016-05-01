'use strict';

angular.module('app.WeatherFactory', ['ngStorage'])
       .factory('WeatherFct', function($http) { //Não se esqueça de fazer a injeção das dependências aqui
   
    var apiKey     = 'f3232590d6f5565d33415e57c87d4765';
    var apiUrl     = 'http://api.openweathermap.org/data/2.5/forecast/daily/';      
    var state      = sessionStorage.getItem("app_weather_state_favorite") ? sessionStorage.getItem("app_weather_state_favorite") : '24'; // Estado de Santa Catarina como Padrão
    var city       = sessionStorage.getItem("app_weather_city_favorite")  ? sessionStorage.getItem("app_weather_city_favorite") : 'Blumenau'; // Cidade padrão
   
    // Temperatura minima no final de semana (sabado e domingo) para recomenda praia
    var temp_praia        = 25;
     
    var service = {
        consultaPrevisaoSemana: _consultaPrevisaoSemana,
        setCidadeFavorita: _setCidadeFavorita,
        getState: _getState,
        getCity: _getCity   
        
    };
    return service;
    
    
    function _getState(){
        return state;
    }
    
    function _getCity(){
       return city; 
    }    

    function _consultaPrevisaoSemana($scope, cidade) {                             
        $http.jsonp(apiUrl, { params : {
            appid : apiKey,
            q : (cidade) ? cidade : _getCity(),
            units: 'metric',
            cnt: 7,
            lang: 'pt',
            country : 'BR',
            mode: 'json',
            callback: 'JSON_CALLBACK'
        }}).
        success(function(data, status, headers, config) {            
            $scope.data = data;
            temperaturaSemana($scope, data);
        }).
        error(function(data, status, headers, config) {
           var str = 'Não foi possível consultar a previsão para a cidade '+ cidade;            
           console.log(str);           
           $scope.message = str;
        });
    };
    
    function _setCidadeFavorita($scope, city){
        sessionStorage.setItem("app_weather_state_favorite", $scope.estado);
        sessionStorage.setItem("app_weather_city_favorite", city);
        alert('Cidade de '+city+' marcada como favorita!');
    }
    
    // if(myDate.getDay() == 6 || myDate.getDay() == 0) alert('Weekend!');
        
    // Temperatura máxima e a mínima da semana
    // A maior temperatura dos próximos dias e a menor temperatura dos próximos dias (deve mostrar a temperatura e o dia)
    function temperaturaSemana($scope, data){
        var temp0     = 0;
        var temp6     = 0;
        var maxTemp   = 0; 
        var minTemp   = 100;   
        var objDayMax = null; 
        var objDayMin = null;   
        var tempDays  = [];
                 
                 
        angular.forEach(data.list, function (obj, key) {
            var day = new Date(obj.dt * 1000).getDay();           
                       
            if(day === 0){ temp0 = obj.temp.max; }
            if(day === 6){ temp6 = obj.temp.max; }
            
            if(obj.temp.max > maxTemp){
               maxTemp   = obj.temp.max; 
               objDayMax = obj;
            }
            if(obj.temp.min < minTemp){
               minTemp   = obj.temp.min; 
               objDayMin = obj;
            }            
                        
            // Grafic Morris.js
            var graphMorris  = {};
            graphMorris.key  = key;
            graphMorris.day  = moment(new Date(obj.dt * 1000)).format('DD');
            graphMorris.min  = ""+Math.ceil(obj.temp.min)+"";
            graphMorris.max  = Math.ceil(obj.temp.max);
            tempDays.push(graphMorris);
        });
        
        $scope.temp_dias_semana = angular.toJson(tempDays);
        
        console.log($scope.temp_dias_semana );
        
        $scope.objTempMaxSemana = objDayMax;
        $scope.objTempMinSemana = objDayMin;
   
        praiaFinalSemana($scope, temp0, temp6);
    }
    
    // Recomendação de Praia
    // Caso o tempo esteja bom (temperatura acima de 25 graus) no final de semana, indicar positivamente a ida para Praia, caso contrário negativar a recomendação
    function praiaFinalSemana($scope, temp0, temp6){
        $scope.praiaFinalSemana = (temp0 >= temp_praia && temp6 >= temp_praia) ? true : false;
        $scope.temp_praia       = (temp0 > temp6) ? temp0 : temp6;
    }

});