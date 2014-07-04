/*
    author:xinglie.lkf@taobao.com
 */
KISSY.add('app/models/model', function(S, Model, IO) {
    return Model.extend({
        sync: function(callback) {
            var me = this;
            IO({
                url: me.get('url'),
                dataType: 'json',
                success: function(data) {
                    callback(null, {
                        list: data
                    });
                },
                error: function(xhr, msg) {
                    callback(msg);
                }
            });
        }
    });
}, {
    requires: [
        'magix/model',
        'io'
    ]
});