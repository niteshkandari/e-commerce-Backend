import express from 'express';

const app = express();

app.use("/api/test",(req, res, next) => {
  res.status(200).json({message:"hello!"});
})

export default app;
