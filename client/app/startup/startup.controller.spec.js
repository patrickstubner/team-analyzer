'use strict';

describe('Controller: StartupCtrl', function () {

  // load the controller's module
  beforeEach(module('teamAnalyzerApp'));

  var StartupCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StartupCtrl = $controller('StartupCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
