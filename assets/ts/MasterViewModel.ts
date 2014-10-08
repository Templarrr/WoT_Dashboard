/// <reference path="definitions/knockout.d.ts" />
/// <reference path="definitions/jquery.d.ts" />
/// <reference path="definitions/underscore.d.ts" />
/// <reference path="definitions/jquery.dataTables.d.ts" />
/// <reference path="NavigationViewModel.ts" />

module ViewModels {
    export interface tankInfo {
        is_premium:boolean;
        level:number;
        name:string;
        name_i18n:string;
        nation:string;
        nation_i18n:string;
        short_name_i18n:string;
        tank_id:number;
        type:string;
        type_i18n:string
    }

    export class MasterViewModel {
        application_id:string = '54c513273ff810e69695c9dc613c654f';
        navVM:NavigationViewModel = new ViewModels.NavigationViewModel();
        tanksList:KnockoutObservableArray<any> = ko.observableArray([]);

        public static createSelect(aData:string[], caption = 'All'):string {
            var selStart = '<select><option value="" selected="selected">' + caption + '</option>';
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
                self.tanksList(_.sortBy(_.toArray(data.data), function (tank:tankInfo) {
                    var levelStr = tank.level < 10 ? '0' + tank.level : '' + tank.level;
                    return tank.nation_i18n + '_' + levelStr + '_' + tank.name_i18n;
                }));
                var tanksTable = $('#tanksTable').dataTable({
                    "sDom": "<'row'<'col-lg-3'l><'col-lg-3'f><'col-lg-6 customFilters'c>r>t<'row'<'col-lg-12'i><'col-lg-12 center'p>>"
                });
                var allSelects = MasterViewModel.createSelect(_.unique(_.pluck(self.tanksList(), 'nation_i18n')), 'Все страны') + ' ' +
                    MasterViewModel.createSelect(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], 'Все уровни') + ' ' +
                    MasterViewModel.createSelect(_.unique(_.pluck(self.tanksList(), 'type_i18n')), 'Все типы');
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