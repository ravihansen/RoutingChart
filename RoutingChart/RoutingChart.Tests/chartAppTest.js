/// <reference path="../routingchart/scripts/angular.js" />
/// <reference path="../routingchart/scripts/angular-mocks.js" />
/// <reference path="app/chartApp.js" />


describe('When using chartApp ', function () {
	//initialize Angular
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
});