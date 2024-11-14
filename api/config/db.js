
import mongoose from 'mongoose';


function connectDB(){
    const database_url = process.env.DATABASE_URI_DEV
    mongoose.connect(database_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });


    mongoose.connection.once('open', ()=>{
        console.log("Database connected");
    }).on('error', () => {
        console.log('connection failed');
    });
}

export default connectDB ;