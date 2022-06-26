const request = require('supertest')
const {Genre}=require('../Models/genre')
const {User} = require("../Models/user")
const mongoose = require('mongoose')
let server;

describe('/api/genres',()=>{
    beforeEach(async ()=>{
        server = require("../index")
        await Genre.deleteMany({})
        await Genre.collection.insertMany([
            {name:'genre1'},
            {name:'genre2'},
            {name:'genre3'}
        ])
       
    })
    afterEach( (done)=>{
        server.close(()=>{
            done()
        })
        
        
    })
    describe('GET /', ()=>{ 
        it('should return all genres',async ()=>{  
            // await Genre.collection.insertMany([
            //     {name:'genre1'},
            //     {name:'genre2'},
            //     {name:'genre3'}
            // ])  
          const res = await request(server).get('/api/genres')
            expect(res.status).toBe(200)
            expect(res.body.length).toBe(3)
            expect(res.body[0].name).toBe('genre1') 
        })
        it('should not return 400 for invalid id',async ()=>{
            const res = await request(server).get(`/api/genres/5`)
            expect(res.status).toBe(400)
        })
        it('should not return one genre if id is wrong',async ()=>{
            const id = '62700e33db62a120f840026b'
            const res = await request(server).get(`/api/genres/${id}`)
            expect(res.status).toBe(404)
        })
        it('should return one genre if id is valid',async ()=>{
            const res = await request(server).get('/api/genres')
            const id = res.body[0]._id
            const result = await request(server).get(`/api/genres/${id}`)
            expect(res.status).toBe(200)
            expect(result.body).toEqual({_id:id,name:"genre1"})
        })
        
    })

    describe('POST /',()=>{
        const token = new User().generateAuthToken()
        it('should return 401 if user is not logged in',async()=>{
           const res = await request(server)
                            .post('/api/genres')
                            .send({name:'genre5'})
           expect(res.status).toBe(401)
        })
        it('should return 400 if genre is less than 3 characters',async()=>{ 
            const res = await request(server)
                             .post('/api/genres')
                             .set('x-auth-token',token)
                             .send({name:'ab'})
            expect(res.status).toBe(400)
         })
         it('should return 400 if genre is more than 50 characters',async()=>{
            const name = new Array(60).join("a")
            const res = await request(server)
                             .post('/api/genres')
                             .set('x-auth-token',token)
                             .send({name})
            expect(res.status).toBe(400)
         })
         it('should save the genre if it is valid',async()=>{
            const res = await request(server)
                             .post('/api/genres')
                             .set('x-auth-token',token)
                             .send({name:"genre6"})
            expect(res.status).toBe(201)
            expect(res.body.name).toBe('genre6')
            expect(res.body).toHaveProperty('_id')

            const genre = await Genre.findOne({name:'genre6'})
            expect(genre).not.toBeNull()
            expect(genre).toBeTruthy()
         })
    })

    describe('PUT /',()=>{
        const token = new User().generateAuthToken()
        it('should update a genre and return 200 status',async ()=>{
            const genre = await Genre.findOne({name:'genre1'})
            const res = await request(server)
                            .put(`/api/genres/${genre._id}`)
                            .set('x-auth-token',token)
                            .send({name:"genre10"})
            expect(res.status).toBe(200)
            expect(res.body.name).toBe('genre10')
        })
        it('should not update a genre if genre is not found',async ()=>{
            //const genre = await Genre.findOne({name:'genre1'})
            const id = mongoose.Types.ObjectId()
            const res = await request(server)
                            .put(`/api/genres/${id}`)
                            .set('x-auth-token',token)
                            .send({name:"genre10"})
            expect(res.status).toBe(404)
        })
    })

    describe("DELETE /",()=>{
        const user = {_id:mongoose.Types.ObjectId(),admin:true}
        const token = new User(user).generateAuthToken()
        it('should delete genre from db',async()=>{
            const genre = await Genre.findOne({name:'genre1'})
            const res = await request(server)
            .delete(`/api/genres/${genre._id}`)
            .set('x-auth-token',token)
            expect(res.status).toBe(200)
            const result = await request(server).get(`/api/genres`)
            expect(result.body.length).toBe(2)
            
        })
    })
})