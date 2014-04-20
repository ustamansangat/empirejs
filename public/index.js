(function () {
    'use strict';
    $(function () {
        function sum(n) {
            function TailCall(args) {
                this.args = args;
            }

            function thrower() {
                throw new TailCall(arguments);
            }

            function helper(n, acc) {
                return n === 0 ? acc : thrower(n - 1, acc + n);
            }

            function looper() {
                var args = arguments;
                while (args) {
                    try {
                        return helper.apply(null, args);
                    } catch (e) {
                        if (e.constructor === TailCall) {
                            args = e.args;
                        }
                    }
                }
            }

            return looper(n, 0);
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