KISSY.add('app/ini', function(S) {
    return {
        defaultView: 'app/common/views/default',
        routes: function(pathname) {
            return pathname.indexOf('app/') === 0 ? pathname : this.defaultView
        }
    };
});