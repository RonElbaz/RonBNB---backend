const dbService = require("../../services/db.service")
const logger = require("../../services/logger.service")
const ObjectId = require("mongodb").ObjectId
const asyncLocalStorage = require("../../services/als.service")

async function query(filterBy = {}) {
  try {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection("order")
    var orders = await collection.find().toArray()
    return orders
  } catch (err) {
    logger.error("cannot find orders", err)
    throw err
  }
}

async function add(order) {
  try {
    const collection = await dbService.getCollection("order")
    var newOrder = await collection.insertOne(order)
    console.log(newOrder);
    return newOrder
  } catch (err) {
    logger.error("cannot add order", err)
    throw err
  }
}

async function update(order) {
  try {
    const collection = await dbService.getCollection("order")
    const criteria = { _id: ObjectId(order._id) }
    var newOrder = await collection.findOneAndUpdate(criteria,{$set: { "status": order.status },})
    return newOrder.value
  } catch (err) {
    logger.error("cannot update order", err)
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
  add,
  update,
}
