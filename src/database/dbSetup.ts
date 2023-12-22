import * as mongoose from 'mongoose'

export const mongoSetup = async () => {
     console.log("Đang kết nối với database...");

     await mongoose.connect(configure.MONGO, {
          dbName: "Levels",
     })
          .then(() => console.log("✅ Đã kết nối thành công với database!"))
          .catch((error) => {
               console.error("There was an error when connect to database: ", error);
               process.exit(1);
          })
}
