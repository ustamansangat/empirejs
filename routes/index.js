
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'EmpireJS 2014' });
};

exports.list = function(req, res){
    res.send("respond with a resource");
};
