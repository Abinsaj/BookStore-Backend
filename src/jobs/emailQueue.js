import {Queue} from 'bullmq';
import connection from '../config/redisConfig.js'

export const emailQueue = new Queue('emailQueue', { connection })