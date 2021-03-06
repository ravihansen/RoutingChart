﻿var chartApp = angular.module('chartApp', ['chart.js']);

chartApp.config(function () {
    console.log('application loaded');
});

chartApp.filter('logarithmic', function ($window) {
    return function (input) {
        return $window.Math.log(input);
    };
});

chartApp.filter('power', function ($window) {
    return function (base, exponenet) {
        return $window.Math.pow(base, exponenet);
    };
});

chartApp.controller('pqroutecontroller',
    function ($scope, $q, $window) {
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
            //$scope.tmpQObs.push($scope.modelRow.qObs);
            //$scope.tmpQSim.push($scope.modelRow.qSim);
            //

            $scope.modelRow = {};
            console.log($scope.modelRows);
        };

        $scope.value = 5;

        //$scope.K1 = '';
        //$scope.K2 = '';
        //$scope.T = '';

        //$scope.Q = '';
        //$scope.Q1 = '';
        //$scope.Q2 = '';


        $scope.modelParam = {};
        $scope.calculateModel = function () {
            var parameters = $scope.parameters;


            let hl = parameters.relief;
            let ase = parameters.sjoprosent;
            let qn = parameters.normal_avlop;

            calculateK1(hl, ase).then(function (_k1) {
                $scope.modelParam.k1 = _k1;

                calcualteK2(_k1, qn).then(function (_k2) {
                    $scope.modelParam.k2 = _k2;

                    calcualateT(_k1, qn).then(function (_t) {
                        $scope.modelParam.t = _t;

                        //calculateQSim(parameters, _k1, _k2, _t);
                        calculateQSim(parameters, 0.094, 0.025, 14.4);
                    });
                });
            });
        };

        // K1 = 0.0135 + 0.00268 * HL - 0.01665 * ln(Ase)
        function calculateK1(hl, ase) {
            var k1 = 0.0135 + 0.00268 * hl - 0.01665 * $window.Math.log(ase);
            console.log('k1: ' + k1);

            return $q.when(k1);
        };

        // K2 = 0.0009 + 0.21 * K1 - 0.00021 * Hl
        function calcualteK2(k1, qn) {
            var k2 = 0.009 + 0.21 * k1 - 0.00021 * qn;
            console.log('k2: ' + k2);

            return $q.when(k2);

        };

        // T = -9.0 + 4.4 * K1-0.6 + 0.28 * QN
        function calcualateT(k1, qn) {
            let logAse = $window.Math.pow(k1, -0.6);
            var t = -9.0 + 4.4 * logAse + 0.28 * qn;
            console.log('t: ' + t);

            return $q.when(t);
        };



        function calculateQSim(parameters, k1, k2, t) {
            //let sm = parameters.soil_water_moisture;
            //let fc = parameters.field_capacity;
            //let beta = parameters.beta;
            let a_m2 = 50000000;

            let sm = 100;
            let fc = 100;
            let beta = 2;
            let perc = 0.0025;
            let uz1 = 100;
            let pArr = [2.8, 2.8, 2.8, 2.8, 2.8, 2.8, 3.9, 3.9];
            let klz = 0.00042;

            let smArr = [];
            let duzArr = [];
            let uzArr = [];
            let lzArr = [];
            let q1Arr = [];
            let q2Arr = [];
            let qSimArr = [];

            smArr[0] = 100;
            duzArr[0] = 2.8;
            uzArr[0] = 3.15;
            lzArr[0] = 6;
            q1Arr[0] = 0.5;
            q2Arr[0] = 0.5;

            for (var i = 1; i < pArr.length; i++) {
                smArr[i] = sm + pArr[i - 1] - duzArr[i - 1];

                duzArr[i] = $window.Math.pow((smArr[i] / fc), beta) * pArr[i];
                uzArr[i] = uzArr[i - 1] + duzArr[i] - perc - q1Arr[i - 1];

                if (uzArr[i] <= t) { // assumes t is threshold in mm (uz1)
                    q1Arr[i] = k2 * uzArr[i];
                } else {
                    q1Arr[i] = k1 * (uzArr[i] - t) + k2 * t;
                }


                lzArr[i] = lzArr[i - 1] + perc - q2Arr[i - 1];
                q2Arr[i] = klz * lzArr[i];

                qSimArr[i] = q1Arr[i] + q2Arr[i];
                var qsim = (a_m2 * (qSimArr[i] / 1000)) / 3600;
                console.log('Qsim: ' + qsim);
            }
        };


        // duz = [SM/FC]b * P
        function caculateDuz(sm, fc, beta, p) {
            var duz = $window.Math.pow((sm / fc), beta) * p;
            console.log('duz: ' + duz);

            return $q.when(duz);
        };

        // sm1 = sm0 + p - duz
        function calculateSm(sm0, p, duz) {
            var sm1 = sm0 + p - duz;
            console.log('sm: ' + sm1);

            return $q.when(sm1);
        };

        // uz1 = uz0 + duz - perc - q1
        function calculateUz(uz0, duz, perc, q1) {
            var uz = uz0 + duz - perc - q1;
            console.log('uz: ' + uz);

            return $q.when(uz);
        }





        $scope.drawChart = function (qObs, qSim) {
            $scope.tmpPrecipitations = qObs;
            //$scope.tmpPrecipitations = [
            //        '0.1', '0', '0.8', '0.9', '20.9', '17.9', '2.7', '1.4', '1.4', '0', '0', '0', '0', '0.6', '0.2',
            //        '0.2', '0.2', '0.4', '0', '0', '0', '0', '0', '0', '0'
            //],
            //  $scope.tmpTemperature = [
            //        '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0',
            //        '0', '0', '0', '0', '0'
            //  ],
            //    $scope.tmpQObs = [
            //        '0.08', '0.08', '0.8', '0.09', '3.12', '8.25', '8.59', '6.17', '5.33', '5.33', '3.57', '3.57',
            //        '2.57', '2.17', '1.87', '1.66', '1.48', '1.34', '1.24', '1.14', '1.04', '0.97', '0.87', '0.77',
            //        '0.67'
            //    ],
            //$scope.tmpTimespans = [
            //    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26
            //];

            $scope.labels = $scope.tmpTimespans;
            $scope.data = [
                $scope.tmpPrecipitations,
                $scope.tmpTemperature,
                $scope.tmpQObs,
                $scope.tmpQSim
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
                            labelString: 'neb mm'
                        }

                    },
                      {
                          id: 'y-axis-2',
                          type: 'linear',
                          display: true,
                          position: 'left',
                          scaleLabel: {
                              display: true,
                              labelString: 'vf m3/s'
                          }
                      }
                    ]
                }
            };
        };
    });



