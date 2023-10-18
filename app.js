const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js")
const mongoose = require("mongoose");
var _ = require('lodash');

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

// const items = ["Get Up", "Take a shower", "Eat food"];
// const workItems = ["Morning Meeting", "Open Emails"];

const itemSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "Get Up"
});

const item2 = new Item({
    name: "Take a shower"
});

const item3 = new Item({
    name: "Eat food"
});

const defaultItems = [item1, item2, item3];

const listSchema= {
    name: String,
    items: [itemSchema]
}

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res){

    const day = date.getDate();

    async function findItem(){
        const items = await Item.find({});
        
        if(items.length === 0){
            Item.insertMany(defaultItems);
            res.redirect("/");
        }
        else{
            res.render("list", {
                listTitle: day,
                // newItemsList: items  
                newItemsList: items
            });
        }

        // items.forEach(function(i){
        //     console.log(i.name);
        // });
    };
    
    findItem();

    // EJS function .
    // res.render("list", {
    //     listTitle: day,
    //     // newItemsList: items  
    //     newItemsList: defaultItems
    // });

});

// app.get("/work", function(req, res){

//     res.render("list", {
//         listTitle: "Work",
//         newItemsList: workItems
//     })
// });

app.get("/:customListName", function(req,res){
    const customListName = _.capitalize(req.params.customListName);

    async function findList(){
        const foundList = await List.findOne({name: customListName});
        if(!foundList){
            // List/page doesnt exist yet, create new one
            const list = new List({
                name: customListName,
                items: defaultItems
            });
            list.save(); 
            res.redirect("/" +customListName);
        }
        else{
            // List/page already exists, so no need to create new page and default items
            res.render("list", {
                listTitle: foundList.name, 
                newItemsList: foundList.items
            });
        }
    }

    findList();

});

app.post("/", function(req, res){
    const itemName = req.body.newItem;
    const listName = req.body.button;

    // if(req.body.button === "Work"){
    //     workItems.push(itemName);
    //     res.redirect("/work");
    // }
    // else{
    //     items.push(itemName);
    //     res.redirect("/");
    // }

    const item = new Item({
        name: itemName
    });

    const day = date.getDate();

    if(listName === day){
        item.save();
        res.redirect("/");
    }
    else{
        async function findList(){
            const foundList = await List.findOne({name: listName});
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" +listName);
        }
        findList();
    }
});

// app.post("/work", function(req, res){
//     const workItem = req.body.newItem;
//     workItems.push(workItem);

//     res.redirect("/work");
// });

app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    
    const day = date.getDate();

    if(listName === day){
        async function deleteItemById(){
            const deleteItem = await Item.findByIdAndRemove(checkedItemId);
        }
        deleteItemById();
        res.redirect("/");
    }
    else{
        async function findAndUpdate(){
            const foundList = await List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}});
            res.redirect("/" +listName);
        }
        findAndUpdate();
    }

    
});

app.listen( 3000);