/*
 * GET home page.
 */
const budgetJson = require("../public/json/budgets.js");

exports.index = function(req, res) {
    var template_engine = req.app.settings.template_engine;
    res.locals.session = req.session;
    res.render('index', {
        title: 'Express with ' + template_engine, 
        layout: "budgetLayout.hbs",
        budgets: JSON.stringify(budgetJson.budgets)
    });
};
