import Express from "express";
import bodyParser from "body-parser";
import connectDB from "./db/connectDB.js";
import itemSchema from "./models/itemSchema.js";
import { model } from "mongoose";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = Express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(Express.static("public"));


const DATABASE_URI = process.env.DATABASE_URI || "mongodb://localhost:27017";

const connectionOptions = JSON.parse(process.env.MONGODB_OPTIONS || {
    dbName: 'todokeeperDB',
});

// Connect to MongoDB 
connectDB(DATABASE_URI, connectionOptions);
  
const HomeItem = new model("homeItem", itemSchema);
const WorkItem = new model("workItem", itemSchema);


app.get("/", async (req, res) => {
    
    try{
        const homeList = await HomeItem.find();
        // console.log(homeList);
        const data = {
            name: "home",
            list: homeList,
            heading: "Today"
        };
        res.render("index.ejs", data);
    }catch(error){
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
    
});

app.get("/work", async (req, res) => {

    try{
        const workList = await WorkItem.find();
        // console.log(workList);
        const data = {
            name: "work",
            list: workList,
            heading: "Work"
        };
        res.render("index.ejs", data);
        
    }catch(error){
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post("/addItem", async (req, res) => {
    const name = Object.keys(req.body)[1];
    const newItem = req.body["newItem"];

    try{
        if (name === "home") {
            const item = HomeItem({ name: newItem });
            const result = await item.save();
            console.log(result);
            res.redirect("/");
        } else {
            const item = WorkItem({ name: newItem });
            const result = await item.save();
            console.log(result);
            res.redirect("/work");
        }
    }catch(error){
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
    
});

app.post("/itemDone", async (req, res) => {

    console.log(req.body);
    const name = req.body["name"];

    let isDone = false;
    if (req.body.isDone) {
        isDone = req.body.isDone === "on";
    }

    const itemId = req.body["itemId"];

    if (name === "home") {

        try {
            const updateData = { "isDone": isDone };

            // Find the item by its ID and update it using $set operator to update specific fields
            const updatedItem = await HomeItem.findByIdAndUpdate(itemId, { $set: updateData }, { new: true });

            if (!updatedItem) {
                return res.status(404).json({ message: 'Item not found' });
            }

            res.redirect("/");
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

    } else {
        try {
            const updateData = { "isDone": isDone };

            // Find the item by its ID and update it using $set operator to update specific fields
            const updatedItem = await WorkItem.findByIdAndUpdate(itemId, { $set: updateData }, { new: true });

            if (!updatedItem) {
                return res.status(404).json({ message: 'Item not found' });
            }

            res.redirect("/work");
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

    }
});

app.post("/deleteItem", async (req, res) => {
    const name = req.body["name"];
    const itemId = req.body["itemId"];

    if (name === "home") {
        try {
            const deleteItem = await HomeItem.findByIdAndRemove(itemId);

            if (!deleteItem) {
                return res.status(500).json({ message: "Item not found" });
            }
            res.redirect("/");
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }


    } else {
        try {
            const deleteItem = await WorkItem.findByIdAndRemove(itemId);

            if (!deleteItem) {
                return res.status(500).json({ message: "Item not found" });
            }
            res.redirect("/work");
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
});


// Start the Express server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}...`);
});