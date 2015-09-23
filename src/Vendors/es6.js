define({
    load: function (name, req, onload, config) {
        var url =  req.toUrl(name + '.js');
        url = url.replace(/^\.\//, '');
        url = 'text!' + url;
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
