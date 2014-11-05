'use strict';

describe('Controller: LeftmenuCtrl', function () {

  // load the controller's module
  beforeEach(module('teamAnalyzerApp'));

  var LeftmenuCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LeftmenuCtrl = $controller('LeftmenuCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
