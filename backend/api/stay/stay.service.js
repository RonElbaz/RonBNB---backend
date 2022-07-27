const dbService = require("../../services/db.service")
const logger = require("../../services/logger.service")
const ObjectId = require("mongodb").ObjectId
const asyncLocalStorage = require("../../services/als.service")

async function query(filterBy = {}) {
  try {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection("stay")
    var stays = await collection.find().toArray()
    return stays
  } catch (err) {
    logger.error("cannot find stays", err)
    throw err
  }
}

async function getById(stayId){
try{
    const criteria = { _id: ObjectId(stayId) }
    const collection = await dbService.getCollection("stay")
    var stay = await collection.findOne(criteria)
    // console.log(stay)
    return stay
}
catch(err){
    logger.error("cannot find spesific stay", err)
    throw err
}
}

async function remove(stayId) {
  try {
    const store = asyncLocalStorage.getStore()
    const { loggedinUser } = store
    const collection = await dbService.getCollection("stay")
    // remove only if user is owner/admin
    const criteria = { _id: ObjectId(stayId) }
    if (!loggedinUser.isAdmin) criteria.byUserId = ObjectId(loggedinUser._id)
    const { deletedCount } = await collection.deleteOne(criteria)
    return deletedCount
  } catch (err) {
    logger.error(`cannot remove stay ${stayId}`, err)
    throw err
  }
}

async function add(stayId) {
  try {
    const collection = await dbService.getCollection("stay")
    const criteria = { _id: ObjectId(stayId) }
    var stay = await collection.find(criteria).toArray()
    var newStay
    if(stay[0].isLiked){

        newStay = await collection.findOneAndUpdate(criteria,{$set: { "isLiked": false },})
        return newStay.value
    }
    else{
        newStay = await collection.findOneAndUpdate(criteria,{$set: { "isLiked": true },})
        return newStay.value
    }
  } catch (err) {
    logger.error("cannot update stay", err)
    throw err
  }
}

function _buildCriteria(filterBy) {
  return {}
  const criteria = {}
  if (filterBy.byUserId) criteria.byUserId = filterBy.byUserId
  return criteria
}

module.exports = {
  query,
  remove,
  add,
  getById
}
