const express = require('express');
const mongoose = require('mongoose');
const Recipe = require('./models/recipe');
mongoose.connect('mongodb://localhost/recipesDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected established with database');
}).catch((err) => {
  console.error('Error database not connectes', err.message);
});
const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.render('index', { recipes });
  } catch (err) {
    console.error('unable to get recipe data', err.message);
    res.status(500).send('error through server');
  }
});

app.get('/new', (req, res) => {
  res.render('new');
});

app.post('/new', async (req, res) => {
  try {
    const recipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      ingredients: req.body.ingredients
    });
    await recipe.save();
    res.redirect('/');
  } catch (err) {
    console.error('Unable to create recipe ', err.message);
    res.status(500).send('error through server');
  }
});

app.get('/:id/edit', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    res.render('edit', { recipe });
  } catch (err) {
    console.error('Unable to get recipe', err.message);
    res.status(500).send('error through server');
  }
});

app.post('/:id/edit', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    recipe.name = req.body.name;
    recipe.description = req.body.description;
    recipe.ingredients = req.body.ingredients;
    await recipe.save();
    res.redirect('/');
  } catch (err) {
    console.error('Unable to update', err.message);
    res.status(500).send('Server Error');
  }
});

app.post('/:id/delete', async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    console.error('Unable to delete recipe:', err.message);
    res.status(500).send('error through server');
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
