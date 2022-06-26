const request = require('supertest')
const {Genre}=require('../Models/genre')
const {User} = require("../Models/user")
let server;




describe('auth middleware',()=>{
    beforeEach(async ()=>{
        server = require("../index")
     
        await Genre.deleteMany({})
        // await Genre.collection.insertMany([
        //     {name:'genre1'},
        //     {name:'genre2'},
        //     {name:'genre3'}
        // ])
       
    })
    afterEach( (done)=>{
        server.close(()=>{
            done()
        })   
    })

    describe('test auth middlewate',()=>{

        let token;
        const exec =  ()=>{
            return  request(server)
                    .post('/api/genres')
                    .set('x-auth-token',token)
                    .send({name:"genre1"})
        }
    
        beforeEach(()=>{
           token = new User().generateAuthToken()
        })
        it('should return 401 if no token is provided',async()=>{
            token = ""
            const res = await exec()
            expect(res.status).toBe(401)
        })
        it('should return 400 if invalid token is provided',async()=>{
            token = "ytredass"
            const res = await exec()
            expect(res.status).toBe(400)
        })
        it('should return 201 if valid token is provided',async()=>{
            const res = await exec()
            expect(res.status).toBe(201)
        })
    })

})