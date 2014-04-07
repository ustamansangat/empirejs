(function () {
    $(function (){
        var $content = $("<div></div>").appendTo("body")
        if (Math.random() < 0.5) {
            $content.text("head")
        } else {
            $content.text("tail")
        }
    });
})();
