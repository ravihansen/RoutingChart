/// <reference path="C:\Workspace2016\RoutingChart\RoutingChart\RoutingChart\Scripts/angular.js" />
/// <reference path="C:\Workspace2016\RoutingChart\RoutingChart\RoutingChart\Scripts/angular-mocks.js" />
/// <reference path="../node_modules/chart.js/dist/Chart.js" />
/// <reference path="../node_modules/angular-chart.js/dist/angular-chart.js" />
/// <reference path="C:\Workspace2016\RoutingChart\RoutingChart\RoutingChart\app/chartApp.js" />

describe('When using chartApp ', function () {

	//initialize application
    beforeEach(module('chartApp'));

	//parse out the scope for use in our unit tests.
	var scope;
	beforeEach(inject(function ($controller, $rootScope) {
		scope = $rootScope.$new();
		var ctrl = $controller('pqroutecontroller', { $scope: scope });
	}));

	it('initial value is 5', function () {
		expect(scope.value).toBe(5);
	});

	var obsValues = [
               '0.08'
               //, '0.08', '0.8', '0.09', '3.12', '8.25', '8.59', '6.17', '5.33', '5.33', '3.57', '3.57',
               //    '2.57', '2.17', '1.87', '1.66', '1.48', '1.34', '1.24', '1.14', '1.04', '0.97', '0.87', '0.77',
               //    '0.67'
	];

    var simValues = [
        '0.080'
    ];

    it('to cacluate HBV values',
        function() {
            scope.calculateQSim(obsValues);
            expect(scope.tmpQSim).toBe(simValues);
        });
});