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
            this.language = 'ru';
            this.navVM = new ViewModels.NavigationViewModel();
            this.tanksList = ko.observableArray([]);
            this.tankSelected = ko.observable({});
            this.throttledAjax = _.throttle($.ajax, 300);
            this.getTanksInfo();
        }
        MasterViewModel.createSelect = function (aData, caption) {
            if (typeof caption === "undefined") { caption = 'All'; }
            var selStart = '<select><option value="" selected="selected">' + caption + '</option>';
            var selMiddle = _.reduce(aData, function (memo, data) {
                return memo + '<option value="' + data + '">' + data + '</option>';
            }, '');
            var selEnd = '</select>';
            return selStart + selMiddle + selEnd;
        };

        MasterViewModel.prototype.getTanksInfo = function () {
            var self = this;
            var promise = this.throttledAjax({
                dataType: "json",
                url: "http://api.worldoftanks.ru/wot/encyclopedia/tanks/",
                type: "GET",
                data: { 'application_id': this.application_id, 'language': this.language }
            });
            promise.done(function (data) {
                self.tanksList(_.sortBy(_.toArray(data.data), function (tank) {
                    var levelStr = tank.level < 10 ? '0' + tank.level : '' + tank.level;
                    return tank.nation_i18n + '_' + levelStr + '_' + tank.name_i18n;
                }));
                var tanksTable = $('#tanksTable').dataTable({
                    "sDom": "<'row'<'col-lg-3'l><'col-lg-3'f><'col-lg-6 customFilters'c>r>t<'row'<'col-lg-12'i><'col-lg-12 center'p>>"
                });
                var allSelects = MasterViewModel.createSelect(_.unique(_.pluck(self.tanksList(), 'nation_i18n')), 'Все страны') + ' ' + MasterViewModel.createSelect(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], 'Все уровни') + ' ' + MasterViewModel.createSelect(_.unique(_.pluck(self.tanksList(), 'type_i18n')), 'Все типы');
                $('.customFilters').html(allSelects);
                $('.customFilters select:nth-child(1)').change(function () {
                    tanksTable.fnFilter($(this).val(), 1);
                });
                $('.customFilters select:nth-child(2)').change(function () {
                    if ($(this).val() == '') {
                        tanksTable.fnFilter('', 0);
                    } else {
                        tanksTable.fnFilter("^" + $(this).val() + "$", 0, true, false);
                    }
                });
                $('.customFilters select:nth-child(3)').change(function () {
                    if ($(this).val() == '') {
                        tanksTable.fnFilter('', 3);
                    } else {
                        tanksTable.fnFilter("^" + $(this).val() + "$", 3, true, false);
                    }
                });
            });
        };

        MasterViewModel.prototype.showTankInfo = function (tank) {
            this.navVM.currentPath(['Tank', tank]);
            var self = this;
            var promise = this.throttledAjax({
                dataType: "json",
                url: "http://api.worldoftanks.ru/wot/encyclopedia/tankinfo/",
                type: "GET",
                data: { 'application_id': this.application_id, 'language': this.language, 'tank_id': tank }
            });
            promise.done(function (data) {
                self.tankSelected(data.data[tank]);
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
