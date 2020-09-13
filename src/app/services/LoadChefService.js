const Chef = require('../models/Chef')
const File = require('../models/File')
const RecipeFile = require('../models/RecipeFile')

async function getImages(chefId) {
  let files = await File.chef(chefId)
  files = files.map(file => ({
    ...file,
    src: `${file.path.replace('public', '')}`,
  }))

  return files
}

async function format(chef) {
  if(chef) {
    const files = await getImages(chef.id)
    chef.src = files[0].src
    chef.image = files
    
    return chef
  }
}

const LoadService = {
  load(service, filter) {
    this.filter = filter

    return this[service]()
  },
  async chef() {
    try {
      const chef = await Chef.find(this.filter)

      return format(chef)
    } catch (error) {
      console.error(error)
    }
  },
  async chefs() {
      try {
        const chefs = await Chef.findAll(this.filter)
        const chefsPromise = chefs.map(format)

        return Promise.all(chefsPromise)
      } catch (error) {
          console.error(error)
      }
  },
  async chefRecipes() {
    try {
      const recipes = await Chef.chefRecipes(this.filter)

      const recipesPromise = recipes.map(async (recipe) => {
        const files = await RecipeFile.find(recipe.id)
        if (files[0]) recipe.img = files[0].path.replace('public', '')
      })
  
      await Promise.all(recipesPromise)
  
      return recipes
    } catch (error) {
      console.error(error)
    }
  },
  format,
}

module.exports = LoadService