define({
    load: function (name, req, onload, config) {
        var url = 'text!' + req.toUrl(name + '.js');
        req([url], function(value){
            var transformed = babel.transform(value, {
                modules: 'amd',
                sourceFileName: name + '.js',
                sourceMap: 'inline'
            });
            onload.fromText(transformed.code)
        })
    }
});
