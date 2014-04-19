(function () {
    'use strict';
    $(function () {
        function sum(n) {
            function helper(n, acc) {
                return n === 0 ? acc : helper(n - 1, acc + n);
            }
            return helper(n, 0);
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