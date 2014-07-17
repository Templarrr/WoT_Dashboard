/// <reference path="definitions/knockout.d.ts" />
/// <reference path="MasterViewModel.ts" />

module ViewModels {
    export class NavigationViewModel {
        currentPath:KnockoutObservableArray<string> = ko.observableArray(['Tanks']);

        public setPath(path:string[], env:ViewModels.MasterViewModel):void {
            if (path.length == 0) {
                path = ['Tanks'];
            }
            env.navVM.currentPath(path);
        }

        public clickBreadcrumb(index:()=>number, env:ViewModels.MasterViewModel):void {
            var newPath:string[];
            newPath = _.first(env.navVM.currentPath(), (index() + 1));
            env.navVM.setPath(newPath, env);
        }
    }
}