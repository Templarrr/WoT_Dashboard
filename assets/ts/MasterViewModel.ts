/// <reference path="definitions/knockout.d.ts" />
/// <reference path="definitions/jquery.d.ts" />
/// <reference path="definitions/underscore.d.ts" />
/// <reference path="definitions/jquery.dataTables.d.ts" />
/// <reference path="NavigationViewModel.ts" />

module ViewModels {
    export interface tankShortInfo {
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

    export interface  tankFullInfo {
        chassis_rotation_speed : number;
        circular_vision_radius : number;
        contour_image : string;
        engine_power : number;
        gun_damage_max : number;
        gun_damage_min : number;
        gun_max_ammo : number;
        gun_name : string;
        gun_piercing_power_max : number;
        gun_piercing_power_min : number;
        gun_rate : number;
        image : string;
        image_small : string;
        is_gift : boolean;
        is_premium : boolean;
        level : number;
        limit_weight : number;
        max_health : number;
        name : string;
        name_i18n : string;
        nation : string;
        nation_i18n : string;
        price_credit : number;
        price_gold : number;
        radio_distance : number;
        short_name_i18n : string;
        speed_limit : number;
        tank_id : number;
        turret_armor_board : number;
        turret_armor_fedd : number;
        turret_armor_forehead : number;
        turret_rotation_speed : number;
        type : string;
        type_i18n : string;
        vehicle_armor_board : number;
        vehicle_armor_fedd : number;
        vehicle_armor_forehead : number;
        weight : number;
        chassis : tankModuleInfo[];
        crew : tankCrewInfo[];
        engines : tankModuleInfo[];
        guns : tankModuleInfo[];
        radios : tankModuleInfo[];
        turrets : tankModuleInfo[];
    }

    export interface tankModuleInfo {
        module_id : number;
        is_default : boolean;
    }

    export interface tankCrewInfo {
        role : string;
        role_i18n : string;
    }

    export class MasterViewModel {
        application_id:string = '54c513273ff810e69695c9dc613c654f';
        language:string = 'ru';
        navVM:NavigationViewModel = new ViewModels.NavigationViewModel();
        tanksList:KnockoutObservableArray<any> = ko.observableArray([]);
        tankSelected:KnockoutObservable<any> = ko.observable({
            chassis_rotation_speed: 0,
            circular_vision_radius: 0,
            contour_image: '',
            engine_power: 0,
            gun_damage_max: 0,
            gun_damage_min: 0,
            gun_max_ammo: 0,
            gun_name: '',
            gun_piercing_power_max: 0,
            gun_piercing_power_min: 0,
            gun_rate: 0,
            image: '',
            image_small: '',
            is_gift: false,
            is_premium: false,
            level: 0,
            limit_weight: 0,
            max_health: 0,
            name: '',
            name_i18n: '',
            nation: '',
            nation_i18n: '',
            price_credit: 0,
            price_gold: 0,
            radio_distance: 0,
            short_name_i18n: '',
            speed_limit: 0,
            tank_id: 0,
            turret_armor_board: 0,
            turret_armor_fedd: 0,
            turret_armor_forehead: 0,
            turret_rotation_speed: 0,
            type: '',
            type_i18n: '',
            vehicle_armor_board: 0,
            vehicle_armor_fedd: 0,
            vehicle_armor_forehead: 0,
            weight: 0,
            chassis: [],
            crew: [],
            engines: [],
            guns: [],
            radios: [],
            turrets: []
        });
        throttledAjax;

        public static createSelect(aData:string[], caption = 'All'):string {
            var selStart = '<select><option value="" selected="selected">' + caption + '</option>';
            var selMiddle = _.reduce(aData, (memo, data) => memo + '<option value="' + data + '">' + data + '</option>', '');
            var selEnd = '</select>';
            return selStart + selMiddle + selEnd;
        }

        public getTanksInfo():void {
            var self = this;
            var promise = this.throttledAjax({
                dataType: "json",
                url: "http://api.worldoftanks.ru/wot/encyclopedia/tanks/",
                type: "GET",
                data: {'application_id': this.application_id, 'language': this.language}
            });
            promise.done(function (data) {
                self.tanksList(_.sortBy(_.toArray(data.data), function (tank:tankShortInfo) {
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

        private getTurretsInfo(turret_id:number) {
            var promise = this.throttledAjax({
                dataType: "json",
                url: "http://api.worldoftanks.ru/wot/encyclopedia/tankturrets/",
                type: "GET",
                data: {'application_id': this.application_id, 'language': this.language, 'module_id': turret_id}
            });
        }

        public showTankInfo(tank_id:number) {
            this.navVM.currentPath(['Tank', tank_id.toString()]);
            var self = this;
            var promise = this.throttledAjax({
                dataType: "json",
                url: "http://api.worldoftanks.ru/wot/encyclopedia/tankinfo/",
                type: "GET",
                data: {'application_id': this.application_id, 'language': this.language, 'tank_id': tank_id}
            });
            promise.done(function (data) {
                var tankData = data.data[tank_id];
                self.tankSelected(tankData);
                var modules = self.tankSelected().turrets;
                for (var index = 0; index < modules.length; ++index) {
                    console.log(modules[index].module_id);
                }
            })
        }

        constructor() {
            this.throttledAjax = _.throttle($.ajax, 300);
            this.getTanksInfo();
        }
    }
}