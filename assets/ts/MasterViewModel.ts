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
                $('#tanksTable').dataTable({});
            })
        }

        constructor() {
            this.getTanksInfo();
        }
    }
}