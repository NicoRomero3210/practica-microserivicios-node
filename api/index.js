// const app  = require('express')()
// const mongoose = require('mongoose')
// const fs = require('fs')

// mongoose.connect(process.env.MONGO_URI).then(res=>{
//     console.log("conectado a la bd")
// })

// console.log(process.env)

// app.get('/',function(req,res){
//     res.json({message:"hola lobo"})
// })

// app.listen(process.env.PORT,function(req,res){
//     console.log(`Emitiendo desde container en el puerto ${process.env.PORT}`)
// })

const app = require('express')()
// const client = new kafka.KafkaClient({kafkaHost:'127.0.0.1:9092'})
const consul = require('consul')()
const SERVICE_NAME= 'altoServicio'
const SERVICE_ID= `m_${process.argv[2]}`
const SCHEME = 'http'
const HOST= '127.0.0.1'
const PORT= process.argv[2]*1

app.get('/health',(req,res)=>{
    res.end('ok')
})

app.get('/',(req,res)=>{
    let s = `<h1>Instancia ${SERVICE_ID} del servicio ${SERVICE_NAME}</h1>`
    s+=`<h2>Listado de servicios</h2>`
    consul.agent.service.list(function(err,result){
        res.end(s+JSON.stringify(result))
    })
})

app.listen(PORT,()=>{
    console.log('Escuchando el puerto',PORT)
    console.log(`${SCHEME}://${HOST}:${PORT}/health`)
})

var check={
    id: SERVICE_ID,
    name:SERVICE_NAME,
    address: HOST,
    port: PORT,
    check:{
        http: `${SCHEME}://${HOST}:${PORT}`,
        ttl:'5s',
        interval:'5s',
        timeout:'5s',
        deregistercriticalserviceafter: '1m'
    }
}

consul.agent.service.register(check,function(err){console.log(err)})

//ESTO ES PARA KAFKA Y LA COMUNICACION ENTRE MICROSERVICIOS
// const kafka = require('kafka-node')
// const consumidor = new kafka.Consumer(client,[{topic:'test'}])
// consumidor.on('message',(msg)=>{
//     console.log(msg)
// }) 

// const productor = new kafka.Producer(client)

// productor.on('ready',()=>{
//     setInterval(()=>{
//         productor.send([{topic:'test',messages:'La concha de tu madre allBoys'}],
//         function(err){console.log(err)} 
//     )
//     },5000)
// })