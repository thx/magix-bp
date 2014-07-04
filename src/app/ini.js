KISSY.add('app/ini', function(S) {
    return {
        defaultView: 'app/views/default',
        defaultPath: '/index',
        routes: function(pathname) {
            return pathname.indexOf('app/') === 0 ? pathname : this.defaultView;
        }
    };
});