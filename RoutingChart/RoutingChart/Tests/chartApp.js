/// <reference path="C:\Workspace2016\RoutingChart\RoutingChart\RoutingChart\Scripts/angular.js" />
/// <reference path="C:\Workspace2016\RoutingChart\RoutingChart\RoutingChart\Scripts/angular-mocks.js" />
/// <reference path="C:\Workspace2016\RoutingChart\RoutingChart\RoutingChart\node_modules\chart.js\dist/Chart.js" />
/// <reference path="C:\Workspace2016\RoutingChart\RoutingChart\RoutingChart\app/chartApp.js" />

describe('When using pqroutecontroller', function () {

    //initialize Angular
    beforeEach(module('chartApp'));

    //parse out the scope for use in our unit tests.
    var scope;
    beforeEach( inject( function ( $controller, $rootScope ) {
        scope = $rootScope.$new();
        var ctrl = $controller('pqroutecontroller', { $scope: scope });

        console.log(scope);
    } ) );

    it( 'initial value is 5', function () {
        expect( scope.value ).toBe( 5 );
    } );
});