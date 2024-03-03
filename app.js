const express = require("express");
const path = require("path");

const app = express();

app.set("view engine","ejs")
app.use(express.static("views"));
app.use(express.urlencoded({'extended':true}));
app.use(express.json());

let header=["IDNO","LASTNAME","FIRSTNAME","COURSE","LEVEL"];

let users = [
	{
		'email' : 'user@uc.com', 'password' : 'user'
	},
	{
		'email' : 'admin' , 'password' : 'admin'
	}
];

let studentlist = [
	{
		idno:'1000',
		lastname:'durano',
		firstname:'dennis',
		course:'bscpe',
		level:'4'
	},
	{
		idno:'2000',
		lastname:'hello',
		firstname:'world',
		course:'bsit',
		level:'2'
	},
	{
		idno:'3000',
		lastname:'alpha',
		firstname:'bravo',
		course:'bscs',
		level:'3'
	},
	{
		idno:'4000',
		lastname:'sample',
		firstname:'user',
		course:'bsit',
		level:'3'
	},
	
];

app.post("/login", (req, res) => {
	let email = req.body.email;
	let pass = req.body.password;
	let corr = false;
	for(var i=0; i < users.length; i++)
	{
		if(email == users[i].email && pass == users[i].password)
		{
		corr = true;
		break;
		}
	}
	if(corr){
		res.render("index.ejs",{header, studentlist});
	}
	else{
		res.send(`
			<script>
				alert("Invalid Login. Account does not exist.");		
				window.location.href = "/";
			</script>
			`);
	}
});

app.get("/studentlist", (req, res) => {
    let filteredStudentList = [];
    const searchTerm = req.query.search;
    if (searchTerm) {
        const index = studentlist.findIndex(student =>
            student.idno.includes(searchTerm) ||
            student.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.level.toString().includes(searchTerm)
        );
        if (index !== -1) {
            filteredStudentList.push(studentlist[index]);
        }
    } else {
        filteredStudentList = studentlist;
    }

    res.render("index.ejs", {
        header,
        studentlist: filteredStudentList
    });
});


app.get("/deletestudent",(req,res)=>{
	let idno = req.query.idno;
	let index = req.query.index;
	//program to remove an item from the array
	console.log("Deleting Student idno :"+idno);
	studentlist.splice(index,1);
	res.redirect("/studentlist");
});



app.post("/save",(req,res)=>{
	let idno = req.body.idno;
	let lastname = req.body.lastname;
	let firstname = req.body.firstname;
	let course = req.body.course;
	let level = req.body.level;
	let flag = req.body.flag;
	let index = req.body.index;
	if(flag==0){
		studentlist.push({
			idno:idno,
			lastname:lastname,
			firstname:firstname,
			course:course,
			level:level 
		});
	}
	else{
		// Update existing student
		studentlist[index].idno = idno;
		studentlist[index].lastname = lastname;
		studentlist[index].firstname = firstname;
		studentlist[index].course = course;
		studentlist[index].level = level;
	}
	res.redirect("/studentlist");
});


app.get("/logout",(req,res) => {
res.redirect("/");
});

app.get("/studentlist",(req,res) => {
res.render("index.ejs",{header, studentlist})
});

app.get("/",(req,res)=>{
	let name = "dennis durano";
	res.render("login.ejs",{users})
});

app.listen("4321",()=>{
	console.log("listening at port 4321");
});
