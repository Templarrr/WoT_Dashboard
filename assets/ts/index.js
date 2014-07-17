/// <reference path="definitions/knockout.d.ts" />
/// <reference path="MasterViewModel.ts" />
var ViewModels;
(function (ViewModels) {
    var NavigationViewModel = (function () {
        function NavigationViewModel() {
            this.currentPath = ko.observableArray(['Tanks']);
        }
        NavigationViewModel.prototype.setPath = function (path, env) {
            if (path.length == 0) {
                path = ['Tanks'];
            }
            env.navVM.currentPath(path);
        };

        NavigationViewModel.prototype.clickBreadcrumb = function (index, env) {
            var newPath;
            newPath = _.first(env.navVM.currentPath(), (index() + 1));
            env.navVM.setPath(newPath, env);
        };
        return NavigationViewModel;
    })();
    ViewModels.NavigationViewModel = NavigationViewModel;
})(ViewModels || (ViewModels = {}));
/// <reference path="definitions/knockout.d.ts" />
/// <reference path="definitions/jquery.d.ts" />
/// <reference path="definitions/underscore.d.ts" />
/// <reference path="definitions/jquery.dataTables.d.ts" />
/// <reference path="NavigationViewModel.ts" />
var ViewModels;
(function (ViewModels) {
    var MasterViewModel = (function () {
        function MasterViewModel() {
            this.application_id = '54c513273ff810e69695c9dc613c654f';
            this.navVM = new ViewModels.NavigationViewModel();
            this.tanksList = ko.observableArray([]);
            this.getTanksInfo();
        }
        MasterViewModel.prototype.getTanksInfo = function () {
            var self = this;
            var promise = $.ajax({
                dataType: "json",
                url: "http://api.worldoftanks.ru/wot/encyclopedia/tanks/",
                type: "GET",
                data: { 'application_id': this.application_id }
            });
            promise.done(function (data) {
                self.tanksList(_.sortBy(_.toArray(data.data), function (tank) {
                    var levelStr = tank.level < 10 ? '0' + tank.level : '' + tank.level;
                    return tank.nation_i18n + '_' + levelStr + '_' + tank.name_i18n;
                }));
                $('#tanksTable').dataTable({});
            });
        };
        return MasterViewModel;
    })();
    ViewModels.MasterViewModel = MasterViewModel;
})(ViewModels || (ViewModels = {}));
/// <reference path="definitions/knockout.d.ts" />
/// <reference path="definitions/jquery.d.ts" />
/// <reference path="definitions/jquery.dataTables.d.ts" />
/// <reference path="definitions/dropzone.d.ts" />
/// <reference path="definitions/underscore.d.ts" />
/// <reference path="definitions/blockUI.d.ts" />
/// <reference path="definitions/chosen.jquery.d.ts" />
/// <reference path="MasterViewModel.ts" />
var masterVM = new ViewModels.MasterViewModel();
ko.applyBindings(masterVM);
