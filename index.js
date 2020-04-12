//requiring modules
const express= require('express');
const app = express();
const Joi=require('joi');
require('./startup/prod')(app);

//middlewares
app.use(express.json());
app.use(express.static(front_end));

//database
const courses = [
  {id: 1, name: 'course1'},
  {id: 2, name: 'course2'},
  {id: 3, name: 'course3'},
];


//routes section
app.get('/',(req,res)=>{
  res.sendFile('front_end/index.html' , { root : __dirname});
});

app.get('/api/courses',(req,res)=>{
  res.send(courses);
});

app.get('/api/courses/:id',(req,res)=>{

  const course=courses.find(function(x){return x.id===parseInt(req.params.id)});
  if(course)
    res.send(course);
  else
  {
    res.status(404);
    res.send('The course with the given id is not found');
  }
});

app.post('/api/courses',(req,res)=>{

  const schema={
    name : Joi.string().min(3).required()
  }

  const result =Joi.validate(req.body,schema);

  if(result.error)
  {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  courses.push({id:courses.length+1 ,name:req.body.name});
  res.send(courses);
});

app.put('/api/courses/:id',(req,res)=>{

  let course=courses.find(function(x){return x.id===parseInt(req.params.id)});

  if(!course)
  {
    res.status(404).send("not found");
    return ;
  }

  const schema= {
    "name": Joi.string().min(3).required()
  };

  const result= Joi.validate(req.body,schema);

  if(result.error)
  {
    res.status(400).send(result.error.details);
    return ;
  }

  course.name =req.body.name ;
  res.send(courses);

});



// listening to the port
const port=process.env.PORT || 3000;
app.listen(port);
