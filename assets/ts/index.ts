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