
import dotenv from 'dotenv';
dotenv.config();
export default function() {
    return {
      env: process.env
    };
  };