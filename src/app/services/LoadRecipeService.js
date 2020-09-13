const Recipe = require('../models/Recipe')
const RecipeFile = require('../models/RecipeFile')
const File = require('../models/File')

async function getImages(recipeId) {
  let files = await RecipeFile.find(recipeId)
  files = files.map((file) => ({
    ...file,
    src: `${file.path.replace('public', '')}`
  }))

  return files
}

async function format(recipe) {
  if(recipe) {
    const files = await getImages(recipe.id)
    recipe.img = files[0].src
    recipe.images = files

    return recipe
  }
}

const LoadService = {
  load(service, filter) {
    this.filter = filter

    return this[service]()
  },
  async recipe() {
    try {
      const recipe = await Recipe.findOne(this.filter)
      
      return format(recipe)
    } catch (error) {
      console.error(error)
    }
  },
  async recipes() {
      try {
        const recipes = await Recipe.findAll(this.filter)
        const recipesPromise = recipes.map(format)
    
        return Promise.all(recipesPromise)
      } catch (error) {
          console.log(error)
      }
  },
  format,
}

module.exports = LoadService