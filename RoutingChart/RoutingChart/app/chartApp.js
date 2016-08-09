var chartApp = angular.module('chartApp', ['chart.js']);

chartApp.config(function () {
    console.log('application loaded');
});

chartApp.controller('pqroutecontroller',
    function ($scope, $q) {
        console.log('controller loaded');

        $scope.parameters = {}
        $scope.modelRow = {}
        $scope.modelRows = [];

        $scope.tmpTimespans = [];
        $scope.tmpPrecipitations = [];
        $scope.tmpTemperature = [];
        $scope.tmpQObs = [];
        $scope.tmpQSim = []; // Calculate using HBV

        $scope.addModelRow = function () {
            console.log('addModelRow click');
            console.log($scope.modelRow);

            $scope.modelRows.push($scope.modelRow);
            //
            $scope.tmpTimespans.push($scope.modelRow.timespan);
            $scope.tmpPrecipitations.push($scope.modelRow.precipitation);
            $scope.tmpTemperature.push($scope.modelRow.temperature);
            $scope.tmpQObs.push($scope.modelRow.qObs);
            $scope.tmpQSim.push($scope.modelRow.qSim);
            //

            $scope.modelRow = {};
            console.log($scope.modelRows);
        };


        var calculateQSim = function () {
            var obsArr = [
                '0.08', '0.08', '0.8', '0.09', '3.12', '8.25', '8.59', '6.17', '5.33', '5.33', '3.57', '3.57',
                    '2.57', '2.17', '1.87', '1.66', '1.48', '1.34', '1.24', '1.14', '1.04', '0.97', '0.87', '0.77',
                    '0.67'
            ];
            var arr = [];
            angular.forEach(obsArr,
                function (value) {
                    arr.push(value * 1.5);
                });

            return arr;
        };

        $scope.drawChart = function () {
            console.log('drawChart click');

            //$scope.labels = $scope.tmpTimespans;
            $scope.labels = [
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26
            ];

            $scope.data = [
                //$scope.tmpPrecipitations,
                $scope.tmpPrecipitations = [
                    '0.1', '0', '0.8', '0.9', '20.9', '17.9', '2.7', '1.4', '1.4', '0', '0', '0', '0', '0.6', '0.2',
                    '0.2', '0.2', '0.4', '0', '0', '0', '0', '0', '0', '0'
                ],

                //$scope.tmpTemperature,
                $scope.tmpTemperature = [
                    '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0',
                    '0', '0', '0', '0', '0'
                ],

                 //$scope.tmpQObs
                $scope.tmpQObs = [
                    '0.08', '0.08', '0.8', '0.09', '3.12', '8.25', '8.59', '6.17', '5.33', '5.33', '3.57', '3.57',
                    '2.57', '2.17', '1.87', '1.66', '1.48', '1.34', '1.24', '1.14', '1.04', '0.97', '0.87', '0.77',
                    '0.67'
                ],

                calculateQSim()
                //$q.when(calculateQSim()).then(
                //    function(output) {
                //        $scope.tmpQSim = output;
                //    })
            ];

            $scope.datasetOverride = [{
                label: "Nedbør",
                borderWidth: 1,
                type: 'bar',
                yAxisID: 'y-axis-1'
            },
            {
                label: "Temperatur",
                borderWidth: 1,
                type: 'bar'
            },
            {
                label: "Qobs",
                borderWidth: 3,
                type: 'line',
                yAxisID: 'y-axis-2'
            },
            {
                label: "Qsim",
                borderWidth: 3,
                type: 'line',

            }];

            $scope.options = {
                scales: {
                    yAxes: [{
                          id: 'y-axis-1',
                          type: 'linear',
                          display: true,
                          position: 'right',
                          scaleLabel: {
                              display: true,
                              labelString: 'vf m3/s'
                          }

                      },
                      {
                          id: 'y-axis-2',
                          type: 'linear',
                          display: true,
                          position: 'left',
                          scaleLabel: {
                              display: true,
                              labelString: 'neb mm'
                          }
                      }
                    ]
                }
            };
        };
    });



