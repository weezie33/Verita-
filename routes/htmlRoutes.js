var db = require('../models');

const Op = require('sequelize').Op;

module.exports = function(app) {
  db.products.hasMany(db.reviews, { foreignKey: 'id' });
  db.reviews.belongsTo(db.products, { foreignKey: 'id' });

  //searches the DB for a specific review/product by keywords
  app.get('/app/reviews/search/:reviewFetch', (req, res) => {
    db.reviews
      .findAll({
        where: {
          text: {
            [Op.like]: `% ${req.params.reviewFetch ||
              req.body.reviewFetch ||
              req.query.reviewFetch} %`
          }
        }
      })
      .then(function(result) {
        if (result.length > 0) {
          res.render('reviews', { result });
        } else {
          res.redirect(
            `/404?qErr=Sorry,ID${req.body.id || req.params.id}couldnotbefound`
          );
        }
      })
      .catch(err => {
        throw err;
      });
  });

  // Loads the reviews page, should be in apiRoutes
  app.get('/app/reviews/', (req, res) => {
    db.reviews.findAll({}).then(function(result) {
      res.render('reviews', {
        result
      });
    });
  });

  app.get('/app/products', (req, res) => {
    db.products.findAll({}).then(function(result) {
      res.render('products', {
        result
      });
    });
  });

  //Loads the index.handlebars on homepage
  app.get('/', (req, res) => {
    res.render('index');
  });

  // Render 404 page for any unmatched routes
  app.get('*', (req, res) => {
    res.render('404');
  });

  // sets up query variables to 404
  app.get('/404', function(req, res) {
    let qErr = req.query.qErr;
    res.render('404', { qErr });
  });
};
