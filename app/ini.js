KISSY.add('app/ini', function(S) {
    return {
        defaultView: 'app/common/views/default',
        routes: function(pathname) {
            return this.defaultView;
        }
    };
});