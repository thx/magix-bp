/*
    author:xinglie.lkf@taobao.com
 */
KISSY.add('app/models/manager', function(S, BaseManager, Model) {
    var Manager = BaseManager.create(Model);
    Manager.registerModels([{
        name: 'Campaigns_List',
        url: 'api/list.json'
    }]);
    return Manager;
}, {
    requires: [
        'magix/manager',
        'app/models/model'
    ]
});