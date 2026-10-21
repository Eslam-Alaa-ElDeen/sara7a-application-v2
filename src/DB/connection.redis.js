import { createClient } from "redis";
import { UPSTASH_REDIS_REST_URL } from "../../config/config.service.js";

export const redis_client = createClient({
    url: UPSTASH_REDIS_REST_URL
});

export const connectionRedis=async()=>{
    try {
        await redis_client.connect()
        console.log("redis connected successfully");
    } catch (error) {
        console.log("redis connected failed");
    }
}
