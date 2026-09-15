import app from "../src/app";
import connectDB from "../src/config/db";

const handler = async (req: any, res: any) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("❌ MongoDB connection failed in Vercel function");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
};

export default handler;