import mongoose from 'mongoose'


const searchHistorySchema = new mongoose.Schema({
    userId: {type: String},
    borough: {type: String},
    zip: {type: String, required: false},
    searchedAt: {type: Date},
})

const SearchHistory = mongoose.model('SearchHistory',searchHistorySchema)

export default SearchHistory