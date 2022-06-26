const {Rental} = require('../Models/rental')
const {Movie} = require('../Models/movies')
const mongoose = require('mongoose')
const moment = require('moment')
const request = require('supertest')
const {User} = require('../Models/user')


describe('/api/returns',()=>{
    let server 
    let customerId
    let movieId
    let rental
    let token
    let movie
    let genreId

 const exec = ()=>{
    return request(server)
    .post('/api/rentals/returns')
    .set('x-auth-token',token)
    .send({customerId,movieId})
 }
    beforeEach(async ()=>{
         server = require('../index')
       await Rental.deleteMany({})
       await Movie.deleteMany({})
       customerId = mongoose.Types.ObjectId()
       movieId = mongoose.Types.ObjectId()
       genreId = mongoose.Types.ObjectId()
      token = new User().generateAuthToken()
        movie = new Movie({
            _id:movieId,
            title:"testing movie",
            genre:{
                _id:genreId,
                name:"test genre"
            },
            numberInStock:5,
            dailyRentalRate:2
        })
        await movie.save()
         rental = new Rental({
        customer:{
        _id:customerId,
        name:'customer',
        phone:'1234567'
        },
        movie:{
            _id:movieId,
            title:'test movie',
            dailyRentalRate:2
        }
        
       })
       await rental.save()
    })

    afterEach(async()=>{
        await server.close()
    })

    it('should return 401 if client is not logged in',async ()=>{
        token = ""
        const res = await exec()
        expect(res.status).toBe(401)

    })
        
    it('should return 400 if customerId is not provided',async()=>{ 
        customerId = ""
        const res = await exec()
        expect(res.status).toBe(400)
    })
    it('should return 400 if movieId is not provided',async()=>{
        movieId = ""
        const res = await exec()
        expect(res.status).toBe(400)
    })
    it('should return 404 if rental is not found',async()=>{
        await Rental.remove({})
        const res = await exec()
        expect(res.status).toBe(404)
    })
    it('should return 400 if return is already process',async()=>{
        rental.dateReturned = new Date()
        await rental.save()
        const res = await exec()
        expect(res.status).toBe(400)
    })

    it('should return 200 if return is valid',async()=>{
        const res = await exec()
        expect(res.status).toBe(200)
    })

    it('should set the returned date if input is valid',async()=>{
        const res = await exec()
        const rentalInDb = await Rental.findById(rental._id)
        expect(rentalInDb.dateReturned).toBeDefined()
    })

    it('should set rental fee ',async()=>{
        rental.dateOut = moment().add(-7,'days').toDate()
        await rental.save()
        const res = await exec()
        const rentalInDb = await Rental.findById(rental._id)
        expect(rentalInDb.rentalFee).toBe(14)
    })

    it('should increase movie stock ',async()=>{
        const movieBeforeReturn = await Movie.findById(movieId)
        const res = await exec()
        const movieAfterReturn = await Movie.findById(movieId)
        expect(movieAfterReturn.numberInStock).toBe(movieBeforeReturn.numberInStock+1)
    })
    it('should retun the rental response ',async()=>{
        const res = await exec()
        expect(res.body).toBeTruthy()
    })
})