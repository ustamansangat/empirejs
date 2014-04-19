(function () {
    'use strict';
    $(function () {

        function CoinTosser () {
        }
        CoinTosser.prototype = {
          HEAD: 'Head',
          TAIL: 'Tail'
        };
        CoinTosser.prototype.toss = function () {
            return Math.random() < 0.5 ? this.HEAD : this.TAIL;
        };

        var coinTosser = new CoinTosser();
        var $content = $('<div></div>').appendTo('body');
        $content.text(coinTosser.toss());
    });
}());