'use strict';

function WeatherCtrl($scope, $http, WeatherFct, EstadosBrasilFct, CountryCode) {
       
    $scope.state = WeatherFct.getState();
    $scope.city  = WeatherFct.getCity();
    
    EstadosBrasilFct.getEstadosBrasil($scope);
    
    // Carrega previsão da cidade padrão
    WeatherFct.consultaPrevisaoSemana($scope, null);
        
        
    $scope.getIcon = function (nameIcon) {
        var apiUrlIcon = 'http://openweathermap.org/img/w/'; 
        return (nameIcon !== '' && nameIcon !== undefined ? apiUrlIcon + nameIcon + '.png' : '');
    };

    $scope.parseDate = function (time) {   
        return moment(new Date(time * 1000)).format('dddd, DD MMMM');
    }

    $scope.getWeather = function (city) {
        if (city === '' || city === undefined) {
            $scope.message = 'Informe a cidade!';
        } else {
             WeatherFct.consultaPrevisaoSemana($scope, city);        
        }
    }

    $scope.getCountryName = function (country) {
        return CountryCode.getCountryName(country);
    }
        
    $scope.selectEstate = function(id){
                    
            $http({method: 'GET', url: 'app/lib/CidadesBrasil.json'}).success(function (arrayCidades) {
                var arrCidades = [];
                
                angular.forEach(arrayCidades, function (value, key) {
                    if(value.Estado === $scope.estado){
                       arrCidades.push(value);   
                    }
                });
                
                
            }).error(function (err) {
                console.log(err);
            });
    }
    
    $scope.pesquisaCidade = function(search){
        if(!$scope.estado){
            $scope.message = 'Selecione o estado!'; 
            
        }else if(search !== ""){
            $scope.message    = '';
            $scope.completing = true;
            
        }
    }

    $scope.cidadeFavorita = function(city){
       WeatherFct.setCidadeFavorita($scope, city);       
    }
}


// ------------------------------------------------------------
angular.module('app.controllers', [])
         .controller('WeatherCtrl', WeatherCtrl);