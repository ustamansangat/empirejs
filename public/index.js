(function () {
    'use strict';
    $(function () {
        function sum(n) {
            return n === 0 ? 0 : n + sum(n - 1);
        }

        var $input = $('<label>Evaluate sum till <input/></label>').appendTo('body');
        var $content = $('<div></div>').appendTo('body');
        $input.change(function (event) {
            var val = parseInt($(event.target).val(), 10);
            var res;
            try {
                res = sum(val);
            } catch (e) {
                res = e.message;
            }
            $content.append('<br>0 + 1 + ... + ' + val + ' = ' + res);
        });
    });
}());