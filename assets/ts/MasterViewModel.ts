/// <reference path="definitions/knockout.d.ts" />
/// <reference path="definitions/jquery.d.ts" />
/// <reference path="definitions/underscore.d.ts" />
/// <reference path="definitions/jquery.dataTables.d.ts" />
/// <reference path="NavigationViewModel.ts" />

module ViewModels {
    export class MasterViewModel {
        application_id:string = '54c513273ff810e69695c9dc613c654f';
        navVM:NavigationViewModel = new ViewModels.NavigationViewModel();
        tanksList:KnockoutObservableArray<any> = ko.observableArray([]);

        public createSelect(aData:string[], caption = 'All'):string {
            var selStart = '<select><option value="" selected="selected">' + caption + '</option>', i, iLen = aData.length;
            var selMiddle = _.reduce(aData, (memo, data) => memo + '<option value="' + data + '">' + data + '</option>', '');
            var selEnd = '</select>';
            return selStart + selMiddle + selEnd;
        }

        public getTanksInfo():void {
            var self = this;
            var promise = $.ajax({
                dataType: "json",
                url: "http://api.worldoftanks.ru/wot/encyclopedia/tanks/",
                type: "GET",
                data: {'application_id': this.application_id}
            });
            promise.done(function (data) {
                self.tanksList(_.sortBy(_.toArray(data.data), function (tank) {
                    var levelStr = tank.level < 10 ? '0' + tank.level : '' + tank.level;
                    return tank.nation_i18n + '_' + levelStr + '_' + tank.name_i18n;
                }));
                var tanksTable = $('#tanksTable').dataTable({
                    "sDom": "<'row'<'col-lg-4'l><'col-lg-4'f><'col-lg-4 customFilters'c>r>t<'row'<'col-lg-12'i><'col-lg-12 center'p>>"
                });
                var allSelects = self.createSelect(_.unique(_.pluck(self.tanksList(), 'nation_i18n')), 'Все страны') + ' ' +
                    self.createSelect(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], 'Все уровни') + ' ' +
                    self.createSelect(_.unique(_.pluck(self.tanksList(), 'type_i18n')), 'Все типы');
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

            })
        }

        constructor() {
            this.getTanksInfo();
        }
    }
}