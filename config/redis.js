const redis = require('redis');
const dotenv = require('dotenv');
dotenv.config();

const redisClient = redis.createClient({
    username: "default",
    password: process.env.redis_password,
    socket: {
        host: process.env.redis_url,
        port: process.env.redis_port
    },
    // legacyMode: true
});

async function connectRedis() {
    try {
        await redisClient.connect();
        console.log("Redis Connected");
    } catch (error) {
        console.log(error.message);
    }
}

connectRedis

module.exports = { connectRedis, redisClient };
