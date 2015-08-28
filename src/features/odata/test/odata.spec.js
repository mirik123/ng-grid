/* global _ */
(function () {
  'use strict';
  describe('ui.grid.odata uiGridOdataService', function () {
    var uiGridOdataService;
    var uiGridExpandableService;
    var grid;
    var gridClassFactory;
    var uiGridConstants;
    var $rootScope;
    var $scope;
    var isExpanded;

    beforeEach(module('ui.grid.expandable'));
    beforeEach(module('ui.grid.odata'));

    beforeEach(inject(function (_uiGridExpandableService_, _uiGridOdataService_, _gridClassFactory_, _uiGridConstants_,
                                _$rootScope_, _gridUtil_, $templateCache) {

      uiGridExpandableService = _uiGridExpandableService_;
      uiGridOdataService = _uiGridOdataService_;
      gridClassFactory = _gridClassFactory_;
      uiGridConstants = _uiGridConstants_;
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      isExpanded = false;

      grid = gridClassFactory.createGrid({});

      grid = {
        enableFiltering: true,
        expandableRowTemplate: 'ui-grid/odataExpandableRowTemplate',

        //https://cdn.rawgit.com/angular-ui/ui-grid.info/gh-pages/data/500_complex.json
        odata: {
          metadatatype: 'xml',
          datatype: 'json',
          expandable: 'subgrid',
          entitySet: 'Products',
          dataurl: "http://services.odata.org/V4/OData/OData.svc/Products",
          metadataurl: 'http://services.odata.org/V4/OData/OData.svc/$metadata',
          gencolumns: true
        }
      };

      grid.onRegisterApi = function (gridApi) {
        gridApi.expandable.on.rowExpandedStateChanged($scope, function(row) {
          it('rowExpandedStateChanged: ' + row.entity.Description);
        });

        gridApi.odata.on.success($scope, function(grid) {
          it('succeeded');
          it('expand row', function() {
            expect(grid.rows.length).toBeGreaterThan(0);

            if (!isExpanded) {
              isExpanded = true;
              var row = grid.rows[0];
              grid.api.expandable.toggleRowExpansion(row.entity);
            }
          });
        });

        gridApi.odata.on.error($scope, function(data, message) {
          it('error: ' + message);
        });
      };

      uiGridExpandableService.initializeGrid(grid);
      uiGridOdataService.initializeGrid(grid, true);
    }));
  });
})();
