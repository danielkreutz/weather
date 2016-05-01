'use strict';

angular.module('app.EstadosBrasilFactory', [])
       .factory('EstadosBrasilFct', function($http) { //Não se esqueça de fazer a injeção das dependências aqui
   
    var service = {
        getEstadosBrasil: _getEstadosBrasil
        
    };
    return service;


    function _getEstadosBrasil($scope) {                             
        var estados = [];
        
        $http({method: 'GET', url: 'app/lib/EstadosBrasil.json'}).success(function (arrayEstados) {            
            angular.forEach(arrayEstados, function (value, key) {
                estados.push(value);
            });
        }).error(function (err) {
            console.log(err);
        });
        
        $scope.estados = estados;
    };

});