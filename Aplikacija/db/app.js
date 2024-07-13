const express = require('express')
const { ObjectId } = require('mongodb')
const {connectToDb, getDb} = require('./db')

//init app & middleware
const app = express();
app.use(express.json())

//db conn
let db

connectToDb((err)=>{
    if(!err) {
        
        app.listen(3000, ()=>{
            console.log('port 3000')
        })
        db=getDb()
    }
})


// routes
// DELA GET
app.get('/dela', (req, res)=>{
    let dela =[]

    db.collection('dela')
     .find()
     .sort({ Naziv: 1 })
     .forEach(delo=>dela.push(delo))
     .then(()=>{
        res.status(200).json(dela)
     })
     .catch(()=>{
        res.status(500).json({error: 'Ne moz fetch za get'})
        })
     })

     //DELA GET ID
app.get('/dela/:id', (req, res)=>{

    if(ObjectId.isValid(req.params.id)) {
        db.collection('dela')
        .findOne({_id: new ObjectId(req.params.id)})
        .then(doc=>{
            res.status(200).json(doc)
        })
        .catch(err=>{
            res.status(500).json({error: 'Nece get za id'})
        })
    } else {
        res.status(500).json({error: 'Ne validan ulaz'})
    }
})

// KORISNICI GET
app.get('/korisnici', (req, res)=>{

    //current page
    // const page=req.query.p || 0
    // const korPerPage=3

    let korisnici =[]

    db.collection('korisnici')
     .find()
     .sort({naziv: 1})
    //  .limit(booksPerPage)
    //  .skip(page*booksPerPage)
     .forEach(korisnik=>korisnici.push(korisnik))
     .then(()=>{
        res.status(200).json(korisnici)
     })
     .catch(()=>{
        res.status(500).json({error: 'Ne moz fetch'})
        })
     })

     //GET ZA KOR ID
     app.get('/korisnici/:id', (req, res)=> {
        
        if(ObjectId.isValid(req.params.id)){
            db.collection('korisnici')
          .findOne({_id: new ObjectId(req.params.id)})
          .then(doc=>{
            res.status(200).json(doc)
          })
          .catch(err=>{
            res.status(500).json({error: 'Nece fetchina'})
          })
        }
        else {
            res.status(500).json({error: 'Invalid ID Dela'})
        }

     })

     //POST AL SA BODY??
     app.post('/dela', (req, res)=>{
        const delo = req.body

        db.collection('dela')
          .insertOne(delo)
          .then(result=>{
            res.status(201).json(result)
          })
          .catch(err=>{
            res.status(500).json({err: 'Nismo uspeli delo da kreiramo'})
          })
     })

     //ADMIN DELETE (ID)
     app.delete('/dela/:id', (req, res)=>{
        if(ObjectId.isValid(req.params.id)){
            db.collection('dela')
          .deleteOne({_id: new ObjectId(req.params.id)})
          .then(result=>{
            res.status(200).json(result)
          })
          .catch(err=>{
            res.status(500).json({error: 'Nismo mogli da izbrisemo delo'})
          })
        }
        else {
            res.status(500).json({error: 'Not a valid doc id'})
        }
     })

     //UPDATE/POST
     app.patch('/dela/:id', (req, res)=> {
        const updates = req.body


        if(ObjectId.isValid(req.params.id)){
            db.collection('dela')
          .updateOne({_id: new ObjectId(req.params.id)}, {$set: updates})
          .then(result=>{
            res.status(200).json(result)
          })
          .catch(err=>{
            res.status(500).json({error: 'Nije hteo update'})
          })
        }
        else {
            res.status(500).json({error: 'Ne validan ID dok.'})
        }
     })
