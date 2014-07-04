KISSY.add('app/ini', function(S) {
    return {
        defaultView: 'app/views/default',
        routes: function(pathname) {
            return this.defaultView;
        }
    };
});